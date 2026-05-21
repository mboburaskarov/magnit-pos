import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import { Trash2 } from 'lucide-react'

import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import thousandDivider from '@utils/thousandDivider'
import { extractNumbers, checkBarcodeWithMarking } from '@utils/checkingMarkingWithBarcode'
import { containsCyrillic, convertoRuOrEngToEng } from '@utils/convertoRuOrEngToEng'

import { useBarcodeScanner } from '@/hooks/pos/useBarcodeScanner'
import PosClientPanel from './PosClientPanel'
import POSHeader from './POSHeader'
import ProductTable from './ProductTable'
import CheckoutSidebar from './CheckoutSidebar'
import ProductSummary from './ProductSummary'
import PosQuickProducts from './PosQuickProducts'
import ActionBar from './ActionBar'
import PosSecurityQrModal from './PosSecurityQrModal'
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
  const [showQuickProducts, setShowQuickProducts] = useState(false)
  const [securityItem, setSecurityItem] = useState(null)
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

  const handleQuickAdd = async (productSearchQuery) => {
    try {
      const storeId = get(userData, 'store.id')
      if (!storeId) {
        error("Do'kon ombori aniqlanmadi")
        return
      }
      const res = await requests.getAllStoreProducts({ id: storeId }, { search: productSearchQuery, offset: 0, limit: 1 })
      const productsList = get(res, 'data.data') || []
      if (productsList.length === 0) {
        error(`Mahsulot topilmadi: "${productSearchQuery}"`)
        return
      }
      const product = productsList[0]
      addProduct({
        sale_id: id,
        barcode: product.barcode,
        store_product_id: product.id,
        discount_type: 'percent',
        discount_value: 0,
      })
    } catch (err) {
      error("Tezkor qo'shishda xatolik yuz berdi")
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

  const handleSecurityApproved = (qrCode) => {
    if (securityItem) {
      deleteItem(securityItem.id)
      setSecurityItem(null)
    }
  }

  const handlePrint = () => {
    success("Chek chop etish navbatiga qo'shildi")
  }

  const handleDiscount = () => {
    setIsCustomerModalOpen(true)
  }

  const handlePostpone = () => {
    success("Sotuv vaqtincha saqlandi (Otlozhen)")
  }

  const handleContinue = () => {
    setShowPaymentView(true)
  }

  const handleNotProduct = () => {
    success("Noma'lum tovar tanlandi")
  }

  const handleCancelSale = () => {
    success("Sotuv bekor qilindi")
    navigate('/sales/create')
  }

  const handleDeleteProduct = () => {
    const selectedItem = cartItems.find((item) => item.id === selectedId)
    if (selectedItem) {
      setSecurityItem(selectedItem)
    } else {
      error(t('pos.select_product_to_delete'))
    }
  }

  const handleReturn = () => {
    success("Qaytarish jarayoni boshlandi")
  }

  const handleExchange = () => {
    success("Ayirboshlash jarayoni boshlandi")
  }

  const handleChangeCount = () => {
    success("Miqdorni o'zgartirish rejimi")
  }

  return (
    <div className='pos-shell'>
      {/* ── Top Header ── */}
      <POSHeader
        time={time}
        cashierName={`${get(userData, 'first_name')} ${get(userData, 'last_name') ? `(${get(userData, 'last_name')})` : ''}`}
        showSearchInput={showSearchInput}
        setShowSearchInput={setShowSearchInput}
        topbarSearchTerm={topbarSearchTerm}
        setTopbarSearchTerm={setTopbarSearchTerm}
        handleBarcodeScan={handleBarcodeScan}
        showLangDropdown={showLangDropdown}
        setShowLangDropdown={setShowLangDropdown}
        t={t}
        i18n={i18n}
        onLogout={() => navigate('/sales/create')}
      />

      <div className='pos-main-wrapper'>
        {/* ── Left Section ── */}
        <main className='pos-left-section'>
          <div className='pos-cart-area'>
            <ProductTable
              cartItems={cartItems}
              selectedId={selectedId}
              onSelectRow={setSelectedId}
              onQtyIncrease={handleQtyIncrease}
              onQtyDecrease={handleQtyDecrease}
              onQtyDecreaseRequestSecurity={setSecurityItem}
              isLoading={isCartLoading}
            />
          </div>

          {/* Left Bottom Summary & Actions */}
          <div className='pos-left-bottom'>
            <ProductSummary
              cartItems={cartItems}
              selectedId={selectedId}
              totalAmount={totalAmount}
              totalDiscount={totalDiscount}
              t={t}
            />

            <ActionBar
              onPrint={handlePrint}
              onDiscount={handleDiscount}
              onPostpone={handlePostpone}
              onCancelSale={handleCancelSale}
              onDeleteProduct={handleDeleteProduct}
              onReturn={handleReturn}
              hasSelectedProduct={!!selectedId}
              showQuickProducts={showQuickProducts}
              onToggleQuickProducts={() => setShowQuickProducts(!showQuickProducts)}
              t={t}
            />

            {/* Row 2: Conditional Tezkor Panel */}
            {showQuickProducts && (
              <PosQuickProducts
                onQuickAdd={handleQuickAdd}
                isLoading={isCartLoading}
                t={t}
              />
            )}
          </div>
        </main>

        {/* ── Right Section (Sidebar) ── */}
        <CheckoutSidebar
          saleId={id}
          cashBoxDetails={cashBoxDetails}
          customerId={customerId}
          setIsCustomerModalOpen={setIsCustomerModalOpen}
          removeDiscountCard={removeDiscountCard}
          showPaymentView={showPaymentView}
          setShowPaymentView={setShowPaymentView}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          receivedAmount={receivedAmount}
          setReceivedAmount={setReceivedAmount}
          totalAmount={totalAmount}
          handleQuickCash={handleQuickCash}
          handleCheckout={handleCheckout}
          isCheckoutLoading={isCheckoutLoading}
          cartItems={cartItems}
          t={t}
        />
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
              t={t}
            />
          </div>
        </div>
      )}

      {/* Security QR Modal */}
      <PosSecurityQrModal
        open={!!securityItem}
        productName={securityItem?.name}
        onApprove={handleSecurityApproved}
        onCancel={() => setSecurityItem(null)}
        t={t}
      />
    </div>
  )
}
