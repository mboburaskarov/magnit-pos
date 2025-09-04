import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import thousandDivider from '../../../../utils/thousandDivider'

function SaleMiniDashboardHeader({ saleStatsData }) {
  return (
    <Box
      display={'flex'}
      sx={{
        m: '10px 0',
        bgcolor: 'gray.50',
        padding: '10px 15px',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          borderRight: '1px dashed #ccc',
          padding: '10px 15px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '17px',
            color: 'bunker.950',
            fontWeight: '600',
            mb: '5px',
          }}
        >
          Сумма транзакций
        </Typography>
        <Typography
          sx={{
            fontSize: '20px',
            color: 'orange.500',
            fontWeight: '700',
          }}
        >
          {thousandDivider(get(saleStatsData, 'total_transactions_sum'), 'сум')}
        </Typography>
      </Box>
      <Box
        display={'flex'}
        sx={{
          overflowX: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {get(saleStatsData, 'payment_type_stats', [])?.map((type) => {
          if (get(type, 'sum') === 0) return null
          return (
            <Box
              sx={{
                flexShrink: 0,
                padding: '10px 15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRight: '1px dashed #ccc',
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'bunker.950',
                  fontWeight: '500',
                  mb: '5px',
                }}
              >
                {get(type, 'name')}
              </Typography>
              <Typography
                sx={{
                  fontSize: '18px',
                  color: 'orange.500',
                  fontWeight: '700',
                }}
              >
                {thousandDivider(get(type, 'sum'), 'сум')}
              </Typography>
            </Box>
          )
        })}
        {get(saleStatsData, 'total_returnals_sum') > 0 && (
          <Box
            sx={{
              flexShrink: 0,
              padding: '10px 15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: '1px dashed #ccc',
            }}
          >
            <Typography
              sx={{
                fontSize: '16px',
                color: 'bunker.950',
                fontWeight: '500',
                mb: '5px',
              }}
            >
              Вазврат
            </Typography>
            <Typography
              sx={{
                fontSize: '18px',
                color: 'orange.500',
                fontWeight: '700',
              }}
            >
              {thousandDivider(get(saleStatsData, 'total_returnals_sum'), 'сум')}
            </Typography>
          </Box>
        )}
        {get(saleStatsData, 'total_returnals_sum') > 0 && (
          <Box
            sx={{
              flexShrink: 0,
              padding: '10px 15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: '1px dashed #ccc',
            }}
          >
            <Typography
              sx={{
                fontSize: '16px',
                color: 'bunker.950',
                fontWeight: '500',
                mb: '5px',
              }}
            >
              Сумма скидки
            </Typography>
            <Typography
              sx={{
                fontSize: '18px',
                color: 'orange.500',
                fontWeight: '700',
              }}
            >
              {thousandDivider(get(saleStatsData, 'total_discount_amount'), 'сум')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SaleMiniDashboardHeader
