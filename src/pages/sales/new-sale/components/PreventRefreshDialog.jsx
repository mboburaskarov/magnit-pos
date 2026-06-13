import React from 'react'
import StyledDialog from '@components/Dialogs/StyledeEmptyDialog'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@mui/material'
import CloseIcon from '@icons/CloseIcon'

function PreventRefreshDialog({ setOpenRefreshDialog, isOpenRefreshDialog }) {
  const { t } = useTranslation()

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
          {t('pos.refresh_warning_title')}
        </Typography>
      }
      open={isOpenRefreshDialog}
    >
      <Box sx={{ padding: '40px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography textAlign={'center'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'600'} color={'dark'}>
          {t('pos.refresh_warning_desc')}
        </Typography>
      </Box>
    </StyledDialog>
  )
}

export default PreventRefreshDialog
