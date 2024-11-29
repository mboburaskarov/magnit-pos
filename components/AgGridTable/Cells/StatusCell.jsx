import { Box, Typography } from '@mui/material'

const StatusCell = ({ id, title, bgcolor, color = '#fff' }) => {
  return (
    <Box
      id={id}
      display='flex'
      alignItems='center'
      justifyContent='center'
      minWidth={62}
      py={'3px'}
      px={'8px'}
      minHeight={26}
      bgcolor={bgcolor}
      borderRadius={'4px'}
    >
      <Typography color={color} fontSize={'16px'} lineHeight={'20px'} fontWeight={500}>
        {title}
      </Typography>
    </Box>
  )
}

export default StatusCell
