import { useState, useEffect } from 'react'
import { Box, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import NumberFormatInput from '../../Inputs/OutLineTextFieldThousand'

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

  lastPaymentInput,
  isLast = false,
}) {
  const { t } = useTranslation()

  const [value, setValue] = useState(item?.amount)

  useEffect(() => {
    setValue(item?.amount)
  }, [item])

  const handleChange = (e) => {
    const inputValue = Number(e)
    // if (inputValue <= 0 || !e) return removePaymentType(item.id)
    const updatedPaymentList = paymentsList.map((payment) => (payment.id === id ? { ...payment, amount: inputValue } : payment))
    setPaymentsList(updatedPaymentList)
    setValue(inputValue)
  }

  return (
    <Box
      sx={{
        '& .MuiOutlinedInput-root': {
          border: '2px solid transparent !important',
          borderColor: 'transparent !important',
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          border: '2px solid transparent !important',
          borderColor: 'transparent !important',
        },
      }}
    >
      <NumberFormatInput
        id={id}
        name='price'
        type='text'
        className={classes?.input}
        autoComplete='off'
        uncontrolled
        disabled={disabled}
        fullWidth
        value={value}
        inputRef={(el) => isLast && lastPaymentInput(el)}
        onFocus={() => {
          const box = document.getElementById(`payment-box${index}`)
          box.classList.add(classes?.outline)
        }}
        onBlur={() => {
          const box = document.getElementById(`payment-box${index}`)
          box.classList.remove(classes?.outline)
        }}
        setValue={handleChange}
      />
    </Box>
  )
}
