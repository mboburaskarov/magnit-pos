import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import NumberFormatInput from '../../../../components/Inputs/OutLineTextFieldThousand'
import LazySelect from '../../../../components/Select/LazySelect'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function CreateBonusProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const { mutate: createMinMax, isLoading: iscreateMinMax } = useMutation(requests.createMinMax, {
    onSuccess: () => {
      setOpen(false)
      success('Создать автозаказ')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Создать автозаказ!')
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    console.log(data)

    const requestBody = {
      product_id: data.product.value,
      store_id: data.store_id.value,
      is_active: data.is_active.id == 'true',
      min_quantity: data.min_quantity,
      max_quantity: data.max_quantity,
      kvant: data.kvant,
    }
    createMinMax(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.log('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()
  const minMaxStatusSelect = [
    { name: 'Неактивный', id: 'false' },
    { name: 'Активный', id: 'true' },
  ]
  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Создать Мин-Макс'}
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
            <LazySelect
              boxStyle={{ width: '100%' }}
              slug='product'
              id='product'
              name='product'
              isMulti={false}
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
            <LazySelect
              boxStyle={{ width: '100%' }}
              slug='store_id'
              id='store_id'
              name='store_id'
              isMulti={false}
              required
              label={t('Магазин')}
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
            <SelectSimple
              fullWidth
              id='is_active'
              white
              name='is_active'
              minWidth='auto'
              label={'Статус'}
              placeholder={'Bыберите статус'}
              options={minMaxStatusSelect}
              getOptionLabel={(el) => el.name}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <NumberFormatInput label={'Квант'} id={`kvant`} name={`kvant`} fullWidth required type='number' defaultValue={0} disabled={false} />
              <Box width={'40px'} />
              <NumberFormatInput label={'Мин'} id={`min_quantity`} name={`min_quantity`} fullWidth required type='number' defaultValue={0} disabled={false} />
              <Box width={'40px'} />
              <NumberFormatInput label={'Макс'} id={`max_quantity`} name={`max_quantity`} fullWidth required type='number' defaultValue={0} disabled={false} />
            </Box>
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
