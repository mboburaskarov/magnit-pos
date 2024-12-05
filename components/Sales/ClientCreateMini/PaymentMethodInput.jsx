import { useEffect, useMemo, useState } from 'react'
import { TextField } from '@mui/material'
import PriceFormattedNegativeInput from '../../Inputs/InputSearch'
import { useDispatch } from 'react-redux'
import setOrderAmount from './OrderDrawer'
import { error } from '../../../utils/toast'
import PriceFormattedInput from '../../Inputs/InputSearch'
import { useTranslation } from 'react-i18next'
import { numberToPrice } from '../../../utils/numberToPrice'

export default function PaymentMethodInput({
  classes,
  item,
  orderPayments,
  totalPrice,
  clientInfo,
  cashbackPaymentPercentage,
  id,
  index,
  disabled,
  minusMark,
  isReturnDrawer,
  webkassaOn,
  max,
}) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [value, setValue] = useState(webkassaOn ? (isReturnDrawer ? -item.max_amount : item.paid_amount) : item.paid_amount)
  const maxValue = useMemo(() => item.max_amount, [item])

  useEffect(() => {
    const hasOnlyZero = new RegExp('^[0]+$').test(value)
    if ((value !== '' && !hasOnlyZero) || value === 0) {
      dispatch(setOrderAmount(item.id, Number(value)))
    }
  }, [value])

  useEffect(() => {
    setValue(item.paid_amount)
  }, [orderPayments])

  const handleReturnCashback = (numValue) => {
    const isCashback = item?.company_payment_type_id === 'cashback'
    const inputs = document.querySelectorAll(`#${isCashback ? 'balance-payment-input' : 'payment-input'}`)
    let count = 0
    inputs?.forEach((input) => {
      count += Number(input?.value?.replaceAll(' ', ''))
    })

    if (count > max) {
      const maxAmount = max > Math.abs(totalPrice) ? totalPrice : max
      if (isCashback) {
        error('menu.sales.toast.error.loyalty_payment', {
          max: numberToPrice(maxAmount),
        })
      } else
        error('menu.sales.toast.error.not_loyalty_payment', {
          max: numberToPrice(maxAmount),
        })

      setValue(item?.paid_amount)
    } else setValue(-numValue)
  }
  return (
    <TextField
      id={id}
      name='price'
      type='text'
      className={classes.input}
      autoComplete='off'
      disabled={disabled}
      fullWidth
      value={minusMark ? `-${value}` : value}
      inputComponent={PriceFormattedNegativeInput}
      onFocus={(e) => {
        const box = document.getElementById(`payment-box${index}`)
        box.classList.add(classes.outline)
      }}
      onBlur={(e) => {
        const box = document.getElementById(`payment-box${index}`)
        box.classList.remove(classes.outline)
      }}
      InputProps={{
        allowNegative: false,
        inputComponent: PriceFormattedInput,
      }}
      onChange={(e) => {
        let numValue = Number(e.target.value)
        if (!!maxValue && webkassaOn && isReturnDrawer && maxValue < numValue) {
          setValue(-maxValue)
          return
        }
        if (!!max && isReturnDrawer) {
          handleReturnCashback(numValue)
          return
        }
        if (item?.type === 'gift-card' && numValue > max) {
          error(`menu.marketing.${item?.company_payment_type_id?.toLowerCase()}.not_enough_balance`)
          setValue(item?.paid_amount)
          return
        }
        if (item?.company_payment_type_id === 'cashback') {
          const cashbackPaymentAmount =
            orderPayments?.filter((el) => el.company_payment_type_id === 'cashback')?.reduce((init, el) => (init += el?.paid_amount), 0) || 0
          const leftSum = totalPrice - cashbackPaymentAmount
          const availableClientBalance = clientInfo?.balance - cashbackPaymentAmount + item.paid_amount

          const limitPercentage = (cashbackPaymentPercentage ?? 100) / 100
          const payableAmount = totalPrice * limitPercentage - cashbackPaymentAmount + item.paid_amount
          if (numValue > payableAmount && numValue) {
            error(
              t('menu.sales.new.cashback_percent_error', {
                cashbackPaymentPercentage,
              })
            )
            setValue(item?.paid_amount)
            return
          }
          if (numValue > availableClientBalance && availableClientBalance > 0) {
            error('menu.sales.new.not_enough_balance')
            setValue(item?.paid_amount)
            return
          }
        }
        if (item.name !== t('menu.sales.operations.cash') && numValue > totalPrice) {
          setValue(item?.paid_amount)
          return
        }

        if (isReturnDrawer) {
          setValue(-e.target.value)
        } else {
          setValue(e.target.value)
        }
      }}
    />
  )
}
