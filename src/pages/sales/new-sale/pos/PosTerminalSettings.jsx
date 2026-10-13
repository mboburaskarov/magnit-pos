import { useEffect, useState } from 'react'
import { CreditCard, RefreshCw, Receipt, Search } from 'lucide-react'
import { success, error } from '@utils/toast'
import {
  TERMINAL_STATE,
  terminalInfo,
  terminalReconciliation,
  waitForTerminalOperation,
} from '@utils/paymentTerminal'

const buttonStyle = {
  flex: 1,
  height: '48px',
  borderRadius: '8px',
  border: '1px solid #111217',
  color: '#111217',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '600',
}

/**
 * Bank payment terminal — status panel in the devices settings modal.
 *
 * Nothing is configured from here: the local device agent finds the terminal
 * on its USB port and the payment screen uses it automatically. This answers
 * the two questions worth asking while setting a cashbox up — "is it detected"
 * and "does it answer" — plus «Сверка итогов» on demand, which is otherwise
 * only run at shift close.
 */
export default function PosTerminalSettings({ t }) {
  const [info, setInfo] = useState(null) // the agent's report, or null when unreachable
  const [isChecking, setIsChecking] = useState(true)
  const [isProbing, setIsProbing] = useState(false)
  const [isReconciling, setIsReconciling] = useState(false)

  const refresh = async ({ probe = false } = {}) => {
    if (probe) setIsProbing(true)
    else setIsChecking(true)
    setInfo(await terminalInfo({ probe }))
    setIsProbing(false)
    setIsChecking(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReconciliation = async () => {
    setIsReconciling(true)
    try {
      const started = await terminalReconciliation()
      const finished = await waitForTerminalOperation({ operationId: started?.operation_id })
      if (finished?.state === TERMINAL_STATE.APPROVED) {
        success(finished.desc_ru || t('pos.terminal.reconciliation_done'))
      } else {
        error(finished?.desc_ru || finished?.error || t('pos.terminal.reconciliation_failed'))
      }
    } catch (e) {
      error(e?.response?.data?.message || e?.message || t('pos.terminal.unavailable'))
    }
    setIsReconciling(false)
  }

  const detected = Boolean(info?.detected)
  const statusText = isChecking
    ? t('pos.terminal.checking')
    : !info
      ? t('pos.terminal.agent_unreachable')
      : detected
        ? t('pos.terminal.detected', { port: info.port })
        : info.message || t('pos.terminal.not_detected')

  return (
    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          className='touch-modal-avatar'
          style={{
            backgroundColor: detected ? 'rgba(30, 158, 82, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: detected ? '#1e9e52' : '#6f6f6f',
          }}
        >
          <CreditCard size={20} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#111217' }}>
            {t('pos.terminal.settings_title')}
          </div>
          <div style={{ fontSize: '12px', color: '#6f6f6f', marginTop: '2px' }}>
            {t('pos.terminal.settings_subtitle')}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          backgroundColor: isChecking ? '#f4f4f5' : detected ? '#e9f8ef' : '#fdecec',
          color: isChecking ? '#6f6f6f' : detected ? '#1e9e52' : '#e23a32',
        }}
      >
        {statusText}
      </div>

      <div style={{ fontSize: '12px', color: '#6f6f6f' }}>{t('pos.terminal.setup_hint')}</div>

      {/* With nothing detected, what the machine actually offers is the whole
          diagnosis: an empty list means integration mode is not running on the
          terminal, while a listed port means it is there but unrecognised. */}
      {!isChecking && info && !detected && Array.isArray(info.ports) && (
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '12px',
            color: '#374151',
            maxHeight: '160px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>{t('pos.terminal.ports_seen')}</div>
          {info.ports.length === 0 ? (
            <div style={{ color: '#e23a32' }}>{t('pos.terminal.no_ports')}</div>
          ) : (
            info.ports.map((p) => (
              <div key={p.port} style={{ fontFamily: 'monospace', lineHeight: 1.6 }}>
                {p.port}
                {p.isUsb ? ` — USB ${p.vid || '?'}:${p.pid || '?'}` : ' — non-USB'}
                {p.product ? ` — ${p.product}` : ''}
                {p.probe ? ` — ${p.probe}` : ''}
              </div>
            ))
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type='button' className='btn-secondary-touch' style={buttonStyle} onClick={() => refresh()} disabled={isChecking}>
          <RefreshCw size={16} />
          {isChecking ? t('pos.terminal.checking') : t('pos.terminal.check')}
        </button>
        {/* Probing writes to every serial port, so it is a deliberate button
            rather than something the status read does on its own. */}
        <button
          type='button'
          className='btn-secondary-touch'
          style={buttonStyle}
          onClick={() => refresh({ probe: true })}
          disabled={isProbing}
        >
          <Search size={16} />
          {isProbing ? t('pos.terminal.probing') : t('pos.terminal.probe')}
        </button>
        <button
          type='button'
          className='btn-secondary-touch'
          style={buttonStyle}
          onClick={handleReconciliation}
          disabled={isReconciling || !detected}
        >
          <Receipt size={16} />
          {isReconciling ? t('pos.terminal.reconciling') : t('pos.terminal.reconciliation')}
        </button>
      </div>
    </div>
  )
}
