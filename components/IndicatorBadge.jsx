import React from 'react'
import { Box } from '@mui/material'
import StyledTooltip from '@components/StyledTooltip'
import { Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'

export default function IndicatorBadge({ tooltip, type, bgcolor }) {
  let IconComponent = null
  if (type === '+') IconComponent = Plus
  else if (type === '-') IconComponent = Minus
  else if (type === '<') IconComponent = ChevronLeft
  else if (type === '>') IconComponent = ChevronRight

  return (
    <StyledTooltip title={tooltip}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          bgcolor: bgcolor || 'red.500',
          color: '#fff',
        }}
      >
        {IconComponent && <IconComponent size={10} strokeWidth={3} />}
      </Box>
    </StyledTooltip>
  )
}
