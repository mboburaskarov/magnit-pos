import { Box, Button, IconButton, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import * as qs from 'qs'
import { useTranslation } from 'react-i18next'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import CloseIcon from '../../../assets/icons/CloseIcon'
import Label from '../../../../components/Label'
import InputPassword from '../../../../components/Inputs/InputPasswordNew'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'

export default function ChangePassWordDialog({ open, setOpen }) {
  const [canChange, setCanChange] = useState(false)
  const methods = useForm()

  const onSubmit = (data) => {
    console.log(data)
    changePassword({ confirm_password: data.first_pass, new_password: data.second_pass })
    // setOpen(false)
    // navigate(`/products${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    setCanChange(methods.getValues('first_pass') === methods.getValues('second_pass') && methods.getValues('second_pass')?.length === 8)
  }, [methods.watch('first_pass'), methods.watch('second_pass')])

  const { mutate: changePassword } = useMutation(requests.changePassword, {
    onSuccess: () => {
      success('Заказ успешно передан оператору!')
      setOpen(false)
      // navigate(`/products${requestParams}`)
      // refetch()
    },
    onError: (err) => {
      error('Ошибка при назначении заказа оператору!')
      console.log('err', err)
    },
  })
  const { t } = useTranslation()
  return (
    <StyledEmptyDialog open={open} title={t('change_password.label')} onClose={setOpen} customButtons={<CloseIcon onClick={() => setOpen(false)} />}>
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
            // stroke: '#868FAA',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box>
            <Box width={'100%'}>
              <Label mb='4px'>Parolni kiriting</Label>
              <InputPassword fullWidth name='first_pass' placeholder='Fikr kiriting' />
            </Box>
            <Box height={'24px'} />
            <Box width={'100%'}>
              <Label mb='4px'>Parolni qaytadan kiriting</Label>
              <InputPassword noMargin fullWidth name='second_pass' placeholder='Fikr kiriting' />
            </Box>
          </Box>
          <Box height={'24px'} />

          <Box
            sx={{
              '& .react-datepicker-popper': {
                transform: 'translate(596px, 530px) !important',
              },
            }}
            rowGap={3}
            flexWrap='wrap'
            display='flex'
            component='form'
            onSubmit={methods.handleSubmit(onSubmit, onError)}
          >
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button disabled={!canChange} fullWidth variant='contained' type='submit'>
                {t('change')}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
