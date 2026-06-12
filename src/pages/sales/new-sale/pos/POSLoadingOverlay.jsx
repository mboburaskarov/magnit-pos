import React from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import LogoMain from '@icons/LogoMain'

export default function POSLoadingOverlay({
  isLoading,
  isError,
  lang = 'ru',
  onRetry,
  onBack,
  fullScreen = false,
}) {
  const loadingText = {
    ru: {
      title: 'Данные загружаются',
      desc: 'Пожалуйста, подождите...',
    },
    uz: {
      title: 'Ma’lumotlar yuklanmoqda',
      desc: 'Iltimos, kuting...',
    },
    en: {
      title: 'Loading data',
      desc: 'Please wait...',
    },
  }

  const errorText = {
    ru: {
      title: 'Не удалось загрузить данные',
      desc: 'Проверьте подключение и попробуйте снова.',
      retry: 'Повторить',
      back: 'Назад',
    },
    uz: {
      title: 'Ma’lumotlarni yuklab bo‘lmadi',
      desc: 'Ulanishni tekshiring va qayta urinib ko‘ring.',
      retry: 'Qayta urinish',
      back: 'Orqaga',
    },
    en: {
      title: 'Failed to load data',
      desc: 'Check your connection and try again.',
      retry: 'Retry',
      back: 'Back',
    },
  }

  const activeText = isError ? errorText[lang] : loadingText[lang]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backgroundColor: fullScreen ? '#0B1220' : 'rgba(11, 18, 32, 0.4)',
        backdropFilter: fullScreen ? 'none' : 'blur(4px)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '380px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px 24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {isError ? (
          <div style={{ color: '#ef4444', marginBottom: '20px' }}>
            <AlertCircle size={48} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            {/* Logo */}
            <div style={{ marginBottom: '16px', height: '24px', color: '#0B1220' }}>
              <LogoMain style={{ height: '24px', width: 'auto' }} />
            </div>
            {/* Spinner */}
            <Loader2 className="animate-spin" size={32} style={{ color: '#0B1220', animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '19px',
            fontWeight: '700',
            color: '#0f172a',
          }}
        >
          {activeText.title}
        </h3>
        
        <p
          style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '20px',
          }}
        >
          {activeText.desc}
        </p>

        {isError && (
          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
            <button
              onClick={onBack}
              type="button"
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            >
              {activeText.back}
            </button>
            <button
              onClick={onRetry}
              type="button"
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#0B1220',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0B1220'}
            >
              {activeText.retry}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
