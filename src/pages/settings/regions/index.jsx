import { Box, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import ComingSoon from '../../../../components/ComingSoon'

export default function RegionsPage() {
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Typography variant='h1'>Регионы</Typography>
        <Box display='flex' mb={3} mt={4}>
          <ComingSoon />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
