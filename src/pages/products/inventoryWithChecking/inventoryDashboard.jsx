import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import thousandDivider from '../../../../utils/thousandDivider'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DownloadIcon from '../../../assets/icons/DownloadIcon'

function InventoryDashboard({ data }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
      }}
    >
      {[
        { title: 'Недостачи по цене поставки', value: 'shortage_supply_sum' },
        { title: 'Недостачи по цене продажи', value: 'shortage_retail_sum' },
        { title: 'Излишки по цене поставки', value: 'surplus_supply_sum' },
        { title: 'Излишки по цене продажи', value: 'shortage_supply_sum' },
        { title: 'result' },
      ].map((stat) => (
        <Grid sm='4' lg='4' md='4' item sx={{}}>
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
                  {data?.stats_count[stat.value] < 0 && <BigWarningIcon />}
                  {thousandDivider(data?.stats_count[stat.value], 'сум')}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default InventoryDashboard
