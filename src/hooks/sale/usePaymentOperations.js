import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

export const usePaymentOperations = (cartItemsList, paymentTypesList) => {
  const { setValue, getValues, watch } = useFormContext()

  const defaultPaymentTypes = [
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

  const [paymentsList, setPaymentsList] = useState(defaultPaymentTypes)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [onlinePaymentType, setOnlinePaymentType] = useState({ from: 'Click', to: 'Payme' })
  const [cardPaymentType, setCardPaymentType] = useState({ from: 'Uzcard', to: 'Humo' })
  useEffect(() => {
    setPaymentsList(defaultPaymentTypes)

    setValue('lite_cash_amount', '')
    setValue('lite_card_amount', '')
    setValue('lite_online_amount', '')
    setMaxAmount(0)
  }, [cartItemsList])
  // Update cash payment
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

  // Update card payment
  useEffect(() => {
    const paymentTypeName = cardPaymentType.from === 'Uzcard' ? 'Uzcard' : 'Humo'
    const updatedPaymentList = paymentsList.map((payment) =>
      payment.type === 'card'
        ? {
            ...payment,
            app_type: cardPaymentType.from,
            name: cardPaymentType.from,
            payment_type_id: get(paymentTypesList, 'data.data', []).find((item) => item.name === paymentTypeName)?.id,
            amount: getValues('lite_card_amount'),
          }
        : payment
    )
    setPaymentsList(updatedPaymentList)
  }, [watch('lite_card_amount'), cardPaymentType])

  // Update online payment
  useEffect(() => {
    const paymentTypeName = onlinePaymentType.from === 'Click' ? 'Click' : 'Payme'
    const updatedPaymentList = paymentsList.map((payment) =>
      payment.type === 'app'
        ? {
            ...payment,
            app_type: onlinePaymentType.from,
            name: onlinePaymentType.from,
            payment_type_id: get(paymentTypesList, 'data.data', []).find((item) => item.name === paymentTypeName)?.id,
            amount: getValues('lite_online_amount'),
          }
        : payment
    )
    setPaymentsList(updatedPaymentList)
  }, [watch('lite_online_amount'), onlinePaymentType])

  // Calculate payment amount and max amount
  useEffect(() => {
    let amount = 0
    paymentsList.forEach((el) => {
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

  // Reset on cart change
  useEffect(() => {
    setPaymentsList(defaultPaymentTypes)
    setValue('lite_cash_amount', '')
    setValue('lite_card_amount', '')
    setValue('lite_online_amount', '')
    setMaxAmount(0)
  }, [cartItemsList])

  const resetPayments = () => {
    setPaymentsList(defaultPaymentTypes)
    setValue('lite_cash_amount', '')
    setValue('lite_card_amount', '')
    setValue('lite_online_amount', '')
  }

  return {
    paymentsList,
    setPaymentsList,
    paymentAmount,
    setPaymentAmount,
    maxAmount,
    setMaxAmount,
    onlinePaymentType,
    setOnlinePaymentType,
    cardPaymentType,
    setCardPaymentType,
    resetPayments,
  }
}
