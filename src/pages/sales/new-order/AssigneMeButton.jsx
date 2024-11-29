import { Box } from '@mui/material'
import React from 'react'
import StyledTooltip from '../../../../components/StyledTooltip'
import UserOutlineIcon from '../../../assets/icons/UserOutlineIcon'
import { theme } from '../../../assets/theme'
import paletteLight from '../../../assets/theme/paletteLight'

export default function AssigneMeButton({ onClick, isSelected, title }) {
  return (
    <Box
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
      position='absolute'
      left={6}
      borderRadius={'50%'}
      top={5}
      height={40}
      padding={'8px'}
      width={40}
      bgcolor={isSelected ? '#fff' : 'gray.400'}
    >
      <StyledTooltip title={title || 'Показать мои заказы'}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <UserOutlineIcon color={paletteLight.bunker[300]} />
        </Box>
      </StyledTooltip>
    </Box>
  )
}
