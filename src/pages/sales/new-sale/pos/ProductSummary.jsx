import React from 'react'
import thousandDivider from '@utils/thousandDivider'
import { formatUZS, formatNumberUZS } from '@utils/formatUZS'
import { PackageSearch } from 'lucide-react'
import './PosLayout.css'

export default function ProductSummary({
  cartItems = [],
  selectedId,
  totalAmount,
  totalDiscount,
  t,
}) {
  // Find selected item
  const selectedItem = cartItems.find((item) => item.id === selectedId)

  return (
    <div className='pos-summary-bar-premium'>
      {/* Active product preview card */}
      <div className='pos-active-product-preview'>
        {selectedItem ? (
          <div className='active-product-card'>
            <div className='active-product-header'>
              <span className='active-badge'>{t('pos.selected_item')}</span>
              <span className='active-barcode-text'>
                {selectedItem.barcode || selectedItem.store_product_id}
              </span>
            </div>
            <div className='active-product-name'>
              {selectedItem.name}
            </div>
            <div className='active-product-calc'>
              <span className='calc-math'>
                {selectedItem.unit_per_pack > 1 && selectedItem.unit_quantity > 0 ? (
                  `${selectedItem.unit_quantity} ${selectedItem.unit_per_pack === 1000 ? (t('pos.unit.g') || 'г') : (t('pos.unit.pcs') || 'шт')} × `
                ) : (
                  `${selectedItem.quantity} ${t('pos.unit.pack') || 'уп'} × `
                )}
                {formatNumberUZS(selectedItem.unit_price)} UZS
              </span>
              {selectedItem.discount_price > 0 && (
                <span className='calc-discount'>
                  ({t('pos.discount_label')}: −{formatNumberUZS(selectedItem.discount_price)} UZS)
                </span>
              )}
              <span className='calc-total'>
                = {formatUZS(selectedItem.total_price)}
              </span>
            </div>
          </div>
        ) : (
          <div className='active-product-card-placeholder'>
            <span style={{ maxWidth: '200px' }}>{t('pos.selected_item_placeholder')}</span>
          </div>
        )}
      </div>

      {/* Grand totals and receipt total */}
      <div className='pos-receipt-totals'>
        <div className='totals-line discount'>
          <span className='totals-label'>{t('discount')}:</span>
          <span className='totals-val'>−{formatUZS(totalDiscount)}</span>
        </div>
        <div className='totals-line grand-total'>
          <span className='totals-label'>{t('pos.receipt_total')}</span>
          <span className='totals-val'>{formatNumberUZS(totalAmount)} <span className='currency'>UZS</span></span>
        </div>
      </div>
    </div>
  )
}
