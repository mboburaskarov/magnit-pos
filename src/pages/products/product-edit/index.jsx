import { Box, Container } from '@mui/material'
import { get } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../../../components/Header'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import ProductBody from '../ProductBody'

export default function ProductEditPage() {
  const { id } = useParams()
  const methods = useForm()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)

  const { data: productData, isLoading: productDataLoading } = useQuery(['productData', id], () => requests.getSingleProduct({ id }), { enabled: !!id })

  const { mutate: updateProduct, isLoading: isUpdatingProduct } = useMutation(requests.updateProduct, {
    onSuccess: () => {
      methods.reset({})
      navigate('/products/all')
      success('Продукт успешно изменен!')
    },
    onError: (err) => {
      error('Ошибка при редактировании товара!')
      console.error('err', err)
    },
  })
  useEffect(() => {
    methods.register('categories')
    methods.register('category_ids')

    return
  }, [])
  const onSubmit = (data) => {
    const requestBody = {
      barcode: get(data, 'barcode'),
      bonus_percent: Number(get(data, 'bonus_percent')),
      description: get(data, 'description'),
      producer_id: get(data, 'manufacturer.value'),
      shelf_id: get(data, 'shelf_id.value'),
      name: get(data, 'name'),
      photos: get(data, 'images', []).map((el) => el.file_url),
      category_ids: methods.getValues('category_ids'),
      unit_type_id: get(data, 'product_unit.id'),
      unit_per_pack: Number(get(data, 'box_grain_count')),
      quantity: Object.values(get(data, 'store_product')).reduce((total, product) => {
        return Number(total) + Number(product.quantity)
      }, 0),
      status: 'active',
      store_id: get(userData, 'store_id'),
      store_product: Object.values(get(data, 'store_product'))
        .filter((item) => Number(get(item, 'pack_quantity'), 0) > 0 && Number(get(item, 'retail_price'), 0) > 0 && Number(get(item, 'markup'), 0) > 0)
        .map((item) => ({
          ...item,
          retail_price: Number(get(item, 'retail_price', 0)),
          supply_price: Number(get(item, 'supply_price', 0)),
          vat: Number(get(item, 'vat', 0)),
          bonus_amount: Number(get(item, 'bonus_amount', 0)),
          markup: Number(get(item, 'markup', 0)),
          pack_quantity: Number(get(item, 'pack_quantity', 0)),
          small_quantity: Number(get(item, 'small_quantity', 0)),
        })),
    }

    updateProduct({ id, data: requestBody })
  }
  const onError = (err) => {
    console.error('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  return (
    <LoadingContainer readyState={!productDataLoading}>
      <Box pb={10}>
        <Header
          isLoading={isUpdatingProduct}
          buttonText='Редактировать'
          backIcon
          backHref='/products/all'
          text='Редактирование продукта'
          onSubmit={methods.handleSubmit(onSubmit, onError)}
          checkAccessId={'product-edit'}
        />
        <Container>
          <FormProvider {...methods}>
            <Box flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <ProductBody productData={productData?.data?.data} />
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </LoadingContainer>
  )
}
