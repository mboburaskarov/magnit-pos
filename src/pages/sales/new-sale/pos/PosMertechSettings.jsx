import { useEffect, useState } from 'react'
import { QrCode, RefreshCw, Eraser, Play } from 'lucide-react'
import { success, error } from '@utils/toast'
import { mertechDisplayInfo, mertechTestQr, mertechTestClear } from '@utils/mertechDisplay'

const TEST_QR_VALUE = 'https://magnit.uz'

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
 * Customer-facing Mertech SBP QR display — status panel in the devices settings
 * modal.
 *
 * There is nothing to configure here any more. The local device agent finds the
 * display by its USB vendor id and the POS mirrors the Munis QR onto it
 * automatically, so this section only answers "is it plugged in and working?"
 * — which is the question worth asking while setting a cashbox up.
 */
export default function PosMertechSettings({ t }) {
  const [info, setInfo] = useState(null) // agent's report, or null when unreachable
  const [isChecking, setIsChecking] = useState(true)
  const [isSendingQr, setIsSendingQr] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const refresh = async () => {
    setIsChecking(true)
    setInfo(await mertechDisplayInfo())
    setIsChecking(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleTestQr = async () => {
    setIsSendingQr(true)
    const res = await mertechTestQr(TEST_QR_VALUE)
    if (res.ok) success(t('pos.mertech.qr_sent'))
    else error(t('pos.mertech.command_failed'))
    setIsSendingQr(false)
  }

  const handleClearDisplay = async () => {
    setIsClearing(true)
    const res = await mertechTestClear()
    if (res.ok) success(t('pos.mertech.cleared'))
    else error(t('pos.mertech.command_failed'))
    setIsClearing(false)
  }

  const detected = Boolean(info?.detected)
  const statusText = isChecking
    ? t('pos.mertech.testing')
    : !info
      ? t('pos.mertech.agent_unreachable')
      : detected
        ? t('pos.mertech.detected', { port: info.port })
        : t('pos.mertech.not_detected')

  return (
    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          className='touch-modal-avatar'
          style={{
            backgroundColor: detected ? 'rgba(30, 158, 82, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: detected ? '#1e9e52' : '#6f6f6f',
          }}
        >
          <QrCode size={20} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#111217' }}>
            {t('pos.mertech.title')}
          </div>
          <div style={{ fontSize: '12px', color: '#6f6f6f', marginTop: '2px' }}>
            {t('pos.mertech.subtitle')}
          </div>
        </div>
      </div>

      {/* Detection status */}
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

      <div style={{ fontSize: '12px', color: '#6f6f6f' }}>{t('pos.mertech.auto_hint')}</div>

      {/* When nothing was detected, show what the machine actually offers — it
          is the difference between "no driver installed" (empty list) and
          "plugged in but unrecognised" (a port is listed). */}
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
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>{t('pos.mertech.ports_seen')}</div>
          {info.ports.length === 0 ? (
            <div style={{ color: '#e23a32' }}>{t('pos.mertech.no_ports')}</div>
          ) : (
            info.ports.map((p) => (
              <div key={p.port} style={{ fontFamily: 'monospace', lineHeight: 1.6 }}>
                {p.port}
                {p.isUsb ? ` — USB ${p.vid || '?'}:${p.pid || '?'}` : ' — non-USB'}
                {p.product ? ` — ${p.product}` : ''}
              </div>
            ))
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type='button' className='btn-secondary-touch' style={buttonStyle} onClick={refresh} disabled={isChecking}>
          <RefreshCw size={16} />
          {isChecking ? t('pos.mertech.testing') : t('pos.mertech.check')}
        </button>
        <button type='button' className='btn-secondary-touch' style={buttonStyle} onClick={handleTestQr} disabled={isSendingQr}>
          <Play size={16} />
          {t('pos.mertech.test_qr')}
        </button>
        <button type='button' className='btn-secondary-touch' style={buttonStyle} onClick={handleClearDisplay} disabled={isClearing}>
          <Eraser size={16} />
          {t('pos.mertech.clear_display')}
        </button>
      </div>
    </div>
  )
}
