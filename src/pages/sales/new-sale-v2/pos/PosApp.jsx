import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { get, size } from 'lodash'

import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import thousandDivider from '@utils/thousandDivider'

import { useBarcodeScanner } from '@/hooks/pos/useBarcodeScanner'
import PosCartTable from './PosCartTable'
import './PosLayout.css'

export default function PosApp() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)

  // ── States ──
  const [searchTerm, setSearchTerm] = useState('')
  const [customerId, setCustomerId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [activeTab, setActiveTab] = useState('SALES ITEM')

  // ── Queries ──
  const { data: cashBoxDetails } = useQuery(['cashBoxDetails', id], () =>
    requests.getCashBoxDetaildWithSaleId(id)
  )

  const {
    data: cartItemsRes,
    refetch: refetchCart,
    isLoading: isCartLoading,
  } = useQuery(
    ['cartItemsList', id],
    () => requests.getCartItemList({ sale_id: id, limit: 100, offset: 0 }),
    {
      onError: (e) => {
        if (get(e, 'response.data.code') == '409') {
          navigate('/sales/create')
        }
      },
    }
  )

  const cartItemsList = get(cartItemsRes, 'data.data')
  const cartItems = get(cartItemsRes, 'data.data.data', [])
  const totalAmount = get(cartItemsRes, 'data.data.total_amount', 0)

  // Calculate totals
  const totalDiscount = cartItems.reduce((acc, item) => acc + (item.discount_price || 0), 0)

  // ── Mutations ──
  const { mutate: addProduct } = useMutation(requests.createCartItem, {
    onSuccess: ({ data }) => {
      refetchCart()
      setSelectedId(data?.data?.id)
    },
    onError: (err) => {
      if (get(err, 'response.data.code') === 406) {
        success('Prodanja yopildi')
        navigate(`/sales/create`)
        return
      }
      error(get(err, 'response.data.message', 'Mahsulot topilmadi yoki qoldiq yetarli emas'))
    },
  })

  const { mutate: changeQty } = useMutation(requests.changeCartItemQuantity, {
    onSuccess: () => refetchCart(),
    onError: () => {
      refetchCart()
      error('Miqdorni o`zgartirishda xatolik yoki qoldiq yetarli emas')
    },
  })

  const { mutate: deleteItem } = useMutation(requests.deleteCartItem, {
    onSuccess: () => {
      refetchCart()
      success("Mahsulot olib tashlandi")
    },
    onError: () => error('Mahsulotni olib tashlashda xatolik'),
  })

  // ── Handlers ──
  useBarcodeScanner({
    onScan: (barcode) => {
      const existing = cartItems.find((item) => item.barcode === barcode)
      if (existing) {
        changeQty({
          id: existing.id,
          data: {
            quantity: existing.quantity + 1,
            unit_quantity: existing.unit_quantity,
            store_product_id: existing.store_product_id,
          },
        })
      } else {
        addProduct({
          sale_id: id,
          barcode: barcode,
          type: 'marking',
          discount_type: 'percent',
          discount_value: 0,
        })
      }
    },
    enabled: true,
  })

  const handleQtyIncrease = (item) => {
    changeQty({
      id: item.id,
      data: {
        quantity: item.quantity + 1,
        unit_quantity: item.unit_quantity,
        store_product_id: item.store_product_id,
      },
    })
  }

  const handleQtyDecrease = (item) => {
    if (item.quantity > 1 || (item.quantity === 1 && item.unit_quantity > 0)) {
      changeQty({
        id: item.id,
        data: {
          quantity: item.quantity > 0 ? item.quantity - 1 : 0,
          unit_quantity: item.unit_quantity,
          store_product_id: item.store_product_id,
        },
      })
    }
  }

  const handleSecurityApproved = (item, qrCode) => {
    deleteItem(item.id)
  }

  return (
    <div className='pos-shell'>
      {/* ── Top Header ── */}
      <header className='pos-topbar'>
        <div className='pos-topbar-left'>
          <div className='pos-topbar-logo'>PHARMA</div>
          <div className='pos-topbar-info'>
            <div>{new Date().toLocaleString()}</div>
            <div>E012 - root</div>
            <div>👤 {get(userData, 'first_name')} ({get(userData, 'last_name')})</div>
          </div>
        </div>
        <div className='pos-topbar-actions'>
          <button className='pos-topbar-btn'>
            🔍
          </button>
          <button className='pos-topbar-btn'>
            ⌨️
          </button>
          <button className='pos-topbar-tab active'>SALES</button>
          <button className='pos-topbar-tab'>FUNCTIONS</button>
          <button className='pos-topbar-btn' style={{ background: '#4D4D4D' }}>
            👤
          </button>
          <button className='pos-topbar-btn' style={{ background: '#4D4D4D' }}>
            ⏻
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className='pos-main-wrapper'>
        
        {/* ── Left Section ── */}
        <main className='pos-left-section'>
          <div className='pos-cart-area'>
            <PosCartTable
              cartItems={cartItems}
              selectedId={selectedId}
              onSelectRow={setSelectedId}
              onQtyIncrease={handleQtyIncrease}
              onQtyDecrease={handleQtyDecrease}
              onSecurityApproved={handleSecurityApproved}
              isLoading={isCartLoading}
            />
          </div>

          {/* Left Bottom */}
          <div className='pos-left-bottom'>
            <div className='pos-summary-bar'>
              <div className='pos-summary-box'>
                <div className='pos-summary-label'>Discount</div>
                <div className='pos-summary-value'>{thousandDivider(totalDiscount)} UZS</div>
              </div>
              <div className='pos-summary-box'>
                <div className='pos-summary-label'>Tax</div>
                <div className='pos-summary-value'>0.00 UZS</div>
              </div>
              <div className='pos-summary-total'>
                <div className='pos-summary-total-row'>
                  <div className='pos-summary-total-label'>Total</div>
                  <div className='pos-summary-total-val'>
                    {cartItems.length} items &nbsp;&nbsp;&nbsp; {thousandDivider(totalAmount)} UZS
                  </div>
                </div>
                <div className='pos-summary-total-row'>
                  <div className='pos-summary-total-label'>Open amount</div>
                  <div className='pos-summary-total-val red'>{thousandDivider(totalAmount)} UZS</div>
                </div>
              </div>
            </div>

            <div className='pos-action-tabs'>
              {['HOME', 'SALES ITEM', 'CUSTOMER', 'OMNI-CHANNEL', 'RECEIPT'].map(tab => (
                <button
                  key={tab}
                  className={`pos-action-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className='pos-action-grid'>
              <div className='pos-action-btn'>Print receipt</div>
              <div className='pos-action-btn blue'>Receipt discount</div>
              <div className='pos-action-btn blue'>Park receipt</div>
              <div className='pos-action-btn blue'>Resume receipt</div>
              <div className='pos-action-btn gray'>Create manual set</div>
              
              <div className='pos-action-btn orange'>Cancel receipt</div>
              <div className='pos-action-btn orange'>Cancel sales item</div>
              <div className='pos-action-btn gray'>Return receipt</div>
              <div className='pos-action-btn blue'>Reverse receipt</div>
              <div className='pos-action-btn gray'>Split items</div>
            </div>
          </div>
        </main>

        {/* ── Right Section (Sidebar) ── */}
        <aside className='pos-right-section'>
          <div className='pos-receipt-info'>
            <div>Receipt ID: {get(cashBoxDetails, 'data.data.sale_number', '--')}</div>
            <div>Price list: Standard</div>
          </div>

          <div className='pos-customer-box'>
            <div className='pos-customer-icon'>👤</div>
            <div className='pos-customer-details'>
              <div>{customerId ? 'Customer Name' : 'Walk-in Customer'}</div>
              <div style={{ fontWeight: 'normal', color: '#666' }}>{customerId ? `Customer ID: ${customerId}` : 'No ID'}</div>
            </div>
          </div>

          <div className='pos-numpad'>
            {[1,2,3,4,5,6,7,8,9,'',0,'x'].map((num, i) => (
              <button key={i} className='pos-num-btn'>{num}</button>
            ))}
          </div>

          <div className='pos-numpad-actions'>
            <button className='pos-numpad-act-btn back'>←</button>
            <button className='pos-numpad-act-btn enter'>✓</button>
          </div>

          <div className='pos-cash-grid'>
            <div className='pos-cash-bill uzs-10k'>10 K</div>
            <div className='pos-cash-bill uzs-50k'>50 K</div>
            <div className='pos-cash-bill uzs-100k'>100 K</div>
            <div className='pos-cash-bill uzs-200k'>200 K</div>
          </div>

          <div className='pos-pay-type-grid'>
            <button className='pos-pay-type-btn'>💳</button>
            <button className='pos-pay-type-btn'>🔢</button>
          </div>

          <button className='pos-exact-btn'>
            Exact amount
          </button>
          
          <button className='pos-quick-select-btn'>
            Quick selection
          </button>
        </aside>

      </div>
    </div>
  )
}
