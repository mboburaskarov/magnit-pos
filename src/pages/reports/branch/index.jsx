import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import ReportBox from '../../../../components/ReportsSection/ReportBox';
import palette from '../../../assets/theme/mui.config';


function BranchReportsList() {
  const { t } = useTranslation()
  return (
    <Box sx={{ padding: '24px 20px' }}>
      <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap={4}>
        <ReportBox
          title={t('Отчет филиала')}
          desc={t('Сравнение продаж филиалов за одинаковые периоды. Помогает выявить точки роста и слабые места в розничной сети.')}
          to='/reports/store-report'
          checkslug='/reports/branch'
          color={palette.red[500]}
        />
        <ReportBox
          title={t('Топ филиалам')}
          desc={t('Отчёт показывает филиалы с наибольшими продажами за выбранный период. Помогает определить лидеров и сравнить эффективность разных точек.')}
          to='/reports/top-branchs'
          checkslug='/reports/branch'
          color={palette.red[500]}
        />
        <ReportBox
          title={t('Остаток Аптека')}
          desc={t('Отчёт показывает текущие остатки товаров в выбранной аптеке. Помогает контролировать наличие и своевременно пополнять запасы.')}
          to='/reports/store-summary'
          checkslug='/reports/branch'
          color={palette.red[500]}
        />
      </Box>
    </Box>
  )
}

export default BranchReportsList
