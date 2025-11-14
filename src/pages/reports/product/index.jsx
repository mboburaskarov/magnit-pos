import palette from '@/assets/theme/mui.config'
import ReportBox from '@components/ReportsSection/ReportBox'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

function PoductReportsList() {
  const { t } = useTranslation()
  return (
    <Box sx={{ padding: '24px 20px' }}>
      <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap={4}>
        <ReportBox
          title={t('menu.reports.products')}
          desc={t('menu.reports.products_desc')}
          to='/reports/product-report'
          checkslug='/reports/product'
          color={palette.blue[500]}
        />
        {/* <ReportBox
          title={t('Oтчет LFL')}
          desc={t(
            'Отчёт показывает, какие товары продаются лучше всего. Доступна разбивка по категориям, цветам, размерам и другим характеристикам. Сравнение с прошлым периодом помогает оценить рост или падение продаж.'
          )}
          to='/reports/lfl'
          checkslug='/reports/product'
          color={palette.blue[600]}
        /> */}
        <ReportBox
          title={t('Топ продукты')}
          desc={t('Отчёт отображает самые продаваемые товары за выбранный период. Помогает определить хиты продаж и популярные категории.')}
          to='/reports/top-products'
          checkslug='/reports/product'
          color={palette.blue[600]}
        />
        <ReportBox
          title={t('Бонусные продукты')}
          desc={t(
            'Отчёт показывает товары, предоставленные в качестве бонусов. Помогает отслеживать количество, стоимость и условия предоставления бонусов по заказам.'
          )}
          to='/reports/bonus-products'
          checkslug='/reports/product'
          color={palette.blue[600]}
        />
        <ReportBox
          title={t('Остаток по дате ')}
          desc={t(
            'Отчёт показывает остатки товаров на выбранную дату. Позволяет анализировать доступное количество продукции на складе и контролировать наличие.'
          )}
          to='/reports/product-qty-by-date'
          checkslug='/reports/product'
          color={palette.blue[600]}
        />

        {/* )} */}
      </Box>
    </Box>
  )
}

export default PoductReportsList
