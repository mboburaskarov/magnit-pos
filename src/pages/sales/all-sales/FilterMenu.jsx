import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import * as qs from 'qs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import InputRange from '../../../../components/Inputs/InputRange'
import SelectSimple from '../../../../components/Select/SelectSimple'
import getOptionsFromUrlParam from '../../../../utils/getOptionsFromUrlParam'
import { requests } from '../../../../utils/requests'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import LazySelect from '../../../../components/Select/LazySelect'

export default function FilterMenu({ open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control, getValues } = methods

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 20, offset: 0 }))
  const { data: vendorList } = useQuery('vendorlist', () => requests.getAllVendors({ limit: 20, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ limit: 20, offset: 0 }))
  const { data: producers } = useQuery('producers', () => requests.getAllProducer({ limit: 20, offset: 0 }))

  const onSubmit = (data) => {
    setRegions(data.regions || [])

    const requestBody = {
      category_id: data.category_id?.id || undefined,
      employee_id: data.employee_id?.id || undefined,
      total_amount_from: data.total_amount_from || undefined,
      total_amount_to: data.total_amount_to || undefined,
      retail_price_from: data.retail_price_from || undefined,
      retail_price_to: data.retail_price_to || undefined,
      store_id: data.store_id?.id || undefined,
      producer: data.producer?.name || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/sales/all${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    const { total_amount_to, retail_price_to, employee_id, total_amount_from, retail_price_from, category_id, store_id, producer } = values

    reset(
      {
        category_id: category_id ? getOptionsFromUrlParam(category_id, categories?.data?.data?.data)[0] : null,
        producer: producer ? getOptionsFromUrlParam(producer, producers?.data?.data?.data)[0] : null,
        employee_id: employee_id ? getOptionsFromUrlParam(employee_id, vendorList?.data?.data?.data, 'full_name')[0] : null,
        store_id: store_id ? getOptionsFromUrlParam(store_id, shopList?.data?.data?.data, 'name')[0] : null,
        total_amount_to: total_amount_to,
        total_amount_from: total_amount_from,
      },
      { keepDirty: true }
    )
  }, [
    values?.producer,
    values?.employee_id,
    values?.category_id,
    values?.store_id,
    values?.total_amount_to,
    values?.total_amount_from,
    categories,
    producers,
    shopList,
  ])
  const theme = useTheme()

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/sales/all?offset=0&limit=${values?.limit || 5}`)
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
            {/* <SelectSimple
              fullWidth
              id='sto'
              name='store_id'
              white
              minWidth='auto'
              label={t('input.store.label')}
              placeholder={t('input.store.placeholder')}
              getOptionLabel={(el) => el.name}
              options={shopList?.data?.data?.data}
            /> */}
            <LazySelect
              slug='users'
              boxStyle={{ width: '100%' }}
              id='store'
              name='store_id'
              isMulti={false}
              placeholder={t('Выберите Магазин')}
              minWidth='auto'
              isClearable={true}
              label={t('input.store.label')}
              request={requests.getAllShops}
              filters={{ limit: 10 }}
              control={control}
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return <Typography color='grey.600'>{option.name}</Typography>
              }}
              filterOption={() => true}
            />
            <LazySelect
              slug='users'
              boxStyle={{ width: '100%' }}
              id='store'
              name='category_id'
              isMulti={false}
              label={t('input.category.label')}
              placeholder={t('input.category.placeholder')}
              minWidth='auto'
              isClearable={true}
              request={requests.getAllCategories}
              filters={{ limit: 10 }}
              control={control}
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return <Typography color='grey.600'>{option.name}</Typography>
              }}
              filterOption={() => true}
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
            <LazySelect
              slug='employee_id'
              boxStyle={{ width: '100%' }}
              id='employee_id'
              name='employee_id'
              customLabel='full_name'
              isMulti={false}
              placeholder={'Выберите Сотрудники'}
              minWidth='auto'
              isClearable={true}
              label={'Сотрудники'}
              request={requests.getAllVendors}
              filters={{ limit: 10 }}
              control={control}
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return <Typography color='grey.600'>{option.name}</Typography>
              }}
              filterOption={() => true}
            />
            <InputRange
              fullWidth
              id='prixwce'
              label={'Общая сумма'}
              name1='total_amount_from'
              name2='total_amount_to'
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
