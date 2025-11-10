import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog';
import SelectSimple from '@components/Select/SelectSimple';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { error, success } from '@utils/toast';
import { Box, Button } from '@mui/material';
import { requests } from '@utils/requests';
import { useMutation } from 'react-query';
import CloseIcon from '@icons/CloseIcon';
import { useTheme } from '@mui/styles';
import { useEffect } from 'react';
import { get } from 'lodash';


export default function ChangePaymentType({ open, refetch, setOpen }) {
  const methods = useForm()
  const theme = useTheme()
  const { t } = useTranslation()
  const { reset } = methods

  const { mutate: changeTypeId, isLoading: ischangeTypeId } = useMutation(requests.changeSalePaymentTypeId, {
    onSuccess: () => {
      setOpen(false)
      success('Изменить тип оплаты успешно!')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Изменить тип оплаты успешно!')
      console.error('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      to_payment_type: data.payment_type_id.front_name,
      sale_id: get(open, 'sale_id'),
      from_payment_type: get(open, 'front_name'),
    }
    changeTypeId(requestBody)
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
              options={open?.types?.filter((type) => open?.payment_type?.[type?.front_name] == 0)}
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
