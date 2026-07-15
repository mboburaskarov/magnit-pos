/**
 * PosPaymentPanel
 *
 * Right panel payment section:
 * - Summary (subtotal, discount, total, change)
 * - Payment method selector (Naqd, Karta, Online, Aralash)
 * - Cash input with quick amounts + change display
 * - Checkout button (F10)
 */
import thousandDivider from '@utils/thousandDivider'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './PosLayout.css'

// Payment method icons
const CashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)

const CardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
    <circle cx="7" cy="15" r="1.5"/>
  </svg>
)

const OnlineIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
)

const MixIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
)

const QUICK_CASH = [10000, 20000, 50000, 100000, 200000]

const PAYMENT_METHODS = [
  { id: 'cash',   labelKey: 'cash',    icon: <CashIcon />,   shortcut: 'N' },
  { id: 'card',   labelKey: 'card',   icon: <CardIcon />,   shortcut: 'U' },
  { id: 'online', labelKey: 'online_pay',  icon: <OnlineIcon />, shortcut: 'O' },
  { id: 'mixed',  labelKey: 'pos.mixed_payment', icon: <MixIcon />,    shortcut: 'M' },
]

function PosPaymentPanel({
  cartItemsList,
  paymentsList,
  setPaymentsList,
  maxAmount,           // remaining to pay (negative = change)
  onCheckout,
  isCheckoutLoading,
  disabled,
}) {
  const { t } = useTranslation()
  const totalAmount    = cartItemsList?.total_amount || 0
  const discountAmount = cartItemsList?.discount_amount || 0
  const subtotal       = totalAmount + discountAmount

  const [selectedMethod, setSelectedMethod] = useState('cash')
  const [cashEntered, setCashEntered] = useState('')
  const cashInputRef = useRef(null)

  // Cash change calculation
  const cashNum  = parseFloat(cashEntered) || 0
  const change   = cashNum > totalAmount ? cashNum - totalAmount : 0

  // Sync payment list when cash entered
  useEffect(() => {
    if (selectedMethod !== 'cash') return
    const cashPayment = paymentsList?.find(p => p.type === 'cash')
    if (!cashPayment) return
    const updated = paymentsList.map(p =>
      p.type === 'cash' ? { ...p, amount: cashNum || totalAmount } : p
    )
    setPaymentsList?.(updated)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashEntered, selectedMethod])

  // F10 shortcut
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'F10') {
        e.preventDefault()
        if (!disabled && !isCheckoutLoading) onCheckout?.()
      }
      if (e.key === 'F9') {
        e.preventDefault()
        // Exact amount
        setCashEntered(String(totalAmount))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [disabled, isCheckoutLoading, onCheckout, totalAmount])

  // Focus cash input when method = cash
  useEffect(() => {
    if (selectedMethod === 'cash') {
      setTimeout(() => cashInputRef.current?.focus(), 50)
    }
  }, [selectedMethod])

  const handleQuickCash = (amount) => {
    setCashEntered(String(amount))
    cashInputRef.current?.focus()
  }

  const handleExactAmount = () => {
    setCashEntered(String(totalAmount))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Summary ── */}
      <div className='pos-summary'>
        {discountAmount > 0 && (
          <div className='pos-summary-row'>
            <span>{t('pos.payment.subtotal_no_discount')}</span>
            <span>{thousandDivider(subtotal, t('pos.currency_short'))}</span>
          </div>
        )}
        {discountAmount > 0 && (
          <div className='pos-summary-row' style={{ color: '#1e9e52' }}>
            <span>{t('discount')}</span>
            <span>−{thousandDivider(discountAmount, t('pos.currency_short'))}</span>
          </div>
        )}
        <div className='pos-summary-row total'>
          <span>{t('pos.total_payment') || t('pos.payment.total_pay')}</span>
          <span>{thousandDivider(totalAmount, t('pos.currency_short'))}</span>
        </div>
        {selectedMethod === 'cash' && cashNum > 0 && cashNum < totalAmount && (
          <div className='pos-summary-row' style={{ color: '#e23a32', fontSize: 13, marginTop: 4 }}>
            <span>{t('pos.remaining')}</span>
            <span>{thousandDivider(totalAmount - cashNum, t('pos.currency_short'))}</span>
          </div>
        )}
        {change > 0 && (
          <div className='pos-summary-row change'>
            <span>{t('pos.change')}</span>
            <span>{thousandDivider(change, t('pos.currency_short'))}</span>
          </div>
        )}
      </div>

      {/* ── Payment Methods ── */}
      <div style={{ padding: '10px 16px 6px' }}>
        <div className='pos-section-title' style={{ marginBottom: 8 }}>{t('pos.payment.method')}</div>
        <div className='pos-pay-methods'>
          {PAYMENT_METHODS.map((m) => {
            const labelText = t(m.labelKey) || m.labelKey
            return (
              <button
                key={m.id}
                className={`pos-pay-btn ${selectedMethod === m.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(m.id)}
                title={labelText}
              >
                {m.icon}
                <span style={{ fontSize: 12 }}>{labelText}</span>
                <span className='pos-kbd' style={{ fontSize: 10, opacity: 0.7 }}>{m.shortcut}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Cash Input ── */}
      {(selectedMethod === 'cash' || selectedMethod === 'mixed') && (
        <div style={{ padding: '8px 16px 4px' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#6f6f6f', display: 'block', marginBottom: 6 }}>
            {t('pos.customer_received')}
          </label>
          <input
            ref={cashInputRef}
            type='number'
            className='pos-cash-input'
            value={cashEntered}
            onChange={(e) => setCashEntered(e.target.value)}
            placeholder={thousandDivider(totalAmount)}
            min={0}
          />

          {/* Quick amounts */}
          <div className='pos-quick-cash'>
            <button className='pos-quick-cash-btn' onClick={handleExactAmount} style={{ fontWeight: 700 }}>
              {t('pos.payment.exact')}
              <span className='pos-kbd' style={{ fontSize: 9 }}>F9</span>
            </button>
            {QUICK_CASH.map((amt) => (
              <button key={amt} className='pos-quick-cash-btn' onClick={() => handleQuickCash(amt)}>
                {amt >= 1000 ? `${amt/1000}K` : amt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Checkout Button ── */}
      <button
        className='pos-checkout-btn'
        onClick={onCheckout}
        disabled={disabled || isCheckoutLoading}
      >
        <span>{isCheckoutLoading ? t('pos.payment_processing') : t('pos.complete_payment')}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>{thousandDivider(totalAmount, t('pos.currency_short'))}</span>
          <span className='shortcut-badge'>F10</span>
          <CheckIcon />
        </div>
      </button>
    </div>
  )
}

export default PosPaymentPanel
