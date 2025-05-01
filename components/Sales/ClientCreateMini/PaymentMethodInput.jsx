import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
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
    if (item?.type !== 'cash' && inputValue > totalAmount) return
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
        onBlur={(e) => {
          const inputValue = Number(e.target.value.replace(/\s/g, ''))
          const box = document.getElementById(`payment-box${index}`)
          box.classList.remove(classes?.outline)

          if (item?.type !== 'CASH' && inputValue > totalAmount) {
            const updatedPaymentList = paymentsList.map((payment) => (payment.id === id ? { ...payment, amount: item?.amount } : payment))
            setPaymentsList(updatedPaymentList)
            setValue(inputValue)
            return
          }
        }}
        setValue={handleChange}
      />
    </Box>
  )
}
