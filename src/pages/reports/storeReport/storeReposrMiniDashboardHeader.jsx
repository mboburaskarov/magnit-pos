import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import thousandDivider from '../../../../utils/thousandDivider'

function StoreReposrMiniDashboardHeader({ saleStatsData }) {
  console.log(saleStatsData)
  const payment_type_stats = [
    {
      id: '796ed9a7-ffc1-4ea7-8275-a455270f5741',
      name: 'Naqd',
      type: 'cash',
      sum: get(saleStatsData, 'cash'),
    },
    {
      id: '0dea04ec-0bfa-4fe8-827f-f9984c2d762c',
      name: 'Uzcard',
      type: 'card',
      sum: get(saleStatsData, 'uzcard'),
    },

    {
      id: '6033df02-7458-4ed3-aa07-2f289c92701a',
      name: 'Humo',
      type: 'card',
      sum: get(saleStatsData, 'humo'),
    },
    {
      id: '5c8c142b-dfcf-4207-aee7-03b865100026',
      name: 'Payme',
      type: 'app',
      sum: get(saleStatsData, 'payme'),
    },
    {
      id: '11b56314-97c6-4382-ac24-116c1bc63bef',
      name: 'Uzum',
      type: 'app',
      sum: get(saleStatsData, 'payme'),
    },

    {
      id: '2f8eb436-a068-40cb-9b19-6301f9796d05',
      name: 'Click',
      type: 'app',
      sum: get(saleStatsData, 'click'),
    },

    {
      id: '6033df02-7458-4ed3-aa07-2f289c92701a',
      name: 'Вазврат',
      type: 'card',
      sum: get(saleStatsData, 'return_amount'),
    },
  ]
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
          {thousandDivider(Math.round(get(saleStatsData, 'total_amount')), 'сум')}
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
        {payment_type_stats?.map((type) => {
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
                {thousandDivider(Math.round(get(type, 'sum')), 'сум')}
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
              {thousandDivider(Math.round(get(saleStatsData, 'total_returnals_sum')), 'сум')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default StoreReposrMiniDashboardHeader
