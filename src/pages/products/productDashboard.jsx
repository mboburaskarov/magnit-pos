import { Box, Grid, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import BigWarningIcon from '@icons/BigWarningIcon'
import DownloadIcon from '@icons/DownloadIcon'

function ProductDashboard({ data }) {
  return (
    <Grid
      container
      spacing={'8px'}
      sx={{
        display: 'flex',
      }}
    >
      {[
        { title: 'Наименований', value: 'total_count', endText: 'шт' },
        { title: 'Товарных единиц', value: 'total_quantity', endText: 'ед.' },
        { title: 'Oбщая суммa', value: 'total_stock_amount', endText: 'сум' },
      ].map((stat) => (
        <Grid sm='4' lg='4' md='4' item sx={{}}>
          <Box
            sx={{
              backgroundColor: stat.title == 'result' ? 'bg.10' : 'bg.10',
              borderRadius: '16px',
              padding: '16px',
              minHeight: '84px',
            }}
          >
            {stat.title == 'result' ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '70px',
                  position: 'relative',
                  '& svg': {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    height: '20px',
                    width: '20px',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: '600',
                    fontSize: '20px',
                  }}
                >
                  Загрузить Excel
                </Typography>
                <DownloadIcon />
              </Box>
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '20px',
                    color: 'bunker.700',
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography
                  sx={{
                    mt: '5px',
                    color: 'bunker.950',
                    fontWeight: '600',
                    fontSize: '18px',
                    lineHeight: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': {
                      width: '25px',
                      mr: '10px',
                    },
                  }}
                >
                  {data?.stats_count?.[stat.value] < 0 && <BigWarningIcon />}
                  {thousandDivider(data?.[stat.value], stat.endText)}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default ProductDashboard
