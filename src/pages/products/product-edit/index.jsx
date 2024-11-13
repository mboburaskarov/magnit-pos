import { Box, Container } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import Header from '../../../../components/Header'
import { FormProvider, useForm } from 'react-hook-form'
import ProductBody from '../ProductBody'
import { error, success } from '../../../../utils/toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'

export default function ProductEditPage() {
  const { id } = useParams()
  const methods = useForm()
  const navigate = useNavigate()

  const { data: productData, isLoading: productDataLoading } = useQuery(['productData', id], () => requests.getSingleProduct(id), { enabled: !!id })

  const { mutate: updateProduct, isLoading: isUpdatingProduct } = useMutation(requests.updateProduct, {
    onSuccess: () => {
      navigate('/products')
      success('Продукт успешно изменен!')
    },
    onError: (err) => {
      error('Ошибка при редактировании товара!')
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      name: data?.product_name,
      dbId: data?.shop?._id,
      categories: data?.categories?.map((el) => el._id),
      quantityOfCategories: data?.categories?.map((el) => Number(el.quantity)).filter((elm) => !!elm),
      description: data?.description,
      cost: Number(data?.product_price),
      isDiscount: Boolean(data?.product_price_with_discount),
      discountCost: Number(data?.product_price_with_discount),
      isFastDelivery: Boolean(data?.is_fast_delivery),
      is_new: data?.is_new === 'true',
      preparationTime: data?.preparation_time?.time || 0,
      files: data?.images?.map((el) => el.key) || [],
      hashtag: data?.hashtag?.map((el) => el.id) || [],
      type: data?.app_type,
      size: { name: data?.size_name?.value, height: Number(data?.height), width: Number(data?.width) },
    }
    updateProduct({ id, data: requestBody })
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  return (
    <LoadingContainer readyState={!productDataLoading}>
      <Box pb={10}>
        <Header
          isLoading={isUpdatingProduct}
          buttonText='Редактировать'
          backIcon
          backHref='/products'
          text='Редактирование продукта'
          onSubmit={methods.handleSubmit(onSubmit, onError)}
          checkAccessId={'product-edit'}
        />
        <Container>
          <FormProvider {...methods}>
            <Box flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <ProductBody productData={productData?.data} />
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </LoadingContainer>
  )
}
