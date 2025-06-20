import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReportBox from '../../../../components/ReportsSection/ReportBox'
import palette from '../../../assets/theme/mui.config'
function VendorReportsList() {
  const { t } = useTranslation()
  return (
    <Box sx={{ padding: '24px 16px' }}>
      <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap={4}>
        <ReportBox
          title={t('Отчет бонусах продавца')}
          desc={t(
            'Содержит информацию о начисленных бонусах за выполненные продажи. Помогает контролировать мотивацию сотрудников и планировать премиальные выплаты.'
          )}
          to='/reports/seller-bonus'
          checkSlug='/reports/vendor'
          color={palette.green[500]}
        />
      </Box>
    </Box>
  )
}

export default VendorReportsList
