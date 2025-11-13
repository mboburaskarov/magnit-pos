import { LoadingButton } from '@mui/lab'
import { Box, Drawer, Grid, Button as MuiButton, Typography, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, isNaN, size } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'

import { paymeGoId } from '../../../constants/paymeGoId'
import { default as CloseIcon, default as RemovePaymentIcon } from '../../../src/assets/icons/CloseIcon'
import QrScanIcon from '../../../src/assets/icons/QrScanIcon'
import PreventRefresh from '../../../src/pages/sales/new-order/preventRefresh'
import PreventRefreshDialog from '../../../src/pages/sales/new-order/preventRefreshDialog'
import SaleProgressSteps from '../../../src/pages/sales/new-order/saleStepLoading'
import { requests } from '../../../utils/requests'
import thousandDivider from '../../../utils/thousandDivider'
import { error, success } from '../../../utils/toast'
import StyledDialog from '../../Dialogs/StyledeEmptyDialog'
import TextField from '../../Inputs/TextField'
import { RippedPaperItem } from '../../RippedPaperList'
import PaymentMethodInput from './PaymentMethodInput'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: 'calc(100% - 64px)',
      padding: 64,
      borderRadius: '64px 0 0 64px',
      backgroundColor: theme.palette.background.default,
    },
  },
  half: {
    '& .MuiDrawer-paper': {
      width: '768px',
      padding: 64,
      borderRadius: '64px 0 0 64px',
      backgroundColor: theme.palette.background.default,
    },
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    height: '-webkit-fill-available',
  },
  body: {
    flex: '1 0 50%',
  },
  backBtn: {
    borderRadius: 32,
  },
  priceTitle: {
    fontSize: 24,
    lineHeight: '29px',
    fontWeight: 600,
    color: theme.palette.gray[400],
  },
  price: {
    fontSize: 36,
    lineHeight: '42px',
    fontFamily: theme.fontFamily.gilroyBold,
    color: theme.palette.black,
  },
  paidPriceTitle: {
    fontSize: 24,
    lineHeight: '29px',
    fontWeight: 600,
    color: theme.palette.gray[400],
  },
  paid: {
    color: theme.palette.green[400],
  },
  cashIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: theme.palette.background.default,
  },
  disabledCashIcon: {
    '& path': { fill: theme.palette.gray[400] },
  },
  clientBalance: {
    display: 'flex',
    flexDirection: 'column',
  },
  balanceAmount: {
    color: theme.palette.blue[500],
  },
  paymentName: {
    flex: '1 0 50%',
    color: theme.palette.gray[600],
    textAlign: 'left',
    '& div': {
      display: 'inline-flex',
    },
  },
  disabledPaymentName: {
    color: theme.palette.gray[400],
  },
  paymentBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    padding: 4,
    paddingRight: 12,
    backgroundColor: theme.palette.gray[100],
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: theme.palette.gray[101],
    },
    '& svg': {
      fill: theme.palette.blue[500],
    },
  },
  disabledPaymentBtn: {
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.gray[300]}`,
  },
  placeholder: {
    height: 110,
    border: `1px dashed ${theme.palette.gray[200]}`,
    borderRadius: 16,
    flex: '0 0 32.3%',
    marginRight: 8,
    marginBottom: 16,
    display: 'block',
  },
  box: {
    flex: '0 0 32.3%',
    borderRadius: 16,
    marginBottom: 16,
    border: `2px solid ${theme.palette.gray[300]}`,
    overflow: 'hidden',
  },
  outline: {
    transition: 'all 0.4s ease',
    border: `2px solid ${theme.palette.orange[500]}`,
  },
  boxHeader: {
    backgroundColor: theme.palette.gray[100],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    padding: '8px 5px 8px 12px',
    borderBottom: `1px solid ${theme.palette.gray[300]}`,
    '& .MuiButtonBase-root': {
      padding: 0,
      width: '32px !important',
      height: '32px !important',
      '&:hover': {
        backgroundColor: theme.palette.red[10],
        '& .icon-wrapper': {
          backgroundColor: theme.palette.red[10],
          '& svg path': {
            fill: theme.palette.red[700],
          },
        },
      },
      '& .icon-wrapper': {
        height: '32px !important',
        width: '32px !important',
        minWidth: '32px !important',
      },
    },
  },

  input: {
    height: 56,
    cursor: 'pointer',

    backgroundColor: theme.palette.background.default,
    '& input': {
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: theme.palette.background.default,
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '500',
      color: theme.palette.bunker[950],
    },
    '& input::-webkit-inner-spin-button, input::-webkit-outer-spin-button': {
      appearance: 'none',
      margin: 0,
    },
    '& .MuiInputBase-root::before, & .MuiInputBase-root::after': {
      display: 'none !important',
    },
    '& .MuiInputBase-root.Mui-focused': {
      border: 'none !important',
      backgroundColor: theme.palette.background.default,
    },
    '& .MuiInputBase-root': {
      border: 'none !important',
      backgroundColor: theme.palette.background.default,
    },
  },
  boxBody: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    padding: '12px',
    '& > .MuiFormControl-root': {
      height: 34,
    },
  },
  change: {
    color: theme.palette.red[500],
  },
  checkboxContainer: {
    width: 56,
    height: 56,
    backgroundColor: theme.palette.gray[100],
    borderRadius: 16,
    marginRight: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: '.1s ease-in',
    '&:hover': {
      backgroundColor: theme.palette.gray[200],
    },
  },
  checkbox: {
    width: 56,
    height: 56,
  },
}))

const MAX_F_BUTTONS_QUANTITY = 10

export default function OrderDrawer({
  setIsOrderDrower,
  serviceType,

  isOrderDrower,
  sendToEpos,
  dmedOrganizedList,
  setDmedOrganizedList,
  markingsList,
  dmedPrescriptionsList,
  printContainer,
  cartItemsList,
  setDmedPrescriptionsList,
  customerId,
  cashBoxDetails,
  setMarkingList,
  setMarkingCount,
  setCustomerId,
  markingCount,
  half,

  setOpenDebt,
}) {
  const methods = useForm()
  const lastEposRequest = useRef()

  const SALE_TYPE = get(cashBoxDetails, 'data.data.sale_type', 'NOTFOUND')
  const SALE_STAGE = get(cashBoxDetails, 'data.data.stage', 0)
  const addEmptyStringMarkToMarkinglessProduct = (markings, shouldHaveMarkings) => {
    let newMarkingList = { ...markings }
    for (const key in shouldHaveMarkings) {
      const count = shouldHaveMarkings[key]
      const existingValues = markings[key] || {}
      const mergedValues = {}
      for (let i = 0; i < count; i++) {
        mergedValues[i] = existingValues[i] || ''
      }
      newMarkingList[key] = mergedValues
    }

    setMarkingList(newMarkingList)
  }
  const classes = useStyles()
  const [payments, setPayments] = useState([])
  const [payType, setPayType] = useState(undefined)

  const [paymentsList, setPaymentsList] = useState([])

  const loyalPrice = paymentsList?.find((el) => el.front_name == 'loyalty_card')?.amount

  // Result: 4
  useEffect(() => {
    if (paymentsList?.length == 1 && paymentsList?.[0]?.front_name == 'uzum') {
      setPayType(2)
      return
    } else {
      setPayType(undefined)
      return
    }
  }, [paymentsList])
  const [maxAmount, setMaxAmount] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [newSaleId, setNewSaleId] = useState(false)

  const [hasChange, setHasChange] = useState(false)
  const [qrcodeUrl, setQrcodeUrl] = useState({ qr: 'pending', fiscal: 'pending' })
  const [isOpenScanDialog, setOpenScanDialog] = useState(false)
  const [isOpenRefreshDialog, setOpenRefreshDialog] = useState(false)
  const [payme, setPayme] = useState(false)
  const { id } = useParams()
  const theme = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const lastPaymentInput = useRef()
  const scannedBarcodeRef = useRef()

  let send_to_epos = localStorage.getItem('send_to_epos')

  useEffect(() => {
    addEmptyStringMarkToMarkinglessProduct(markingsList, markingCount)
  }, [markingCount])
  useEffect(() => {
    let amount = 0
    paymentsList.map((el) => {
      amount += Number(el.amount || 0)
    })

    if (isNaN(amount)) {
      setMaxAmount(Number(get(cartItemsList, 'total_amount')))
      setPaymentAmount(0)
    } else {
      setMaxAmount(Number(get(cartItemsList, 'total_amount')) - amount)

      setPaymentAmount(amount)
    }
  }, [paymentsList, cartItemsList])

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
    onError: (err) => {
      setOpenRefreshDialog(false)

      error('Ошибка при епосе')
    },
  })
  const { mutate: saleCreate } = useMutation(requests.saleCreate, {
    onSuccess: ({ data }) => {
      navigate(`/sales/new-sale/${get(data, 'data.id')}`)
      window.location.reload()
    },
    onError: (err) => {
      error('Ошибка при создании продажи')
      console.error('err', err)
    },
  })

  const { data: paymentTypesList } = useQuery('paymentTypesList', () => requests.getPaymentTypesList())
  const sendToEPOSPayload = (payload) => {
    lastEposRequest.current = payload
    sendToEPOS(payload)
  }

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
  const {
    mutate: finishSaleWithoutAppPaymentType,
    isLoading: isFinishSaleWithoutAppPaymentType,
    isError: isSaleError,
  } = useMutation(requests.addToOrderPayment, {
    onSuccess: ({ data, ...other }) => {
      const qrToken = JSON.parse(other?.config?.data)?.payment_types[0]?.otp_data || undefined
      if (SALE_STAGE == 6) {
        sendEPOSresponseToBackend({ error: false, response_data: null, sale_id: id })
        return
      }
      if (!JSON.parse(send_to_epos)) {
        // disabling epos
        // navigate(`/sales/new-sale/${get(data, 'data.id', '/')}`)
        // setIsOrderDrower(false)
        // setQrcodeUrl({ qr: false, fiscal: false })
        // setMarkingList({})
        // setMarkingCount({})
        success('Продажа завершена!')
        handlePrint()
      } else {
        //send to epos
        const mockData = getReadyDataForOFD()

        sendToEPOSPayload({
          qrToken: qrToken,
          token: 'DXJFX32CN1296678504F2', // Токен всегда равен DXJFX32CN1296678504F2, используется везде, Обязательное поле, String
          method: payType == 2 ? 'saleEPS' : SALE_TYPE === 'SALE' ? 'fastSale' : 'refund', // Название метода, Обязательное поле, String
          payType: payType,
          companyName: 'Pharma Cosmos OOO', // Поле для ввода названия компании, будет напечатано на чеке, Обязательное поле, String
          companyAddress: get(userData, 'store.address'), // Поле для ввода адреса компании, убедитесь в верности, будет напечатано на чеке, Обязательное поле, String
          companyINN: '303970073', // Поле для ввода ИНН компании, будет напечатано на чеке, Обязательное поле, String
          staffName: get(userData, 'full_name'), // Поле для ввода имени кассира , Необязательное поле, String
          printerSize: 58, // Ширина ленты в чековом принтере, будет учитываться при формировании pdf чека, Integer
          phoneNumber: get(userData, 'store.phone'), // Поле для ввода контакного номера, будет напечатано на чеке, Необязательное поле, String
          companyPhoneNumber: '+998772770333', // Поле для ввода номера компании, будет напечатано на чеке, Необязательное поле, String
          params: {
            // Объект с данными о чеке
            clientName: get(customerId, 'name'), //ФИО Клиента

            items: mockData.flat(),
            receivedCash: parseFloat(
              (
                (paymentsList.filter((item) => item.amount && item.type === 'cash').reduce((sum, item) => sum + (item.amount || 0), 0) - Math.abs(maxAmount)) *
                100
              ).toFixed(2)
            ), // Сумма полученной наличности. Значение указывается в тийинах (100 сум = 10000 тийин)
            receivedCard: parseFloat(
              (paymentsList.filter((item) => item.amount && item.type !== 'cash').reduce((sum, item) => sum + (item.amount || 0), 0) * 100).toFixed(2)
            ), // Сумма полученной безналичности. Значение указывается в тийинах (100 сум = 10000 тийин)
          },

          ...(SALE_TYPE === 'RETURN' && {
            refundInfo: (() => {
              const info = JSON.parse(get(cashBoxDetails, 'data.data.epos_response.response', '{}'))?.message
              const { qrCodeURL, qrcodeUrl, qrCodeUrl, card, cash, service, amount, chequeNumber, ...rest } = info ?? {} // Exclude qrCodeURL
              return rest
            })(),
          }),
        })

        // setInputDiscount(NaN)

        // success('Продажа завершена!')
      }
    },
    onError: (err) => {
      setHasChange(false)
      setOpenRefreshDialog(false)
      if (get(err, 'response.data.data.available_quantity', false)) {
        error(`Описание
  Редактировать
  Введенное количество товара превышает существующее количество. 
  Максимальное количество на складе - ${get(err, 'response.data.data.available_quantity')}`)
        return
      }
      if (get(err, 'response.status') == 409) {
        saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id') }), error('Эта продажа уже закрыта.')
        return
      }

      if (get(err, 'response.data.data') == 'failed payment with click') {
        error('На вашем счете Click недостаточно средств.')
        return
      }
      error('Ошибка при Продажа завершена')
      console.error('err', err)
    },
  })
  const { mutate: setCashNumber } = useMutation(requests.sendToEpos, {
    onSuccess: ({ data }) => {
      sendToEPOS(lastEposRequest.current)
      lastEposRequest.current = null
    },

    onError: (err) => {
      sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify({ ...err }), sale_id: id })
      setHasChange(false)
      setOpenRefreshDialog(false)

      error('Ошибка при EPOS')
    },
  })
  const {
    mutate: sendToEPOS,
    isLoading: isSendToEPOS,
    isError: isEposError,
  } = useMutation(requests.sendToEpos, {
    onSuccess: ({ data }) => {
      if (!get(data, 'error', true)) {
        setCustomerId('')
        let qrCodeURL = get(data, 'message.qrCodeURL') || get(data, 'message.qrCodeUrl') || get(data, 'info.qrCodeURL') || 'pending'
        let fiscalData = get(data, 'message.fiscalSign') || get(data, 'info.fiscalSign') || 'pending'

        setQrcodeUrl({ qr: qrCodeURL, fiscal: fiscalData })
        sendEPOSresponseToBackend({ error: false, response_data: JSON.stringify(data), sale_id: id })

        return
      } else {
        if (get(data, 'message', '').includes('common.sender.balance.not.enough')) {
          error('На вашем счете недостаточно средств.')
          return
        }
        // error(`EPOS: ${get(data, 'message')}`)
        setOpenRefreshDialog(false)
        setHasChange(false)

        sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify(data), sale_id: id })
        throw new Error(`custome_error: ${get(data, 'message')}`)
      }
    },
    onError: (err) => {
      if (get(err, 'message', 'err').includes('CASH_REGISTERER_NUMBER_NOT_AVAILABLE') && localStorage.getItem('mode') == 'dev-mode') {
        setCashNumber({
          token: 'DXJFX32CN1296678504F2',
          method: 'setCashNumber',
        })
        return
      }
      if (!err.message.includes('custome_error')) {
        sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify({ ...err }), sale_id: id })
      }
      setHasChange(false)
      setOpenRefreshDialog(false)

      error(err?.message || 'Ошибка при EPOS')
      console.error('err', err)
    },
  })

  useEffect(() => {
    if (newSaleId) {
      if (qrcodeUrl.qr != 'pending') {
        handlePrint()
        success('Продажа завершена!')
      }
    }
  }, [newSaleId])
  useEffect(() => {
    setPaymentsList([])
  }, [isOrderDrower])
  const handleAddPaymentType = (type) => {
    if (!type) return

    if (!isVisiblePaymentType(type)) return

    const isThereType = paymentsList.some((item) => item.id == type.id)

    setPaymentsList((prev) => {
      if (get(cartItemsList, 'total_amount') - paymentAmount > customerId?.balance && type?.type == 'loyalty_card') {
        return [...prev, { ...type, amount: customerId?.balance }]
      } else if (prev?.length < size(get(paymentTypesList, 'data.data', [])) && !isThereType) {
        return [...prev, { ...type, amount: get(cartItemsList, 'total_amount') - paymentAmount }]
      } else {
        return prev
      }
    })
  }
  useEffect(() => {
    if (!paymentTypesList || !lastPaymentInput?.current) return
    // if (hasChange) return setHasChange(false)

    lastPaymentInput.current.focus()
  }, [paymentsList])
  useEffect(() => {
    if (isOpenScanDialog) {
      setTimeout(() => {
        scannedBarcodeRef.current.focus()
      }, 100)
    }
  }, [isOpenScanDialog, scannedBarcodeRef])
  const removePaymentType = (id) => {
    const removedItem = paymentsList.filter((el) => el.id != id)

    setPaymentsList(removedItem)
  }
  const removeLastPaymentType = () => {
    paymentsList.pop()
    setPaymentsList([...paymentsList])
  }

  const isVisiblePaymentType = useCallback(
    (type) => {
      const totalEnteredMoney = paymentsList.reduce((sum, item) => sum + item.amount || 0, 0)
      const isThereType = type === 'overAll' ? false : paymentsList.some((item) => item.id == type.id)

      if ((totalEnteredMoney >= 1 && type?.front_name == 'uzum') || paymentsList.some((item) => item.front_name == 'uzum')) return false

      if ((customerId?.balance <= 1 && type?.front_name == 'loyalty_card') || (!customerId?.name && type?.front_name == 'loyalty_card')) return false

      const totalAmount = get(cartItemsList, 'total_amount')

      if (type?.type == 'app' && totalAmount - totalEnteredMoney > 0 && paymentsList.length !== 0) {
        return !paymentsList.find((item) => item.type === 'app')
      }
      if (paymentsList.length == 0) return true

      if (totalEnteredMoney >= totalAmount || isThereType) return false

      return true
    },
    [paymentsList]
  )

  const documentName = useRef('Pharma CHEQUE')
  const userData = useSelector((state) => state.user)
  const reactToPrintContent = useCallback(() => printContainer.current, [])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onPrintError: (err) => {
      error('chek bilan muammo: ', err)
      setNewSaleId(false)
      setHasChange(false)
      setIsOrderDrower(false)

      setPaymentsList([])
      setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })

      navigate(`/sales/create`)
    },
    onAfterPrint: () => {
      setNewSaleId(false)
      setHasChange(false)
      setIsOrderDrower(false)

      setPaymentsList([])
      setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })
      setMarkingList({})
      if (JSON.parse(send_to_epos)) {
        navigate(`/sales/new-sale/${newSaleId}`)
      } else {
        navigate(`/sales/create`)
      }
    },
  })

  const onSubmit = async (data) => {
    setHasChange(true)

    setOpenScanDialog(false)
    const paymentTypes = mpaddedPaymentsList
      .filter((type) => get(type, 'isPlaceholder', false) == false)
      .map(({ id, ...type }) => ({
        ...(get(type, 'type') === 'cash' ? { return_amount: Math.abs(maxAmount) } : {}),
        amount: get(type, 'amount'),
        payment_type_id: id,
        type: get(type, 'type'),
        ...(data ? { otp_data: data } : {}),
        app_type: get(type, 'name').toLowerCase(),
      }))

    const markingData = get(cartItemsList, 'data', []).map((el) => ({
      id: el.id,
      dmed_id: dmedOrganizedList.find((dmed) => dmed.id == el.id)?.dmedId,
      marking_list: Object.values(markingsList[el.id] || {}).filter((a) => a.length),
      marking_count: Object.values(markingsList[el.id] || {}).filter((a) => a.length)?.length,
    }))

    finishSaleWithoutAppPaymentType({
      cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'),
      payment_types: paymentTypes,
      sale_id: id,
      loyalty_card_barcode: customerId?.loyalty_card_barcode,
      store_id: get(userData, 'store.id'),
      service_type: dmedPrescriptionsList?.length > 0 ? 'dmed' : undefined,
      referral: serviceType == 'other' ? undefined : serviceType,
      customer_id: get(customerId, 'id'),
      total_amount: get(cartItemsList, 'total_amount'),
      marking_data: markingData,
      tax_free: !sendToEpos,
    })

    return
  }
  const mpaddedPaymentsList = [
    ...paymentsList,
    ...Array.from({ length: 8 - paymentsList.length }, (_, index) => ({ id: `placeholder-${index}`, isPlaceholder: true })),
  ]
  const findTypeWithName = (name) => {
    const list = get(paymentTypesList, 'data.data')

    return list.find((el) => el?.name?.toLowerCase() == name)
  }
  let timeoutRef = null
  const handleFinish = () => {
    if (paymentsList.find((el) => el.type === 'app')) {
      setOpenScanDialog(true)
    } else {
      onSubmit()
    }
  }
  const paymentHotKeys = {
    naqd: 'F1',
    humo: 'F2',
    uzcard: 'F3',
    visa: 'F4',
    click: 'F5',
    uzum: 'F6',
    payme: 'F7',
    pay: 'F12',
  }

  const getPaymentTypeHotKeyLabel = (name) => paymentHotKeys[name?.toLowerCase().trim()] || 'no'

  const handleFKeys = (event) => {
    event.preventDefault()
    const key = event.key
    if (key === 'F12' && !(maxAmount > 0)) {
      event.preventDefault()
      handleFinish()
      return
    }

    const paymentType = Object.keys(paymentHotKeys).find((type) => paymentHotKeys[type] === key)

    if (paymentType) {
      handleAddPaymentType(findTypeWithName(paymentType))
    }
  }

  useHotkeys(
    Object.values(paymentHotKeys),
    (event) => {
      event.preventDefault()
      handleFKeys(event)
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )

  return (
    <Box hidden>
      <PreventRefresh
        isDirty={isFinishSaleWithoutAppPaymentType || isSendToEPOS || isSendEPOSresponseToBackend}
        setShowModal={() => setOpenRefreshDialog(true)}
      />
      <Box width='calc(100% + 32px)' mx={-2} mt={-4}>
        <Drawer
          open={isOrderDrower}
          onClose={() => setIsOrderDrower(false)}
          onKeyDown={(e) => {
            if (e.code === 'KeyL') {
            }
            if (
              payments?.find((payment) => payment?.shortcut === e.code && !payment?.disabled && payment?.id === 'debt' && maxKeys <= MAX_F_BUTTONS_QUANTITY)
            ) {
              setOpenDebt(true)
            }
            if (
              payments?.find(
                (payment) => payment?.shortcut === e.code && !payment?.disabled && payment?.payment_type?.id === paymeGoId && maxKeys <= MAX_F_BUTTONS_QUANTITY
              )
            ) {
              if (!orderPayments?.length) setPayme(true)
              return
            }
            if (
              payments?.find((payment) => payment?.shortcut === e.code && !payment?.disabled && payment?.id !== 'debt' && maxKeys <= MAX_F_BUTTONS_QUANTITY)
            ) {
              const payment = payments?.find((payment) => payment?.shortcut === e.code)
              isReturnDrawer ? addOrderPaymentReturn(payment) : addOrderPayment(payment)
            }
          }}
          anchor='right'
          elevation={1}
          className={`${classes.drawer} ${half ? classes.half : ''}`}
        >
          <FormProvider {...methods}>
            {/* {hasChange && <LoadingBlock position={'absolute'} bgColor={'#ffffff99'} width={'100%'} left='0' />} */}
            <Box className={classes.wrapper}>
              <Box width='calc(75% - 64px)' padding={'0 40px 0 0'}>
                <Box mb={'40px'} display='flex' width={'100%'} justifyContent={'space-between'}>
                  <Box
                    width={'100%'}
                    borderRadius={'16px'}
                    boxShadow='0px 2px 8px 0px #0000000A'
                    border={'1px solid'}
                    padding={'24px'}
                    borderColor={'bunker.100'}
                    mr={'24px'}
                  >
                    <Typography fontSize={24} fontWeight={'700'} lineHeight={'32px'} color={'bunker.500'}>
                      {t('total')}:
                    </Typography>
                    <Typography fontSize={32} fontWeight={'800'} lineHeight={'48px'} color={'bunker.950'}>
                      {thousandDivider(get(cartItemsList, 'total_amount'), 'сум')}
                    </Typography>
                  </Box>
                  <Box
                    borderRadius={'16px'}
                    boxShadow='0px 2px 8px 0px #0000000A'
                    border={'1px solid'}
                    padding={'24px'}
                    borderColor={'bunker.100'}
                    width={'100%'}
                  >
                    <Typography fontSize={24} fontWeight={'700'} lineHeight={'32px'} color={'bunker.500'}>
                      {maxAmount < 0 ? t('return') : t('should_pay')}
                    </Typography>
                    <Typography fontSize={32} fontWeight={'800'} lineHeight={'48px'} color={maxAmount === 0 ? 'green.700' : 'red.700'}>
                      {thousandDivider(Math.abs(maxAmount.toFixed(2)), 'сум')}
                    </Typography>
                  </Box>
                </Box>
                {SALE_STAGE != 8 && (
                  <>
                    <Box>
                      <Typography fontSize={16} fontWeight={'600'} lineHeight={'24px'} color={'bunker.700'}>
                        To'lov turi:
                      </Typography>
                      <Grid container display={'flex'}>
                        {get(paymentTypesList, 'data.data', [])
                          .filter((pay) => {
                            if (get(cashBoxDetails, 'data.data.sale_type') == 'RETURN') {
                              return pay?.type == 'cash'
                            }
                            return pay
                          })
                          .map((item) => (
                            <Grid key={item.id} item xs={3} sm={3} lg={3} xl={3} p={'8px'} m={'3'} onClick={() => handleAddPaymentType(item)}>
                              <Box
                                display={'flex'}
                                p={'20px'}
                                sx={{
                                  '& p': {
                                    color: isVisiblePaymentType(item) ? 'bunker.600' : 'bunker.400',
                                  },
                                }}
                                height={'80px'}
                                bgcolor={'bg.10'}
                                justifyContent={'space-between'}
                                borderRadius={'24px'}
                              >
                                <Box>
                                  <Typography fontSize={18} fontWeight={'600'} lineHeight={get(item, 'front_name', false) == 'loyalty_card' ? '20px' : '40px'}>
                                    {get(item, 'name')}
                                  </Typography>
                                  {get(item, 'front_name', false) == 'loyalty_card' && (
                                    <Typography sx={{ fontSize: '17px', color: 'bunker.500', fontWeight: '500' }}>
                                      {thousandDivider(customerId?.balance, 'сум')}
                                    </Typography>
                                  )}
                                </Box>
                                <Typography alignItems={'center'} justifyContent={'center'} display={'flex'}>
                                  <Box
                                    sx={{
                                      color: '#bdbdbd',
                                      border: '2px solid #cfcfcf',
                                      height: '34px',
                                      display: 'flex',
                                      padding: '2px',
                                      ml: '5px',
                                      minWidth: '34px',
                                      alignItems: 'center',
                                      borderRadius: '8px',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    {getPaymentTypeHotKeyLabel(get(item, 'name'))}
                                  </Box>
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                      </Grid>
                    </Box>
                    <Box>
                      <Grid container width={'100%'} display={'flex'}>
                        {mpaddedPaymentsList?.map((el, index) => (
                          <Grid item sm={3} lg={3} xl={3} xs={3} m={'3'} key={el.id}>
                            {el?.name ? (
                              <Box mr={'16px'} mb={'16px'} id={`payment-box${el.id}`} className={classes.box}>
                                <div className={classes.boxHeader}>
                                  <Typography lineHeight={'24px'} fontSize={'16px'} fontWeight={'600'} color={'bunker.950'} id='payment-type'>
                                    {el.name}
                                  </Typography>
                                  <Box display='flex' alignItems='center'>
                                    <MuiButton
                                      variant='primary'
                                      onClick={() => removePaymentType(el.id)}
                                      sx={() => ({
                                        paddingRight: 0,
                                        paddingLeft: 1,
                                      })}
                                    >
                                      <RemovePaymentIcon color={theme.palette.black} />
                                    </MuiButton>
                                  </Box>
                                </div>
                                <div className={classes.boxBody}>
                                  <PaymentMethodInput
                                    id={el.id}
                                    index={el.id}
                                    customerId={customerId}
                                    classes={classes}
                                    isLast={mpaddedPaymentsList.filter((el) => el.name)?.length - 1 == index}
                                    lastPaymentInput={(el) => (lastPaymentInput.current = el)}
                                    item={el}
                                    isReturnDrawer={true}
                                    removePaymentType={removePaymentType}
                                    cashbackPaymentPercentage={1}
                                    paymentsList={paymentsList}
                                    setPaymentsList={(el) => {
                                      setPaymentsList(el)
                                    }}
                                    totalPrice={1}
                                    clientInfo={'clientInfo'}
                                    max={maxAmount}
                                    totalAmount={get(cartItemsList, 'total_amount')}
                                    paymentAmount={paymentAmount}
                                    disabled={false}
                                    webkassaOn={true}
                                  />
                                </div>
                              </Box>
                            ) : (
                              <Box mr={'16px'} mb={'16px'} id={`payment-box${el.id}`} className={classes.placeholder}></Box>
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </>
                )}
              </Box>
              <Box
                maxWidth='400px'
                sx={{
                  display: 'flex',
                  width: '355px',
                  overflowY: 'scroll',
                  maxHeight: '75vh',
                }}
              >
                <Box
                  mx={-2}
                  mt={'-3px'}
                  style={{
                    padding: '20px',
                  }}
                  ref={printContainer}
                >
                  <RippedPaperItem
                    qrcodeUrl={qrcodeUrl}
                    qrcode='pending'
                    markingsList={markingsList}
                    paymentsList={paymentsList}
                    cartItemsList={cartItemsList}
                    id='cheque_of_orders'
                    cashBoxDetails={cashBoxDetails}
                    customerId={customerId}
                    noFormControl
                    printContainer={printContainer}
                  />
                </Box>
              </Box>
            </Box>

            <LoadingButton
              sx={{ minHeight: '48px !important ', display: 'flex' }}
              variant='contained'
              loading={isSendToEPOS || isSendEPOSresponseToBackend || isFinishSaleWithoutAppPaymentType}
              disabled={maxAmount > 0 && SALE_STAGE != 8}
              onClick={() => handleFinish()}
            >
              {t('menu.orders.new_order.cart_container.pay')}
              <Box
                sx={{
                  color: '#fff',
                  border: '2px solid #fff',
                  height: '34px',
                  display: 'flex',
                  padding: '2px',
                  ml: '15px',
                  minWidth: '34px',
                  fontSize: '12px',
                  alignItems: 'center',
                  borderRadius: '8px',
                  justifyContent: 'center',
                }}
              >
                F12
              </Box>
            </LoadingButton>
          </FormProvider>
          <SaleProgressSteps
            isFinishSaleWithoutAppPaymentType={isFinishSaleWithoutAppPaymentType}
            isSendToEPOS={isSendToEPOS}
            isSendEPOSresponseToBackend={isSendEPOSresponseToBackend}
            isSaleResponseError={isSaleResponseError}
            isEposError={isEposError}
            isSaleError={isSaleError}
          />
        </Drawer>
      </Box>
      <StyledDialog
        backbtn={false}
        onClose={() => {
          setOpenScanDialog(false)
        }}
        customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpenScanDialog(false)} />}
        buttonLabel={'ff'}
        title={
          <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'bunker.500'}>
            {t('scanner')}
          </Typography>
        }
        open={isOpenScanDialog}
      >
        <Box sx={{ padding: '40px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <QrScanIcon width='64' />
          <Typography mb={'16px'} justifyContent={'center'} textAlign={'center'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'bunker.950'}>
            {t('new_order.app.pass_scan')}
          </Typography>
          <TextField
            required
            inputRef={(el) => (scannedBarcodeRef.current = el)}
            fullWidth
            borderRadius={'40px'}
            setValue={() => {}}
            uncontrolled
            name='barcode-click'
            onKeyDown={(e) => {
              if (e.code == 'Enter') {
                onSubmit(e.target.value)
                scannedBarcodeRef.current.value = ''
              }
            }}
            // label={'t('create_new_product.product_name')'}
            placeholder={t('scanned_code.placeholder')}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', mt: '10px' }}>
            <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'bunker.500'}>
              {t('payment_type')}:
            </Typography>
            <Typography ml={'5px'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'purple.500'}>
              {paymentsList.find((el) => el.type === 'app')?.name}
            </Typography>
          </Box>
        </Box>
      </StyledDialog>

      <PreventRefreshDialog isOpenRefreshDialog={isOpenRefreshDialog} setOpenRefreshDialog={setOpenRefreshDialog} />
    </Box>
  )
}
