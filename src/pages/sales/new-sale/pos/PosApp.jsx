import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
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
import { buildReceiptLayout } from '@utils/receiptBuilder'
import { roundToOne } from '@utils/formatUZS'
import { loadSvgAsEscposHex } from '@utils/escposImage'
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
import PosProductSelectModal from './PosProductSelectModal'
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
  const [showHardRefreshConfirmation, setShowHardRefreshConfirmation] = useState(false)

  // Payment states
  const [showPaymentView, setShowPaymentView] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [cashPaymentSelected, setCashPaymentSelected] = useState(false)
  const [receivedAmount, setReceivedAmount] = useState('')
  const [cardPaymentSelected, setCardPaymentSelected] = useState(false)
  const [cardPaymentAmount, setRawCardPaymentAmount] = useState('')
  const [secondaryPaymentMethod, setSecondaryPaymentMethod] = useState(null)
  const [secondaryPaymentAmount, setRawSecondaryPaymentAmount] = useState('')
  const [focusedPaymentInput, setFocusedPaymentInput] = useState('cash')
  const [showAppScanModal, setShowAppScanModal] = useState(false)
  const [productSelectList, setProductSelectList] = useState([])
  const [pendingWeightGrams, setPendingWeightGrams] = useState(null)
  const [pendingScannedValue, setPendingScannedValue] = useState(null)
  const [cartOwnerType, setCartOwnerType] = useState('physical')

  // Loading skeleton and scan lock states
  const [pendingAddBarcode, setPendingAddBarcode] = useState(null)
  const [pendingNewItems, setPendingNewItems] = useState({})
  const [pendingQuantityUpdates, setPendingQuantityUpdates] = useState({})
  const pendingProductUpdatesRef = useRef({})

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
  const [isAgentRunning, setIsAgentRunning] = useState(true)
  const [activeAgentUrl, setActiveAgentUrl] = useState('http://localhost:7788')

  const checkAgentHealth = async () => {
    try {
      await axios.get('http://localhost:7788/health', { timeout: 2000 })
      setActiveAgentUrl('http://localhost:7788')
      setIsAgentRunning(true)
    } catch (e) {
      try {
        await axios.get('http://127.0.0.1:7777/health', { timeout: 2000 })
        setActiveAgentUrl('http://127.0.0.1:7777')
        setIsAgentRunning(true)
      } catch (e2) {
        setIsAgentRunning(false)
      }
    }
  }

  useEffect(() => {
    checkAgentHealth()
    const interval = setInterval(checkAgentHealth, 10000)
    return () => clearInterval(interval)
  }, [])

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

  // itemOrder maintains frontend interaction ordering (last scanned/updated items at the top)
  const [itemOrder, setItemOrder] = useState([])

  useEffect(() => {
    if (cartItems.length > 0) {
      setItemOrder((prev) => {
        const currentIds = cartItems.map((item) => item.id)
        let filtered = prev.filter((id) => currentIds.includes(id))
        const newIds = currentIds.filter((id) => !filtered.includes(id))
        return [...newIds, ...filtered]
      })
    } else {
      setItemOrder([])
    }
  }, [cartItems])

  const sortedCartItems = useMemo(() => {
    return [...cartItems].sort((a, b) => {
      const idxA = itemOrder.indexOf(a.id)
      const idxB = itemOrder.indexOf(b.id)
      if (idxA === -1 && idxB === -1) return 0
      if (idxA === -1) return 1
      if (idxB === -1) return -1
      return idxA - idxB
    })
  }, [cartItems, itemOrder])

  const setCardPaymentAmount = useCallback((val) => {
    setRawCardPaymentAmount((prev) => {
      let nextVal = typeof val === 'function' ? val(prev) : val
      const numTotal = Number(totalAmount || 0)
      if (nextVal !== '' && Number(nextVal) > numTotal) {
        return String(numTotal)
      }
      return nextVal
    })
  }, [totalAmount])

  const setSecondaryPaymentAmount = useCallback((val) => {
    setRawSecondaryPaymentAmount((prev) => {
      let nextVal = typeof val === 'function' ? val(prev) : val
      const numTotal = Number(totalAmount || 0)
      if (nextVal !== '' && Number(nextVal) > numTotal) {
        return String(numTotal)
      }
      return nextVal
    })
  }, [totalAmount])

  const posCartItemsList = useMemo(
    () => ({
      data: sortedCartItems,
      total_amount: totalAmount,
      sum: get(cartItemsRes, 'data.data.sum', totalAmount),
      discount_amount: get(cartItemsRes, 'data.data.discount_amount', 0),
      vat_sum: get(cartItemsRes, 'data.data.vat_sum', 0),
    }),
    [sortedCartItems, cartItemsRes, totalAmount],
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
  const totalDiscount = sortedCartItems.reduce((acc, item) => acc + (item.discount_price || 0), 0)

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
      success(t('pos.marking_updated'))
    },
    onError: () => {
      error(t('pos.marking_save_error'))
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
      cartOwnerType: cartOwnerType,
      setCardOwnerType: setCartOwnerType,
      cartItemsListLoading: isCartLoading,
    })
  console.log(posCartItemsList)

  const isCheckoutLoading = isFinishSaleWithoutAppPaymentType || isSendToEPOS || isGelOldEposCheck || isSendEPOSresponseToBackend

  const [isCreatingNewSale, setIsCreatingNewSale] = useState(false)

  const isSaleClosedError = (err) => {
    const code = get(err, 'response.data.code') || err?.response?.status
    const data = get(err, 'response.data.data')
    return code === 409 && data === 'sale.is.closed'
  }

  const handleSaleClosedTransition = async (originalActionCallback) => {
    setIsCreatingNewSale(true)
    try {
      let device_id = localStorage.getItem('device_id')
      if (!device_id && userData?.store?.terminal_ids?.length > 0) {
        device_id = userData.store.terminal_ids[0]
      }
      const storeId = get(userData, 'store.id')
      
      let openCashboxId = null
      if (storeId && device_id) {
        const checkRes = await requests.checkSaleExist({ store_id: storeId, device_id })
        const isOpen = get(checkRes, 'data.data.is_open', false)
        openCashboxId = get(checkRes, 'data.data.cash_box_id')
        if (!isOpen) {
          error(t('pos.cashbox_closed_redirect') || 'Kassa yopilgan, iltimos kassani oching')
          navigate('/sales/create')
          return
        }
      }

      const cashBoxOpId = openCashboxId || get(cashBoxDetails, 'data.data.cash_box_operation_id') || get(cashBoxDetails, 'data.data.id')
      if (!cashBoxOpId) {
        error(t('pos.cashbox_closed_redirect') || 'Kassa yopilgan, iltimos kassani oching')
        navigate('/sales/create')
        return
      }

      const { data: newSaleRes } = await requests.saleCreate({
        cash_box_operation_id: cashBoxOpId,
        store_id: storeId,
      })
      const nextId = get(newSaleRes, 'data.id')
      if (nextId) {
        navigate(`/sales/pos/${nextId}`, { replace: true })
        localStorage.setItem('last_sale_id', nextId)
        
        if (originalActionCallback) {
          await originalActionCallback(nextId)
        }
      } else {
        error('Yangi chek yaratib bo‘lmadi')
      }
    } catch (e) {
      console.error('Failed to resolve closed sale:', e)
      error('Yangi chek yaratib bo‘lmadi')
      navigate('/sales/create')
    } finally {
      setIsCreatingNewSale(false)
    }
  }

  const { mutate: addProduct } = useMutation(
    (params) => {
      const rest = { ...params }
      delete rest.originalScannedValue
      const barcode = params.barcode
      const originalScannedValue = params.originalScannedValue
      if (barcode) {
        setPendingAddBarcode(barcode)
        setPendingNewItems((prev) => ({ ...prev, [barcode]: Date.now() }))
        pendingProductUpdatesRef.current[barcode] = true
      }
      if (originalScannedValue) {
        setPendingNewItems((prev) => ({ ...prev, [originalScannedValue]: Date.now() }))
        pendingProductUpdatesRef.current[originalScannedValue] = true
      }
      return requests.createCartItem(rest)
    },
    {
      onSuccess: ({ data }, variables) => {
        const barcode = variables.barcode
        const originalScannedValue = variables.originalScannedValue
        const searchBarcode = variables.searchBarcode
        setPendingNewItems((prev) => {
          const next = { ...prev }
          if (barcode) delete next[barcode]
          if (originalScannedValue) delete next[originalScannedValue]
          if (searchBarcode) delete next[searchBarcode]
          return next
        })
        if (barcode) delete pendingProductUpdatesRef.current[barcode]
        if (originalScannedValue) delete pendingProductUpdatesRef.current[originalScannedValue]
        if (searchBarcode) delete pendingProductUpdatesRef.current[searchBarcode]
        setPendingAddBarcode(null)

        refetchCart()
        const newId = data?.data?.id
        if (newId) {
          setItemOrder((prev) => {
            const filtered = prev.filter((x) => x !== newId)
            return [newId, ...filtered]
          })
          setSelectedId(newId)
        }

        const origScanVal = variables.originalScannedValue
        if (origScanVal && origScanVal.length > 37 && get(data, 'data.is_marking', false)) {
          if (checkBarcodeWithMarking(data?.data?.barcode, origScanVal) && data?.data?.barcode.length > 0) {
            const marking = containsCyrillic(origScanVal) ? convertoRuOrEngToEng(origScanVal) : origScanVal
            saveMarkingToCartItem({
              id: data?.data?.store_product_id,
              data: {
                marking: marking,
              },
            })
          }
        }
      },
      onError: (err, variables) => {
        const barcode = variables.barcode
        const originalScannedValue = variables.originalScannedValue
        const searchBarcode = variables.searchBarcode

        if (isSaleClosedError(err)) {
          if (!variables._retried) {
            handleSaleClosedTransition(async (newSaleId) => {
              addProduct({ ...variables, sale_id: newSaleId, _retried: true })
            })
            return
          }
        }

        setPendingNewItems((prev) => {
          const next = { ...prev }
          if (barcode) delete next[barcode]
          if (originalScannedValue) delete next[originalScannedValue]
          if (searchBarcode) delete next[searchBarcode]
          return next
        })
        if (barcode) delete pendingProductUpdatesRef.current[barcode]
        if (originalScannedValue) delete pendingProductUpdatesRef.current[originalScannedValue]
        if (searchBarcode) delete pendingProductUpdatesRef.current[searchBarcode]
        setPendingAddBarcode(null)

        if (get(err, 'response.data.code') === 406) {
          success(t('pos.sale_closed'))
          navigate(`/sales/create`)
          return
        }
        error(get(err, 'response.data.message', t('pos.error_adding_product')))
      },
    },
  )

  const { mutate: changeQty } = useMutation(
    ({ id, data }) => {
      setPendingQuantityUpdates((prev) => ({ ...prev, [id]: true }))
      const item = cartItems.find((el) => el.id === id)
      if (item && item.barcode) {
        pendingProductUpdatesRef.current[item.barcode] = true
      }
      return requests.changeCartItemQuantity({ id, data })
    },
    {
      onSuccess: (res, variables) => {
        const id = variables.id
        setPendingQuantityUpdates((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        const item = cartItems.find((el) => el.id === id)
        if (item && item.barcode) {
          delete pendingProductUpdatesRef.current[item.barcode]
          // Clear matching sub-keys (e.g. raw scanned markings containing the barcode)
          Object.keys(pendingProductUpdatesRef.current).forEach((key) => {
            if (key.includes(item.barcode)) {
              delete pendingProductUpdatesRef.current[key]
            }
          })
        }
        refetchCart()
      },
      onError: (err, variables) => {
        const id = variables.id

        if (isSaleClosedError(err)) {
          if (!variables._retried) {
            handleSaleClosedTransition(async (newSaleId) => {
              const item = cartItems.find((el) => el.id === id)
              if (item) {
                addProduct({
                  sale_id: newSaleId,
                  barcode: item.barcode,
                  store_product_id: item.store_product_id,
                  discount_type: 'percent',
                  discount_value: 0,
                  _retried: true,
                })
              }
            })
            return
          }
        }

        setPendingQuantityUpdates((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        const item = cartItems.find((el) => el.id === id)
        if (item && item.barcode) {
          delete pendingProductUpdatesRef.current[item.barcode]
          // Clear matching sub-keys
          Object.keys(pendingProductUpdatesRef.current).forEach((key) => {
            if (key.includes(item.barcode)) {
              delete pendingProductUpdatesRef.current[key]
            }
          })
        }
        refetchCart()
        error(get(err, 'response.data.message', t('pos.error_changing_quantity')))
      },
    },
  )

  const { mutate: deleteItem } = useMutation(
    (params) => requests.deleteCartItem(params),
    {
      onSuccess: () => {
        refetchCart()
        success(t('pos.product_removed'))
      },
      onError: (err) => {
        if (isSaleClosedError(err)) {
          handleSaleClosedTransition()
          return
        }
        error(t('pos.error_removing_product'))
      },
    }
  )

  // Customer loyalty mutations
  const { mutate: addDiscountCard } = useMutation(
    (params) => requests.addDiscountCard(params),
    {
      onSuccess: ({ data }) => {
        refetchCart()
        success(t('pos.discount_card_added', { percent: data?.data?.discount_percent }))
      },
      onError: (err, variables) => {
        if (isSaleClosedError(err)) {
          if (!variables._retried) {
            handleSaleClosedTransition(async (newSaleId) => {
              addDiscountCard({ ...variables, sale_id: newSaleId, _retried: true })
            })
            return
          }
        }
        error(t('pos.error_adding_discount_card'))
        console.error('err', err)
      },
    }
  )

  const { mutate: removeDiscountCard } = useMutation(
    (params) => requests.removeDiscountCard(params),
    {
      onSuccess: () => {
        setCustomerId(null)
        refetchCart()
        success(t('pos.discount_card_removed'))
      },
      onError: (err, variables) => {
        if (isSaleClosedError(err)) {
          if (!variables._retried) {
            handleSaleClosedTransition(async (newSaleId) => {
              removeDiscountCard({ ...variables, sale_id: newSaleId, _retried: true })
            })
            return
          }
        }
        error(t('pos.error_removing_discount_card'))
        console.error('err', err)
      },
    }
  )

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
    setCartOwnerType('physical')
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
      setCartOwnerType('physical')
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
      error(t('pos.error_select_payment_type'))
      return
    }

    const cardAmount = Number(cardPaymentAmount || 0)
    const secondaryAmount = Number(secondaryPaymentAmount || 0)
    const numTotal = Number(totalAmount || 0)

    if ((cardPaymentSelected && cardAmount > numTotal) || 
        (secondaryPaymentMethod && secondaryAmount > numTotal)) {
      let errorMsg = t('pos.error_non_cash_exceeds')
      error(errorMsg)
      return
    }

    if (paymentAmount < Number(totalAmount || 0)) {
      error(t('pos.error_insufficient_payment'))
      return
    }

    const hasAppPayment = paymentsList.some((p) => p.type === 'app')
    if (hasAppPayment) {
      setShowAppScanModal(true)
      return
    }

    submitSale(paymentsList, undefined, maxAmount, cartOwnerType)
  }

  const handleAppScanSubmit = (scannedToken) => {
    setShowAppScanModal(false)
    submitSale(paymentsList, scannedToken, maxAmount, cartOwnerType)
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

    // Double-scan protection check
    if (pendingProductUpdatesRef.current[searchBarcode] || pendingProductUpdatesRef.current[scannedBarcode]) {
      console.log('Barcode scan blocked (already processing):', searchBarcode)
      return
    }

    // 2. Parse scale barcode (prefix 26 or 27 → 5-digit product code + weight)
    // Weight field is 5 digits (positions 7–11) in milligrams/decigrams; divide by 10 to get grams.
    // position 12 is the EAN check digit and must NOT be included in weight parsing.
    let weightGrams = null
    if (searchBarcode.startsWith('26') || searchBarcode.startsWith('27')) {
      const productCode = searchBarcode.slice(2, 7)
      const parsed = parseInt(searchBarcode.slice(7, 12), 10)
      if (productCode.length === 5 && !isNaN(parsed) && parsed > 0) {
        searchBarcode = productCode.replace(/^0+/, '') || productCode
        weightGrams = parsed
      }
    }

    // 3. Check if product already exists in cart (only for non-scale barcodes;
    //    scale barcodes are checked by store_product_id after the API lookup below)
    if (weightGrams === null) {
      const existing = cartItems.find((item) => item.barcode === searchBarcode)
      if (existing) {
        // Immediately select and move to top
        setSelectedId(existing.id)
        setItemOrder((prev) => {
          const filtered = prev.filter((x) => x !== existing.id)
          return [existing.id, ...filtered]
        })

        // Set update locks for this barcode and scanned value
        pendingProductUpdatesRef.current[searchBarcode] = true
        if (scannedBarcode) {
          pendingProductUpdatesRef.current[scannedBarcode] = true
        }

        changeQty({
          id: existing.id,
          data: {
            quantity: existing.quantity + 1,
            unit_quantity: existing.unit_quantity,
            store_product_id: existing.store_product_id,
          },
        })

        if (scannedBarcode.length > 37) {
          const marking = containsCyrillic(scannedBarcode) ? convertoRuOrEngToEng(scannedBarcode) : scannedBarcode
          saveMarkingToCartItem({
            id: existing.store_product_id,
            data: { marking },
          })
        }
        return
      }
    }

    // 4. Search store products to get store_product_id
    try {
      const storeId = get(userData, 'store.id')
      if (!storeId) {
        error(t('pos.error_store_not_found'))
        return
      }

      // Synchronously lock this search barcode and original value
      pendingProductUpdatesRef.current[searchBarcode] = true
      if (scannedBarcode) {
        pendingProductUpdatesRef.current[scannedBarcode] = true
      }

      // Set states to trigger skeleton row loading
      setPendingAddBarcode(searchBarcode)
      setPendingNewItems((prev) => ({ ...prev, [searchBarcode]: Date.now() }))

      const res = await requests.getAllStoreProducts({ id: storeId }, { search: searchBarcode, offset: 0, limit: 30 })

      const productsList = get(res, 'data.data') || []

      if (productsList.length === 0) {
        // Release locks and reset pending states
        delete pendingProductUpdatesRef.current[searchBarcode]
        if (scannedBarcode) {
          delete pendingProductUpdatesRef.current[scannedBarcode]
        }
        setPendingAddBarcode(null)
        setPendingNewItems((prev) => {
          const next = { ...prev }
          delete next[searchBarcode]
          return next
        })
        error(t('product_not_found'))
        return
      }

      // If multiple products match, let the cashier pick one
      if (productsList.length > 1) {
        setPendingWeightGrams(weightGrams)
        setPendingScannedValue(scannedBarcode)
        setProductSelectList(productsList)

        // Clear skeletons since search resolves to modal selection
        delete pendingProductUpdatesRef.current[searchBarcode]
        if (scannedBarcode) {
          delete pendingProductUpdatesRef.current[scannedBarcode]
        }
        setPendingAddBarcode(null)
        setPendingNewItems((prev) => {
          const next = { ...prev }
          delete next[searchBarcode]
          return next
        })
        return
      }

      addProductToCart(productsList[0], weightGrams, scannedBarcode, searchBarcode)
    } catch (err) {
      // Clear locks and reset pending states on error
      delete pendingProductUpdatesRef.current[searchBarcode]
      if (scannedBarcode) {
        delete pendingProductUpdatesRef.current[scannedBarcode]
      }
      setPendingAddBarcode(null)
      setPendingNewItems((prev) => {
        const next = { ...prev }
        delete next[searchBarcode]
        return next
      })
      error(t('pos.error_searching_product'))
      console.error(err)
    }
  }

  const addProductToCart = (product, weightGrams, originalScannedValue, searchBarcode) => {
    // For scale products already in cart: accumulate weight
    if (weightGrams !== null) {
      const existingScaleItem = cartItems.find((item) => item.store_product_id === product.id)
      if (existingScaleItem) {
        // Immediately select and move to top
        setSelectedId(existingScaleItem.id)
        setItemOrder((prev) => {
          const filtered = prev.filter((x) => x !== existingScaleItem.id)
          return [existingScaleItem.id, ...filtered]
        })

        const currentGrams = existingScaleItem.quantity * existingScaleItem.unit_per_pack + existingScaleItem.unit_quantity

        // Clear new item state/locks because this is an update to an existing row
        if (product.barcode) {
          delete pendingProductUpdatesRef.current[product.barcode]
          setPendingNewItems((prev) => {
            const next = { ...prev }
            delete next[product.barcode]
            return next
          })
        }
        if (originalScannedValue) {
          delete pendingProductUpdatesRef.current[originalScannedValue]
          setPendingNewItems((prev) => {
            const next = { ...prev }
            delete next[originalScannedValue]
            return next
          })
        }
        if (searchBarcode) {
          delete pendingProductUpdatesRef.current[searchBarcode]
          setPendingNewItems((prev) => {
            const next = { ...prev }
            delete next[searchBarcode]
            return next
          })
        }
        setPendingAddBarcode(null)

        changeQty({
          id: existingScaleItem.id,
          data: {
            quantity: 0,
            unit_quantity: Math.round(currentGrams + weightGrams),
            store_product_id: existingScaleItem.store_product_id,
          },
        })
        return
      }
    }
    addProduct({
      sale_id: id,
      barcode: product.barcode,
      store_product_id: product.id,
      discount_type: 'percent',
      discount_value: 0,
      ...(weightGrams !== null && { weight_grams: weightGrams }),
      originalScannedValue,
      searchBarcode,
    })
  }

  const handleProductSelect = (product) => {
    setProductSelectList([])
    addProductToCart(product, pendingWeightGrams, pendingScannedValue, pendingAddBarcode)
    setPendingWeightGrams(null)
    setPendingScannedValue(null)
  }

  const handleProductSelectCancel = () => {
    setProductSelectList([])
    setPendingWeightGrams(null)
    setPendingScannedValue(null)
  }

  const handleQuickAdd = async (productSearchQuery) => {
    try {
      const storeId = get(userData, 'store.id')
      if (!storeId) {
        error(t('pos.error_store_not_found'))
        return
      }
      const res = await requests.getAllStoreProducts({ id: storeId }, { search: productSearchQuery, offset: 0, limit: 1 })
      const productsList = get(res, 'data.data') || []
      if (productsList.length === 0) {
        error(t('pos.error_product_not_found_query', { query: productSearchQuery }))
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
      error(t('pos.error_quick_add'))
      console.error(err)
    }
  }

  useBarcodeScanner({
    onScan: handleBarcodeScan,
    enabled: !isLocked,
  })

  const handleQtyIncrease = (item) => {
    setSelectedId(item.id)
    setItemOrder((prev) => {
      const filtered = prev.filter((x) => x !== item.id)
      return [item.id, ...filtered]
    })
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
      setSelectedId(item.id)
      setItemOrder((prev) => {
        const filtered = prev.filter((x) => x !== item.id)
        return [item.id, ...filtered]
      })
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
    setCartOwnerType('physical')
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
      let logoHex = null
      try {
        logoHex = await loadSvgAsEscposHex('/MagnitLogoPremiumCheque.svg', 400, 576)
      } catch (e) {
        console.warn('Receipt logo failed to load:', e)
      }

      let paymentType = 'cash'
      if (cardPaymentSelected) {
        paymentType = 'card'
      } else if (secondaryPaymentMethod) {
        paymentType = secondaryPaymentMethod
      }

      const cashierNameStr = `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'Кассир'

      const payloadData = {
        saleId: String(cashBoxDetails?.data?.data?.sale_number || finalNewSaleId || id || ''),
        cashier: cashierNameStr,
        paymentType: paymentType,
        date: new Date().toISOString(),
        items: cartItems.map((item) => ({
          name: item.name || 'Товар',
          mxik: item.mxik || item.code || '',
          qty: item.unit_per_pack === 1000 
            ? ((item.quantity || 0) * 1000 + (item.unit_quantity || 0)) / 1000
            : Number(item.quantity || 1),
          price: Number(item.unit_price || 0),
          total: Number(item.total_price || 0),
          vatPercent: item.vat_percent || (posCartItemsList.vat_sum > 0 ? 12 : 0),
          vatAmount: item.vat_amount || 0,
        })),
        subtotal: Number(
          cartItems.reduce((acc, item) => {
            const qty = item.unit_per_pack === 1000 
              ? ((item.quantity || 0) * 1000 + (item.unit_quantity || 0)) / 1000
              : (item.quantity || 0)
            return acc + item.unit_price * qty
          }, 0)
        ),
        discount: Number(totalDiscount || 0),
        totalAmount: Number(totalAmount || 0),
        paidAmount: Number(receivedAmount || cardPaymentAmount || secondaryPaymentAmount || totalAmount || 0),
        changeAmount: roundToOne(Math.max(Number(receivedAmount || 0) - Number(totalAmount || 0), 0)),
        vatAmount: Number(posCartItemsList.vat_sum || 0),
        chequeType: 'sale',
        fiscalSign: qrcodeUrl.fiscal && qrcodeUrl.fiscal !== 'pending' ? String(qrcodeUrl.fiscal) : '',
        fiscalNumber: qrcodeUrl.terminalId && qrcodeUrl.terminalId !== 'pending' ? String(qrcodeUrl.terminalId) : '',
        fiscalDate: qrcodeUrl.datetime && qrcodeUrl.datetime !== 'pending' ? String(qrcodeUrl.datetime) : '',
        qrData: qrcodeUrl.qr && qrcodeUrl.qr !== 'pending' ? String(qrcodeUrl.qr) : '',
        customer: customerId?.name ? String(customerId.name) : '',
      }

      const layoutLines = buildReceiptLayout(payloadData, { logoHex })

      const reqPayload = {
        lines: layoutLines,
        paymentType: paymentType,
      }

      const res = await axios.post(`${activeAgentUrl}/print/raw-template`, reqPayload)
      if (res.data && res.data.ok) {
        success(t('pos.printer.receipt_printed'))
      } else {
        error(t('pos.printer.print_error_prefix') + (res.data.message || ''))
      }
    } catch (err) {
      console.error('Failed to print receipt locally:', err)
      error(t('pos.printer.no_response'))
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

  const performHardRefresh = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister())
      })
    }
    if ('caches' in window) {
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => caches.delete(key)))
      })
    }
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handleHardRefreshRequest = () => {
    if (cartItems && cartItems.length > 0) {
      setShowHardRefreshConfirmation(true)
    } else {
      performHardRefresh()
    }
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

  useEffect(() => {
    const numTotal = Number(totalAmount || 0)
    if (cardPaymentAmount && Number(cardPaymentAmount) > numTotal) {
      setCardPaymentAmount(String(numTotal))
    }
    if (secondaryPaymentAmount && Number(secondaryPaymentAmount) > numTotal) {
      setSecondaryPaymentAmount(String(numTotal))
    }
  }, [totalAmount, cardPaymentAmount, secondaryPaymentAmount])

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

  const handleOpenCashDrawer = async () => {
    try {
      const res = await axios.post(`${activeAgentUrl}/cash-drawer/open`)
      if (res.data && res.data.ok) {
        success(t('pos.drawer_opened'))
        // Optional: log to backend here if required by the API
      } else {
        error(t('pos.printer.drawer_open_error'))
      }
    } catch (err) {
      error(t('pos.printer.error_prefix') + (err.response?.data?.message || err.message))
    }
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
        isAgentRunning={isAgentRunning}
        onOpenCashDrawer={handleOpenCashDrawer}
        onHardRefresh={handleHardRefreshRequest}
      />

      {saleCreationError && (
        <div
          style={{
            width: '100%',
            backgroundColor: '#fef2f2',
            borderBottom: '2px solid #ef4444',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box',
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: '700', color: '#991b1b', fontSize: '15px' }}>{t('pos.error_new_receipt_title')}</div>
              <div style={{ fontSize: '13px', color: '#7f1d1d', marginTop: '2px' }}>
                {t('pos.error_new_receipt_desc')}
              </div>
            </div>
          </div>
          <button
            type='button'
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
                error(t('pos.error_create_receipt_net'))
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
              transition: 'background-color 0.2s',
            }}
          >
            {t('pos.retry')}
          </button>
        </div>
      )}

      <div className='pos-main-wrapper'>
        {/* ── Left Section ── */}
        <main className='pos-left-section'>
          <div className='pos-cart-area'>
            <ProductTable
              cartItems={sortedCartItems}
              selectedId={selectedId}
              onSelectRow={setSelectedId}
              onQtyIncrease={handleQtyIncrease}
              onQtyDecrease={handleQtyDecrease}
              onQtyDecreaseRequestSecurity={setSecurityItem}
              isLoading={isCartLoading}
              pendingQuantityUpdates={pendingQuantityUpdates}
              pendingNewItems={pendingNewItems}
            />
          </div>

          {/* Left Bottom Summary & Actions */}
          <div className='pos-left-bottom'>
            <ProductSummary cartItems={sortedCartItems} selectedId={selectedId} totalAmount={totalAmount} totalDiscount={totalDiscount} t={t} />

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
          cartItems={sortedCartItems}
          cartOwnerType={cartOwnerType}
          setCartOwnerType={setCartOwnerType}
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

      {/* Product Select Modal — shown when search returns multiple results */}
      <PosProductSelectModal
        open={productSelectList.length > 1}
        products={productSelectList}
        onSelect={handleProductSelect}
        onCancel={handleProductSelectCancel}
        t={t}
      />

      {/* Cancel Receipt Confirmation Dialog Overlay */}
      {showHardRefreshConfirmation && (
        <div
          className='pos-modal-overlay'
          onClick={() => setShowHardRefreshConfirmation(false)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className='pos-modal' onClick={(e) => e.stopPropagation()} style={{ width: '400px', maxWidth: '90%', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#333' }}>{t('pos.refresh_confirm_title')}</h3>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowHardRefreshConfirmation(false)}
                style={{
                  padding: '10px 20px',
                  background: '#F3F4F6',
                  color: '#4B5563',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {t('pos.cancel')}
              </button>
              <button
                onClick={() => {
                  setShowHardRefreshConfirmation(false)
                  performHardRefresh()
                }}
                style={{ padding: '10px 20px', background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                {t('pos.refresh')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirmation && (
        <div className='touch-modal-overlay' onClick={() => setShowCancelConfirmation(false)}>
          <div className='touch-modal-card' onClick={(e) => e.stopPropagation()} style={{ width: '400px', textAlign: 'center' }}>
            <div className='touch-modal-header' style={{ justifyContent: 'center' }}>
              <div className='touch-modal-username' style={{ color: '#ffffff', fontSize: '20px' }}>
                {t('pos.cancel_receipt')}?
              </div>
            </div>
            <div className='touch-modal-body' style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <div style={{ fontSize: '16px', color: 'var(--pos-text-secondary)' }}>
                {t('pos.cancel_receipt_confirm_desc')}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type='button'
                  className='btn-secondary-touch'
                  style={{ flex: 1, height: '48px', borderRadius: '24px' }}
                  onClick={() => setShowCancelConfirmation(false)}
                >
                  {t('no')}
                </button>
                <button
                  type='button'
                  className='btn-orange-touch'
                  style={{ flex: 1, height: '48px', borderRadius: '24px', backgroundColor: '#dc2626' }}
                  onClick={handleCancelConfirm}
                >
                  {t('yes')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreatingNewSale && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>
            Yangi chek yaratilmoqda...
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
