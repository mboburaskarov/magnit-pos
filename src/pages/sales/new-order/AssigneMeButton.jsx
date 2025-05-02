import { Box } from '@mui/material'
import React from 'react'
import CustomImg from '../../../../components/CustomImg'
import StyledTooltip from '../../../../components/StyledTooltip'

export default function AssigneMeButton({ onClick, userData, isSelected, title, classes }) {
  return (
    <Box
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
      position='absolute'
      left={4}
      borderRadius={'50%'}
      top={4}
      height={40}
      padding={'5px 7px'}
      width={40}
      bgcolor={isSelected ? '#fff' : 'gray.400'}
    >
      <StyledTooltip title={title || 'Показать мои заказы'}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          {/* <UserOutlineIcon color={paletteLight.bunker[300]} /> */}
          <CustomImg src={userData?.photo} alt={userData?.first_name} className={classes.avatar} />
        </Box>
      </StyledTooltip>
    </Box>
  )
}
