import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import thousandDivider from '../../../../utils/thousandDivider'

function SaleMiniDashboardHeader({ saleStatsData }) {
  const mockData = [
    { prop: 'total_cash', title: 'Наличные' },
    { prop: 'total_humo', title: 'Humo' },
    { prop: 'total_uzcard', title: 'Uzcard' },
    { prop: 'total_click', title: 'Click' },
    { prop: 'total_payme', title: 'Payme' },
    { prop: 'total_alif', title: 'Alif' },
    { prop: 'total_returnals_sum', title: 'Вазврат' },
    { prop: 'total_discount_amount', title: 'Сумма скидки' },
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
        {mockData?.map((type) => {
          if (get(saleStatsData, type?.prop) === 0) return null
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
                {get(type, 'title')}
              </Typography>
              <Typography
                sx={{
                  fontSize: '18px',
                  color: 'orange.500',
                  fontWeight: '700',
                }}
              >
                {thousandDivider(get(saleStatsData, type?.prop), 'сум')}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default SaleMiniDashboardHeader
