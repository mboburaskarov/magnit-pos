import { Box, IconButton, InputAdornment } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import Label from '../Label'
import OutLineTextField from './OutLineTextField'

const PriceFormattedInput = ({
  placeholder,
  inputRef,
  InputProps,
  uncontrolled,
  value,
  setValue,
  sx,
  borderRadius,
  white,
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
  bgcolor,
  autoComplete,
  ...props
}) => {
  const methods = useFormContext()
  const onlyDisplay = dashed && disabled

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
        label={onlyDisplay && label}
        name={name}
        id={name}
        placeholder={placeholder}
        allowLeadingZeros={false}
        thousandSeparator=' ' // 1,000,000 format
        fixedDecimalScale
        customInput={(props) => <OutLineTextField {...props} />}
        getInputRef={inputRef}
        autoComplete={autoComplete ? autoComplete : name === 'shopType' ? 'off' : 'on'}
        {...(!uncontrolled && methods?.register(name, { required }))}
        {...(uncontrolled && {
          value: onlyDisplay && !value ? 'Неопределенный' : value,
          onValueChange: (values) => setValue(values.floatValue || ''), // Raqam faqat float bo'lib qolsin
        })}
        onBlur={onBlur}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        fullWidth={fullWidth}
        sx={{
          '& input': {
            textAlign: centerMode ? 'center' : 'left',
            padding: '10px',
            borderRadius: borderRadius || '40px',
            border: disabled ? '2px dashed gray' : '1px solid gray',
            backgroundColor: white ? 'white' : '#f5f5f5',
          },
          ...sx,
        }}
        {...props}
      />
      {endAdornmentText && (
        <InputAdornment position='end'>
          <IconButton>{endAdornmentText}</IconButton>
        </InputAdornment>
      )}
    </Box>
  )
}

export default PriceFormattedInput
