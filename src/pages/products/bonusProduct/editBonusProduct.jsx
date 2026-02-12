import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import InputDateRangePicker from '@components/Inputs/InputDateRangePicker'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'

export default function EditBonusProduct({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const theme = useTheme()
  const { t } = useTranslation()
  const { data: bonusProduct } = useQuery(['bonusProduct', get(open, 'id', 0)], () => requests.getBonusProduct({ id: get(open, 'id', 0) }), { enabled: !!open })
  const { mutate: editBonusProduct } = useMutation(requests.editBonusProduct, {
    onSuccess: () => {
      setOpen(false)
      success('Редактировать Бонусный продукт успешно!')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Редактировать Бонусный продукт успешно!')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      product_id: get(open, 'product.id', 0),
      bonus_amount: data.bonus_amount,
      start_date: startDate != 0 ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
      end_date: endDate != 0 ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
    }
    editBonusProduct({ data: requestBody, id: get(open, 'id', 0) })
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.error('err', err)
  }

  useEffect(() => {
    ;(setStartDate(get(bonusProduct, 'start_date', 0) ? dayjs(get(bonusProduct, 'start_date')).toDate() : null),
      setEndDate(get(bonusProduct, 'end_date', 0) ? dayjs(get(bonusProduct, 'end_date')).toDate() : null),
      reset(
        {
          bonus_amount: get(bonusProduct, 'bonus_amount', 0),
        },
        { keepDirty: true },
      ))
  }, [bonusProduct])

  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Редактировать бонусный продукт'}
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
