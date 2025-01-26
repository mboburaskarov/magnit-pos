import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import * as qs from 'qs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '../../../components/Dialogs/StyledeEmptyDialog'
import InputRange from '../../../components/Inputs/InputRange'
import SelectSimple from '../../../components/Select/SelectSimple'
import getOptionsFromUrlParam from '../../../utils/getOptionsFromUrlParam'
import { requests } from '../../../utils/requests'
import CloseIcon from '../../assets/icons/CloseIcon'
import { useQueryParams } from '../../hooks/useQueryParams'

export default function FilterMenu({ refetch, open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset } = methods

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 100, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ limit: 20, offset: 0 }))
  const { data: producers } = useQuery('producers', () => requests.getAllProducer({ limit: 20, offset: 0 }))

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
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })
    reset(
      {
        supply_price_to: null,
        retail_price_to: null,
        supply_price_from: null,
        retail_price_from: null,
      },
      { keepDirty: true }
    )
    setOpen(false)
    navigate(`/products/all${requestParams}`)
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
        store_id: store_id ? getOptionsFromUrlParam(store_id, shopList?.data?.data?.data, 'name')[0] : null,
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
  const theme = useTheme()

  const resetFilter = () => {
    reset(
      {
        supply_price_to: null,
        retail_price_to: null,
        supply_price_from: null,
        retail_price_from: null,
      },
      { keepDirty: true }
    )
    reset()
    methods.setValue('')
    setOpen(false)
    navigate(`/products/all?offset=0&limit=${values?.limit || 5}`)
  }
  const { t } = useTranslation()
  return (
    <StyledEmptyDialog open={open} title={t('filter_dialog.label')} customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}>
      <Box
        sx={{
          width: '100%',
          padding: '24px',
          '& .MuiInputBase-root': {
            border: `2px solid`,
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
              label={t('input.store.label')}
              placeholder={t('input.store.placeholder')}
              getOptionLabel={(el) => el.name}
              options={shopList?.data?.data?.data}
            />
            <SelectSimple
              fullWidth
              id='categ'
              white
              name='category_id'
              minWidth='auto'
              label={t('input.category.label')}
              placeholder={t('input.category.placeholder')}
              options={categories?.data?.data}
              getOptionLabel={(el) => el.name}
            />
            <SelectSimple
              fullWidth
              id='produ'
              name='producer'
              white
              minWidth='auto'
              label={t('input.manufacturer.label')}
              placeholder={t('input.manufacturer.placeholder')}
              options={producers?.data?.data}
              getOptionLabel={(el) => el.name}
            />
            <InputRange
              fullWidth
              id='prixwce'
              label={t('input.supply_price.label')}
              name1='supply_price_from'
              name2='supply_price_to'
              placeholder1={t('input.price.from')}
              placeholder2={t('input.price.to')}
            />
            <InputRange
              fullWidth
              id='prixwce'
              label={t('input.retail_price.label')}
              name1='retail_price_from'
              name2='retail_price_to'
              placeholder1={t('input.price.from')}
              placeholder2={t('input.price.to')}
            />
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button
                sx={{ bgcolor: `${theme.palette.background.gray} !important`, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                disabled={!formState.isDirty}
                onClick={resetFilter}
              >
                <Typography fontWeight={600} lineHeight={'24px'} fontSize={'16px'}>
                  {t('filter_dialog.reset.label')}
                </Typography>
              </Button>
              <Button fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
