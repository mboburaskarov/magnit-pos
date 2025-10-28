import { Box, Grid, Typography } from '@mui/material'
import { get } from 'lodash'
import thousandDivider from '../../../../utils/thousandDivider'
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
    <Typography sx={{ fontSize: '18px', fontWeight: '600', lineHeight: '28px', color: 'dark.500', mt: '4px' }}>
      {thousandDivider(get(pay, 'amount'), 'сум')}
    </Typography>
  </Box>
)
function SaleMiniDashboardHeader({ saleStatsData }) {
  const mockData = [
    { sum_prop: 'total_transaction', title: 'Транзакции', count_prop: 'total_transaction' },
    { sum_prop: 'total_cash', title: 'Наличные', count_prop: 'total_transaction' },
    { sum_prop: 'total_uzcard', title: 'UzCard', count_prop: 'total_transaction' },
    { sum_prop: 'total_humo', title: 'HUMO', count_prop: 'total_transaction' },
    { sum_prop: 'total_click', title: 'Click', count_prop: 'total_transaction' },
    { sum_prop: 'total_payme', title: 'Payme', count_prop: 'total_transaction' },
    { sum_prop: 'total_alif', title: 'Alif', count_prop: 'total_transaction' },
    { sum_prop: 'total_returnals_sum', title: 'Вазврат', count_prop: 'total_transaction' },
    { sum_prop: 'total_discount_amount', title: 'Сумма скидки', count_prop: 'total_transaction' },
    { sum_prop: 'total_cashback_amount', title: 'Сумма кешбек', count_prop: 'total_transaction' },
  ]
  const changedData = mockData.map((item) => {
    return { ...item, amount: saleStatsData[item.sum_prop], count: saleStatsData[item.count_prop] }
  })
  console.log(changedData)

  return (
    <Box
      display={'flex'}
      sx={{
        m: '10px 0',
        bgcolor: 'bunker.100',
        padding: '10px 15px',
        borderRadius: '24px',
      }}
    >
      <Grid container spacing={'8px'}>
        {changedData.map((pay) => (
          <Grid item xs={2.4} xl={2.4} sm={2.4} md={2.4} lg={2.4}>
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
