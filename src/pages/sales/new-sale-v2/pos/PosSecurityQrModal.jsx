/**
 * PosSecurityQrModal
 *
 * Modal shown when kassir tries to remove an item or reduce qty to 0.
 * Guard/admin must scan their QR badge to approve.
 */
import { useEffect, useRef, useState } from 'react'
import './PosLayout.css'

function PosSecurityQrModal({ open, productName, onApprove, onCancel }) {
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (value.trim().length < 4) {
        setError("QR kod juda qisqa. Iltimos, to'g'ri scan qiling.")
        return
      }
      onApprove(value.trim())
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  if (!open) return null

  return (
    <div className='pos-modal-overlay' role='dialog' aria-modal='true'>
      <div className='pos-modal'>
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#FEF2F2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>

        <div className='pos-modal-title' style={{ textAlign: 'center' }}>
          Xavfsizlik tasdiqlanishi
        </div>
        <div className='pos-modal-desc' style={{ textAlign: 'center', marginBottom: 6 }}>
          Mahsulotni olib tashlash uchun admin QR ni scan qiling:
        </div>
        {productName && (
          <div style={{
            background: '#FFF7F0', border: '1px solid #FE5000',
            borderRadius: 8, padding: '8px 12px',
            fontSize: 14, fontWeight: 600, color: '#FE5000',
            textAlign: 'center', marginBottom: 16,
          }}>
            {productName}
          </div>
        )}

        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={(e) => { setValue(e.target.value); setError('') }}
          onKeyDown={handleKeyDown}
          placeholder="QR kodni bu yerga scan qiling..."
          className='pos-cash-input'
          style={{ textAlign: 'left', fontSize: 15 }}
          autoComplete='off'
        />

        {error && (
          <div style={{ color: '#DC2626', fontSize: 13, marginTop: 6, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className='pos-modal-actions'>
          <button
            onClick={onCancel}
            style={{
              flex: 1, height: 48, borderRadius: 8,
              border: '1px solid #E0E3E8', background: '#F4F5F7',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Bekor qilish
          </button>
          <button
            onClick={() => {
              if (value.trim().length < 4) {
                setError("QR kod juda qisqa.")
                return
              }
              onApprove(value.trim())
            }}
            style={{
              flex: 1, height: 48, borderRadius: 8,
              border: 'none', background: '#DC2626', color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Tasdiqlash
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#9CA3AF' }}>
          Esc – bekor qilish • Enter – tasdiqlash
        </div>
      </div>
    </div>
  )
}

export default PosSecurityQrModal
