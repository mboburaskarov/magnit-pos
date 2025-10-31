import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'
import TextField from '../../../../../components/Inputs/TextField'
import Label from '../../../../../components/Label'
import LazySelect from '../../../../../components/Select/LazySelect'
import { requests } from '../../../../../utils/requests'
import { error, success } from '../../../../../utils/toast'
import CloseIcon from '../../../../assets/icons/CloseIcon'
import { LoadingButton } from '@mui/lab'

export default function CreateReturn({ open, refetch, setOpen }) {
  const methods = useForm()
  const [openWarn, setopenWarn] = useState(false)
  const { reset, control } = methods
  useEffect(() => {
    if (methods.getValues('reason')?.id == 'correction_of_misclassification') {
      setopenWarn(true)
    } else {
      setopenWarn(false)
    }
  }, [methods.watch('reason')])
  const { mutate: createReturnToWarehouse, isLoading: iscreateReturnToWarehouse } = useMutation(requests.createReturnToWarehouse, {
    onSuccess: () => {
      setOpen(false)
      success('Создать автозаказ')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Создать автозаказ!')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      store_id: data.store_id?.id || undefined,
      name: data.name || undefined,
      comment: data.reason?.id || undefined,
    }
    createReturnToWarehouse(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.error('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()

  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Новое возврат'}
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
            <Box width={'100%'}>
              <Label mb='12px'>{t('Назовите Возврат')}</Label>
              <TextField
                id='client-name'
                name='name'
                control={control}
                fullWidth
                placeholder={t('Назовите Возврат')}
                required
                defaultValue={`Возврат ${dayjs().format('YYYY.MM.DD HH:mm')}`}
                asteriks
              />
            </Box>

            <LazySelect
              boxStyle={{ width: '100%' }}
              slug='store_id'
              id='store_id'
              name='store_id'
              isMulti={false}
              required
              label={t('input.store.label')}
              placeholder={t('Выберите Аптека')}
              minWidth='auto'
              isClearable={true}
              request={requests.getAllStores}
              filters={{ limit: 10 }}
              control={control}
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />

            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <LoadingButton loading={iscreateReturnToWarehouse} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
