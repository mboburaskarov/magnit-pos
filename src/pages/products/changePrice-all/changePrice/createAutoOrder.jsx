import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'
import InputSwitchNew from '../../../../../components/Inputs/InputSwitch'
import TextField from '../../../../../components/Inputs/TextField'
import Label from '../../../../../components/Label'
import LazySelect from '../../../../../components/Select/LazySelect'
import { requests } from '../../../../../utils/requests'
import { error, success } from '../../../../../utils/toast'
import CloseIcon from '../../../../assets/icons/CloseIcon'

export default function CreateInventory({ open, refetch, setOpen }) {
  const methods = useForm()
  const [revaluationType, setRevaluationType] = useState('full')
  const [storeId, setStoreId] = useState(null) // Track store_id separately
  const [forceRerender, setForceRerender] = useState(0) // Force re-render key

  const { reset, watch, getValues, control, setValue, clearErrors } = methods

  const { mutate: createInventory, isLoading: iscreateInventory } = useMutation(requests.createRevaluation, {
    onSuccess: () => {
      setOpen(false)
      success('Создать инвентаризация')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Создать инвентаризация!')
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      store_id: data.store_id?.id || undefined,
      name: data.name || undefined,
      // Add additional fields based on revaluation type
      ...(revaluationType === 'import' && data.import_id && { import_id: data.import_id.id }),
      ...(revaluationType === 'medicine' && data.medicine_id && { store_product_id: data.medicine_id.id }),
      type: revaluationType.toUpperCase(),
    }
    createInventory(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.log('err', err)
  }

  // Watch for revaluation type changes
  const watchedRevaluationType = watch('revaluation-type')
  const watchedStoreId = watch('store_id')

  // Handle revaluation type change
  useEffect(() => {
    if (watchedRevaluationType && watchedRevaluationType !== revaluationType) {
      setRevaluationType(watchedRevaluationType)

      // Clear dependent fields when type changes
      setValue('import_id', null)
      setValue('medicine_id', null)
      clearErrors('import_id')
      clearErrors('medicine_id')

      // Force re-render of LazySelects
      setForceRerender((prev) => prev + 1)
    }
  }, [watchedRevaluationType, revaluationType, setValue, clearErrors])

  // Handle store change
  useEffect(() => {
    if (watchedStoreId?.id !== storeId) {
      setStoreId(watchedStoreId?.id || null)

      // Clear dependent fields when store changes
      setValue('import_id', null)
      setValue('medicine_id', null)
      clearErrors('import_id')
      clearErrors('medicine_id')

      // Force re-render of dependent LazySelects
      setForceRerender((prev) => prev + 1)
    }
  }, [watchedStoreId, storeId, setValue, clearErrors])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        'revaluation-type': 'full',
        name: `Переоценка ${dayjs().format('YYYY.MM.DD HH:mm')}`,
        store_id: null,
        import_id: null,
        medicine_id: null,
      })
      setRevaluationType('full')
      setStoreId(null)
      setForceRerender((prev) => prev + 1)
    }
  }, [open, reset])

  const theme = useTheme()
  const { t } = useTranslation()

  // Generate unique keys for LazySelects to force re-render
  const getSelectKey = (baseKey) => `${baseKey}-${revaluationType}-${storeId}-${forceRerender}`

  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Новая переоценка'}
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
            <Box
              width={'100%'}
              sx={{
                '& .slider_box_wrapper': {
                  width: 'auto',
                },
                '& .slider_box': {
                  flex: 1,
                },
              }}
            >
              <Label mb='12px'>{t('Тип переоценки')}</Label>
              <InputSwitchNew
                id='client-gender'
                noMarginTop
                name='revaluation-type'
                control={control}
                defaultValue='full'
                options={[
                  {
                    title: t('Полный'),
                    value: 'full',
                  },
                  {
                    title: t('Импорт'),
                    value: 'import',
                  },
                  {
                    title: t('Лекарство'),
                    value: 'medicine',
                  },
                ]}
              />
              <Box height={'10px'} />
              <Label mt='12px' mb='12px'>
                {t('Наименование')}
              </Label>
              <TextField
                id='client-name'
                name='name'
                control={control}
                fullWidth
                placeholder={t('Назовите инвентаризация')}
                required
                defaultValue={`Переоценка ${dayjs().format('YYYY.MM.DD HH:mm')}`}
                asteriks
              />
            </Box>

            {/* Store Selection */}
            <LazySelect
              key={getSelectKey('store')}
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
              getOptionLabel={(option) => option.name}
              filterOption={() => true}
            />

            {/* Import Selection - Only show when type is 'import' and store is selected */}
            {revaluationType === 'import' && storeId && (
              <LazySelect
                key={getSelectKey('import')}
                boxStyle={{ width: '100%' }}
                slug='import_id'
                id='import_id'
                name='import_id'
                customLabel='document_number'
                isMulti={false}
                required
                label={t('Импорт')}
                placeholder={t('Выберите Импорт')}
                minWidth='auto'
                isClearable={true}
                request={requests.getAllImports}
                filters={{ limit: 10, store_id: storeId, status: 'completed' }}
                control={control}
                filterOption={() => true}
              />
            )}

            {/* Medicine Selection - Only show when type is 'medicine' and store is selected */}
            {revaluationType === 'medicine' && storeId && (
              <LazySelect
                key={getSelectKey('medicine')}
                boxStyle={{ width: '100%' }}
                slug='medicine_id'
                id='medicine_id'
                name='medicine_id'
                isMulti={false}
                required
                customLabel='product_name'
                label={t('Лекарство')}
                placeholder={t('Выберите Лекарство')}
                minWidth='auto'
                isClearable={true}
                request={requests.getStoreProducts}
                filters={{ limit: 10, store_id: storeId }}
                control={control}
                getOptionLabel={(option) => option.name}
                filterOption={() => true}
              />
            )}

            {/* Help text for conditional fields */}
            {(revaluationType === 'import' || revaluationType === 'medicine') && !storeId && (
              <Box
                width='100%'
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: 1,
                  border: '1px solid rgba(25, 118, 210, 0.2)',
                }}
              >
                <Label color='primary'>{t('Сначала выберите аптеку для отображения дополнительных опций')}</Label>
              </Box>
            )}

            <Box columnGap={2} display='flex' width='100%' mt={'4px'}>
              <Button fullWidth variant='contained' type='submit' disabled={iscreateInventory}>
                {iscreateInventory ? t('Создание...') : t('filter_dialog.save.label')}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
