import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import NumberFormatInput from '../../../../components/Inputs/OutLineTextFieldThousand'
import LazySelect from '../../../../components/Select/LazySelect'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'
import InputDateRangePicker from '../../../../components/Inputs/InputDateRangePicker'
import dayjs from 'dayjs'

export default function CreateBonusProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const { mutate: createBonusProduct, isLoading: iscreateBonusProduct } = useMutation(requests.createBonusProduct, {
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
    const requestBody = {
      product_id: data.product.value,
      bonus_amount: data.bonus_amount,
      start_date: startDate != 0 ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
      end_date: endDate != 0 ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
    }
    createBonusProduct(requestBody)
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
      title={'Создать бонусный продукт'}
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
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return <Typography color='grey.600'>{option.name}</Typography>
              }}
              filterOption={() => true}
            />
            <InputDateRangePicker
              id='import-date'
              name='date'
              noValidation
              label={'Дата бонус'}
              minWidth='auto'
              placeholder={'Дата бонус'}
              fullWidth
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              control={control}
            />
            <NumberFormatInput
              label={'Сумма бонуса'}
              id={`bonus_amount`}
              name={`bonus_amount`}
              fullWidth
              required
              type='number'
              defaultValue={0}
              disabled={false}
            />
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
