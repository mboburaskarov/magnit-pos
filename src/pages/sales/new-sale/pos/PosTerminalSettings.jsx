import { useEffect, useState } from 'react'
import { CreditCard, RefreshCw, Receipt, Search, Plug } from 'lucide-react'
import { success, error } from '@utils/toast'
import {
  SCHEME_BY_PROVIDER,
  TERMINAL_PROVIDER,
  TERMINAL_PROVIDERS,
  TERMINAL_STATE,
  terminalProviderInfo,
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
 * One pinpad's status card.
 *
 * Each device answers for itself — it is detected, pinged, settled and
 * diagnosed on its own — so each card owns its own state rather than the panel
 * holding a map of everything.
 *
 * The card reshapes itself for the ARCUS driver, because the two have
 * different questions. A Rahmat terminal is found by walking the machine's
 * serial ports, so the useful diagnosis is a list of what is there. ARCUS is a
 * program installed on this machine that owns the port itself, so the question
 * is whether it is installed — and it offers something the serial driver cannot:
 * a documented, money-safe connection check (/o72) that asks the pinpad
 * directly whether it is answering.
 */
function TerminalDeviceCard({ provider, t }) {
  const [info, setInfo] = useState(null) // the agent's report, or null when unreachable
  const [isChecking, setIsChecking] = useState(true)
  const [isProbing, setIsProbing] = useState(false)
  const [isReconciling, setIsReconciling] = useState(false)
  const [isPinging, setIsPinging] = useState(false)

  const isArcus = provider === TERMINAL_PROVIDER.ARCUS
  const scheme = SCHEME_BY_PROVIDER[provider] || ''

  const refresh = async ({ probe = false, ping = false } = {}) => {
    if (probe) setIsProbing(true)
    else if (ping) setIsPinging(true)
    else setIsChecking(true)
    setInfo(await terminalProviderInfo({ provider, probe, ping }))
    setIsProbing(false)
    setIsPinging(false)
    setIsChecking(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReconciliation = async () => {
    setIsReconciling(true)
    try {
      const started = await terminalReconciliation({ provider, scheme })
      const finished = await waitForTerminalOperation({ operationId: started?.operation_id, provider })
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
  // Where the terminal was found. On ARCUS that is a directory rather than a
  // port — ARCUS holds the port, we hold ARCUS.
  const location = info?.port || info?.dir || ''
  const statusText = isChecking
    ? t('pos.terminal.checking')
    : !info
      ? t('pos.terminal.agent_unreachable')
      : detected
        ? t('pos.terminal.detected', { port: location })
        : info.message || t('pos.terminal.not_detected')

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Which tender this box serves, said in the cashier's own terms: the
          device names mean nothing at the till, but "Uzcard" and "Humo" are
          the two buttons they press all day. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          className='touch-modal-avatar'
          style={{
            backgroundColor: detected ? 'rgba(30, 158, 82, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: detected ? '#1e9e52' : '#6f6f6f',
          }}
        >
          <CreditCard size={20} />
        </div>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#111217' }}>
          {t(`pos.terminal.device_${provider}`)}
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

      <div style={{ fontSize: '12px', color: '#6f6f6f' }}>
        {t(isArcus ? 'pos.terminal.setup_hint_arcus' : 'pos.terminal.setup_hint')}
      </div>

      {/* The pinpad's own answer to /o72, when it has been asked for. Separate
          from the status line above, which only says whether ARCUS is there. */}
      {isArcus && info?.ping && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            backgroundColor: info.ping.ok ? '#e9f8ef' : '#fdecec',
            color: info.ping.ok ? '#1e9e52' : '#e23a32',
          }}
        >
          {info.ping.message || (info.ping.ok ? t('pos.terminal.ping_ok') : t('pos.terminal.ping_failed'))}
          {info.ping.response_code ? ` (${info.ping.response_code})` : ''}
        </div>
      )}

      {isArcus && Array.isArray(info?.schemes) && info.schemes.length > 0 && (
        <div style={{ fontSize: '12px', color: '#374151' }}>
          {t('pos.terminal.schemes')}: <span style={{ fontFamily: 'monospace' }}>{info.schemes.join(', ')}</span>
        </div>
      )}

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
        {/* Two different second buttons, because the two drivers are asked
            different things. Probing writes a payment frame at every serial
            port on the machine, which is why it is a deliberate button and not
            part of the status read; the ARCUS connection check talks to the
            pinpad and so must not run on a loop either. */}
        {isArcus ? (
          <button
            type='button'
            className='btn-secondary-touch'
            style={buttonStyle}
            onClick={() => refresh({ ping: true })}
            disabled={isPinging || !detected}
          >
            <Plug size={16} />
            {isPinging ? t('pos.terminal.pinging') : t('pos.terminal.ping')}
          </button>
        ) : (
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
        )}
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

/**
 * Bank payment terminals — status panel in the devices settings modal.
 *
 * The till has two pinpads, one per card scheme, and each is set up and
 * checked separately — so each gets its own card. Nothing is configured from
 * here: the agent knows which drivers this till runs and the payment screen
 * routes to them automatically off the tender button. This answers the two
 * questions worth asking while setting a cashbox up — "is it detected" and
 * "does it answer" — plus «Сверка итогов» on demand, which is otherwise only
 * run at shift close.
 */
export default function PosTerminalSettings({ t }) {
  return (
    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111217' }}>
          {t('pos.terminal.settings_title')}
        </div>
        <div style={{ fontSize: '12px', color: '#6f6f6f', marginTop: '2px' }}>
          {t('pos.terminal.settings_subtitle')}
        </div>
      </div>

      {TERMINAL_PROVIDERS.map((provider) => (
        <TerminalDeviceCard key={provider} provider={provider} t={t} />
      ))}
    </div>
  )
}
