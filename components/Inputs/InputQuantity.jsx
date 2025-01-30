import { Box, TextField, Typography, InputAdornment } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { set } from 'lodash'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import Label from '../Label'

const useStyles = makeStyles((theme) => ({
  title: {
    width: 228,
    fontWeight: 600,
  },
  root: {
    '& .MuiInputAdornment-root .MuiTypography-root': {
      color: theme.palette.gray[600],
    },
    '& .MuiInputBase-root': {
      height: 48,
      backgroundColor: theme.palette.background.default,
      border: `2px solid ${theme.palette.bunker[100]}`,
    },
    '& .price': {
      justifyContent: 'center',
      alignItems: 'center',
      width: 64,
      minWidth: 64,
      height: 48,
      maxHeight: 48,
      borderRadius: 12,
      backgroundColor: theme.palette.gray[200],
      color: theme.palette.gray[600],
      cursor: 'default',
    },
  },
  noMargin: {
    marginTop: 0,
  },
  multiline: {
    height: 'auto',
    marginTop: '4px !important',
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
      color: theme.palette.gray[400],
      textAlign: 'center',
      background: `url('/images/input-arrows.svg') no-repeat 100% 50%`,
      width: 10,
      height: 32,
      position: 'relative',
      right: 12,
      opacity: 1,
    },
  },
  applyAll: {
    position: 'absolute',
    top: 0,
    right: 15,
    zIndex: 9,
    backgroundColor: theme.palette.orange[500],
    color: theme.palette.white,
    padding: '2px 8px',
    borderRadius: 10,
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
  uncontrolled = false,
  inputStyles,
  inputRef,
  disabled = false,
  canApplyAll = true,
  onChange,
  value,
  id,
  max,
  applyAll,
  aplyAllFunc = () => {},
  onFocus = () => {},
  maxErrorMessage,
  name,
  onBlur = () => {},
}) {
  const methods = useFormContext()
  // Custom onKeyDown to restrict unwanted characters
  const handleKeyDown = (event) => {
    if (type === 'number') {
      // Prevent unwanted keys
      const invalidKeys = ['e', 'E', '+', '-', '.']
      if (invalidKeys.includes(event.key)) {
        event.preventDefault()
      }
    }

    // Execute any additional onKeyDown logic provided by props
    if (onKeyDown) {
      onKeyDown(event)
    }
  }
  const classes = useStyles()
  const [isApplyAll, setApplyAll] = useState(false)
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
      {label && <Label required={required}>{label}</Label>}
      {applyAll && isApplyAll && (
        <Box
          onClick={() => {
            aplyAllFunc(), setApplyAll(false)
          }}
          className={classes.applyAll}
        >
          Применить ко всем
        </Box>
      )}
      <TextField
        id={id}
        name={name}
        inputRef={inputRef}
        type={type || 'text'}
        variant='outlined'
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        fullWidth={fullWidth}
        multiline={multiline}
        // onFocus={(e) => setApplyAll(true)}
        autoComplete='off'
        {...(!uncontrolled && methods?.register(name, { required }))}
        {...(uncontrolled && {
          onChange: (e) => {
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
          },
          onBlur: (e) => {
            onBlur(e)
          },
        })}
        {...(!uncontrolled && {
          onBlur: (e) => {
            setTimeout(() => {
              setApplyAll(false)
            }, 200)
            onBlur(e)
          },
          onFocus: (e) => {
            canApplyAll && setApplyAll(true)
            onFocus(e)
          },
        })}
        rows={rowsMax}
        {...inputProps}
        style={{
          ...inputStyles,
          width: fullWidth ? '100%' : `calc(74px +  ${String(value || 1).length ? String(value || 1).length * 10 : 0}px)`,
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
