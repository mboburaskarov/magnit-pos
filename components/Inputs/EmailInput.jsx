import { useState } from 'react'
import { Box, ClickAwayListener } from '@mui/material'
import TextField from './TextField'
import Label from '../Label'

const EmailInput = ({ name, required, setValue, label, fullWidth, uncontrolled }) => {
  // const [open, setOpen] = useState(false);
  // const [openDrawer, setOpenDrawer] = useState(false);
  // const { ref, setUnmaskedValue, value } = useIMask({
  //   lazy: true,
  //   placeholderChar: "x",
  // });
  return (
    <>
      <Box position='relative'>
        <TextField dashed required id='filled-required' label={label} defaultValue='Hello World' variant='filled' name={name} />
        {/* <TextField
          fullWidth={fullWidth}
          required={required}
          // inputRef={ref}
          value={value}
          type="email"
          setValue={(e) => {
            setValue(e);
          }}
          uncontrolled={uncontrolled}
        /> */}
      </Box>
    </>
  )
}
export default EmailInput
