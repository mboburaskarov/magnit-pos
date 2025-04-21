import { Box, Typography } from '@mui/material'
import React from 'react'
import Barcode from 'react-barcode'

import { useSelector } from 'react-redux'

function RippedPaperProductPriceCheck() {
  const userData = useSelector((state) => state.user)

  return (
    <Box
      width={'100%'}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        justifyContent: 'start',
        padding: '0 16px',
        flexDirection: 'column',
        height: '72px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          justifyContent: 'start',
          padding: '0 16px',
          flexDirection: 'column',
          height: '72px',
        }}
      >
        <Typography
          sx={{
            width: '100%',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          Parastamol
        </Typography>
        <Typography
          sx={{
            fontSize: '28px',
            fontWeight: '600',
          }}
        >
          124.000 sum
        </Typography>
      </Box>
      <Box>
        <Barcode fontSize={'20px'} width={'4px'} value='12345678' />
      </Box>
    </Box>
  )
}

export default RippedPaperProductPriceCheck
