import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { get } from 'lodash'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import { mertechShowQrOnDevice, mertechShowPaymentResult, mertechClearScreen } from '@utils/mertechDisplay'
import './PosLayout.css'

const POLL_INTERVAL_MS = 3000

/**
 * PosMunisQrModal
 *
 * Munis (QR Online) payment flow:
 *  1. On open, generate a per-sale dynamic QR. The server returns the bill_number
 *     (the sale's sale_number) the payment must be looked up by.
 *  2. Render the QR for the customer to scan and pay.
 *  3. Poll payment status by that bill_number until it lands (Munis code === 0).
 *  4. Once paid, call onPaid() which finalizes the sale (server re-verifies).
 */
function PosMunisQrModal({ open, saleId, amount, onPaid, onCancel, t }) {
  const [status, setStatus] = useState('loading') // loading | waiting | paid | error
  const [qr, setQr] = useState('')
  const [billNumber, setBillNumber] = useState('') // Munis receipt/bill number to poll with
  const [errMsg, setErrMsg] = useState('')
  const [retryNonce, setRetryNonce] = useState(0)
  const paidHandledRef = useRef(false)
  const deviceQrShownRef = useRef(false) // QR is currently on the Mertech customer display

  // Generate the dynamic QR when the modal opens (or on retry)
  useEffect(() => {
    if (!open) return
    let cancelled = false
    paidHandledRef.current = false
    setStatus('loading')
    setQr('')
    setBillNumber('')
    setErrMsg('')

    requests
      .generateMunisQr({ sale_id: saleId, amount: Number(amount) })
      .then((res) => {
        if (cancelled) return
        const qrValue = get(res, 'data.data.qr', '')
        const bill = get(res, 'data.data.bill_number', '')
        if (!qrValue || !bill) {
          setStatus('error')
          setErrMsg(t('pos.munis.generate_failed'))
          return
        }
        setQr(qrValue)
        setBillNumber(String(bill))
        setStatus('waiting')
      })
      .catch((e) => {
        if (cancelled) return
        setStatus('error')
        setErrMsg(
          get(e, 'response.data.data') ||
            get(e, 'response.data.message') ||
            t('pos.munis.generate_failed'),
        )
      })

    return () => {
      cancelled = true
    }
  }, [open, saleId, amount, retryNonce])

  // The modal stays mounted between sales, so clear the finished sale's state
  // on close — a leftover status === 'paid' would otherwise auto-fire onPaid()
  // the moment the modal reopens for the next sale (the paid-finalize effect
  // re-runs on onPaid identity changes and sees the stale status before the
  // new QR's setStatus lands), finalizing it with no QR shown and no payment.
  useEffect(() => {
    if (open) return
    setStatus('loading')
    setQr('')
    setBillNumber('')
    setErrMsg('')
  }, [open])

  // Poll for payment while waiting
  useEffect(() => {
    if (!open || status !== 'waiting' || !billNumber) return
    let stopped = false

    const poll = async () => {
      try {
        const res = await requests.getMunisPayment({ bill_number: billNumber })
        const code = get(res, 'data.data.code')
        if (!stopped && code === 0) {
          setStatus('paid')
        }
      } catch {
        // ignore transient poll errors; keep polling
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS)
    poll() // immediate first check
    return () => {
      stopped = true
      clearInterval(interval)
    }
  }, [open, status, billNumber])

  // Mirror the QR onto the Mertech customer display (best effort — the sale
  // never depends on the device; see @utils/mertechDisplay).
  useEffect(() => {
    if (!open || status !== 'waiting' || !qr) return
    deviceQrShownRef.current = mertechShowQrOnDevice(qr)
  }, [open, status, qr])

  // Once paid, finalize the sale (server re-verifies). Guard against double-calls.
  useEffect(() => {
    if (open && status === 'paid' && !paidHandledRef.current) {
      paidHandledRef.current = true
      if (deviceQrShownRef.current) {
        deviceQrShownRef.current = false
        mertechShowPaymentResult()
      }
      onPaid?.()
    }
  }, [open, status, onPaid])

  // Closed/cancelled while the QR is still on the device — clear it
  useEffect(() => {
    if (open || !deviceQrShownRef.current) return
    deviceQrShownRef.current = false
    mertechClearScreen()
  }, [open])

  // Same on unmount
  useEffect(
    () => () => {
      if (deviceQrShownRef.current) mertechClearScreen()
    },
    [],
  )

  if (!open) return null

  return (
    <div className='pos-modal-overlay' role='dialog' aria-modal='true'>
      <div className='pos-app-scan-modal'>
        <div className='pos-app-scan-title'>UzQR</div>

        <div className='pos-app-scan-payment-row'>
          <span className='pos-app-scan-payment-label'>{t('pos.total_compact')}</span>
          <span className='pos-app-scan-payment-name'>{thousandDivider(Number(amount), t('pos.currency_short'))}</span>
        </div>

        {status === 'loading' && (
          <div className='pos-app-scan-desc'>{t('pos.munis.generating')}</div>
        )}

        {status === 'waiting' && (
          <>
            <div className='pos-app-scan-desc'>
              {t('pos.munis.scan_to_pay')}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: 12,
                background: '#fff',
                borderRadius: 12,
                margin: '10px auto',
              }}
            >
              <QRCodeCanvas value={qr} size={240} includeMargin />
            </div>
            <div className='pos-app-scan-desc' style={{ fontSize: 13, opacity: 0.7 }}>
              {t('pos.munis.waiting')}
            </div>
          </>
        )}

        {status === 'paid' && (
          <div className='pos-app-scan-desc' style={{ color: '#1e9e52', fontWeight: 700 }}>
            ✓ {t('pos.munis.paid')}
          </div>
        )}

        {status === 'error' && <div className='pos-app-scan-desc' style={{ color: '#e23a32' }}>{errMsg}</div>}

        <div className='pos-security-actions'>
          <button type='button' onClick={onCancel} className='pos-security-btn-cancel'>
            {t('pos.security.cancel')}
          </button>
          {status === 'error' && (
            <button
              type='button'
              onClick={() => setRetryNonce((n) => n + 1)}
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

export default PosMunisQrModal
