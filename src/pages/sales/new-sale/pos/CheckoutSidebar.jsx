import { useEffect, useRef } from 'react'
import { User, ChevronRight, CornerDownLeft, ArrowLeft } from 'lucide-react'
import thousandDivider from '@utils/thousandDivider'
import { formatUZS, formatNumberUZS } from '@utils/formatUZS'
import Numpad from './Numpad'
import './PosLayout.css'

export default function CheckoutSidebar({
  saleId,
  cashBoxDetails,
  customerId,
  setIsCustomerModalOpen,
  removeDiscountCard,
  showPaymentView,
  setShowPaymentView,
  onStartPaymentView,
  cashPaymentSelected,
  receivedAmount,
  setReceivedAmount,
  cardPaymentSelected,
  cardPaymentType,
  cardPaymentAmount,
  setCardPaymentAmount,
  secondaryPaymentMethod,
  secondaryPaymentAmount,
  setSecondaryPaymentAmount,
  focusedPaymentInput,
  setFocusedPaymentInput,
  totalAmount,
  handleQuickCash,
  handleCheckout,
  isCheckoutLoading,
  cartItems,
  t,
  cartOwnerType,
  setCartOwnerType,
  // Qty-edit numpad props
  onNumpadQtyPress,
  selectedItemIsWeight,
  numpadQtyBuffer,
}) {
  const receivedAmountInputRef = useRef(null)
  const cardPaymentInputRef = useRef(null)
  const secondaryPaymentInputRef = useRef(null)
  const totalPaid =
    (cashPaymentSelected ? Number(receivedAmount || 0) : 0) +
    (cardPaymentSelected ? Number(cardPaymentAmount || 0) : 0) +
    Number(secondaryPaymentAmount || 0)

  const paymentLabels = {
    card: t('pos.card_payment'),
    click: 'Click',
    payme: 'Payme',
    uzum: 'Uzum',
    munis: 'UzQR',
    loyaltycard: 'Balans',
  }

  const setFocusedAmount = (updater) => {
    if (focusedPaymentInput === 'secondary' && secondaryPaymentMethod) {
      setSecondaryPaymentAmount(updater)
    } else if (focusedPaymentInput === 'card' && cardPaymentSelected) {
      setCardPaymentAmount(updater)
    } else if (focusedPaymentInput === 'cash' && cashPaymentSelected) {
      setReceivedAmount(updater)
    }
  }

  const handleNumpadPress = (val) => {
    // In non-payment mode, delegate to qty editing if a product is selected
    if (!showPaymentView && onNumpadQtyPress) {
      onNumpadQtyPress(val)
      return
    }
    // Payment mode: update the focused payment input
    if (val === 'clear') {
      setFocusedAmount('')
    } else if (val === 'backspace') {
      setFocusedAmount((prev) => prev.slice(0, -1))
    } else {
      setFocusedAmount((prev) => prev + String(val))
    }
  }

  useEffect(() => {
    if (!showPaymentView) return

    if (focusedPaymentInput === 'secondary' && secondaryPaymentMethod) {
      secondaryPaymentInputRef.current?.focus()
    } else if (focusedPaymentInput === 'card' && cardPaymentSelected) {
      cardPaymentInputRef.current?.focus()
    } else if (focusedPaymentInput === 'cash' && cashPaymentSelected) {
      receivedAmountInputRef.current?.focus()
    }
  }, [cardPaymentSelected, cashPaymentSelected, focusedPaymentInput, secondaryPaymentMethod, showPaymentView])

  return (
    <aside className='pos-sidebar-premium'>

      {/* Customer Search Card */}
      <div
        className='pos-sidebar-card customer-card'
        onClick={() => setIsCustomerModalOpen(true)}
      >
        <div className='customer-avatar'>
          <User size={20} className='text-accent' />
        </div>
        <div className='customer-info'>
          {customerId ? (
            <>
              <div className='customer-name'>{customerId.name}</div>
              {customerId.balance !== undefined && (
                <div style={{ fontSize: 11, color: '#1e9e52', fontWeight: 600, marginTop: 2 }}>
                  {t('pos.balance')}: {thousandDivider(customerId.balance, t('pos.currency_short'))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className='customer-placeholder'>{t('pos.customer_placeholder')}</div>
              <div className='customer-hint'>{t('pos.customer_hint')}</div>
            </>
          )}
        </div>
        {customerId ? (
          <button
            className='customer-remove-btn'
            onClick={(e) => {
              e.stopPropagation()
              removeDiscountCard({ data: { sale_id: saleId, customer_id: customerId.id } })
            }}
            title={t('pos.remove_customer')}
          >
            ✕
          </button>
        ) : (
          <ChevronRight size={18} className='text-muted' />
        )}
      </div>

      {!showPaymentView ? (
        <div className='pos-sidebar-flow'>
          {/* Numpad section with context hint */}
          <div className='numpad-container-title' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{onNumpadQtyPress ? t('table_columns.quantity') : t('pos.numpad_title')}</span>
            {onNumpadQtyPress && numpadQtyBuffer && (
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--pos-accent)',
                background: 'rgba(37,99,235,0.07)',
                padding: '2px 8px',
                borderRadius: 6,
                letterSpacing: 1,
              }}>
                {numpadQtyBuffer || '—'}
                {selectedItemIsWeight ? ' кг' : ' шт'}
              </span>
            )}
          </div>
          <Numpad
            onKeyPress={handleNumpadPress}
            showComma={!!(onNumpadQtyPress && selectedItemIsWeight)}
          />

          {/* Primary Checkout Button */}
          <button
            className='pos-primary-checkout-btn'
            onClick={onStartPaymentView}
            disabled={cartItems.length === 0}
          >
            <span>{t('pos.go_to_payment')}</span>
            <CornerDownLeft size={18} style={{ marginLeft: 8 }} />
          </button>
        </div>
      ) : (
        <div className='pos-sidebar-flow payment-flow-active'>
          {/* Payment Info Display Card */}
          <div className='pos-sidebar-card payment-summary-card'>
            <div className='payment-row'>
              <span className='payment-label'>{t('pos.total_compact')}</span>
              <span className='payment-val total'>{formatUZS(totalAmount)}</span>
            </div>

            {cashPaymentSelected && (
              <div className='payment-row border-top-dashed'>
                <span className='payment-label'>{t('pos.cash_payment_compact')}:</span>
                <div className='payment-input-wrapper'>
                  {/* inputMode='none': amounts are typed on the POS numpad; keep
                      the OS touch keyboard from flashing when the input is
                      auto-focused on payment-type selection */}
                  <input
                    ref={receivedAmountInputRef}
                    type='text'
                    inputMode='none'
                    value={receivedAmount ? formatNumberUZS(receivedAmount) : ''}
                    onChange={(e) => setReceivedAmount(e.target.value.replace(/\D/g, ''))}
                    onFocus={() => setFocusedPaymentInput('cash')}
                    placeholder={formatNumberUZS(totalAmount)}
                    className='received-amount-input'
                  />
                  <button
                    className='received-amount-clear'
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setReceivedAmount('')}
                  >
                    C
                  </button>
                </div>
              </div>
            )}

            {cardPaymentSelected && (
              <>
                <div className={`payment-row ${cashPaymentSelected ? '' : 'border-top-dashed'}`}>
                  <span className='payment-label'>{cardPaymentType === 'humo' ? 'Humo' : 'Uzcard'}:</span>
                  <div className='payment-input-wrapper'>
                    <input
                      ref={cardPaymentInputRef}
                      type='text'
                      inputMode='none'
                      value={cardPaymentAmount ? formatNumberUZS(cardPaymentAmount) : ''}
                      onChange={(e) => setCardPaymentAmount(e.target.value.replace(/\D/g, ''))}
                      onFocus={() => setFocusedPaymentInput('card')}
                      placeholder={formatNumberUZS(Math.max(totalAmount - Number(receivedAmount || 0) - Number(secondaryPaymentAmount || 0), 0))}
                      className='received-amount-input'
                    />
                    <button
                      className='received-amount-clear'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setCardPaymentAmount('')}
                    >
                      C
                    </button>
                  </div>
                </div>
                <div className='payment-row' style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--pos-text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type='checkbox'
                      checked={cartOwnerType === 'corporative'}
                      onChange={(e) => setCartOwnerType(e.target.checked ? 'corporative' : 'physical')}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--pos-accent)' }}
                    />
                    Корпоративная карта
                  </label>
                </div>
              </>
            )}

            {secondaryPaymentMethod && (
              <div className={`payment-row ${cashPaymentSelected || cardPaymentSelected ? '' : 'border-top-dashed'}`}>
                <span className='payment-label'>{paymentLabels[secondaryPaymentMethod]}:</span>
                <div className='payment-input-wrapper'>
                  <input
                    ref={secondaryPaymentInputRef}
                    type='text'
                    inputMode='none'
                    value={secondaryPaymentAmount ? formatNumberUZS(secondaryPaymentAmount) : ''}
                    onChange={(e) => setSecondaryPaymentAmount(e.target.value.replace(/\D/g, ''))}
                    onFocus={() => setFocusedPaymentInput('secondary')}
                    placeholder={formatNumberUZS(Math.max(totalAmount - Number(receivedAmount || 0) - Number(cardPaymentAmount || 0), 0))}
                    className='received-amount-input'
                  />
                  <button
                    className='received-amount-clear'
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSecondaryPaymentAmount('')}
                  >
                    C
                  </button>
                </div>
              </div>
            )}

            {cashPaymentSelected && totalPaid >= totalAmount && (
              <div className='payment-row result-row success'>
                <span>{t('pos.change')}</span>
                <span className='monospace'>{formatUZS(totalPaid - totalAmount)}</span>
              </div>
            )}

            {totalPaid < totalAmount && (
              <div className='payment-row result-row danger'>
                <span>{t('pos.remaining')}</span>
                <span className='monospace'>{formatUZS(totalAmount - totalPaid)}</span>
              </div>
            )}
          </div>

          {/* Cash Bills Quick Select */}
          <div className='cash-bills-grid'>
            {[5000, 10000, 20000, 50000, 100000, 200000].map((val) => {
              let billClass = 'uzs-5k'
              if (val === 10000) billClass = 'uzs-10k'
              if (val === 20000) billClass = 'uzs-20k'
              if (val === 50000) billClass = 'uzs-50k'
              if (val === 100000) billClass = 'uzs-100k'
              if (val === 200000) billClass = 'uzs-200k'

              const isNonCashFocused = focusedPaymentInput !== 'cash';
              const isDisabled = isNonCashFocused && val > Number(totalAmount || 0);

              return (
                <button
                  key={val}
                  type='button'
                  className={`cash-bill-btn ${billClass}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleQuickCash(val)}
                  disabled={isDisabled}
                  style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                >
                  {formatNumberUZS(val)}
                </button>
              )
            })}
          </div>
          <Numpad onKeyPress={handleNumpadPress} />

          {/* Action Buttons: Confirm & Back */}
          <div className='payment-action-buttons'>
            <button
              className='payment-back-btn'
              onClick={() => setShowPaymentView(false)}
            >
              <ArrowLeft size={24} />
            </button>

            <button
              className='payment-confirm-btn'
              onClick={handleCheckout}
              disabled={isCheckoutLoading || cartItems.length === 0 || totalPaid < totalAmount}
            >
              {isCheckoutLoading ? t('pos.payment_processing') : t('pos.complete_payment')}
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
