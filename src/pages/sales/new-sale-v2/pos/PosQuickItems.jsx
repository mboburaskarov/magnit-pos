/**
 * PosQuickItems
 *
 * Quick select tiles for frequently sold products.
 * SAP POS-style tiles in a scrollable horizontal row.
 * Admin-configurable (structure ready for API).
 */
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import './PosLayout.css'

// Default quick items (can be replaced by API data)
const DEFAULT_QUICK_ITEMS = [
  { id: 'bag',    name: 'Paket',     emoji: '🛍️', price: null, unit: 'dona' },
  { id: 'water',  name: 'Suv 0.5L', emoji: '💧', price: null, unit: 'dona' },
]

function PosQuickItems({
  quickItems = DEFAULT_QUICK_ITEMS,
  onSelect,   // (item) => void – called when tile tapped
  disabled,
}) {
  const { t } = useTranslation()

  if (!quickItems?.length) return null

  return (
    <div className='pos-quick-items' role='toolbar' aria-label='Tezkor tanlash'>
      <span style={{
        flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#6B7280',
        display: 'flex', alignItems: 'center', paddingRight: 6,
        borderRight: '1px solid #E0E3E8', marginRight: 4,
        whiteSpace: 'nowrap',
      }}>
        ⚡ Tezkor
      </span>
      {quickItems.map((item) => (
        <button
          key={item.id}
          className='pos-quick-item'
          disabled={disabled}
          onClick={() => onSelect?.(item)}
          title={item.name}
        >
          {item.emoji ? (
            <span style={{ fontSize: 24, lineHeight: 1 }}>{item.emoji}</span>
          ) : item.icon ? (
            <img src={item.icon} alt='' style={{ width: 28, height: 28, objectFit: 'contain' }} />
          ) : (
            <div style={{ width: 28, height: 28, background: '#E0E3E8', borderRadius: 6 }} />
          )}
          <div className='pos-quick-item-name'>{item.name}</div>
          {item.price != null && (
            <div className='pos-quick-item-price'>
              {Math.round(item.price / 1000)}K
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default PosQuickItems
