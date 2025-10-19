import React from 'react'
import StyledDialog from '../../../../components/Dialogs/StyledeEmptyDialog'

import { Box, Typography } from '@mui/material'
import CloseIcon from '../../../assets/icons/CloseIcon'

function PreventRefreshDialog({ setOpenRefreshDialog, isOpenRefreshDialog }) {
  return (
    <StyledDialog
      backbtn={false}
      onClose={() => {
        setOpenRefreshDialog(false)
      }}
      customButtons={<CloseIcon color={'#000'} onClick={() => setOpenRefreshDialog(false)} />}
      buttonLabel={'ff'}
      title={
        <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'#f22'}>
          Предупреждение !!!
        </Typography>
      }
      open={isOpenRefreshDialog}
    >
      <Box sx={{ padding: '40px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography textAlign={'center'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'dark'}>
          Обновление невозможно. Есть незавершённые задачи. Пожалуйста, проявите терпение.
        </Typography>
      </Box>
    </StyledDialog>
  )
}

export default PreventRefreshDialog
