import { Box, Grid, Typography } from '@mui/material'
import { get } from 'lodash'
import thousandDivider from '../../../../../utils/thousandDivider'
import BigWarningIcon from '../../../../assets/icons/BigWarningIcon'
import DownloadIcon from '../../../../assets/icons/DownloadIcon'

function WriteOffDashboard({ data }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
      }}
    >
      {[
        { title: 'Aптека', value: 'store' },
        { title: 'Kоличество возвратa', value: 'scanned_count' },
        { title: 'Принятое количество', value: 'return_count' },
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
                  {data?.[stat.value] < 0 && <BigWarningIcon />}
                  {stat.value == 'store' ? get(data, 'store.name', 'Undefined') : thousandDivider(data?.[stat.value], 'шт')}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default WriteOffDashboard
