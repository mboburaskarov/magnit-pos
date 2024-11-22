import { Box, Button, IconButton, Typography } from '@mui/material'
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
import StyledEmptyDialog from '../../../components/Dialogs/StyledeEmptyDialog'
import CloseIcon from '../../assets/icons/CloseIcon'

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
      category_id: data.category?.id || undefined,
      from_price: data.from_price || undefined,
      to_price: data.to_price || undefined,
      shop_id: data.shop?.id || undefined,
      hashtag_id: data.hashtag?.id || undefined,
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
        category: category_id ? getOptionsFromUrlParam(category_id, categories?.data?.data, 'name') : null,
        // hashtag: hashtag_id ? getOptionsFromUrlParam(hashtag_id, hashtags?.data, 'nameRu') : null,
        shop: shop_id ? getOptionsFromUrlParam(shop_id, shopList?.data?.data) : null,
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
    <StyledEmptyDialog open={open} title={'Filter'} customButtons={<CloseIcon onClick={() => setOpen(false)} />}>
      <Box
        sx={{
          width: '100%',
          padding: '24px',
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <SelectSimple
              fullWidth
              id='shop'
              name='shop'
              white
              minWidth='auto'
              label="Do'kon"
              placeholder="Do'konni tanlang"
              getOptionLabel={(el) => el.name}
              options={shopList?.data?.data}
            />
            <SelectSimple
              fullWidth
              id='category'
              white
              name='category'
              minWidth='auto'
              label='Kategoriya'
              placeholder='Kategoriyani tanlang'
              options={categories?.data?.data}
              getOptionLabel={(el) => el.name}
            />
            <SelectSimple
              fullWidth
              id='hashtag'
              name='hashtag'
              white
              minWidth='auto'
              label='Ishlab chiqaruvchi'
              placeholder='Ishlab chiqaruvchini tanlang'
              options={hashtags?.data}
              getOptionLabel={(el) => el.nameRu}
            />
            <InputRange fullWidth id='prixwce' label='Sotib olish narxi' name1='from_price' name2='to_price' placeholder1='dan' placeholder2='gacha' />
            <InputRange fullWidth id='prixwce' label='Sotish narxi' name1='from_price' name2='to_price' placeholder1='dan' placeholder2='gacha' />
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button
                sx={{ bgcolor: '#fff !important', border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                disabled={!formState.isDirty}
                onClick={resetFilter}
              >
                <Typography fontWeight={600} lineHeight={'24px'} fontSize={'16px'}>
                  Standart sozlama
                </Typography>
              </Button>
              <Button fullWidth variant='contained' type='submit'>
                Saqlash
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
