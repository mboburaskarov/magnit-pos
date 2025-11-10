import ReportBox from '@components/ReportsSection/ReportBox';
import palette from '@/assets/theme/mui.config';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';


function VendorReportsList() {
  const { t } = useTranslation()
  return (
    <Box sx={{ padding: '24px 20px' }}>
      <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap={4}>
        <ReportBox
          title={t('Отчет бонусах продавца')}
          desc={t(
            'Содержит информацию о начисленных бонусах за выполненные продажи. Помогает контролировать мотивацию сотрудников и планировать премиальные выплаты.'
          )}
          to='/reports/seller-bonus'
          checkslug='/reports/vendor'
          color={palette.green[500]}
        />
        <ReportBox
          title={t('Топ продавцы')}
          desc={t('Отчёт отображает продавцов с наивысшими продажами за выбранный период. Помогает определить лучших сотрудников и поощрить активных.')}
          to='/reports/top-vendors'
          checkslug='/reports/vendor'
          color={palette.green[500]}
        />
      </Box>
    </Box>
  )
}

export default VendorReportsList
