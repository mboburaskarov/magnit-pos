import { useEffect, useRef } from 'react'
import './PosLayout.css'
import thousandDivider from '@utils/thousandDivider'

function PosProductSelectModal({ open, products, onSelect, onCancel, t }) {
  const listRef = useRef(null)

  useEffect(() => {
    if (open) {
      listRef.current?.focus()
    }
  }, [open])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onCancel()
  }

  if (!open || !products?.length) return null

  return (
    <div className='pos-modal-overlay' role='dialog' aria-modal='true' onKeyDown={handleKeyDown}>
      <div className='pos-product-select-modal' ref={listRef} tabIndex={-1}>
        <div className='pos-product-select-header'>
          <span className='pos-product-select-title'>Mahsulotni tanlang</span>
          <span className='pos-product-select-count'>{products.length} ta topildi</span>
        </div>

        <div className='pos-product-select-list'>
          {products.map((product) => (
            <button
              key={product.id}
              type='button'
              className='pos-product-select-item'
              onClick={() => onSelect(product)}
            >
              <div className='pos-product-select-item-name'>{product.name}</div>
              <div className='pos-product-select-item-meta'>
                <span className='pos-product-select-item-price'>
                  {thousandDivider(product.retail_price)} сум
                </span>
                <span className='pos-product-select-item-qty'>
                  {product.pack_quantity ?? 0} дона
                </span>
                {product.barcode && (
                  <span className='pos-product-select-item-barcode'>{product.barcode}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className='pos-security-actions' style={{ padding: '12px 16px' }}>
          <button type='button' onClick={onCancel} className='pos-security-btn-cancel' style={{ flex: 1 }}>
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  )
}

export default PosProductSelectModal
