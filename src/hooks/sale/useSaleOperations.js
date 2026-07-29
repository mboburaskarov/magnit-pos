import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import { bypassNextAppExit } from '@hooks/useExitConfirm'
import { get } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

// Fallback class/package codes used to retry an EPOS request when one or more
// products fail with their own class_code/package_code.
const FALLBACK_EPOS_CLASS_CODE = '07616003001000002'
const FALLBACK_EPOS_PACKAGE_CODE = '1624156'

// Normalizes a product name for comparison between our cart items and the names
// EPOS echoes back inside its error message (e.g. "...: [F SHAFTOL]").
const normalizeProductName = (name) =>
  String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()

// EPOS refuses to fiscalize a sale when its own local Z-report was closed
// independently of our backend's cashbox session (e.g. closed manually on the
// terminal), reporting a message such as
// "ZReport уже был закрыт, выполните операцию открытия ZReport".
const isZReportClosedMessage = (message) => {
  if (typeof message !== 'string') return false
  const normalized = message.toLowerCase()
  return normalized.includes('zreport') && (normalized.includes('закрыт') || normalized.includes('closed'))
}

export const useSaleOperations = ({
  cartItemsList,
  markingsList,
  dmedOrganizedList,
  dmedPrescriptionsList,
  serviceType,
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
  cartOwnerType,
  cartItemsListLoading = true,
  setCardOwnerType = () => {},
}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  const sendToEpos = true
  const [payType, setPayType] = useState(undefined)
  const [hasError, setHasError] = useState(false)
  // Holds the last EPOS payload and the set of product names we have already
  // patched with the fallback class/package codes. Together they let us retry
  // failing products incrementally, without re-patching a product or looping.
  const lastEposPayloadRef = useRef(null)
  const patchedProductNamesRef = useRef(new Set())
  const [zReportClosedDialog, setZReportClosedDialog] = useState(false)

  useEffect(() => {
    if (paymentsList?.length == 1 && paymentsList?.[0]?.front_name == 'uzum') {
      setPayType(2)
      return
    } else {
      setPayType(undefined)
      return
    }
  }, [paymentsList])

  const SALE_TYPE = get(cashBoxDetails, 'data.data.sale_type', 'NOTFOUND')
  const SALE_STAGE = get(cashBoxDetails, 'data.data.stage', 0)
  const SALE_NUMBER = get(cashBoxDetails, 'data.data.sale_number', 0)

  // Finish sale without app payment
  const {
    mutate: finishSaleWithoutAppPaymentType,
    isLoading: isFinishSaleWithoutAppPaymentType,
    isError: isSaleError,
  } = useMutation(requests.addToOrderPayment, {
    onSuccess: (data) => {
      if (SALE_STAGE === 6) {
        sendEPOSresponseToBackend({ error: false, response_data: null, sale_id: id })
        return
      }
      if (!JSON.parse(sendToEpos) || get(cashBoxDetails, 'data.data.service_type') === 'uzum') {
        success('Продажа завершена!')
        setNewSaleId('888')
        setQrcodeUrl({ qr: '', fiscal: 'No', cardType: cartOwnerType })
      } else {
        sendEPOSDataRef.current(data)
      }
    },
    onError: (err) => {
      setHasError({ hasError: true, errorType: 'finalSale' })
      setOpenRefreshDialog(false)

      if (get(err, 'response.status') === 409) {
        saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), store_id: get(userData, 'store.id') })
        error('Эта продажа уже закрыта. (uz: Bu sotuv yakunlangan - barcha sotuvlar sahifasidan tekshiring)')
        return
      }
      if (get(err, 'response.data.data') === 'prescription.expired') {
        error('Срок действия указанного рецепта истёк.')
        return
      }
      if (get(err, 'response.data.data') === 'invalid.sale.amount') {
        error('Несоответствие торговой суммы')
        return
      }
      if (get(err, 'response.data.data') === 'failed payment with click') {
        error('На вашем счете Click недостаточно средств.')
        return
      }

      let errorMessage = 'Ошибка при Продажа завершена'
      try {
        const errorData = get(err, 'response.data.data')
        if (errorData) {
          const parsedError = typeof errorData === 'string' ? JSON.parse(errorData) : errorData
          errorMessage = `Ошибка при Продажа завершена: ${parsedError?.message || errorData}`
        }
      } catch (parseError) {
        console.warn('Failed to parse error response:', parseError)
        errorMessage = `Ошибка при Продажа завершена:: ${get(err, 'response.data.data') || get(err, 'data') || get(err, 'message') || 'Неизвестная ошибка'}`
      }
      error(errorMessage)
      return
    },
  })
  const { mutate: gelOldEposCheck, isLoading: isGelOldEposCheck } = useMutation(requests.gelOldEposCheck, {
    onSuccess: ({ data }) => {
      setCustomerId('')
      const qrCodeURL =
        get(data, 'data.receipt.qrCodeURL') ||
        get(data, 'data.receipt.qr_code_url') ||
        get(data, 'data.receipt.qrCodeUrl') ||
        get(data, 'info.qrCodeURL') ||
        'pending'
      const fiscalData = get(data, 'data.receipt.fiscalSign') || get(data, 'data.receipt.fiscal_sign') || get(data, 'info.fiscalSign') || 'pending'
      const terminalId = get(data, 'data.receipt.terminalId') || get(data, 'data.receipt.terminal_id') || get(data, 'info.terminalId') || 'pending'
      setQrcodeUrl({ qr: qrCodeURL, fiscal: fiscalData, terminalId: terminalId, cardType: cartOwnerType })
      sendEPOSresponseToBackend({ error: false, response_data: JSON.stringify(data), sale_id: id })
    },
    onError: (err) => {
      let message = 'Данная продажа ранее была оформлена на уплату налогов. Скачайте этот чек из раздела «Все продажи».'
      sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify(err), sale_id: id })
      setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })
      setOpenRefreshDialog(false)
      error(`Oldin eposga yuborilgan savdo: ${message}`)
      throw new Error(`InnerError: ${message}`)
    },
  })
  // Send to EPOS
  const {
    mutate: sendToEPOS,
    isLoading: isSendToEPOS,
    isError: isEposError,
  } = useMutation(requests.sendToEpos, {
    onSuccess: ({ data }) => {
      if (!get(data, 'error', true)) {
        setCustomerId('')
        const qrCodeURL = get(data, 'message.qrCodeURL') || get(data, 'message.qrCodeUrl') || get(data, 'info.qrCodeURL') || 'pending'
        const fiscalData = get(data, 'message.fiscalSign') || get(data, 'info.fiscalSign') || 'pending'
        const terminalId = get(data, 'message.terminalId') || get(data, 'info.terminalId') || 'pending'

        setQrcodeUrl({ qr: qrCodeURL, fiscal: fiscalData, terminalId: terminalId, cardType: cartOwnerType })

        sendEPOSresponseToBackend({ error: false, response_data: JSON.stringify(data), sale_id: id })
      } else {
        if (get(data, 'message')?.includes('DUPLICATE_EXTERNAL_ID')) {
          const externalId = get(data, 'message')?.split('DUPLICATE_EXTERNAL_ID')[1]
          gelOldEposCheck({
            token: 'DXJFX32CN1296678504F2',
            method: 'checkReceiptIfExists',
            external_id: externalId.trim(),
          })
          return
        }
        // EPOS's own Z-report was closed independently of our backend session.
        // Offer the cashier a one-click fix instead of a dead-end error: open
        // the Z-report, then resend the exact same sale payload.
        if (isZReportClosedMessage(get(data, 'message'))) {
          setOpenRefreshDialog(false)
          setZReportClosedDialog(true)
          return
        }
        // EPOS lists products whose own class/package (ИКПУ) codes are unknown.
        // Patch those products with the fallback codes and retry before
        // surfacing the error. Returns false once there is nothing new to fix.
        if (retryEPOSWithFallbackCodes(get(data, 'message'))) {
          return
        }
        setOpenRefreshDialog(false)
        sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify(data), sale_id: id })
        throw new Error(`InnerError: ${get(data, 'message')}`)
      }
    },
    onError: (err) => {
      setHasError({ hasError: true, errorType: 'Epos' })
      setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })
      setOpenRefreshDialog(false)
      error(err?.message || 'Ошибка при EPOS')
      if (!err.message.includes('InnerError')) {
        sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify({ ...err }), sale_id: id })
      }
    },
  })

  // EPOS reports unknown class/package (ИКПУ) codes by listing the offending
  // product names in brackets, e.g. "...не найдены...: [F SHAFTOL]". We patch
  // ONLY those products with the fallback codes and resend the whole sale.
  //
  // Returns true only when it actually starts a retry. It refuses to retry
  // (returns false, so the caller surfaces the error) unless the message names
  // at least one real product in this sale that we have not patched yet. That
  // keeps the retry strictly incremental — the patched set only grows and is
  // bounded by the number of products — so it can neither loop forever nor fire
  // a duplicate request for a failure we already attempted to fix.
  function retryEPOSWithFallbackCodes(message) {
    const payload = lastEposPayloadRef.current
    if (!payload || typeof message !== 'string') {
      return false
    }

    // Product names listed inside the first [...] block of the EPOS message.
    const bracketContent = message.match(/\[([^\]]*)\]/)?.[1]
    if (!bracketContent) {
      return false
    }
    const items = payload.params?.items || []
    const patched = patchedProductNamesRef.current

    // Each comma-separated entry inside the brackets is a product EPOS could not
    // match. EPOS sometimes appends an extra number after the name (e.g. a line
    // index/quantity), which must NOT be mistaken for a digit that is genuinely
    // part of the product name (e.g. "...ASSORTI 4"). So instead of stripping a
    // trailing number and matching exactly, we resolve every entry against the
    // real item names in this payload: an item matches an entry when the entry
    // equals its name, or begins with its name followed by a space (the
    // appended-number case). When several names qualify, the longest wins, so
    // "MILK 2L" is preferred over "MILK".
    const reportedEntries = bracketContent
      .split(',')
      .map((entry) => normalizeProductName(entry))
      .filter(Boolean)

    const itemNamesByLength = items
      .map((item) => normalizeProductName(item.name))
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)

    const matchedNames = new Set()
    reportedEntries.forEach((entry) => {
      const match = itemNamesByLength.find((name) => entry === name || entry.startsWith(`${name} `))
      if (match) {
        matchedNames.add(match)
      }
    })

    // Keep only matched products we have not patched yet. If none remain,
    // retrying cannot help → surface the error.
    const newFailingNames = [...matchedNames].filter((name) => !patched.has(name))
    if (newFailingNames.length === 0) {
      return false
    }
    newFailingNames.forEach((name) => patched.add(name))

    const retryPayload = {
      ...payload,
      params: {
        ...payload.params,
        items: items.map((item) =>
          patched.has(normalizeProductName(item.name))
            ? { ...item, classCode: FALLBACK_EPOS_CLASS_CODE, packageCode: FALLBACK_EPOS_PACKAGE_CODE }
            : item,
        ),
      },
    }
    lastEposPayloadRef.current = retryPayload
    sendToEPOS(retryPayload)
    return true
  }

  // Send EPOS response to backend
  const {
    mutate: sendEPOSresponseToBackend,
    isLoading: isSendEPOSresponseToBackend,
    isError: isSaleResponseError,
  } = useMutation(requests.sendEPOSresponseToBackend, {
    onSuccess: ({ data }) => {
      setOpenRefreshDialog(false)
      setNewSaleId(get(data, 'data.id', false))
      setDmedPrescriptionsList([])
      setDmedOrganizedList([])
      setCardOwnerType('personal')
    },
    onError: ({ response }) => {
      setHasError({ hasError: true, errorType: 'Epos result' })

      setOpenRefreshDialog(false)
      error(`Ошибка результата: ${get(response, 'data.data')}`)
    },
  })

  // Opens EPOS's Z-report (same call the shift-open screen makes) so a sale
  // blocked by a closed Z-report can go through without the cashier having to
  // leave the sale screen.
  const { mutate: openZReportMutation, isLoading: isOpeningZReport } = useMutation(requests.openZReport, {
    onSuccess: ({ data }) => {
      const zOk = get(data, 'error', true) == false || get(data, 'message', '').includes('ERROR_ZREPORT_IS_ALREADY_OPEN')
      setZReportClosedDialog(false)
      if (!zOk) {
        error(get(data, 'message') || 'ZReportni ochib bo‘lmadi')
        return
      }
      if (lastEposPayloadRef.current) {
        sendToEPOS(lastEposPayloadRef.current)
      }
    },
    onError: (err) => {
      setZReportClosedDialog(false)
      error(err?.message || 'ZReportni ochib bo‘lmadi')
    },
  })

  const confirmOpenZReport = useCallback(() => {
    openZReportMutation({ token: 'DXJFX32CN1296678504F2', method: 'openZreport' })
  }, [openZReportMutation])

  const cancelZReportDialog = useCallback(() => {
    setZReportClosedDialog(false)
    error('ZReport yopiq. Sotuvni yakunlash uchun uni oching.')
    sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify({ message: 'ZReport is closed' }), sale_id: id })
  }, [sendEPOSresponseToBackend, id])

  // Create sale
  const { mutate: saleCreate } = useMutation(requests.saleCreate, {
    onSuccess: ({ data }) => {
      navigate(`/sales/new-sale/${get(data, 'data.id')}`)
      bypassNextAppExit()
      window.location.reload()
    },
    onError: () => {
      error('Ошибка при создании продажи')
    },
  })

  function testEPOSDataSums(items, expectedTotal) {
    let sum = 0
    let allVatCorrect = true

    items.forEach((item) => {
      const itemTotal = item.price + item.other
      const itemTotalForVat = item.price
      sum += itemTotal

      const calculatedVat = +((itemTotalForVat * item.vatPercent) / (100 + item.vatPercent))
      if (Math.abs(calculatedVat - item.vat) > 0.5) {
        allVatCorrect = false
        return []
      }
    })

    if (sum != expectedTotal) {
      console.log('❌ Total sum mismatch:', sum, 'expected:', expectedTotal, 'wrong items:', items)
      return []
    }

    if (!allVatCorrect) {
      console.log('❌ Some VAT values are incorrect', items)
      return []
    }
    return items
  }

  const getReadyDataForOFD = (data) => {
    const readyData = []
    let leftLoayCardSum = paymentsList?.find((el) => el.front_name == 'loyalty_card')?.amount
    const cartItemsArray = Array.isArray(get(cartItemsList, 'data')) ? get(cartItemsList, 'data') : get(cartItemsList, 'data.data.data', [])
    console.log(cartItemsArray, paymentsList)
    cartItemsArray.map((el) => {
      if (!el?.is_marking) {
        let leftPrice = el.total_price
        const price = el.total_price
        let otherSum = 0
        if (leftLoayCardSum > 0) {
          if (el.total_price >= leftLoayCardSum) {
            leftPrice = el.total_price - leftLoayCardSum
            otherSum = leftLoayCardSum
            leftLoayCardSum = 0
          } else {
            otherSum = el.total_price
            leftLoayCardSum = leftLoayCardSum - el.total_price
            leftPrice = 0
          }
        }
        const other = (otherSum * 100).toFixed(2)
        const discount = get(el, 'discount_amount') * el.quantity + el.discount_unit_amount * el.unit_quantity
        const discountSum = parseFloat((discount * 100).toFixed(2))

        readyData.push({
          barcode: data.find((final) => final.cart_item_id === el.id)?.barcode || el.barcode,

          amount: (el.quantity + el.unit_amount) * 1000,
          price: parseFloat((price * 100).toFixed(2)),
          discount: discountSum,
          vatPercent: get(el, 'vat_percent'),
          vat: parseFloat(((((price - discount - otherSum) * get(el, 'vat_percent')) / (get(el, 'vat_percent') + 100)) * 100).toFixed(2)),

          label: '',
          name: el.name,
          classCode: data.find((final) => final.cart_item_id === el.id)?.classCode || el.class_code,
          packageCode: data.find((final) => final.cart_item_id === el.id)?.packageCode || el.package_code,
          other: parseFloat(other),
          ownerType: 0,
        })
      } else if (Object.keys(markingsList[el.id] || {}).length === 0) {
        // marking items without markingsList data — treat as regular item
        const price = el.total_price
        const discount = get(el, 'discount_amount') * el.quantity + el.discount_unit_amount * el.unit_quantity
        const discountSum = parseFloat((discount * 100).toFixed(2))
        let otherSum = 0
        if (leftLoayCardSum > 0) {
          if (price >= leftLoayCardSum) {
            otherSum = leftLoayCardSum
            leftLoayCardSum = 0
          } else {
            otherSum = price
            leftLoayCardSum = leftLoayCardSum - price
          }
        }
        const other = parseFloat((otherSum * 100).toFixed(2))
        readyData.push({
          barcode: data.find((final) => final.cart_item_id === el.id)?.barcode || el.barcode,
          amount: (el.quantity + el.unit_amount) * 1000,
          price: parseFloat((price * 100).toFixed(2)),
          discount: discountSum,
          vatPercent: get(el, 'vat_percent'),
          vat: parseFloat(((((price - discount - otherSum) * get(el, 'vat_percent')) / (get(el, 'vat_percent') + 100)) * 100).toFixed(2)),
          label: '',
          name: el.name,
          classCode: data.find((final) => final.cart_item_id === el.id)?.classCode || el.class_code,
          packageCode: data.find((final) => final.cart_item_id === el.id)?.packageCode || el.package_code,
          other,
          ownerType: 0,
        })
      } else {
        Object.values(markingsList[el.id] || {}).map((marking, index) => {
          const price = el.quantity > index ? el.unit_price : el.unit_quantity_price * el.unit_quantity
          let otherSum = 0

          if (leftLoayCardSum > 0) {
            if (price >= leftLoayCardSum) {
              otherSum = leftLoayCardSum
              leftLoayCardSum = 0
            } else {
              otherSum = price
              leftLoayCardSum = leftLoayCardSum - price
            }
          }
          const other = (otherSum * 100).toFixed(2)
          const discount = el.quantity > index ? get(el, 'discount_amount') * (el.quantity / el.quantity) : el.discount_unit_amount * el.unit_quantity
          const discountSum = parseFloat((discount * 100).toFixed(2))

          readyData.push({
            barcode: data.find((final) => final.cart_item_id === el.id)?.barcode || el.barcode,
            amount: el.quantity > index ? (el.quantity / el.quantity) * 1000 : el.unit_amount * 1000,
            price: parseFloat((price * 100).toFixed(2)),

            discount: discountSum,
            vatPercent: get(el, 'vat_percent'),
            vat: parseFloat(((((price - discount - otherSum) * get(el, 'vat_percent')) / (get(el, 'vat_percent') + 100)) * 100).toFixed(2)),
            label: marking,
            name: el.name,
            classCode: data.find((final) => final.cart_item_id === el.id)?.classCode || el.class_code,
            packageCode: data.find((final) => final.cart_item_id === el.id)?.packageCode || el.package_code,
            other: parseFloat(other),
            ownerType: 0,
          })
        })
      }
    })
    return readyData
    return testEPOSDataSums(readyData, get(cartItemsList, 'total_amount') * 100)
  }

  const prepareEPOSData = useCallback(
    (data) => {
      const mockData = getReadyDataForOFD(data)

      return mockData.flat()
    },
    [cartItemsList, paymentsList, markingsList],
  )

  const sendEPOSData = useCallback(
    (data) => {
      const items = prepareEPOSData(get(data, 'data.data.items', '[]'))
      const qrToken = JSON.parse(data?.config?.data)?.payment_types[0]?.otp_data || undefined

      const payload = {
        qrToken: qrToken,
        token: 'DXJFX32CN1296678504F2',
        method: payType == 2 ? 'saleEPS' : SALE_TYPE === 'SALE' ? 'fastSale' : 'refund',
        payType: payType,
        companyName: '"MUXAYYO   TRADE" MCHJ',
        companyAddress: get(userData, 'store.address') || 'Tashkent, Uqchi Street, 4',
        companyINN: '305445201',
        staffName: get(userData, 'full_name'),
        printerSize: 80,
        phoneNumber: get(userData, 'store.phone'),
        companyPhoneNumber: '+998712916999',
        is_corporate: cartOwnerType === 'corporative',
        params: {
          ...(SALE_TYPE === 'SALE' ? { externalId: `${SALE_NUMBER}` } : {}),
          clientName: get(customerId, 'name'),
          items,
          is_corporate: cartOwnerType === 'corporative',

          receivedCash: parseFloat(
            (
              Number(
                paymentsList.filter((item) => item.amount && item.type === 'cash').reduce((sum, item) => sum + (item.amount || 0), 0) - Math.abs(maxAmount),
              ) * 100
            ).toFixed(2),
          ),
          receivedEps:
            payType == 2
              ? parseFloat(
                  (paymentsList.filter((item) => item.amount && item.type !== 'cash').reduce((sum, item) => sum + (item.amount || 0), 0) * 100).toFixed(2),
                )
              : 0,
          receivedCard:
            payType == 2
              ? 0
              : parseFloat(
                  (
                    paymentsList
                      .filter((item) => item.amount && item.type !== 'cash' && item.type !== 'loyalty_card')
                      .reduce((sum, item) => sum + (item.amount || 0), 0) * 100
                  ).toFixed(2),
                ),
        },
        ...(SALE_TYPE === 'RETURN' && {
          refundInfo: (() => {
            const info = JSON.parse(get(cashBoxDetails, 'data.data.epos_response.response', '{}'))?.message
            const { qrCodeURL, qrCodeUrl, qrcodeUrl, card, cash, service, amount, chequeNumber, ...rest } = info ?? {}
            return rest
          })(),
        }),
      }

      // Fresh submission: clear previously patched products and remember the
      // payload so EPOS class/package (ИКПУ) failures can be retried per product.
      patchedProductNamesRef.current = new Set()
      lastEposPayloadRef.current = payload
      sendToEPOS(payload)
    },
    [prepareEPOSData, paymentsList, maxAmount, sendToEPOS, SALE_TYPE, userData, customerId, cartItemsList, cashBoxDetails, cartOwnerType],
  )

  const sendEPOSDataRef = useRef(sendEPOSData)
  useEffect(() => {
    sendEPOSDataRef.current = sendEPOSData
  })

  const submitSale = useCallback(
    (paymentsList, otpData, maxAmount, cartOwnerType) => {
      if (cartItemsListLoading) {
        error('Продукты загружаются. Пожалуйста, повторите попытку позже.')
        return
      }
      // Handle both formats: lite order (with payment_type_id) and full order (with id)
      const paymentTypes = paymentsList
        ?.filter((type) => get(type, 'amount', false) && !get(type, 'isPlaceholder', false))
        .map((type) => {
          // Remove id if it exists (for full order format)
          const { id: paymentId, ...rest } = type

          return {
            amount: get(rest, 'amount'),
            payment_type_id: get(rest, 'payment_type_id') || paymentId, // Support both formats
            type: get(rest, 'type'),
            ...(otpData ? { otp_data: otpData } : {}),
            ...(get(rest, 'type') === 'cash' ? { return_amount: Math.abs(maxAmount) } : {}),
            app_type: (get(rest, 'app_type') || get(rest, 'name'))?.toLowerCase(),
          }
        })

      const cartItemsForMarking = Array.isArray(get(cartItemsList, 'data')) ? get(cartItemsList, 'data') : get(cartItemsList, 'data.data.data', [])
      const markingData = cartItemsForMarking.map((el) => ({
        id: el.id,
        dmed_id: dmedOrganizedList.find((dmed) => dmed.id === el.id)?.dmedId,
        marking_list: Object.values(markingsList[el.id] || {}).filter((a) => a.length),
        marking_count: Object.values(markingsList[el.id] || {}).filter((a) => a.length)?.length,
      }))

      finishSaleWithoutAppPaymentType({
        cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'),
        payment_types: paymentTypes,
        sale_id: id,
        service_type: dmedPrescriptionsList?.length > 0 ? 'dmed' : undefined,
        referral: serviceType === 'other' ? undefined : serviceType,
        store_id: get(userData, 'store.id'),
        customer_id: get(customerId, 'id'),
        // Discount-card customers are already attached via /sale/discount-card;
        // only card-less customers are attached here for loyalty/cashback.
        loyalty_card_barcode:
          customerId?.barcode && customerId?.discount_card_percent > 0 ? undefined : customerId?.loyalty_card_barcode,
        total_amount: get(cartItemsList, 'total_amount') ?? get(cartItemsList, 'data.data.total_amount'),
        tax_free: !sendToEpos,
        is_corporate: cartOwnerType == 'corporative',
        marking_data: markingData,
      })
    },
    [
      cartItemsList,
      markingsList,
      dmedOrganizedList,
      dmedPrescriptionsList,
      serviceType,
      cashBoxDetails,
      userData,
      customerId,
      id,
      sendToEpos,
      finishSaleWithoutAppPaymentType,
    ],
  )

  return {
    finishSaleWithoutAppPaymentType,
    isFinishSaleWithoutAppPaymentType,
    isSaleError,
    sendToEPOS,
    isSendToEPOS,
    isEposError,
    sendEPOSresponseToBackend,
    isSendEPOSresponseToBackend,
    isSaleResponseError,
    submitSale,
    setHasError,
    isGelOldEposCheck,
    hasError,
    zReportClosedDialog,
    confirmOpenZReport,
    cancelZReportDialog,
    isOpeningZReport,
  }
}
