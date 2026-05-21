import { useEffect, useRef, useState } from 'react'
import './PosLayout.css'

function PosAppScanModal({ open, paymentName, onSubmit, onCancel, t }) {
  const inputRef = useRef(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (open) {
      setValue('')
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit(value.trim())
      setValue('')
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  if (!open) return null

  return (
    <div className='pos-modal-overlay' role='dialog' aria-modal='true'>
      <div className='pos-app-scan-modal'>
        <div className='pos-app-scan-icon-container'>
          <svg width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='#7c3aed' strokeWidth='2'>
            <rect x='3' y='3' width='7' height='7' rx='1' />
            <rect x='14' y='3' width='7' height='7' rx='1' />
            <rect x='3' y='14' width='7' height='7' rx='1' />
            <path d='M14 14h1v1h-1zM17 14h3M14 17h1M17 17h3M14 20h1M17 20h3' />
          </svg>
        </div>

        <div className='pos-app-scan-title'>{t('scanner')}</div>

        <div className='pos-app-scan-payment-row'>
          <span className='pos-app-scan-payment-label'>{t('payment_type')}:</span>
          <span className='pos-app-scan-payment-name'>{paymentName}</span>
        </div>

        <div className='pos-app-scan-desc'>{t('new_order.app.pass_scan')}</div>

        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('scanned_code.placeholder')}
          className='pos-security-input'
          autoComplete='off'
        />

        <div className='pos-security-actions'>
          <button type='button' onClick={onCancel} className='pos-security-btn-cancel'>
            {t('pos.security.cancel')}
          </button>
          <button
            type='button'
            disabled={!value.trim()}
            onClick={() => { onSubmit(value.trim()); setValue('') }}
            className='pos-app-scan-btn-confirm'
          >
            {t('pos.complete_payment')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PosAppScanModal
