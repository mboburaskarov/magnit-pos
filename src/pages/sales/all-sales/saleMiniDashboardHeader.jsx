import { Box, Grid, Typography } from '@mui/material';
import thousandDivider from '@utils/thousandDivider';
import { get } from 'lodash';


const PaymentTypeBox = ({ pay }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'white', borderRadius: '16px', p: '20px', height: '92px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '14px', fontWeight: '500', lineHeight: '20px', color: 'bunker.500' }}>{get(pay, 'title')}</Typography>
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: '500',
          lineHeight: '16px',
          color: 'bunker.500',
          bgcolor: 'bunker.100',
          borderRadius: '16px',
          padding: '3px 8px 1px 8px',
          ml: '4px',
        }}
      >
        {thousandDivider(get(pay, 'count'), 'шт')}
      </Typography>
    </Box>
    <Typography
      sx={{
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '28px',
        color: get(pay, 'sum_prop') == 'total_transaction_sum' ? 'orange.500' : 'dark.500',
        mt: '4px',
      }}
    >
      {thousandDivider(get(pay, 'amount'), 'сум')}
    </Typography>
  </Box>
)
function SaleMiniDashboardHeader({ saleStatsData }) {
  const mockData = [
    { sum_prop: 'total_transaction_sum', title: 'Транзакции', count_prop: 'total_transaction' },
    { sum_prop: 'total_cash_sum', title: 'Наличные', count_prop: 'total_cash_count' },
    { sum_prop: 'total_uzcard_sum', title: 'UzCard', count_prop: 'total_uzcard_count' },
    { sum_prop: 'total_humo_sum', title: 'Humo', count_prop: 'total_humo_count' },
    { sum_prop: 'total_click_sum', title: 'Click', count_prop: 'total_click_count' },
    { sum_prop: 'total_payme_sum', title: 'Payme', count_prop: 'total_payme_count' },
    { sum_prop: 'total_alif_sum', title: 'Alif', count_prop: 'total_alif_count' },
    { sum_prop: 'total_returnals_sum', title: 'Вазврат', count_prop: 'total_returned_count' },
    { sum_prop: 'total_discount_sum', title: 'Сумма скидки', count_prop: 'total_discount_count' },
    { sum_prop: 'total_cashback_sum', title: 'Сумма кешбек', count_prop: 'total_cashback_count' },
  ]
  const changedData = mockData.map((item) => {
    return { ...item, amount: saleStatsData?.[item?.sum_prop], count: saleStatsData?.[item?.count_prop] }
  })

  return (
    <Box
      display={'flex'}
      sx={{
        m: '10px 0',
        p: '8px',
        bgcolor: 'bunker.100',
        borderRadius: '24px',
      }}
    >
      <Grid container spacing={'8px'}>
        {changedData.map((pay, index) => (
          <Grid item xs={6} xl={2.4} sm={index == 9 ? 12 : 4} md={index <= 7 ? 3 : 6} lg={2.4}>
            <Box>
              <PaymentTypeBox pay={pay} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default SaleMiniDashboardHeader
