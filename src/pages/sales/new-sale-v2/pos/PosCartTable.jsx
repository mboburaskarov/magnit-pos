/**
 * PosCartTable - SAP POS Inspired
 */
import CustomImg from '@components/CustomImg'
import thousandDivider from '@utils/thousandDivider'
import { useState } from 'react'
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

  if (isLoading) {
    return <div style={{ padding: 24, color: '#9CA3AF', textAlign: 'center' }}>Yuklanmoqda...</div>
  }

  if (!cartItems.length) {
    return (
      <>
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#999' }}>
          <h2>Корзина пуста</h2>
          <p>Отсканируйте продукт или используйте Быстрый выбор</p>
        </div>
        <PosSecurityQrModal open={!!securityItem} productName={securityItem?.name} onApprove={handleSecurityApprove} onCancel={() => setSecurityItem(null)} />
      </>
    )
  }

  return (
    <>
      <table className='pos-table'>
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            <th style={{ width: 120 }}>ARTICLE ID</th>
            <th>ARTICLE</th>
            <th style={{ width: 100 }}>QUANTITY</th>
            <th style={{ width: 80 }}>UNIT</th>
            <th style={{ textAlign: 'right' }}>UNIT PRICE</th>
            <th style={{ textAlign: 'right' }}>DISCOUNT</th>
            <th style={{ textAlign: 'right' }}>PRICE</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => {
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
          })}
        </tbody>
      </table>

      {/* Security QR Modal */}
      <PosSecurityQrModal open={!!securityItem} productName={securityItem?.name} onApprove={handleSecurityApprove} onCancel={() => setSecurityItem(null)} />
    </>
  )
}

export default PosCartTable

