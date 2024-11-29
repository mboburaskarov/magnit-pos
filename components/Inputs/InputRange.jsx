import { useState, useEffect } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { NumberFormatBase } from 'react-number-format'
import Label from '../Label'

const InputRangeComponent = ({ value, id, placeholder, allowNegative, blurHandler, name, onChange, right, ...rest }) => {
  return (
    <Box sx={{ position: 'relative', display: 'flex', width: '100%' }}>
      <NumberFormatBase
        name={name}
        id={id}
        value={value}
        onValueChange={onChange}
        customInput={TextField}
        thousandSeparator=' '
        variant='outlined'
        isNumericString
        placeholder={placeholder}
        fullWidth
        allowNegative={allowNegative}
        onBlur={blurHandler}
        sx={{
          margin: 0,
          '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0,
          },
          '& .MuiInputBase-root': {
            borderRadius: right ? '0 40px 40px 0' : '40px 0 0 40px',
          },
          '& input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
            appearance: 'none',
            margin: 0,
          },
        }}
        {...rest}
      />
    </Box>
  )
}

function InputRange({
  placeholder1,
  placeholder2,
  name1,
  name2,
  id,
  uncontrolled,
  allowNegative = false,
  value: initialValue,
  required,
  blurHandler,
  deleteLabel,
  label,
  deleteLabelClick,
  boxStyle,
  fullWidth,
}) {
  const methods = useFormContext()
  const [value, setValue] = useState({ min_price: '', max_price: '' })

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Box width={fullWidth && '100%'} {...boxStyle}>
      <Box flexDirection='column' display='flex' justifyContent='space-between'>
        <Label mb={1} required={required}>
          {label}
        </Label>
        {deleteLabel && (
          <Typography onClick={deleteLabelClick} style={{ color: '#EB5757', cursor: 'pointer' }} variant='h5'>
            {deleteLabel}
          </Typography>
        )}
        {uncontrolled ? (
          <Box sx={{ position: 'relative', display: 'flex', width: '100%' }}>
            <InputRangeComponent
              value={value?.min_price === 0 ? '' : value?.min_price}
              id={`${id}-0`}
              placeholder={placeholder1}
              allowNegative={allowNegative}
              blurHandler={blurHandler}
              name={name1}
              required={required}
              onValueChange={(v) => setValue((state) => ({ ...state, min_price: parseInt(v.value) }))}
            />
            <Box sx={{ width: 2, background: 'gray.200' }} />
            <InputRangeComponent
              value={value?.max_price === 0 ? '' : value?.max_price}
              id={`${id}-1`}
              placeholder={placeholder2}
              allowNegative={allowNegative}
              blurHandler={blurHandler}
              name={name2}
              required={required}
              onValueChange={(v) => setValue((state) => ({ ...state, max_price: parseInt(v.value) }))}
              right
            />
          </Box>
        ) : (
          <Box sx={{ position: 'relative', display: 'flex', width: '100%' }}>
            <Controller
              render={({ field: { onChange: onControllerChange, value }, ...rest }) => (
                <InputRangeComponent
                  value={value}
                  id={`${id}-0`}
                  placeholder={placeholder1}
                  allowNegative={allowNegative}
                  blurHandler={blurHandler}
                  name={name1}
                  onValueChange={(v) => onControllerChange(v.value)}
                  {...rest}
                />
              )}
              name={name1}
              variant='outlined'
              control={methods.control}
              defaultValue=''
              required={required}
            />
            {/* <Box sx={{ width: 2, background: 'gray.200' }} /> */}
            <Controller
              render={({ field: { onChange: onControllerChange, value }, ...rest }) => (
                <InputRangeComponent
                  value={value}
                  id={`${id}-1`}
                  placeholder={placeholder2}
                  allowNegative={allowNegative}
                  blurHandler={blurHandler}
                  name={name1}
                  onValueChange={(v) => onControllerChange(v.value)}
                  right
                  {...rest}
                />
              )}
              name={name2}
              variant='outlined'
              control={methods.control}
              defaultValue=''
              required={required}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default InputRange
