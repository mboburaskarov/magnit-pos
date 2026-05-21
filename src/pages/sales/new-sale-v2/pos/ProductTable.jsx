import { useTranslation } from 'react-i18next'
import thousandDivider from '@utils/thousandDivider'
import { ScanBarcode } from 'lucide-react'
import QuantityStepper from './QuantityStepper'
import './PosLayout.css'
import { Sd } from '@mui/icons-material'

export default function ProductTable({ cartItems = [], selectedId, onSelectRow, onQtyIncrease, onQtyDecrease, onQtyDecreaseRequestSecurity, isLoading }) {
  const { t } = useTranslation()

  const handleDecrease = (item) => {
    if (item.quantity <= 1 && (item.unit_quantity || 0) === 0) {
      onQtyDecreaseRequestSecurity?.(item)
    } else {
      onQtyDecrease?.(item)
    }
  }

  return (
    <div className='pos-table-wrapper'>
      <table className='pos-table-premium'>
        <thead>
          <tr>
            <th className='col-num'>#</th>
            <th className='col-barcode'>{t('table_columns.barcode')}</th>
            <th className='col-name'>{t('create_new_product.product_name')}</th>
            <th className='col-qty'>{t('table_columns.quantity')}</th>
            <th className='col-unit'>{t('unit_short')}</th>
            <th className='col-price text-right'>{t('price')}</th>
            <th className='col-discount text-right'>{t('discount')}</th>
            <th className='col-total text-right'>{t('total')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className='pos-table-loading'>
                <div className='loading-spinner-placeholder'>{t('pos.loading')}</div>
              </td>
            </tr>
          ) : cartItems.length === 0 ? (
            <tr>
              <td colSpan={8} className='pos-table-empty'>
                <div className='empty-state-container'>
                  <div className='scanner-glowing-wrapper'>
                    <div className='scanner-target-box'>
                      <div className='scanner-corner corner-tl'></div>
                      <div className='scanner-corner corner-tr'></div>
                      <div className='scanner-corner corner-bl'></div>
                      <div className='scanner-corner corner-br'></div>
                      <div className='scanner-laser-line'></div>
                      <ScanBarcode size={44} className='scanner-barcode-icon' />
                    </div>
                  </div>
                  <div className='empty-state-title'>{t('pos.scan_barcode')}</div>
                  <div className='empty-state-subtitle'>{t('pos.scan_barcode_hint')}</div>
                </div>
              </td>
            </tr>
          ) : (
            cartItems.map((item, index) => {
              const isSelected = item.id === selectedId
              return (
                <tr key={item.id} className={`pos-table-row ${isSelected ? 'is-selected' : ''}`} onClick={() => onSelectRow?.(item.id)}>
                  <td className='col-num'>{index + 1}</td>
                  <td className='col-barcode'>
                    <span className='barcode-text'>{item.barcode || item.store_product_id || '—'}</span>
                  </td>
                  <td className='col-name'>
                    <div className='product-name-container' title={item.name}>
                      {item.name}
                    </div>
                  </td>
                  <td className='col-qty'>
                    <QuantityStepper item={item} onIncrease={onQtyIncrease} onDecrease={handleDecrease} />
                  </td>
                  <td className='col-unit'>
                    <span className='unit-badge'>{item.unit_per_pack > 1 && item.unit_quantity > 0 ? `${item.unit_quantity} шт` : 'уп'}</span>
                  </td>
                  <td className='col-price text-right'>{thousandDivider(item.unit_price)}</td>
                  <td className='col-discount text-right text-muted'>{item.discount_price > 0 ? thousandDivider(item.discount_price) : '0.00'}</td>
                  <td className='col-total text-right font-bold'>{thousandDivider(item.total_price)}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
