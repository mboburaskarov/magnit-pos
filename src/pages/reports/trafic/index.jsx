import { Box, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import tableHeaderSelector from './tableHeaderSelector'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useEffect, useMemo, useState } from 'react'
import { useQueryParams } from '../../../hooks/useQueryParams'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import dayjs from 'dayjs'
import ReportsTraficInfoBox from './ReportsTraficInfoBox'
import OrderNewIcon from '../../../assets/icons/OrderNewIcon'
import { v4 as uuidv4 } from 'uuid'

export default function ReportTraficPage() {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const tableColumns = tableHeaderSelector()

  const referalsTableFilter = useMemo(() => {
    return { limit: values?.limit || 10, offset: values?.offset || 0, fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.limit, values?.offset, values?.start_date, values?.end_date])

  const referalsReportFilter = useMemo(() => {
    return { fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.start_date, values?.end_date])

  const { data: mainInfo, isLoading } = useQuery(['referalsMainInfo', referalsReportFilter], () => requests.getReferalsMainInfo(referalsReportFilter))

  const {
    data: tableData,
    refetch: refetchTableData,
    isLoading: tableLoading,
    isFetching: tableFetching,
  } = useQuery('referalsTableData', () => requests.getReferalsTableData(referalsTableFilter))

  const OrdersStatistics = [
    {
      title: 'Все рефералы',
      icon: <OrderNewIcon />,
      count: mainInfo?.data?.totalCount,
      percent: 10,
    },
    {
      title: 'Топ приложение',
      icon: <OrderNewIcon />,
      count: mainInfo?.data?.topApp?.count,
      percent: 10,
      name: mainInfo?.data?.topApp?.app,
    },
    {
      title: 'Top Performar',
      name: mainInfo?.data?.topReferal?.app,
      icon: <OrderNewIcon />,
      count: mainInfo?.data?.topReferal?.count,
      percent: 10,
    },
  ]

  useEffect(() => {
    const count = tableData?.data.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [tableData?.data, values?.limit])

  useEffect(() => {
    refetchTableData()
  }, [referalsTableFilter])

  return (
    <LoadingContainer readyState={!isLoading}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box display='inline-flex' justifyContent='space-between'>
          <Typography variant='h1'>Отчет трафика</Typography>
          <Box display='inline-flex' mt={1} columnGap={2}>
            <DateRangeInput
              defaultFilterData={{ label: 'Этот год', start_date: dayjs().tz().startOf('month'), end_date: dayjs().tz() }}
              id='trafic-report-date-range'
            />
          </Box>
        </Box>
        <Box justifyContent='flex-end' mb={1.5} mt={4} columnGap={2} display='inline-flex' width='100%'>
          {OrdersStatistics.map((item, index) => (
            <ReportsTraficInfoBox key={index} {...item} />
          ))}
        </Box>
        <Box>
          <AgGridTable
            isDataLoading={tableLoading || tableFetching}
            offsetCount={offsetCount}
            id='report-trafic-main-table'
            columns={tableColumns}
            data={tableData?.data?.referals?.map((el) => ({ ...el, _id: uuidv4 }))}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
