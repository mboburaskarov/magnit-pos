import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'

import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import thousandDivider from '@utils/thousandDivider'
import { extractNumbers, checkBarcodeWithMarking } from '@utils/checkingMarkingWithBarcode'
import { containsCyrillic, convertoRuOrEngToEng } from '@utils/convertoRuOrEngToEng'

import LogoMain from '@icons/LogoMain'
import { Search, User, Keyboard, Power } from 'lucide-react'
import { useBarcodeScanner } from '@/hooks/pos/useBarcodeScanner'
import PosCartTable from './PosCartTable'
import PosClientPanel from './PosClientPanel'
import './PosLayout.css'

export default function PosApp() {
  const { id } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  const { t, i18n } = useTranslation()

  // ── States ──
  const [customerId, setCustomerId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [activeTab, setActiveTab] = useState('SALES ITEM')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [time, setTime] = useState('')

  // Payment states
  const [showPaymentView, setShowPaymentView] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [receivedAmount, setReceivedAmount] = useState('')

  // Customer selection & topbar search states
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [topbarSearchTerm, setTopbarSearchTerm] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const day = String(now.getDate()).padStart(2, '0')
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = now.getFullYear()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setTime(`${day}.${month}.${year} ${hours}:${minutes}:${seconds}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // ── Queries ──
  const { data: cashBoxDetails } = useQuery(['cashBoxDetails', id], () => requests.getCashBoxDetaildWithSaleId(id))

  const {
    data: cartItemsRes,
    refetch: refetchCart,
    isLoading: isCartLoading,
  } = useQuery(['cartItemsList', id], () => requests.getCartItemList({ sale_id: id, limit: 100, offset: 0 }), {
    onError: (e) => {
      if (get(e, 'response.data.code') == '409') {
        navigate('/sales/create')
      }
    },
  })

  const cartItems = get(cartItemsRes, 'data.data.data', [])
  const totalAmount = get(cartItemsRes, 'data.data.total_amount', 0)

  // Calculate totals
  const totalDiscount = cartItems.reduce((acc, item) => acc + (item.discount_price || 0), 0)

  // Search customers query
  const { data: customersRes, isLoading: isSearchingCustomers } = useQuery(
    ['customersList', customerSearchTerm],
    () => requests.getAllCustomersForSale({ search: customerSearchTerm }),
    {
      enabled: customerSearchTerm.length >= 3,
    },
  )

  const customersList = get(customersRes, 'data.data.data', [])

  // ── Mutations ──
  const { mutate: saveMarkingToCartItem } = useMutation(requests.saveMarkingToCartItem, {
    onSuccess: () => {
      success('Markirovka yangilandi')
    },
    onError: () => {
      error('Markirovkani saqlashda xatolik yuz berdi')
    },
  })

  const { mutate: saleCreate, isLoading: isCheckoutLoading } = useMutation(requests.saleCreate, {
    onSuccess: ({ data }) => {
      success('Sotuv muvaffaqiyatli yakunlandi')
      // In POS, after completing sale, we should open print receipt in new tab or just navigate back to create
      window.open(`/sales/new-sale/${get(data, 'data.id')}`, '_blank', 'rel=noopener noreferrer')
      navigate('/sales/create')
    },
    onError: (err) => {
      error(get(err, 'response.data.message', 'Sotuvni yakunlashda xatolik yuz berdi'))
      console.error(err)
    },
  })

  const { mutate: addProduct } = useMutation(
    (params) => {
      const rest = { ...params }
      delete rest.originalScannedValue
      return requests.createCartItem(rest)
    },
    {
      onSuccess: ({ data }, variables) => {
        refetchCart()
        setSelectedId(data?.data?.id)

        const originalScannedValue = variables.originalScannedValue
        if (originalScannedValue && originalScannedValue.length > 37 && get(data, 'data.is_marking', false)) {
          if (checkBarcodeWithMarking(data?.data?.barcode, originalScannedValue) && data?.data?.barcode.length > 0) {
            const marking = containsCyrillic(originalScannedValue) ? convertoRuOrEngToEng(originalScannedValue) : originalScannedValue
            saveMarkingToCartItem({
              id: data?.data?.store_product_id,
              data: {
                marking: marking,
              },
            })
          }
        }
      },
      onError: (err) => {
        if (get(err, 'response.data.code') === 406) {
          success('Prodanja yopildi')
          navigate(`/sales/create`)
          return
        }
        error(get(err, 'response.data.message', 'Mahsulot topilmadi yoki qoldiq yetarli emas'))
      },
    },
  )

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
      success('Mahsulot olib tashlandi')
    },
    onError: () => error('Mahsulotni olib tashlashda xatolik'),
  })

  // Customer loyalty mutations
  const { mutate: addDiscountCard } = useMutation(requests.addDiscountCard, {
    onSuccess: ({ data }) => {
      refetchCart()
      success(`Chegirma kartasi muvaffaqiyatli qo'shildi - ${data?.data?.discount_percent}%`)
    },
    onError: (err) => {
      error("Chegirma kartasini qo'shishda xatolik")
      console.error('err', err)
    },
  })

  const { mutate: removeDiscountCard } = useMutation(requests.removeDiscountCard, {
    onSuccess: () => {
      setCustomerId(null)
      refetchCart()
      success("Chegirma kartasi muvaffaqiyatli o'chirildi")
    },
    onError: (err) => {
      error("Chegirma kartasini o'chirishda xatolik")
      console.error('err', err)
    },
  })

  // ── Effects ──
  useEffect(() => {
    const customer = get(cashBoxDetails, 'data.data.customer')
    if (customer?.first_name) {
      setCustomerId({
        id: customer?.id,
        name: customer?.first_name + ' ' + (customer?.last_name || ''),
        balance: customer?.balance,
        barcode: get(customer, 'discount_card'),
        discount_card_barcode: get(customer, 'discount_card'),
        discount_card_percent: get(customer, 'discount_percent'),
        loyalty_card_barcode: customer?.loyalty_card_barcode,
        loyalty_card_percent: get(customer, 'loyalty_card_percent'),
        new: false,
      })
    }
  }, [cashBoxDetails])

  // ── Handlers ──
  const handleQuickCash = (amount) => {
    setReceivedAmount((prev) => {
      const current = Number(prev) || 0
      return String(current + amount)
    })
  }

  const handleCheckout = () => {
    saleCreate({
      cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'),
      store_id: get(userData, 'store.id'),
    })
  }

  const handleBarcodeScan = async (scannedBarcode) => {
    if (!scannedBarcode) return

    // 1. Extract barcode from marking if it is a datamatrix
    let searchBarcode = scannedBarcode
    if (scannedBarcode.length >= 37) {
      const extracted = extractNumbers(scannedBarcode)
      if (extracted) {
        searchBarcode = extracted
      }
    }

    // 2. Check if product already exists in cart items list
    const existing = cartItems.find((item) => item.barcode === searchBarcode)
    if (existing) {
      changeQty({
        id: existing.id,
        data: {
          quantity: existing.quantity + 1,
          unit_quantity: existing.unit_quantity,
          store_product_id: existing.store_product_id,
        },
      })

      // Save marking to existing item if it was scanned
      if (scannedBarcode.length > 37) {
        const marking = containsCyrillic(scannedBarcode) ? convertoRuOrEngToEng(scannedBarcode) : scannedBarcode
        saveMarkingToCartItem({
          id: existing.store_product_id,
          data: {
            marking: marking,
          },
        })
      }
      return
    }

    // 3. Otherwise search store products to get store_product_id
    try {
      const storeId = get(userData, 'store.id')
      if (!storeId) {
        error("Do'kon ombori aniqlanmadi")
        return
      }

      const res = await requests.getAllStoreProducts({ id: storeId }, { search: searchBarcode, offset: 0, limit: 30 })

      const productsList = get(res, 'data.data') || []

      if (productsList.length === 0) {
        error(t('product_not_found'))
        return
      }

      // Take the first matching product
      const product = productsList[0]

      // 4. Add product to cart with store_product_id!
      addProduct({
        sale_id: id,
        barcode: product.barcode,
        store_product_id: product.id,
        discount_type: 'percent',
        discount_value: 0,
        originalScannedValue: scannedBarcode,
      })
    } catch (err) {
      error('Mahsulotni qidirishda xatolik yuz berdi')
      console.error(err)
    }
  }

  useBarcodeScanner({
    onScan: handleBarcodeScan,
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

  const handleSecurityApproved = (item) => {
    deleteItem(item.id)
  }

  return (
    <div className='pos-shell'>
      {/* ── Top Header ── */}
      <header className='pos-topbar'>
        <div className='pos-topbar-left'>
          <div className='pos-topbar-logo' style={{ display: 'flex', alignItems: 'center' }}>
            <LogoMain />
          </div>
          <div className='pos-topbar-info'>
            <div className='pos-info-item'>
              <span>{time}</span>
            </div>
            <div className='pos-info-item'>
              <span>Terminal: E012 - root</span>
            </div>
            <div className='pos-info-item'>
              <User size={12} style={{ marginRight: 4 }} />
              <span>
                {get(userData, 'first_name')} {get(userData, 'last_name') ? `(${get(userData, 'last_name')})` : ''}
              </span>
            </div>
          </div>
        </div>
        <div className='pos-topbar-actions' style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {showSearchInput && (
            <div className='pos-topbar-search-container'>
              <input
                type='text'
                className='pos-topbar-search-input'
                placeholder='Shtrix-kod kiriting...'
                autoFocus
                value={topbarSearchTerm}
                onChange={(e) => setTopbarSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBarcodeScan(topbarSearchTerm)
                    setTopbarSearchTerm('')
                    setShowSearchInput(false)
                  }
                  if (e.key === 'Escape') {
                    setShowSearchInput(false)
                  }
                }}
              />
            </div>
          )}
          <button className='pos-topbar-btn' onClick={() => setShowSearchInput(!showSearchInput)}>
            <Search size={20} />
          </button>
          <button className='pos-topbar-btn'>
            <Keyboard size={20} />
          </button>
          <div style={{ position: 'relative', height: '100%' }}>
            <button className='pos-topbar-btn' onClick={() => setShowLangDropdown(!showLangDropdown)}>
              <User size={20} />
            </button>
            {showLangDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '55px',
                  right: '0',
                  background: '#FFFFFF',
                  border: '1px solid #CCCCCC',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  width: '160px',
                  color: '#333',
                  padding: '8px 0',
                }}
              >
                <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', color: '#666', borderBottom: '1px solid #EEE' }}>{t('language')}</div>
                <button
                  onClick={() => {
                    i18n.changeLanguage('uz')
                    setShowLangDropdown(false)
                  }}
                  style={{
                    display: 'flex',
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: i18n.language === 'uz' ? 'bold' : 'normal',
                    color: '#333',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F3F4F6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  🇺🇿 O&apos;zbekcha
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage('ru')
                    setShowLangDropdown(false)
                  }}
                  style={{
                    display: 'flex',
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: i18n.language === 'ru' ? 'bold' : 'normal',
                    color: '#333',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F3F4F6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  🇷🇺 Русский
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage('en')
                    setShowLangDropdown(false)
                  }}
                  style={{
                    display: 'flex',
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
                    color: '#333',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F3F4F6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>
          <button className='pos-topbar-btn' onClick={() => navigate('/sales/create')}>
            <Power size={20} />
          </button>
        </div>
      </header>

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
            <div
              className='pos-display-panel'
              style={{
                padding: '16px 20px',
                background: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
              }}
            >
              {/* Last added item info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {cartItems.length > 0 ? (
                  <>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#111827',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cartItems[cartItems.length - 1].name}
                    </div>
                    <div style={{ fontSize: '18px', color: '#4B5563', fontFamily: 'monospace' }}>
                      {cartItems[cartItems.length - 1].quantity} x {thousandDivider(cartItems[cartItems.length - 1].unit_price)} UZS
                      {cartItems[cartItems.length - 1].discount_price > 0 && ` - ${thousandDivider(cartItems[cartItems.length - 1].discount_price)} UZS`}
                      {` = ${thousandDivider(cartItems[cartItems.length - 1].total_price)} UZS`}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Summary line */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '2px dashed #E5E7EB',
                  paddingTop: '12px',
                  marginTop: '12px',
                }}
              >
                <div style={{ fontSize: '16px', color: '#EF4444', fontWeight: 'bold' }}>
                  {t('discount')}: {thousandDivider(totalDiscount)} UZS
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#1F2937' }}>
                  Chek summasi: <span style={{ color: '#0070D2', fontSize: '28px' }}>{thousandDivider(totalAmount)} UZS</span>
                </div>
              </div>
            </div>

            <div className='pos-action-tabs'>
              {['HOME', 'SALES ITEM', 'CUSTOMER', 'OMNI-CHANNEL', 'RECEIPT'].map((tab) => (
                <button key={tab} className={`pos-action-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>

            <div className='pos-action-grid'>
              <div className='pos-action-btn'>{t('print')}</div>
              <div className='pos-action-btn blue'>{t('menu.orders.new_order.cart_container.discount')}</div>
              <div className='pos-action-btn blue'>{t('menu.orders.all.postpone')}</div>
              <div className='pos-action-btn blue'>{t('continue')}</div>
              <div className='pos-action-btn gray'>{t('menu.sales.shortcuts.not_product')}</div>

              <div className='pos-action-btn orange'>{t('cancel')}</div>
              <div className='pos-action-btn orange'>{t('menu.sales.shortcuts.delete')}</div>
              <div className='pos-action-btn gray'>{t('menu.orders.all.return')}</div>
              <div className='pos-action-btn blue'>{t('menu.orders.all.exchange')}</div>
              <div className='pos-action-btn gray'>{t('menu.sales.shortcuts.change_count')}</div>
            </div>
          </div>
        </main>

        {/* ── Right Section (Sidebar) ── */}
        <aside className='pos-right-section'>
          <div className='pos-receipt-info'>
            <div>Receipt ID: {get(cashBoxDetails, 'data.data.sale_number', '--')}</div>
            <div>Price list: Standard</div>
          </div>

          <div
            className='pos-customer-box'
            onClick={() => setIsCustomerModalOpen(true)}
            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F3F4F6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '')}
          >
            <div className='pos-customer-icon' style={{ display: 'flex', alignItems: 'center' }}>
              <User size={22} color='#0070D2' />
            </div>
            <div className='pos-customer-details' style={{ flex: 1 }}>
              <div>{customerId ? customerId.name : t('menu.orders.new_order.cart_container.client_placeholder')}</div>
              <div style={{ fontWeight: 'normal', color: '#666' }}>
                {customerId ? `${t('card')}: ${customerId.barcode || 'ID: ' + customerId.id}` : t('new_order.app.pass_scan')}
              </div>
            </div>
            {customerId && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeDiscountCard({ sale_id: id })
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  padding: '4px 8px',
                }}
                title="Mijozni o'chirish"
              >
                ✕
              </button>
            )}
          </div>

          {!showPaymentView ? (
            <>
              <div className='pos-numpad'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'x'].map((num, i) => (
                  <button key={i} className='pos-num-btn'>
                    {num}
                  </button>
                ))}
              </div>

              <div className='pos-numpad-actions'>
                <button className='pos-numpad-act-btn back'>←</button>
                <button className='pos-numpad-act-btn enter'>✓</button>
              </div>

              <button className='pos-exact-btn' onClick={() => setShowPaymentView(true)} style={{ background: '#0070D2' }}>
                PODITOG
              </button>
            </>
          ) : (
            <>
              {/* Payment Info */}
              <div style={{ padding: '12px 16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#4B5563', fontSize: '13px' }}>Jami to'lov:</span>
                  <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{thousandDivider(totalAmount)} UZS</span>
                </div>
                {paymentMethod === 'cash' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: '#4B5563', fontSize: '13px' }}>Mijoz berdi:</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type='number'
                        value={receivedAmount}
                        onChange={(e) => setReceivedAmount(e.target.value)}
                        placeholder={String(totalAmount)}
                        style={{
                          width: '100px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #D1D5DB',
                          textAlign: 'right',
                          fontSize: '15px',
                          fontWeight: 'bold',
                        }}
                      />
                      <button
                        onClick={() => setReceivedAmount('')}
                        style={{
                          border: 'none',
                          background: '#EF4444',
                          color: 'white',
                          padding: '5px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                      >
                        C
                      </button>
                    </div>
                  </div>
                )}
                {paymentMethod === 'cash' && Number(receivedAmount) > totalAmount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 'bold' }}>
                    <span>Qaytim:</span>
                    <span>{thousandDivider(Number(receivedAmount) - totalAmount)} UZS</span>
                  </div>
                )}
                {paymentMethod === 'cash' && Number(receivedAmount) > 0 && Number(receivedAmount) < totalAmount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444', fontWeight: 'bold' }}>
                    <span>Kam:</span>
                    <span>{thousandDivider(totalAmount - Number(receivedAmount))} UZS</span>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px 8px 4px 8px' }}>
                <button
                  className={`pos-method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                  style={{
                    height: '45px',
                    background: paymentMethod === 'cash' ? '#0070D2' : '#F3F4F6',
                    color: paymentMethod === 'cash' ? '#FFFFFF' : '#1F2937',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                  }}
                >
                  💵 Naqd
                </button>
                <button
                  className={`pos-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    height: '45px',
                    background: paymentMethod === 'card' ? '#0070D2' : '#F3F4F6',
                    color: paymentMethod === 'card' ? '#FFFFFF' : '#1F2937',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                  }}
                >
                  💳 Plastik
                </button>
              </div>

              {/* Online Payment Providers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '4px 8px 8px 8px' }}>
                <button
                  className={`pos-provider-btn click ${paymentMethod === 'click' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('click')}
                  style={{
                    height: '45px',
                    background: paymentMethod === 'click' ? '#00A3FF' : '#E8F5FF',
                    color: paymentMethod === 'click' ? '#FFFFFF' : '#00A3FF',
                    border: '1px solid #BCE3FF',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Click
                </button>
                <button
                  className={`pos-provider-btn payme ${paymentMethod === 'payme' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('payme')}
                  style={{
                    height: '45px',
                    background: paymentMethod === 'payme' ? '#14B8A6' : '#F0FDFA',
                    color: paymentMethod === 'payme' ? '#FFFFFF' : '#139D8E',
                    border: '1px solid #CCFBf1',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Payme
                </button>
                <button
                  className={`pos-provider-btn uzum ${paymentMethod === 'uzum' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('uzum')}
                  style={{
                    height: '45px',
                    background: paymentMethod === 'uzum' ? '#7C3AED' : '#F5F3FF',
                    color: paymentMethod === 'uzum' ? '#FFFFFF' : '#6D28D9',
                    border: '1px solid #E0E7FF',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Uzum
                </button>
              </div>

              {/* Cash Bills */}
              {paymentMethod === 'cash' && (
                <div className='pos-cash-grid' style={{ gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
                  <div className='pos-cash-bill uzs-5k' onClick={() => handleQuickCash(5000)}>
                    5 000 so'm
                  </div>
                  <div className='pos-cash-bill uzs-10k' onClick={() => handleQuickCash(10000)}>
                    10 000 so'm
                  </div>
                  <div className='pos-cash-bill uzs-20k' onClick={() => handleQuickCash(20000)}>
                    20 000 so'm
                  </div>
                  <div className='pos-cash-bill uzs-50k' onClick={() => handleQuickCash(50000)}>
                    50 000 so'm
                  </div>
                  <div className='pos-cash-bill uzs-100k' onClick={() => handleQuickCash(100000)}>
                    100 000 so'm
                  </div>
                  <div className='pos-cash-bill uzs-200k' onClick={() => handleQuickCash(200000)}>
                    200 000 so'm
                  </div>
                </div>
              )}

              {/* Finish / Checkout Button */}
              <button
                className='pos-exact-btn'
                onClick={handleCheckout}
                disabled={isCheckoutLoading || cartItems.length === 0}
                style={{ background: '#2B9C4A', marginTop: 'auto', minHeight: '60px' }}
              >
                {isCheckoutLoading ? "TO'LOV QILINMOQDA..." : "TO'LOVNI YAKUNLASH"}
              </button>

              {/* Back Button */}
              <button className='pos-quick-select-btn' onClick={() => setShowPaymentView(false)} style={{ background: '#6B7280', minHeight: '40px' }}>
                ORQAGA
              </button>
            </>
          )}
        </aside>
      </div>

      {/* ── Client Search Modal ── */}
      {isCustomerModalOpen && (
        <div
          className='pos-modal-overlay'
          onClick={() => setIsCustomerModalOpen(false)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className='pos-modal' onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '90%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: '#333' }}>{t('menu.clients.new_client')}</h3>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' }}
              >
                ✕
              </button>
            </div>
            <PosClientPanel
              customerId={customerId}
              customers={customersList}
              searchTerm={customerSearchTerm}
              setSearchTerm={setCustomerSearchTerm}
              setCustomerId={(c) => {
                setCustomerId(c)
                if (c) {
                  addDiscountCard({
                    customer_id: c.id,
                    barcode: c.barcode,
                    sale_id: id,
                  })
                } else {
                  removeDiscountCard({
                    sale_id: id,
                  })
                }
                setIsCustomerModalOpen(false)
              }}
              isSearching={isSearchingCustomers}
            />
          </div>
        </div>
      )}
    </div>
  )
}
