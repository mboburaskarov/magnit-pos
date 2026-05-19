/**
 * PosClientPanel
 *
 * Client search + selected client card for POS right panel.
 * - Large touch-friendly input
 * - Dropdown search results
 * - Client card when selected (name, balance, change/remove buttons)
 */
import thousandDivider from '@utils/thousandDivider'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import './PosLayout.css'

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

function PosClientPanel({
  customerId,
  customers = [],
  searchTerm,
  setSearchTerm,
  setCustomerId,
  onCreateClient,
  removeClient,
  isSearching,
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const showDropdown = focused && searchTerm?.length >= 3

  // F3 shortcut to focus client search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'F3') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (customerId) {
    // ── Client selected state ──
    const initials = (customerId.name || 'M').charAt(0).toUpperCase()

    return (
      <div>
        <div className='pos-client-card'>
          <div className='pos-client-avatar'>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className='pos-client-name'>
              {customerId.name}
            </div>
            {customerId.phone && (
              <div className='pos-client-meta'>{customerId.phone}</div>
            )}
            {customerId.balance !== undefined && (
              <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 700, marginTop: 2 }}>
                Balans: {thousandDivider(customerId.balance, 'сум')}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
            <button
              onClick={() => {
                setCustomerId(null)
                setSearchTerm?.('')
              }}
              style={{
                width: 32, height: 32, border: '1px solid #E0E3E8',
                borderRadius: 6, background: '#F4F5F7', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Mijozni olib tashlash"
            >
              <XIcon />
            </button>
          </div>
        </div>
        {customerId.discount_card_percent > 0 && (
          <div style={{
            marginTop: 8, padding: '6px 12px',
            background: 'linear-gradient(135deg, #FFAC70, #FF7D37)',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>Chegirma kartasi</span>
            <span style={{ fontSize: 16, color: '#fff', fontWeight: 800 }}>
              {customerId.discount_card_percent}%
            </span>
          </div>
        )}
      </div>
    )
  }

  // ── Search state ──
  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        className='pos-client-search'
        type='text'
        value={searchTerm || ''}
        placeholder="Mijoz ismi yoki telefon raqamini kiriting"
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        autoComplete='off'
      />
      <div style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span className='pos-kbd'>F3</span>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#fff', border: '1px solid #E0E3E8', borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 100, overflow: 'hidden',
          marginTop: 4,
        }}>
          {isSearching && (
            <div style={{ padding: 12, color: '#9CA3AF', fontSize: 13, textAlign: 'center' }}>
              Qidirilmoqda...
            </div>
          )}
          {!isSearching && customers.length === 0 && (
            <div
              style={{ padding: '12px 16px', cursor: 'pointer', color: '#374151', fontSize: 14 }}
              onClick={() => onCreateClient?.(searchTerm)}
            >
              <span style={{ color: '#FE5000', fontWeight: 700 }}>+ Qo'shish:</span>{' '}
              "{searchTerm}"
            </div>
          )}
          {customers.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                padding: '12px 16px', cursor: 'pointer', borderTop: idx > 0 ? '1px solid #F3F4F6' : 'none',
              }}
              onClick={() => {
                setCustomerId({
                  id:   item.id,
                  name: `${item.first_name} ${item.last_name}`,
                  balance: item.balance,
                  phone: item.phone_numbers?.[0] || '',
                  barcode: item.discount_card,
                  discount_card_percent: item.discount_percent,
                  discount_card_barcode: searchTerm === item.discount_card ? item.discount_card : null,
                  loyalty_card_percent: searchTerm === item.loyalty_card_barcode ? item.loyalty_card_percent : null,
                  loyalty_card_barcode: searchTerm === item.loyalty_card_barcode ? item.loyalty_card_barcode : null,
                })
                setSearchTerm('')
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = ''}
            >
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                <Highlighter
                  highlightStyle={{ background: '#FFF3E0', padding: '1px 0' }}
                  searchWords={searchTerm ? searchTerm.split(' ') : []}
                  autoEscape
                  textToHighlight={`${item.first_name} ${item.last_name}`}
                />
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                {item.phone_numbers?.join(', ') || ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchTerm?.length > 0 && searchTerm.length < 3 && (
        <div style={{ fontSize: 12, color: '#DC2626', marginTop: 4, paddingLeft: 2 }}>
          Kamida 3 ta belgi kiriting
        </div>
      )}
    </div>
  )
}

export default PosClientPanel
