import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReportBox from '../../../../components/ReportsSection/ReportBox'
import palette from '../../../assets/theme/mui.config'
function PoductReportsList() {
  const { t } = useTranslation()
  return (
    <Box sx={{ padding: '24px 16px' }}>
      <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap={4}>
        <ReportBox
          title={t('menu.reports.products')}
          desc={t('menu.reports.products_desc')}
          to='/reports/product-report'
          checkSlug='/reports/product'
          color={palette.blue[500]}
        />
        {/* {!shopTransactionRoute && ( */}
        <ReportBox
          title={t('Oтчет LFL')}
          desc={t(
            'Отчёт показывает, какие товары продаются лучше всего. Доступна разбивка по категориям, цветам, размерам и другим характеристикам. Сравнение с прошлым периодом помогает оценить рост или падение продаж.'
          )}
          to='/reports/lfl'
          checkSlug='/reports/product'
          color={palette.blue[600]}
        />
        {/* )} */}
      </Box>
    </Box>
  )
}

export default PoductReportsList
