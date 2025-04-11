import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { memo, useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SelectSimple from '../Select/SelectSimple'

const useStyles = makeStyles((theme) => ({
  title: {
    width: 228,
    fontWeight: 600,
  },
  root: {
    '& .MuiInputAdornment-root': {
      width: '115px !important',
    },
    '& .MuiInputAdornment-root .MuiTypography-root': {
      color: theme.palette.gray[600],
    },
    '& .MuiInputAdornment-root .MuiTypography-root': {
      color: theme.palette.bunker[400],
      marginRight: '8px',
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
  relative: {
    position: 'relative',
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
  price: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    minWidth: 64,
    height: 32,
    maxHeight: 32,
    borderRadius: 8,
    backgroundColor: theme.palette.gray[200],
    color: theme.palette.gray[600],
    cursor: 'default',
  },
  textfield: {
    '& input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
      appearance: 'none',
      margin: 0,
    },
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
  white: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: `${theme.palette.background.default} !important`,
    },
  },
  secondary: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: `${theme.palette.background.blueGray} !important`,
      borderRadius: ({ inputHeight }) => `${inputHeight === 56 ? 16 : 20}px !important`,
      height: ({ inputHeight }) => `${inputHeight}px !important`,
      '&:hover': {
        backgroundColor: theme.palette.gray[101] + ' !important',
      },
    },
  },
  inputHeight: {
    '& .MuiOutlinedInput-root': {
      borderRadius: ({ borderRadius }) => `${borderRadius} !important `,

      height: ({ inputHeight }) => `${inputHeight}px !important`,
    },
  },
  dashed: {
    '& .MuiInputBase-root': {
      border: `1px dashed ${theme.palette.gray[300]}`,
    },
  },
  solidBorder: {
    '& .MuiInputBase-root': {
      boxShadow: `0 0 0 1px ${theme.palette.gray[300]}`,
      border: 0,
    },
  },
  small: {
    height: 40,
    '& .MuiInputBase-root': {
      height: 40,
    },
    '& input': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '& .Mui-focused': {
      boxShadow: '0 0 0 3px #4993DD',
    },
    '& .Mui-error:not(.Mui-focused)': {
      boxShadow: '0 0 0 3px red',
      border: 'none',
    },
  },
  twoIcons: {
    '& .MuiInputAdornment-positionEnd': {
      width: '125px',
    },
  },
  inputSelect: {
    position: 'absolute',
    right: 4,
    top: 4,
    '& > div > div > div:nth-of-type(1)': {
      width: 150,
      minWidth: 0,
      background: theme.palette.gray[200],
      minHeight: 48,
      height: 48,
    },
    '& > div > div > div:nth-of-type(1):hover': {
      background: theme.palette.gray[200],
    },
    '& > div > div > div:nth-of-type(1) > div:nth-of-type(1)': {
      minHeight: 42,
      height: 42,
    },
  },
  orderedLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    marginRight: 16,
    borderRadius: '50px',
    color: '#fff',
    backgroundColor: '#1F78FF',
  },
  list: {
    '&.MuiOutlinedInput-multiline': {
      alignItems: 'start',
    },
    '&.MuiTextField-root': {
      marginTop: '16px !important',
    },
  },
  height: {
    '& .MuiOutlinedInput-multiline': {
      padding: '20px',
      height: ({ height }) => `${height} !important`,
      alignItems: 'start',
    },
  },
  centered: {
    '& .MuiInputBase-input': {
      textAlign: 'center',
    },
  },
  noHover: {
    '& > div > input': {
      color: theme.palette.gray[600],
    },
    '& > div > textarea': {
      color: theme.palette.gray[600],
    },
    '& > div:hover': {
      background: ({ white }) => (white ? '#fff' : theme.palette.gray[100]),
    },
  },
  customTextColor: {
    '& > div > input': {
      color: ({ customTextColor }) => customTextColor,
    },
    '& > div > textarea': {
      color: ({ customTextColor }) => customTextColor,
    },
  },
  whiteDisabled: {
    '& > div > input': {
      background: theme.palette.background.default,
      borderRadius: 16,
    },
    '& .MuiInputBase-input.Mui-disabled': {
      background: theme.palette.background.default,
      borderRadius: 16,
    },
  },
}))

function InputSimple({
  id,
  error,
  control,
  label,
  placeholder,
  name,
  fullWidth,
  boxStyle,
  type,
  defaultValue,
  adornment,
  adornmentPosition = 'start',
  adornmentClassName = '',
  multiline,
  list,
  rowsMax,
  borderRadius = '40px',
  required = false,
  inputStyles,
  disabled = false,
  uncontrolled = false,
  noMarginTop,
  onChange,
  value = '',
  asteriks,
  autoCompleteOff,
  inputComponent,
  textFieldProps,
  minLength,
  white,
  onBlur,
  dashed,
  selectOptions,
  onSelectChange = () => {},
  selectValue,
  onInput,
  twoIcons,
  inputRef,
  labelOrder,
  solidBorder,
  small,
  mini,
  max,
  centered,
  height,
  noBoxShadow,
  noHover,
  width,
  customTextColor,
  autoFocus,
  onKeyPress,
  onKeyDown,
  InputProps,
  time,
  whiteDisabled,
  secondary,
  inputHeight = 64,
  onFocus,
}) {
  const { t } = useTranslation()
  const classes = useStyles({
    height,
    disabled,
    noBoxShadow,
    white,
    customTextColor,
    inputHeight,
    borderRadius,
  })
  const autoCompleteProps = autoCompleteOff
    ? {
        autocomplete: 'new-password',
        form: {
          autocomplete: 'off',
        },
      }
    : {}
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
            <InputAdornment position='end' className={adornmentClassName}>
              {adornment}
            </InputAdornment>
          ),
        }
    : {}

  const inputProps = {
    InputProps: {
      ...adornmentProps,
      ...autoCompleteProps,
      inputComponent,
      inputProps: textFieldProps,
    },
  }

  const getPatterns = (propType) => {
    switch (propType) {
      case 'email':
        return {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          message: t('components.enter_a_valid_email_address'),
        }
      case 'number':
        return {
          value: /^\d+(\.\d{1,2})?$/,
          message: t('components.enter_only_numbers'),
        }
      case 'subdomen':
        return {
          value: /^[a-zA-Z0-9][a-zA-Z0-9.-]+[a-zA-Z0-9]$/,
          message: t('components.enterValidSubdomen'),
        }
      default:
        return {}
    }
  }

  const handleInputChange = useCallback((e, onValueChange) => {
    if (onChange) {
      onChange(e)
    }
    const numValue = Number(e.target.value.replace(/\s/g, ''))

    // if ((!max || numValue <= max) && !time) {
    //   onValueChange(e.target.value)
    // } else if ((!max || numValue <= max) && time && e.target.value.length < 3) {
    //   onValueChange(e.target.value)
    // } else {
    //   errorNotify(t('toast.error.error_max_price', { max: thousandDivider(max) }), true)
    // }
  }, [])

  return (
    <Box
      width={fullWidth ? '100%' : width || 320}
      className={`${classes.root} ${selectOptions ? classes.relative : ''}`}
      marginTop={!label ? (noMarginTop ? '0' : '21px') : 0}
      sx={boxStyle}
    >
      <Typography className={`${required && label && asteriks ? classes.required : ''}`} variant='h5' mb={!!label ? 2 : 0}>
        {labelOrder && <span className={classes.orderedLabel}>{labelOrder}</span>}
        {t(label)}
      </Typography>

      {!uncontrolled ? (
        <Controller
          name={name}
          render={({ onChange: onValueChange, value: fieldValue }) => (
            <TextField
              id={id || name}
              value={fieldValue}
              type={type || 'text'}
              variant='outlined'
              placeholder={t(placeholder)}
              autoFocus={autoFocus}
              onKeyDown={onKeyDown}
              onKeyPress={onKeyPress}
              fullWidth
              multiline={multiline}
              rows={rowsMax}
              onChange={(e) => handleInputChange(e, onValueChange)}
              onFocus={onFocus}
              {...inputProps}
              style={inputStyles}
              className={`
              ${classes.textfield} 
              ${!label && classes.noMargin} 
              ${multiline && classes.multiline} 
              ${adornment && classes.hasAdornment} 
              ${list && classes.list} 
              ${height && classes.height}               
              ${white && classes.white} 
              ${secondary && classes.secondary} 
              ${noHover && classes.noHover} 
              ${dashed && classes.dashed} 
              ${inputHeight && classes.inputHeight} 
              ${twoIcons && classes.twoIcons} 
              ${customTextColor && classes.customTextColor} 
              ${solidBorder && classes.solidBorder} 
              ${small && classes.small} 
              ${centered && classes.centered} 
              ${whiteDisabled && classes.whiteDisabled}`}
              error={!!error}
              defaultValue={defaultValue ?? 0}
              disabled={disabled}
              onInput={onInput}
              inputRef={inputRef}
              onBlur={(e) => {
                if (time && e.target?.value?.length < 2 && Number(e.target.value) < 10) {
                  onValueChange(`0${e.target.value}`)
                }
                if (time && e.target?.value?.length < 1 && Number(e.target.value) < 1) {
                  onValueChange(`00${e.target.value}`)
                }
                if (onBlur) {
                  onBlur(e)
                }
              }}
            />
          )}
          rules={{
            required: {
              value: required,
              message: label ? t('components.input_empty_error', { label }) : '',
            },
            minLength: minLength || 0,
            pattern: getPatterns(type),
          }}
          control={control}
          defaultValue={defaultValue ?? ''}
        />
      ) : (
        <TextField
          id={id}
          name={name}
          type={type || 'text'}
          variant='outlined'
          placeholder={t(placeholder)}
          fullWidth
          multiline={multiline}
          onFocus={onFocus}
          autoComplete='off'
          rows={rowsMax}
          {...inputProps}
          style={inputStyles}
          InputProps={InputProps || inputProps?.InputProps}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          className={`
              ${classes.textfield} 
              ${!label && classes.noMargin} 
              ${multiline && classes.multiline} 
              ${adornment && classes.hasAdornment} 
              ${list && classes.list} 
              ${height && classes.height} 
              ${white && classes.white}
              ${secondary && classes.secondary}  
              ${noHover && classes.noHover} 
              ${dashed && classes.dashed} 
              ${twoIcons && classes.twoIcons} 
              ${customTextColor && classes.customTextColor} 
              ${solidBorder && classes.solidBorder} 
              ${small && classes.small} 
              ${centered && classes.centered} 
              ${whiteDisabled && classes.whiteDisabled}
              `}
          error={!!error}
          defaultValue={defaultValue ?? ''}
          disabled={disabled}
          onChange={onChange}
          value={value}
          inputRef={inputRef}
          onBlur={(e) => {
            if (onBlur) {
              onBlur(e)
            }
          }}
        />
      )}
      {selectOptions ? (
        <Box className={classes.inputSelect}>
          <SelectSimple onChange={onSelectChange} uncontrolled options={selectOptions} value={selectValue} mini={mini} isClearable={false} />
        </Box>
      ) : (
        ''
      )}
    </Box>
  )
}

export default memo(InputSimple)
