import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import { FormProvider, useForm } from 'react-hook-form'
import CategoryBody from './CategoryBody'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation } from 'react-query'
import { LoadingButton } from '@mui/lab'

export default function CategoryCreateDrawer({ isOpen, onClose, refetch }) {
  const methods = useForm()

  const { mutate: createCategory, isLoading: isCreatingCategory } = useMutation(requests.createCategory, {
    onSuccess: () => {
      success('Категория успешно создана!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании категории!')
      refetch()
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      ...(data?.parentCategory && { subId: data?.parentCategory?._id }),
      type: data?.type_category,
      nameUz: data?.nameUz,
      nameRu: data?.nameRu,
      nameEn: data?.nameUz,
      icon: data?.images?.[0]?.key,
      dimensionalType: data?.dimensional_type,
      ICPSCode: data?.ICPSCode,
      packageCode: data?.packageCode,
      bgColor: data?.bgColor,
    }
    createCategory(requestBody)
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
            Создать категорию
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box width='100%' display='inline-flex'>
          <LoadingButton variant='contained' loading={isCreatingCategory} onClick={methods.handleSubmit(onSubmit, onError)} fullWidth>
            Создать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <CategoryBody />
      </FormProvider>
    </CardDrawer>
  )
}
