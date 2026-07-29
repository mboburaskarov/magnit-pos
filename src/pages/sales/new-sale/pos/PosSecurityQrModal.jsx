/**
 * PosSecurityQrModal
 *
 * Modal shown when kassir tries to remove an item or reduce qty to 0.
 * Guard/admin must scan their QR badge to approve.
 */
import { useEffect, useRef, useState } from 'react'
import './PosLayout.css'

function PosSecurityQrModal({ open, productName, expectedPassword, descKey = 'pos.security.desc', onApprove, onCancel, t }) {
  const inputRef = useRef(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setValue('')
      setError('')
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open])

  const validate = () => {
    const trimmed = value.trim()
    if (!trimmed) {
      setError(t('pos.security.error_short'))
      return false
    }
    if (trimmed !== expectedPassword) {
      setError(t('pos.security.error_invalid'))
      return false
    }
    return true
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (validate()) onApprove(value.trim())
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  if (!open) return null

  return (
    <div className='pos-modal-overlay' role='dialog' aria-modal='true'>
      <div className='pos-security-modal'>
        {/* Icon */}
        <div className='pos-security-icon-container'>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e23a32" strokeWidth="2.2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <div className='pos-security-title'>
          {t('pos.security.title')}
        </div>

        <div className='pos-security-desc'>
          {t(descKey)}
        </div>

        {productName && (
          <div className='pos-security-product-box'>
            {productName}
          </div>
        )}

        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
          onKeyDown={handleKeyDown}
          placeholder={t('pos.security.placeholder')}
          className='pos-security-input'
          autoComplete='off'
        />

        {error && (
          <div className='pos-security-error'>
            {error}
          </div>
        )}

        <div className='pos-security-actions'>
          <button
            type='button'
            onClick={onCancel}
            className='pos-security-btn-cancel'
          >
            {t('pos.security.cancel')}
          </button>
          <button
            type='button'
            onClick={() => {
              if (validate()) onApprove(value.trim())
            }}
            className='pos-security-btn-confirm'
          >
            {t('pos.security.confirm')}
          </button>
        </div>

        <div className='pos-security-help'>
          {t('pos.security.help')}
        </div>
      </div>
    </div>
  )
}

export default PosSecurityQrModal
