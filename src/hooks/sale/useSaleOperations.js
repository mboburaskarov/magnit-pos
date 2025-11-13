import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import { get } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

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
}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  const sendToEpos = JSON.parse(localStorage.getItem('send_to_epos'))

  const [payType, setPayType] = useState(undefined)

  useEffect(() => {
    if (paymentsList?.length == 1 && paymentsList?.[0]?.type == 'uzum') {
      setPayType(2)
      return
    } else {
      setPayType(undefined)
      return
    }
  }, [paymentsList])

  const SALE_TYPE = get(cashBoxDetails, 'data.data.sale_type', 'NOTFOUND')
  const SALE_STAGE = get(cashBoxDetails, 'data.data.stage', 0)

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
      if (!JSON.parse(sendToEpos)) {
        success('Продажа завершена!')
        setNewSaleId('888', false)
        setQrcodeUrl({ qr: 'pharma-cosmos.uz', fiscal: 'No' })
      } else {
        sendEPOSData(data)
      }
    },
    onError: (err) => {
      setOpenRefreshDialog(false)

      if (get(err, 'response.status') === 409) {
        saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id') })
        error('Эта продажа уже закрыта. (uz: Bu sotuv yakunlangan - barcha sotuvlar sahifasidan tekshiring)')
        return
      }

      if (get(err, 'response.data.data') === 'failed payment with click') {
        error('На вашем счете Click недостаточно средств.')
        return
      }
      error('Ошибка при Продажа завершена')
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

        setQrcodeUrl({ qr: qrCodeURL, fiscal: fiscalData })
        sendEPOSresponseToBackend({ error: false, response_data: JSON.stringify(data), sale_id: id })
      } else {
        setOpenRefreshDialog(false)
        sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify(data), sale_id: id })
        throw new Error(`custome_error: ${get(data, 'message')}`)
      }
    },
    onError: (err) => {
      setOpenRefreshDialog(false)
      error(err?.message || 'Ошибка при EPOS')
      if (!err.message.includes('custome_error')) {
        sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify({ ...err }), sale_id: id })
      }
    },
  })

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
    },
    onError: () => {
      setOpenRefreshDialog(false)
      error('Ошибка при епосе')
    },
  })

  // Create sale
  const { mutate: saleCreate } = useMutation(requests.saleCreate, {
    onSuccess: ({ data }) => {
      navigate(`/sales/new-sale-v2/${get(data, 'data.id')}`)
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
      sum += itemTotal

      const calculatedVat = +((itemTotal * item.vatPercent) / (100 + item.vatPercent))
      if (Math.abs(calculatedVat - item.vat) > 0.5) {
        console.log(`VAT mismatch for ${item.name}: expected ${item.vat}, calculated ${calculatedVat}`)
        allVatCorrect = false
        return []
      }
    })

    if (sum != expectedTotal) {
      console.log('❌ Total sum mismatch:', sum, 'expected:', expectedTotal, 'wrong items:', items)
      return []
    }

    if (!allVatCorrect) {
      console.log('❌ Some VAT values are incorrect')
      return []
    }
    return items
  }

  const getReadyDataForOFD = () => {
    const readyData = []
    let leftLoayCardSum = paymentsList?.find((el) => el.front_name == 'loyalty_card')?.amount

    get(cartItemsList, 'data', []).map((el) => {
      if (el?.is_marking == false) {
        let leftPrice = el.total_price
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
        readyData.push({
          barcode: el.barcode,
          amount: (el.quantity + el.unit_amount) * 1000,
          price: parseFloat((leftPrice * 100).toFixed(2)),
          discount: parseFloat((get(el, 'discount_amount') * 100).toFixed(2)) + parseFloat((el.discount_unit_amount * el.unit_quantity * 100).toFixed(2)),
          vatPercent: get(el, 'vat_percent'),
          vat: parseFloat((get(el, 'vat') * 100).toFixed(2)),
          label: '',
          name: el.name,
          classCode: get(el, 'class_code'),
          packageCode: get(el, 'package_code'),
          other: parseFloat((otherSum * 100).toFixed(2)),
          ownerType: 0,
        })
      } else {
        Object.values(markingsList[el.id] || {}).map((marking, index) => {
          let price = el.quantity > index ? el.unit_price : el.unit_quantity_price * el.unit_quantity
          let vat = el.quantity > index ? get(el, 'vat_price') : el.unit_vat_price * el.unit_quantity

          let leftPrice = price
          let otherSum = 0

          if (leftLoayCardSum > 0) {
            if (price >= leftLoayCardSum) {
              leftPrice = price - leftLoayCardSum
              otherSum = leftLoayCardSum
              leftLoayCardSum = 0
            } else {
              otherSum = price
              leftLoayCardSum = leftLoayCardSum - price
              leftPrice = 0
            }
          }
          let other = (otherSum * 100).toFixed(2)
          readyData.push({
            barcode: el.barcode,
            amount: el.quantity > index ? (el.quantity / el.quantity) * 1000 : el.unit_amount * 1000,
            price: parseFloat((leftPrice * 100).toFixed(2)),

            discount:
              el.quantity > index
                ? parseFloat((get(el, 'discount_amount') * 100).toFixed(2))
                : parseFloat((el.discount_unit_amount * el.unit_quantity * 100).toFixed(2)),
            vatPercent: get(el, 'vat_percent'),
            vat: parseFloat((vat * 100).toFixed(2)),
            label: marking,
            name: el.name,
            classCode: get(el, 'class_code'),
            packageCode: get(el, 'package_code'),
            other: parseFloat(other),
            ownerType: 0,
          })
        })
      }
    })
    return testEPOSDataSums(readyData, get(cartItemsList, 'total_amount') * 100)
  }
  // get(cartItemsList, 'data', []).map((el) => {
  //       return Object.values(markingsList[el.id] || {}).map((marking, index) => ({
  //         barcode: el.barcode,
  //         amount: el.quantity > index ? (el.quantity / el.quantity) * 1000 : el.unit_amount * 1000,
  //         price: el.quantity > index ? parseFloat((el.unit_price * 100).toFixed(2)) : parseFloat((el.unit_quantity_price * el.unit_quantity * 100).toFixed(2)),
  //         discount:
  //           el.quantity > index
  //             ? parseFloat((get(el, 'discount_amount') * 100).toFixed(2))
  //             : parseFloat((el.discount_unit_amount * el.unit_quantity * 100).toFixed(2)),
  //         vatPercent: get(el, 'vat_percent'),
  //         vat: el.quantity > index ? parseFloat((get(el, 'vat_price') * 100).toFixed(2)) : parseFloat((el.unit_vat_price * el.unit_quantity * 100).toFixed(2)),
  //         label: marking,
  //         name: el.name,
  //         classCode: get(el, 'class_code'),
  //         packageCode: get(el, 'package_code'),
  //         other: 0,
  //         ownerType: 0,
  //       }))
  // Prepare EPOS data
  const prepareEPOSData = useCallback(() => {
    const mockData = getReadyDataForOFD()

    return mockData.flat()
  }, [cartItemsList, markingsList])

  const sendEPOSData = useCallback(
    (data) => {
      const items = prepareEPOSData()
      const qrToken = JSON.parse(data?.config?.data)?.payment_types[0]?.otp_data || undefined

      sendToEPOS({
        qrToken: qrToken,
        token: 'DXJFX32CN1296678504F2',
        method: payType == 2 ? 'saleEPS' : SALE_TYPE === 'SALE' ? 'fastSale' : 'refund',
        payType: payType,
        companyName: 'Pharma Cosmos OOO',
        companyAddress: get(userData, 'store.address'),
        companyINN: '303970073',
        staffName: get(userData, 'full_name'),
        printerSize: 58,
        phoneNumber: get(userData, 'store.phone'),
        companyPhoneNumber: '+998772770333',
        params: {
          clientName: get(customerId, 'name'),
          items,

          receivedCash: parseFloat(
            (
              Number(
                paymentsList.filter((item) => item.amount && item.type === 'cash').reduce((sum, item) => sum + (item.amount || 0), 0) - Math.abs(maxAmount)
              ) * 100
            ).toFixed(2)
          ),
          receivedEps:
            payType == 2
              ? parseFloat(
                  (paymentsList.filter((item) => item.amount && item.type !== 'cash').reduce((sum, item) => sum + (item.amount || 0), 0) * 100).toFixed(2)
                )
              : 0,
          receivedCard:
            payType == 2
              ? 0
              : parseFloat(
                  (paymentsList.filter((item) => item.amount && item.type !== 'cash').reduce((sum, item) => sum + (item.amount || 0), 0) * 100).toFixed(2)
                ),
        },
        ...(SALE_TYPE === 'RETURN' && {
          refundInfo: (() => {
            const info = JSON.parse(get(cashBoxDetails, 'data.data.epos_response.response', '{}'))?.message
            const { qrCodeURL, qrCodeUrl, qrcodeUrl, ...rest } = info ?? {}
            return rest
          })(),
        }),
      })
    },
    [prepareEPOSData, paymentsList, maxAmount, sendToEPOS, SALE_TYPE, userData, customerId, cartItemsList, cashBoxDetails]
  )

  const submitSale = useCallback(
    (paymentsList, otpData, maxAmount) => {
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

      const markingData = get(cartItemsList, 'data', []).map((el) => ({
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
        loyalty_card_barcode: customerId?.barcode, // Add loyalty card support
        total_amount: get(cartItemsList, 'total_amount'),
        tax_free: !sendToEpos,
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
    ]
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
  }
}
