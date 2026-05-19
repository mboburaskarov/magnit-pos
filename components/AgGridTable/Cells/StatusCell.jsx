import { Box, Typography } from '@mui/material'

const StatusCell = ({ id, title, bgcolor, color = '#fff' }) => {
  return (
    <Box
      id={id}
      display='flex'
      alignItems='center'
      justifyContent='center'
      minWidth={62}
      py={'2px'}
      px={'8px'}
      minHeight={20}
      bgcolor={bgcolor}
      border={'1px solid'}
      borderColor={color}
      borderRadius={2}
    >
      <Typography color={color} fontSize={13}>
        {title}
      </Typography>
    </Box>
  )
}

export default StatusCell
