import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import { FormProvider, useForm } from 'react-hook-form'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation } from 'react-query'
import { LoadingButton } from '@mui/lab'
import HashtagBody from './HashtagBody'

export default function HashtagCreateDrawer({ isOpen, onClose, refetch }) {
  const methods = useForm()

  const { mutate: createHashtag, isLoading: isCreatingHashtag } = useMutation(requests.createHashtag, {
    onSuccess: () => {
      success('Хэштег успешно создан!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании хэштега!')
      refetch()
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      type: data?.type_category,
      nameUz: data?.nameUz,
      nameRu: data?.nameRu,
      nameEn: data?.nameUz,
      imageRu: data?.images_ru?.[0]?.key,
      imageUz: data?.images_uz?.[0]?.key,
      image: data?.images_ru?.[0]?.key,
    }
    createHashtag(requestBody)
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
            Создать хэштег
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box width='100%' display='inline-flex'>
          <LoadingButton variant='contained' loading={isCreatingHashtag} onClick={methods.handleSubmit(onSubmit, onError)} fullWidth>
            Создать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <HashtagBody />
      </FormProvider>
    </CardDrawer>
  )
}
