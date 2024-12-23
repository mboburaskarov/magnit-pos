import { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function PaymentMethodInput({
  classes,
  item,
  paymentsList,
  removePaymentType,
  id,
  setPaymentsList,
  index,
  disabled,
  totalAmount,
  paymentAmount,
  max,
}) {
  const { t } = useTranslation()

  const [value, setValue] = useState(item?.amount || 0)

  useEffect(() => {
    setValue(item?.amount || 0)
  }, [item])

  const handleChange = (e) => {
    const inputValue = Number(e.target.value)
    if (inputValue <= 0) return removePaymentType(item.id)
    const updatedPaymentList = paymentsList.map((payment) => (payment.id === id ? { ...payment, amount: inputValue } : payment))
    setPaymentsList(updatedPaymentList)
    setValue(inputValue)
  }

  return (
    <TextField
      id={id}
      name='price'
      type='text'
      className={classes?.input}
      autoComplete='off'
      disabled={disabled}
      fullWidth
      value={value}
      onFocus={() => {
        const box = document.getElementById(`payment-box${index}`)
        box.classList.add(classes?.outline)
      }}
      onBlur={() => {
        const box = document.getElementById(`payment-box${index}`)
        box.classList.remove(classes?.outline)
      }}
      onChange={handleChange}
    />
  )
}
