import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import Header from '../../../../../components/Header'
import DateRangeInput from '../../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../../components/LoadingContainer'
import { downloadLinkExcel } from '../../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../../utils/requests'
import thousandDivider from '../../../../../utils/thousandDivider'
import { error } from '../../../../../utils/toast'
import { useQueryParams } from '../../../../hooks/useQueryParams'

export default function DiscountCardReport({ id }) {
  const { values } = useQueryParams()

  const [offsetCount, setOffsetCount] = useState(0)
  const navigate = useNavigate()
  const productHistoryFilter = useMemo(() => {
    const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
    const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)
    return {
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
      limit: values?.limitHistory || 5,
      store_id: values?.store_id,
      offset: values?.offsetHistory || 0,
      search: values?.search,
    }
  }, [values?.limitHistory, values?.offsetHistory, values?.search, values?.start_date, values?.end_date, values?.from_time, values?.to_time])

  const {
    data: discountCartReport,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingdiscountCartReport,
    refetch,
  } = useQuery(['discountCartReport', productHistoryFilter], () => requests.getDiscountCartReport(productHistoryFilter, id))

  useEffect(() => {
    const count = discountCartReport?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [discountCartReport?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: '№',
        colId: 'number',
        minWidth: 60,
        width: 60,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offsetHistory', 0)) + 1 + rowIndex

          return (
            <Typography fontWeight={'600'} fontSize={'16px'} textAlign={'start'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      },

      {
        headerName: 'Aптека',
        colId: 'store_name',
        minWidth: 300,
        maxWidth: 300,
        width: 300,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.store_name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Клиенти',
        colId: 'customer_name',
        flex: 1,
        minWidth: 200,
        cellRenderer: ({ data, rowIndex }) => (
          <Box
            onClick={() =>
              navigate(
                `/sales/all-sales?customer_id=${data?.customer_id}&customer_name=${data?.customer_name}&type=Discount&start_date=${values?.start_date}&end_date=${values?.end_date}&from_time=${values?.from_time}&to_time=${values?.to_time}`
              )
            }
            id={`${'created_at'}-${rowIndex}`}
            whiteSpace='pre-wrap'
          >
            <Typography color={'#fe5000'}>{data?.customer_name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Количество',
        colId: 'check_count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.check_count}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Скидка',
        colId: 'percent',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.percent}%</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Общая сумма',
        colId: 'total_without_discount',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{thousandDivider(data?.total_without_discount, 'сум')} </Typography>
          </Box>
        ),
      },
      {
        headerName: 'Сумма скидки',
        colId: 'total_discount',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{thousandDivider(data?.total_discount, 'сум')} </Typography>
          </Box>
        ),
      },
      {
        headerName: 'Окончательная сумма',
        colId: 'total_with_discount',
        minWidth: 230,
        maxWidth: 230,
        width: 230,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{thousandDivider(data?.total_with_discount, 'сум')}</Typography>
          </Box>
        ),
      },
    ],
    [values]
  )

  const formattedData = discountCartReport?.data?.data?.data
  const { mutate: getDiscountCartReportExcel, isLoading: isgetDiscountCartReportExcel } = useMutation(requests.getDiscountCartReportExcel, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={true}>
      <Header noActions isLoading={false} backIcon backHref='/reports/client' text={'Отчёт: Карта лояльности'} />
      <Box display='flex' mx={'auto'} flexDirection='column' position='relative' pt={'0px'} px={'50px'} pb={'20px'}>
        <Box display={'flex'} sx={{ width: '100%' }}>
          <Box
            sx={{
              mr: '20px',
              mb: '20px',
              '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
              '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                background: 'transparent',
                width: '400px',
                height: 48,
              },
            }}
          >
            <InputSearch fullWidth={true} id='producrs-search' name='search' placeholder={'Клиенти'} uncontrolled />
          </Box>
          <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
        </Box>

        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <AgGridTable
            fullDownload={() => getDiscountCartReportExcel({ ...productHistoryFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => getDiscountCartReportExcel(productHistoryFilter)}
            isDownloading={isgetDiscountCartReportExcel}
            //
            isDataLoading={isproductDataLoadingHistory || isFetchingdiscountCartReport}
            offsetQuery='offsetHistory'
            limitQuery='limitHistory'
            id='products-history-table'
            fullInfoAboutCurrentPage
            totalCount={discountCartReport?.data?.data?._meta?.total_count || 0}
            columns={columns}
            updaterAction={() => {}}
            data={formattedData}
            offsetCount={offsetCount}
            defaultOffsetSize={5}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
