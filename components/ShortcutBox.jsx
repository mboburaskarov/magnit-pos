import { Box, Typography } from '@mui/material'
import React from 'react'

function ShortcutBox({ className = 'shortcutbox', border, textColor = '#fff', color = '#FFCEA8', shortcut = 'XX', height = '34px', minWidth = '28px' }) {
  return (
    <Box
      className={className}
      sx={{
        border: border ? border : `1px solid ${color}`,
        height: height,
        display: 'flex',

        padding: '2px',
        minWidth: minWidth,
        alignItems: 'center',
        borderRadius: '4px',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ fontWeight: '500', fontSize: '12px', lineHeight: '16px', color: textColor, m: '0 !important' }}>{shortcut}</Typography>
    </Box>
  )
}

export default ShortcutBox
