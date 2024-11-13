import { Box, TextField, Typography, InputAdornment } from '@mui/material'
import { Controller } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { makeStyles } from '@mui/styles'
import SelectSimple from '../Select/SelectSimple'

const useStyles = makeStyles((theme) => ({
  title: {
    width: 228,
    fontWeight: 600,
  },
  root: {
    '& > div > div > input': {
      textAlign: ({ centerMode }) => centerMode && 'center',
      padding: ({ centerMode }) => centerMode && '0px !important',
    },
    '& .MuiInputAdornment-root .MuiTypography-root': {
      color: theme.palette.grey[600],
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
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[600],
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
      backgroundColor: theme.palette.background.default,
    },
  },
  dashed: {
    '& .MuiInputBase-root': {
      border: `1px dashed ${theme.palette.grey[300]}`,
    },
  },
  inputSelect: {
    position: 'absolute',
    right: 4,
    top: 4,
    '& > div > div > div:nth-of-type(1)': {
      width: 150,
      minWidth: 0,
      background: theme.palette.grey[200],
      minHeight: 48,
      height: 48,
    },
    '& > div > div > div:nth-of-type(1):hover': {
      background: theme.palette.grey[200],
    },
    '& > div > div > div:nth-of-type(1) > div:nth-of-type(1)': {
      minHeight: 42,
      height: 42,
    },
  },
}))

function InputSimpleWithMask({
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
  rowsMax,
  required = false,
  inputStyles,
  disabled = false,
  uncontrolled = false,
  asteriks,
  maskChar = '',
  mask,
  autoCompleteOff,
  inputComponent,
  textFieldProps,
  white,
  onBlur,
  dashed,
  selectOptions,
  onSelectChange = () => {},
  selectValue,
  centerMode,
  id,
}) {
  const classes = useStyles({ centerMode })
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
          message: 'Enter a valid e-mail address',
        }
      case 'number':
        return {
          value: /^\d+(\.\d{1,2})?$/,
          message: 'Enter only numbers',
        }
      default:
        return {}
    }
  }

  return (
    <Box width={fullWidth ? '100%' : 320} className={`${classes.root} ${selectOptions ? classes.relative : ''}`} mt={label ? '21px' : 0} {...boxStyle} id={id}>
      <Typography className={`${classes.label} ${required && label && asteriks ? classes.required : ''}`} variant='h5'>
        {label}
      </Typography>
      {!uncontrolled ? (
        <Controller
          name={name}
          mask={mask}
          as={
            <InputMask
              maskChar={maskChar}
              disabled={disabled}
              onBlur={(e) => {
                if (onBlur) {
                  onBlur(e)
                }
              }}
            >
              {(props) => (
                <TextField
                  {...props}
                  id={name}
                  type={type || 'text'}
                  variant='outlined'
                  placeholder={placeholder}
                  fullWidth
                  multiline={multiline}
                  rows={rowsMax}
                  {...inputProps}
                  style={inputStyles}
                  className={`${classes.textfield} ${!label && classes.noMargin} ${multiline && classes.multiline} ${adornment && classes.hasAdornment} ${
                    white && classes.white
                  } ${dashed && classes.dashed} `}
                  error={!!error}
                  defaultValue={defaultValue ?? ''}
                />
              )}
            </InputMask>
          }
          rules={{
            required,
            pattern: getPatterns(type),
          }}
          control={control}
          defaultValue={defaultValue ?? ''}
        />
      ) : (
        <InputMask
          maskChar={maskChar}
          mask={mask}
          disabled={disabled}
          onBlur={(e) => {
            if (onBlur) {
              onBlur(e)
            }
          }}
        >
          {(props) => (
            <TextField
              {...props}
              id={name}
              type={type || 'text'}
              variant='outlined'
              placeholder={placeholder}
              fullWidth
              multiline={multiline}
              rows={rowsMax}
              {...inputProps}
              style={inputStyles}
              className={`${classes.textfield} ${!label && classes.noMargin} ${multiline && classes.multiline} ${adornment && classes.hasAdornment} ${
                white && classes.white
              } ${dashed && classes.dashed} `}
              error={!!error}
              defaultValue={defaultValue ?? ''}
            />
          )}
        </InputMask>
      )}
      {selectOptions ? (
        <Box className={classes.inputSelect}>
          <SelectSimple onChange={onSelectChange} uncontrolled options={selectOptions} value={selectValue} menuIsOpen />
        </Box>
      ) : (
        ''
      )}
    </Box>
  )
}

export default InputSimpleWithMask
