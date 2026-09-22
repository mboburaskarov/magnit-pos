import { useEffect, useRef, useState } from 'react'
import './PosLayout.css'

/**
 * Prompts the cashier for the DataMatrix marking code of a line that needs one.
 *
 * The input is focused on purpose: useBarcodeScanner pauses itself while a text
 * input has focus, so the scanner wedge types the raw code (GS separators and
 * all) straight in here instead of being parsed as a product barcode.
 */
function PosMarkingScanModal({ open, productName, scanned, required, skipRemoves, onSubmit, onSkip, onDismiss, t }) {
  const inputRef = useRef(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (open) {
      setValue('')
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open, scanned])

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
    // Escape always just closes, never removes — a stray keypress must not
    // delete a line. With marking required the line stays blocked and keeps its
    // badge in the cart, which reopens this prompt on a tap; that is also how
    // the cashier parks one item to deal with the rest of the basket first.
    if (e.key === 'Escape') {
      onDismiss()
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

        <div className='pos-app-scan-title'>{t('pos.marking_scan_title')}</div>

        <div className='pos-app-scan-payment-row'>
          <span className='pos-app-scan-payment-name'>{productName}</span>
        </div>

        <div className='pos-app-scan-desc'>
          {t('pos.marking_scan_desc')} ({scanned}/{required})
        </div>

        {skipRemoves && <div className='pos-app-scan-desc'>{t('pos.marking_manual_hint')}</div>}

        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('pos.marking_scan_placeholder')}
          className='pos-security-input'
          autoComplete='off'
        />

        <div className='pos-security-actions'>
          {/* With marking required there is no such thing as selling this line
              unmarked, so the way out is to take it off the cheque entirely. */}
          <button type='button' onClick={onSkip} className='pos-security-btn-cancel'>
            {t(skipRemoves ? 'pos.marking_scan_remove' : 'pos.marking_scan_skip')}
          </button>
          <button type='button' disabled={!value.trim()} onClick={submit} className='pos-app-scan-btn-confirm'>
            {t('pos.marking_scan_confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PosMarkingScanModal
