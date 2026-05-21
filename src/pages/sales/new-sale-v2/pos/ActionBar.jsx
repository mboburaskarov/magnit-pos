import React from 'react'
import { Printer, Percent, Pause, Ban, Trash2, RotateCcw, Zap } from 'lucide-react'
import './PosLayout.css'

export default function ActionBar({
  onPrint,
  onDiscount,
  onPostpone,
  onCancelSale,
  onDeleteProduct,
  onReturn,
  hasSelectedProduct,
  showQuickProducts,
  onToggleQuickProducts,
  t,
}) {
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
