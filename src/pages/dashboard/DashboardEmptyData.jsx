import { Box, Typography } from '@mui/material'

export default function DashboardEmptyData() {
  return (
    <Box
      border='1px solid'
      borderColor='grey.200'
      borderRadius='0 0 12px 12px'
      flexDirection='column'
      width='100%'
      height='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'
      minHeight={400}
      mt={2.5}
      px={2}
    >
      <Typography textAlign='center' fontSize={24} color='green.600' variant='h2'>
        Данные не найдены
      </Typography>
      <Typography mt={1} fontSize={17} lineHeight='18px' textAlign='center'>
        Для просмотра данных начните продавать товары
      </Typography>
    </Box>
  )
}
