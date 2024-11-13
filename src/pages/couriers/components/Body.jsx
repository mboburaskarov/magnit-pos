import { Box } from '@mui/material'
import TextField from '../../../../components/Inputs/TextField'

export default function Body({ state }) {
  return (
    <Box>
      {state?.isCreateDrawerOpen && <TextField fullWidth name='pinfl' placeholder='Введите PINFL' type={'text'} sx={{ mb: 2 }} />}
      <TextField fullWidth name='cardNumber' placeholder='Введите номер карты' type={'text'} />
    </Box>
  )
}
