import { Box, Button, Dialog, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
function ReChangeMarkingDialog({ open, handleClose, refetchcartItemsList }) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const { t } = useTranslation()
  const { mutate: confirmAslName, isLoading: isconfirmAslName } = useMutation(requests.confirmAslName, {
    onSuccess: ({ data }) => {
      refetchcartItemsList()
      handleClose()
      success('uzgartirildi')
    },
    onError: (err) => {
      error('errr')
      console.log('err', err)
    },
  })
  return (
    <Dialog
      sx={{
        '.MuiPaper-root': {
          borderRadius: '20px',
          position: 'relative !important',
          pb: '10px',
        },
      }}
      onClose={handleClose}
      open={open}
      disableScrollLock
    >
      <Box sx={{ minWidth: '600px', padding: '20px' }}>
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#f3f3f3',
            m: '10px 0px',
            borderRadius: '20px',
          }}
        >
          <Typography color={'#fe5000'} fontWeight={'500'}>
            {`Препарат с названием ${open?.request_name} и штрихкодом ${open?.new_barcode} был найден с точностью ${Math.round(
              open?.similarity
            )}%. Это действительно тот препарат, который вы хотите продать?`}
          </Typography>
        </Box>
      </Box>

      <Box
        display={'flex'}
        sx={{
          bottom: 0,
          right: 0,
          backgroundColor: '#fff',
          left: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
        }}
      >
        <Button onClick={handleClose} color='secondary' variant='contained' fullWidth>
          {t('cancel')}
        </Button>
        <Box width={'20px'} />
        <Button
          onClick={() => {
            confirmAslName(open?.id)
          }}
          fullWidth
        >
          {t('Да')}
        </Button>
      </Box>
    </Dialog>
  )
}

export default ReChangeMarkingDialog
