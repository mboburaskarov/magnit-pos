import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import InputQuantity from '@components/Inputs/InputQuantity'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'
import { LoadingButton } from '@mui/lab'

export default function AddNewBarcodeToProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const [unit, setUnit] = useState(0)
  const theme = useTheme()
  const { t } = useTranslation()

  const { mutate: updateUnitPerPack, isLoading } = useMutation(requests.updateUnitPerPack, {
    onSuccess: () => {
      setOpen(false)
      refetch()
      success('Продукт успешно изменен!')
    },
    onError: (err) => {
      error('Ошибка при редактировании товара!')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      product_id: open?.id,
      unit_per_pack: Number(unit),
    }
    updateUnitPerPack(requestBody)
  }

  const onError = (err) => {
    console.error('err', err)
  }
const data = [{barcode: '1234567890123', mxik: '12345678', unit_code: '123456'}]
  return (
    <StyledEmptyDialog
      onClose={() => setOpen(false)}
      open={open}
      maxWidth={'90%'}
      title={'Добавить новый штрих-код'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box
        sx={{
          width: '100%',
          padding: '0 24px 24px',
          '& .MuiInputBase-root': {
            border: `2px solid`,
            borderColor: 'bunker.100',
            height: '48px',
          },
          '& svg': {
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <Box padding={'0 2px'} maxHeight={'calc(100vh - 280px)'} width={'100%'} overflow={'scroll'}>
              <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: 'center', my: '30px' }}>{open?.name}</Typography>
              <Box display='flex' alignItems='end' justifyContent='center' gap={2}>
                <InputQuantity
                label={'Штрих-код'}
                id={`barcode`}
                name={`barcode`}
                fullWidth
                required
                type='number'
                defaultValue={0}
                disabled={false}
              />
               <InputQuantity
                label={'MXIK'}
                id={`mxik`}
                name={`mxik`}
                fullWidth
                required
                type='number'
                defaultValue={0}
                disabled={false}
              />
               <InputQuantity
                label={'Kод yпаковки'}
                id={`unit_code`}
                name={`unit_code`}
                fullWidth
                required
                type='number'
                defaultValue={0}
                disabled={false}
              />
              <LoadingButton loading={isLoading}  variant='contained' type='submit'>
                Добавить
              </LoadingButton>
              </Box>
              <Box height={'20px'} />
              <Box padding={'0 20px'} maxHeight={'calc(100vh - 380px)'} width={'100%'} overflow={'scroll'}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: 'center', my: '30px' }}>{t('Все штрих-коды')}</Typography>
                {/* table header */}
                <Box display='flex' justifyContent='space-between' alignItems='center' padding={'10px 0'} borderBottom={`1px solid ${theme.palette.bunker[100]}`}>
                  <Typography>Штрих-код</Typography>
                  <Typography>MXIK</Typography>
                  <Typography>Kод yпаковки</Typography>
                </Box>
{data.map((item, index) => (
  <Box key={index} display='flex' alignItems='center' justifyContent='space-between' padding={'10px 0'} borderBottom={`1px solid ${theme.palette.bunker[100]}`}>
    <Typography>{item.barcode}</Typography>
    <Typography>{item.mxik}</Typography>
    <Typography>{item.unit_code}</Typography>
  </Box>
))}
              </Box>
            </Box>
           
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
