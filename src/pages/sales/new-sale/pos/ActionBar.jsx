import { Printer, Percent, Pause, Ban, Trash2, Zap } from 'lucide-react'
import './PosLayout.css'

export default function ActionBar({
  customerId,
  onPrint,
  onDiscount,
  onPostpone,
  onCancelSale,
  onDeleteProduct,
  hasSelectedProduct,
  showQuickProducts,
  onToggleQuickProducts,
  showPaymentView,
  cashPaymentSelected,
  cardPaymentSelected,
  cardPaymentAmount,
  secondaryPaymentMethod,
  secondaryPaymentAmount,
  onSelectCashPayment,
  onSelectCardPayment,
  onSelectSecondaryPayment,
  receivedAmount,
  totalAmount,
  t,
}) {
  const selectedPaymentCount = [cashPaymentSelected, cardPaymentSelected, Boolean(secondaryPaymentMethod)]
    .filter(Boolean).length
  const totalPaid =
    (cashPaymentSelected ? Number(receivedAmount || 0) : 0) +
    (cardPaymentSelected ? Number(cardPaymentAmount || 0) : 0) +
    Number(secondaryPaymentAmount || 0)
  const isPaymentAmountEnough = totalPaid >= Number(totalAmount) && Number(totalAmount) > 0
  const shouldDisableInactive = isPaymentAmountEnough || selectedPaymentCount >= 2

  if (showPaymentView) {
    return (
      <div className='pos-action-bar-premium payment-methods-action-grid'>
        <div className='payment-methods-action-row'>
          <button
            className={`method-select-btn ${cashPaymentSelected ? 'is-active' : ''}`}
            onClick={onSelectCashPayment}
            disabled={shouldDisableInactive && !cashPaymentSelected}
            type='button'
          >
            <span style={{ fontSize: 18, marginRight: 6 }}>💵</span>
            Naqd
          </button>
          <button
            className={`method-select-btn ${cardPaymentSelected ? 'is-active' : ''}`}
            onClick={onSelectCardPayment}
            disabled={shouldDisableInactive && !cardPaymentSelected}
            type='button'
          >
            <img src="/images/uzcard.png" alt="Terminal" className="payment-icon" />
            Terminal
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'click' ? 'is-active' : ''}`}
            onClick={() => onSelectSecondaryPayment('click')}
            disabled={(shouldDisableInactive && secondaryPaymentMethod !== 'click') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'click')}
            type='button'
          >
            <img src="/images/click.png" alt="Click" className="payment-icon" />
            Click
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'payme' ? 'is-active' : ''}`}
            onClick={() => onSelectSecondaryPayment('payme')}
            disabled={(shouldDisableInactive && secondaryPaymentMethod !== 'payme') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'payme')}
            type='button'
          >
            <img src="/images/payme.png" alt="Payme" className="payment-icon" />
            Payme
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'uzum' ? 'is-active' : ''}`}
            onClick={() => onSelectSecondaryPayment('uzum')}
            disabled={(shouldDisableInactive && secondaryPaymentMethod !== 'uzum') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'uzum')}
            type='button'
          >
            <span style={{ fontSize: 18, marginRight: 6 }}>🟣</span>
            Uzum
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'loyaltycard' ? 'is-active' : ''}`}
            onClick={() => onSelectSecondaryPayment('loyaltycard')}
            disabled={!customerId || (shouldDisableInactive && secondaryPaymentMethod !== 'loyaltycard') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'loyaltycard')}
            type='button'
          >
            <span style={{ fontSize: 18, marginRight: 6 }}>🎁</span>
            Balans {customerId ? `(${customerId.balance || 0})` : ''}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='pos-action-bar-premium'>
      {/* General Actions */}
      <button className='action-btn neutral-btn' onClick={onPrint} type='button'>
        <Printer size={16} />
        <span>{t('print')}</span>
      </button>

      <button className='action-btn neutral-btn' onClick={onDiscount} type='button'>
        <Percent size={16} />
        <span>{t('menu.orders.new_order.cart_container.discount')}</span>
      </button>

      <button className='action-btn neutral-btn' onClick={onPostpone} type='button'>
        <Pause size={16} />
        <span>{t('menu.orders.all.postpone')}</span>
      </button>

      {/* Tezkor Toggle Button */}
      <button 
        className={`action-btn ${showQuickProducts ? 'active-quick-btn' : 'neutral-btn'}`}
        onClick={onToggleQuickProducts} 
        type='button'
      >
        <Zap size={16} />
        <span>{t('pos.quick_select')}</span>
      </button>

      {/* Danger/Cancel buttons */}
      <button className='action-btn danger-outline-btn' onClick={onCancelSale} type='button'>
        <Ban size={16} />
        <span>{t('pos.cancel_receipt')}</span>
      </button>

      <button 
        className={`action-btn ${hasSelectedProduct ? 'danger-btn-active' : 'danger-btn-disabled'}`}
        onClick={onDeleteProduct} 
        disabled={!hasSelectedProduct}
        type='button'
      >
        <Trash2 size={16} />
        <span>{t('pos.remove_item')}</span>
      </button>
    </div>
  )
}
