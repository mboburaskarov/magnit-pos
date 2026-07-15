import React, { useState, useEffect } from 'react'
import { X, Play, RefreshCw, Server, Wifi, Usb, Search, Box, Eye } from 'lucide-react'
import axios from 'axios'
import { success, error } from '@utils/toast'
import { buildReceiptLayout } from '@utils/receiptBuilder'
import { loadSvgAsEscposHex } from '@utils/escposImage'
import ReceiptPreviewCanvas from '@components/ReceiptPreviewCanvas'
import './PosLayout.css'

const AGENT_URL = 'http://localhost:7788'
const FALLBACK_AGENT_URL = 'http://127.0.0.1:7777'

export default function PosPrinterSettings({ open, onClose, t }) {
  const [isRunning, setIsRunning] = useState(false)
  const [activeUrl, setActiveUrl] = useState(AGENT_URL)
  const [mode, setMode] = useState('network') // 'network' or 'local'
  const [logoHex, setLogoHex] = useState(null)

  useEffect(() => {
    let active = true
    loadSvgAsEscposHex('/MagnitLogoPremiumCheque.svg', 400, 576)
      .then((hex) => {
        if (active) setLogoHex(hex)
      })
      .catch((e) => {
        console.warn('Failed to load logo for settings preview:', e)
      })
    return () => {
      active = false
    }
  }, [])
  
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
  const [showPreview, setShowPreview] = useState(false)

  const dummyData = {
    saleId: "00084874",
    cashier: "Amirsaidov Muhammadiso",
    date: new Date().toISOString(),
    items: [
      { name: "FANTA 0.25 STKL (24)", mxik: "00902001002008001", qty: 1, price: 9900, total: 9900, vatPercent: 12, vatAmount: 1060.71 },
      { name: "MONTELLA 0.5L SWEET LIMON", mxik: "07616003001000002", qty: 1, price: 3990, total: 3990, vatPercent: 12, vatAmount: 427.50 },
      { name: "PEPSI 0.25L STKL", mxik: "07616003001000002", qty: 1, price: 6990, total: 6990, vatPercent: 12, vatAmount: 748.93 }
    ],
    totalAmount: 20880,
    subtotal: 20880,
    discount: 0,
    vatAmount: 2237.14,
    paymentType: "cash",
    paidAmount: 20880,
    changeAmount: 0,
    fiscalStir: "305445201",
    fiscalNumber: "VG343420011102",
    fiscalSign: "146771624678",
    fiscalDate: "20260612150839",
    qrData: "https://my.soliq.uz/check?id=123"
  }

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
        if (showToasts) error(t('pos.printer.agent_connect_failed'))
        setIsChecking(false)
        return
      }
    }

    if (statusRes && statusRes.data && statusRes.data.ok) {
      setActiveUrl(workingUrl)
      setIsRunning(true)
      if (showToasts) success(t('pos.printer.agent_started'))
      
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
      error(t('pos.printer.agent_not_running'))
      return
    }
    if (mode === 'local' && !printerName) {
      error(t('pos.printer.select_from_list'))
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
          openTiming: "before_print",
          command: "1B700019FA"
        }
      })
      if (res.data && res.data.settings) {
        success(t('pos.printer.settings_saved'))
      } else {
        error(t('pos.printer.settings_save_error'))
      }
    } catch (err) {
      error(t('pos.printer.save_error_prefix') + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  // 3. Ping the TCP printer
  const handlePingPrinter = async () => {
    if (!isRunning) {
      error(t('pos.printer.agent_not_running'))
      return
    }
    if (mode === 'network' && !printerIP) {
      error(t('pos.printer.enter_ip'))
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
        success(t('pos.printer.connection_success'))
      } else {
        error(res.data.message || t('pos.printer.connection_error'))
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      error(t('pos.printer.error_prefix') + errMsg)
    } finally {
      setIsPinging(false)
    }
  }

  // 4. Send test print
  const handleTestPrint = async () => {
    if (!isRunning) {
      error(t('pos.printer.agent_not_running'))
      return
    }
    if (mode === 'local' && !printerName) {
      error(t('pos.printer.select_from_list'))
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
          openTiming: "before_print",
          command: "1B700019FA"
        }
      })
      
      const res = await axios.post(`${activeUrl}/print/test`)
      if (res.data && res.data.ok) {
        success(t('pos.printer.test_sent'))
      } else {
        error(res.data.message || t('pos.printer.print_error'))
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      error(t('pos.printer.print_error_prefix') + errMsg)
    } finally {
      setIsTesting(false)
    }
  }

  // 5. Test Cash Drawer
  const handleTestDrawer = async () => {
    if (!isRunning) {
      error(t('pos.printer.agent_not_running'))
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
          openTiming: "before_print",
          command: "1B700019FA" // Default ESC/POS kick command
        }
      })
      
      const res = await axios.post(`${activeUrl}/cash-drawer/open`)
      if (res.data && res.data.ok) {
        success(t('pos.printer.drawer_signal_sent'))
      } else {
        error(res.data.message || t('pos.printer.drawer_open_error'))
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      error(t('pos.printer.drawer_error_prefix') + errMsg)
    } finally {
      setIsTestingDrawer(false)
    }
  }

  const tryStartAgent = () => {
    window.location.href = "magnitposprinter://start"
    setTimeout(() => {
      if(!isRunning) {
         error(t('pos.printer.agent_manual_start'))
      }
    }, 2000)
  }

  if (!open) return null

  return (
    <div className="touch-modal-overlay" onClick={onClose}>
      <div className="touch-modal-card" onClick={(e) => e.stopPropagation()} style={{ width: showPreview ? '800px' : '520px', transition: 'width 0.3s ease' }}>
        {/* Header */}
        <div className="touch-modal-header pos-std-header">
          <div className="touch-modal-userinfo">
            <div className="touch-modal-avatar" style={{ backgroundColor: isRunning ? 'rgba(30, 158, 82, 0.1)' : 'rgba(226, 58, 50, 0.1)', color: isRunning ? '#1e9e52' : '#e23a32' }}>
              <Server size={20} />
            </div>
            <div>
              <div className="touch-modal-username" style={{ color: '#ffffff' }}>
                {t('pos.printer.title')}
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
            backgroundColor: isRunning ? '#e9f8ef' : '#fdecec',
            border: isRunning ? '1px solid #bfe6ce' : '1px solid #f5c4c1',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Server size={24} color={isRunning ? '#1e9e52' : '#e23a32'} />
              <div>
                <div style={{ fontWeight: '700', color: isRunning ? '#1e9e52' : '#e23a32', fontSize: '15px' }}>
                  {isRunning ? t('pos.printer.agent_active') : t('pos.printer.agent_inactive')}
                </div>
                <div style={{ fontSize: '12px', color: '#6f6f6f', marginTop: '2px' }}>
                  {isRunning ? `${t('pos.printer.port_label')}${activeUrl.split(':').pop()}` : t('pos.printer.run_agent_hint')}
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
                    backgroundColor: '#e23a32',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                  onClick={tryStartAgent}
                >
                  {t('pos.printer.run')}
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
            <div style={{ fontSize: '14px', color: '#e23a32', fontWeight: '600', textAlign: 'center', margin: '0' }}>
              {t('pos.printer.agent_needed')}
              <br/>
              <span style={{fontSize: '12px', fontWeight: 'normal', color: '#6f6f6f'}}>{t('pos.printer.run_file_hint')}</span>
            </div>
          )}

          {/* Mode Selector */}
          <div style={{ display: 'flex', backgroundColor: '#f1f3f7', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setMode('network')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: mode === 'network' ? '#ffffff' : 'transparent',
                boxShadow: mode === 'network' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                color: mode === 'network' ? '#111217' : '#6f6f6f',
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
              <Wifi size={16} /> {t('pos.printer.ip_printer')}
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
                color: mode === 'local' ? '#111217' : '#6f6f6f',
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
              <Usb size={16} /> {t('pos.printer.usb_printer')}
            </button>
          </div>

          {/* Form Fields */}
          <div className="form-group-touch" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {mode === 'network' ? (
              <>
                <div>
                  <label className="form-label-touch" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>
                    {t('pos.printer.ip_address')}
                  </label>
                  <input
                    type="text"
                    className="pos-cashier-search-input"
                    style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid #d5d7e2', fontSize: '15px' }}
                    placeholder={t('pos.printer.ip_placeholder')}
                    value={printerIP}
                    onChange={(e) => setPrinterIP(e.target.value)}
                    disabled={!isRunning}
                  />
                </div>
                <div>
                  <label className="form-label-touch" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>
                    {t('pos.printer.port')}
                  </label>
                  <input
                    type="number"
                    className="pos-cashier-search-input"
                    style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid #d5d7e2', fontSize: '15px' }}
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
                    {t('pos.printer.system_printers')}
                  </label>
                  <button
                    onClick={() => scanPrinters()}
                    disabled={!isRunning || isScanning}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#111217',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Search size={14} className={isScanning ? 'spin' : ''} />
                    {t('pos.printer.refresh_list')}
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
                  backgroundColor: '#f7f9fc'
                }}>
                  {printersList.length === 0 ? (
                     <div style={{ padding: '20px', textAlign: 'center', color: '#6f6f6f', fontSize: '13px' }}>
                       {isScanning ? t('pos.printer.searching') : t('pos.printer.none_found')}
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
                            backgroundColor: isSelected ? '#f4f5f7' : '#ffffff',
                            border: isSelected ? '1px solid #111217' : '1px solid #e5e7eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s'
                          }}
                        >
                           <Box size={20} color={isSelected ? '#111217' : '#9ca3af'} />
                           <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '14px', fontWeight: '600', color: isSelected ? '#111217' : '#374151' }}>
                               {p.name}
                               {p.recommended && <span style={{ marginLeft: '8px', fontSize: '10px', backgroundColor: '#e9f8ef', color: '#188245', padding: '2px 6px', borderRadius: '10px' }}>{t('pos.printer.recommended')}</span>}
                             </div>
                             <div style={{ fontSize: '12px', color: '#6f6f6f' }}>
                               {p.port || 'USB/Local'} {p.isDefault ? ` • ${t('pos.printer.default')}` : ''}
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
                {t('pos.printer.command_format')}
              </label>
              <select
                className="pos-cashier-search-input"
                style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid #d5d7e2', backgroundColor: '#ffffff', fontSize: '15px' }}
                value={printerModel}
                onChange={(e) => setPrinterModel(e.target.value)}
                disabled={!isRunning}
              >
                <option value="ESC/POS">{t('pos.printer.esc_pos_desc')}</option>
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
                  style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #111217', color: '#111217', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                  onClick={handlePingPrinter}
                  disabled={!isRunning || isPinging}
                >
                  <Wifi size={16} />
                  {isPinging ? t('pos.printer.checking') : t('pos.printer.check_ip')}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-secondary-touch"
                  style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #1e9e52', color: '#1e9e52', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                  onClick={handleTestDrawer}
                  disabled={!isRunning || isTestingDrawer}
                >
                  <Box size={16} />
                  {isTestingDrawer ? t('pos.printer.sending') : t('pos.printer.test_drawer')}
                </button>
              )}

              <button
                type="button"
                className="btn-secondary-touch"
                style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #111217', color: '#111217', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                onClick={handleTestPrint}
                disabled={!isRunning || isTesting}
              >
                <Play size={16} />
                {isTesting ? t('pos.printer.printing') : t('pos.printer.test_print')}
              </button>

              <button
                type="button"
                className="btn-secondary-touch"
                style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #8b5cf6', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye size={16} />
                {showPreview ? t('pos.printer.hide_preview') : t('pos.printer.preview')}
              </button>
            </div>

            <button
              type="button"
              className="btn-blue-touch"
              style={{ width: '100%', height: '52px', borderRadius: '8px', backgroundColor: '#111217', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isRunning ? 'pointer' : 'not-allowed', opacity: isRunning ? 1 : 0.6 }}
              onClick={handleSaveSettings}
              disabled={!isRunning || isSaving}
            >
              {isSaving ? t('pos.printer.saving') : t('pos.printer.save_settings')}
            </button>
          </div>

          {showPreview && (
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '16px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#374151' }}>{t('pos.printer.receipt_preview_test')}</h4>
              <ReceiptPreviewCanvas lines={buildReceiptLayout(dummyData, { logoHex })} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
