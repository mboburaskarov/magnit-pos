import React from 'react'
import './PosLayout.css'

const QUICK_PRODUCTS = [
  { id: 'bag_small', translationKey: 'pos.quick.bag_small', icon: '🛍️', query: 'paket' },
  { id: 'bag_large', translationKey: 'pos.quick.bag_large', icon: '🛍️', query: 'paket' },
  { id: 'watermelon', translationKey: 'pos.quick.watermelon', icon: '🍉', query: 'tarvuz' },
  { id: 'melon', translationKey: 'pos.quick.melon', icon: '🍈', query: 'qovun' },
  { id: 'water', translationKey: 'pos.quick.water', icon: '💧', query: 'suv' },
  { id: 'bread', translationKey: 'pos.quick.bread', icon: '🥖', query: 'non' },
  { id: 'milk', translationKey: 'pos.quick.milk', icon: '🥛', query: 'sut' },
]

export default function PosQuickProducts({ onQuickAdd, isLoading, t }) {
  return (
    <div className='pos-quick-products-container'>
      <div className='quick-products-header'>
        <span className='quick-products-title'>{t('pos.quick_select')}</span>
      </div>
      <div className='quick-products-grid'>
        {QUICK_PRODUCTS.map((prod) => (
          <button
            key={prod.id}
            type='button'
            className='quick-product-card-btn'
            onClick={() => onQuickAdd(prod.query)}
            disabled={isLoading}
          >
            <span className='quick-product-icon'>{prod.icon}</span>
            <span className='quick-product-name'>{t(prod.translationKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
