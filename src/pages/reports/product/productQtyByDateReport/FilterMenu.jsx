import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog'
import getOptionsFromUrlParam from '@utils/getOptionsFromUrlParam'
import SelectSimple from '@components/Select/SelectSimple'
import { FormProvider, useForm } from 'react-hook-form'
import { Box, Button, Typography } from '@mui/material'
import LazySelect from '@components/Select/LazySelect'
import InputRange from '@components/Inputs/InputRange'
import { useQueryParams } from '@hooks/useQueryParams'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { requests } from '@utils/requests'
import CloseIcon from '@icons/CloseIcon'
import { useTheme } from '@mui/styles'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { get } from 'lodash'
import * as qs from 'qs'
import InputDatePicker from '@components/Inputs/InputDatePicker'
import dayjs from 'dayjs'

export default function FilterMenu({ refetch, open, setOpen, setRegions }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset } = methods
  const { t } = useTranslation()
  const theme = useTheme()

  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 100, offset: 0 }))

  const onSubmit = (data) => {
    setRegions(data.regions || [])

    const requestBody = {
      date: dayjs(data.date).format('YYYY-MM-DD') || dayjs(new Date()).format('YYYY-MM-DD'),

      store_id: data.store_id?.value || get(shopList, 'data.data.data.0.id'),
      store_name: data.store_name?.label || get(shopList, 'data.data.data.0.name'),
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/reports/product-qty-by-date${requestParams}`)
  }

  const onError = (err) => {
    console.error('err', err)
  }

  useEffect(() => {
    const { store_id, date } = values

    reset(
      {
        date: date ? new Date(date) : new Date(),
        store_id: store_id
          ? { name: values?.store_name, value: values?.store_id }
          : { name: get(shopList, 'data.data.data.0.name'), value: get(shopList, 'data.data.data.0.id') },
      },
      { keepDirty: true },
    )
  }, [values?.store_id, values?.data, shopList, open])

  const resetFilter = () => {
    reset()
    methods.setValue('')
    setOpen(false)
    navigate(`/reports/product-qty-by-date?offset=0&limit=${values?.limit || 5}`)
  }
  const barcodeFilterList = [
    { name: 'Без штрих-кода', id: '1' },
    { name: 'Со штрих-кодом', id: '2' },
  ]
  return (
    <StyledEmptyDialog
      onClose={() => setOpen(false)}
      open={open}
      overflowVisible
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
              <LazySelect
                slug='users'
                boxStyle={{ width: '100%' }}
                id='store'
                name='store_id'
                isMulti={false}
                placeholder={t('Выберите Аптека')}
                minWidth='auto'
                isClearable={true}
                required
                label={t('input.store.label')}
                request={requests.getAllStores}
                filters={{ limit: 10 }}
                control={methods.control}
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
              <Box height={'20px'} />
              <InputDatePicker required defaultValue={new Date()} name='date' id='date' showYearDropdown label='Дата' placeholder='Дата' />

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
