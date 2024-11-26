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
import { theme } from '../../assets/theme'

export default function FilterMenu({ open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control, getValues } = methods
  const [isExpress, setIsExpress] = useState(false)

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 1000, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ limit: 1000, offset: 0 }))
  const { data: producers } = useQuery('producers', () => requests.getAllProducer({ limit: 1000, offset: 0 }))

  const onSubmit = (data) => {
    setRegions(data.regions || [])

    const requestBody = {
      category_id: data.category_id?.id || undefined,
      supply_price_from: data.supply_price_from || undefined,
      supply_price_to: data.supply_price_to || undefined,
      retail_price_from: data.retail_price_from || undefined,
      retail_price_to: data.retail_price_to || undefined,
      store_id: data.store_id?.id || undefined,
      producer: data.producer?.name || undefined,
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
    const { supply_price_to, retail_price_to, supply_price_from, retail_price_from, category_id, store_id, producer } = values

    reset(
      {
        category_id: category_id ? getOptionsFromUrlParam(category_id, categories?.data?.data)[0] : null,
        producer: producer ? getOptionsFromUrlParam(producer, producers?.data?.data)[0] : null,
        store_id: store_id ? getOptionsFromUrlParam(store_id, shopList?.data?.data, 'name')[0] : null,
        supply_price_to: supply_price_to,
        retail_price_to: retail_price_to,
        supply_price_from: supply_price_from,
        retail_price_from: retail_price_from,
      },
      { keepDirty: true }
    )
  }, [
    values?.producer,
    values?.category_id,
    values?.store_id,
    values?.retail_price_to,
    values?.retail_price_from,
    values?.supply_price_to,
    values?.supply_price_from,
    categories,
    producers,
    shopList,
  ])

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/products?offset=0&limit=${values?.limit || 5}`)
  }

  return (
    <StyledEmptyDialog open={open} title={'Filter'} customButtons={<CloseIcon onClick={() => setOpen(false)} />}>
      <Box
        sx={{
          width: '100%',
          padding: '24px',
          '& .MuiInputBase-root': {
            border: `1px solid`,
            borderColor: 'bunker.100',
            height: '48px',
          },
          '& svg': {
            fill: '#868FAA',
            stroke: '#868FAA',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <SelectSimple
              fullWidth
              id='sto'
              name='store_id'
              white
              minWidth='auto'
              label="Do'kon"
              placeholder="Do'konni tanlang"
              getOptionLabel={(el) => el.name}
              options={shopList?.data?.data}
            />
            <SelectSimple
              fullWidth
              id='categ'
              white
              name='category_id'
              minWidth='auto'
              label='Kategoriya'
              placeholder='Kategoriyani tanlang'
              options={categories?.data?.data}
              getOptionLabel={(el) => el.name}
            />
            <SelectSimple
              fullWidth
              id='produ'
              name='producer'
              white
              minWidth='auto'
              label='Ishlab chiqaruvchi'
              placeholder='Ishlab chiqaruvchini tanlang'
              options={producers?.data?.data}
              getOptionLabel={(el) => el.name}
            />
            <InputRange
              fullWidth
              id='prixwce'
              label='Sotib olish narxi'
              name1='supply_price_from'
              name2='supply_price_to'
              placeholder1='dan'
              placeholder2='gacha'
            />
            <InputRange fullWidth id='prixwce' label='Sotish narxi' name1='retail_price_from' name2='retail_price_to' placeholder1='dan' placeholder2='gacha' />
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
