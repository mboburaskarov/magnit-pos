// components/PaymentInputField.jsx
import { Box, Typography } from '@mui/material'
import InputFormattedPriceWithTextField from '../../../../../components/Inputs/InputFormattedPriceWithTextField'
import ShortcutBox from '../../../../../components/ShortcutBox'

export const PaymentInputField = ({
  name,
  placeholder,
  control,
  errors,
  inputRef,
  shortcut,
  setValue,
  paymentType,
  setPaymentType,
  paymentOptions = [],
  readOnly = false,
  soon = false,
  maxAmount,
  paymentsList = [],
}) => {
  const handleInput = (e) => {
    const value = Number(e.target.value.replace(/\s/g, ''))

    if (e.target.value === '') {
      setTimeout(() => {
        setValue?.(name, 0)
      }, 100)
      return
    }

    // For card and online payments, check against max amount
    if (paymentOptions.length > 0 && maxAmount !== undefined) {
      const currentPayment = paymentsList.find((a) => (name.includes('card') && a.type === 'card') || (name.includes('online') && a.type === 'app'))

      if (maxAmount < value - (currentPayment?.amount || 0)) {
        setValue?.(name, currentPayment?.amount || 0)
        if (inputRef) {
          inputRef.value = currentPayment?.amount || 0
        }
      }
    }
  }
  const handleClick = (e) => {
    const input = e.target
    const length = input.value.length
    setTimeout(() => {
      input.setSelectionRange(length, length)
    }, 0)
  }

  const renderAdornment = () => {
    // Soon badge for loyalty card
    if (soon) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}>
          <Box
            sx={{
              bgcolor: '#0125FF',
              padding: '0 8px',
              height: '20px',
              textAlign: 'center',
              borderRadius: '12px',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: '600',
                color: '#fff !important',
                textAlign: 'center',
                m: '0 !important',
              }}
            >
              soon
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '600', mx: '8px' }}>сум</Typography>
          <ShortcutBox minWidth='27px' shortcut={shortcut} height='20px' color='#D5D7E2' />
        </Box>
      )
    }

    // Simple cash payment
    if (paymentOptions.length === 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}>
          <Typography sx={{ fontSize: '14px', lineHeight: '20px', fontWeight: '600', mx: '8px' }}>сум</Typography>
          <ShortcutBox minWidth='27px' shortcut={shortcut} height='20px' color='#D5D7E2' />
        </Box>
      )
    }

    // Payment type selector (Card or Online)
    return (
      <Box
        sx={{
          bgcolor: 'bunker.100',
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
        {paymentOptions.map((option, index) => (
          <PaymentTypeButton
            key={option}
            option={option}
            isActive={paymentType?.from === option}
            onClick={() => {
              setPaymentType?.({
                from: option,
                to: paymentOptions[index === 0 ? 1 : 0],
              })
            }}
            shortcut={option[0].toUpperCase()}
            isFirst={index === 0}
          />
        ))}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        '& .MuiInputBase-root .MuiInputAdornment-root': {
          width: 'auto !important',
        },
        '& input': {
          fontWeight: 500,
          color: 'bunker.950',
          textAlign: 'start',
        },

        mt: name.includes('cash_amount_soon') ? '8px' : name.includes('card') || name.includes('online') ? '8px' : 0,
        '& .MuiOutlinedInput-root': {
          height: '44px !important',
        },
      }}
    >
      <InputFormattedPriceWithTextField
        name={name}
        id={name}
        placeholder={placeholder}
        control={control}
        noMarginTop
        required
        readOnly={readOnly}
        uncontrolled={readOnly}
        onInput={handleInput}
        onClick={handleClick}
        inputRef={inputRef}
        inputHeight='48px'
        error={errors?.[name]}
        fullWidth
        adornmentPosition='end'
        borderRadius='18px'
        type='number'
        adornment={renderAdornment()}
      />
    </Box>
  )
}

const PaymentTypeButton = ({ option, isActive, onClick, shortcut, isFirst }) => {
  const getImagePath = (option) => {
    const images = {
      Uzcard: '/images/uzcard.png',
      Humo: '/images/humo.png',
      Payme: '/images/payme.png',
      Click: '/images/click.png',
    }
    return images[option] || ''
  }

  const imageSize = option === 'Payme' || option === 'Click' ? '20px' : '30px'

  return (
    <Box
      sx={{
        width: '100%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        pr: isFirst ? '3px' : '6px',
        pl: isFirst ? '3px' : '3px',
        justifyContent: 'center',
        height: '32px',
        borderRadius: '10px',
        bgcolor: isActive ? 'white' : 'transparent',
        mr: isFirst ? '2px' : 0,
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          // bgcolor: 'white',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '32px',
          width: '36px',
          mr: '5px',
          padding: '5px 0',
        }}
      >
        <img style={{ width: imageSize, height: imageSize }} src={getImagePath(option)} alt={option} />
      </Box>
      <ShortcutBox minWidth='20px' shortcut={shortcut} height='20px' color='#868FAA' />
    </Box>
  )
}
