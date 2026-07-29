import { Printer, RotateCcw, Eye, Edit3, Ban, Slash, Zap, CreditCard } from 'lucide-react'
import './PosLayout.css'

// Helper: blur focused element after any action button click so scanner Enter
// does not re-trigger the same button.
const blurActiveBtn = () => {
  setTimeout(() => document.activeElement?.blur(), 0)
}

export default function ActionBar({
  customerId,
  onPrint,
  onReturn,
  onOpenSearch,
  onEditQuantity,
  onCancelSale,
  onStornoProduct,
  hasSelectedProduct,
  showQuickProducts,
  onToggleQuickProducts,
  showPaymentView,
  cashPaymentSelected,
  cardPaymentSelected,
  cardPaymentType,
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
            onClick={(e) => { onSelectCashPayment(); blurActiveBtn() }}
            disabled={shouldDisableInactive && !cashPaymentSelected}
            type='button'
          >
            <span style={{ fontSize: 18, marginRight: 6 }}>💵</span>
            {t('cash')}
          </button>
          <button
            className={`method-select-btn ${cardPaymentType === 'uzcard' ? 'is-active' : ''}`}
            onClick={() => { onSelectCardPayment('uzcard'); blurActiveBtn() }}
            disabled={shouldDisableInactive && cardPaymentType !== 'uzcard'}
            type='button'
          >
            <img src="/images/uzcard.png" alt="Uzcard" className="payment-icon" />
            Uzcard
          </button>
          <button
            className={`method-select-btn ${cardPaymentType === 'humo' ? 'is-active' : ''}`}
            onClick={() => { onSelectCardPayment('humo'); blurActiveBtn() }}
            disabled={shouldDisableInactive && cardPaymentType !== 'humo'}
            type='button'
          >
            <img src="/images/humo.png" alt="Humo" className="payment-icon" />
            Humo
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'click' ? 'is-active' : ''}`}
            onClick={() => { onSelectSecondaryPayment('click'); blurActiveBtn() }}
            disabled={(shouldDisableInactive && secondaryPaymentMethod !== 'click') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'click')}
            type='button'
          >
            <img src="/images/click.png" alt="Click" className="payment-icon" />
            Click
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'payme' ? 'is-active' : ''}`}
            onClick={() => { onSelectSecondaryPayment('payme'); blurActiveBtn() }}
            disabled={(shouldDisableInactive && secondaryPaymentMethod !== 'payme') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'payme')}
            type='button'
          >
            <img src="/images/payme.png" alt="Payme" className="payment-icon" />
            Payme
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'uzum' ? 'is-active' : ''}`}
            onClick={() => { onSelectSecondaryPayment('uzum'); blurActiveBtn() }}
            disabled={(shouldDisableInactive && secondaryPaymentMethod !== 'uzum') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'uzum')}
            type='button'
          >
            <img src="/uzum.png" alt="Uzum" className="payment-icon" />
            Uzum
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'munis' ? 'is-active' : ''}`}
            onClick={() => { onSelectSecondaryPayment('munis'); blurActiveBtn() }}
            disabled={(shouldDisableInactive && secondaryPaymentMethod !== 'munis') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'munis')}
            type='button'
          >
            UzQR
          </button>
          <button
            className={`method-select-btn ${secondaryPaymentMethod === 'loyaltycard' ? 'is-active' : ''}`}
            onClick={() => { onSelectSecondaryPayment('loyaltycard'); blurActiveBtn() }}
            disabled={!customerId || (shouldDisableInactive && secondaryPaymentMethod !== 'loyaltycard') || Boolean(secondaryPaymentMethod && secondaryPaymentMethod !== 'loyaltycard')}
            type='button'
          >
            <CreditCard size={18} className="payment-icon-svg" style={{ marginRight: 6 }} />
            {t('balans')} {customerId ? `(${customerId.balance || 0})` : ''}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='pos-action-bar-premium'>
      {/* 1. Print */}
      <button className='action-btn neutral-btn' onClick={() => { onPrint(); blurActiveBtn() }} type='button'>
        <Printer size={16} />
        <span>{t('print')}</span>
      </button>

      {/* 2. Return / Sales */}
      <button className='action-btn neutral-btn' onClick={() => { onReturn(); blurActiveBtn() }} type='button'>
        <RotateCcw size={16} />
        <span>{t('sales') || 'Продажи'}</span>
      </button>

      {/* 3. Preview / Search */}
      <button className='action-btn neutral-btn' onClick={(e) => { e.currentTarget.blur(); onOpenSearch() }} type='button'>
        <Eye size={16} />
        <span>{t('pos.preview') || 'Просмотр'}</span>
      </button>

      {/* 4. MagnitGO (coming soon) */}
      <button className='action-btn neutral-btn' disabled type='button'>
        <span>MagnitGO</span>
        <span className='soon-badge'>{t('pos.magnitgo_soon') || 'Скоро'}</span>
      </button>

      {/* 5. Edit Quantity (replaces Discount/Скидка) */}
      <button
        className={`action-btn ${hasSelectedProduct ? 'neutral-btn' : 'danger-btn-disabled'}`}
        onClick={() => { if (hasSelectedProduct) { onEditQuantity(); blurActiveBtn() } }}
        disabled={!hasSelectedProduct}
        type='button'
      >
        <Edit3 size={16} />
        <span>{t('pos.edit_quantity') || 'Изменить кол-во'}</span>
      </button>

      {/* 6. Cancel receipt */}
      <button className='action-btn danger-outline-btn' onClick={() => { onCancelSale(); blurActiveBtn() }} type='button'>
        <Ban size={16} />
        <span>{t('pos.cancel_receipt') || 'Отмена чека'}</span>
      </button>

      {/* 7. Storno / Remove item */}
      <button
        className={`action-btn ${hasSelectedProduct ? 'danger-btn-active' : 'danger-btn-disabled'}`}
        onClick={() => { if (hasSelectedProduct) { onStornoProduct(); blurActiveBtn() } }}
        disabled={!hasSelectedProduct}
        type='button'
      >
        <Slash size={16} />
        <span>{t('pos.remove_item') || 'Убрать товар'}</span>
      </button>

      {/* 8. Quick select */}
      <button
        className={`action-btn ${showQuickProducts ? 'active-quick-btn' : 'neutral-btn'}`}
        onClick={() => { onToggleQuickProducts(); blurActiveBtn() }}
        type='button'
      >
        <Zap size={16} />
        <span>{t('pos.quick_select') || 'Быстрый выбор'}</span>
      </button>
    </div>
  )
}
