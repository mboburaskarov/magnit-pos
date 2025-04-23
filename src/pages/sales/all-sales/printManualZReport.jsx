import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import InputDateRangePicker from '../../../../components/Inputs/InputDateRangePicker'
import LazySelect from '../../../../components/Select/LazySelect'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function PrintManualZReport({ open, setManualZreportData, refetch, setOpen, handlePrint }) {
  const methods = useForm()
  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const [reportFilter, setReportFilter] = useState(0)
  const [endDate, setEndDate] = useState(0)

  const { data: saleStatsData } = useQuery(['saleStatsData', reportFilter], () => requests.getAllSaleStats(reportFilter), { enabled: !!reportFilter })
  useEffect(() => {
    if (saleStatsData) {
      setManualZreportData({ data: get(saleStatsData, 'data.data', []), filter: reportFilter })
      setTimeout(() => {
        handlePrint()
        setStartDate(0)
        setEndDate(0)
        setOpen(false)
      }, 500)
    }
  }, [saleStatsData])

  const onSubmit = (data) => {
    if (!startDate || !endDate) {
      error('Пожалуйста, заполните все поля!')
      return
    }
    const requestBody = {
      store_id: data?.store_id?.value,
      store_name: data?.store_id?.name,
      start_date: startDate != 0 ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
      end_date: endDate != 0 ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
    }
    setReportFilter(requestBody)
  }

  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.log('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()

  const { t } = useTranslation()
  return (
    <StyledEmptyDialog
      overflowVisible
      onClose={() => setOpen(false)}
      open={open}
      title={'Распечатать отчет'}
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
              white
              name='store_id'
              isMulti={false}
              placeholder={t('Выберите Магазин')}
              minWidth='auto'
              isClearable={true}
              label={t('input.store.label')}
              request={requests.getAllStores}
              required={true}
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
              asteriks
              label={'Дата отчет'}
              minWidth='auto'
              placeholder={'Выберите дата отчет'}
              fullWidth
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              required={true}
              setEndDate={setEndDate}
              control={control}
            />

            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button fullWidth variant='contained' type='submit'>
                Распечатать
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
