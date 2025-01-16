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
    methods.register('category_ids')

    return
  }, [])

  const { mutate: createProduct, isLoading: isCreatingProduct } = useMutation(requests.createProduct, {
    onSuccess: () => {
      navigate('/products/all')
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      barcode: get(data, 'barcode'),
      bonus_amount: Number(get(data, 'bonus_amount')),
      bonus_percent: Number(get(data, 'bonus_percent')),
      description: get(data, 'description'),
      expire_date: get(data, 'expire_date'),
      manufacturer: get(data, 'manufacturer'),
      name: get(data, 'name'),
      photos: get(data, 'images', []).map((el) => el.file_url),
      category_ids: methods.getValues('category_ids'),
      unit_type_id: get(data, 'product_unit.id'),
      unit_per_pack: Number(get(data, 'box_grain_count')),

      quantity: Object.values(get(data, 'store_product')).reduce((total, product) => {
        return Number(total) + Number(product.quantity)
      }, 0),
      retail_price: Number(get(data, 'retail_price')),
      status: 'active',
      store_id: get(userData, 'store_id'),
      store_product: Object.values(get(data, 'store_product'))
        .filter((item) => Number(get(item, 'quantity'), 0) > 0)
        .map((item) => ({
          ...item,
          pack_quantity: Number(item.quantity),
          small_quantity: Number(item.small_quantity),
        })),
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
          backHref='/products/all'
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
