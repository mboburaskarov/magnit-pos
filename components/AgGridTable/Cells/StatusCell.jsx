import { Box } from '@mui/material'

const StatusCell = ({ id, title, bgcolor }) => {
  return (
    <Box id={id} display='flex' alignItems='center' justifyContent='center' width={128} height={32} bgcolor={bgcolor} borderRadius={3} color='#fff'>
      {title}
    </Box>
  )
}

export default StatusCell
