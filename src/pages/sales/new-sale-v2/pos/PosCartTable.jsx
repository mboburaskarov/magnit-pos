/**
 * PosCartTable - SAP POS Inspired
 */
import CustomImg from '@components/CustomImg'
import thousandDivider from '@utils/thousandDivider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PosSecurityQrModal from './PosSecurityQrModal'
import './PosLayout.css'

function PosCartTable({
  cartItems = [],
  lastScannedId,
  selectedId,
  onSelectRow,
  onQtyIncrease,
  onQtyDecrease,
  onRemoveRequest,
  onSecurityApproved,
  isLoading,
}) {
  const [securityItem, setSecurityItem] = useState(null)
  const { t } = useTranslation()

  const handleDecrease = (item) => {
    if (item.quantity <= 1 && (item.unit_quantity || 0) === 0) {
      setSecurityItem(item)
    } else {
      onQtyDecrease?.(item)
    }
  }

  const handleRemove = (item) => {
    setSecurityItem(item)
  }

  const handleSecurityApprove = (qrCode) => {
    const item = securityItem
    setSecurityItem(null)
    onSecurityApproved?.(item, qrCode)
  }

  return (
    <>
      <table className='pos-table'>
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            <th style={{ width: 120 }}>{t('table_columns.barcode')}</th>
            <th>{t('create_new_product.product_name')}</th>
            <th style={{ width: 100 }}>{t('table_columns.quantity')}</th>
            <th style={{ width: 80 }}>{t('unit_short')}</th>
            <th style={{ textAlign: 'right' }}>{t('price')}</th>
            <th style={{ textAlign: 'right' }}>{t('discount')}</th>
            <th style={{ textAlign: 'right' }}>{t('total')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} style={{ padding: 24, color: '#9CA3AF', textAlign: 'center' }}>Yuklanmoqda...</td>
            </tr>
          ) : !cartItems.length ? (
            null
          ) : (
            cartItems.map((item, index) => {
              const isSelected = item.id === selectedId
              const rowClass = isSelected ? 'selected' : ''

              return (
                <tr key={item.id} className={rowClass} onClick={() => onSelectRow?.(item.id)}>
                  <td>{index + 1}</td>
                  <td>{item.barcode || item.store_product_id || '—'}</td>
                  <td>{item.name}</td>
                  <td>
                    <div className='pos-qty-controls' onClick={(e) => e.stopPropagation()}>
                      <button className='pos-qty-btn' onClick={() => handleDecrease(item)}>−</button>
                      <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button className='pos-qty-btn' onClick={() => onQtyIncrease?.(item)}>+</button>
                    </div>
                  </td>
                  <td>{item.unit_per_pack > 1 && item.unit_quantity > 0 ? `${item.unit_quantity} шт` : 'уп'}</td>
                  <td style={{ textAlign: 'right' }}>{thousandDivider(item.unit_price)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {item.discount_price > 0 ? thousandDivider(item.discount_price) : '0.00'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{thousandDivider(item.total_price)}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {/* Security QR Modal */}
      <PosSecurityQrModal open={!!securityItem} productName={securityItem?.name} onApprove={handleSecurityApprove} onCancel={() => setSecurityItem(null)} />
    </>
  )
}

export default PosCartTable

