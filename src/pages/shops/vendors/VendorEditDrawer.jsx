import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import SectionTitle from '../../../../components/SectionTitle'
import dayjs from 'dayjs'
import { FormProvider, useForm } from 'react-hook-form'
import VendorBody from './VendorBody'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { LoadingButton } from '@mui/lab'
import CheckAccess from '../../../../components/CheckAccess'

export default function VendorEditDrawer({ isOpen, id, onClose, refetch }) {
  const methods = useForm()

  const { data: vendorData, isLoading: vendorDataLoading } = useQuery(['vendorData', id], () => requests.getSingleVendor(id), { enabled: !!id })

  const { mutate: updateVendor, isLoading: isUpdatingVendor } = useMutation(requests.updateVendor, {
    onSuccess: () => {
      success('Bендор успешно редактирован!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при редактирования вендора!')
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
    }
    updateVendor({ id: id, data: requestBody })
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  return (
    <CardDrawer
      isLoading={vendorDataLoading}
      closeDrawer={onClose}
      title={
        <Box display='inline-flex'>
          <Typography fontSize={32} variant='h2'>
            Редактировать вендор
          </Typography>
        </Box>
      }
      isOpen={isOpen}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <CheckAccess id={'vendor-edit'}>
            <LoadingButton variant='contained' loading={isUpdatingVendor} onClick={methods.handleSubmit(onSubmit, onError)} fullWidth>
              Редактировать
            </LoadingButton>
          </CheckAccess>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <VendorBody vendorData={vendorData?.data} />
      </FormProvider>
    </CardDrawer>
  )
}
