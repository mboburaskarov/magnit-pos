import { Box, Grid, Typography } from '@mui/material';
import thousandDivider from '@utils/thousandDivider';
import BigWarningIcon from '@icons/BigWarningIcon';
import { get } from 'lodash';


function StoreSummaryReportDashboard({ data: stats, setHasChange }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
      }}
    >
      {[
        { title: 'Общая сумма продаж', value: 'total_sale_amount', currency: 'сум' },
        { title: 'Импорт в ожидании ', value: 'total_import_amount', currency: 'сум' },
        { title: 'Общая сумма баланса', value: 'total_stock_amount', currency: 'сум' },
        { title: 'Общее итог', value: 'total', currency: 'сум' },
        { title: 'Общее сумма скидки', value: 'total_discount_amount', currency: 'сум' },
      ].map((stat) => (
        <Grid sm='2.4' lg='2.4' md='2.4' item sx={{}}>
          <Box
            sx={{
              backgroundColor: stat.title == 'result' ? 'bg.10' : 'bg.10',
              borderRadius: '24px',
              padding: '20px',
              minHeight: '110px',
            }}
          >
            <>
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {stat.title}
              </Typography>
              <Typography
                sx={{
                  mt: '5px',
                  color: 'bunker.500',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': {
                    width: '25px',
                    mr: '10px',
                  },
                }}
              >
                {stats?.[stat.value] < 0 && <BigWarningIcon />}
                {thousandDivider(get(stats, stat.value), get(stat, 'currency'))}
              </Typography>
            </>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default StoreSummaryReportDashboard
