import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import { extractNumbers, checkBarcodeWithMarking } from '@utils/checkingMarkingWithBarcode'
import { isLooseWeightLine, markingSlotCount, hasMarkingShape } from '@utils/posLines'
import { containsCyrillic, convertoRuOrEngToEng } from '@utils/convertoRuOrEngToEng'
import { bypassNextAppExit } from '@hooks/useExitConfirm'
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
import PosMarkingScanModal from './PosMarkingScanModal'
import PosMunisQrModal from './PosMunisQrModal'
import PosProductSelectModal from './PosProductSelectModal'
import SaleProgressSteps from '../saleStepLoading'
import './PosLayout.css'
import ReturnExchangeDrawer from '@components/Sales/ReturnExchange/ReturnExchangeDrawer'
import axios from 'axios'
import PosPrinterSettings from './PosPrinterSettings'
import EditQuantityDialog from './EditQuantityDialog'
import PosZReportClosedModal from './PosZReportClosedModal'
import PosOnScreenKeyboard from './PosOnScreenKeyboard'
import PosLiveSearchPanel from './PosLiveSearchPanel'

export default function PosApp() {
  const { id } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  // TODO(temporary, frontend-only): security password is derived from the store name until
  // this check moves to the backend. Format: "{store_name}#5612@" (e.g. "MG3-Novza#5612@").
  const securityPassword = `${get(userData, 'store.name') || ''}#5612@`
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()

  // ── States ──
  const [customerId, setCustomerId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [showQuickProducts, setShowQuickProducts] = useState(false)
  const [securityItem, setSecurityItem] = useState(null)
  const [showCancelPasswordModal, setShowCancelPasswordModal] = useState(false)
  const [stornoPendingItem, setStornoPendingItem] = useState(null)
  const [time, setTime] = useState('')
  const [cashboxName] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('selected_cashbox') || 'null')
      return saved?.full_name || saved?.name || ''
    } catch (e) {
      return ''
    }
  })
  const [showCashierSession, setShowCashierSession] = useState(false)
  const [cashierSessionInitialView, setCashierSessionInitialView] = useState('options')
  const [showPrinterSettings, setShowPrinterSettings] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [showReturnDrawer, setShowReturnDrawer] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  const [showHardRefreshConfirmation, setShowHardRefreshConfirmation] = useState(false)

  // Payment states
  const [showPaymentView, setShowPaymentView] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [cashPaymentSelected, setCashPaymentSelected] = useState(false)
  const [receivedAmount, setReceivedAmount] = useState('')
  const [cardPaymentType, setCardPaymentType] = useState(null) // null | 'uzcard' | 'humo' — separate terminals/accounts
  const cardPaymentSelected = !!cardPaymentType
  const [cardPaymentAmount, setRawCardPaymentAmount] = useState('')
  const [secondaryPaymentMethod, setSecondaryPaymentMethod] = useState(null)
  const [secondaryPaymentAmount, setRawSecondaryPaymentAmount] = useState('')
  const [focusedPaymentInput, setFocusedPaymentInput] = useState('cash')
  const [showAppScanModal, setShowAppScanModal] = useState(false)
  const [showMunisQrModal, setShowMunisQrModal] = useState(false)
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
  const [showLiveSearchPanel, setShowLiveSearchPanel] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [keyboardLanguage, setKeyboardLanguage] = useState('uz')
  const [liveSearchResults, setLiveSearchResults] = useState([])
  const [isLiveSearchLoading, setIsLiveSearchLoading] = useState(false)
  const latestSearchIdRef = useRef(0)
  const [newSaleId, setNewSaleId] = useState(null)
  const [saleCreationError, setSaleCreationError] = useState(false)
  const [qrcodeUrl, setQrcodeUrl] = useState({})
  const [openRefreshDialog, setOpenRefreshDialog] = useState(false)
  const [dmedPrescriptionsList, setDmedPrescriptionsList] = useState([])
  const [dmedOrganizedList, setDmedOrganizedList] = useState([])
  const [isAgentRunning, setIsAgentRunning] = useState(true)
  const [activeAgentUrl, setActiveAgentUrl] = useState('http://localhost:7788')

  // ── Storno & Qty Edit states ──
  const [stornedIds, setStornedIds] = useState(new Set())
  const [frontendStornoItems, setFrontendStornoItems] = useState([])
  const [numpadQtyBuffer, setNumpadQtyBuffer] = useState('')
  const [showEditQtyDialog, setShowEditQtyDialog] = useState(false)
  const numpadQtyTimerRef = useRef(null)
  const numpadQtyBufferRef = useRef('')
  const failureCountRef = useRef(0)

  useEffect(() => {
    setFrontendStornoItems([])
  }, [id])

  const checkAgentHealth = async () => {
    try {
      await axios.get('http://localhost:7788/health', { timeout: 2000 })
      setActiveAgentUrl('http://localhost:7788')
      setIsAgentRunning(true)
      failureCountRef.current = 0
    } catch (e) {
      try {
        await axios.get('http://127.0.0.1:7777/health', { timeout: 2000 })
        setActiveAgentUrl('http://127.0.0.1:7777')
        setIsAgentRunning(true)
        failureCountRef.current = 0
      } catch (e2) {
        setIsAgentRunning(false)
        failureCountRef.current += 1
      }
    }
  }

  useEffect(() => {
    let timeoutId
    const runCheck = async () => {
      await checkAgentHealth()
      // Backoff check frequency if consecutive failures happen
      const delay = failureCountRef.current > 5 
        ? 60000 
        : (failureCountRef.current > 2 ? 30000 : 10000)
      timeoutId = setTimeout(runCheck, delay)
    }
    runCheck()
    return () => clearTimeout(timeoutId)
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
    dataUpdatedAt: cartUpdatedAt,
  } = useQuery(['cartItemsList', id], () => requests.getCartItemList({ sale_id: id, limit: 1000, offset: 0 }), {
    onError: (e) => {
      if (get(e, 'response.data.code') == '409') {
        navigate('/sales/create')
      }
    },
  })

  const cartItems = get(cartItemsRes, 'data.data.data', [])
  const totalAmount = get(cartItemsRes, 'data.data.total_amount', 0)

  // Global "marking required for all products" switch. It rides on the cart
  // response rather than a settings endpoint of its own, so a till picks up a
  // flip within one refresh and makes no extra request. Absent data means
  // false: during a backend wobble under-enforcing beats blocking every sale
  // at every till at once.
  const markingRequiredForAll = get(cartItemsRes, 'data.data.marking_required_for_all', false)

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

  const activeCartItems = useMemo(() => {
    const stornedOriginalIds = new Set(frontendStornoItems.map(item => item.original_cart_item_id).filter(Boolean))
    return sortedCartItems.filter((item) => {
      const qty = Number(item.quantity || 0)
      const unitQty = Number(item.unit_quantity || 0)
      return (qty > 0 || unitQty > 0) && !stornedOriginalIds.has(item.id)
    })
  }, [sortedCartItems, frontendStornoItems])

  const displayCartItems = useMemo(() => {
    return [...activeCartItems, ...frontendStornoItems]
  }, [frontendStornoItems, activeCartItems])

  // Does this line demand a marking code? Either the product itself is flagged,
  // or the global switch is on — in which case weight/loose lines stay exempt,
  // since there is no DataMatrix printed on a banana.
  // Does this line need a code scanned?
  //
  // Only while the global switch is on. With it off the receipt is fiscalized
  // under the generic exempt classification and carries no marking at all, so
  // prompting for one would stop the till to collect a code that is then never
  // sent. Weight/loose lines stay exempt either way — there is no DataMatrix
  // printed on a banana.
  const needsMarking = useCallback(
    (item) => markingRequiredForAll && !isLooseWeightLine(item),
    [markingRequiredForAll],
  )

  // Is a code MANDATORY on this line, as opposed to merely asked for?
  //
  // Only the global switch makes it mandatory, and never for a weight/loose
  // line. This is what decides both consequences: Skip removes the line rather
  // than dismissing the prompt, and payment is blocked while the line owes a
  // code.
  //
  // A product flagged is_marking with the switch OFF is deliberately NOT
  // mandatory — it prompts and it shows its badge, but the cashier may skip it
  // and finish the sale exactly as before, with the receipt going to the OFD
  // carrying an empty label. Forcing those to block would quietly make every
  // marked product unsellable the moment the flag was set.
  const markingIsMandatory = needsMarking

  // Markings live on the cart item in the backend (cart_items.markings), so the
  // receipt and the OFD payload read them from the server cart rather than from
  // local state — they survive a reload and a cashier handover.
  //
  // getReadyDataForOFD emits one receipt line per entry of this map, so the
  // entry count has to equal the line's fiscal slots — one per whole pack plus
  // one for any remainder — not the number of codes scanned. Otherwise an
  // un-scanned unit disappears from the receipt and its total stops matching
  // the sale. Un-scanned slots are therefore kept as empty strings, and surplus
  // codes left behind by a quantity edit are clamped off.
  const markingsList = useMemo(() => {
    const res = {}
    activeCartItems.forEach((item) => {
      const marks = (Array.isArray(item.markings) ? item.markings : []).filter(Boolean)
      if (!marks.length) return

      const slots = markingSlotCount(item)
      if (slots <= 0) return

      const out = {}
      for (let i = 0; i < slots; i += 1) out[i] = marks[i] || ''
      res[item.id] = out
    })
    return res
  }, [activeCartItems])

  // How many marking codes a line still owes. Must agree with markingsList slot
  // for slot, or the prompt would never close.
  const missingMarkingCount = useCallback(
    (item) => {
      if (!needsMarking(item)) return 0
      const scanned = (Array.isArray(item.markings) ? item.markings : []).filter(Boolean).length
      return Math.max(0, markingSlotCount(item) - scanned)
    },
    [needsMarking],
  )

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
      data: activeCartItems,
      total_amount: totalAmount,
      sum: get(cartItemsRes, 'data.data.sum', totalAmount),
      discount_amount: get(cartItemsRes, 'data.data.discount_amount', 0),
      vat_sum: get(cartItemsRes, 'data.data.vat_sum', 0),
    }),
    [activeCartItems, cartItemsRes, totalAmount],
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
      const cardSchemeName = cardPaymentType === 'humo' ? 'Humo' : 'Uzcard'
      payments.push({
        amount: Number(cardPaymentAmount),
        payment_type_id: getPaymentTypeId([cardSchemeName, 'card']),
        type: 'card',
        name: cardSchemeName,
        app_type: cardSchemeName,
        front_name: cardPaymentType || 'card',
      })
    }

    if (secondaryPaymentMethod && Number(secondaryPaymentAmount) > 0) {
      const appNameByMethod = {
        click: 'Click',
        payme: 'Payme',
        uzum: 'Uzum',
        munis: 'Munis',
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
  }, [cashPaymentSelected, receivedAmount, cardPaymentSelected, cardPaymentType, cardPaymentAmount, secondaryPaymentMethod, secondaryPaymentAmount, paymentTypesList])

  const paymentAmount = paymentsList.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const maxAmount = Number(totalAmount || 0) - paymentAmount

  const effectiveTotalAmount = totalAmount

  const totalDiscount = useMemo(() => {
    return activeCartItems.reduce((acc, item) => acc + (item.discount_price || 0), 0)
  }, [activeCartItems])

  // Search customers query
  const { data: customersRes, isLoading: isSearchingCustomers } = useQuery(
    ['customersList', customerSearchTerm],
    () => requests.getAllCustomersForSale({ search: customerSearchTerm }),
    {
      enabled: customerSearchTerm.length >= 3,
    },
  )

  // API returns null (not undefined) when there are no matches, so get()'s default never applies
  const customersList = get(customersRes, 'data.data.data') || []

  // ── Mutations ──
  // Cart item the cashier is currently being asked to scan a marking for.
  // `since` is the moment the prompt was opened: the cart in hand at that point
  // still shows the quantity from before the scan, so its marking count must
  // not be trusted until a fresh cart has arrived.
  const [markingTargetState, setMarkingTargetState] = useState(null)
  const markingTargetId = markingTargetState?.id || null

  const setMarkingTargetId = useCallback((nextId) => {
    setMarkingTargetState(nextId ? { id: nextId, since: Date.now() } : null)
  }, [])

  const markingTarget = useMemo(
    () => activeCartItems.find((item) => item.id === markingTargetId) || null,
    [activeCartItems, markingTargetId],
  )

  const markingTargetMissing = markingTarget ? missingMarkingCount(markingTarget) : 0

  const markingTargetRef = useRef(null)
  useEffect(() => {
    markingTargetRef.current = markingTargetMissing > 0 ? markingTarget : null
  }, [markingTarget, markingTargetMissing])

  // Close the prompt as soon as the line owes nothing — the refetch after each
  // saved marking is what drives this. A target that is not in the cart yet, or
  // whose cart snapshot predates the scan that opened the prompt, is left alone.
  useEffect(() => {
    if (!markingTargetState || !markingTarget) return
    if (cartUpdatedAt <= markingTargetState.since) return
    if (missingMarkingCount(markingTarget) === 0) {
      setMarkingTargetState(null)
    }
  }, [markingTargetState, markingTarget, missingMarkingCount, cartUpdatedAt])

  // Lines still owing a marking code. Payment is blocked while any exist.
  const markingMissingById = useMemo(() => {
    const res = {}
    activeCartItems.forEach((item) => {
      const missing = missingMarkingCount(item)
      if (missing > 0) res[item.id] = missing
    })
    return res
  }, [activeCartItems, missingMarkingCount])

  // Only mandatory lines stand between the cashier and the payment screen.
  const blockingMarkingItems = useMemo(
    () => activeCartItems.filter((item) => markingMissingById[item.id] && markingIsMandatory(item)),
    [activeCartItems, markingMissingById, markingIsMandatory],
  )

  const { mutate: saveMarkingToCartItem } = useMutation(requests.saveMarkingToCartItem, {
    onSuccess: () => {
      success(t('pos.marking_updated'))
      refetchCart()
    },
    onError: (err) => {
      const key = get(err, 'response.data.data') || get(err, 'response.data.message')
      if (key === 'marking.product.mismatch') {
        error(t('pos.marking_mismatch'))
        return
      }
      if (key === 'duplicate' || key === 'already.exists') {
        error(t('pos.marking_duplicate'))
        return
      }
      error(t('pos.marking_save_error'))
    },
  })

  // Persist one scanned DataMatrix against a cart item.
  //
  // Two checks, deliberately different in kind:
  //
  //  - shape: is this a DataMatrix at all? Always applied. It is what stops a
  //    plain product barcode — or the next item scanned while this prompt still
  //    holds focus — from being stored as this line's marking and printed on
  //    the fiscal receipt.
  //  - provenance: was this code printed for THIS product? Only when the global
  //    switch is off. With every line demanding a code, a false rejection born
  //    of our own bad barcode data would make an item unsellable, so the server
  //    records the mismatch and accepts it.
  //
  // Note the provenance check only fires when a GTIN was actually parsed: the
  // server accepts codes it cannot parse, and rejecting them here would make
  // manual entry impossible.
  const submitMarkingForItem = useCallback(
    (item, rawValue) => {
      const value = (rawValue || '').trim()
      if (!item || !value) return
      const marking = containsCyrillic(value) ? convertoRuOrEngToEng(value) : value

      if (!hasMarkingShape(marking)) {
        error(t('pos.marking_not_a_code'))
        return
      }
      if (!markingRequiredForAll && item.barcode && extractNumbers(marking) &&
          !checkBarcodeWithMarking(item.barcode, marking)) {
        error(t('pos.marking_mismatch'))
        return
      }
      saveMarkingToCartItem({ id: item.id, data: { marking } })
    },
    [saveMarkingToCartItem, markingRequiredForAll, t],
  )

  const {
    submitSale,
    isFinishSaleWithoutAppPaymentType,
    isSendToEPOS,
    isGelOldEposCheck,
    isSendEPOSresponseToBackend,
    hasError,
    setHasError,
    zReportClosedDialog,
    confirmOpenZReport,
    cancelZReportDialog,
    isOpeningZReport,
  } = useSaleOperations({
      cartItemsList: posCartItemsList,
      markingsList,
      markingRequiredForAll,
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
        openCashboxId = get(checkRes, 'data.data.cash_box_operation_id')
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

        // Marked goods must reach the OFD with a DataMatrix per unit. If the
        // cashier already scanned the marking itself we keep it and stay quiet;
        // a plain barcode scan means we still have to ask for one.
        // The create response is the raw cart_items row, so it carries no
        // unit_per_pack and cannot tell a weight line from a piece one. Decide
        // conservatively here and let the prompt's own open-condition — which
        // reads the full cart line, weight exemption included — have the final
        // say. A target set for an exempt line simply never opens and clears on
        // the next cart refresh.
        if (markingRequiredForAll) {
          const origScanVal = variables.originalScannedValue
          const scannedMarking = origScanVal && extractNumbers(origScanVal) ? origScanVal : null
          if (scannedMarking) {
            submitMarkingForItem(get(data, 'data'), scannedMarking)
          } else if (newId) {
            setMarkingTargetId(newId)
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

  // Both payment entry points go through here. The button is disabled too, but
  // handleCheckout is also reachable from the app-scan and Munis callbacks, so
  // the guard has to live in the handlers rather than only in the UI.
  const blockedByMarking = () => {
    const blocker = blockingMarkingItems[0]
    if (!blocker) return false
    error(t('pos.marking_blocked_checkout', { name: blocker.name }))
    setMarkingTargetId(blocker.id)
    return true
  }

  const handleStartPaymentView = () => {
    if (blockedByMarking()) return
    setCashPaymentSelected(false)
    setReceivedAmount('')
    setCardPaymentType(null)
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
    setReceivedAmount('')
    setFocusedPaymentInput('cash')
    setPaymentMethod('cash')
  }

  const handleSelectCardPayment = (scheme) => {
    if (cardPaymentType === scheme) {
      setCardPaymentType(null)
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

    if (cardPaymentType) {
      // Switching terminal (Uzcard <-> Humo) without re-entering the amount.
      setCardPaymentType(scheme)
      setFocusedPaymentInput('card')
      setPaymentMethod('card')
      return
    }

    const remainingAmount = Math.max(Number(totalAmount) - (cashPaymentSelected ? Number(receivedAmount || 0) : 0) - Number(secondaryPaymentAmount || 0), 0)
    if (remainingAmount <= 0) return

    setCardPaymentType(scheme)
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

  const handleCheckout = async () => {
    if (blockedByMarking()) return
    if (!paymentsList.length) {
      error(t('pos.error_select_payment_type'))
      return
    }

    const cardAmount = Number(cardPaymentAmount || 0)
    const secondaryAmount = Number(secondaryPaymentAmount || 0)
    const numEffective = effectiveTotalAmount

    if ((cardPaymentSelected && cardAmount > numEffective) ||
        (secondaryPaymentMethod && secondaryAmount > numEffective)) {
      error(t('pos.error_non_cash_exceeds'))
      return
    }

    if (paymentAmount < numEffective) {
      error(t('pos.error_insufficient_payment'))
      return
    }

    // Delete storned items from API before completing the sale
    const backendStornedIds = new Set()
    frontendStornoItems.forEach((item) => {
      if (item.original_cart_item_id) {
        backendStornedIds.add(item.original_cart_item_id)
      }
    })
    stornedIds.forEach((id) => {
      if (typeof id !== 'string' || !id.startsWith('storno-')) {
        backendStornedIds.add(id)
      }
    })

    if (backendStornedIds.size > 0) {
      const itemIds = Array.from(backendStornedIds)
      try {
        try {
          await requests.deleteAll({ ids: itemIds })
        } catch (e1) {
          for (const itemId of itemIds) {
            try { await requests.deleteCartItem(itemId) } catch {}
          }
        }
      } catch {} // non-fatal: proceed even if deletion fails
      setStornedIds(new Set())
    }

    // Munis: show a generated QR for the customer to scan, then finalize once paid.
    const hasMunisPayment = paymentsList.some((p) => p.type === 'app' && p.app_type === 'munis')
    if (hasMunisPayment) {
      setShowMunisQrModal(true)
      return
    }

    const hasAppPayment = paymentsList.some((p) => p.type === 'app')
    if (hasAppPayment) {
      setShowAppScanModal(true)
      return
    }

    const effectiveMaxAmount = numEffective - paymentAmount
    submitSale(paymentsList, undefined, effectiveMaxAmount, cartOwnerType)
  }

  const handleAppScanSubmit = (scannedToken) => {
    setShowAppScanModal(false)
    submitSale(paymentsList, scannedToken, maxAmount, cartOwnerType)
  }

  const handleMunisPaid = () => {
    setShowMunisQrModal(false)
    submitSale(paymentsList, undefined, maxAmount, cartOwnerType)
  }

  const handleBarcodeScan = async (scannedBarcode) => {
    if (!scannedBarcode) return

    // The prompt keeps its input focused (which pauses useBarcodeScanner), but
    // if focus was lost the scan still lands here — route it to the line that
    // is waiting for a marking instead of adding another product.
    if (markingTargetRef.current) {
      submitMarkingForItem(markingTargetRef.current, scannedBarcode)
      return
    }

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
      const existing = cartItems.find((item) => item.barcode === searchBarcode && (item.quantity > 0 || item.unit_quantity > 0) && !stornedIds.has(item.id))
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

        if (needsMarking(existing)) {
          if (extractNumbers(scannedBarcode)) {
            submitMarkingForItem(existing, scannedBarcode)
          } else {
            // the quantity just went up, so the line owes one more marking
            setMarkingTargetId(existing.id)
          }
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
      const existingScaleItem = cartItems.find((item) => item.store_product_id === product.id && (item.quantity > 0 || item.unit_quantity > 0) && !stornedIds.has(item.id))
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
      product_id: product.product_id,
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

  const triggerLiveSearch = async (query) => {
    const searchId = ++latestSearchIdRef.current
    setIsLiveSearchLoading(true)

    try {
      const storeId = get(userData, 'store.id')
      if (!storeId) return

      const res = await requests.getAllStoreProducts(
        { id: storeId },
        { search: query, offset: 0, limit: 30 }
      )

      if (searchId !== latestSearchIdRef.current) return

      const productsList = get(res, 'data.data') || []
      setLiveSearchResults(productsList)
    } catch (err) {
      if (searchId === latestSearchIdRef.current) {
        error(t('pos.error_searching_product'))
        console.error(err)
      }
    } finally {
      if (searchId === latestSearchIdRef.current) {
        setIsLiveSearchLoading(false)
      }
    }
  }

  const handleEnterBarcodeSearch = (query) => {
    const trimmed = query.trim()
    if (!trimmed) return
    triggerLiveSearch(trimmed)
  }

  const handleLiveProductSelect = (product) => {
    let weightGrams = null
    const searchBarcode = product.barcode
    const inputVal = topbarSearchTerm.trim()
    if (inputVal.startsWith('26') || inputVal.startsWith('27')) {
      const parsed = parseInt(inputVal.slice(7, 12), 10)
      if (!isNaN(parsed) && parsed > 0) {
        weightGrams = parsed
      }
    }

    addProductToCart(product, weightGrams, null, searchBarcode)
    
    setTopbarSearchTerm('')
    setShowSearchInput(false)
    setShowLiveSearchPanel(false)
    setShowKeyboard(false)
  }

  const handleCloseLiveSearch = () => {
    setTopbarSearchTerm('')
    setShowSearchInput(false)
    setShowLiveSearchPanel(false)
    setShowKeyboard(false)
  }

  const handleKeyboardLanguageChange = () => {
    setKeyboardLanguage((prev) => (prev === 'ru' ? 'uz' : 'ru'))
  }

  const handleKeyboardChange = (newVal) => {
    setTopbarSearchTerm(newVal)
  }

  const handleKeyboardBackspace = () => {
    setTopbarSearchTerm((prev) => prev.slice(0, -1))
  }

  const handleKeyboardClear = () => {
    setTopbarSearchTerm('')
  }

  const handleKeyboardEnter = () => {
    handleEnterBarcodeSearch(topbarSearchTerm)
  }

  useEffect(() => {
    if (!showLiveSearchPanel) {
      setLiveSearchResults([])
      latestSearchIdRef.current++
      return
    }

    const query = topbarSearchTerm.trim()
    const isNumeric = /^\d+$/.test(query)
    const isQueryValid = isNumeric ? query.length >= 1 : query.length >= 2

    if (!isQueryValid) {
      setLiveSearchResults([])
      setIsLiveSearchLoading(false)
      latestSearchIdRef.current++
      return
    }

    const delay = 300
    const timeoutId = setTimeout(() => {
      triggerLiveSearch(query)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [topbarSearchTerm, showLiveSearchPanel])

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
        product_id: product.product_id,
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

  // Skip means two different things. With marking required it is the only way
  // past a code that cannot be read, so it takes the line off the cheque
  // instead of waving it through unmarked. Otherwise it just closes the prompt,
  // exactly as before.
  const handleMarkingSkip = () => {
    const target = markingTarget
    setMarkingTargetId(null)
    if (target && markingIsMandatory(target)) {
      deleteItem(target.id)
    }
  }

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
    setCardPaymentType(null)
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
    setStornedIds(new Set())
    setNumpadQtyBuffer('')
    numpadQtyBufferRef.current = ''

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
        error(t('pos.error_creating_sale'))
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

      const cashierNameStr = `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || t('pos.default_cashier_name')

      const payloadData = {
        saleId: String(cashBoxDetails?.data?.data?.sale_number || finalNewSaleId || id || ''),
        cashier: cashierNameStr,
        kassaNumber: cashboxName || '-',
        paymentType: paymentType,
        isCorporateCard: qrcodeUrl.cardType === 'corporative',
        cardScheme: cardPaymentType,
        date: new Date().toISOString(),
        items: cartItems.map((item) => ({
          name: item.name || t('pos.default_product_name'),
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
        chequeType: get(cashBoxDetails, 'data.data.sale_type') === 'RETURN' ? 'return' : 'sale',
        fiscalSign: qrcodeUrl.fiscal && qrcodeUrl.fiscal !== 'pending' ? String(qrcodeUrl.fiscal) : '',
        fiscalNumber: qrcodeUrl.terminalId && qrcodeUrl.terminalId !== 'pending' ? String(qrcodeUrl.terminalId) : '',
        fiscalDate: qrcodeUrl.datetime && qrcodeUrl.datetime !== 'pending' ? String(qrcodeUrl.datetime) : '',
        qrData: qrcodeUrl.qr && qrcodeUrl.qr !== 'pending' ? String(qrcodeUrl.qr) : '',
        customer: customerId?.name ? String(customerId.name) : '',
      }

      const layoutLines = buildReceiptLayout(payloadData, {
        logoHex,
        name: get(userData, 'store.name'),
        address: get(userData, 'store.address'),
      })

      const reqPayload = {
        lines: layoutLines,
        paymentType: paymentType,
        qrSizeMm: 35,
      }

      if (paymentType === 'cash') {
        axios.post(`${activeAgentUrl}/cash-drawer/open`).catch((err) => {
          console.warn('Failed to open cash drawer before print:', err)
        })
      }

      const res = await axios.post(`${activeAgentUrl}/print/raw-template`, reqPayload, { timeout: 20000 })
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

  const handleOpenSearch = () => {
    handleCloseLiveSearch()
    setShowSearchInput(true)
    requestAnimationFrame(() => document.getElementById('posSearchQuery')?.focus())
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
    bypassNextAppExit()
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
    setStornedIds(new Set()) // clear storno before deleting all items
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
      success(t('pos.receipt_cancelled'))
      navigate(`/sales/pos/${get(newSaleRes, 'data.id')}`)
      bypassNextAppExit()
      window.location.reload()
    } catch (err) {
      error(t('pos.error_cancelling_receipt'))
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

  // ── Focus Fix: blur any focused action button to prevent scanner re-triggering ──
  const clearPOSActionFocus = () => {
    setTimeout(() => document.activeElement?.blur(), 0)
  }

  const handleDiscount = () => {
    setIsCustomerModalOpen(true)
  }

  const handleCancelSale = () => {
    clearPOSActionFocus()
    setShowCancelConfirmation(true)
  }

  // ── Storno: frontend-only cancellation, item remains in API cart ──
  // Requires admin password confirmation (see stornoPendingItem / PosSecurityQrModal below).
  const handleStornoProduct = () => {
    if (!selectedId) {
      error(t('pos.select_product_to_delete'))
      return
    }
    const selectedItem = sortedCartItems.find((item) => item.id === selectedId)
    if (!selectedItem) {
      error(t('pos.select_product_to_delete'))
      return
    }
    if (selectedItem.is_frontend_storno) return

    setStornoPendingItem(selectedItem)
  }

  const performStornoProduct = (selectedItem) => {
    const stornoCopy = {
      ...selectedItem,
      id: `storno-${selectedItem.id}-${Date.now()}`,
      original_cart_item_id: selectedItem.id,
      is_frontend_storno: true,
      is_storno: true,
      status: 'STORNO',
      quantity: selectedItem.quantity,
      unit_quantity: selectedItem.unit_quantity,
      total_price: selectedItem.total_price,
      unit_price: selectedItem.unit_price,
      created_at: new Date().toISOString(),
    }

    setFrontendStornoItems((prev) => [...prev, stornoCopy])
    setStornedIds((prev) => new Set([...prev, stornoCopy.id]))

    deleteItem(selectedItem.id)

    setSelectedId(null)
    setNumpadQtyBuffer('')
    numpadQtyBufferRef.current = ''
    clearPOSActionFocus()
  }

  // ── Edit Quantity Dialog handlers ──
  const handleEditQuantity = () => {
    if (!selectedId) return
    const selectedItem = activeCartItems.find((item) => item.id === selectedId)
    if (!selectedItem || stornedIds.has(selectedId)) return
    setShowEditQtyDialog(true)
    clearPOSActionFocus()
  }

  const handleEditQtyConfirm = ({ item, qty, kgVal, isWeight }) => {
    setShowEditQtyDialog(false)
    clearPOSActionFocus()
    if (!item) return
    if (isWeight) {
      const totalGrams = Math.round(kgVal * 1000)
      changeQty({
        id: item.id,
        data: {
          quantity: 0,
          unit_quantity: totalGrams,
          store_product_id: item.store_product_id,
        },
      })
    } else {
      changeQty({
        id: item.id,
        data: {
          quantity: qty,
          unit_quantity: item.unit_quantity,
          store_product_id: item.store_product_id,
        },
      })
    }
  }

  // ── Direct numpad quantity editing (sidebar numpad in cart mode) ──
  const handleNumpadQtyPress = useCallback(
    (val) => {
      const selectedItem = activeCartItems.find((el) => el.id === selectedId)
      if (!selectedItem || stornedIds.has(selectedId)) return
      const isWeight = selectedItem.unit_per_pack === 1000
      const capturedItem = selectedItem

      // Build the buffer
      const current = numpadQtyBufferRef.current
      let next
      if (val === 'clear') {
        next = ''
      } else if (val === 'backspace') {
        next = current.slice(0, -1)
      } else if (val === ',') {
        if (!isWeight) return
        if (current.includes(',')) return
        next = current === '' ? '0,' : current + ','
      } else {
        const digit = String(val)
        if (!isWeight && current.length >= 5) return
        if (isWeight && current.length >= 8) return
        next = current + digit
      }

      numpadQtyBufferRef.current = next
      setNumpadQtyBuffer(next)

      // Debounce the API call
      if (numpadQtyTimerRef.current) clearTimeout(numpadQtyTimerRef.current)
      numpadQtyTimerRef.current = setTimeout(() => {
        const buffer = numpadQtyBufferRef.current
        if (!buffer) {
          if (!isWeight) {
            changeQty({
              id: capturedItem.id,
              data: { quantity: 1, unit_quantity: capturedItem.unit_quantity, store_product_id: capturedItem.store_product_id },
            })
          }
          return
        }
        if (isWeight) {
          const kgVal = parseFloat(buffer.replace(',', '.'))
          if (!isNaN(kgVal) && kgVal > 0) {
            const totalGrams = Math.round(kgVal * 1000)
            changeQty({
              id: capturedItem.id,
              data: { quantity: 0, unit_quantity: totalGrams, store_product_id: capturedItem.store_product_id },
            })
          }
        } else {
          const qty = Math.max(1, parseInt(buffer, 10) || 1)
          changeQty({
            id: capturedItem.id,
            data: { quantity: qty, unit_quantity: capturedItem.unit_quantity, store_product_id: capturedItem.store_product_id },
          })
        }
      }, 600)
    },
    [selectedId, sortedCartItems, stornedIds],
  )

  // Reset numpad buffer when selection changes
  useEffect(() => {
    setNumpadQtyBuffer('')
    numpadQtyBufferRef.current = ''
    if (numpadQtyTimerRef.current) {
      clearTimeout(numpadQtyTimerRef.current)
    }
  }, [selectedId])

  const handleReturn = () => {
    clearPOSActionFocus()
    handleCloseLiveSearch()
    setShowReturnDrawer(true)
  }

  const handleTempLogout = () => setIsLocked(true)

  const handleCloseSessionShortcut = () => {
    const operationId = get(cashBoxDetails, 'data.data.cash_box_operation_id')
    if (operationId) {
      navigate(`/sales/cash-shift-detail/${operationId}?sale_id=${id}`)
    } else {
      error(t('operation_not_found'))
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
        cashboxName={cashboxName}
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
        onLogout={(view = 'options') => { handleCloseLiveSearch(); setCashierSessionInitialView(view); setShowCashierSession(true) }}
        onTempLogout={handleTempLogout}
        onCloseSession={handleCloseSessionShortcut}
        receiptNumber={cashBoxDetails?.data?.data?.sale_number || '--'}
        isReturnSale={get(cashBoxDetails, 'data.data.sale_type') === 'RETURN'}
        onOpenPrinterSettings={() => { handleCloseLiveSearch(); setShowPrinterSettings(true) }}
        isAgentRunning={isAgentRunning}
        onHardRefresh={handleHardRefreshRequest}
        onFocusLiveSearch={() => {
          setShowLiveSearchPanel(true)
          setKeyboardLanguage('uz')
          setShowKeyboard(true)
        }}
        onEnterBarcodeSearch={handleEnterBarcodeSearch}
        onCloseLiveSearch={handleCloseLiveSearch}
      />

      {showLiveSearchPanel && (
        <>
          <div className='pos-live-search-overlay' onClick={handleCloseLiveSearch} />
          <PosLiveSearchPanel
            open={showLiveSearchPanel}
            query={topbarSearchTerm}
            products={liveSearchResults}
            isLoading={isLiveSearchLoading}
            onSelect={handleLiveProductSelect}
            onClose={handleCloseLiveSearch}
            t={t}
          />
        </>
      )}

      {showKeyboard && (
        <PosOnScreenKeyboard
          value={topbarSearchTerm}
          onChange={handleKeyboardChange}
          onBackspace={handleKeyboardBackspace}
          onClear={handleKeyboardClear}
          onEnter={handleKeyboardEnter}
          language={keyboardLanguage}
          onLanguageChange={handleKeyboardLanguageChange}
          onClose={handleCloseLiveSearch}
          t={t}
        />
      )}

      {saleCreationError && (
        <div
          style={{
            width: '100%',
            backgroundColor: '#fdecec',
            borderBottom: '2px solid #e23a32',
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
              <div style={{ fontWeight: '700', color: '#c7332c', fontSize: '15px' }}>{t('pos.error_new_receipt_title')}</div>
              <div style={{ fontSize: '13px', color: '#c7332c', marginTop: '2px' }}>
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
              backgroundColor: '#e23a32',
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
              cartItems={displayCartItems}
              selectedId={selectedId}
              onSelectRow={(rowId) => {
                // Do not allow selecting frontend storno items
                const item = displayCartItems.find((i) => i.id === rowId)
                if (item?.is_frontend_storno) return
                setSelectedId(rowId)
                // Tapping a line that still owes a code reopens its prompt —
                // the cashier's natural move after dismissing it.
                if (markingMissingById[rowId]) setMarkingTargetId(rowId)
              }}
              onQtyIncrease={handleQtyIncrease}
              onQtyDecrease={handleQtyDecrease}
              onQtyDecreaseRequestSecurity={setSecurityItem}
              isLoading={isCartLoading}
              pendingQuantityUpdates={pendingQuantityUpdates}
              pendingNewItems={pendingNewItems}
              stornedIds={stornedIds}
              markingMissingById={markingMissingById}
              onMarkingClick={setMarkingTargetId}
            />
          </div>

          {/* Left Bottom Summary & Actions */}
          <div className='pos-left-bottom'>
            <ProductSummary cartItems={activeCartItems} selectedId={selectedId} totalAmount={effectiveTotalAmount} totalDiscount={totalDiscount} t={t} />

            <ActionBar
              customerId={customerId}
              onPrint={handlePrintCurrentCheck}
              onReturn={handleReturn}
              onOpenSearch={handleOpenSearch}
              onEditQuantity={handleEditQuantity}
              onCancelSale={handleCancelSale}
              onStornoProduct={handleStornoProduct}
              hasSelectedProduct={!!selectedId && !stornedIds.has(selectedId) && activeCartItems.some(i => i.id === selectedId)}
              showQuickProducts={showQuickProducts}
              onToggleQuickProducts={() => { handleCloseLiveSearch(); setShowQuickProducts(!showQuickProducts) }}
              showPaymentView={showPaymentView}
              paymentMethod={paymentMethod}
              orderPaymentType={get(cashBoxDetails, 'data.data.order_payment_type', '')}
              cashPaymentSelected={cashPaymentSelected}
              cardPaymentSelected={cardPaymentSelected}
              cardPaymentType={cardPaymentType}
              cardPaymentAmount={cardPaymentAmount}
              secondaryPaymentMethod={secondaryPaymentMethod}
              secondaryPaymentAmount={secondaryPaymentAmount}
              onSelectCashPayment={handleSelectCashPayment}
              onSelectCardPayment={handleSelectCardPayment}
              onSelectSecondaryPayment={handleSelectSecondaryPayment}
              receivedAmount={receivedAmount}
              totalAmount={effectiveTotalAmount}
              t={t}
            />

            {/* Row 2: Conditional Tezkor Panel */}
          </div>
        </main>

        {/* ── Right Section (Sidebar) ── */}
        <CheckoutSidebar
          markingBlocked={blockingMarkingItems.length > 0}
          markingBlockedCount={blockingMarkingItems.length}
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
          cardPaymentType={cardPaymentType}
          cardPaymentAmount={cardPaymentAmount}
          setCardPaymentAmount={setCardPaymentAmount}
          secondaryPaymentMethod={secondaryPaymentMethod}
          secondaryPaymentAmount={secondaryPaymentAmount}
          setSecondaryPaymentAmount={setSecondaryPaymentAmount}
          focusedPaymentInput={focusedPaymentInput}
          setFocusedPaymentInput={setFocusedPaymentInput}
          totalAmount={effectiveTotalAmount}
          handleQuickCash={handleQuickCash}
          handleCheckout={handleCheckout}
          isCheckoutLoading={isCheckoutLoading}
          cartItems={activeCartItems}
          cartOwnerType={cartOwnerType}
          setCartOwnerType={setCartOwnerType}
          t={t}
          onNumpadQtyPress={selectedId && !stornedIds.has(selectedId) && activeCartItems.some(i => i.id === selectedId) ? handleNumpadQtyPress : null}
          selectedItemIsWeight={activeCartItems.find(i => i.id === selectedId)?.unit_per_pack === 1000}
          numpadQtyBuffer={numpadQtyBuffer}
        />
      </div>

      {/* ── Client Search Modal ── */}
      {isCustomerModalOpen && (
        <div
          className='pos-modal-overlay'
          onClick={() => { setIsCustomerModalOpen(false); clearPOSActionFocus() }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className='pos-modal'
            onClick={(e) => e.stopPropagation()}
            style={{ width: '450px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: '#111217' }}>{t('menu.clients.new_client')}</h3>
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
                  // Backend returns not.found for an empty barcode or a 0% card.
                  // Card-less customers are attached at /sale/final instead
                  // (customer_id + loyalty_card_barcode in submitSale).
                  if (c.barcode && c.discount_card_percent > 0) {
                    addDiscountCard({
                      customer_id: c.id,
                      barcode: c.barcode,
                      sale_id: id,
                    })
                  }
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
        expectedPassword={securityPassword}
        onApprove={handleSecurityApproved}
        onCancel={() => { setSecurityItem(null); clearPOSActionFocus() }}
        t={t}
      />

      {/* Security Password Modal — cancel receipt */}
      <PosSecurityQrModal
        open={showCancelPasswordModal}
        expectedPassword={securityPassword}
        descKey='pos.security.desc_cancel_receipt'
        onApprove={() => { setShowCancelPasswordModal(false); handleCancelConfirm() }}
        onCancel={() => { setShowCancelPasswordModal(false); clearPOSActionFocus() }}
        t={t}
      />

      {/* Security Password Modal — remove item (storno) */}
      <PosSecurityQrModal
        open={!!stornoPendingItem}
        productName={stornoPendingItem?.name}
        expectedPassword={securityPassword}
        onApprove={() => { const item = stornoPendingItem; setStornoPendingItem(null); performStornoProduct(item) }}
        onCancel={() => { setStornoPendingItem(null); clearPOSActionFocus() }}
        t={t}
      />

      {/* ZReport Closed Confirm Modal */}
      <PosZReportClosedModal
        open={zReportClosedDialog}
        isLoading={isOpeningZReport}
        onConfirm={confirmOpenZReport}
        onCancel={cancelZReportDialog}
        t={t}
      />

      {/* Marking scan prompt */}
      <PosMarkingScanModal
        open={Boolean(markingTarget) && markingTargetMissing > 0}
        productName={get(markingTarget, 'name', '')}
        scanned={(get(markingTarget, 'markings') || []).filter(Boolean).length}
        required={markingTarget ? markingSlotCount(markingTarget) : 1}
        skipRemoves={Boolean(markingTarget) && markingIsMandatory(markingTarget)}
        onSubmit={(value) => submitMarkingForItem(markingTarget, value)}
        onSkip={handleMarkingSkip}
        onDismiss={() => setMarkingTargetId(null)}
        t={t}
      />

      {/* Edit Quantity Dialog */}
      <EditQuantityDialog
        open={showEditQtyDialog}
        item={activeCartItems.find(i => i.id === selectedId) || null}
        onConfirm={handleEditQtyConfirm}
        onClose={() => { setShowEditQtyDialog(false); clearPOSActionFocus() }}
        t={t}
      />

      {/* Hidden print container */}
      <div style={{ display: 'none' }}>
        <div ref={printContainer}>
          <RippedPaperItem
            qrcodeUrl={qrcodeUrl}
            qrcode='pending'
            markingsList={markingsList}
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
        onCancel={() => { setShowAppScanModal(false); clearPOSActionFocus() }}
        t={t}
      />

      {/* Munis QR Payment Modal */}
      <PosMunisQrModal
        open={showMunisQrModal}
        saleId={id}
        amount={Number(paymentsList.find((p) => p.app_type === 'munis')?.amount || 0)}
        onPaid={handleMunisPaid}
        onCancel={() => { setShowMunisQrModal(false); clearPOSActionFocus() }}
        t={t}
      />

      {/* Cashier Session Modal */}
      <CashierSessionModal
        open={showCashierSession}
        initialView={cashierSessionInitialView}
        onClose={() => setShowCashierSession(false)}
        onTempLogout={handleTempLogout}
        onCloseSession={handleCloseSessionShortcut}
        t={t}
      />

      {/* Fullscreen Lock Screen */}
      <POSLockScreen open={isLocked} onUnlock={() => setIsLocked(false)} t={t} />

      {/* Return Exchange Drawer */}
      <ReturnExchangeDrawer
        open={showReturnDrawer}
        setOpen={(v) => { setShowReturnDrawer(v); if (!v) clearPOSActionFocus() }}
        cashBoxDetails={cashBoxDetails}
      />

      {/* Quick Select Drawer */}
      <PosQuickSelectDrawer open={showQuickProducts} onClose={() => { setShowQuickProducts(false); clearPOSActionFocus() }} onQuickAdd={handleQuickAdd} isLoading={isCartLoading} t={t} />

      {/* Printer Settings Modal */}
      <PosPrinterSettings open={showPrinterSettings} onClose={() => { setShowPrinterSettings(false); clearPOSActionFocus() }} t={t} />

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
            <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#111217' }}>{t('pos.refresh_confirm_title')}</h3>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowHardRefreshConfirmation(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f1f3f7',
                  color: '#6f6f6f',
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
                style={{ padding: '10px 20px', background: '#e23a32', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
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
                  style={{ flex: 1, height: '48px', borderRadius: '24px', backgroundColor: '#e23a32' }}
                  onClick={() => { setShowCancelConfirmation(false); setShowCancelPasswordModal(true) }}
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
            border: '3px solid #e9ebf0',
            borderTopColor: '#111217',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{ fontWeight: '600', color: '#111217', fontSize: '15px' }}>
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
