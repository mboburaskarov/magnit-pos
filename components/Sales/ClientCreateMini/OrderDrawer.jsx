import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { getGiftCardTitle } from '../../../utils/getGiftCardTitle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Drawer, Button, Typography, Button as MuiButton, Checkbox, useTheme, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import BackArrowIcon from '../../../src/assets/icons/ArrowRightIcon'
import CashIcon from '../../../src/assets/icons/InComeCashIcon'
import PlusIcon from '../../../src/assets/icons/PlusIcon'
import UserFilledIcon from '../../../src/assets/icons/ArrowRightIcon'
import PencilIcon from '../../../src/assets/icons/PauseIcon'
import addToOrderPayment from './PaymentMethodInput'
import removeFromOrderPayment from './PaymentMethodInput'
import balanceAmountSelector from './PaymentMethodInput'
import cartTotalPriceWithoutDiscountSelector from './PaymentMethodInput'
import { numberToPrice } from '../../../utils/numberToPrice'
import { v4 as uuidv4 } from 'uuid'
import { RippedPaperItem } from '../../RippedPaperList'
import ShortcutWrapper from '../../ShortcutWrapper'
import PaymentMethodInput from './PaymentMethodInput'
// import DebtDrawer from './DebtDrawer'
import GiftCardIcon from '../../../src/assets/icons/ArrowRightIcon'
import GiftCardDrawer from '../../../src/assets/icons/ArrowRightIcon'
import GiftCardInfo from '../../../src/assets/icons/ArrowRightIcon'
import RemovePaymentIcon from '../../../src/assets/icons/CloseIcon'
import CertificateCardDrawer from '../../../src/assets/icons/BigWarningIcon'
import { giftCardPaymentIds } from '../../../constants/giftCardPaymentIds'
import ButtonWithSwitch from './ButtonWithSwitch'
import PaymeGo from '../../../src/assets/icons/BigWarningCircleIcon'
import { paymeGoId } from '../../../constants/paymeGoId'
import PaymeSmallIcon from '../../../src/assets/icons/ArrowRightIcon'
import AddPaumentTypeIcon from '../../../src/assets/icons/AddPaymentTypeIcon'
import { FormProvider, useForm } from 'react-hook-form'
import { requests } from '../../../utils/requests'
import { get, size } from 'lodash'
import { LoadingButton } from '@mui/lab'
import { useReactToPrint } from 'react-to-print'
import { error, success } from '../../../utils/toast'

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
    // marginRight: 8,
    marginBottom: 16,
    border: `2px solid ${theme.palette.gray[300]}`,
    overflow: 'hidden',
  },
  outline: {
    transition: 'all 0.4s ease',
    border: `2px solid ${theme.palette.orange[500]}`,

    // boxShadow: `0 0 0 3px ${theme.palette.orange[500]}`,
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
          // borderRadius: 0,
        },
      },
      '& .icon-wrapper': {
        height: '32px !important',
        width: '32px !important',
        minWidth: '32px !important',
        // borderRadius: 0,
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
    // height: ,
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

const intitalDebtInfo = {
  id: '',
  active: false,
  amount: '',
  date: '',
  comment: '',
}

const MAX_F_BUTTONS_QUANTITY = 10

export default function OrderDrawer({
  setIsOrderDrower,
  isOrderDrower,
  closeDrawer,
  printContainer,
  // handlePrint,
  cartItemsList,
  customerId,
  cashBoxDetails,
  // onSubmit,
  refetchcartItemsList,
  noCheck,
  half,

  setOpenDebt,
}) {
  const methods = useForm()
  console.log(cartItemsList)

  const classes = useStyles()
  const [payments, setPayments] = useState([])
  const [paymentsList, setPaymentsList] = useState([])
  const [maxAmount, setMaxAmount] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [payme, setPayme] = useState(false)
  const { id } = useParams()
  const theme = useTheme()
  const { t } = useTranslation()
  console.log(maxAmount)

  const { data: paymentTypesList, refetch: refetchPaymentTypesList } = useQuery('paymentTypesList', () => requests.getPaymentTypesList())
  const { mutate: addToOrderPayment, isLoading: isaddToOrderPayment } = useMutation(requests.addToOrderPayment, {
    onSuccess: () => {
      // setShowOverlay(false)
      refetchcartItemsList()
      setIsOrderDrower(false)
      handlePrint()

      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара! #3')
      console.log('err', err)
    },
  })
  const handleAddPaymentType = (type) => {
    if (!isVisiblePaymentType(type)) return

    const isThereType = paymentsList.some((item) => item.id == type.id)

    setPaymentsList((prev) => {
      if (prev?.length < size(get(paymentTypesList, 'data.data', [])) && !isThereType) {
        return [...prev, { ...type, amount: get(cartItemsList, 'total_amount') - paymentAmount }]
      } else {
        return prev
      }
    })
  }
  const removePaymentType = (id) => {
    const removedItem = paymentsList.filter((el) => el.id != id)
    console.log(removedItem, id, paymentsList)

    setPaymentsList(removedItem)
  }

  const isVisiblePaymentType = useCallback(
    (type) => {
      if (paymentsList.length == 0) return true

      const totalEnteredMoney = paymentsList.reduce((sum, item) => sum + item.amount, 0)
      const totalAmount = get(cartItemsList, 'total_amount')
      const isThereType = type === 'overAll' ? false : paymentsList.some((item) => item.id == type.id)

      if (totalEnteredMoney >= totalAmount || isThereType) return false

      return true
    },
    [paymentsList]
  )
  useEffect(() => {
    let amount = 0
    paymentsList.map((el) => {
      amount += Number(el.amount)
    })

    setMaxAmount(Number(get(cartItemsList, 'total_amount')) - amount)
    setPaymentAmount(amount)
  }, [paymentsList, cartItemsList])
  const documentName = useRef('BILLZ CHEQUE')

  const reactToPrintContent = useCallback(() => printContainer.current, [])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent, // This should be a function
    documentTitle: documentName.current,
    removeAfterPrint: true,
  })
  const onSubmit = (data) => {
    const payment_types = paymentsList.map((el) => ({ amount: el.amount, payment_type_id: el.id }))
    const requestBody = {
      cash_box_id: get(cashBoxDetails, 'data.data.cash_box_id'),
      payment_types,
      sale_id: id,
      // discount_amount: 0,
      total_amount: get(cartItemsList, 'total_amount'),
    }

    addToOrderPayment(requestBody)
    // setOpen(false)

    // const requestBody = {
    //   cash_box_id: get(cashBoxDetails, 'data.data.cash_box_id'),
    //   created_by: get(userData, 'id'),
    //   description: get(data, 'description'),
    //   customer_id: get(customerId, 'id'),
    //   draft_time: get(data, 'draft_time'),
    //   sale_id: id,
    //   store_id: get(userData, 'store.id'),
    // }
    // createDraft(requestBody)
  }
  const mpaddedPaymentsList = [
    ...paymentsList,
    ...Array.from({ length: 8 - paymentsList.length }, (_, index) => ({ id: `placeholder-${index}`, isPlaceholder: true })),
  ]
  console.log(maxAmount)

  return (
    <Box hidden>
      <Box
        width='calc(100% + 32px)'
        mx={-2}
        mt={-4}
        // style={{ transform: 'rotateX(180deg)' }}
        // ref={printContainer}
      >
        <Drawer
          open={isOrderDrower}
          onClose={() => setIsOrderDrower(false)}
          onKeyDown={(e) => {
            if (e.code === 'KeyL') {
              // onSubmit()
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
            // if (!giftCardsRoute && !giftCardPayment && `F${payments?.length + 1}` === e.code) {
            //   if (!isReturnDrawer) handleClickGiftCard()
            //   else !isLoadingParent && handleReturnGiftCard()
            // }
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
            <Box className={classes.wrapper}>
              <Box width='calc(75% - 64px)' padding={'0 40px 0 0'}>
                <Box mb={'40px'} display='flex' width={'100%'} justifyContent={'space-between'}>
                  <Box
                    width={'416px'}
                    borderRadius={'16px'}
                    boxShadow='0px 2px 8px 0px #0000000A'
                    border={'1px solid'}
                    padding={'24px'}
                    borderColor={'bunker.100'}
                    mr={'24px'}
                  >
                    <Typography fontSize={24} fontWeight={'700'} lineHeight={'32px'} color={'bunker.500'}>
                      Jami:
                    </Typography>
                    <Typography fontSize={32} fontWeight={'800'} lineHeight={'48px'} color={'bunker.950'}>
                      {get(cartItemsList, 'total_amount')} UZS
                    </Typography>
                  </Box>
                  <Box
                    borderRadius={'16px'}
                    boxShadow='0px 2px 8px 0px #0000000A'
                    border={'1px solid'}
                    padding={'24px'}
                    borderColor={'bunker.100'}
                    width={'416px'}
                  >
                    <Typography fontSize={24} fontWeight={'700'} lineHeight={'32px'} color={'bunker.500'}>
                      {maxAmount < 0 ? 'Qaytim' : 'To’lash kerak'}
                    </Typography>
                    <Typography fontSize={32} fontWeight={'800'} lineHeight={'48px'} color={maxAmount === 0 ? 'green.700' : 'red.700'}>
                      {maxAmount} UZS
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography fontSize={16} fontWeight={'600'} lineHeight={'24px'} color={'bunker.700'}>
                    To'lov turi:
                  </Typography>
                  <Grid container display={'flex'}>
                    {get(paymentTypesList, 'data.data', []).map((item) => (
                      <Grid sx='3' sm='3' lg='3' xl='3' xs='3' m={'3'} onClick={() => handleAddPaymentType(item)}>
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
                          mr={'16px'}
                          mb={'16px'}
                          justifyContent={'space-between'}
                          borderRadius={'24px'}
                        >
                          <Typography fontSize={18} fontWeight={'600'} lineHeight={'40px'}>
                            {get(item, 'name')}
                          </Typography>
                          <AddPaumentTypeIcon color={isVisiblePaymentType(item) ? '#2558FF' : '#AFD5FF'} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box>
                  <Grid container width={'100%'} display={'flex'}>
                    {mpaddedPaymentsList?.map((el) => (
                      <Grid sx='3' sm='3' lg='3' xl='3' xs='3' m={'3'} key={el.id}>
                        {el?.amount ? (
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
                                  <RemovePaymentIcon />
                                </MuiButton>
                              </Box>
                            </div>
                            <div className={classes.boxBody}>
                              <PaymentMethodInput
                                id={el.id}
                                index={el.id}
                                classes={classes}
                                item={el}
                                isReturnDrawer={true}
                                removePaymentType={removePaymentType}
                                cashbackPaymentPercentage={1}
                                paymentsList={paymentsList}
                                setPaymentsList={setPaymentsList}
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
              </Box>
              <Box maxWidth='400px'>
                <Box
                  mx={-2}
                  mt={-4}
                  style={{
                    // width: 320,
                    padding: '20px',
                  }}
                  ref={printContainer}
                >
                  <RippedPaperItem
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
            <LoadingButton sx={{ minHeight: '48px !important ', display: 'flex' }} variant='contained' disabled={maxAmount > 0} onClick={onSubmit}>
              To'lash
            </LoadingButton>
          </FormProvider>
        </Drawer>
      </Box>
    </Box>
  )
}
