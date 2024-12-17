import { Box, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useEffect, useMemo, useState } from 'react'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { error } from '../../../../utils/toast'
import SelectSimple from '../../../../components/Select/SelectSimple'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import dayjs from 'dayjs'
import tableHeaderSelector from './tableHeaderSelector'

export default function TransactionsReportPage() {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [shop, setShop] = useState(null)
  const tableColumns = tableHeaderSelector({})

  const transactionsReportFilters = useMemo(() => {
    return { limit: values?.limit || 10, offset: values?.offset || 0, shopId: shop?._id, fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.limit, values?.offset, shop, values?.start_date, values?.end_date])

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 20, offset: 0 }))

  const {
    data: transactionsReportData,
    isLoading: isLoadingTransactionsReportData,
    isFetching: isFetchingTransactionsReportData,
    refetch,
  } = useQuery('transactions-report', () => requests.getTransactionsReport(transactionsReportFilters))

  const { mutate: getReportExcel, isLoading: isDownloadingExcel } = useMutation(requests.getTransactionsReportExcel, {
    onSuccess: ({ data }) => {
      const link = document.createElement('a')
      link.href = data?.[0]?.url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    onError: (err) => {
      error('Ошибка при загрузке Excel — бухгалтерские отчеты!')
      console.error(err)
    },
  })

  useEffect(() => {
    const count = transactionsReportData?.data.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [transactionsReportData?.data, values?.limit])

  useEffect(() => {
    refetch()
  }, [transactionsReportFilters])

  useEffect(() => {
    refetch()
  }, [transactionsReportFilters])
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box display='inline-flex' justifyContent='space-between'>
          <Typography variant='h1'>Бухгалтерский отчет</Typography>
          <Box display='inline-flex' mt={1} columnGap={2}>
            <DateRangeInput
              defaultFilterData={{ label: 'Этот месяц', start_date: dayjs().tz().startOf('month'), end_date: dayjs().tz() }}
              id='transactions-report-date-range'
            />
            <Box minWidth={240}>
              <SelectSimple
                id='shop'
                name='shop'
                minWidth='auto'
                placeholder={'Выберите магазин'}
                uncontrolled
                options={shopList?.data.shops}
                value={shop}
                onChange={(e) => setShop(e)}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <AgGridTable
            offsetQuery={'offset'}
            limitQuery={'limit'}
            download={() => getReportExcel(transactionsReportFilters)}
            id='report-transactions'
            columns={tableColumns}
            data={transactionsReportData?.data?.orders || []}
            isDataLoading={isLoadingTransactionsReportData || isFetchingTransactionsReportData}
            offsetCount={offsetCount}
            isDownloading={isDownloadingExcel}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
