import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import { FormProvider, useForm } from 'react-hook-form'
import UserBody from './UserBody'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { LoadingButton } from '@mui/lab'

export default function UserEditDrawer({ isOpen, id, onClose, refetch }) {
  const methods = useForm()
  const { data: userData, isLoading: userDataLoading } = useQuery(['userData', id], () => requests.getSingleAdmin(id), { enabled: !!id })
  const { mutate: updateAdmin, isLoading: isUpdatingAdmin } = useMutation(requests.updateAdmin, {
    onSuccess: () => {
      success('Пользователь успешно редактирован!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при редактирования пользователя!')
      refetch()
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      fullName: data?.full_name,
      phone: '+998' + data?.phone_number?.replace(/[X() ]/g, ''),
      password: data?.password ? data?.password : undefined,
      type: data?.type?.code,
    }
    updateAdmin({ id: id, data: requestBody })
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  return (
    <CardDrawer
      isLoading={userDataLoading}
      closeDrawer={onClose}
      title={
        <Box display='inline-flex'>
          <Typography fontSize={32} variant='h2'>
            Редактировать пользователя
          </Typography>
        </Box>
      }
      isOpen={isOpen}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <LoadingButton variant='contained' loading={isUpdatingAdmin} onClick={methods.handleSubmit(onSubmit, onError)} fullWidth>
            Редактировать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <UserBody userData={userData?.data} />
      </FormProvider>
    </CardDrawer>
  )
}
