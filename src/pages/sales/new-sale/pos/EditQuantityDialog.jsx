import { useState, useEffect, useCallback } from 'react'
import { Delete, X, Check } from 'lucide-react'
import './PosLayout.css'

/**
 * EditQuantityDialog
 *
 * Opens when cashier clicks "Edit Quantity" with a selected cart row.
 * Provides a dedicated numpad with:
 *   - Digit keys 1-9, 0
 *   - Comma key (enabled only for weight products)
 *   - Backspace (←)
 *   - Clear (C)
 *   - Cancel + Confirm buttons
 *
 * For PIECE products  (unit_per_pack !== 1000): integer qty, no comma.
 * For WEIGHT products (unit_per_pack === 1000): decimal qty with comma as separator.
 *   Buffer "10,200" → 10.200 kg → 10200 grams
 */
export default function EditQuantityDialog({ open, item, onConfirm, onClose, t }) {
  const [buffer, setBuffer] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const isWeight = item?.unit_per_pack === 1000

  // Pre-fill buffer with current quantity when dialog opens
  useEffect(() => {
    if (open && item) {
      setErrorMsg('')
      if (isWeight) {
        const grams = (item.quantity || 0) * 1000 + (item.unit_quantity || 0)
        // Format as "10,200" style
        setBuffer((grams / 1000).toFixed(3).replace('.', ','))
      } else {
        setBuffer(String(item.quantity || 1))
      }
    }
  }, [open, item?.id])

  // Keyboard support
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Enter') { handleConfirm(); return }
      if (e.key === 'Backspace') { pressKey('backspace'); return }
      if (e.key === ',' || e.key === '.') { pressKey(','); return }
      if (/^\d$/.test(e.key)) { pressKey(Number(e.key)); return }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, buffer])

  const pressKey = useCallback((val) => {
    setErrorMsg('')
    setBuffer((prev) => {
      if (val === 'clear') return ''
      if (val === 'backspace') return prev.slice(0, -1)
      if (val === ',') {
        if (!isWeight) return prev           // comma not allowed for piece products
        if (prev.includes(',')) return prev  // only one decimal separator
        if (prev === '' || prev === '-') return '0,'
        return prev + ','
      }
      // digit
      const digit = String(val)
      // Limit reasonable input length
      if (!isWeight && prev.length >= 6) return prev  // max 999999 pcs
      if (isWeight && prev.length >= 9) return prev   // max XXX,XXX kg
      return prev + digit
    })
  }, [isWeight])

  const getDisplayBuffer = () => {
    if (buffer === '' || buffer === '0') return isWeight ? '0,000' : '0'
    return buffer
  }

  const getUnitLabel = () => {
    if (!item) return ''
    if (isWeight) return t('pos.unit.kg')
    if (item.unit_per_pack > 1) return t('pos.unit.pack')
    return t('pos.unit.pcs')
  }

  const getCurrentQtyDisplay = () => {
    if (!item) return '—'
    if (isWeight) {
      const grams = (item.quantity || 0) * 1000 + (item.unit_quantity || 0)
      return `${(grams / 1000).toFixed(3).replace('.', ',')} ${t('pos.unit.kg')}`
    }
    return `${item.quantity || 1} ${t('pos.unit.pcs')}`
  }

  const handleConfirm = () => {
    if (!item) return
    const raw = buffer.trim()

    if (!raw || raw === '' || raw === ',') {
      setErrorMsg(t('pos.edit_qty_invalid'))
      return
    }

    if (isWeight) {
      const normalized = raw.replace(',', '.')
      const kgVal = parseFloat(normalized)
      if (isNaN(kgVal) || kgVal <= 0) {
        setErrorMsg(t('pos.edit_qty_min'))
        return
      }
      onConfirm({ item, kgVal, isWeight: true })
    } else {
      if (raw.includes(',') || raw.includes('.')) {
        setErrorMsg(t('pos.edit_qty_no_decimal'))
        return
      }
      const qty = parseInt(raw, 10)
      if (isNaN(qty) || qty < 1) {
        setErrorMsg(t('pos.edit_qty_min'))
        return
      }
      onConfirm({ item, qty, isWeight: false })
    }
  }

  if (!open || !item) return null

  const numpadButtons = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: ',', value: ',' },
    { label: '0', value: 0 },
    { label: 'C', value: 'clear' },
  ]

  const bufferIsValid = (() => {
    if (!buffer || buffer === '' || buffer === ',') return false
    if (isWeight) {
      const kgVal = parseFloat(buffer.replace(',', '.'))
      return !isNaN(kgVal) && kgVal > 0
    }
    const qty = parseInt(buffer, 10)
    return !isNaN(qty) && qty >= 1 && !buffer.includes(',')
  })()

  return (
    <div
      className='pos-modal-overlay'
      onClick={onClose}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        className='edit-qty-dialog'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='edit-qty-header'>
          <span className='edit-qty-title'>
            {t('pos.edit_qty_dialog_title')}
          </span>
          <button type='button' className='edit-qty-close-btn' onClick={onClose} tabIndex={-1}>
            <X size={16} />
          </button>
        </div>

        {/* Product Info */}
        <div className='edit-qty-product-info'>
          <div className='edit-qty-product-name' title={item.name}>{item.name}</div>
          <div className='edit-qty-product-meta'>
            {item.barcode && <span>🔖 {item.barcode}</span>}
            <span>
              {t('pos.edit_qty_current')}: <strong>{getCurrentQtyDisplay()}</strong>
            </span>
            <span>
              {t('price')}: <strong>{item.unit_price?.toLocaleString?.() || '—'}</strong>
            </span>
          </div>
        </div>

        {/* Input Display */}
        <div className='edit-qty-input-row'>
          <span className='edit-qty-label'>{t('pos.edit_qty_new')}</span>
          <div className={`edit-qty-input-display ${errorMsg ? 'is-error' : buffer ? 'is-focused' : ''}`}>
            {getDisplayBuffer()}
          </div>
          <span className='edit-qty-unit'>{getUnitLabel()}</span>
          <button
            type='button'
            className='edit-qty-numpad-btn is-action'
            style={{ width: 44, height: 44, flexShrink: 0 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pressKey('backspace')}
            tabIndex={-1}
          >
            <Delete size={18} />
          </button>
        </div>

        {/* Error message */}
        <div className='edit-qty-error-msg'>{errorMsg}</div>

        {/* Numpad */}
        <div className='edit-qty-numpad'>
          {numpadButtons.map((btn, idx) => {
            const isComma = btn.value === ','
            const isClear = btn.value === 'clear'
            return (
              <button
                key={idx}
                type='button'
                className={`edit-qty-numpad-btn ${isClear ? 'is-clear' : ''} ${isComma ? 'is-comma' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pressKey(btn.value)}
                disabled={isComma && !isWeight}
                tabIndex={-1}
              >
                {btn.label}
              </button>
            )
          })}
        </div>

        {/* Action row */}
        <div className='edit-qty-action-row'>
          <button type='button' className='edit-qty-cancel-btn' onClick={onClose} tabIndex={-1}>
            {t('pos.edit_qty_cancel')}
          </button>
          <button
            type='button'
            className='edit-qty-confirm-btn'
            onClick={handleConfirm}
            disabled={!bufferIsValid}
            tabIndex={-1}
          >
            <Check size={18} />
            {t('pos.edit_qty_confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
