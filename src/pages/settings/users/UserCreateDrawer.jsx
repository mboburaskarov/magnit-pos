import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import { FormProvider, useForm } from 'react-hook-form'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation } from 'react-query'
import { LoadingButton } from '@mui/lab'
import UserBody from './UserBody'

export default function UserCreateDrawer({ isOpen: id, onClose, refetch }) {
  const methods = useForm()

  const { mutate: createAdmin, isLoading: isCreatingAdmin } = useMutation(requests.createAdmin, {
    onSuccess: () => {
      success('Пользователь успешно создан!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании пользователя!')
      refetch()
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      fullName: data?.full_name,
      phone: '+998' + data?.phone_number?.replace(/[X() ]/g, ''),
      password: data?.password,
      type: data?.type?.name,
    }
    createAdmin(requestBody)
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  return (
    <CardDrawer
      closeDrawer={onClose}
      title={
        <Box display='inline-flex'>
          <Typography fontSize={32} variant='h2'>
            Создать пользователя
          </Typography>
        </Box>
      }
      isOpen={!!id}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <LoadingButton variant='contained' loading={isCreatingAdmin} onClick={methods.handleSubmit(onSubmit, onError)} fullWidth>
            Создать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <UserBody />
      </FormProvider>
    </CardDrawer>
  )
}
