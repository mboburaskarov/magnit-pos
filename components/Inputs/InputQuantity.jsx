import { Box, TextField, Typography, InputAdornment } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  title: {
    width: 228,
    fontWeight: 600,
  },
  root: {
    '& .MuiInputAdornment-root .MuiTypography-root': {
      color: theme.palette.grey[600],
    },
    '& .MuiInputBase-root': {
      height: 48,
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.grey[300]}`,
    },
    '& .price': {
      justifyContent: 'center',
      alignItems: 'center',
      width: 64,
      minWidth: 64,
      height: 48,
      maxHeight: 48,
      borderRadius: 12,
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.grey[600],
      cursor: 'default',
    },
  },
  noMargin: {
    marginTop: 0,
  },
  multiline: {
    height: 'auto',
  },
  hasAdornment: {
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: 0,
    },
  },
  textfield: {
    height: 48,
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      cursor: 'pointer',
      display: 'block',
      color: theme.palette.grey[400],
      textAlign: 'center',
      background: `url('/images/input-arrows.svg') no-repeat 100% 50%`,
      width: 10,
      height: 32,
      position: 'relative',
      right: 12,
      opacity: 1,
    },
  },
}))

function InputQuantity({
  error,
  label,
  placeholder,
  fullWidth,
  boxStyle,
  type = 'number',
  defaultValue,
  adornment,
  adornmentPosition = 'start',
  adornmentClassName = '',
  multiline,
  rowsMax,
  required = false,
  inputStyles,
  inputRef,
  disabled = false,
  onChange,
  value,
  id,
  max,
  maxErrorMessage,
  name,
}) {
  const classes = useStyles()
  const adornmentProps = adornment
    ? adornmentPosition === 'start'
      ? {
          startAdornment: (
            <InputAdornment position='start' className={adornmentClassName}>
              {adornment}
            </InputAdornment>
          ),
        }
      : {
          endAdornment: (
            <InputAdornment position='end' disablePointerEvents className={adornmentClassName}>
              {adornment}
            </InputAdornment>
          ),
        }
    : {}

  const inputProps = {
    InputProps: {
      ...adornmentProps,
      inputProps: {
        min: 1,
        max,
        lang: 'en',
        pattern: '[0-9]+([.,][0-9]+)?',
      },
    },
  }

  return (
    <Box className={classes.root} {...boxStyle}>
      <Typography className={classes.label} variant='h5'>
        {label}
      </Typography>
      <TextField
        id={id}
        name={name}
        inputRef={inputRef}
        type={type || 'text'}
        variant='outlined'
        placeholder={placeholder}
        fullWidth={fullWidth}
        multiline={multiline}
        autoComplete='off'
        onChange={(e) => {
          const val = Number(e.target.value)
          if (max) {
            if (val <= max) {
              onChange(e)
            } else {
              if (maxErrorMessage) {
                maxErrorMessage(max)
              }
              onChange({
                target: {
                  value: max,
                },
              })
            }
          } else {
            onChange(e)
          }
        }}
        onBlur={(e) => {
          if (e.target.value === '') {
            onChange({
              ...e,
              target: {
                ...e.target,
                value: 0,
              },
            })
          }
        }}
        rows={rowsMax}
        {...inputProps}
        style={{
          ...inputStyles,
          width: `calc(74px +  ${String(value || 1).length ? String(value || 1).length * 10 : 0}px)`,
        }}
        className={`${classes.textfield} ${!label && classes.noMargin} ${multiline && classes.multiline} ${adornment && classes.hasAdornment}`}
        error={!!error}
        defaultValue={defaultValue ?? ''}
        disabled={disabled}
        InputProps={{ ...adornmentProps }}
        inputProps={inputProps?.InputProps?.inputProps}
        required={required || false}
        value={value}
      />
    </Box>
  )
}

export default InputQuantity
