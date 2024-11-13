import { Box, Button, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useQueryParams } from '../../hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import SelectSimple from '../../../components/Select/SelectSimple'
import InputRange from '../../../components/Inputs/InputRange'
import getOptionsFromUrlParam from '../../../utils/getOptionsFromUrlParam'
import * as qs from 'qs'
import StyledTooltip from '../../../components/StyledTooltip'
import ExpressIcon from '../../assets/icons/ExpressIcon'
import LazySelect from '../../../components/Select/LazySelect'

export default function FilterMenu({ open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control, getValues } = methods
  const [isExpress, setIsExpress] = useState(false)

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 1000, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ limit: 1000, offset: 0 }))
  const { data: hashtags } = useQuery('hashtags', () => requests.getAllHashtags({ limit: 1000, offset: 0 }))

  const onSubmit = (data) => {
    setRegions(data.regions || [])
    const requestBody = {
      category_id: data.category?._id || undefined,
      from_price: data.from_price || undefined,
      to_price: data.to_price || undefined,
      shop_id: data.shop?._id || undefined,
      hashtag_id: data.hashtag?._id || undefined,
      isExpress: isExpress || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/products${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    const { hashtag_id, category_id, shop_id, from_price, to_price } = values

    reset(
      {
        category: category_id ? getOptionsFromUrlParam(category_id, categories?.data, 'nameRu') : null,
        hashtag: hashtag_id ? getOptionsFromUrlParam(hashtag_id, hashtags?.data, 'nameRu') : null,
        shop: shop_id ? getOptionsFromUrlParam(shop_id, shopList?.data?.shops) : null,
        from_price: from_price,
        to_price: to_price,
      },
      { keepDirty: true }
    )
  }, [values?.hashtag_id, values.category_id, values.shop_id, values.from_price, values.to_price, categories?.data, hashtags?.data, shopList?.data?.shops])

  const resetFilter = () => {
    reset()
    navigate(`/products?offset=0&limit=${values?.limit || 5}`)
  }

  return (
    <Box
      sx={{
        width: '100%',
        padding: open ? 4 : 0,
        border: `1px solid`,
        borderColor: 'grey.200',
        borderRadius: 4,
        height: open ? 'auto' : 0,
        opacity: open ? 1 : 0,
        transition: open ? 'padding 0.3s ease-out' : 'padding 0.1s ease-in',
        marginTop: open ? 4 : 0,
      }}
    >
      <FormProvider {...methods}>
        <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <Box columnGap={3} display='inline-flex' width='100%'>
            <SelectSimple fullWidth id='shop' name='shop' minWidth='auto' label='Mагазин' placeholder='Выберите магазин' options={shopList?.data.shops} />
            <SelectSimple
              fullWidth
              id='category'
              name='category'
              minWidth='auto'
              label='Kатегория'
              placeholder='Выберите категория'
              options={categories?.data}
              getOptionLabel={(el) => el.nameRu}
            />
          </Box>
          <Box columnGap={3} display='inline-flex' width='100%'>
            <InputRange fullWidth id='price' label='Цена' name1='from_price' name2='to_price' placeholder1='от' placeholder2='до' />
            <SelectSimple
              fullWidth
              id='hashtag'
              name='hashtag'
              minWidth='auto'
              label='Хэштеги'
              placeholder='Выберите хэштег'
              options={hashtags?.data}
              getOptionLabel={(el) => el.nameRu}
            />
          </Box>
          <Box alignItems='flex-end' columnGap={3} display='inline-flex' width='100%'>
            <Box width={'100%'}>
              <LazySelect
                slug='regions'
                id='regions'
                name='regions'
                placeholder={'Выберите регион'}
                minWidth='auto'
                isMulti
                filterOption={(e) => {
                  const regions = Array.isArray(getValues('regions')) ? getValues('regions') : []
                  const isSelected = regions?.find((item) => item?._id === e?.data?._id)
                  if (!isSelected) {
                    return e
                  }
                }}
                request={requests.getAllRegions}
                filters={{ limit: 100 }}
                control={control}
                getOptionLabel={(option) => option?.nameRu || option?.nameUz || option?.nameEn || ''}
              />
            </Box>
            <Box width='100%'>
              <Button fullWidth color='secondary' variant='contained' startIcon={<ExpressIcon />} onClick={() => setIsExpress(!isExpress)}>
                {!isExpress ? 'Показать только экспресс букеты' : 'Показать все продукты'}
              </Button>
            </Box>
          </Box>
          <Box columnGap={2} display='flex' width='100%' mt={4}>
            <Button fullWidth color='secondary' variant='contained' disabled={!formState.isDirty} onClick={resetFilter}>
              Сбросить фильтры
            </Button>
            <Button fullWidth variant='contained' type='submit'>
              Применить фильтры
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  )
}
