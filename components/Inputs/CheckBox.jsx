import { useState } from 'react'
import { Box, Checkbox, ClickAwayListener, FormControlLabel } from '@mui/material'

const CheckBox = ({ name, required, setValue, label, fullWidth, uncontrolled }) => {
  return (
    <>
      <Box position='relative'>
        <FormControlLabel
          sx={{ display: 'flex', alignItems: 'center' }}
          control={<Checkbox checked={true} onChange={(handleChange) => {}} name='gilad' />}
          label='Remember Me'
        />
      </Box>
    </>
  )
}
export default CheckBox
