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

export default function ChangeUnitPerPack({ open, refetch, setOpen }) {
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

  return (
    <StyledEmptyDialog
      onClose={() => setOpen(false)}
      open={open}
      title={'Изм кол-ва ед на уп'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box
        sx={{
          width: '100%',
          padding: '24px',
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
              <InputQuantity
                label={'Кол-ва ед на уп'}
                id={`box_grain_count`}
                name={`box_grain_count`}
                fullWidth
                value={unit}
                uncontrolled
                onChange={(e) => {
                  setUnit(e?.target?.value)
                }}
                required
                type='number'
                defaultValue={0}
                disabled={false}
              />
              <Box height={'20px'} />
            </Box>
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <LoadingButton loading={isLoading} disabled={unit <= 1} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
