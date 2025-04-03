import { Box, Typography } from '@mui/material'
import React from 'react'

function SoonPage() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography color={'orange.500'} sx={{ fontSize: '40px', fontWeight: '600' }}>
        Скоро...
      </Typography>
    </Box>
  )
}

export default SoonPage
