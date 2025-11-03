import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import CloseIcon from '@icons/CloseIcon'
import { LoadingButton } from '@mui/lab'
import InputDatePicker from '@components/Inputs/InputDatePicker'
import { get } from 'lodash'

export default function SendSaleTo1C({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset } = methods
  const { mutate: sendSaleTo1C, isLoading: isSendSaleTo1CLoading } = useMutation(requests.sendSaleTo1C, {
    onSuccess: () => {
      setOpen(false)
      success('Отправлено в 1c!')
      refetch()
    },
    onError: (err) => {
      console.log(err)
      if (get(err, 'response.data.data') == 'not.enough.product') {
        error('Нет товаров в продажах на указанную дату')
        return
      }
      error('Ошибка Отправлено в 1c')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      send_date: dayjs(data.sale_date).format('YYYY-MM-DD'),
      store_id: get(open, 'id'),
    }
    sendSaleTo1C(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.error('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()

  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Отправить в 1c'}
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
            <InputDatePicker defaultValue={new Date()} name='sale_date' id='sale_date' showYearDropdown label='Дата продажи' placeholder='Дата продажи' />

            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <LoadingButton loading={isSendSaleTo1CLoading} fullWidth variant='contained' type='submit'>
                Отправить
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
