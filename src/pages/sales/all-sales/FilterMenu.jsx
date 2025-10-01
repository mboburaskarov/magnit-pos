import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import * as qs from 'qs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CheckAccess from '../../../../components/CheckAccess'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import InputRange from '../../../../components/Inputs/InputRange'
import LazySelect from '../../../../components/Select/LazySelect'
import SelectSimple from '../../../../components/Select/SelectSimple'
import getOptionsFromUrlParam from '../../../../utils/getOptionsFromUrlParam'
import { requests } from '../../../../utils/requests'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function FilterMenu({ open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control } = methods
  const userData = useSelector((state) => state.user)

  const { data: paymentTypeList } = useQuery('paymentTypeList', () => requests.getPaymentTypesList({ limit: 20, offset: 0 }))

  const onSubmit = (data) => {
    setRegions(data.regions || [])

    const requestBody = {
      total_amount_from: data.total_amount_from || undefined,
      total_amount_to: data.total_amount_to || undefined,
      store_id: data.store_id?.value || undefined,
      store_name: data.store_id?.name || undefined,
      vendor_id: data.vendor_id?.value || undefined,
      vendor_name: data.vendor_id?.name || undefined,
      sale_type: data?.sale_type?.value || undefined,
      type: data?.type?.value || undefined,
      cashbox_id: data.cashbox_id?.value || undefined,
      cashbox_name: data.cashbox_id?.name || undefined,
      payment_type_id: data?.payment_type_id?.id || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/sales/all-sales${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    const { total_amount_to, total_amount_from, store_id, payment_type_id, sale_type, type, cashbox_id, vendor_id } = values

    reset(
      {
        payment_type_id: payment_type_id ? getOptionsFromUrlParam(payment_type_id, paymentTypeList?.data?.data, 'name')[0] : null,
        sale_type: sale_type
          ? getOptionsFromUrlParam(
              sale_type,
              [
                { id: 'SALE', name: 'Продажа' },
                { id: 'RETURN', name: 'Возврат' },
              ],
              'name'
            )[0]
          : null,
        type: type
          ? getOptionsFromUrlParam(
              type,
              [
                { value: 'FiscalSign', name: 'Незаконченный' },
                { value: 'TaxFree', name: 'Направленный' },
              ],
              'name'
            )[0]
          : null,
        vendor_id: vendor_id ? { name: values?.vendor_name, value: values?.vendor_id } : null,
        cashbox_id: cashbox_id ? { name: values?.cashbox_name, value: values?.cashbox_id } : null,
        store_id: store_id ? { name: values?.store_name, value: values?.store_id } : null,
        total_amount_to: total_amount_to || null,
        total_amount_from: total_amount_from || null,
      },
      { keepDirty: true }
    )
  }, [
    values?.payment_type_id,
    values?.vendor_id,
    values?.sale_type,
    values?.type,
    values?.cashbox_id,
    values?.category_id,
    values?.store_id,
    values?.total_amount_to,
    values?.total_amount_from,
  ])
  const theme = useTheme()

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/sales/all-sales?offset=0&limit=${values?.limit || 5}`)
  }
  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      onClose={() => setOpen(false)}
      overflowVisible
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
            <Box maxHeight={'calc(100vh - 280px)'} px={'5px'} width={'100%'} overflow={'visible'}>
              <SelectSimple
                fullWidth
                id='sto'
                name='type'
                white
                minWidth='auto'
                label={'Статус продаж'}
                placeholder={t('Выберите статус продаж')}
                getOptionLabel={(el) => el.name}
                options={[
                  { value: 'FiscalSign', name: 'Незаконченный' },
                  { value: 'TaxFree', name: 'Направленный' },
                ]}
              />
              <Box height={'20px'} />
              <SelectSimple
                fullWidth
                id='sto'
                name='sale_type'
                white
                minWidth='auto'
                label={'Тип продажа'}
                placeholder={t('Выберите тип продажа')}
                getOptionLabel={(el) => el.name}
                options={[
                  { value: 'SALE', name: 'Продажа' },
                  { value: 'RETURN', name: 'Возврат' },
                ]}
              />
              <Box height={'20px'} />

              <SelectSimple
                fullWidth
                id='sto'
                name='payment_type_id'
                white
                minWidth='auto'
                label={'Тип оплаты'}
                placeholder={t('Выберите тип оплаты')}
                getOptionLabel={(el) => el.name}
                options={paymentTypeList?.data?.data}
              />
              <CheckAccess id={'can-filter-salaes-by-store'}>
                <Box height={'20px'} />
                <LazySelect
                  slug='users'
                  boxStyle={{ width: '100%' }}
                  id='store'
                  white
                  name='store_id'
                  isMulti={false}
                  placeholder={t('Выберите Аптека')}
                  minWidth='auto'
                  isClearable={true}
                  label={t('input.store.label')}
                  request={requests.getAllStores}
                  filters={{ limit: 100 }}
                  control={control}
                  getOptionLabel={(option) => {
                    return option.name
                  }}
                  filterOption={() => true}
                />
              </CheckAccess>
              <Box height={'20px'} />

              <LazySelect
                slug='vendor_id'
                boxStyle={{ width: '100%' }}
                id='vendor_id'
                name='vendor_id'
                customLabel='full_name'
                isMulti={false}
                placeholder={'Выберите Продавец'}
                minWidth='auto'
                isClearable={true}
                label={'Продавец'}
                request={requests.getAllVendors}
                filters={{ limit: 10, store_id: userData?.store?.id || undefined }}
                control={control}
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
              <Box height={'20px'} />

              <LazySelect
                slug='cashbox_id'
                boxStyle={{ width: '100%' }}
                id='cashbox_id'
                name='cashbox_id'
                customLabel='name'
                isMulti={false}
                placeholder={'Выберите Касса'}
                minWidth='auto'
                isClearable={true}
                label={'Касса'}
                request={requests.getAllCashBoxList}
                filters={{ limit: 10 }}
                control={control}
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
              <Box height={'20px'} />

              <InputRange
                fullWidth
                id='prixwce'
                label={'Общая сумма'}
                name1='total_amount_from'
                name2='total_amount_to'
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
