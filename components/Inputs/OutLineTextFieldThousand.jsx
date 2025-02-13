import { Box, IconButton, InputAdornment, OutlinedInput as MuiTextField } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import Label from '../Label'
import { NumericFormat } from 'react-number-format'

const NumberFormatInput = ({
  placeholder,
  inputRef,
  InputProps,
  uncontrolled,
  value,
  setValue,
  sx,
  borderRadius,
  white,
  minNumber = 0,
  onKeyDown,
  defaultValue,
  withShadow,
  autoFocus,
  required = false,
  name,
  endAdornmentText,
  type,
  label,
  disabled,
  dashed,
  fullWidth,
  multiline,

  centerMode,
  onBoxClick = () => {},
  onBlur = () => {},
  onFocus = () => {},
  bgcolor,
  autoComplete,
  ...props
}) => {
  const methods = useFormContext()
  const onlyDisplay = dashed && disabled

  // Custom onKeyDown to restrict unwanted characters
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.target.blur()
    }
    if (type === 'number') {
      const allowedKeys = ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab']

      if (type === 'number') {
        // Prevent unwanted keys except allowed keys
        const invalidKeys = ['e', 'E', '+', '-', '.']
        if (invalidKeys.includes(event.key) && !allowedKeys.includes(event.key)) {
          event.preventDefault()
        }
      }
    }

    // Execute any additional onKeyDown logic provided by props
    if (onKeyDown) {
      onKeyDown(event)
    }
  }

  return (
    <Box
      onClick={onBoxClick}
      width={fullWidth && '100%'}
      sx={
        multiline && {
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            height: 'auto',
            padding: '0',
          },
        }
      }
    >
      {!onlyDisplay && label && <Label required={required}>{label}</Label>}
      <NumericFormat
        disabled={disabled}
        name={name}
        id={name}
        inputRef={inputRef}
        placeholder={placeholder}
        customInput={MuiTextField} // Use MuiTextField as the custom input component
        thousandSeparator={' '}
        allowNegative={false} // Disallow negative numbers
        decimalScale={2} // Set decimal scale to 2
        onValueChange={(values) => {
          const { floatValue } = values // Extract the numeric value
          const newValue = floatValue < 1 ? minNumber : floatValue
          if (uncontrolled) {
            // If uncontrolled, use the provided setValue
            setValue(newValue)
          } else {
            // If controlled, update the form state using react-hook-form's setValue
            methods.setValue(name, newValue, { shouldValidate: true })
          }
        }}
        value={uncontrolled ? value : methods.watch(name)} // Use form state value if controlled
        autoComplete={autoComplete ? autoComplete : name === 'shopType' ? 'off' : 'on'}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton>{endAdornmentText}</IconButton>
            </InputAdornment>
          ),
        }}
        {...(!uncontrolled && methods.register(name, { required }))}
        multiline={multiline}
        onBlur={onBlur}
        onFocus={onFocus}
        rows={4}
        onWheel={(e) => {
          // e.target.blur()
          // e.stopPropagation()
          // setTimeout(() => {
          //   e.target.focus()
          // }, 0)
        }}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        fullWidth={fullWidth}
        error={!!methods?.formState?.errors?.[name]}
        sx={(theme) => ({
          '& .MuiInputAdornment-root': {
            '& > .MuiButtonBase-root': {
              background: 'transparent !important',
              fontSize: '18px !important',
              fontWeight: '500',
              lineHeight: '28px',
              color: theme.palette.bunker[400],
              paddingRight: '12px',
              width: 'auto',
            },
          },
          '& .MuiInputLabel-root.Mui-disabled': {
            fontSize: 22,
            fontFamily: 'Gilroy',
            left: -14,
            top: 8,
            fontWeight: 400,
          },
          '& .MuiOutlinedInput-root': {
            mt: label ? (onlyDisplay ? 3.5 : 1.5) : 0,
            boxShadow: withShadow && '0px 0px 24px rgba(0, 0, 0, 0.08)',
            fontFamily: 'Gilroy',
            fontWeight: 400,
            fontSize: 16,
            lineHeight: '24px',
            borderRadius: borderRadius || '40px',
            color: 'dark.500',
            border: disabled && (dashed ? '2px dashed' : '2px solid'),
            borderColor: disabled && 'gray.300',
            background: '#' + bgcolor || (white && theme.palette.gray[200]) || (disabled && `${theme.palette.gray[100]} !important`),
            p: '0 !important',
            '&:hover': { fieldset: { borderColor: 'gray.200' } },
            fieldset: { borderColor: 'gray.200' },
            '&.Mui-focused fieldset': {
              transition: '0.3s',
              borderColor: methods?.formState?.errors?.[name] ? 'custom.error' : 'primary.main',
              zIndex: name === 'phone' ? 2 : 0,
            },
            '&.Mui-focused': {
              bgcolor: bgcolor ? '#' + bgcolor : !white ? 'background.default' : 'white',
            },
          },
          '& .MuiOutlinedInput-input': {
            textAlign: centerMode ? 'center' : 'left',
            height: 'auto',
            py: centerMode ? 0 : 2,
            pr: centerMode ? 0 : 2,
            pl: centerMode ? 0 : type === 'tel' ? 17 : 2,
            '-webkit-text-fill-color': onlyDisplay && `${theme.palette.gray[600]} !important`,
            '&::placeholder': {
              color: disabled ? 'gray.100' : 'secondary.light',
              fontFamily: 'Gilroy',
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '26px',
              opacity: 1,
            },
          },
          '& .MuiOutlinedInput-input.Mui-disabled': {
            WebkitTextFillColor: theme.palette.gray[600],
          },
          ...sx,
        })}
        {...props}
      />
    </Box>
  )
}

export default NumberFormatInput
