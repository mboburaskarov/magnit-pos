import React from 'react'
import { User, CreditCard, ChevronRight, CornerDownLeft, Sparkles } from 'lucide-react'
import thousandDivider from '@utils/thousandDivider'
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
  paymentMethod,
  setPaymentMethod,
  receivedAmount,
  setReceivedAmount,
  totalAmount,
  handleQuickCash,
  handleCheckout,
  isCheckoutLoading,
  cartItems,
  t,
}) {
  const receiptNumber = cashBoxDetails?.data?.data?.sale_number || '--'

  const handleNumpadPress = (val) => {
    if (val === 'clear') {
      setReceivedAmount('')
    } else if (val === 'backspace') {
      setReceivedAmount((prev) => prev.slice(0, -1))
    } else {
      setReceivedAmount((prev) => prev + String(val))
    }
  }

  return (
    <aside className='pos-sidebar-premium'>
      {/* Receipt Info Card */}
      <div className='pos-sidebar-card info-card'>
        <div className='info-row'>
          <span className='info-label'>{t('pos.receipt_id')}</span>
          <span className='info-value font-bold'>{receiptNumber}</span>
        </div>
        <div className='info-row'>
          <span className='info-label'>{t('pos.price_list')}</span>
          <span className='info-value'>{t('pos.standard')}</span>
        </div>
      </div>

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
              <div className='customer-card-num'>
                {t('card')}: {customerId.barcode || `ID: ${customerId.id}`}
              </div>
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
              removeDiscountCard({ sale_id: saleId })
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
          {/* Numpad Container */}
          <div className='numpad-container-title'>
            {t('pos.numpad_title')}
          </div>
          <Numpad onKeyPress={handleNumpadPress} />

          {/* Primary Checkout Button */}
          <button 
            className='pos-primary-checkout-btn'
            onClick={() => setShowPaymentView(true)}
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
              <span className='payment-label'>{t('pos.total_payment')}</span>
              <span className='payment-val total'>{thousandDivider(totalAmount)} UZS</span>
            </div>

            {paymentMethod === 'cash' && (
              <>
                <div className='payment-row border-top-dashed'>
                  <span className='payment-label'>{t('pos.customer_received')}</span>
                  <div className='payment-input-wrapper'>
                    <input
                      type='number'
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      placeholder={String(totalAmount)}
                      className='received-amount-input'
                    />
                    <button
                      className='received-amount-clear'
                      onClick={() => setReceivedAmount('')}
                    >
                      C
                    </button>
                  </div>
                </div>

                {Number(receivedAmount) > totalAmount && (
                  <div className='payment-row result-row success'>
                    <span>{t('pos.change')}</span>
                    <span className='monospace'>{thousandDivider(Number(receivedAmount) - totalAmount)} UZS</span>
                  </div>
                )}

                {Number(receivedAmount) > 0 && Number(receivedAmount) < totalAmount && (
                  <div className='payment-row result-row danger'>
                    <span>{t('pos.remaining')}</span>
                    <span className='monospace'>{thousandDivider(totalAmount - Number(receivedAmount))} UZS</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className='payment-methods-grid'>
            <button
              className={`method-select-btn ${paymentMethod === 'cash' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              {t('pos.cash_payment')}
            </button>
            <button
              className={`method-select-btn ${paymentMethod === 'card' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              {t('pos.card_payment')}
            </button>
          </div>

          {/* Online Provider Tabs */}
          <div className='online-providers-grid'>
            <button
              className={`provider-select-btn click ${paymentMethod === 'click' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('click')}
            >
              Click
            </button>
            <button
              className={`provider-select-btn payme ${paymentMethod === 'payme' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('payme')}
            >
              Payme
            </button>
            <button
              className={`provider-select-btn uzum ${paymentMethod === 'uzum' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('uzum')}
            >
              Uzum
            </button>
          </div>

          {/* Cash Bills Quick Select */}
          {paymentMethod === 'cash' && (
            <div className='cash-bills-grid'>
              {[5000, 10000, 20000, 50000, 100000, 200000].map((val) => {
                let billClass = 'uzs-5k'
                if (val === 10000) billClass = 'uzs-10k'
                if (val === 20000) billClass = 'uzs-20k'
                if (val === 50000) billClass = 'uzs-50k'
                if (val === 100000) billClass = 'uzs-100k'
                if (val === 200000) billClass = 'uzs-200k'

                return (
                  <button
                    key={val}
                    type='button'
                    className={`cash-bill-btn ${billClass}`}
                    onClick={() => handleQuickCash(val)}
                  >
                    {thousandDivider(val)}
                  </button>
                )
              })}
            </div>
          )}

          {/* Action Buttons: Confirm & Back */}
          <div className='payment-action-buttons'>
            <button
              className='payment-confirm-btn'
              onClick={handleCheckout}
              disabled={isCheckoutLoading || cartItems.length === 0}
            >
              {isCheckoutLoading ? t('pos.payment_processing') : t('pos.complete_payment')}
            </button>
            
            <button 
              className='payment-back-btn'
              onClick={() => setShowPaymentView(false)}
            >
              {t('pos.back')}
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
