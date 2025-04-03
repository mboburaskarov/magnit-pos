import { Box, Button } from '@mui/material'
import LoadingContainer from '../../../components/LoadingContainer'
import i18n from '../../i18n'

export default function SettingsPage() {
  const changeLG = (val) => {
    i18n.changeLanguage(val)
  }
  return (
    <LoadingContainer readyState={true}>
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
