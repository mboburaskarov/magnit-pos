import { Box, Container } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { error, success } from '../../../../utils/toast'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useNavigate } from 'react-router-dom'
import LoadingContainer from '../../../../components/LoadingContainer'
import ProductBody from '../ProductBody'
import Header from '../../../../components/Header'

export default function ProductCreatePage() {
  const methods = useForm()
  const navigate = useNavigate()

  useEffect(() => {
    methods.register('categories')
    return
  }, [])

  const { mutate: createProduct, isLoading: isCreatingProduct } = useMutation(requests.createProduct, {
    onSuccess: () => {
      navigate('/products')
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
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
      is_new: Boolean(data?.is_new),
      preparationTime: data?.preparation_time?.time || 0,
      sellDate: '2023-08-01T11:36:45.660Z',
      status: 'ACTIVE',
      files: data?.images?.map((el) => el.key) || [],
      hashtag: data?.hashtag !== '' ? data?.hashtag?.map((el) => el.id) : [],
      type: data?.app_type,
      size: { name: data?.size_name?.value, height: Number(data?.height), width: Number(data?.width) },
    }

    createProduct(requestBody)
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  return (
    <LoadingContainer readyState={true}>
      <Box pb={10}>
        <Header
          isLoading={isCreatingProduct}
          buttonText='Создать'
          backIcon
          backHref='/products'
          text='Новый продукт'
          checkAccessId={'product-create'}
          onSubmit={methods.handleSubmit(onSubmit, onError)}
        />
        <Container>
          <FormProvider {...methods}>
            <Box flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <ProductBody />
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </LoadingContainer>
  )
}
