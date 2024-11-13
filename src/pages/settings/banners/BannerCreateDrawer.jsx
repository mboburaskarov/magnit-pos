import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import SectionTitle from '../../../../components/SectionTitle'
import dayjs from 'dayjs'
import { FormProvider, useForm } from 'react-hook-form'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation } from 'react-query'
import { LoadingButton } from '@mui/lab'
import BannerCreateBody from './BannerCreateBody'

export default function BannerCreateDrawer({ isOpen, onClose, refetch }) {
  const methods = useForm()
  const { mutate, isLoading: createBannerLoading } = useMutation(requests.createBanner, {
    onSuccess: () => {
      success('Баннер успешно создан!')

      onClose()
      refetch()
    },
    onError: (err) => {
      error('Ошибка при создании баннера!')
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    mutate({
      type: data?.banner_type?.id,
      value: data?.shop_value?.id || data?.product_value,
      region: data?.region?.id,
      imageRu: data?.image_ru?.[0]?.key,
      imageUz: data?.image_uz?.[0]?.key,
      imageEn: data?.image_uz?.[0]?.key,
      appType: data?.appType?.id,
    })
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
            Создать Баннер
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <LoadingButton onClick={methods.handleSubmit(onSubmit, onError)} loading={createBannerLoading} variant='contained' fullWidth>
            Создать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <BannerCreateBody />
      </FormProvider>
    </CardDrawer>
  )
}
