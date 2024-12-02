import { useEffect, useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { getGiftCardTitle } from '../../../utils/getGiftCardTitle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Drawer, Button, Typography, Button as MuiButton, Checkbox, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import BackArrowIcon from '../../../src/assets/icons/ArrowRightIcon'
import CashIcon from '../../../src/assets/icons/ArrowRightIcon'
import PlusIcon from '../../../src/assets/icons/ArrowRightIcon'
import UserFilledIcon from '../../../src/assets/icons/ArrowRightIcon'
import PencilIcon from '../../../src/assets/icons/ArrowRightIcon'
import addToOrderPayment from './PaymentMethodInput'
import removeFromOrderPayment from './PaymentMethodInput'
import balanceAmountSelector from './PaymentMethodInput'
import cartTotalPriceWithoutDiscountSelector from './PaymentMethodInput'
import { numberToPrice } from '../../../utils/numberToPrice'
import { v4 as uuidv4 } from 'uuid'
import requests from './index'
import { RippedPaperItem } from '../../RippedPaperList'
import ShortcutWrapper from '../../ShortcutWrapper'
import PaymentMethodInput from './PaymentMethodInput'
// import DebtDrawer from './DebtDrawer'
import GiftCardIcon from '../../../src/assets/icons/ArrowRightIcon'
import GiftCardDrawer from '../../../src/assets/icons/ArrowRightIcon'
import GiftCardInfo from '../../../src/assets/icons/ArrowRightIcon'
import RemovePaymentIcon from '../../../src/assets/icons/ArrowRightIcon'
import CertificateCardDrawer from '../../../src/assets/icons/BigWarningIcon'
import { giftCardPaymentIds } from '../../../constants/giftCardPaymentIds'
import ButtonWithSwitch from './ButtonWithSwitch'
import PaymeGo from '../../../src/assets/icons/BigWarningCircleIcon'
import { paymeGoId } from '../../../constants/paymeGoId'
import PaymeSmallIcon from '../../../src/assets/icons/ArrowRightIcon'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: 'calc(100% - 128px)',
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
    height: 'auto',
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
    height: 128,
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
    marginRight: 8,
    marginBottom: 16,
    border: `1px solid ${theme.palette.gray[300]}`,
    overflow: 'hidden',
  },
  outline: {
    transition: 'all 0.4s ease',
    boxShadow: `0 0 0 3px ${theme.palette.blue[500]}`,
  },
  boxHeader: {
    backgroundColor: theme.palette.gray[100],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    padding: '18px 16px',
    borderBottom: `1px solid ${theme.palette.gray[300]}`,
  },

  input: {
    height: 56,
    cursor: 'pointer',
    backgroundColor: theme.palette.background.default,
    '& input': {
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: theme.palette.background.default,
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
    height: 72,
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
  isOpen,
  closeDrawer,
  printContainer,
  orderNumber,
  cashbackPaymentPercentage,
  cheque,
  paymentTypes,
  isLoading,
  onSubmit,
  accessToPrint,
  shop,
  noCheck,
  half,
  user,
  clientInfo,
  setOpenClientCreateMini,
  setOpenClientCard,
  setClientInfo,
  setQuickCreateClientName,
  clientInputRef,
  createdClientId,
  setCreatedClientId,
  openDebt,
  setOpenDebt,
  eposTransaction,
  webkassaTransaction,
  eposOn,
  webkassaOn,
  sellers,
  deleteDebt,
  eposChecked,
  setEposChecked,
  control,
  cashbackPercent,
  loyaltyProgramType,
  isAutoIncome,
  setOpenAutoIncome,
}) {
  const classes = useStyles()
  const [payments, setPayments] = useState([])
  const [payme, setPayme] = useState(false)
  const { id } = useParams()
  const theme = useTheme()
  const { t } = useTranslation()
  const forbiddenRoutes = useSelector((state) => state?.permissionRoutes)
  const [giftCardOpen, setGiftCardOpen] = useState(false)
  const [giftCardId, setGiftCardId] = useState(0)
  const smsAuthRole = forbiddenRoutes?.find((el) => el?.slug === 'order-assign-client-sms-auth')
  const debtRoute = forbiddenRoutes.find((el) => el.slug === 'order-debt')
  const orderNewRoute = forbiddenRoutes.find((el) => el.slug === 'order-new')
  const giftCardsRoute = forbiddenRoutes.find((el) => el?.slug === 'gift-cards')
  const giftCardPayment = forbiddenRoutes.find((el) => el?.slug === 'pay-gift-card')
  const totalPrice = useSelector((state) => state.cart.totalPrice, shallowEqual)
  const { cartItems, orderPayments, returnItems, discount, returnPayments } = useSelector((state) => state.cart)
  const isReturnDrawer = returnItems?.length > 0 ? (returnItems?.length > 0 && cartItems?.length > 0 ? totalPrice < 0 : true) : false
  const { data: orderDetails, refetch } = useQuery(['orderDetails', id], () => requests.order.getSingle(id))

  const { refetch: refetchParent, isFetching: isLoadingParent } = useQuery('orderDetails', () => requests.order.getSingle(orderDetails?.data?.parent_id), {
    enabled: false,
    cacheTime: 5000,
  })

  useEffect(() => {
    if (isOpen) refetch()
  }, [isOpen])

  const { loyalty_payment, not_loyalty_payment } = orderDetails?.data?.order_detail || {}

  const exchangeItemsTotalPrice = cartItems?.reduce((a, b) => a + b?.total_price, 0)

  const debtAmount = orderDetails?.data?.parent_order_debt?.amount || 0
  const debtPaidAmount = orderDetails?.data?.parent_order_debt?.paid_amount || 0
  const maxDebt = debtAmount - debtPaidAmount
  const minDebt = maxDebt - (maxDebt - returnItems.reduce((total, returnItem) => (total += Math.abs(Number(returnItem.total_price))), 0))
  const totalOrderDebt = maxDebt > minDebt ? minDebt : maxDebt
  const debtRepayedAmount = debtAmount === debtPaidAmount ? 0 : debtPaidAmount

  const [shopDetails, setShopDetails] = useState(null)
  const dispatch = useDispatch()
  const totalPriceWithoutDiscount = useSelector((state) => cartTotalPriceWithoutDiscountSelector(state), shallowEqual)

  const balanceAmount = useSelector((state) => balanceAmountSelector(state), shallowEqual)
  const returnAmount = Number((balanceAmount + totalOrderDebt).toFixed(2))
  const overallAmount = isReturnDrawer ? returnAmount : Number(balanceAmount)
  const [editDebt, setEditDebt] = useState(intitalDebtInfo)
  const [maxKeys, setMaxKeys] = useState(0)

  const calculateClientBalance = () => {
    const paidAmount = orderPayments?.filter((el) => el.company_payment_type_id === 'cashback')?.reduce((init, el) => (init += el?.paid_amount), 0) || 0
    return clientInfo?.balance - paidAmount
  }

  const notLoyaltyPaidAmount = useMemo(
    () =>
      orderPayments
        ?.filter((payment) => payment?.company_payment_type_id !== 'cashback' && payment?.type !== 'gift-card')
        ?.reduce((a, b) => a + Math.abs(b?.paid_amount), 0),
    [orderPayments]
  )
  const loyaltyPaidAmount = useMemo(
    () => orderPayments?.filter((payment) => payment?.company_payment_type_id === 'cashback')?.reduce((a, b) => a + Math.abs(b?.paid_amount), 0),
    [orderPayments]
  )

  const addOrderPaymentReturn = (item) => {
    let payload
    let maxAmount
    if (item?.balance) {
      maxAmount = Math.abs(loyalty_payment) > Math.abs(totalPrice) ? overallAmount : -Math.abs(loyalty_payment - loyaltyPaidAmount)
      payload = {
        company_payment_type_id: 'cashback',
        id: uuidv4(),
        paid_amount: maxAmount,
        returned_amount: 0,
        name: t('menu.sales.all.balance'),
        max_amount: -maxAmount,
      }
    } else {
      maxAmount =
        Math.abs(not_loyalty_payment) > Math.abs(totalPrice) - totalOrderDebt || !not_loyalty_payment
          ? overallAmount
          : -Math.abs(not_loyalty_payment + debtRepayedAmount - exchangeItemsTotalPrice - notLoyaltyPaidAmount)
      payload = {
        company_payment_type_id: item.id,
        id: uuidv4(),
        paid_amount: maxAmount,
        returned_amount: 0,
        name: item.name,
        max_amount: -maxAmount,
      }
    }

    if (payload?.paid_amount && !!overallAmount) dispatch(addToOrderPayment(payload))
  }
  useEffect(() => {
    const cashbackPayment = orderPayments?.find((payment) => payment.company_payment_type_id === 'cashback')
    if (!clientInfo && !!cashbackPayment) {
      dispatch(removeFromOrderPayment(cashbackPayment))
    }
  }, [clientInfo])

  const addOrderPayment = (item) => {
    if (overallAmount > 0 || returnItems.length > 0) {
      if (item?.balance) {
        const alreadyPaidAmount = orderPayments?.filter((el) => el.name === t('menu.sales.all.balance'))?.reduce((i, el) => (i += el.paid_amount || 0), 0) || 0
        const calculatePaidAmount = () => {
          const limitPercentage = (cashbackPaymentPercentage ?? 100) / 100
          const payableAmount = totalPrice * limitPercentage - alreadyPaidAmount
          return item?.balance >= overallAmount
            ? overallAmount > payableAmount
              ? payableAmount
              : overallAmount
            : item?.balance > payableAmount
            ? payableAmount
            : item?.balance - alreadyPaidAmount
        }
        const payload = {
          company_payment_type_id: 'cashback',
          id: uuidv4(),
          paid_amount: calculatePaidAmount(),
          returned_amount: 0,
          name: t('menu.sales.all.balance'),
        }
        if ((payload?.returned_amount || payload?.paid_amount) && alreadyPaidAmount < item.balance) {
          dispatch(addToOrderPayment(payload))
        }
      } else if (overallAmount !== 0) {
        const payload = {
          company_payment_type_id: item.id,
          id: uuidv4(),
          paid_amount: overallAmount,
          returned_amount: 0,
          name: item.name,
          max_amount: item?.max_amount,
        }
        if (payload?.returned_amount || payload?.paid_amount) {
          dispatch(addToOrderPayment(payload))
        }
      }
    }
  }

  useEffect(() => {
    if (shop) {
      requests.shop
        .getSingle(shop.id)
        .then(({ data }) => setShopDetails(data))
        .catch((err) => console.error(err))
    }
  }, [shop])

  useEffect(() => {
    if (!!paymentTypes?.data?.company_payment_types?.length)
      if (!debtRoute) {
        let modPayments = [
          ...paymentTypes?.data?.company_payment_types?.filter((type) => !giftCardPaymentIds.includes(type?.payment_type?.id)),
          {
            id: 'debt',
            name: t('menu.sales.all.debt'),
          },
        ]?.map((item, index) => ({
          ...item,
          shortcut: `F${index + 1}`,
        }))
        if (webkassaOn) {
          modPayments.pop()
          if (isReturnDrawer) {
            modPayments = modPayments.map((item) => {
              const match = returnPayments.find((i) => i.company_payment_type_id === item.id)
              return match
                ? {
                    ...item,
                    max_amount: match?.paid_amount - match?.returned_amount,
                    disabled: false,
                  }
                : { ...item, disabled: true }
            })
          }
        }
        setPayments(modPayments)
        setMaxKeys(modPayments?.length)
      } else {
        let modPaymentsElse = [...paymentTypes?.data?.company_payment_types]?.map((item, index) => ({
          ...item,
          shortcut: `F${index + 1}`,
        }))
        if (webkassaOn && isReturnDrawer) {
          modPaymentsElse = modPaymentsElse.map((item) => {
            const match = returnPayments.find((i) => i.company_payment_type_id === item.id)
            return match
              ? {
                  ...item,
                  max_amount: match?.paid_amount - match?.returned_amount,
                  disabled: false,
                }
              : { ...item, disabled: true }
          })
        }
        setPayments(modPaymentsElse)
        setMaxKeys(modPaymentsElse?.length)
      }
  }, [paymentTypes?.data, webkassaOn, returnPayments])

  useEffect(() => {
    if (!clientInfo) {
      dispatch(removeFromOrderPayment(orderPayments.filter((item) => item.company_payment_type_id === 'debt')[0]))
    }
  }, [clientInfo])

  const isCashbackDisabled = isReturnDrawer ? loyaltyPaidAmount === loyalty_payment : !overallAmount || calculateClientBalance() === 0

  const handleClickGiftCard = useCallback(() => {
    setGiftCardOpen((prev) => !prev)
  }, [])

  const handleReturnGiftCard = () => {
    refetchParent().then(({ data }) => {
      const giftCard = data?.data?.order_detail?.order_payments?.find((el) => el?.is_certificate || el?.is_voucher)
      const payload = {
        company_payment_type_id: giftCard?.company_payment_type?.name.toUpperCase(),
        id: uuidv4(),
        paid_amount: Math.abs(overallAmount) < giftCard?.paid_amount ? overallAmount : -giftCard?.paid_amount,
        returned_amount: 0,
        gift_card_id: giftCard?.gift_card_id,
        name: t(getGiftCardTitle(giftCard?.company_payment_type?.name)),
        max_amount: giftCard?.paid_amount,
        type: 'gift-card',
      }
      if (payload?.paid_amount && !orderPayments?.find((el) => el?.gift_card_id === giftCard?.gift_card_id)) {
        dispatch(addToOrderPayment(payload))
      }
    })
  }

  return (
    <>
      <Box hidden>
        {!noCheck && (
          <Box
            width='calc(100% + 32px)'
            mx={-2}
            mt={-4}
            // style={{ transform: 'rotateX(180deg)' }}
            ref={printContainer}
          >
            <RippedPaperItem
              id='cheque_of_orders'
              data={cheque}
              noFormControl
              discount={discount}
              orderItems={cartItems}
              totalPriceWithoutDiscount={totalPriceWithoutDiscount}
              totalPrice={totalPrice}
              shop={shopDetails}
              user={user}
              clientName={`${clientInfo?.first_name || ''} ${clientInfo?.last_name || ''}`}
              sellers={sellers}
              returnItems={returnItems}
              orderNumber={orderNumber}
              eposTransaction={eposTransaction}
              webkassaTransaction={webkassaTransaction}
              eposOn={eposOn && eposChecked}
              webkassaOn={webkassaOn}
            />
          </Box>
        )}
      </Box>
      <Drawer
        open={isOpen}
        onClose={closeDrawer}
        onKeyDown={(e) => {
          if (e.code === 'KeyL') {
            onSubmit()
          }
          if (payments?.find((payment) => payment?.shortcut === e.code && !payment?.disabled && payment?.id === 'debt' && maxKeys <= MAX_F_BUTTONS_QUANTITY)) {
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
          if (!giftCardsRoute && !giftCardPayment && `F${payments?.length + 1}` === e.code) {
            if (!isReturnDrawer) handleClickGiftCard()
            else !isLoadingParent && handleReturnGiftCard()
          }
          if (payments?.find((payment) => payment?.shortcut === e.code && !payment?.disabled && payment?.id !== 'debt' && maxKeys <= MAX_F_BUTTONS_QUANTITY)) {
            const payment = payments?.find((payment) => payment?.shortcut === e.code)
            isReturnDrawer ? addOrderPaymentReturn(payment) : addOrderPayment(payment)
          }
        }}
        anchor='right'
        elevation={1}
        className={`${classes.drawer} ${half ? classes.half : ''}`}
      >
        <Box className={classes.wrapper}>
          {!noCheck && (
            <Box maxWidth='25%'>
              <Box
                mx={-2}
                mt={-4}
                style={{
                  // transform: 'rotateX(180deg)',
                  width: 320,
                }}
              >
                <RippedPaperItem
                  id='cheque_of_orders'
                  data={cheque}
                  noFormControl
                  discount={discount}
                  orderItems={cartItems}
                  totalPriceWithoutDiscount={totalPriceWithoutDiscount}
                  totalPrice={totalPrice}
                  shop={shopDetails}
                  user={user}
                  clientName={`${clientInfo?.first_name || ''} ${clientInfo?.last_name || ''}`}
                  sellers={sellers}
                  returnItems={returnItems}
                  orderNumber={orderNumber}
                  eposTransaction={eposTransaction}
                  webkassaTransaction={webkassaTransaction}
                  eposOn={eposOn && eposChecked}
                  webkassaOn={webkassaOn}
                />
              </Box>
            </Box>
          )}
          <Box ml={half ? 0 : 10} className={classes.body}>
            <Box width='100%' display='flex' justifyContent='space-between'>
              <Button id='cancel-button' secondary adornmentStart={<BackArrowIcon />} className={classes.backBtn} onClick={closeDrawer}>
                {t('buttons.back')}
                <ShortcutWrapper color='#BDBDBD' margin='0 0 0 8px' shortcut='B' />
              </Button>

              <Box display='flex'>
                {!!clientInfo && loyaltyProgramType === 'CASHBACK' && !!cashbackPercent && (
                  <ButtonWithSwitch control={control} title={`${t('loyalty_program.cashback')} ${cashbackPercent}%`} defaultValue={true} name='with_cashback' />
                )}
                {eposOn && (
                  <Box className={classes.checkboxContainer}>
                    <Checkbox
                      checked={eposChecked}
                      onChange={() => setEposChecked((prev) => !prev)}
                      className={classes.checkbox}
                      icon={<FontAwesomeIcon icon={faCircle} style={{ color: theme.palette.blue[500] }} />}
                      checkedIcon={<FontAwesomeIcon icon={faCheckCircle} style={{ color: theme.palette.blue[500] }} />}
                    />
                  </Box>
                )}
                <Box style={{ display: 'flex', flexDirection: 'row' }} width={196}>
                  <button
                    id='BUTTON_WITHOUT_HANDLEPRINT'
                    type='submit'
                    onClick={() => {
                      accessToPrint.current = false
                      onSubmit()
                    }}
                    disabled={returnItems.length ? overallAmount !== 0 : overallAmount > 0 || isLoading}
                    style={{
                      position: 'absolute',
                      right: '500px',
                      width: '1px',
                      height: '1px',
                      opacity: '0',
                    }}
                  >
                    .
                  </button>
                  {!orderNewRoute && (
                    <Button
                      id='pay-button'
                      primary
                      fullWidth
                      type='submit'
                      onClick={() => {
                        if (isAutoIncome) {
                          setOpenAutoIncome(true)
                          return
                        }
                        onSubmit()
                      }}
                      disabled={returnItems.length ? (overallAmount || 0) !== 0 : overallAmount > 0 || isLoading}
                      isLoading={isLoading}
                    >
                      {t('buttons.pay')}
                      <ShortcutWrapper color={orderPayments?.length ? '#ffffff' : '#BDBDBD'} margin='0 0 0 8px' shortcut='L' />
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
            <Box display='flex' mt={4.5}>
              <Box flex='0 0 50%'>
                <h3 className={classes.priceTitle}>{t('menu.sales.new.overall')}:</h3>
                <span id='total-price' className={classes.price}>
                  {numberToPrice(totalPrice)}
                </span>
              </Box>
              {overallAmount < 0 ? (
                returnItems.length > 0 ? (
                  <Box flex='0 0 50%'>
                    <h3 className={classes.priceTitle}>{t('menu.sales.new.to_pay')}:</h3>
                    <span id='for-payment' className={classes.price}>
                      {numberToPrice(overallAmount)}
                    </span>
                  </Box>
                ) : (
                  <Box flex='0 0 50%'>
                    <h3 className={`${classes.priceTitle} ${classes.paid} ${classes.change}`}>{t('menu.sales.new.surrender')}:</h3>
                    <span id='cashback' className={`${classes.price} ${classes.paid} ${classes.change}`}>
                      {numberToPrice(Math.abs(overallAmount))}
                    </span>
                  </Box>
                )
              ) : (
                <Box flex='0 0 50%'>
                  <h3 className={`${classes.priceTitle} ${classes.paid}`}>{t('menu.sales.new.to_pay')}:</h3>
                  <span className={`${classes.price} ${classes.paid}`}>{numberToPrice(overallAmount)}</span>
                </Box>
              )}
            </Box>
            <Box mt={4} display='flex' flexWrap='wrap'>
              {payments?.map((item, index) => {
                const disabled =
                  overallAmount === 0 ||
                  (orderPayments.some((res) => res.company_payment_type_id === 'debt') && item?.id === 'debt') ||
                  (isReturnDrawer && item?.id === 'debt')

                const webkassaReturnDisable =
                  Math.abs(orderPayments?.find((el) => el.company_payment_type_id === item.id)?.paid_amount) === item.max_amount && webkassaOn

                const canPayWithGo = !!!orderPayments?.length

                return (
                  <Box key={index} flex='0 0 32.3%' mr={1} mb={1}>
                    <MuiButton
                      fullWidth
                      className={`${classes.paymentBtn} ${
                        disabled || item?.disabled || webkassaReturnDisable || (!canPayWithGo && item?.name === 'Payme Go') ? classes.disabledPaymentBtn : ''
                      }`}
                      id='add-payment-button'
                      disabled={disabled || item?.disabled || webkassaReturnDisable || (!canPayWithGo && item?.name === 'Payme Go')}
                      onClick={() => {
                        if (item?.payment_type?.id === paymeGoId) {
                          setPayme(true)
                          return
                        }
                        if (item?.id === 'debt') {
                          setEditDebt({
                            ...editDebt,
                            amount: editDebt?.amount ? editDebt?.amount : overallAmount.toString(),
                          })
                          setOpenDebt(true)
                        } else {
                          isReturnDrawer ? addOrderPaymentReturn(item) : addOrderPayment(item)
                        }
                      }}
                    >
                      <div className={`${classes.cashIcon} ${disabled || (!canPayWithGo && item?.name === 'Payme Go') ? classes.disabledCashIcon : ''}`}>
                        {item?.payment_type?.id === paymeGoId ? <PaymeSmallIcon /> : <CashIcon />}
                      </div>
                      <span id='payment-name' className={`${classes.paymentName} ${disabled ? classes.disabledPaymentName : ''}`}>
                        {item.name}
                        {index <= 10 && <ShortcutWrapper color='#BDBDBD' margin='0 0 0 8px' shortcut={item?.shortcut} />}
                      </span>
                      <PlusIcon className={disabled ? classes.disabledCashIcon : ''} />
                    </MuiButton>
                  </Box>
                )
              })}
              {!giftCardsRoute && !giftCardPayment && (
                <Box flex='0 0 32.3%' mr={1} mb={1}>
                  <MuiButton
                    id='gift-card'
                    fullWidth
                    className={`${classes.paymentBtn} ${!overallAmount && classes.disabledPaymentBtn}`}
                    disabled={!overallAmount || isLoadingParent}
                    onClick={() => {
                      if (!isReturnDrawer) handleClickGiftCard()
                      else handleReturnGiftCard()
                    }}
                  >
                    <div className={`${classes.cashIcon}`}>
                      <GiftCardIcon />
                    </div>
                    <span id='payment-name' className={`${classes.paymentName}`}>
                      {t('menu.marketing.card')}
                      {payments.length <= 10 && <ShortcutWrapper color='#BDBDBD' margin='0 0 0 8px' shortcut={`F${payments.length + 1}`} />}
                    </span>
                    <PlusIcon />
                  </MuiButton>
                </Box>
              )}
              {!!clientInfo && (
                <Box flex='0 0 32.3%' mr={1} mb={1}>
                  <MuiButton
                    id='client-balance'
                    fullWidth
                    className={`${classes.paymentBtn} ${
                      isCashbackDisabled || (!orderDetails?.data?.order_detail?.is_authorized && smsAuthRole) ? classes.disabledPaymentBtn : ''
                    }`}
                    disabled={isCashbackDisabled || (!orderDetails?.data?.order_detail?.is_authorized && smsAuthRole)}
                    onClick={() => (isReturnDrawer ? addOrderPaymentReturn(clientInfo) : addOrderPayment(clientInfo))}
                  >
                    <div className={`${classes.cashIcon}`}>
                      <UserFilledIcon />
                    </div>
                    <span className={`${classes.paymentName} ${classes.clientBalance}`}>
                      <span>{t('menu.sales.all.balance')}</span>
                      <span id='balance-amount' className={classes.balanceAmount}>
                        {numberToPrice(calculateClientBalance())}
                      </span>
                    </span>
                    <PlusIcon />
                  </MuiButton>
                </Box>
              )}
            </Box>
            <Box display='flex' flexWrap='wrap' mt={4}>
              {!!isReturnDrawer && !!totalOrderDebt && (
                <Box className={classes.box}>
                  <div className={classes.boxHeader}>
                    <Typography id='payment-type'>{t('menu.sales.all.debt')}</Typography>
                  </div>
                  <div className={classes.boxBody}>
                    <PaymentMethodInput
                      classes={classes}
                      item={{
                        company_payment_type_id: 'debt',
                        id: uuidv4(),
                        paid_amount: -totalOrderDebt,
                        returned_amount: 0,
                        name: t('menu.sales.all.debt'),
                      }}
                      disabled
                      minusMark
                    />
                  </div>
                </Box>
              )}
              {orderPayments?.map((item, index) => (
                <Box id={`payment-box${index}`} className={classes.box} key={index}>
                  <div className={classes.boxHeader}>
                    <Typography id='payment-type'>{item.name}</Typography>
                    <Box display='flex' alignItems='center'>
                      {item.company_payment_type_id === 'debt' && (
                        <MuiButton
                          onClick={() => {
                            setOpenDebt(true)
                            setEditDebt({
                              ...editDebt,
                              active: true,
                            })
                          }}
                          sx={{ padding: 0 }}
                        >
                          <PencilIcon />
                        </MuiButton>
                      )}
                      {item?.type === 'gift-card' && (
                        <MuiButton onClick={() => setGiftCardId(item?.code)} sx={{ padding: 0 }}>
                          <GiftCardInfo />
                        </MuiButton>
                      )}
                      <MuiButton
                        sx={() => ({
                          paddingRight: 0,
                          paddingLeft: 1,
                        })}
                        onClick={() => {
                          dispatch(removeFromOrderPayment(item))
                          if (item.company_payment_type_id === 'debt') {
                            setEditDebt(intitalDebtInfo)
                            deleteDebt(id)
                          }
                        }}
                      >
                        <RemovePaymentIcon />
                      </MuiButton>
                    </Box>
                  </div>
                  <div className={classes.boxBody}>
                    <PaymentMethodInput
                      id={item.company_payment_type_id === 'cashback' ? 'balance-payment-input' : 'payment-input'}
                      index={index}
                      classes={classes}
                      item={item}
                      isReturnDrawer={isReturnDrawer}
                      cashbackPaymentPercentage={cashbackPaymentPercentage}
                      orderPayments={orderPayments}
                      totalPrice={isReturnDrawer ? -totalPrice : totalPrice}
                      clientInfo={clientInfo}
                      max={item?.type === 'gift-card' ? item?.max_amount : item.company_payment_type_id === 'cashback' ? loyalty_payment : not_loyalty_payment}
                      disabled={item.company_payment_type_id === 'debt'}
                      webkassaOn={webkassaOn}
                    />
                    {item?.type === 'gift-card' && (
                      <Typography
                        sx={(theme) => ({
                          fontSize: '14px',
                          color: theme.palette.gray[400],
                          position: 'absolute',
                          bottom: '12px',
                        })}
                      >
                        {t('titles.from')} {numberToPrice(item?.max_amount)}
                      </Typography>
                    )}
                  </div>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Drawer>
      {/* <DebtDrawer
        orderPayments={orderPayments}
        open={openDebt}
        setOpen={setOpenDebt}
        clientInfo={clientInfo}
        setClientInfo={setClientInfo}
        setOpenClientCreateMini={setOpenClientCreateMini}
        setOpenClientCard={setOpenClientCard}
        setQuickCreateClientName={setQuickCreateClientName}
        clientInputRef={clientInputRef}
        createdClientId={createdClientId}
        setCreatedClientId={setCreatedClientId}
        overallAmount={overallAmount}
        editDebt={editDebt}
        setEditDebt={setEditDebt}
      /> */}
      <GiftCardDrawer isOpen={giftCardOpen} closeDrawer={handleClickGiftCard} modal />
      <CertificateCardDrawer id={giftCardId} closeDrawer={() => setGiftCardId(null)} />
      <PaymeGo open={payme} setOpen={setPayme} totalPrice={totalPrice} onSubmit={onSubmit} />
    </>
  )
}
