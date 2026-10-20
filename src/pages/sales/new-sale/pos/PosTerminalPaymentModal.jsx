import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, CreditCard, XCircle } from 'lucide-react'
import thousandDivider from '@utils/thousandDivider'
import {
  TERMINAL_STATE,
  terminalCancel,
  terminalOperation,
  terminalPay,
  terminalPaymentPayload,
  terminalRefund,
  waitForTerminalOperation,
} from '@utils/paymentTerminal'
import './PosLayout.css'

// How long the approved tick stays up before the sale is submitted, so the
// cashier actually sees that the card went through.
const APPROVED_HOLD_MS = 1200

// What the till was last asking the terminal to do, kept where a reload cannot
// lose it. Without this, a POS that restarts mid-payment has no idea an
// operation is outstanding and would cheerfully charge the card a second time.
const PENDING_KEY = 'pos_terminal_pending'

function readPending() {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writePending(value) {
  try {
    if (value) localStorage.setItem(PENDING_KEY, JSON.stringify(value))
    else localStorage.removeItem(PENDING_KEY)
  } catch {
    // A till with storage disabled loses only the recovery hint.
  }
}

/**
 * crypto.randomUUID needs a secure context, which the packaged POS always has
 * (app://) but a dev build served over plain http on a LAN address does not.
 */
function newOrderId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/**
 * PosTerminalPaymentModal
 *
 * Owns a card payment from end to end, in the same place in the flow that
 * PosMunisQrModal owns a QR payment: the sale is only submitted once this
 * reports success.
 *
 *  1. Mint an order_id and ask the agent to charge the card (or refund it).
 *  2. Poll while the customer taps and types their PIN.
 *  3. Approved  → hold the tick, hand the result back for the sale to be submitted.
 *     Declined  → nothing was charged; offer a retry or let the cashier switch tender.
 *     Failed    → the outcome is UNKNOWN. Say so, and do not offer a quiet retry.
 *
 * The cart is never touched on failure, so the cashier can always fall back to
 * the old flow — charge on the terminal by hand and enter the tender.
 */
function PosTerminalPaymentModal({
  open,
  mode = 'pay', // 'pay' | 'refund'
  saleId,
  amount,
  scheme = '', // 'uzcard' | 'humo' — selects the ARCUS configuration
  refundOrderId, // the ORIGINAL payment's order_id, for mode='refund'
  // The rest of what addresses a reversal, read off the original payment. Which
  // of these is required depends on the driver: Rahmat reverses by order_id,
  // ARCUS by the receipt number the terminal printed (and with the auth code,
  // without the customer's card at all). All are sent; the agent picks.
  refundReceiptNo = '',
  refundAuthCode = '',
  onDone,
  onCancel,
  t,
}) {
  const [status, setStatus] = useState('starting') // starting | running | approved | declined | failed | unresolved
  const [operation, setOperation] = useState(null)
  const [message, setMessage] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [cancelling, setCancelling] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const onDoneRef = useRef(onDone)
  const doneFiredRef = useRef(false)

  // PosApp redefines its callbacks every render; keeping the latest in a ref
  // stops the approved-hold effect below from being torn down mid-hold.
  useEffect(() => {
    onDoneRef.current = onDone
  })

  const isRefund = mode === 'refund'

  const finish = useCallback(
    (op) => {
      writePending(null)
      onDoneRef.current?.(terminalPaymentPayload(op, { parentOrderId: isRefund ? refundOrderId : '' }))
    },
    [isRefund, refundOrderId],
  )

  // Drive one operation: resume an outstanding one if there is one, otherwise
  // start a new one, then poll until the terminal answers.
  useEffect(() => {
    if (!open) return undefined
    let stopped = false
    const shouldStop = () => stopped

    // Resolve a finished operation into a screen state.
    const settle = (op) => {
      setOperation(op)
      if (op.state === TERMINAL_STATE.APPROVED) {
        setStatus('approved')
        return
      }
      writePending(null)
      if (op.state === TERMINAL_STATE.DECLINED) {
        setStatus('declined')
        setMessage(op.desc_ru || op.desc_uz || t('pos.terminal.declined'))
        return
      }
      setStatus('failed')
      setMessage(op.error || op.desc_ru || t('pos.terminal.unknown_desc'))
    }

    const run = async () => {
      setMessage('')
      setElapsed(0)
      setCancelling(false)
      doneFiredRef.current = false

      // The agent keys its single slot by operation_id. Held locally rather
      // than in state: the poll below has to compare against the operation we
      // actually started, and a state value read from this closure would still
      // be the one from before the effect ran.
      let operationId = null

      const pending = readPending()

      // Recovery. An outstanding operation for this sale means the POS died or
      // reloaded while the customer's card was in the terminal.
      if (pending?.saleId === saleId && pending?.mode === mode && attempt === 0) {
        setStatus('running')
        let recovered = null
        try {
          recovered = await terminalOperation()
        } catch {
          recovered = null
        }
        if (stopped) return

        if (recovered?.order_id === pending.orderId) {
          operationId = recovered.operation_id || null
          setOperation(recovered)
          if (recovered.state && recovered.state !== TERMINAL_STATE.PENDING) {
            settle(recovered)
            return
          }
          // Still running — resume the poll below without charging again.
        } else {
          // The agent no longer knows about it (it restarted, or the terminal
          // was replugged). We cannot tell whether the card was charged, so we
          // refuse to decide: the cashier reads the terminal and chooses.
          writePending(null)
          setStatus('unresolved')
          setMessage(t('pos.terminal.unfinished_desc'))
          return
        }
      }

      if (!operationId) {
        const orderId = newOrderId()
        writePending({ orderId, saleId, mode, amount, at: Date.now() })
        setStatus('starting')
        try {
          const started = isRefund
            ? await terminalRefund({
                orderId: refundOrderId,
                receiptNo: refundReceiptNo,
                authCode: refundAuthCode,
                amount,
                scheme,
              })
            : await terminalPay({ orderId, amount, scheme })
          if (stopped) return
          operationId = started?.operation_id || null
          setOperation(started)
          setStatus('running')
        } catch (e) {
          if (stopped) return
          // Nothing reached the terminal, so nothing was charged. This is the
          // "no terminal on this till" / "terminal busy" case.
          writePending(null)
          setStatus('declined')
          setMessage(e?.response?.data?.message || e?.message || t('pos.terminal.unavailable'))
          return
        }
      }

      const finished = await waitForTerminalOperation({
        operationId,
        onTick: (op) => {
          if (!stopped) setOperation(op)
        },
        shouldStop,
      })
      if (stopped || !finished) return
      settle(finished)
    }

    run()
    return () => {
      stopped = true
    }
    // scheme and the two refund-basis props are deliberately NOT dependencies:
    // they are fixed for a given sale, and a re-run of this effect starts a
    // second card operation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, saleId, mode, amount, refundOrderId, attempt])

  // A running clock, because a cashier watching a frozen screen starts pressing things.
  useEffect(() => {
    if (!open || status !== 'running') return undefined
    const started = Date.now()
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000)
    return () => clearInterval(timer)
  }, [open, status])

  // Hold the tick, then hand the result to the sale.
  //
  // finish() also runs on cleanup rather than only on the timer: the card has
  // already been charged, so the result must not be dropped because the effect
  // was torn down early. Same reasoning as the Munis modal's paid hold.
  useEffect(() => {
    if (!open || status !== 'approved' || !operation) return undefined
    const fire = () => {
      if (doneFiredRef.current) return
      doneFiredRef.current = true
      finish(operation)
    }
    const timer = setTimeout(fire, APPROVED_HOLD_MS)
    return () => {
      clearTimeout(timer)
      fire()
    }
  }, [open, status, operation, finish])

  const handleCancel = async () => {
    if (status !== 'running' && status !== 'starting') {
      writePending(null)
      onCancel?.()
      return
    }
    // Ask the terminal to abandon the operation, but keep the modal open: the
    // terminal still answers for itself, and that answer is the outcome.
    setCancelling(true)
    const res = await terminalCancel()
    if (!res.ok) {
      setCancelling(false)
      setMessage(res.message)
    }
  }

  if (!open) return null

  const title = isRefund ? t('pos.terminal.refund_title') : t('pos.terminal.title')

  return (
    <div className='pos-modal-overlay' role='dialog' aria-modal='true'>
      <div className='pos-app-scan-modal'>
        <div className='pos-app-scan-title'>{title}</div>

        <div className='pos-app-scan-payment-row'>
          <span className='pos-app-scan-payment-label'>{t('pos.total_compact')}</span>
          <span className='pos-app-scan-payment-name'>
            {thousandDivider(Number(amount), t('pos.currency_short'))}
          </span>
        </div>

        {status === 'starting' && <div className='pos-app-scan-desc'>{t('pos.terminal.starting')}</div>}

        {status === 'running' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '18px 0',
            }}
          >
            <CreditCard size={64} strokeWidth={2} />
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t('pos.terminal.follow')}</div>
            <div className='pos-app-scan-desc' style={{ fontSize: 13, opacity: 0.7 }}>
              {cancelling ? t('pos.terminal.cancelling') : `${elapsed} ${t('pos.terminal.seconds_short')}`}
            </div>
          </div>
        )}

        {status === 'approved' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '20px 0',
              color: '#1e9e52',
            }}
          >
            <CheckCircle2 size={72} strokeWidth={2.5} />
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {isRefund ? t('pos.terminal.refunded') : t('pos.terminal.approved')}
            </div>
            {(operation?.card_pan || operation?.receipt_no) && (
              <div className='pos-app-scan-desc' style={{ fontSize: 13, opacity: 0.7, textAlign: 'center' }}>
                {operation.card_pan}
                {operation.rrn ? ` · RRN ${operation.rrn}` : ''}
                {/* The receipt number and the authorisation code are what a
                    reversal is addressed by on ARCUS. They are printed on the
                    terminal's own slip, and showing them here is what lets a
                    cashier read one back to support without digging the paper
                    out of the bin. */}
                {operation.receipt_no ? (
                  <>
                    <br />
                    {t('pos.terminal.receipt_no')}: {operation.receipt_no}
                    {operation.auth_code ? ` · ${t('pos.terminal.auth_code')}: ${operation.auth_code}` : ''}
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}

        {status === 'declined' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '18px 0',
              color: '#e23a32',
            }}
          >
            <XCircle size={64} strokeWidth={2.5} />
            <div style={{ fontSize: 17, fontWeight: 700 }}>{t('pos.terminal.declined')}</div>
            {message && (
              <div className='pos-app-scan-desc' style={{ fontSize: 13 }}>
                {message}
              </div>
            )}
          </div>
        )}

        {(status === 'failed' || status === 'unresolved') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '18px 0',
              color: '#c77700',
            }}
          >
            <AlertTriangle size={64} strokeWidth={2.5} />
            <div style={{ fontSize: 17, fontWeight: 700 }}>
              {status === 'unresolved' ? t('pos.terminal.unfinished') : t('pos.terminal.unknown_title')}
            </div>
            {/* The one screen in the POS that must not be reassuring: the card
                may have been charged, and the terminal is the only authority. */}
            <div className='pos-app-scan-desc' style={{ fontSize: 13 }}>
              {message || t('pos.terminal.unknown_desc')}
            </div>
          </div>
        )}

        <div className='pos-security-actions'>
          <button
            type='button'
            onClick={handleCancel}
            disabled={cancelling}
            className='pos-security-btn-cancel'
          >
            {status === 'running' || status === 'starting'
              ? t('pos.terminal.cancel')
              : t('pos.security.cancel')}
          </button>
          {(status === 'declined' || status === 'failed' || status === 'unresolved') && (
            <button
              type='button'
              onClick={() => setAttempt((n) => n + 1)}
              className='pos-app-scan-btn-confirm'
            >
              {t('retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PosTerminalPaymentModal
