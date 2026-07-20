import { useState } from 'react'
import { QrCode, Wifi, Eraser, Play } from 'lucide-react'
import { success, error } from '@utils/toast'
import {
  getMertechSettings,
  saveMertechSettings,
  mertechTestConnection,
  mertechCommand,
} from '@utils/mertechDisplay'

const TEST_QR_VALUE = 'https://magnit.uz'

const labelStyle = { fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }
const inputStyle = { width: '100%', height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid #d5d7e2', fontSize: '15px' }

function SwitchRow({ label, checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0' }}
    >
      <span style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>{label}</span>
      <span
        style={{
          width: '44px',
          height: '26px',
          borderRadius: '13px',
          backgroundColor: checked ? '#1e9e52' : '#d5d7e2',
          position: 'relative',
          flexShrink: 0,
          transition: 'background-color 0.2s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '21px' : '3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left 0.2s',
          }}
        />
      </span>
    </div>
  )
}

function NumberField({ label, value, onChange, placeholder }) {
  return (
    <div style={{ flex: 1 }}>
      <label className='form-label-touch' style={labelStyle}>{label}</label>
      <input
        type='number'
        className='pos-cashier-search-input'
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

/**
 * Customer-facing Mertech SBP QR display configuration, rendered as a section
 * of the printer/devices settings modal. Settings persist in localStorage
 * (see @utils/mertechDisplay) and are read by the Munis payment modal.
 */
export default function PosMertechSettings({ t }) {
  const [draft, setDraft] = useState(getMertechSettings)
  const [isTesting, setIsTesting] = useState(false)
  const [isSendingQr, setIsSendingQr] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [testResult, setTestResult] = useState(null) // { ok, version, opaque } | { ok: false }

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  // Test buttons use the unsaved form values so the cashier can verify before saving
  const draftOverrides = () => ({
    ...draft,
    timeoutMs: Number(draft.timeoutMs) || 3000,
    enabled: true,
  })

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    const res = await mertechTestConnection(draftOverrides())
    setTestResult(res)
    setIsTesting(false)
  }

  const handleTestQr = async () => {
    setIsSendingQr(true)
    try {
      await mertechCommand('/showInfoQR', { infoQR: TEST_QR_VALUE }, draftOverrides())
      success(t('pos.mertech.qr_sent', { defaultValue: 'QR отправлен на дисплей' }))
    } catch (e) {
      error(t('pos.mertech.command_failed', { defaultValue: 'Не удалось отправить команду на дисплей' }))
    } finally {
      setIsSendingQr(false)
    }
  }

  const handleClearDisplay = async () => {
    setIsClearing(true)
    try {
      await mertechCommand('/clearScreen', {}, draftOverrides())
      success(t('pos.mertech.cleared', { defaultValue: 'Дисплей очищен' }))
    } catch (e) {
      error(t('pos.mertech.command_failed', { defaultValue: 'Не удалось отправить команду на дисплей' }))
    } finally {
      setIsClearing(false)
    }
  }

  const handleSave = () => {
    saveMertechSettings({
      ...draft,
      timeoutMs: Number(draft.timeoutMs) || 3000,
      paidStatusCode: Number(draft.paidStatusCode) || 0,
      clearAfterPaidMs: Math.max(0, Number(draft.clearAfterPaidMs) || 0),
    })
    success(t('pos.mertech.saved', { defaultValue: 'Настройки дисплея сохранены' }))
  }

  return (
    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          className='touch-modal-avatar'
          style={{ backgroundColor: draft.enabled ? 'rgba(30, 158, 82, 0.1)' : 'rgba(0, 0, 0, 0.05)', color: draft.enabled ? '#1e9e52' : '#6f6f6f' }}
        >
          <QrCode size={20} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#111217' }}>
            {t('pos.mertech.title', { defaultValue: 'QR-дисплей Mertech (СБП)' })}
          </div>
          <div style={{ fontSize: '12px', color: '#6f6f6f', marginTop: '2px' }}>
            {t('pos.mertech.subtitle', { defaultValue: 'Дисплей покупателя для оплаты по QR (Munis)' })}
          </div>
        </div>
      </div>

      <SwitchRow
        label={t('pos.mertech.enable', { defaultValue: 'Отправлять QR оплаты на дисплей покупателя' })}
        checked={!!draft.enabled}
        onChange={(v) => set({ enabled: v })}
      />

      <div>
        <label className='form-label-touch' style={labelStyle}>
          {t('pos.mertech.driver_url', { defaultValue: 'Адрес драйвера Mertech' })}
        </label>
        <input
          type='text'
          className='pos-cashier-search-input'
          style={inputStyle}
          placeholder='http://localhost:1234'
          value={draft.baseUrl}
          onChange={(e) => set({ baseUrl: e.target.value })}
        />
      </div>

      {/* Connection test result */}
      {testResult && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            backgroundColor: testResult.ok ? (testResult.opaque ? '#fff7e6' : '#e9f8ef') : '#fdecec',
            color: testResult.ok ? (testResult.opaque ? '#b45309' : '#1e9e52') : '#e23a32',
          }}
        >
          {!testResult.ok
            ? t('pos.mertech.connect_failed', { defaultValue: 'Драйвер недоступен' })
            : testResult.opaque
              ? t('pos.mertech.connected_opaque', { defaultValue: 'Драйвер отвечает (без CORS — ответы не читаются)' })
              : testResult.version
                ? t('pos.mertech.connected_version', { defaultValue: 'Драйвер доступен, версия {{version}}', version: testResult.version })
                : t('pos.mertech.connected', { defaultValue: 'Драйвер доступен' })}
        </div>
      )}

      {/* Test actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type='button'
          className='btn-secondary-touch'
          style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #111217', color: '#111217', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
          onClick={handleTestConnection}
          disabled={isTesting}
        >
          <Wifi size={16} />
          {isTesting
            ? t('pos.mertech.testing', { defaultValue: 'Проверка…' })
            : t('pos.mertech.test_connection', { defaultValue: 'Проверить связь' })}
        </button>
        <button
          type='button'
          className='btn-secondary-touch'
          style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #111217', color: '#111217', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
          onClick={handleTestQr}
          disabled={isSendingQr}
        >
          <Play size={16} />
          {t('pos.mertech.test_qr', { defaultValue: 'Тестовый QR' })}
        </button>
        <button
          type='button'
          className='btn-secondary-touch'
          style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #111217', color: '#111217', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
          onClick={handleClearDisplay}
          disabled={isClearing}
        >
          <Eraser size={16} />
          {t('pos.mertech.clear_display', { defaultValue: 'Очистить дисплей' })}
        </button>
      </div>

      {/* Behaviour options */}
      <SwitchRow
        label={t('pos.mertech.show_status_option', { defaultValue: 'Показывать статус «Оплачено» на дисплее' })}
        checked={!!draft.showStatusOnDevice}
        onChange={(v) => set({ showStatusOnDevice: v })}
      />
      <SwitchRow
        label={t('pos.mertech.cors_fallback', { defaultValue: 'Резервная отправка без CORS (opaque)' })}
        checked={!!draft.corsFallback}
        onChange={(v) => set({ corsFallback: v })}
      />

      <div style={{ display: 'flex', gap: '12px' }}>
        <NumberField
          label={t('pos.mertech.paid_status_code', { defaultValue: 'Код статуса «Оплачено»' })}
          value={draft.paidStatusCode}
          onChange={(v) => set({ paidStatusCode: v })}
          placeholder='3'
        />
        <NumberField
          label={t('pos.mertech.clear_after_paid', { defaultValue: 'Очистка после оплаты (мс)' })}
          value={draft.clearAfterPaidMs}
          onChange={(v) => set({ clearAfterPaidMs: v })}
          placeholder='3000'
        />
        <NumberField
          label={t('pos.mertech.timeout', { defaultValue: 'Таймаут запроса (мс)' })}
          value={draft.timeoutMs}
          onChange={(v) => set({ timeoutMs: v })}
          placeholder='3000'
        />
      </div>

      <button
        type='button'
        className='btn-blue-touch'
        style={{ width: '100%', height: '52px', borderRadius: '8px', backgroundColor: '#111217', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        onClick={handleSave}
      >
        {t('pos.mertech.save', { defaultValue: 'Сохранить настройки дисплея' })}
      </button>
    </div>
  )
}
