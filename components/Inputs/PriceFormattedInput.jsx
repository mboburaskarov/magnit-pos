import { Box, TextField, Typography, InputAdornment } from '@mui/material'
import { Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { error as errorNotify } from '../../utils/toast'
import thousandDivider from '../../utils/thousandDivider'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  title: {
    width: 228,
    fontWeight: 600,
  },
  root: {
    '& .MuiInputAdornment-root .MuiTypography-root': {
      color: theme.palette.gray[600],
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
  noMargin: {
    marginTop: 0,
  },
  multiline: {
    height: 'auto',
  },
  hasAdornment: {
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: '0 !important',
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
    color: theme.palette.gray[400],
    cursor: 'default',
  },
  dashed_price: {
    marginRight: 3,
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
  dashed: {
    '& .MuiInputBase-root': {
      border: `1px dashed ${theme.palette.gray[300]}`,
    },
  },
  grayAdornment: {
    '& .MuiInputAdornment-root': {
      background: theme.palette.gray[200],
      width: 64,
      maxHeight: 48,
      borderRadius: 12,
    },
  },
  backgroundColor: {
    '& .MuiOutlinedInput-root': {
      background: theme.palette.white,
    },
  },
  solidBorder: {
    '& .MuiInputBase-root': {
      boxShadow: `0 0 0 1px ${theme.palette.gray[300]} !important`,
      border: 0,
    },
  },
  white: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.gray[600],
    },
    '& > div > input': {
      color: theme.palette.gray[600],
      '-webkit-text-fill-color': theme.palette.gray[600] + ' !important',
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
  height: {
    '& .MuiOutlinedInput-root': {
      padding: '0px',
      height: ({ height }) => `${height}px !important`,
      alignItems: 'center',
      '& > input': {
        padding: '10px',
      },
    },
  },
}))

function InputFormattedPrice({
  id,
  error,
  control,
  label,
  noLabel,
  placeholder,
  name,
  fullWidth,
  boxStyle,
  defaultValue,
  value,
  adornment,
  adornmentPosition = 'start',
  adornmentClassName = '',
  required = false,
  disabled = false,
  asteriks,
  autoCompleteOff,
  inputComponent,
  allowNegative = false,
  setSiblingValues,
  uncontrolled,
  height,
  noHover,
  dashed,
  transparentAdornment = true,
  backgroundColor,
  deleteLabel,
  deleteLabelClick,
  max,
  small,
  white,
  width,
  solidBorder,
  onBlur,
  onChange,
  onKeyDown,
  inputRef,
  hint,
}) {
  const { t } = useTranslation()
  const classes = useStyles({ white, height })
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
            <InputAdornment
              position='end'
              className={`${adornmentClassName} 
              ${dashed && classes.dashed_price}`}
            >
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
    },
  }

  return (
    <Box width={fullWidth ? '100%' : width || 320} className={classes.root} mt={label ? '0' : noLabel ? '0' : '21px'} {...boxStyle}>
      <Box display='flex' justifyContent={hint ? 'flex-start' : 'space-between'} alignItems={'center'} sx={{ mb: label ? 2 : 0 }}>
        <Typography className={`${required && label && asteriks ? classes.required : ''}`} variant='h5'>
          {t(label)}
        </Typography>
        {hint && (
          <Box ml={1} height={18}>
            s
          </Box>
        )}
        {deleteLabel && (
          <Typography onClick={deleteLabelClick} style={{ color: '#EB5757', cursor: 'pointer' }} className={classes.deleteLabel} variant='h5'>
            {deleteLabel}
          </Typography>
        )}
      </Box>
      {uncontrolled ? (
        <NumericFormat
          id={id || name}
          value={value === 0 ? '' : value}
          customInput={TextField}
          inputRef={inputRef}
          thousandSeparator=' '
          variant='outlined'
          isNumericString
          placeholder={t(placeholder)}
          required={required}
          name={name}
          max={max}
          isAllowed={(values) => {
            const { formattedValue, floatValue } = values
            if (max) {
              if (formattedValue === '' || floatValue <= max) return true

              return errorNotify(t('toast.error.error_max_price', { max: thousandDivider(max) }), true)
            } else {
              return true
            }
          }}
          error={!!error}
          defaultValue={defaultValue ?? ''}
          disabled={disabled}
          {...inputProps}
          onValueChange={(v) => onChange(v.value)}
          fullWidth={fullWidth}
          className={`${classes.textfield}${solidBorder && classes.solidBorder}  ${height && classes.height} ${white && classes.white}  ${
            !label && classes.noMargin
          } ${adornment && classes.hasAdornment} ${dashed && classes.dashed} ${noHover && classes.noHover}${small && classes.small}  ${
            transparentAdornment ? '' : classes.grayAdornment
          }${backgroundColor ? classes.backgroundColor : ''} `}
          onKeyDown={onKeyDown}
          onBlur={(event) => {
            if (setSiblingValues) {
              setSiblingValues(event.target.value)
            }
            if (onBlur) {
              onBlur(event)
            }
          }}
          allowNegative={allowNegative}
        />
      ) : (
        <Controller
          render={({ onChange, value, ...rest }) => (
            <NumericFormat
              {...rest}
              id={id || name}
              value={value === 0 ? '' : value}
              customInput={TextField}
              thousandSeparator=' '
              variant='outlined'
              isNumericString
              placeholder={t(placeholder)}
              required={required}
              name={name}
              inputRef={inputRef}
              max={max}
              isAllowed={(values) => {
                const { formattedValue, floatValue } = values

                if (max) {
                  if (formattedValue === '' || floatValue <= max) return true

                  return errorNotify(
                    t('toast.error.error_max_price', {
                      max: thousandDivider(max),
                    }),
                    true
                  )
                } else {
                  return true
                }
              }}
              onKeyDown={onKeyDown}
              error={!!error}
              defaultValue={defaultValue ?? ''}
              disabled={disabled}
              {...inputProps}
              onValueChange={(v) => onChange(v.value)}
              fullWidth={fullWidth}
              className={`${classes.textfield}${solidBorder && classes.solidBorder}  ${height && classes.height} ${white && classes.white}  ${
                !label && classes.noMargin
              } ${adornment && classes.hasAdornment} ${dashed && classes.dashed} ${noHover && classes.noHover}${small && classes.small}  ${
                transparentAdornment ? '' : classes.grayAdornment
              }${backgroundColor ? classes.backgroundColor : ''} `}
              onBlur={(event) => {
                if (setSiblingValues) {
                  setSiblingValues(event.target.value)
                }
                if (onBlur) {
                  onBlur(event)
                }
              }}
              allowNegative={allowNegative}
            />
          )}
          placeholder={t(placeholder)}
          name={name}
          variant='outlined'
          rules={{
            required,
          }}
          control={control}
          defaultValue={defaultValue ?? ''}
        />
      )}
    </Box>
  )
}
export default memo(InputFormattedPrice)
