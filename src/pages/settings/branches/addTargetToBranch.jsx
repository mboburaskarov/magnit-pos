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

export default function AddTargetToBranch({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const theme = useTheme()
  const { t } = useTranslation()

  const { mutate: createTarget, isLoading: iscreateTarget } = useMutation(requests.createTarget, {
    onSuccess: () => {
      setOpen(false)
      success('Цель успешно добавлена!')
      refetch()
    },
    onError: (err) => {
      error('Ошибка!')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      amount: data.target_amount,
      store_id: open?.data ? open?.data?.id : data.store.value,
      month: Number(dayjs().format('MM')),
      year: Number(dayjs().format('YYYY')),
    }
    createTarget(requestBody)
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
      title={`Добавить таргет на ${dayjs()
        .format('MMMM YYYY')
        .replace(/^./, (c) => c.toUpperCase())}`}
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
            {!open?.data && (
              <LazySelect
                boxStyle={{ width: '100%' }}
                slug='store'
                id='store'
                name='store'
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
            )}
            <NumberFormatInput
              label={'Целевая сумма'}
              id={`target_amount`}
              name={`target_amount`}
              fullWidth
              required
              type='number'
              defaultValue={0}
              disabled={false}
            />
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <LoadingButton loading={iscreateTarget} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
