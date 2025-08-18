import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReportBox from '../../../../components/ReportsSection/ReportBox'
import palette from '../../../assets/theme/mui.config'
function ClientReportsList() {
  const { t } = useTranslation()
  return (
    <Box sx={{ padding: '24px 20px' }}>
      <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap={4}>
        <ReportBox
          title={t('Отчет карта лояльности')}
          desc={t(
            'Отчёт показывает использование карт лояльности клиентами, предоставленные скидки и начисленные бонусы. Помогает анализировать эффективность программы лояльности.'
          )}
          to='/reports/discount-card-report'
          checkSlug='/reports/client'
          color={palette.indigo[500]}
        />
      </Box>
    </Box>
  )
}

export default ClientReportsList
