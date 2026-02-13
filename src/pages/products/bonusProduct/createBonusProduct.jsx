import { Box } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import InputDateRangePicker from '@components/Inputs/InputDateRangePicker'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import LazySelect from '@components/Select/LazySelect'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'
import { LoadingButton } from '@mui/lab'

export default function CreateBonusProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const theme = useTheme()
  const { t } = useTranslation()

  const { mutate: createBonusProduct, isLoading: iscreateBonusProduct } = useMutation(requests.createBonusProduct, {
    onSuccess: () => {
      setOpen(false)
      success('Создать Бонусный продукт успешно!')
      refetch()
    },
    onError: (err) => {
      console.log(err)
      if (err?.response?.data?.data == "Can't create duplicate bonus for one product") {
        error('Этот товар уже получил бонус.')
        return
      }
      error('Ошибка Создать Бонусный продукт успешно!')
      console.error('err', err)
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
    console.error('err', err)
  }

  useEffect(() => {
    setStartDate(0)
    setEndDate(0)
    reset({}, { keepDirty: true })
  }, [open])

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
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />
            <InputDateRangePicker
              id='import-date'
              name='date'
              noValidation
              asteriks
              label={'Дата бонус'}
              minWidth='auto'
              placeholder={'Дата бонус'}
              fullWidth
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              required
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
              <LoadingButton loading={iscreateBonusProduct} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
