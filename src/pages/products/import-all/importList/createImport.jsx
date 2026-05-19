import { Box } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import TextField from '@components/Inputs/TextField'
import Label from '@components/Label'
import LazySelect from '@components/Select/LazySelect'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'
import { LoadingButton } from '@mui/lab'

export default function CreateImport({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const theme = useTheme()
  const { t } = useTranslation()

  const { mutate: createImport, isLoading: isCreateImport } = useMutation(requests.createImport, {
    onSuccess: () => {
      setOpen(false)
      success('Импорт успешно создан')
      refetch()
    },
    onError: (err) => {
      error('Ошибка при создании импорта!')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      store_id: data.store_id?.id || undefined,
      name: data.name || undefined,
    }
    createImport(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.error('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])

  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Новый импорт'}
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
              <Label mb='12px'>{t('Наименование')}</Label>
              <TextField
                id='import-name'
                name='name'
                control={control}
                fullWidth
                placeholder={t('Назовите импорт')}
                required
                defaultValue={`Импорт ${dayjs().format('YYYY.MM.DD HH:mm')}`}
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
              placeholder={t('Выберите Магазин')}
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

            <Box columnGap={2} display='flex' width='100%' mt={'24px'}>
              <LoadingButton loading={isCreateImport} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
