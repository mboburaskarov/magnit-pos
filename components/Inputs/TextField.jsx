import { Box, TextField as MuiTextField } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import Label from '../Label'

const TextField = ({
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
  withShadow,
  autoFocus,
  required = false,
  name,
  type,
  defaultValue,
  label,
  disabled,
  dashed,
  fullWidth,
  multiline,
  centerMode,
  onBoxClick = () => {},
  onFocus = () => {},
  onBlur = () => {},
  bgcolor,
  autoComplete,
  ...props
}) => {
  const methods = useFormContext()
  const onlyDisplay = dashed && disabled
  return (
    <Box onClick={onBoxClick} width={fullWidth && '100%'}>
      {!onlyDisplay && label && <Label required={required}>{label}</Label>}
      <MuiTextField
        disabled={disabled}
        label={onlyDisplay && label}
        name={name}
        id={name}
        type={type || 'text'}
        onFocus={onFocus}
        onBlurCapture={onBlur}
        placeholder={placeholder}
        inputRef={inputRef}
        autoComplete={autoComplete ? autoComplete : name === 'shopType' ? 'off' : 'on'}
        InputProps={InputProps}
        {...(!uncontrolled && methods?.register(name, { required }))}
        {...(uncontrolled && {
          value: onlyDisplay && !value ? 'Неопределенный' : value,
          onChange: (e) => setValue(e.target.value),
        })}
        multiline={multiline}
        defaultValue={defaultValue}
        rows={4}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        error={!!methods?.formState?.errors?.[name]}
        sx={(theme) => ({
          '& .MuiInputLabel-root.Mui-disabled': {
            fontSize: 22,
            fontFamily: 'Gilroy',
            left: -14,
            top: 8,
            fontWeight: 400,
          },
          '& .MuiOutlinedInput-root': {
            mt: label ? (onlyDisplay ? 3.5 : '4px') : 0,
            boxShadow: withShadow && '0px 0px 24px rgba(0, 0, 0, 0.08)',
            fontFamily: 'Gilroy',
            fontWeight: 400,
            fontSize: 18,
            lineHeight: '24px',
            borderRadius: borderRadius || '40px',
            color: 'dark.500',
            border: disabled && (dashed ? '2px dashed' : '2px solid'),
            borderColor: disabled && 'gray.300',
            background: '#' + bgcolor || (white && theme.palette.gray[200]) || (disabled && `${theme.palette.gray[100]} !important`),
            p: '0 !important',
            '&:hover': {
              bgcolor: 'bg.10',

              fieldset: { borderColor: 'gray.200' },
            },
            fieldset: { borderColor: 'gray.200' },
            '&.Mui-focused fieldset': {
              transition: '0.3s',
              borderColor: methods?.formState?.errors?.[name] ? 'custom.error' : 'primary.main',
              zIndex: name === 'phone' ? 2 : 0,
            },
            '&.Mui-focused': {
              bgcolor: bgcolor ? '#' + bgcolor : !white ? 'background.gray' : 'background.gray',
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
              fontSize: 18,
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

export default TextField
