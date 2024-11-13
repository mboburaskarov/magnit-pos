import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import SectionTitle from '../../../../components/SectionTitle'
import dayjs from 'dayjs'
import { FormProvider, useForm } from 'react-hook-form'
import VendorBody from './VendorBody'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation } from 'react-query'
import { LoadingButton } from '@mui/lab'

export default function VendorCreateDrawer({ isOpen: id, onClose, refetch }) {
  const methods = useForm()

  const { mutate: createVendor, isLoading: isCreatingVendor } = useMutation(requests.createVendor, {
    onSuccess: () => {
      success('Bендор успешно создан!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании вендора!')
      refetch()
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      fullName: data?.full_name,
      phone: '+998' + data?.phone_number?.replace(/[X() ]/g, ''),
      password: data?.password,
      dbId: data?.shop?._id,
      type: data?.type?.id,
      status: 'ACTIVE',
    }
    createVendor(requestBody)
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
            Создать вендор
          </Typography>
        </Box>
      }
      isOpen={!!id}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <LoadingButton variant='contained' loading={isCreatingVendor} onClick={methods.handleSubmit(onSubmit, onError)} fullWidth>
            Создать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <VendorBody />
      </FormProvider>
    </CardDrawer>
  )
}
