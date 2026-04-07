import { Box, Button } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import * as qs from 'qs'
import { useTranslation } from 'react-i18next'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import CloseIcon from '@icons/CloseIcon'
import Label from '@components/Label'
import InputPassword from '@components/Inputs/InputPasswordNew'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import { useTheme } from '@mui/styles'

export default function ChangePassWordDialog({ open, setOpen }) {
  const [canChange, setCanChange] = useState(false)
  const methods = useForm()

  const onSubmit = (data) => {
    changePassword({ confirm_password: data.first_pass, new_password: data.second_pass })
  }

  const onError = (err) => {
    console.error('err', err)
  }

  useEffect(() => {
    setCanChange(methods.getValues('first_pass') === methods.getValues('second_pass'))
  }, [methods.watch('first_pass'), methods.watch('second_pass')])

  const { mutate: changePassword } = useMutation(requests.changePassword, {
    onSuccess: () => {
      success('Пароль изменен!')
      setOpen(false)
    },
    onError: (err) => {
      error('Ошибка смены пароля!')
      console.error('err', err)
    },
  })
  const theme = useTheme()
  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      open={open}
      title={'Изменить пароль'}
      onClose={setOpen}
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
        }}
      >
        <FormProvider {...methods}>
          <Box>
            <Box width={'100%'}>
              <Label mb='4px'>Введите пароль</Label>
              <InputPassword fullWidth name='first_pass' placeholder='Введите пароль' />
            </Box>
            <Box height={'24px'} />
            <Box width={'100%'}>
              <Label mb='4px'>Повторно введите пароль</Label>
              <InputPassword noMargin fullWidth name='second_pass' placeholder='Повторно введите пароль' />
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
                Изменять
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
