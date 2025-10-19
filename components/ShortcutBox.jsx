import { Box } from '@mui/material'
import React from 'react'

function ShortcutBox({ color = '#fff', shortcut = 'XX', height = '34px', minWidth = '34px' }) {
  return (
    <Box
      sx={{
        color: color,
        border: `2px solid ${color}`,
        height: height,
        display: 'flex',
        padding: '2px',
        fontSize: '12px',
        minWidth: minWidth,
        lineHeight: '16px',
        alignItems: 'center',
        borderRadius: '8px',
        justifyContent: 'center',
      }}
    >
      {shortcut}
    </Box>
  )
}

export default ShortcutBox
