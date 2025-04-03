import { Box, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function EmptyOrderList({ draft }) {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='100%'
      minHeight={424}
      maxHeight='70vh'
      border={`1px dashed ${theme.palette.gray[300]}`}
      borderRadius={8}
      textAlign='center'
      mt={4}
      mb={8}
    >
      {draft ? (
        <Box width='70%'>
          <Typography variant='h1' style={{ fontSize: 24, lineHeight: '28px' }}>
            {t('menu.orders.all.drafts_list_placeholder')}
          </Typography>
        </Box>
      ) : (
        <Box width='70%'>
          <Typography variant='h1' style={{ fontSize: 24, lineHeight: '28px' }}>
            {t('menu.orders.all.orders_list_placeholder')}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
