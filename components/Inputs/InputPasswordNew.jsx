import { useState } from 'react'
import { Box, TextField, InputAdornment } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import ShowPasswordIcon from '../../src/assets/icons/ShowPasswordIcon'
import HidePasswordIcon from '../../src/assets/icons/HidePasswordIcon'
import Label from '../Label'

const useStyles = makeStyles(() => ({
  adornment: {
    width: 56,
    height: 56,
    cursor: 'pointer',
    maxHeight: 56,
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMargin: {
    marginTop: 0,
  },
  noLabel: {},
}))

function InputPassword({
  label,
  placeholder,
  name,
  fullWidth,
  boxStyle,
  defaultValue,
  multiline,
  rowsMax,
  disabled,
  required = true,
  onKeyDown,
  password,
  autoComplete = 'off',
  noLabel,
  secondary,
  height = 56,
  minLength,
  defaultState = false,
}) {
  const classes = useStyles({ height })
  const [showPassword, setShowPassword] = useState(defaultState)
  const methods = useFormContext()

  return (
    <Box width={fullWidth ? '100%' : 320} sx={{ p: 0, m: 0 }} mt={!label && 2} {...boxStyle}>
      {label && (
        <Label mb={1.5} required={required}>
          {label}
        </Label>
      )}

      <TextField
        {...methods?.register(name, { required: required })}
        name={name}
        id={name}
        type={showPassword ? 'text' : 'password'}
        variant='outlined'
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={onKeyDown}
        fullWidth
        multiline={multiline}
        rows={rowsMax}
        error={!!methods?.formState?.errors?.[name]}
        InputProps={{
          endAdornment: (
            <InputAdornment className={classes.adornment} onClick={() => setShowPassword(!showPassword)} position='end'>
              {showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-adornedEnd': {
            padding: 0,
          },
          '& .Mui-error:not(.Mui-focused)': {
            border: '0 0 0 2px red',
          },

          '& .MuiOutlinedInput-root': {
            height: secondary && `${height}px !important`,
            borderRadius: secondary && `${height === 56 ? 16 : 20}px !important`,
          },
          mt: !label && 0,
        }}
        className={`${noLabel && classes.noLabel}`}
        defaultValue={defaultValue || ''}
        rules={{
          required,
          minLength: {
            value: minLength,
            message: `('components.min_length', ${minLength})`,
          },
          validate: (value) => {
            if (password) {
              return password?.current === value || password === value || `('components.passwordNotMatch')`
            }
          },
        }}
      />
    </Box>
  )
}

export default InputPassword
