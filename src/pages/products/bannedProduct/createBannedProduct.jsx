import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import LazySelect from '../../../../components/Select/LazySelect'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { LoadingButton } from '@mui/lab'

export default function CreateBannedProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control, getValues, watch } = methods
  const [hideProduct, setHideProduct] = useState(false)
  const [hideProducer, setHideProducer] = useState(false)
  const { mutate: createBannedProduct, isLoading: iscreateBannedProduct } = useMutation(requests.createBannedProduct, {
    onSuccess: () => {
      setOpen(false)
      success('Создать Запрещенный продукт успешно!')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Создать Запрещенный продукт успешно!')
      console.log('err', err)
    },
  })
  useEffect(() => {
    setHideProduct(getValues('producer')?.name)
  }, [watch('producer')])
  useEffect(() => {
    setHideProducer(getValues('product')?.[0]?.name)
  }, [watch('product')])
  const onSubmit = (data) => {
    const requestBody = {
      producer_id: data.producer.value,
      product_id: hideProduct ? undefined : data.product.map((product) => product.id),
      store_id: data.store_id.map((store) => store.id),
    }
    createBannedProduct(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.log('err', err)
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
      title={'Создать запрещенный продукт'}
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
            {!hideProducer && (
              <LazySelect
                boxStyle={{ width: '100%' }}
                slug='producer'
                id='producer'
                name='producer'
                isMulti={false}
                required
                label={t('Производитель')}
                placeholder={t('Выберите Производитель')}
                minWidth='auto'
                isClearable={true}
                request={requests.getProducer}
                filters={{ limit: 10 }}
                control={control}
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
            )}
            {!hideProduct && (
              <LazySelect
                boxStyle={{ width: '100%' }}
                slug='product'
                id='product'
                name='product'
                isMulti={true}
                required
                label={t('Продукт')}
                placeholder={t('Выберите Продукт')}
                minWidth='auto'
                isClearable={true}
                request={requests.getProductListForSelect}
                filters={{ limit: 10 }}
                control={control}
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
            )}
            <LazySelect
              boxStyle={{ width: '100%' }}
              slug='store_id'
              id='store_id'
              name='store_id'
              isMulti={true}
              label={t('store')}
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
              <LoadingButton loading={iscreateBannedProduct} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
