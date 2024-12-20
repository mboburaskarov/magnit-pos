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
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import { useSelector } from 'react-redux'
export default function ProductCreatePage() {
  const { t } = useTranslation()
  const methods = useForm()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)

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
    console.log(data)

    const requestBody = {
      name: get(data, 'name'),
      barcode: get(data, 'barcode'),
      bonus_amount: Number(get(data, 'bonus_amount')),
      bonus_percent: Number(get(data, 'bonus_percent')),
      description: get(data, 'description'),
      expire_date: get(data, 'expire_date'),
      manufacturer: get(data, 'manufacturer'),
      name: get(data, 'name'),
      photos: get(data, 'images', []),
      product_unit: get(data, 'product_unit').map(({ id, ...rest }) => ({
        unit_type_id: id,
        ...rest,
      })),
      quantity: 2,
      retail_price: Number(get(data, 'retail_price')),
      status: 'active',
      store_id: get(userData, 'store_id'),
      store_product: [
        {
          quantity: 2,
          small_quantity: 1,
          store_id: '816afeb0-a73d-4313-8120-9b22600bc9d5',
        },
      ],
      sum: Number(get(data, 'retail_price')),
      supply_price: Number(get(data, 'supply_price')),
      vat: Number(get(data, 'vat')),
      vat_price: Number(get(data, 'vat_price')),
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
          // noActions
          backHref='/products'
          text={t('create_new_product.top.new_product')}
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
