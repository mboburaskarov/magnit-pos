import { useState } from 'react'
import { Box, TextField, InputAdornment, FilledInput, IconButton, FormControl, InputLabel } from '@mui/material'
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
  noLabel: {
    marginTop: 20,
  },
  passInput: {
    '& input': {
      paddingTop: '17px !important',
      paddingBottom: '7px !important',
      paddingLeft: '16px !important',
    },
  },
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
}) {
  const classes = useStyles({ height })
  const [showPassword, setShowPassword] = useState(false)
  const methods = useFormContext()

  return (
    <Box width={fullWidth ? '100%' : 320} sx={{ p: 0 }} mt={!label && 2} {...boxStyle}>
      <FormControl sx={{ m: 1, width: '25ch' }} variant='filled'>
        <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
        <FilledInput
          {...methods?.register(name, { required: required })}
          name={name}
          id={name}
          type={showPassword ? 'text' : 'password'}
          variant='outlined'
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          onKeyDown={onKeyDown}
          className={classes.passInput}
          fullWidth
          multiline={multiline}
          rows={rowsMax}
          error={!!methods?.formState?.errors?.[name]}
          endAdornment={
            <InputAdornment position='end'>
              <InputAdornment className={classes.adornment} onClick={() => setShowPassword(!showPassword)} position='end'>
                {showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
              </InputAdornment>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  )
}

export default InputPassword
