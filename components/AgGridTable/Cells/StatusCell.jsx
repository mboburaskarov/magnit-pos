import { Box, Typography } from '@mui/material'

const StatusCell = ({ id, title, bgcolor, color = '#fff' }) => {
  return (
    <Box
      id={id}
      display='flex'
      alignItems='center'
      justifyContent='center'
      minWidth={62}
      py={'6px'}
      px={'12px'}
      minHeight={32}
      bgcolor={bgcolor}
      border={'1px solid'}
      borderColor={color}
      borderRadius={'24px'}
    >
      <Typography color={color} fontSize={'16px'} lineHeight={'20px'} fontWeight={500}>
        {title}
      </Typography>
    </Box>
  )
}

export default StatusCell
