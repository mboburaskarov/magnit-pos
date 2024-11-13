import { Box } from '@mui/material'
import React from 'react'
import StyledTooltip from '../../../components/StyledTooltip'
import HeadPhonesIcon from '../../assets/icons/HeadPhonesIcon'

export default function AssigneMeButton({ onClick, isSelected, title }) {
  return (
    <Box
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
      position='absolute'
      left={12}
      borderRadius={2}
      top={12}
      height={32}
      width={32}
      bgcolor={isSelected ? 'primary.main' : 'grey.400'}
    >
      <StyledTooltip title={title || 'Показать мои заказы'}>
        <Box p={1}>
          <HeadPhonesIcon color='white' />
        </Box>
      </StyledTooltip>
    </Box>
  )
}
