import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function ChangePaymentType({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const { mutate: changeTypeId, isLoading: ischangeTypeId } = useMutation(requests.changeSalePaymentTypeId, {
    onSuccess: () => {
      setOpen(false)
      success('Изменить тип оплаты успешно!')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Изменить тип оплаты успешно!')
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      payment_type_id: data.payment_type_id.value,
      sale_payment_id: get(open, 'sale_payment_id'),
      sale_id: get(open, 'sale_id'),
    }
    changeTypeId(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.log('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()
  const { data: paymentTypesList } = useQuery('paymentTypesList', () => requests.getPaymentTypesList())

  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Изменить тип оплаты'}
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
            <SelectSimple
              id={'payment_type_id'}
              options={open?.types?.filter((type) => {
                console.log(type, open?.payment_type, open?.payment_type?.[type?.front_name])

                return open?.payment_type?.[type?.front_name] == 0
              })}
              menuPlacement='bottom'
              fullWidth
              label={'Оплата'}
              name='payment_type_id'
              getOptionLabel={(option) => option.name}
              placeholder='Выберите оплата'
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
