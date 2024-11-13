import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import { FormProvider, useForm } from 'react-hook-form'
import CategoryBody from './CategoryBody'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { LoadingButton } from '@mui/lab'

export default function CategoryEditDrawer({ isOpen, id, onClose, refetch }) {
  const methods = useForm()

  const { data: categoryData } = useQuery(['categoryData', id], () => requests.getSingleCategory(id), { enabled: !!id })

  const { mutate: updateCategory, isLoading: isUpdatingCategory } = useMutation(requests.updateCategory, {
    onSuccess: () => {
      success('Категория успешно редактирован!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при редактирования категория!')
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

    updateCategory({ id: id, data: requestBody })
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
            Изменить категорию
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box width='100%' display='inline-flex'>
          <LoadingButton variant='contained' loading={isUpdatingCategory} onClick={methods.handleSubmit(onSubmit, onError)} fullWidth>
            Редактировать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <CategoryBody categoryData={categoryData?.data} />
      </FormProvider>
    </CardDrawer>
  )
}
