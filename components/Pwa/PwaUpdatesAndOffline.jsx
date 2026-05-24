import React, { useState, useEffect } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function PwaUpdatesAndOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  // Register PWA service worker with auto-update capability
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('PWA Service Worker registered successfully')
    },
    onRegisterError(err) {
      console.error('PWA Service Worker registration failed:', err)
    },
  })

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      {/* ── Offline Fullscreen Blocker ── */}
      {isOffline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(17, 24, 39, 0.95)', // Dark navy matching brand theme
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'Euclid Circular B, -apple-system, sans-serif',
          padding: '24px',
          textAlign: 'center',
          userSelect: 'none',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            marginBottom: '24px',
          }}>
            <WifiOff size={40} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Соединение потеряно
          </h1>
          <p style={{ fontSize: '16px', color: '#9ca3af', maxWidth: '440px', lineHeight: '1.5', marginBottom: '32px' }}>
            Терминал Magnit POS временно отключен от сети. Оплата и кассовые операции недоступны до восстановления подключения к интернету.
          </p>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
            Ожидание сети...
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes pulse {
                0%, 100% { opacity: 0.4; transform: scale(0.9); }
                50% { opacity: 1; transform: scale(1.1); }
              }
            `}} />
          </div>
        </div>
      )}

      {/* ── SW Update Banner alert ── */}
      {needRefresh && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#111827',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          padding: '20px 24px',
          maxWidth: '400px',
          zIndex: 99998,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: 'Euclid Circular B, -apple-system, sans-serif',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} style={{ color: '#2563eb' }} /> Доступно обновление
            </h4>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px', margin: 0, lineHeight: '1.4' }}>
              Для применения новой версии приложения Magnit POS требуется перезапуск.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              style={{
                flex: 1,
                height: '40px',
                borderRadius: '6px',
                backgroundColor: '#2563eb',
                border: 'none',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.96)'}
              onMouseUp={(e) => e.target.style.transform = 'none'}
            >
              Обновить сейчас
            </button>
            <button
              type="button"
              onClick={() => setNeedRefresh(false)}
              style={{
                height: '40px',
                padding: '0 16px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Позже
            </button>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideUp {
              from { transform: translateY(40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}} />
        </div>
      )}
    </>
  )
}
