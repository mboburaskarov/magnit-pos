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
        alignItems: 'start',
        justifyContent: 'start',
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
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Typography
          sx={{
            width: '100%',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          Parastamol
        </Typography>
        <Typography
          sx={{
            fontSize: '50px',
            fontWeight: '600',
            m: '15px 0 10px',
          }}
        >
          124.000 sum
        </Typography>
      </Box>
      <Box>
        <Barcode fontSize={'20px'} width={'3px'} value='1234567891010' />
      </Box>
    </Box>
  )
}

export default RippedPaperProductPriceCheck
