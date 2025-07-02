import { Box, Grid, Typography } from '@mui/material'
import thousandDivider from '../../../../utils/thousandDivider'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DownloadIcon from '../../../assets/icons/DownloadIcon'

function TransferDashboard({ data }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
      }}
    >
      {[
        { title: 'Полученное кол-во', value: 'received_count', endText: 'ед.' },
        { title: 'Полученная сумма', value: 'received_retail_sum', endText: 'сум' },
        { title: 'Принятое кол-во', value: 'accepted_count', endText: 'ед.' },
        { title: 'Принятая сумма', value: 'accepted_retail_sum', endText: 'сум' },
      ].map((stat) => (
        <Grid sm='3' lg='3' md='3' item sx={{}}>
          <Box
            sx={{
              boxShadow: ' 0px 0px 16px rgba(0, 0, 0, 0.08)',
              backgroundColor: stat.title == 'result' ? '#dfdfdf' : '#fff',
              borderRadius: '24px',
              padding: '20px',
              minHeight: '110px',
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

export default TransferDashboard
