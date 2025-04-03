import { useState } from 'react'
import { Box, ClickAwayListener } from '@mui/material'
import TextField from './TextField'
import Label from '../Label'

const EmailInput = ({ name, required, setValue, label, fullWidth, uncontrolled }) => {
  return (
    <>
      <Box position='relative'>
        <TextField dashed required id='filled-required' label={label} defaultValue='Hello World' variant='filled' name={name} />
      </Box>
    </>
  )
}
export default EmailInput
