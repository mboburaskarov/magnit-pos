import React, { useState, useEffect } from 'react'
import { X, Play, RefreshCw, Server, Wifi, Usb, Search, Box } from 'lucide-react'
import axios from 'axios'
import { success, error } from '@utils/toast'
import './PosLayout.css'

const AGENT_URL = 'http://localhost:7788'
const FALLBACK_AGENT_URL = 'http://127.0.0.1:7777'

export default function PosPrinterSettings({ open, onClose, t }) {
  const [isRunning, setIsRunning] = useState(false)
  const [activeUrl, setActiveUrl] = useState(AGENT_URL)
  const [mode, setMode] = useState('network') // 'network' or 'local'
  
  // Network
  const [printerIP, setPrinterIP] = useState('')
  const [printerPort, setPrinterPort] = useState(9100)
  
  // Local
  const [printerName, setPrinterName] = useState('')
  const [printersList, setPrintersList] = useState([])
  const [isScanning, setIsScanning] = useState(false)

  // Shared
  const [printerModel, setPrinterModel] = useState('ESC/POS')
  
  const [isChecking, setIsChecking] = useState(false)
  const [isPinging, setIsPinging] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isTestingDrawer, setIsTestingDrawer] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 1. Check agent status and load settings
  const checkAgentStatus = async (showToasts = false) => {
    setIsChecking(true)
    let workingUrl = AGENT_URL
    let statusRes = null
    try {
      statusRes = await axios.get(`${AGENT_URL}/status`, { timeout: 2000 })
    } catch (err) {
      try {
        statusRes = await axios.get(`${FALLBACK_AGENT_URL}/status`, { timeout: 2000 })
        workingUrl = FALLBACK_AGENT_URL
      } catch (err2) {
        setIsRunning(false)
        if (showToasts) error('Не удалось подключиться к Printer Agent.')
        setIsChecking(false)
        return
      }
    }

    if (statusRes && statusRes.data && statusRes.data.ok) {
      setActiveUrl(workingUrl)
      setIsRunning(true)
      if (showToasts) success('Printer Agent запущен!')
      
      // Fetch current settings from the agent
      try {
        const settingsRes = await axios.get(`${workingUrl}/settings`)
        if (settingsRes.data) {
          setMode(settingsRes.data.mode || 'network')
          setPrinterIP(settingsRes.data.receiptPrinterIp || '')
          setPrinterPort(settingsRes.data.receiptPrinterPort || 9100)
          setPrinterName(settingsRes.data.printerName || '')
          setPrinterModel(settingsRes.data.printerModel || 'ESC/POS')
        }
      } catch (err) {
        console.error("Failed fetching settings", err)
      }
      
      // If local mode is active or we want to prefetch
      scanPrinters(workingUrl)
    } else {
      setIsRunning(false)
    }
    setIsChecking(false)
  }

  const scanPrinters = async (url) => {
    setIsScanning(true)
    try {
      const res = await axios.get(`${url || activeUrl}/printers`, { timeout: 5000 })
      if (res.data && res.data.printers) {
        // Sort recommended first
        const sorted = res.data.printers.sort((a, b) => {
          if (a.recommended && !b.recommended) return -1
          if (!a.recommended && b.recommended) return 1
          return 0
        })
        setPrintersList(sorted)
      }
    } catch (err) {
      console.error("Failed fetching local printers", err)
    } finally {
      setIsScanning(false)
    }
  }

  useEffect(() => {
    if (open) {
      checkAgentStatus()
    }
  }, [open])

  // 2. Save settings to local agent
  const handleSaveSettings = async () => {
    if (!isRunning) {
      error('Printer Agent не запущен.')
      return
    }
    if (mode === 'local' && !printerName) {
      error('Выберите принтер из списка.')
      return
    }

    setIsSaving(true)
    try {
      const res = await axios.post(`${activeUrl}/settings`, {
        mode: mode,
        receiptPrinterIp: printerIP,
        receiptPrinterPort: Number(printerPort),
        printerName: printerName,
        printerModel: printerModel,
        cashDrawer: {
          enabled: true,
          openOnCashPayment: true,
          openTiming: "after_print",
          command: "1B700019FA"
        }
      })
      if (res.data && res.data.settings) {
        success('Настройки успешно сохранены!')
      } else {
        error('Ошибка сохранения настроек.')
      }
    } catch (err) {
      error('Ошибка при сохранении: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  // 3. Ping the TCP printer
  const handlePingPrinter = async () => {
    if (!isRunning) {
      error('Printer Agent не запущен.')
      return
    }
    if (mode === 'network' && !printerIP) {
      error('Укажите IP адрес принтера.')
      return
    }

    setIsPinging(true)
    try {
      // Temporarily save to test ping against new config, or backend just pings based on current config.
      // We will save first then ping to ensure backend pings right IP.
      await axios.post(`${activeUrl}/settings`, {
        mode: mode,
        receiptPrinterIp: printerIP,
        receiptPrinterPort: Number(printerPort),
        printerName: printerName,
        printerModel: printerModel
      })
      const res = await axios.post(`${activeUrl}/printer/ping`, {}, { timeout: 5000 })
      if (res.data && res.data.ok) {
        success('Связь с принтером установлена!')
      } else {
        error(res.data.message || 'Ошибка связи с принтером.')
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      error('Ошибка: ' + errMsg)
    } finally {
      setIsPinging(false)
    }
  }

  // 4. Send test print
  const handleTestPrint = async () => {
    if (!isRunning) {
      error('Printer Agent не запущен.')
      return
    }
    if (mode === 'local' && !printerName) {
      error('Выберите принтер из списка.')
      return
    }

    setIsTesting(true)
    try {
      // Ensure latest settings are saved before print test
      await axios.post(`${activeUrl}/settings`, {
        mode: mode,
        receiptPrinterIp: printerIP,
        receiptPrinterPort: Number(printerPort),
        printerName: printerName,
        printerModel: printerModel,
        cashDrawer: {
          enabled: true,
          openOnCashPayment: true,
          openTiming: "after_print",
          command: "1B700019FA"
        }
      })
      
      const res = await axios.post(`${activeUrl}/print/test`)
      if (res.data && res.data.ok) {
        success('Тестовый чек отправлен!')
      } else {
        error(res.data.message || 'Ошибка печати чека.')
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      error('Ошибка печати: ' + errMsg)
    } finally {
      setIsTesting(false)
    }
  }

  // 5. Test Cash Drawer
  const handleTestDrawer = async () => {
    if (!isRunning) {
      error('Printer Agent не запущен.')
      return
    }
    
    setIsTestingDrawer(true)
    try {
      await axios.post(`${activeUrl}/settings`, {
        mode: mode,
        receiptPrinterIp: printerIP,
        receiptPrinterPort: Number(printerPort),
        printerName: printerName,
        printerModel: printerModel,
        cashDrawer: {
          enabled: true,
          openOnCashPayment: true,
          openTiming: "after_print",
          command: "1B700019FA" // Default ESC/POS kick command
        }
      })
      
      const res = await axios.post(`${activeUrl}/cash-drawer/open`)
      if (res.data && res.data.ok) {
        success('Сигнал открытия денежного ящика отправлен!')
      } else {
        error(res.data.message || 'Ошибка открытия ящика.')
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      error('Ошибка денежного ящика: ' + errMsg)
    } finally {
      setIsTestingDrawer(false)
    }
  }

  const tryStartAgent = () => {
    window.location.href = "magnitposprinter://start"
    setTimeout(() => {
      if(!isRunning) {
         error("Не удалось запустить агент автоматически. Запустите './magnitposprinter' вручную.")
      }
    }, 2000)
  }

  if (!open) return null

  return (
    <div className="touch-modal-overlay" onClick={onClose}>
      <div className="touch-modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '520px' }}>
        {/* Header */}
        <div className="touch-modal-header pos-std-header">
          <div className="touch-modal-userinfo">
            <div className="touch-modal-avatar" style={{ backgroundColor: isRunning ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)', color: isRunning ? '#16a34a' : '#dc2626' }}>
              <Server size={20} />
            </div>
            <div>
              <div className="touch-modal-username" style={{ color: '#ffffff' }}>
                Принтер чеков
              </div>
            </div>
          </div>
          <button type="button" className="pos-std-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="touch-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '75vh', overflowY: 'auto' }}>
          
          {/* Status Block */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: isRunning ? '#f0fdf4' : '#fef2f2',
            border: isRunning ? '1px solid #bbf7d0' : '1px solid #fecaca',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Server size={24} color={isRunning ? '#16a34a' : '#dc2626'} />
              <div>
                <div style={{ fontWeight: '700', color: isRunning ? '#16a34a' : '#dc2626', fontSize: '15px' }}>
                  {isRunning ? 'Агент запущен' : 'Агент не запущен'}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  {isRunning ? `Работает на порту: ${activeUrl.split(':').pop()}` : 'Запустите MagnitPOSPrinter agent'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!isRunning && (
                <button
                  type="button"
                  className="btn-blue-touch"
                  style={{
                    height: '40px',
                    padding: '0 12px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                  onClick={tryStartAgent}
                >
                  Запустить
                </button>
              )}
              <button
                type="button"
                className="pos-std-close-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  color: '#374151',
                  borderRadius: '8px',
                }}
                onClick={() => checkAgentStatus(true)}
                disabled={isChecking}
              >
                <RefreshCw size={16} className={isChecking ? 'spin' : ''} />
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                  .spin { animation: spin 1s linear infinite; }
                `}} />
              </button>
            </div>
          </div>

          {!isRunning && (
            <div style={{ fontSize: '14px', color: '#ef4444', fontWeight: '600', textAlign: 'center', margin: '0' }}>
              Для работы с принтером и денежным ящиком необходим Агент.
              <br/>
              <span style={{fontSize: '12px', fontWeight: 'normal', color: '#6b7280'}}>Выполните запуск файла ./magnitposprinter</span>
            </div>
          )}

          {/* Mode Selector */}
          <div style={{ display: 'flex', backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setMode('network')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: mode === 'network' ? '#ffffff' : 'transparent',
                boxShadow: mode === 'network' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                color: mode === 'network' ? '#111827' : '#6b7280',
                fontWeight: mode === 'network' ? '600' : '500',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Wifi size={16} /> IP Принтер
            </button>
            <button
              onClick={() => setMode('local')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: mode === 'local' ? '#ffffff' : 'transparent',
                boxShadow: mode === 'local' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                color: mode === 'local' ? '#111827' : '#6b7280',
                fontWeight: mode === 'local' ? '600' : '500',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Usb size={16} /> USB Принтер
            </button>
          </div>

          {/* Form Fields */}
          <div className="form-group-touch" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {mode === 'network' ? (
              <>
                <div>
                  <label className="form-label-touch" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>
                    IP адрес принтера
                  </label>
                  <input
                    type="text"
                    className="pos-cashier-search-input"
                    style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                    placeholder="Например: 192.168.1.87"
                    value={printerIP}
                    onChange={(e) => setPrinterIP(e.target.value)}
                    disabled={!isRunning}
                  />
                </div>
                <div>
                  <label className="form-label-touch" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>
                    Порт принтера
                  </label>
                  <input
                    type="number"
                    className="pos-cashier-search-input"
                    style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                    placeholder="9100"
                    value={printerPort}
                    onChange={(e) => setPrinterPort(e.target.value)}
                    disabled={!isRunning}
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <label className="form-label-touch" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block' }}>
                    Установленные принтеры в системе
                  </label>
                  <button
                    onClick={() => scanPrinters()}
                    disabled={!isRunning || isScanning}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#2563eb',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Search size={14} className={isScanning ? 'spin' : ''} />
                    Обновить список
                  </button>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px',
                  backgroundColor: '#f9fafb'
                }}>
                  {printersList.length === 0 ? (
                     <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                       {isScanning ? 'Поиск принтеров...' : 'Принтеры не найдены'}
                     </div>
                  ) : (
                    printersList.map((p) => {
                      // hide obviously non-receipt printers
                      const lowerName = p.name.toLowerCase()
                      if (lowerName.includes("pdf") || lowerName.includes("xps") || lowerName.includes("fax") || lowerName.includes("onenote")) {
                         return null
                      }
                      
                      const isSelected = p.name === printerName
                      return (
                        <div
                          key={p.name}
                          onClick={() => setPrinterName(p.name)}
                          style={{
                            padding: '12px',
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            border: isSelected ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s'
                          }}
                        >
                           <Box size={20} color={isSelected ? '#3b82f6' : '#9ca3af'} />
                           <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '14px', fontWeight: '600', color: isSelected ? '#1e3a8a' : '#374151' }}>
                               {p.name}
                               {p.recommended && <span style={{ marginLeft: '8px', fontSize: '10px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '10px' }}>Рекомендуемый</span>}
                             </div>
                             <div style={{ fontSize: '12px', color: '#6b7280' }}>
                               {p.port || 'USB/Local'} {p.isDefault ? ' • По умолчанию' : ''}
                             </div>
                           </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </>
            )}

            <div>
              <label className="form-label-touch" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Формат команд
              </label>
              <select
                className="pos-cashier-search-input"
                style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '15px' }}
                value={printerModel}
                onChange={(e) => setPrinterModel(e.target.value)}
                disabled={!isRunning}
              >
                <option value="ESC/POS">ESC/POS (Стандартный чековый принтер)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {mode === 'network' ? (
                <button
                  type="button"
                  className="btn-secondary-touch"
                  style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #2563eb', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                  onClick={handlePingPrinter}
                  disabled={!isRunning || isPinging}
                >
                  <Wifi size={16} />
                  {isPinging ? 'Проверка...' : 'Проверить IP'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-secondary-touch"
                  style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                  onClick={handleTestDrawer}
                  disabled={!isRunning || isTestingDrawer}
                >
                  <Box size={16} />
                  {isTestingDrawer ? 'Отправка...' : 'Тест ящика'}
                </button>
              )}

              <button
                type="button"
                className="btn-secondary-touch"
                style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #2563eb', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                onClick={handleTestPrint}
                disabled={!isRunning || isTesting}
              >
                <Play size={16} />
                {isTesting ? 'Печать...' : 'Тест печати'}
              </button>
            </div>

            <button
              type="button"
              className="btn-blue-touch"
              style={{ width: '100%', height: '52px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isRunning ? 'pointer' : 'not-allowed', opacity: isRunning ? 1 : 0.6 }}
              onClick={handleSaveSettings}
              disabled={!isRunning || isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
