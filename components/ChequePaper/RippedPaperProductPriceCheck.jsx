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
      <Box>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Parastamol
        </Typography>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          124.000 sum
        </Typography>
      </Box>
      <Box>
        <Barcode width={'4px'} value='12345678' />
      </Box>
    </Box>
  )
}

export default RippedPaperProductPriceCheck
