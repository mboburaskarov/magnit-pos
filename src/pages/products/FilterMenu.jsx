import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import * as qs from 'qs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import InputRange from '@components/Inputs/InputRange'
import LazySelect from '@components/Select/LazySelect'
import SelectSimple from '@components/Select/SelectSimple'
import getOptionsFromUrlParam from '@utils/getOptionsFromUrlParam'
import { requests } from '@utils/requests'
import CloseIcon from '@icons/CloseIcon'
import { useQueryParams } from '@hooks/useQueryParams'

export default function FilterMenu({ refetch, open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset } = methods

  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 100, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ id: values?.category_id }), {
    enabled: Boolean(get(values, 'category_id', false)),
  })
  const { data: producers } = useQuery(['producers', values], () => requests.getProducer({ id: values?.producer_id }), {
    enabled: Boolean(get(values, 'producer_id', false)),
  })

  const onSubmit = (data) => {
    setRegions(data.regions || [])

    const requestBody = {
      category_id: data.category_id?.value || undefined,
      category_name: data?.category_id?.name || undefined,
      supply_price_from: data.supply_price_from || undefined,
      supply_price_to: data.supply_price_to || undefined,
      retail_price_from: data.retail_price_from || undefined,
      retail_price_to: data.retail_price_to || undefined,
      store_id: data.store_id?.value || undefined,
      company_id: data.company_id?.value || undefined,
      store_name: data.store_id?.name || undefined,
      producer_id: data.producer_id?.value || undefined,
      producer_name: data.producer_id?.name || undefined,
      no_barcode: data.no_barcode?.id || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    reset({
      supply_price_to: null,
      retail_price_to: null,
      supply_price_from: null,
      retail_price_from: null,
    })
    setOpen(false)
    navigate(`/products/all${requestParams}`)
  }

  const onError = (err) => {
    console.error('err', err)
  }

  useEffect(() => {
    const { supply_price_to, no_barcode, retail_price_to, supply_price_from, retail_price_from, category_id, store_id, producer_id } = values

    reset(
      {
        category_id: category_id ? { name: values?.category_name, value: values?.category_id } : null,
        producer_id: producer_id ? { name: values?.producer_name, value: values?.producer_id } : null,
        store_id: store_id ? { name: values?.store_name, value: values?.store_id } : null,
        supply_price_to: supply_price_to || null,
        retail_price_to: retail_price_to || null,
        supply_price_from: supply_price_from || null,
        retail_price_from: retail_price_from || null,
        no_barcode: no_barcode ? getOptionsFromUrlParam(no_barcode, barcodeFilterList, 'name')[0] : null,
      },
      { keepDirty: true }
    )
  }, [
    values?.producer_id,
    values?.category_id,
    values?.no_barcode,
    values?.store_id,
    values?.retail_price_to,
    values?.retail_price_from,
    values?.supply_price_to,
    values?.supply_price_from,
    categories,
    producers,
    shopList,
    open,
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
  const barcodeFilterList = [
    { name: 'Без штрих-кода', id: '1' },
    { name: 'Со штрих-кодом', id: '2' },
  ]
  return (
    <StyledEmptyDialog
      onClose={() => setOpen(false)}
      open={open}
      title={t('filter_dialog.label')}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
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
            <Box padding={'0 2px'} maxHeight={'calc(100vh - 280px)'} width={'100%'}>
              <SelectSimple
                fullWidth
                id='nobarcode'
                white
                name='no_barcode'
                minWidth='auto'
                label={'Штрих-код'}
                placeholder={'Bыберите статус'}
                options={barcodeFilterList}
                getOptionLabel={(el) => el.name}
              />
              <Box height={'20px'} />
              <Box display={'flex'}>
                <LazySelect
                  slug='users'
                  boxStyle={{ width: '100%' }}
                  id='store'
                  name='store_id'
                  isMulti={false}
                  placeholder={t('Выберите Аптека')}
                  minWidth='auto'
                  isClearable={true}
                  label={t('input.store.label')}
                  request={requests.getAllStores}
                  filters={{ limit: 10 }}
                  control={methods.control}
                  getOptionLabel={(option) => {
                    return option.name
                  }}
                  filterOption={() => true}
                />
                <Box width={'20px'} />

                <LazySelect
                  slug='users'
                  boxStyle={{ width: '100%' }}
                  id='company'
                  name='company_id'
                  isMulti={false}
                  placeholder={t('Выберите B2B')}
                  minWidth='auto'
                  isClearable={true}
                  label={t('B2B')}
                  request={requests.getAllCompanies}
                  filters={{ limit: 10 }}
                  control={methods.control}
                  getOptionLabel={(option) => {
                    return option.name
                  }}
                  filterOption={() => true}
                />
              </Box>
              <Box height={'20px'} />
              <Box display={'flex'}>
                <LazySelect
                  slug='users'
                  boxStyle={{ width: '100%' }}
                  id='category_id'
                  name='category_id'
                  isMulti={false}
                  label={t('input.category.label')}
                  placeholder={t('input.category.placeholder')}
                  minWidth='auto'
                  isClearable={true}
                  request={requests.getAllCategories}
                  filters={{ limit: 10 }}
                  control={methods.control}
                  getOptionLabel={(option) => {
                    return option.name
                  }}
                  filterOption={() => true}
                />
                <Box width={'20px'} />

                <LazySelect
                  slug='users'
                  boxStyle={{ width: '100%' }}
                  id='producer'
                  name='producer_id'
                  isMulti={false}
                  label={t('input.manufacturer.label')}
                  placeholder={t('input.manufacturer.placeholder')}
                  minWidth='auto'
                  isClearable={true}
                  request={requests.getProducer}
                  filters={{ limit: 10 }}
                  control={methods.control}
                  getOptionLabel={(option) => {
                    return option.name
                  }}
                  filterOption={() => true}
                />
              </Box>

              <Box height={'20px'} />

              <InputRange
                fullWidth
                id='prixwce'
                label={t('input.supply_price.label')}
                name1='supply_price_from'
                name2='supply_price_to'
                placeholder1={t('input.price.from')}
                placeholder2={t('input.price.to')}
              />
              <Box height={'20px'} />

              <InputRange
                fullWidth
                id='prixwce'
                label={t('input.retail_price.label')}
                name1='retail_price_from'
                name2='retail_price_to'
                placeholder1={t('input.price.from')}
                placeholder2={t('input.price.to')}
              />
              <Box height={'20px'} />
            </Box>
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
