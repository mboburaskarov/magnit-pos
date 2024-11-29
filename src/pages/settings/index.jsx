import { Box, Button, Typography } from '@mui/material'
import LoadingContainer from '../../../components/LoadingContainer'
import ComingSoon from '../../../components/ComingSoon'
import i18n from '../../i18n'

export default function SettingsPage() {
  const changeLG = (val) => {
    i18n.changeLanguage(val)
  }
  return (
    <LoadingContainer readyState={true}>
      {/* <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Typography variant='h1'>Настройки</Typography>
        <Box display='flex' mb={3} mt={4}>
          <ComingSoon />
        </Box>
      </Box> */}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button onClick={() => changeLG('ru')}>RUS</Button>
        <Button onClick={() => changeLG('uz')}>UZB</Button>
      </Box>
    </LoadingContainer>
  )
}
