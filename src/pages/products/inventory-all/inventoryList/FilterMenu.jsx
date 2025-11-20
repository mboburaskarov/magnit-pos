import { imports_list_statuses } from '@/assets/data/imports-list-statuses'
import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import InputDateRangePicker from '@components/Inputs/InputDateRangePicker'
import LazySelect from '@components/Select/LazySelect'
import SelectSimple from '@components/Select/SelectSimple'
import { useQueryParams } from '@hooks/useQueryParams'
import CloseIcon from '@icons/CloseIcon'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { requests } from '@utils/requests'
import dayjs from 'dayjs'
import { get } from 'lodash'
import * as qs from 'qs'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

export default function FilterMenu({ open, setOpen }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  const theme = useTheme()
  const { t } = useTranslation()

  const onSubmit = (data) => {
    const requestBody = {
      received_amount_from: data.received_amount_from || undefined,
      received_amount_to: data.received_amount_to || undefined,
      status: data.status?.value || undefined,
      status_name: data.status?.name || undefined,
      import_date: data.import_date || undefined,
      store_id: data.store_id?.id || undefined,
      store_name: data.store_id?.name || undefined,
      start_date: startDate != 0 ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
      end_date: endDate != 0 ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/products/inventory${requestParams}`)
  }

  const onError = (err) => {
    console.error('err', err)
  }

  useEffect(() => {
    const { start_date, end_date, status, store_id } = values

    reset(
      {
        store_id: store_id ? { name: values?.store_name, value: values?.store_id } : null,
        status: status ? { name: values?.status_name, value: values?.status } : null,
        start_date: start_date,
        end_date: end_date,
      },
      { keepDirty: true }
    )
  }, [values?.store_id, values?.status, values?.start_date, values?.end_date, shopList])

  const resetFilter = () => {
    reset()
    setOpen(false)
    navigate(`/products/inventory?offset=0&limit=${values?.limit || 5}`)
  }
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
            <LazySelect
              slug='users'
              boxStyle={{ width: '100%' }}
              id='store'
              name='store_id'
              isMulti={false}
              placeholder={t('input.store.placeholder')}
              minWidth='auto'
              isClearable={true}
              label={t('input.store.label')}
              request={requests.getAllStores}
              filters={{ limit: 10 }}
              control={control}
              getOptionLabel={(option) => {
                return option.name
              }}
              filterOption={() => true}
            />
            <InputDateRangePicker
              id='import-date'
              name='date'
              noValidation
              label={'Дата инвентаризация'}
              minWidth='auto'
              placeholder={'Дата инвентаризация'}
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
