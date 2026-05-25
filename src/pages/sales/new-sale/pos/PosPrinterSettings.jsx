import React, { useState, useEffect } from 'react'
import { X, Play, RefreshCw, Server, Wifi } from 'lucide-react'
import axios from 'axios'
import { success, error } from '@utils/toast'
import './PosLayout.css'

const AGENT_URL = 'http://127.0.0.1:7777'

export default function PosPrinterSettings({ open, onClose, t }) {
  const [isRunning, setIsRunning] = useState(false)
  const [printerIP, setPrinterIP] = useState('')
  const [printerPort, setPrinterPort] = useState(9100)
  const [printerModel, setPrinterModel] = useState('ESC/POS')
  const [isChecking, setIsChecking] = useState(false)
  const [isPinging, setIsPinging] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 1. Check agent status and load settings
  const checkAgentStatus = async (showToasts = false) => {
    setIsChecking(true)
    try {
      const res = await axios.get(`${AGENT_URL}/status`, { timeout: 2000 })
      if (res.data && res.data.ok) {
        setIsRunning(true)
        if (showToasts) success('Printer Agent is running!')
        
        // Fetch current settings from the agent
        const settingsRes = await axios.get(`${AGENT_URL}/settings`)
        if (settingsRes.data) {
          setPrinterIP(settingsRes.data.receiptPrinterIp || '')
          setPrinterPort(settingsRes.data.receiptPrinterPort || 9100)
          setPrinterModel(settingsRes.data.printerModel || 'ESC/POS')
        }
      } else {
        setIsRunning(false)
      }
    } catch (err) {
      setIsRunning(false)
      if (showToasts) error('Failed to connect to Printer Agent.')
    } finally {
      setIsChecking(false)
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
      error('Printer Agent is not running. Cannot save settings.')
      return
    }

    setIsSaving(true)
    try {
      const res = await axios.post(`${AGENT_URL}/settings`, {
        receiptPrinterIp: printerIP,
        receiptPrinterPort: Number(printerPort),
        printerModel: printerModel
      })
      if (res.data && res.data.settings) {
        success('Printer settings saved successfully!')
      } else {
        error('Failed to save printer settings.')
      }
    } catch (err) {
      error('Error saving settings to agent: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  // 3. Ping the TCP printer
  const handlePingPrinter = async () => {
    if (!isRunning) {
      error('Printer Agent is not running.')
      return
    }
    if (!printerIP) {
      error('Please enter a printer IP address.')
      return
    }

    setIsPinging(true)
    try {
      const res = await axios.post(`${AGENT_URL}/printer/ping`, {}, { timeout: 5000 })
      if (res.data && res.data.ok) {
        success('Printer TCP Ping Success!')
      } else {
        error(res.data.message || 'Printer TCP Ping Failed.')
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      error('Ping failed: ' + errMsg)
    } finally {
      setIsPinging(false)
    }
  }

  // 4. Send test print
  const handleTestPrint = async () => {
    if (!isRunning) {
      error('Printer Agent is not running.')
      return
    }

    setIsTesting(true)
    try {
      const res = await axios.post(`${AGENT_URL}/print/test`)
      if (res.data && res.data.ok) {
        success('Test print sent to receipt printer!')
      } else {
        error(res.data.message || 'Failed to print test receipt.')
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      error('Test print error: ' + errMsg)
    } finally {
      setIsTesting(false)
    }
  }

  if (!open) return null

  return (
    <div className="touch-modal-overlay" onClick={onClose}>
      <div className="touch-modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
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
        <div className="touch-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
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
                  {isRunning ? 'Локальный порт: 7777' : 'Запустите MagnitPOSPrinter agent'}
                </div>
              </div>
            </div>
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

          {!isRunning && (
            <div style={{ fontSize: '14px', color: '#ef4444', fontWeight: '600', textAlign: 'center', margin: '4px 0' }}>
              Magnit POS Printer Agent is not running.
            </div>
          )}

          {/* Form Fields */}
          <div className="form-group-touch" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

            <div>
              <label className="form-label-touch" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px', display: 'block' }}>
                Модель принтера
              </label>
              <select
                className="pos-cashier-search-input"
                style={{ width: '100%', height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '15px' }}
                value={printerModel}
                onChange={(e) => setPrinterModel(e.target.value)}
                disabled={!isRunning}
              >
                <option value="ESC/POS">ESC/POS (XPrinter, Rongta, Bixolon)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-secondary-touch"
                style={{ flex: 1, height: '48px', borderRadius: '8px', border: '1px solid #2563eb', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
                onClick={handlePingPrinter}
                disabled={!isRunning || isPinging}
              >
                <Wifi size={16} />
                {isPinging ? 'Проверка...' : 'Проверить связь'}
              </button>

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
