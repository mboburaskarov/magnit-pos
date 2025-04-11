import { Box, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
function OrderLite({ cartItemsList, markingsList, maxAmount, setMaxAmount, liteOrder, cashBoxDetails, setLiteOrder, customerId, printContainer }) {
  const SALE_TYPE = get(cashBoxDetails, 'data.data.sale_type', 'NOTFOUND')
  const theme = useTheme()
  const { id } = useParams()
  const scannedBarcodeRef = useRef()
  const [isOpenScanDialog, setOpenScanDialog] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const userData = useSelector((state) => state.user)
  const { data: paymentTypesList } = useQuery('paymentTypesList', () => requests.getPaymentTypesList())
  useEffect(() => {
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
  const [paymentsList, setPaymentsList] = useState([
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
  ])

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
  const [qrcodeUrl, setQrcodeUrl] = useState('pending')

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
  const customStylesMini = {
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
    }),
    IndicatorsContainer2: (provided) => ({
      display: 'none',
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

  const AdornmentSelect = ({ name, getOptionLabel = (option) => option.name, options, defaultValue, value, disabled = false, onChange }) => {
    const { t } = useTranslation()
    return (
      <Select
        styles={customStylesMini}
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
  const { t } = useTranslation()
  const navigate = useNavigate()
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

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onAfterPrint: () => {
      navigate(`/sales/create`)
    },
  })

  const { mutate: finishSaleWithoutAppPaymentType } = useMutation(requests.addToOrderPayment, {
    onSuccess: ({ data }) => {
      if (false) {
        // disabling epos

        navigate(`/sales/new-sale/${get(data, 'data.id', '/')}`)
        handlePrint()
        success('Продажа завершена!')
        // setMarkingList({})
        setMarkingCount({})
      } else {
        //send to epos
        const mockData = get(cartItemsList, 'data', []).map((el) => {
          return Object.values(markingsList[el.id] || {}).map((marking, index) => ({
            barcode: el.barcode,
            amount: el.quantity > index ? (el.quantity / el.quantity) * 1000 : el.unit_amount * 1000,
            price: el.quantity > index ? el.unit_price : el.unit_quantity_price * el.unit_quantity,
            discount: el.discount_amount,
            vatPercent: get(el, 'vat_percent'),
            vat: el.quantity > index ? get(el, 'vat_price') : el.unit_vat_price * el.unit_quantity,
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
          method: SALE_TYPE === 'SALE' ? 'sale' : 'refund', // Название метода, Обязательное поле, String
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
            receivedCash: paymentsList.filter((item) => item.amount && item.type === 'cash').reduce((sum, item) => sum + (item.amount || 0), 0), // Сумма полученной наличности. Значение указывается в тийинах (100 сум = 10000 тийин)
            receivedCard: paymentsList.filter((item) => item.amount && item.type !== 'cash').reduce((sum, item) => sum + (item.amount || 0), 0), // Сумма полученной безналичности. Значение указывается в тийинах (100 сум = 10000 тийин)
          },
          ...(SALE_TYPE === 'RETURN' && {
            refundInfo: (() => {
              const info = JSON.parse(get(cashBoxDetails, 'data.data.epos_response.response', '{}'))?.info
              const { qrCodeURL, ...rest } = info // Exclude qrCodeURL
              return rest
            })(),
          }),
        })

        // setInputDiscount(NaN)
        // setPaymentsList([])

        // success('Продажа завершена!')
      }
    },
    onError: (err) => {
      if (get(err, 'response.status') == 409) {
        saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id') }), error('Эта продажа уже закрыта.')
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

  const { mutate: sendToEPOS, isLoading: isSendToEPOS } = useMutation(requests.sendToEpos, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify(data), sale_id: id })
        error(`EPOS: ${get(data, 'message')}`)
        return
      } else {
        setQrcodeUrl(get(data, 'info.qrCodeURL', 'pending'))
      }
      handlePrint()
      success('Продажа завершена!')
      sendEPOSresponseToBackend({ error: false, response_data: JSON.stringify(data), sale_id: id })
    },
    onError: (err) => {
      sendEPOSresponseToBackend({ error: true, response_data: JSON.stringify({ ...err }), sale_id: id })

      error('Ошибка при EPOS')
      console.log('err', err)
    },
  })
  useEffect(() => {
    if (isOpenScanDialog) {
      setTimeout(() => {
        scannedBarcodeRef.current.focus()
      }, 100)
    }
  }, [isOpenScanDialog, scannedBarcodeRef])
  const { mutate: sendEPOSresponseToBackend } = useMutation(requests.sendEPOSresponseToBackend, {
    onSuccess: ({ data }) => {},
    onError: (err) => {
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
    setOpenScanDialog(false)
    const paymentTypes = paymentsList
      .filter((type) => get(type, 'amount', false))
      .map(({ ...type }) => ({
        amount: get(type, 'amount'),
        payment_type_id: get(type, 'payment_type_id'),
        type: get(type, 'type'),
        ...(data ? { otp_data: data } : {}),
        app_type: get(type, 'app_type').toLowerCase(),
      }))

    const markingData = get(cartItemsList, 'data', []).map((el) => ({
      id: el.id,
      marking_list: Object.values(markingsList[el.id] || {}).filter((a) => a.length),
      marking_count: Object.values(markingsList[el.id] || {}).filter((a) => a.length)?.length,
    }))

    finishSaleWithoutAppPaymentType({
      cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'),
      payment_types: paymentTypes,
      sale_id: id,
      store_id: get(userData, 'store.id'),
      customer_id: get(customerId, 'id'),
      total_amount: get(cartItemsList, 'total_amount'),
      return_amount: Math.abs(maxAmount),
      marking_data: markingData,
    })

    return
  }
  return (
    <Box
      sx={{
        mb: '24px',
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'bg.10',
          border: '2px solid transparent',
          height: '48px !important',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '12px' }}>
        <Box
          sx={{
            width: '100%',
            padding: '8px 16px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            border: '1px solid',
            mr: '4px',
            borderColor: 'bunker.100',
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              color: 'bunker.500',
              mb: '4px',
            }}
          >
            {t('total')}:
          </Typography>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '20px',
              color: 'bunker.950',
            }}
          >
            {thousandDivider(get(cartItemsList, 'total_amount'), 'сум')}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            padding: '8px 16px',
            display: 'flex',
            ml: '4px',
            flexDirection: 'column',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'bunker.100',
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              color: 'bunker.500',
              mb: '4px',
            }}
          >
            {maxAmount < 0 ? t('return') : t('should_pay')}:
          </Typography>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '20px',
              color: 'orange.500',
            }}
          >
            {thousandDivider(Math.abs(maxAmount), 'сум')}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          '& .react-select__control': {
            width: '75px',
          },
          mt: '8px',
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
            if (e.target.value == '') {
              setTimeout(() => {
                setValue('lite_cash_amount', 0)
              }, 100)
            }
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
            <AdornmentSelect
              options={[
                {
                  from: 'UZS',
                  to: 'UZS',
                  name: 'UZS',
                },
              ]}
              name='aca_second'
              value={{
                id: 'UZS',
                name: 'UZS',
              }}
              onChange={(val) => {}}
            />
          }
        />
      </Box>
      <Box
        sx={{
          '& .react-select__control': {
            width: '95px',
          },
          mt: '8px',
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
            if (e.target.value == '') {
              setTimeout(() => {
                setValue('lite_card_amount', 0)
              }, 100)
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
            <AdornmentSelect
              options={[
                {
                  from: cardPaymentType?.from,
                  to: cardPaymentType?.to,
                  name: cardPaymentType?.to,
                },
              ]}
              name='aca_second'
              value={{
                id: cardPaymentType?.from,
                name: cardPaymentType?.from,
              }}
              onChange={(val) => {
                setCardPaymentType({
                  from: val?.to,
                  to: val?.from,
                })
              }}
            />
          }
        />
      </Box>
      <Box
        sx={{
          '& .react-select__control': {
            width: '95px',
          },
          mt: '8px',
        }}
      >
        <InputFormattedPriceWithTextField
          name='lite_online_amount'
          noMarginTop
          id='lite_online_amount_id'
          placeholder={t('Онлайн оплата')}
          control={control}
          onInput={(e) => {
            if (e.target.value == '') {
              setTimeout(() => {
                setValue('lite_online_amount', 0)
              }, 100)
            }
          }}
          inputRef={(el) => {
            inputRefs.current[2] = el
          }}
          required
          inputHeight='48px'
          error={errors?.lite_online_amount}
          fullWidth
          adornmentPosition='end'
          borderRadius='18px'
          type='number'
          adornment={
            <AdornmentSelect
              options={[
                {
                  from: onlinePaymentType?.from,
                  to: onlinePaymentType?.to,
                  name: onlinePaymentType?.to,
                },
              ]}
              name='aca_second'
              value={{
                id: onlinePaymentType?.from,
                name: onlinePaymentType?.from,
              }}
              onChange={(val) => {
                setOnlinePaymentType({
                  from: val?.to,
                  to: val?.from,
                })
              }}
            />
          }
        />
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
    </Box>
  )
}

export default OrderLite
