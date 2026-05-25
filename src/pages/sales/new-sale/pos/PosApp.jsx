import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import { extractNumbers, checkBarcodeWithMarking } from '@utils/checkingMarkingWithBarcode'
import { containsCyrillic, convertoRuOrEngToEng } from '@utils/convertoRuOrEngToEng'
import { useBarcodeScanner } from '@/hooks/pos/useBarcodeScanner'
import { useSaleOperations } from '@/hooks/sale/useSaleOperations'
import { usePrintOperations } from '@/hooks/sale/usePrintOperations'
import { RippedPaperItem } from '@components/RippedPaperList'
import PosClientPanel from './PosClientPanel'
import POSHeader from './POSHeader'
import ProductTable from './ProductTable'
import CashierSessionModal from './CashierSessionModal'
import POSLockScreen from './POSLockScreen'
import CheckoutSidebar from './CheckoutSidebar'
import ProductSummary from './ProductSummary'
import PosQuickSelectDrawer from './PosQuickSelectDrawer'
import ActionBar from './ActionBar'
import PosSecurityQrModal from './PosSecurityQrModal'
import PosAppScanModal from './PosAppScanModal'
import SaleProgressSteps from '../saleStepLoading'
import './PosLayout.css'
import ReturnExchangeDrawer from '@components/Sales/ReturnExchange/ReturnExchangeDrawer'
import DraftDrawer from '@components/Sales/DraftDrawer'
import axios from 'axios'
import PosPrinterSettings from './PosPrinterSettings'

export default function PosApp() {
  const { id } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()

  // ── States ──
  const [customerId, setCustomerId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [showQuickProducts, setShowQuickProducts] = useState(false)
  const [securityItem, setSecurityItem] = useState(null)
  const [time, setTime] = useState('')
  const [showCashierSession, setShowCashierSession] = useState(false)
  const [showPrinterSettings, setShowPrinterSettings] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [showReturnDrawer, setShowReturnDrawer] = useState(false)
  const [showHeldSalesDrawer, setShowHeldSalesDrawer] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)

  // Payment states
  const [showPaymentView, setShowPaymentView] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [cashPaymentSelected, setCashPaymentSelected] = useState(false)
  const [receivedAmount, setReceivedAmount] = useState('')
  const [cardPaymentSelected, setCardPaymentSelected] = useState(false)
  const [cardPaymentAmount, setCardPaymentAmount] = useState('')
  const [secondaryPaymentMethod, setSecondaryPaymentMethod] = useState(null)
  const [secondaryPaymentAmount, setSecondaryPaymentAmount] = useState('')
  const [focusedPaymentInput, setFocusedPaymentInput] = useState('cash')
  const [showAppScanModal, setShowAppScanModal] = useState(false)

  // Customer selection & topbar search states
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [topbarSearchTerm, setTopbarSearchTerm] = useState('')
  const [newSaleId, setNewSaleId] = useState(null)
  const [saleCreationError, setSaleCreationError] = useState(false)
  const [qrcodeUrl, setQrcodeUrl] = useState({})
  const [openRefreshDialog, setOpenRefreshDialog] = useState(false)
  const [dmedPrescriptionsList, setDmedPrescriptionsList] = useState([])
  const [dmedOrganizedList, setDmedOrganizedList] = useState([])

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
  const { data: paymentTypesList } = useQuery('paymentTypesList', () => requests.getPaymentTypesList())

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
  const posCartItemsList = useMemo(
    () => ({
      data: cartItems,
      total_amount: totalAmount,
      sum: get(cartItemsRes, 'data.data.sum', totalAmount),
      discount_amount: get(cartItemsRes, 'data.data.discount_amount', 0),
      vat_sum: get(cartItemsRes, 'data.data.vat_sum', 0),
    }),
    [cartItemsRes],
  )

  const getPaymentTypeId = (names = []) => {
    const paymentTypes = get(paymentTypesList, 'data.data', [])
    return paymentTypes.find((item) => names.includes(item.name) || names.includes(item.front_name))?.id
  }

  const paymentsList = useMemo(() => {
    const payments = []

    if (cashPaymentSelected && Number(receivedAmount) > 0) {
      payments.push({
        amount: Number(receivedAmount),
        payment_type_id: getPaymentTypeId(['Naqd', 'cash']),
        type: 'cash',
        name: 'Naqd',
        app_type: 'naqd',
        front_name: 'cash',
      })
    }

    if (cardPaymentSelected && Number(cardPaymentAmount) > 0) {
      payments.push({
        amount: Number(cardPaymentAmount),
        payment_type_id: getPaymentTypeId(['Uzcard', 'Humo', 'card']),
        type: 'card',
        name: 'Uzcard',
        app_type: 'Uzcard',
        front_name: 'card',
      })
    }

    if (secondaryPaymentMethod && Number(secondaryPaymentAmount) > 0) {
      const appNameByMethod = {
        click: 'Click',
        payme: 'Payme',
        uzum: 'Uzum',
        loyaltycard: 'Balans',
      }
      const appName = appNameByMethod[secondaryPaymentMethod]

      payments.push({
        amount: Number(secondaryPaymentAmount),
        payment_type_id: getPaymentTypeId([appName, secondaryPaymentMethod]),
        type: secondaryPaymentMethod === 'loyaltycard' ? 'loyaltycard' : 'app',
        name: appName,
        app_type: secondaryPaymentMethod,
        front_name: secondaryPaymentMethod,
      })
    }

    return payments
  }, [cashPaymentSelected, receivedAmount, cardPaymentSelected, cardPaymentAmount, secondaryPaymentMethod, secondaryPaymentAmount, paymentTypesList])

  const paymentAmount = paymentsList.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const maxAmount = Number(totalAmount || 0) - paymentAmount

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

  const { submitSale, isFinishSaleWithoutAppPaymentType, isSendToEPOS, isGelOldEposCheck, isSendEPOSresponseToBackend, hasError, setHasError } =
    useSaleOperations({
      cartItemsList: posCartItemsList,
      markingsList: {},
      dmedOrganizedList,
      dmedPrescriptionsList,
      serviceType: 'other',
      cashBoxDetails,
      customerId,
      setNewSaleId,
      setQrcodeUrl,
      setOpenRefreshDialog,
      setDmedPrescriptionsList,
      setDmedOrganizedList,
      setCustomerId,
      paymentsList,
      maxAmount,
      cartOwnerType: 'personal',
      cartItemsListLoading: isCartLoading,
    })
  console.log(posCartItemsList)

  const isCheckoutLoading = isFinishSaleWithoutAppPaymentType || isSendToEPOS || isGelOldEposCheck || isSendEPOSresponseToBackend

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
    if (focusedPaymentInput === 'secondary' && secondaryPaymentMethod) {
      setSecondaryPaymentAmount((prev) => String(Number(prev || 0) + amount))
    } else if (focusedPaymentInput === 'card' && cardPaymentSelected) {
      setCardPaymentAmount((prev) => String(Number(prev || 0) + amount))
    } else {
      setCashPaymentSelected(true)
      setReceivedAmount((prev) => String(Number(prev || 0) + amount))
      setFocusedPaymentInput('cash')
      setPaymentMethod('cash')
    }
  }

  const handleStartPaymentView = () => {
    setCashPaymentSelected(false)
    setReceivedAmount('')
    setCardPaymentSelected(false)
    setCardPaymentAmount('')
    setSecondaryPaymentMethod(null)
    setSecondaryPaymentAmount('')
    setFocusedPaymentInput(null)
    setPaymentMethod(null)
    setShowPaymentView(true)
  }

  const handleSelectCashPayment = () => {
    if (cashPaymentSelected) {
      setCashPaymentSelected(false)
      setReceivedAmount('')
      if (cardPaymentSelected) {
        setFocusedPaymentInput('card')
        setPaymentMethod('card')
      } else if (secondaryPaymentMethod) {
        setFocusedPaymentInput('secondary')
        setPaymentMethod(secondaryPaymentMethod)
      } else {
        setFocusedPaymentInput(null)
        setPaymentMethod(null)
      }
      return
    }

    const remainingAmount = Math.max(Number(totalAmount) - Number(cardPaymentAmount || 0) - Number(secondaryPaymentAmount || 0), 0)
    if (remainingAmount <= 0) return

    setCashPaymentSelected(true)
    setReceivedAmount(String(remainingAmount))
    setFocusedPaymentInput('cash')
    setPaymentMethod('cash')
  }

  const handleSelectCardPayment = () => {
    if (cardPaymentSelected) {
      setCardPaymentSelected(false)
      setCardPaymentAmount('')
      if (cashPaymentSelected) {
        setFocusedPaymentInput('cash')
        setPaymentMethod('cash')
      } else if (secondaryPaymentMethod) {
        setFocusedPaymentInput('secondary')
        setPaymentMethod(secondaryPaymentMethod)
      } else {
        setFocusedPaymentInput(null)
        setPaymentMethod(null)
      }
      return
    }

    const remainingAmount = Math.max(Number(totalAmount) - (cashPaymentSelected ? Number(receivedAmount || 0) : 0) - Number(secondaryPaymentAmount || 0), 0)
    if (remainingAmount <= 0) return

    setCardPaymentSelected(true)
    setCardPaymentAmount(String(remainingAmount))
    setFocusedPaymentInput('card')
    setPaymentMethod('card')
  }

  const handleSelectSecondaryPayment = (method) => {
    if (secondaryPaymentMethod === method) {
      setSecondaryPaymentMethod(null)
      setSecondaryPaymentAmount('')
      if (cashPaymentSelected) {
        setFocusedPaymentInput('cash')
        setPaymentMethod('cash')
      } else if (cardPaymentSelected) {
        setFocusedPaymentInput('card')
        setPaymentMethod('card')
      } else {
        setFocusedPaymentInput(null)
        setPaymentMethod(null)
      }
      return
    }

    const cashAmount = cashPaymentSelected ? Number(receivedAmount || 0) : 0
    const remainingAmount = Math.max(Number(totalAmount) - cashAmount - Number(cardPaymentAmount || 0), 0)
    if (remainingAmount <= 0) return

    setSecondaryPaymentMethod(method)
    setSecondaryPaymentAmount(String(remainingAmount))
    setFocusedPaymentInput('secondary')
    setPaymentMethod(method)
  }

  const handleCheckout = () => {
    if (!paymentsList.length) {
      error("To'lov turini tanlang")
      return
    }

    if (paymentAmount < Number(totalAmount || 0)) {
      error("To'lov summasi yetarli emas")
      return
    }

    const hasAppPayment = paymentsList.some((p) => p.type === 'app')
    if (hasAppPayment) {
      setShowAppScanModal(true)
      return
    }

    submitSale(paymentsList, undefined, maxAmount, 'personal')
  }

  const handleAppScanSubmit = () => {
    setShowAppScanModal(false)
    submitSale(paymentsList, undefined, maxAmount, 'personal')
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
    enabled: !isLocked,
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

  const handleSecurityApproved = () => {
    if (securityItem) {
      deleteItem(securityItem.id)
      setSecurityItem(null)
    }
  }

  const resetPaymentState = () => {
    setCashPaymentSelected(false)
    setReceivedAmount('')
    setCardPaymentSelected(false)
    setCardPaymentAmount('')
    setSecondaryPaymentMethod(null)
    setSecondaryPaymentAmount('')
    setShowPaymentView(false)
  }

  const { printContainer } = usePrintOperations({
    newSaleId,
    setNewSaleId,
    setQrcodeUrl,
    setPaymentsList: resetPaymentState,
    defaultPaymentTypes: [],
    setMarkingList: () => {},
    sendToEpos: localStorage.getItem('send_to_epos'),
  })

  const handleSaleTransition = async (finalNewSaleId) => {
    let nextSaleId = finalNewSaleId

    // 1. Immediately invalidate/remove old sale queries to prevent showing old items
    queryClient.removeQueries(['cartItemsList', id])
    queryClient.removeQueries(['cashBoxDetails', id])
    queryClient.setQueryData(['cartItemsList', id], { data: { data: [] } })

    // 2. Reset local component states
    setCustomerId(null)
    setSelectedId(null)
    setSecurityItem(null)
    setTopbarSearchTerm('')
    setCustomerSearchTerm('')
    setDmedPrescriptionsList([])
    setDmedOrganizedList([])
    resetPaymentState()
    setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })
    setNewSaleId(null)

    // 3. Create or fetch a new sale check if needed (e.g. if finalNewSaleId is null/false or '888')
    if (!nextSaleId || nextSaleId === '888') {
      try {
        const { data: newSaleRes } = await requests.saleCreate({
          cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'),
          store_id: get(userData, 'store.id'),
        })
        nextSaleId = get(newSaleRes, 'data.id')
        if (!nextSaleId) {
          throw new Error('No sale ID returned from saleCreate')
        }
        setSaleCreationError(false)
      } catch (err) {
        console.error('Failed to create new sale:', err)
        setSaleCreationError(true)
        error(t('pos.error_creating_sale') || 'Ошибка при создании новой продажи')
        return
      }
    } else {
      setSaleCreationError(false)
    }

    // 4. Navigate/update POS view to the new sale ID
    navigate(`/sales/pos/${nextSaleId}`)

    // Refetch the new queries
    queryClient.invalidateQueries(['cartItemsList', nextSaleId])
    queryClient.invalidateQueries(['cashBoxDetails', nextSaleId])
  }

  const handleLocalPrint = async () => {
    const finalNewSaleId = newSaleId
    const isPostPayment = !!finalNewSaleId

    try {
      let paymentType = 'cash'
      if (cardPaymentSelected) {
        paymentType = 'card'
      } else if (secondaryPaymentMethod) {
        paymentType = secondaryPaymentMethod
      }

      const cashierNameStr = `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'Кассир'

      const itemsPayload = cartItems.map((item) => ({
        name: item.name || 'Товар',
        qty: Number(item.quantity || 1),
        price: Number(item.unit_price || 0),
        total: Number(item.total_price || 0),
      }))

      const payload = {
        saleId: String(finalNewSaleId || id || ''),
        cashier: cashierNameStr,
        paymentType: paymentType,
        items: itemsPayload,
        subtotal: Number(cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0)),
        discount: Number(totalDiscount || 0),
        totalAmount: Number(totalAmount || 0),
        paidAmount: Number(receivedAmount || cardPaymentAmount || secondaryPaymentAmount || totalAmount || 0),
        changeAmount: Math.max(Number(receivedAmount || 0) - Number(totalAmount || 0), 0),
        vatAmount: Number(posCartItemsList.vat_sum || 0),
        chequeType: 'sale',
        fiscalSign: qrcodeUrl.fiscal && qrcodeUrl.fiscal !== 'pending' ? String(qrcodeUrl.fiscal) : '',
        fiscalNumber: qrcodeUrl.terminalId && qrcodeUrl.terminalId !== 'pending' ? String(qrcodeUrl.terminalId) : '',
        customer: customerId?.name ? String(customerId.name) : '',
      }

      const res = await axios.post('http://127.0.0.1:7777/print/receipt', payload)
      if (res.data && res.data.ok) {
        success('Чек напечатан!')
      } else {
        error('Ошибка печати: ' + (res.data.message || ''))
      }
    } catch (err) {
      console.error('Failed to print receipt locally:', err)
      error('Принтер чеков не отвечает. Проверьте агент печати.')
    } finally {
      if (isPostPayment) {
        await handleSaleTransition(finalNewSaleId)
      } else {
        setNewSaleId(false)
        resetPaymentState()
        setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })
      }
    }
  }

  useEffect(() => {
    if (newSaleId && qrcodeUrl.qr !== 'pending') {
      handleLocalPrint()
    }
  }, [newSaleId, qrcodeUrl])

  const handlePrintCurrentCheck = () => {
    handleLocalPrint()
  }

  const { mutate: holdSale, isLoading: isHoldingSale } = useMutation(requests.saleMoveToPending, {
    onSuccess: () => {
      success(t('pos.sale_held_success') || 'Продажа успешно отложена')
      requests
        .saleCreate({
          cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'),
          store_id: get(userData, 'store.id'),
        })
        .then(({ data: newSaleData }) => {
          navigate(`/sales/pos/${get(newSaleData, 'data.id')}`)
          window.location.reload()
        })
        .catch((err) => {
          error(t('pos.error_creating_sale') || 'Ошибка при создании новой продажи')
        })
    },
    onError: (err) => {
      error(t('pos.error_holding_sale') || 'Ошибка при откладывании продажи')
    },
  })

  const handleHold = () => {
    if (cartItems.length === 0) {
      error(t('pos.cart_empty_cannot_hold') || 'Корзина пуста, невозможно отложить')
      return
    }
    holdSale(id)
  }

  const handleCancelConfirm = async () => {
    setShowCancelConfirmation(false)
    try {
      if (cartItems.length > 0) {
        const itemIds = cartItems.map((item) => item.id)
        try {
          await requests.deleteAll({ ids: itemIds })
        } catch (e) {
          try {
            await requests.deleteAll(itemIds)
          } catch (e2) {
            for (const item of cartItems) {
              await requests.deleteCartItem(item.id)
            }
          }
        }
      }

      const { data: newSaleRes } = await requests.saleCreate({
        cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'),
        store_id: get(userData, 'store.id'),
      })
      success(t('pos.receipt_cancelled') || 'Чек аннулирован')
      navigate(`/sales/pos/${get(newSaleRes, 'data.id')}`)
      window.location.reload()
    } catch (err) {
      error(t('pos.error_cancelling_receipt') || 'Ошибка при аннулировании чека')
      console.error(err)
    }
  }

  const handleDiscount = () => {
    setIsCustomerModalOpen(true)
  }

  const handleCancelSale = () => {
    setShowCancelConfirmation(true)
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
    setShowReturnDrawer(true)
  }

  return (
    <div className='pos-shell'>
      <SaleProgressSteps
        isFinishSaleWithoutAppPaymentType={isFinishSaleWithoutAppPaymentType}
        isSendToEPOS={isSendToEPOS}
        isGelOldEposCheck={isGelOldEposCheck}
        isSendEPOSresponseToBackend={isSendEPOSresponseToBackend}
        hasError={hasError}
        setHasError={setHasError}
      />

      {/* ── Top Header ── */}
      <POSHeader
        time={time}
        cashierName={`${get(userData, 'first_name')} ${get(userData, 'last_name') ? `(${get(userData, 'last_name')})` : ''}`}
        userData={userData}
        showSearchInput={showSearchInput}
        setShowSearchInput={setShowSearchInput}
        topbarSearchTerm={topbarSearchTerm}
        setTopbarSearchTerm={setTopbarSearchTerm}
        handleBarcodeScan={handleBarcodeScan}
        showLangDropdown={showLangDropdown}
        setShowLangDropdown={setShowLangDropdown}
        t={t}
        i18n={i18n}
        onLogout={() => setShowCashierSession(true)}
        receiptNumber={cashBoxDetails?.data?.data?.sale_number || '--'}
        onOpenPrinterSettings={() => setShowPrinterSettings(true)}
      />

      {saleCreationError && (
        <div style={{
          width: '100%',
          backgroundColor: '#fef2f2',
          borderBottom: '2px solid #ef4444',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          zIndex: 999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: '700', color: '#991b1b', fontSize: '15px' }}>
                Ошибка создания нового чека / Yangi chek yaratishda xatolik yuz berdi
              </div>
              <div style={{ fontSize: '13px', color: '#7f1d1d', marginTop: '2px' }}>
                Продажа успешно завершена, но не удалось автоматически создать новый пустой чек. Пожалуйста, обновите страницу или создайте чек вручную.
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={async () => {
              try {
                const { data: newSaleRes } = await requests.saleCreate({
                  cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'),
                  store_id: get(userData, 'store.id'),
                })
                const nextId = get(newSaleRes, 'data.id')
                if (nextId) {
                  setSaleCreationError(false)
                  navigate(`/sales/pos/${nextId}`)
                }
              } catch (e) {
                error('Не удалось создать новый чек. Проверьте интернет-соединение.')
              }
            }}
            style={{
              padding: '10px 18px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
          >
            Повторить попытку
          </button>
        </div>
      )}

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
            <ProductSummary cartItems={cartItems} selectedId={selectedId} totalAmount={totalAmount} totalDiscount={totalDiscount} t={t} />

            <ActionBar
              customerId={customerId}
              onPrint={handlePrintCurrentCheck}
              onReturn={handleReturn}
              onHold={handleHold}
              onOpenHeldSales={() => setShowHeldSalesDrawer(true)}
              onDiscount={handleDiscount}
              onCancelSale={handleCancelSale}
              onDeleteProduct={handleDeleteProduct}
              hasSelectedProduct={!!selectedId}
              showQuickProducts={showQuickProducts}
              onToggleQuickProducts={() => setShowQuickProducts(!showQuickProducts)}
              showPaymentView={showPaymentView}
              paymentMethod={paymentMethod}
              cashPaymentSelected={cashPaymentSelected}
              cardPaymentSelected={cardPaymentSelected}
              cardPaymentAmount={cardPaymentAmount}
              secondaryPaymentMethod={secondaryPaymentMethod}
              secondaryPaymentAmount={secondaryPaymentAmount}
              onSelectCashPayment={handleSelectCashPayment}
              onSelectCardPayment={handleSelectCardPayment}
              onSelectSecondaryPayment={handleSelectSecondaryPayment}
              receivedAmount={receivedAmount}
              totalAmount={totalAmount}
              t={t}
            />

            {/* Row 2: Conditional Tezkor Panel */}
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
          onStartPaymentView={handleStartPaymentView}
          cashPaymentSelected={cashPaymentSelected}
          receivedAmount={receivedAmount}
          setReceivedAmount={setReceivedAmount}
          cardPaymentSelected={cardPaymentSelected}
          cardPaymentAmount={cardPaymentAmount}
          setCardPaymentAmount={setCardPaymentAmount}
          secondaryPaymentMethod={secondaryPaymentMethod}
          secondaryPaymentAmount={secondaryPaymentAmount}
          setSecondaryPaymentAmount={setSecondaryPaymentAmount}
          focusedPaymentInput={focusedPaymentInput}
          setFocusedPaymentInput={setFocusedPaymentInput}
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
          <div
            className='pos-modal'
            onClick={(e) => e.stopPropagation()}
            style={{ width: '450px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
          >
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

      {/* Hidden print container */}
      <div style={{ display: 'none' }}>
        <div ref={printContainer}>
          <RippedPaperItem
            qrcodeUrl={qrcodeUrl}
            qrcode='pending'
            markingsList={{}}
            paymentsList={paymentsList}
            cartItemsList={posCartItemsList}
            id='cheque_of_orders'
            cashBoxDetails={cashBoxDetails}
            customerId={customerId}
            noFormControl
            newSaleId={newSaleId}
            printContainer={printContainer}
          />
        </div>
      </div>

      {/* App Payment Scan Modal */}
      <PosAppScanModal
        open={showAppScanModal}
        paymentName={paymentsList.find((p) => p.type === 'app')?.name}
        onSubmit={handleAppScanSubmit}
        onCancel={() => setShowAppScanModal(false)}
        t={t}
      />

      {/* Cashier Session Modal */}
      <CashierSessionModal
        open={showCashierSession}
        onClose={() => setShowCashierSession(false)}
        onTempLogout={() => setIsLocked(true)}
        onCloseSession={() => {
          const operationId = get(cashBoxDetails, 'data.data.cash_box_operation_id')
          if (operationId) {
            navigate(`/sales/cash-shift-detail/${operationId}?sale_id=${id}`)
          } else {
            error(t('operation_not_found') || 'Смена не найдена')
          }
        }}
        t={t}
      />

      {/* Fullscreen Lock Screen */}
      <POSLockScreen open={isLocked} onUnlock={() => setIsLocked(false)} t={t} />

      {/* Return Exchange Drawer */}
      <ReturnExchangeDrawer open={showReturnDrawer} setOpen={setShowReturnDrawer} cashBoxDetails={cashBoxDetails} />

      {/* Held Sales (Draft) Drawer */}
      <DraftDrawer open={showHeldSalesDrawer} setOpen={setShowHeldSalesDrawer} cashBoxDetails={cashBoxDetails} />

      {/* Quick Select Drawer */}
      <PosQuickSelectDrawer open={showQuickProducts} onClose={() => setShowQuickProducts(false)} onQuickAdd={handleQuickAdd} isLoading={isCartLoading} t={t} />

      {/* Printer Settings Modal */}
      <PosPrinterSettings open={showPrinterSettings} onClose={() => setShowPrinterSettings(false)} t={t} />

      {/* Cancel Receipt Confirmation Dialog Overlay */}
      {showCancelConfirmation && (
        <div className='touch-modal-overlay' onClick={() => setShowCancelConfirmation(false)}>
          <div className='touch-modal-card' onClick={(e) => e.stopPropagation()} style={{ width: '400px', textAlign: 'center' }}>
            <div className='touch-modal-header' style={{ justifyContent: 'center' }}>
              <div className='touch-modal-username' style={{ color: '#ffffff', fontSize: '20px' }}>
                Cancel receipt?
              </div>
            </div>
            <div className='touch-modal-body' style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <div style={{ fontSize: '16px', color: 'var(--pos-text-secondary)' }}>
                Are you sure you want to cancel the current receipt and clear the cart?
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type='button'
                  className='btn-secondary-touch'
                  style={{ flex: 1, height: '48px', borderRadius: '24px' }}
                  onClick={() => setShowCancelConfirmation(false)}
                >
                  No
                </button>
                <button
                  type='button'
                  className='btn-orange-touch'
                  style={{ flex: 1, height: '48px', borderRadius: '24px', backgroundColor: '#dc2626' }}
                  onClick={handleCancelConfirm}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
