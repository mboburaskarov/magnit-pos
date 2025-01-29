import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import * as qs from 'qs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import InputDateRangePicker from '../../../../components/Inputs/InputDateRangePicker'
import InputRange from '../../../../components/Inputs/InputRange'
import SelectSimple from '../../../../components/Select/SelectSimple'
import getOptionsFromUrlParam from '../../../../utils/getOptionsFromUrlParam'
import { requests } from '../../../../utils/requests'
import { imports_list_statuses } from '../../../assets/data/imports-list-statuses'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import LazySelect from '../../../../components/Select/LazySelect'

export default function FilterMenu({ open, setOpen }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 20, offset: 0 }))

  const onSubmit = (data) => {
    const requestBody = {
      received_amount_from: data.received_amount_from || undefined,
      received_amount_to: data.received_amount_to || undefined,
      status: data.status?.value || undefined,
      import_date: data.import_date || undefined,
      store_id: data.store_id?.id || undefined,
      start_date: startDate != 0 ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
      end_date: endDate != 0 ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/products/import${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    const { received_amount_to, start_date, end_date, status, import_date, received_amount_from, store_id } = values

    reset(
      {
        store_id: store_id ? getOptionsFromUrlParam(store_id, shopList?.data?.data?.data, 'name')[0] : null,
        received_amount_to: received_amount_to,
        received_amount_from: received_amount_from,
        status: status ? getOptionsFromUrlParam(status, imports_list_statuses, 'name')[0] : null,
        import_date: import_date,
        start_date: start_date,
        end_date: end_date,
      },
      { keepDirty: true }
    )
  }, [
    values?.store_id,
    values?.status,
    values?.start_date,
    values?.end_date,
    values?.received_amount_to,
    values?.received_amount_from,
    values?.import_date,
    shopList,
  ])
  const theme = useTheme()

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/products/import?offset=0&limit=${values?.limit || 5}`)
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
              placeholder={'Выберите клиент'}
              minWidth='auto'
              isClearable={false}
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
            <InputDateRangePicker
              id='import-date'
              name='date'
              noValidation
              label={'Дата импорта'}
              minWidth='auto'
              placeholder={'Дата импорта'}
              fullWidth
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              control={control}
            />

            <SelectSimple
              fullWidth
              id='categ'
              white
              name='status'
              minWidth='auto'
              label={'Статус'}
              placeholder={'Bыберите статус'}
              options={imports_list_statuses.map((item) => ({ name: get(item, 'name'), value: get(item, 'id') }))}
              getOptionLabel={(el) => el.name}
            />

            <InputRange
              fullWidth
              id='prixwce'
              label={'Полученная сумма'}
              name1='received_amount_from'
              name2='received_amount_to'
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
