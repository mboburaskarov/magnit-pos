import { useTranslation } from 'react-i18next'
import thousandDivider from '@utils/thousandDivider'
import { formatNumberUZS } from '@utils/formatUZS'
import { ScanBarcode } from 'lucide-react'
import QuantityStepper from './QuantityStepper'
import './PosLayout.css'
import { Sd } from '@mui/icons-material'

export default function ProductTable({
  cartItems = [],
  selectedId,
  onSelectRow,
  onQtyIncrease,
  onQtyDecrease,
  onQtyDecreaseRequestSecurity,
  isLoading,
  pendingQuantityUpdates = {},
  pendingNewItems = {},
}) {
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
            <th className='col-name'>{t('pos.product_name_header')}</th>
            <th className='col-qty'>{t('table_columns.quantity')}</th>
            <th className='col-price text-right'>{t('price')}</th>
            <th className='col-total text-right'>{t('total')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className='pos-table-loading'>
                <div className='loading-spinner-placeholder'>{t('pos.loading')}</div>
              </td>
            </tr>
          ) : cartItems.length === 0 && Object.keys(pendingNewItems).length === 0 ? (
            <tr>
              <td colSpan={6} className='pos-table-empty'>
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
            <>
              {cartItems.map((item, index) => {
                const isSelected = item.id === selectedId
                const isUpdating = !!(pendingQuantityUpdates[item.id] || pendingQuantityUpdates[item.store_product_id] || pendingQuantityUpdates[item.barcode])
                return (
                  <tr
                    key={item.id}
                    className={`pos-table-row ${isSelected ? 'is-selected' : ''} ${isUpdating ? 'pos-row-updating' : ''}`}
                    onClick={() => onSelectRow?.(item.id)}
                    style={isUpdating ? { opacity: 0.8, backgroundColor: 'rgba(243, 244, 246, 0.2)' } : undefined}
                  >
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
                      {item.unit_per_pack === 1000 ? (
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 12px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '14px',
                          color: '#0f172a',
                          border: '1px solid #e2e8f0',
                          minWidth: '60px',
                          textAlign: 'center'
                        }}>
                          {(() => {
                            const grams = (item.quantity || 0) * 1000 + (item.unit_quantity || 0)
                            return `${(grams / 1000).toFixed(3).replace('.', ',')} кг`
                          })()}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <QuantityStepper
                            item={item}
                            onIncrease={onQtyIncrease}
                            onDecrease={handleDecrease}
                            isLoading={isUpdating}
                          />
                          <span className='unit-badge'>
                            {item.unit_per_pack > 1 && item.unit_quantity > 0
                              ? `${item.unit_quantity} шт`
                              : 'уп'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className='col-price text-right'>{formatNumberUZS(item.unit_price)}</td>
                    <td className='col-total text-right font-bold'>{formatNumberUZS(item.total_price)}</td>
                  </tr>
                )
              })}

              {/* Pending new items skeletons */}
              {Object.keys(pendingNewItems).map((pendingBarcode, idx) => (
                <tr key={`skeleton-${pendingBarcode}`} className="pos-table-row is-skeleton">
                  <td className='col-num'>{cartItems.length + idx + 1}</td>
                  <td className='col-barcode'>
                    <span className='barcode-text skeleton-shimmer' style={{ display: 'inline-block', minWidth: '80px', height: '14px' }}>
                      {pendingBarcode}
                    </span>
                  </td>
                  <td className='col-name'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className='skeleton-shimmer' style={{ display: 'inline-block', width: '120px', height: '16px' }} />
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                        (Добавляем товар...)
                      </span>
                    </div>
                  </td>
                  <td className='col-qty'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className='qty-skeleton skeleton-shimmer' />
                      <span className='unit-badge skeleton-shimmer' style={{ width: '24px', height: '18px' }} />
                    </div>
                  </td>
                  <td className='col-price text-right'>
                    <span className='skeleton-shimmer' style={{ display: 'inline-block', width: '50px', height: '18px' }} />
                  </td>
                  <td className='col-total text-right'>
                    <span className='skeleton-shimmer' style={{ display: 'inline-block', width: '50px', height: '18px' }} />
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
