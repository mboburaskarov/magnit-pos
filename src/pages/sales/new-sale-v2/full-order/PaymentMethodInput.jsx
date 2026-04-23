import { Box } from '@mui/material'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'

export default function PaymentMethodInput({
  classes,
  item,
  paymentsList,
  id,
  setPaymentsList,
  index,
  disabled,
  max,

  lastPaymentInput,
  isLast = false,
}) {
  const itemAmount = Number((Number(item?.amount || 0) + Number.EPSILON).toFixed(2))

  const handleChange = (e) => {
    const inputValue = Number((Number(e || 0) + Number.EPSILON).toFixed(2))
    if (inputValue === itemAmount) return

    if (item?.type !== 'cash' && max < inputValue - itemAmount) return
    const updatedPaymentList = paymentsList.map((payment) => (payment.id === id ? { ...payment, amount: inputValue } : payment))
    setPaymentsList(updatedPaymentList)
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
        value={itemAmount}
        inputRef={(el) => isLast && lastPaymentInput(el)}
        onFocus={() => {
          const box = document.getElementById(`payment-box${index}`)
          box.classList.add(classes?.outline)
        }}
        onBlur={(e) => {
          const inputValue = Number((Number(e.target.value.replace(/\s/g, '')) + Number.EPSILON).toFixed(2))
          const box = document.getElementById(`payment-box${index}`)
          box.classList.remove(classes?.outline)

          if (item?.type !== 'cash' && max < inputValue - itemAmount) {
            const updatedPaymentList = paymentsList.map((payment) => (payment.id === id ? { ...payment, amount: itemAmount } : payment))
            setPaymentsList(updatedPaymentList)
            return
          }
        }}
        setValue={handleChange}
      />
    </Box>
  )
}
