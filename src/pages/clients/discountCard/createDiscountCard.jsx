import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'

import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import LazySelect from '@components/Select/LazySelect'

import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'

import CloseIcon from '@icons/CloseIcon'

export default function CreateDiscountCard({ open, refetch, setOpen }) {
  const methods = useForm()
  const theme = useTheme()
  const { t } = useTranslation()
  const { reset, control } = methods

  const { mutate: createDiscountCard } = useMutation(requests.createDiscountCard, {
    onSuccess: () => {
      setOpen(false)
      success('Создать дисконтная карта успешно!')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Создать дисконтная карта успешно!')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      customer_id: data.customer_id.value,
      percent: data.percent,
      barcode: String(data.barcode),
    }
    createDiscountCard(requestBody)
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
      title={'Создать дисконтная карта'}
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
              slug='customer_id'
              id='customer_id'
              name='customer_id'
              isMulti={false}
              customLabel='full_name'
              label={t('Клиент')}
              placeholder={t('Выберите Клиент')}
              minWidth='auto'
              isClearable={true}
              request={requests.getAllCustomers}
              filters={{ limit: 10 }}
              control={control}
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />
            <NumberFormatInput label={'Баркод'} id={`barcode`} name={`barcode`} fullWidth required type='number' defaultValue={0} disabled={false} />
            <NumberFormatInput label={'Процент'} id={`percent`} name={`percent`} fullWidth required type='number' defaultValue={0} disabled={false} />
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
