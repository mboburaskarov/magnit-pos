import { Box, Container } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import Header from '../../../../components/Header'
import { FormProvider, useForm } from 'react-hook-form'
import ProductBody from '../ProductBody'
import { error, success } from '../../../../utils/toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useEffect } from 'react'
import { get } from 'lodash'
import { useSelector } from 'react-redux'
import ImageGallery from '../../../../components/ImageGallery'

export default function ProductEditPage() {
  const { id } = useParams()
  const methods = useForm()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)

  const { data: productData, isLoading: productDataLoading } = useQuery(['productData', id], () => requests.getSingleProduct(id), { enabled: !!id })

  const { mutate: updateProduct, isLoading: isUpdatingProduct } = useMutation(requests.updateProduct, {
    onSuccess: () => {
      navigate('/products/all')
      success('Продукт успешно изменен!')
    },
    onError: (err) => {
      error('Ошибка при редактировании товара!')
      console.log('err', err)
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
      bonus_amount: Number(get(data, 'bonus_amount')),
      bonus_percent: Number(get(data, 'bonus_percent')),
      description: get(data, 'description'),
      expire_date: get(data, 'expire_date'),
      manufacturer: get(data, 'manufacturer.value'),
      shelf_id: get(data, 'shelf_id.value'),
      name: get(data, 'name'),
      photos: get(data, 'images', []).map((el) => el.file_url),
      category_ids: methods.getValues('category_ids'),
      unit_type_id: get(data, 'product_unit.id'),
      unit_per_pack: Number(get(data, 'box_grain_count')),
      quantity: Object.values(get(data, 'store_product')).reduce((total, product) => {
        return Number(total) + Number(product.quantity)
      }, 0),
      retail_price: Number(get(data, 'retail_price')),
      markup: Number(get(data, 'markup')),
      status: 'active',
      store_id: get(userData, 'store_id'),
      store_product: Object.values(get(data, 'store_product'))
        .filter((item) => Number(get(item, 'pack_quantity'), 0) > 0)
        .map((item) => ({
          ...item,
          pack_quantity: Number(get(item, 'pack_quantity', 0)),
          small_quantity: Number(get(item, 'small_quantity', 0)),
        })),
      sum: Number(get(data, 'retail_price')),
      supply_price: Number(get(data, 'supply_price')),
      vat: Number(get(data, 'vat')),
      vat_price: Number(get(data, 'vat_price')),
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
