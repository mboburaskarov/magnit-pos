import { Box, Grid, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import BigWarningIcon from '@icons/BigWarningIcon'
import { get } from 'lodash'

function Dashboard({ data: stats, setHasChange }) {
  console.log(stats)
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
      }}
    >
      {[
        { title: 'Всего карт ', value: 'total_cards', currency: 'ед' },
        { title: 'Новые карты в период ', value: 'new_cards_in_period', currency: 'ед' },
        { title: 'Накопленный кешбэк', value: 'total_cashback_given', currency: 'сум' },
        { title: 'Бронзовых карт (1%)', value: 'cards_by_level[0].count', currency: 'ед' },
        { title: 'Серебряных карт (3%)', value: 'cards_by_level[1].count', currency: 'ед' },
        { title: 'Золотых карт (5%)', value: 'cards_by_level[2].count', currency: 'ед' },
      ].map((stat) => (
        <Grid sm='4' lg='4' md='4' item sx={{}}>
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

export default Dashboard
