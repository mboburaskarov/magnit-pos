import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import React from 'react'
import Barcode from 'react-barcode'

import { useSelector } from 'react-redux'
import thousandDivider from '../../utils/thousandDivider'

function RippedPaperProductPriceCheck({ data }) {
  const userData = useSelector((state) => state.user)

  return (
    <Box
      width={'100%'}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        padding: '0 10px 0 0',
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
          {get(data, 'name', '')}
        </Typography>
        <Box height={'10px'} />
        <Typography
          sx={{
            fontSize: '50px',
            fontWeight: '600',
            m: '15px 0 10px',
          }}
        >
          {thousandDivider(get(data, 'price', 0))}
        </Typography>
      </Box>
      <Box>
        <Barcode fontSize={'20px'} height={'60px'} width={'2px'} value={get(data, 'barcode')} />
      </Box>
    </Box>
  )
}

export default RippedPaperProductPriceCheck
