import { Box, Grid, Typography } from '@mui/material'
import { get } from 'lodash'
import thousandDivider from '../../../../../utils/thousandDivider'
import BigWarningIcon from '../../../../assets/icons/BigWarningIcon'

function ProductReportDashboard({ data: stats, setHasChange }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
      }}
    >
      {[
        { title: 'Общее количество', value: 'total_quantity', currency: 'ед' },
        { title: 'Общее количество возврат ', value: 'total_quantity_returned', currency: 'ед' },
        { title: 'Общее сумма', value: 'total_retail_price_sum', currency: 'сум' },
        { title: 'Общее сумма возврат', value: 'total_retail_price_sum_returned', currency: 'сум' },
      ].map((stat) => (
        <Grid sm='3' lg='3' md='3' item sx={{}}>
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

export default ProductReportDashboard
