import { Box, Typography } from '@mui/material'
import React from 'react'

function SaleMiniDashboardHeader() {
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
          7 638 281.15 UZS
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
        {['Uzcard', 'Click', 'Uzum', 'Naqt', 'Visa', 'Humo', 'Payme', 'Bonus'].map((name) => (
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
              {name}
            </Typography>
            <Typography
              sx={{
                fontSize: '18px',
                color: 'orange.500',
                fontWeight: '700',
              }}
            >
              38 281.15 UZS
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default SaleMiniDashboardHeader
