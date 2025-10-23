import { Box, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import { useReactToPrint } from 'react-to-print'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import InputFormattedPriceWithTextField from '../../../../components/Inputs/InputFormattedPriceWithTextField'
import { RippedPaperItem } from '../../../../components/RippedPaperList'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'
import QrScanIcon from '../../../assets/icons/QrScanIcon'
import PreventRefreshDialog from './preventRefreshDialog'
import PreventRefresh from './preventRefresh'
import SaleProgressSteps from './saleStepLoading'
import ShortcutBox from '../../../../components/ShortcutBox'
function OrderLite({
  serviceType,
  cartItemsList,
  sendToEpos,
  setDmedOrganizedList,
  markingsList,
  childRef,
  setDmedPrescriptionsList,
  setCustomerId,
  setMarkingList,
  setHasChange,
  maxAmount,
  setMaxAmount,
  liteOrder,
  dmedOrganizedList,
  cashBoxDetails,
  setLiteOrder,
  customerId,
  dmedPrescriptionsList,
}) {
  const SALE_TYPE = get(cashBoxDetails, 'data.data.sale_type', 'NOTFOUND')
  const SALE_STAGE = get(cashBoxDetails, 'data.data.stage', 0)
  const { t } = useTranslation()
  const theme = useTheme()
  const { id } = useParams()
  const scannedBarcodeRef = useRef()
  const [isOpenScanDialog, setOpenScanDialog] = useState(false)
  const [isOpenRefreshDialog, setOpenRefreshDialog] = useState(false)

  const [newSaleId, setNewSaleId] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const userData = useSelector((state) => state.user)
  const { data: paymentTypesList } = useQuery('paymentTypesList', () => requests.getPaymentTypesList())
  const printContainer = useRef()
  const printContainerEmpty = useRef()
  useImperativeHandle(childRef, () => ({
    printChildCheque() {
      emptyHandlePrint()
    },
  }))
  const defultPaymentTypes = [
    {
      amount: 0,
      payment_type_id: null,
      type: 'app',
      otp_data: null,
      app_type: 'click',
    },
    {
      amount: 0,
      payment_type_id: '796ed9a7-ffc1-4ea7-8275-a455270f5741',
      type: 'cash',
      otp_data: null,
      app_type: 'naqd',
    },
    {
      amount: 0,
      payment_type_id: null,
      type: 'card',
      otp_data: null,
      app_type: 'humo',
    },
  ]
  useEffect(() => {
    if (paymentAmount <= 0) {
      setLiteOrder(false)
      return
    }
    if (liteOrder) {
      if (paymentsList.find((el) => el.type === 'app')?.amount > 0) {
        setOpenScanDialog(true)
        setLiteOrder(false)
      } else {
        onSubmit()
        setLiteOrder(false)
      }
    }
  }, [liteOrder])
  const [paymentsList, setPaymentsList] = useState(defultPaymentTypes)

  const methods = useFormContext({
    defaultValues: {
      cashbox: '',
      category_ids: [],
      lite_online_amount: 0,
      lite_card_amount: 0,
      lite_cash_amount: 0,
    },
  })

  const { setValue, getValues, errors, control, watch } = methods

  const onlinePaymentTypes = [
    {
      from: 'Click',
      to: 'Payme',
    },
  ]
  const cardPaymentTypes = [
    {
      from: 'Uzcard',
      to: 'Humo',
    },
  ]
  const [onlinePaymentType, setOnlinePaymentType] = useState(onlinePaymentTypes[0])
  const [qrcodeUrl, setQrcodeUrl] = useState({ qr: 'pending', fiscal: 'pending' })

  const [cardPaymentType, setCardPaymentType] = useState(cardPaymentTypes[0])
  const inputRefs = useRef([])
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 3) // We need 3 refs
  }, [])
  useEffect(() => {
    const updatedPaymentList = paymentsList.map((payment) =>
      payment.type === 'cash'
        ? {
            ...payment,
            name: 'Naqd',
            payment_type_id: get(paymentTypesList, 'data.data', []).find((item) => item.name === 'Naqd')?.id,
            amount: getValues('lite_cash_amount'),
          }
        : payment
    )

    setPaymentsList(updatedPaymentList)
  }, [watch('lite_cash_amount')])

  const changeCursor = (inputRef) => {
    setTimeout(() => {
      const input = inputRef
      if (input) {
        const length = input.value.length
        input.setSelectionRange(length, length) // Move cursor to end
        input.focus() // Ensure it's focused
      }
    }, 100)
  }
  useEffect(() => {
    if (cardPaymentType.from == 'Uzcard') {
      const updatedPaymentList = paymentsList.map((payment) =>
        payment.type === 'card'
          ? {
              ...payment,
              app_type: cardPaymentType.from,
              name: cardPaymentType.from,
              payment_type_id: get(paymentTypesList, 'data.data', []).find((item) => item.name === 'Uzcard')?.id,
              amount: getValues('lite_card_amount'),
            }
          : payment
      )
      setPaymentsList(updatedPaymentList)
    } else {
      const updatedPaymentList = paymentsList.map((payment) =>
        payment.type === 'card'
          ? {
              ...payment,
              app_type: cardPaymentType.from,
              name: cardPaymentType.from,
              payment_type_id: get(paymentTypesList, 'data.data', []).find((item) => item.name === 'Humo')?.id,
              amount: getValues('lite_card_amount'),
            }
          : payment
      )
      setPaymentsList(updatedPaymentList)
    }
  }, [watch('lite_card_amount')])
  useEffect(() => {
    if (onlinePaymentType.from == 'Click') {
      const updatedPaymentList = paymentsList.map((payment) =>
        payment.type === 'app'
          ? {
              ...payment,
              app_type: onlinePaymentType.from,
              name: onlinePaymentType.from,
              payment_type_id: get(paymentTypesList, 'data.data', []).find((item) => item.name === 'Click')?.id,
              amount: getValues('lite_online_amount'),
            }
          : payment
      )
      setPaymentsList(updatedPaymentList)
    } else {
      const updatedPaymentList = paymentsList.map((payment) =>
        payment.type === 'app'
          ? {
              ...payment,
              app_type: onlinePaymentType.from,
              name: onlinePaymentType.from,
              payment_type_id: get(paymentTypesList, 'data.data', []).find((item) => item.name === 'Payme')?.id,
              amount: getValues('lite_online_amount'),
            }
          : payment
      )
      setPaymentsList(updatedPaymentList)
    }
  }, [watch('lite_online_amount')])
  const shouldPaymentInputActive = () => {
    const activeInput = document.activeElement.id
    if (activeInput.includes('lite_') || activeInput.includes('quantity_') || activeInput.includes('inputQuantity') || activeInput == '') {
      return true
    } else {
      return false
    }
  }
  const setRemainPriceToPaymentValue = (name) => {
    const remainPrice = get(cartItemsList, 'total_amount') - paymentAmount

    if (remainPrice > 0) {
      setValue(name, remainPrice)
    }
  }
  useEffect(() => {
    setValue('onlinePaymentType', onlinePaymentType)
    setValue('cardPaymentType', cardPaymentType)
  }, [onlinePaymentType, cardPaymentType])

  useHotkeys(
    ['n', 'N', 'т'],
    (event) => {
      if (shouldPaymentInputActive()) {
        inputRefs.current[0].focus()
        setRemainPriceToPaymentValue('lite_cash_amount')
        changeCursor(inputRefs.current[0])
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )
  useHotkeys(
    ['p', 'P', 'з', 'З'],
    (event) => {
      if (shouldPaymentInputActive()) {
        inputRefs.current[2].focus()
        setRemainPriceToPaymentValue('lite_online_amount')

        changeCursor(inputRefs.current[2])
        setOnlinePaymentType({
          from: 'Payme',
          to: 'Click',
        })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )
  useHotkeys(
    ['c', 'C', 'С', 'с'],
    (event) => {
      if (shouldPaymentInputActive()) {
        inputRefs.current[2].focus()
        setRemainPriceToPaymentValue('lite_online_amount')

        changeCursor(inputRefs.current[2])

        setOnlinePaymentType({
          from: 'Click',
          to: 'Payme',
        })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )
  useHotkeys(
    ['u', 'U', 'Г', 'г'],
    (event) => {
      if (shouldPaymentInputActive()) {
        inputRefs.current[1].focus()
        setRemainPriceToPaymentValue('lite_card_amount')

        changeCursor(inputRefs.current[1])

        setCardPaymentType({
          from: 'Uzcard',
          to: 'Humo',
        })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )
  useHotkeys(
    ['h', 'H', 'Р', 'р'],
    (event) => {
      if (shouldPaymentInputActive()) {
        inputRefs.current[1].focus()
        setRemainPriceToPaymentValue('lite_card_amount')
        changeCursor(inputRefs.current[1])

        setCardPaymentType({
          from: 'Humo',
          to: 'Uzcard',
        })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
    }
  )
  const customStylesMini = () => {
    return {
      control: () => ({
        width: 'min-content',
        height: 40,
        display: 'flex',
        background: useTheme().palette.background.default,
        marginRight: '4px',
        borderRadius: 12,
        cursor: 'pointer',
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 16,
        width: 80,
        backgroundColor: useTheme().palette.background.default,
        border: 'none',
        boxShadow: useTheme().boxShadow['16-8'],
        overflow: 'hidden',
        zIndex: 7,
      }),
      menuList: (base) => ({
        ...base,
        maxHeight: 300,
        padding: 0,
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: useTheme().palette.gray[10],
          outline: `1px solid ${useTheme().palette.gray[200]}`,
        },
      }),
      singleValue: (provided) => ({
        ...provided,
        fontSize: 14,
        fontWeight: 600,
        lineHeight: '20px',
        fontFamily: "'Inter', sans-serif",
        color: useTheme().palette.black,
        alignItems: 'center',
        width: '80px',
      }),
      indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none',
        padding: '0 !important',
      }),
      IndicatorsContainer2: (provided) => ({
        display: 'none',
        padding: '0 !important',
      }),
      indicatorContainer: (provided) => ({
        ...provided,
        padding: '0px !important',
        backgroundColor: '#fe5000',
      }),
      option: (base) => ({
        ...base,
        display: 'inline-flex',
        alignItems: 'center',
        height: 48,
        padding: '0 16px',
        fontSize: 16,
        lineHeight: '19px',
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        color: useTheme().palette.gray[600],
        cursor: 'pointer',
        backgroundColor: useTheme().palette.gray[10],
        '&:hover': {
          backgroundColor: useTheme().palette.gray[101],
        },
      }),
    }
  }

  const AdornmentSelect = ({ name, getOptionLabel = (option) => option.name, options, defaultValue, value, disabled = false, onChange }) => {
    const { t } = useTranslation()
    return (
      <Select
        styles={customStylesMini()}
        name={name}
        classNamePrefix='react-select'
        isSearchable={false}
        noOptionsMessage={() => t('components.no_options')}
        onChange={(val) => {
          onChange(val)
        }}
        disabled={disabled}
        value={value}
        getOptionLabel={getOptionLabel}
        options={options || []}
        defaultValue={defaultValue || ''}
        id='currency'
      />
    )
  }
  const navigate = useNavigate()
  useEffect(() => {
    setPaymentsList(defultPaymentTypes)
    inputRefs.current[0].value = ''
    inputRefs.current[1].value = ''
    inputRefs.current[2].value = ''
    setValue('lite_cash_amount', '')
    setValue('lite_card_amount', '')
    setValue('lite_online_amount', '')
    setMaxAmount(0)
  }, [cartItemsList])
  useEffect(() => {
    let amount = 0
    paymentsList.map((el) => {
      if (el.amount) {
        amount += Number(el.amount)
      }
    })

    if (isNaN(amount)) {
      setMaxAmount(Number(get(cartItemsList, 'total_amount')))
      setPaymentAmount(0)
    } else {
      setMaxAmount(Number(get(cartItemsList, 'total_amount')) - amount)

      setPaymentAmount(amount)
    }
  }, [paymentsList, cartItemsList])
  //api server
  const documentName = useRef('Pharma CHEQUE')
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const reactToPrintContentEmpty = useCallback(() => printContainerEmpty.current, [])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onPrintError: (err) => {
      error('chek bilan muammo: ', err)
      setNewSaleId(false)
      setHasChange(false)
      setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })
      setPaymentsList(defultPaymentTypes)
      navigate(`/sales/create`)
    },
    onAfterPrint: () => {
      setMarkingList({})
      setNewSaleId(false)
      setHasChange(false)
      setPaymentsList(defultPaymentTypes)
      setQrcodeUrl({ qr: 'pending', fiscal: 'pending' })
      if (JSON.parse(send_to_epos)) {
        navigate(`/sales/new-sale/${newSaleId}`)
      } else {
        navigate(`/sales/create`)
      }
    },
  })
  const emptyHandlePrint = useReactToPrint({
    content: reactToPrintContentEmpty,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onPrintError: (err) => {
      error('chek bilan muammo: ', err)
    },
    onAfterPrint: () => {},
  })
  let send_to_epos = localStorage.getItem('send_to_epos')

  const {
    mutate: finishSaleWithoutAppPaymentType,
    isLoading: isFinishSaleWithoutAppPaymentType,
    isError: isSaleError,
  } = useMutation(requests.addToOrderPayment, {
    onSuccess: ({ data }) => {
      if (SALE_STAGE == 6) {
        sendEPOSresponseToBackend({ error: false, response_data: null, sale_id: id })
        return
      }
      if (!JSON.parse(send_to_epos)) {
        // disabling epos

        // navigate(`/sales/new-sale/${get(data, 'data.id', '/')}`)
        handlePrint()
        success('Продажа завершена!')
        // setMarkingList({})
        // setMarkingCount({})
      } else {
        //send to epos
        const mockData = get(cartItemsList, 'data', []).map((el) => {
          return Object.values(markingsList[el.id] || {}).map((marking, index) => ({
            barcode: el.barcode,
            amount: el.quantity > index ? (el.quantity / el.quantity) * 1000 : el.unit_amount * 1000,
            price:
              el.quantity > index ? parseFloat((el.unit_price * 100).toFixed(2)) : parseFloat((el.unit_quantity_price * el.unit_quantity * 100).toFixed(2)),
            discount:
              el.quantity > index
                ? parseFloat((get(el, 'discount_amount') * 100).toFixed(2))
                : parseFloat((el.discount_unit_amount * el.unit_quantity * 100).toFixed(2)),
            vatPercent: get(el, 'vat_percent'),
            vat:
              el.quantity > index ? parseFloat((get(el, 'vat_price') * 100).toFixed(2)) : parseFloat((el.unit_vat_price * el.unit_quantity * 100).toFixed(2)),
            label: marking,
            name: el.name,
            classCode: get(el, 'class_code'),
            packageCode: get(el, 'package_code'),
            // commissionTIN: '',
            other: 0,
            ownerType: 0,
          }))
        })

        sendToEPOS({
          token: 'DXJFX32CN1296678504F2', // Токен всегда равен DXJFX32CN1296678504F2, используется везде, Обязательное поле, String
          method: SALE_TYPE === 'SALE' ? 'fastSale' : 'refund', // Название метода, Обязательное поле, String
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
              const { qrCodeURL, qrCodeUrl, qrcodeUrl, ...rest } = info ?? {} // Exclude qrCodeURL
              return rest
            })(),
          }),
        })
      }
    },
    onError: (err) => {
      setHasChange(false)
      setOpenRefreshDialog(false)

      if (get(err, 'response.status') == 409) {
        saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id') }),
          error('Эта продажа уже закрыта. (uz: Bu sotuv yakunlangan - barcha sotuvlar sahifasidan tekshiring)')
        return
      }

      if (get(err, 'response.data.data') == 'failed payment with click') {
        error('На вашем счете Click недостаточно средств.')
        return
      }
      error('Ошибка при Продажа завершена')
      console.log('err', err)
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
        setOpenRefreshDialog(false)
        isEposError = true
        setHasChange(false)
        sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify(data), sale_id: id })
        error(`EPOS: ${get(data, 'message')}`)
      }
    },
    onError: (err) => {
      setOpenRefreshDialog(false)

      sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify({ ...err }), sale_id: id })
      setHasChange(false)

      error('Ошибка при EPOS')
      console.log('err', err)
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
    if (isOpenScanDialog) {
      setTimeout(() => {
        scannedBarcodeRef.current.focus()
      }, 100)
    }
  }, [isOpenScanDialog, scannedBarcodeRef])
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
      console.log('err', err)
    },
  })

  const onSubmit = async (data) => {
    // setHasChange(true)
    setOpenScanDialog(false)
    const paymentTypes = paymentsList
      .filter((type) => get(type, 'amount', false))
      .map(({ ...type }) => ({
        amount: get(type, 'amount'),
        payment_type_id: get(type, 'payment_type_id'),
        type: get(type, 'type'),
        ...(data ? { otp_data: data } : {}),
        ...(get(type, 'type') == 'cash' ? { return_amount: Math.abs(maxAmount) } : {}),
        app_type: get(type, 'app_type').toLowerCase(),
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
      service_type: dmedPrescriptionsList?.length > 0 ? 'dmed' : undefined,
      referral: serviceType == 'other' ? undefined : serviceType,

      store_id: get(userData, 'store.id'),
      customer_id: get(customerId, 'id'),
      total_amount: get(cartItemsList, 'total_amount'),
      tax_free: !sendToEpos,

      marking_data: markingData,
    })

    return
  }
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        '& .MuiFormControl-root': {
          borderRadius: '16px',
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '20px',
          border: '2px solid transparent',
          height: '48px !important',
        },
        '& .react-select__dropdown-indicator': {
          padding: '0px !important',
          mr: '5px',
        },
      }}
    >
      <PreventRefresh
        isDirty={isFinishSaleWithoutAppPaymentType || isSendToEPOS || isSendEPOSresponseToBackend}
        setShowModal={() => setOpenRefreshDialog(true)}
      />
      <SaleProgressSteps
        isFinishSaleWithoutAppPaymentType={isFinishSaleWithoutAppPaymentType}
        isSendToEPOS={isSendToEPOS}
        isSendEPOSresponseToBackend={isSendEPOSresponseToBackend}
        isSaleResponseError={isSaleResponseError}
        isEposError={isEposError}
        isSaleError={isSaleError}
      />
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', mr: '8px', minWidth: '168px' }}>
        <Box
          sx={{
            height: '100%',
            width: '100%',
            padding: '8px 16px',
            display: 'flex',
            mb: '4px',
            flexDirection: 'column',
            borderRadius: '16px',
            mr: '4px',
            bgcolor: 'white',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              color: 'bunker.500',
              mb: '4px',
            }}
          >
            {t('total')}:
          </Typography>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '32px',
              color: 'bunker.950',
            }}
          >
            {thousandDivider(get(cartItemsList, 'total_amount'), 'сум')}
          </Typography>
        </Box>
        <Box
          sx={{
            height: '100%',
            mt: '4px',
            width: '100%',
            padding: '8px 16px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            bgcolor: 'white',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              color: 'bunker.500',
              mb: '4px',
            }}
          >
            {maxAmount < 0 ? t('return') : t('should_pay')}:
          </Typography>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '32px',
              color: 'orange.500',
            }}
          >
            {thousandDivider(Math.abs(maxAmount), 'сум')}
          </Typography>
        </Box>
      </Box> */}
      <Box sx={{ width: '100%', minWidth: '320px' }}>
        <Box
          sx={{
            '& .MuiInputBase-root .MuiInputAdornment-root': {
              width: 'auto !important',
            },
            '& .react-select__control': {
              width: '65px',
            },
            '& input': {
              fontWeight: 500,
              color: 'bunker.950',
            },

            '& .MuiOutlinedInput-root': {
              height: '44px !important',
            },
          }}
        >
          <InputFormattedPriceWithTextField
            name='lite_cash_amount'
            id='lite_cash_amount'
            placeholder={t('Наличные')}
            control={control}
            noMarginTop
            required
            onInput={(e) => {
              const value = parseFloat(e.target.value)

              if (e.target.value === '') {
                setTimeout(() => {
                  setValue('lite_cash_amount', 0)
                }, 100)
                return
              }

              // if (value > 125) {
              //   setValue('lite_cash_amount', 125)
              //   inputRefs.current[0].value = 125
              // }
            }}
            inputRef={(el) => {
              inputRefs.current[0] = el
            }}
            inputHeight='48px'
            error={errors?.lite_cash_amount}
            fullWidth
            adornmentPosition='end'
            borderRadius='18px'
            type='number'
            adornment={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}>
                <Typography sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '600' }}>сум</Typography>
                <ShortcutBox minWidth='27px' shortcut='N' height='20px' color='#D5D7E2' />
              </Box>
            }
          />
        </Box>
        {/*  */}

        <Box
          sx={{
            '& .MuiInputBase-root .MuiInputAdornment-root': {
              width: 'auto !important',
            },
            '& .react-select__control': {
              width: '65px',
            },
            '& input': {
              fontWeight: 500,
              color: 'bunker.950',
            },
            mt: '8px',

            '& .MuiOutlinedInput-root': {
              height: '44px !important',
            },
          }}
        >
          <InputFormattedPriceWithTextField
            name='lite_cash_amount_soon'
            id='lite_cash_amount_soon'
            placeholder={t('Карта лояльности')}
            noMarginTop
            readOnly={true}
            // disabled={true}
            required
            uncontrolled
            inputHeight='48px'
            error={errors?.lite_cash_amount_soon}
            fullWidth
            onInput={() => {}}
            onKeyDown={() => {}}
            adornmentPosition='end'
            borderRadius='18px'
            type='number'
            adornment={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}>
                <Box
                  sx={{
                    bgcolor: '#0125FF',
                    padding: '0 8px',
                    height: '20px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    mr: '8px',
                  }}
                >
                  <Typography
                    sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '600', color: '#fff !important', textAlign: 'center', m: '0 !important' }}
                  >
                    soon
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '600' }}>сум</Typography>
                <ShortcutBox minWidth='27px' shortcut='L' height='20px' color='#D5D7E2' />
              </Box>
            }
          />
        </Box>
        {/*  */}

        <Box
          sx={{
            '& .MuiInputBase-root .MuiInputAdornment-root': {
              width: 'auto !important',
            },
            '& .react-select__control': {
              width: '85px',
            },
            '& input': {
              fontWeight: 500,
              color: 'bunker.950',
            },
            mt: '8px',
            '& .MuiOutlinedInput-root': {
              height: '44px !important',
            },
          }}
        >
          <InputFormattedPriceWithTextField
            name='lite_card_amount'
            id='lite_card_amount'
            noMarginTop
            placeholder={t('По карте')}
            inputRef={(el) => {
              inputRefs.current[1] = el
            }}
            onInput={(e) => {
              const value = Number(e.target.value.replace(/\s/g, ''))

              if (e.target.value === '') {
                setTimeout(() => {
                  setValue('lite_card_amount', 0)
                }, 100)
                return
              }
              if (maxAmount < value - paymentsList.find((a) => a.type == 'card')?.amount) {
                setValue('lite_card_amount', paymentsList.find((a) => a.type == 'card')?.amount)
                inputRefs.current[1].value = paymentsList.find((a) => a.type == 'card')?.amount
              }
            }}
            control={control}
            required
            inputHeight='48px'
            error={errors?.lite_card_amount}
            fullWidth
            adornmentPosition='end'
            borderRadius='18px'
            type='number'
            adornment={
              <Box
                sx={{
                  width: '100%',

                  bgcolor: '#F6F7F9',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  m: '0 2px 0',
                  width: '148px',
                  padding: '3px',
                  '& img': {
                    width: '32px',
                    height: '32px',
                  },
                }}
              >
                <Box
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    pr: '6px',
                    justifyContent: 'space-between',
                    height: '32px',
                    borderRadius: '10px',
                    bgcolor: cardPaymentType?.from == 'Uzcard' ? '#fff' : 'transparent',
                    p: '6px',
                    mr: '2px',
                  }}
                  onClick={() => {
                    setCardPaymentType({
                      to: 'Humo',
                      from: 'Uzcard',
                    })
                  }}
                >
                  <img style={{ width: '36px', height: '36px' }} src='/images/uzcard.png' />
                  <ShortcutBox minWidth='27px' shortcut='U' height='20px' color='#868FAA' />
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    p: '6px 3px',

                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '32px',
                    borderRadius: '10px',
                    bgcolor: cardPaymentType?.from == 'Humo' ? '#fff' : 'transparent',
                  }}
                  onClick={() => {
                    setCardPaymentType({
                      from: 'Humo',
                      to: 'Uzcard',
                    })
                  }}
                >
                  <img style={{ width: '32px', height: '32px' }} src='/images/humo.png' />
                  <ShortcutBox minWidth='27px' shortcut='H' height='20px' color='#868FAA' />
                </Box>
              </Box>
              // <AdornmentSelect
              //   options={[
              //     {
              //       from: cardPaymentType?.from,
              //       to: cardPaymentType?.to,
              //       name: cardPaymentType?.to,
              //     },
              //   ]}
              //   name='aca_second'
              //   value={{
              //     id: cardPaymentType?.from,
              //     name: cardPaymentType?.from,
              //   }}
              //   onChange={(val) => {
              //     setCardPaymentType({
              //       from: val?.to,
              //       to: val?.from,
              //     })
              //   }}
              // />
            }
          />
        </Box>
        <Box
          sx={{
            '& .MuiInputBase-root .MuiInputAdornment-root': {
              width: 'auto !important',
            },
            '& .react-select__control': {
              width: '85px',
            },
            '& input': {
              fontWeight: 500,
              color: 'bunker.950',
            },
            mt: '8px',
            '& .MuiOutlinedInput-root': {
              height: '44px !important',
            },
          }}
        >
          <InputFormattedPriceWithTextField
            name='lite_online_amount'
            noMarginTop
            id='lite_online_amount_id'
            placeholder={t('Онлайн оплата')}
            control={control}
            onInput={(e) => {
              const value = Number(e.target.value.replace(/\s/g, ''))

              if (e.target.value === '') {
                setTimeout(() => {
                  setValue('lite_online_amount', 0)
                }, 100)
                return
              }

              if (maxAmount < value - paymentsList.find((a) => a.type == 'app')?.amount) {
                setValue('lite_online_amount', paymentsList.find((a) => a.type == 'app')?.amount)
                inputRefs.current[2].value = paymentsList.find((a) => a.type == 'app')?.amount
              }
            }}
            inputRef={(el) => {
              inputRefs.current[2] = el
            }}
            required
            onBlur={(e) => {
              const inputValue = Number(e.target.value.replace(/\s/g, ''))
            }}
            inputHeight='48px'
            error={errors?.lite_online_amount}
            fullWidth
            max={10}
            adornmentPosition='end'
            borderRadius='18px'
            type='number'
            adornment={
              <Box
                sx={{
                  bgcolor: '#F6F7F9',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  m: '0 2px 0',

                  width: '148px',

                  padding: '3px',
                  '& img': {
                    width: '32px',
                    height: '32px',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    pr: '6px',
                    justifyContent: 'space-between',
                    height: '32px',
                    borderRadius: '10px',
                    bgcolor: onlinePaymentType?.from == 'Payme' ? '#fff' : 'transparent',
                    p: '6px',

                    mr: '2px',
                  }}
                  onClick={() => {
                    setCardPaymentType({
                      to: 'Click',
                      from: 'Payme',
                    })
                  }}
                >
                  <img style={{ width: '25px', height: '25px' }} src='/images/payme.png' />
                  <ShortcutBox minWidth='27px' shortcut='P' height='20px' color='#868FAA' />
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    p: '6px',

                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    pr: '6px',
                    justifyContent: 'space-between',
                    height: '32px',
                    borderRadius: '10px',
                    bgcolor: onlinePaymentType?.from == 'Click' ? '#fff' : 'transparent',
                  }}
                  onClick={() => {
                    setCardPaymentType({
                      from: 'Click',
                      to: 'Payme',
                    })
                  }}
                >
                  <img style={{ width: '25px', height: '25px' }} src='/images/click.png' />
                  <ShortcutBox minWidth='27px' shortcut='C' height='20px' color='#868FAA' />
                </Box>
              </Box>
              // <AdornmentSelect
              //   options={[
              //     {
              //       from: onlinePaymentType?.from,
              //       to: onlinePaymentType?.to,
              //       name: onlinePaymentType?.to,
              //     },
              //   ]}
              //   name='aca_second'
              //   value={{
              //     id: onlinePaymentType?.from,
              //     name: onlinePaymentType?.from,
              //   }}
              //   onChange={(val) => {
              //     setOnlinePaymentType({
              //       from: val?.to,
              //       to: val?.from,
              //     })
              //   }}
              // />
            }
          />
        </Box>
      </Box>
      <Box
        sx={{
          minWidth: '155px',
          width: '100%',
          maxWidth: '226px',
          padding: '12px 8px',
          bgcolor: 'white',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          m: '0 16px',
          '.box-title': {
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '20px',
            color: 'bunker.500',
          },
          '.box-sum': {
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '20px',
            color: 'bunker.950',
          },
          '.box-wrapper:last-child > .box-sum': {
            color: 'orange.500',
          },
          '.box-wrapper:not(:last-child)': {
            borderBottom: '1px solid',
            borderColor: 'bunker.100',
          },
        }}
      >
        <Box className='box-wrapper'>
          <Typography className='box-title'>Общая стоимость</Typography>
          <Typography className='box-sum'>{thousandDivider(get(cartItemsList, 'sum'), 'сум')}</Typography>
        </Box>
        <Box className='box-wrapper'>
          <Typography className='box-title'>Скидка</Typography>
          <Typography className='box-sum'>{thousandDivider(get(cartItemsList, 'discount_amount'), 'сум')}</Typography>
        </Box>
        <Box className='box-wrapper'>
          <Typography className='box-title'>Итого</Typography>
          <Typography className='box-sum'>{thousandDivider(get(cartItemsList, 'total_amount'), 'сум')}</Typography>
        </Box>
        <Box className='box-wrapper'>
          <Typography className='box-title'>Сдача</Typography>
          <Typography className='box-sum'>
            {get(cartItemsList, 'total_amount') === Math.abs(maxAmount) ? '0' : thousandDivider(Math.abs(maxAmount), 'сум')}
          </Typography>
        </Box>
      </Box>
      <Box
        maxWidth='400px'
        sx={{
          display: 'none',
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
            mode='lite'
            cashBoxDetails={cashBoxDetails}
            customerId={customerId}
            noFormControl
            printContainer={printContainer}
          />
        </Box>
      </Box>
      <Box
        maxWidth='400px'
        sx={{
          display: 'none',
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
          ref={printContainerEmpty}
        >
          <RippedPaperItem
            qrcodeUrl={'pending'}
            qrcode='pending'
            markingsList={markingsList}
            paymentsList={paymentsList}
            cartItemsList={cartItemsList}
            id='cheque_of_orders'
            mode='lite'
            cashBoxDetails={cashBoxDetails}
            customerId={customerId}
            noFormControl
            printContainer={printContainerEmpty}
          />
        </Box>
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

export default OrderLite
