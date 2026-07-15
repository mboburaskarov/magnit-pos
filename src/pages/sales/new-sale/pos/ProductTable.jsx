import { useTranslation } from 'react-i18next'
import thousandDivider from '@utils/thousandDivider'
import { formatNumberUZS } from '@utils/formatUZS'
import { ScanBarcode } from 'lucide-react'
import QuantityStepper from './QuantityStepper'
import './PosLayout.css'

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
  stornedIds = new Set(),
}) {
  const { t } = useTranslation()

  const handleDecrease = (item) => {
    if (item.is_frontend_storno || item.is_storno || stornedIds.has(item.id)) return // no interaction with storned rows
    if (item.quantity <= 1 && (item.unit_quantity || 0) === 0) {
      onQtyDecreaseRequestSecurity?.(item)
    } else {
      onQtyDecrease?.(item)
    }
  }

  const handleIncrease = (item) => {
    if (item.is_frontend_storno || item.is_storno || stornedIds.has(item.id)) return
    onQtyIncrease?.(item)
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
              {/* Pending new items skeletons rendered at the top */}
              {Object.entries(pendingNewItems)
                .filter(([pendingBarcode, timestamp]) => {
                  const isStale = typeof timestamp === 'number' && Date.now() - timestamp > 15000
                  const exists = cartItems.some((item) => item.barcode === pendingBarcode)
                  return !isStale && !exists
                })
                .map(([pendingBarcode], idx) => (
                  <tr key={`skeleton-${pendingBarcode}`} className="pos-table-row is-skeleton">
                    <td className='col-num'>{idx + 1}</td>
                    <td className='col-barcode'>
                      <span className='barcode-text skeleton-shimmer' style={{ display: 'inline-block', minWidth: '80px', height: '14px' }}>
                        {pendingBarcode}
                      </span>
                    </td>
                    <td className='col-name'>
                      <span className='skeleton-shimmer' style={{ display: 'inline-block', width: '120px', height: '16px' }} />
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

              {cartItems.map((item, index) => {
                const isSelected = item.id === selectedId
                const isStorned = item.is_frontend_storno || item.is_storno || stornedIds.has(item.id)
                const isUpdating = !isStorned && !!(
                  pendingQuantityUpdates[item.id] ||
                  pendingQuantityUpdates[item.store_product_id] ||
                  pendingQuantityUpdates[item.barcode]
                )
                const activeSkeletonsCount = Object.entries(pendingNewItems).filter(([pendingBarcode, timestamp]) => {
                  const isStale = typeof timestamp === 'number' && Date.now() - timestamp > 15000
                  const exists = cartItems.some((el) => el.barcode === pendingBarcode)
                  return !isStale && !exists
                }).length

                return (
                  <tr
                    key={item.id}
                    className={`pos-table-row ${isSelected ? 'is-selected' : ''} ${isUpdating ? 'pos-row-updating' : ''} ${isStorned ? 'pos-row-storned' : ''}`}
                    onClick={() => {
                      if (isStorned) return
                      onSelectRow?.(item.id)
                    }}
                    style={isUpdating ? { opacity: 0.8, backgroundColor: 'rgba(243, 244, 246, 0.2)' } : undefined}
                  >
                    <td className='col-num'>{activeSkeletonsCount + index + 1}</td>
                    <td className='col-barcode'>
                      <span className='barcode-text'>{item.barcode || item.store_product_id || '—'}</span>
                    </td>
                    <td className='col-name'>
                      <div className='product-name-container' title={item.name}>
                        {item.name}
                        {isStorned && (
                          <span className='storno-badge'>{t('pos.storno_badge') || 'STORNO'}</span>
                        )}
                      </div>
                    </td>
                    <td className='col-qty'>
                      {item.unit_per_pack === 1000 ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 12px',
                          backgroundColor: isStorned ? '#f7f9fc' : '#f1f2f5',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '14px',
                          color: isStorned ? '#9ca3af' : '#111217',
                          border: '1px solid #e9ebf0',
                          minWidth: '60px',
                          textAlign: 'center',
                          textDecoration: isStorned ? 'line-through' : 'none',
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
                            onIncrease={isStorned ? undefined : handleIncrease}
                            onDecrease={isStorned ? undefined : handleDecrease}
                            isLoading={isUpdating}
                            disabled={isStorned}
                          />
                          <span className='unit-badge' style={isStorned ? { textDecoration: 'line-through', opacity: 0.5 } : undefined}>
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
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
