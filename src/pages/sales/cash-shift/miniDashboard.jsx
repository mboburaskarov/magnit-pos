import React from 'react'
import IncomeIcon from '../../../assets/icons/IncomeIcon'
import { Box, Grid, Typography } from '@mui/material'

function MiniDashboard() {
  return (
    <Grid mt={'0px'} spacing={'16px'} container>
      {[1, 2, 3, 4].map((a) => (
        <Grid item sx={6} lg={3} md={6} xs={6}>
          <Box
            sx={{
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #A4A5AB33',
            }}
          >
            <Box
              sx={{
                border: 'none',
                borderBottom: '1px solid #EDEDEE',
                paddingBottom: '12px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#FF60180D',
                  padding: '10px',
                  width: '40px',
                  height: '40px',
                }}
              >
                <IncomeIcon />
              </Box>
              <Typography
                sx={{
                  lineHeight: '22px',
                  fontWeight: '600',
                  fontSize: '14px',
                  ml: '12px',
                }}
              >
                Kassaga jami tushum
              </Typography>
            </Box>
            <Box
              sx={{
                paddingTop: '12px',
                '& p': {
                  fontWeight: '600',
                  lineHeight: '23px',
                  fontSize: '16px',
                },
              }}
            >
              <Box display={'flex'}>
                <Typography mr={'4px'}>Naqd -</Typography>
                <Typography>15 000 000 so'm</Typography>
              </Box>
              <Box display={'flex'}>
                <Typography mr={'4px'}>Naqd -</Typography>
                <Typography>15 000 000 so'm</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default MiniDashboard
