import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import LoadingContainer from '@components/LoadingContainer'
import { memo, useEffect, useMemo, useState } from 'react'
import InputSearch from '@components/Inputs/InputSearch'
import { useQueryParams } from '@hooks/useQueryParams'
import thousandDivider from '@utils/thousandDivider'
import { useMutation, useQuery } from 'react-query'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { requests } from '@utils/requests'
import Header from '@components/Header'
import { error } from '@utils/toast'
import { get } from 'lodash'
import dayjs from 'dayjs'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function LoyaCardReportByUsers() {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const discoundCardFilter = useMemo(() => {
    return {
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      limit: values?.limit || 5,
      store_id: values?.store_id,
      offset: values?.offset || 0,
      search: values?.search,
    }
  }, [values?.limit, values?.offset, values?.search, values?.start_date, values?.end_date, values?.from_time, values?.to_time])

  const {
    data: discountCartReportByUser,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingdiscountCartReportByUser,
    refetch,
  } = useQuery(['discountCartReportByUser', discoundCardFilter], () => requests.getLoyaltyCardTopUsers(discoundCardFilter))

  useEffect(() => {
    const count = discountCartReportByUser?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [discountCartReportByUser?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [discoundCardFilter])

  const columns = useMemo(
    () => [
      {
        headerName: '№',
        colId: 'number',
        minWidth: 60,
        width: 60,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offset', 0)) + 1 + rowIndex

          return (
            <Typography fontWeight={'600'} fontSize={'16px'} textAlign={'start'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      },

      {
        headerName: 'Клиенти',
        colId: 'full_name',
        minWidth: 300,
        maxWidth: 300,
        width: 300,
        cellRenderer: ({ data, rowIndex }) => <SimpleText data={data} type={'full_name'} />,
      },
      {
        headerName: 'Штрихкод карты',
        colId: 'loyalty_card_barcode',
        minWidth: 200,
        maxWidth: 200,
        width: 200,
        cellRenderer: ({ data, rowIndex }) => <SimpleText data={data} type={'loyalty_card_barcode'} />,
      },
      {
        headerName: 'Уровень карты',
        colId: 'loyalty_card_level_name',
        minWidth: 180,
        maxWidth: 180,
        width: 180,
        cellRenderer: ({ data, rowIndex }) => <SimpleText data={data} type={'loyalty_card_level_name'} />,
      },
      {
        headerName: 'Процент скидки',
        colId: 'loyalty_card_percent',
        minWidth: 180,
        maxWidth: 180,
        width: 180,
        cellRenderer: ({ data, rowIndex }) => <SimpleText currency={'%'} data={data} type={'loyalty_card_percent'} />,
      },
      {
        headerName: 'Общая сумма покупок',
        colId: 'total_spent',
        minWidth: 240,
        maxWidth: 240,
        width: 240,
        cellRenderer: ({ data, rowIndex }) => <SimpleText withDevider currency={'сум'} data={data} type={'total_spent'} />,
      },
      {
        headerName: 'Накопленный кешбэк',
        colId: 'total_cashback_earned',
        minWidth: 240,
        maxWidth: 240,
        width: 240,
        cellRenderer: ({ data, rowIndex }) => <SimpleText withDevider currency={'сум'} data={data} type={'total_cashback_earned'} />,
      },
    ],
    [values],
  )

  const formattedData = discountCartReportByUser?.data?.data?.data

  const { mutate: getDiscountCartReportByUserExcel, isLoading: isgetDiscountCartReportByUserExcel } = useMutation(requests.getDiscountCartReportByUserExcel, {
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
      <Header noActions isLoading={false} backIcon backHref='/reports/client' text={'Отчёт: Топ клиентов по карте лояльности'} />
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
            uniqId='customer_id'
            fullDownload={() => getDiscountCartReportByUserExcel({ ...discoundCardFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => getDiscountCartReportByUserExcel(discoundCardFilter)}
            isDownloading={isgetDiscountCartReportByUserExcel}
            isDataLoading={isproductDataLoadingHistory || isFetchingdiscountCartReportByUser}
            offsetQuery='offset'
            limitQuery='limit'
            id='loya-card-report-by-users-table'
            fullInfoAboutCurrentPage
            totalCount={discountCartReportByUser?.data?.data?._meta?.total_count || 0}
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
