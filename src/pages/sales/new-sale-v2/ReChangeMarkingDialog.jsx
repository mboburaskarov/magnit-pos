import { Box, Button, Dialog, Typography } from '@mui/material';
import { ArrowRightAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { error, success } from '@utils/toast';
import { requests } from '@utils/requests';
import { useMutation } from 'react-query';


function ReChangeMarkingDialog({ open, handleClose, saveNewChangedMarking, refetchcartItemsList }) {
  const { t } = useTranslation()

  const { mutate: confirmAslName } = useMutation(requests.confirmAslName, {
    onSuccess: ({ data }) => {
      refetchcartItemsList()
      handleClose()
      saveNewChangedMarking()
      success('Маркировка обновлён.')
    },
    onError: (err) => {
      error('errr')
      console.error('err', err)
    },
  })

  return (
    <Dialog
      sx={{
        '.MuiPaper-root': {
          borderRadius: '20px',
          maxWidth: '1000px',
          position: 'relative !important',
          pb: '10px',
        },
      }}
      onClose={handleClose}
      open={open}
      disableScrollLock
    >
      <Box
        sx={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#f3f3f3',
          margin: '20px',
          borderRadius: '20px',
        }}
      >
        <Typography color={'#000'} textAlign={'center'} fontWeight={'500'}>
          {`Препарат с названием ${open?.request_name} и штрихкодом ${open?.old_barcode} был найден.`}
          <Typography color={'#000'} textAlign={'center'} fontWeight={'500'}>
            {' '}
            {`Это действительно тот препарат, который вы хотите продать? `}
          </Typography>
        </Typography>
        <Typography color={'#ff0000'} textAlign={'center'} fontWeight={'500'}>
          Вся информация будет сохранена в истории, и вы будете нести ответственность за любую неверную информацию.
        </Typography>
      </Box>
      <Box sx={{ minWidth: '600px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          sx={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#f3f3f3',

            borderRadius: '20px',
          }}
        >
          <Typography color={'#000'} fontWeight={'500'}>
            {`${open?.request_name}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', width: '100px', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowRightAlt sx={{ fontSize: 30, color: '#fe5000' }} />
        </Box>
        <Box
          sx={{
            flex: 1,

            padding: '20px',
            backgroundColor: '#f3f3f3',

            borderRadius: '20px',
          }}
        >
          <Typography color={'#000'} fontWeight={'500'}>
            {`${open?.asil_belgi_product_name}`}
            <Typography color={'#ff0000'} fontWeight={'500'}>
              <Typography color={'#ff0000'} fontWeight={'500'}>
                {` Сходство составляет ${Math.round(open?.similarity)}%, что очень мало. Разве это не другой продукт?`}
              </Typography>
            </Typography>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#f3f3f3',
            flex: 1,

            borderRadius: '20px',
          }}
        >
          <Typography color={'#000'} fontWeight={'500'}>
            {`${open?.old_barcode}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', width: '100px', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowRightAlt sx={{ fontSize: 30, color: '#fe5000' }} />
        </Box>
        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#f3f3f3',
            flex: 1,

            borderRadius: '20px',
          }}
        >
          <Typography color={'#000'} fontWeight={'500'}>
            {`${open?.new_barcode}`}
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
          {t('Изменить штрихкод и продолжить')}
        </Button>
      </Box>
    </Dialog>
  )
}

export default ReChangeMarkingDialog
