import { Box, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import dayjs from 'dayjs'
import DashboardInfoBox from '../../dashboard/DashboardInfoBox'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { calculatePercentage } from '../../../../utils/calculatePercentage'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { useEffect, useMemo, useState } from 'react'
import SingleLineChart from '../../../../components/Charts/SingleLineChart'
import { getDetaling } from '../../../../utils/getDetaling'
import DeliveryMap from './DeliveryMap'
import dataTypeFilter from '../../../../utils/dataTypeFilter'
export default function ReportDeliveryPage() {
  const { values } = useQueryParams()
  const [detailing, setDetaling] = useState('week')
  const [detalization, setDetalization] = useState({ name: 'по дням', value: 'day' })

  const deliveryReportFilter = useMemo(() => {
    return { fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.start_date, values?.end_date])

  const DataTypeFilter = useMemo(() => dataTypeFilter(detalization), [values?.start_date, values?.end_date, detalization])

  const { data: mainInfo, refetch: refetchMainInfo, isLoading } = useQuery('mainListDeliveryReport', () => requests.getDeliveryMainInfo(deliveryReportFilter))
  const {
    data: mapInfo,
    refetch: refetchMapInfo,
    isLoading: isMapLoading,
    isFetching: isMapFetching,
  } = useQuery('getDeliveryMapInfo', () => requests.getDeliveryMapInfo(deliveryReportFilter))
  const {
    data: chartInfo,
    refetch: refetchChartInfo,
    isLoading: isLoadingChart,
  } = useQuery('ListDeliveryReport', () => requests.getDeliveryChartInfo({ ...deliveryReportFilter, type: DataTypeFilter }))

  useEffect(() => {
    const dateDifference = dayjs(deliveryReportFilter.toDate).diff(deliveryReportFilter.fromDate, 'day')
    setDetaling(getDetaling(dateDifference))
    refetchMainInfo()
    refetchChartInfo()
    refetchMapInfo()
  }, [deliveryReportFilter, DataTypeFilter])

  const OrdersStatistics = [
    {
      title: 'Средняя цена доставки',
      count: mainInfo?.data?.avgPrice,
      endText: 'сум',
      percent: calculatePercentage(mainInfo?.data?.beforeAvgPrice || 1, mainInfo?.data?.avgPrice || 0.1),
    },
    {
      title: 'Среднее время доставки',
      count: Math.round(mainInfo?.data?.avgTimeSpent || 0),
      endText: ' мин.',
      percent: calculatePercentage(mainInfo?.data?.beforeAvgTimeSpent || 1, mainInfo?.data?.avgTimeSpent || 0.1),
    },
    {
      title: 'Число запросов на доставку',
      count: mainInfo?.data?.totalCount,
      percent: calculatePercentage(mainInfo?.data?.beforeTotalCount || 1, mainInfo?.data?.totalCount || 0.1),
    },
    {
      title: 'Среднее расстояние доставки',
      count: mainInfo?.data?.avgDistance,
      endText: ' метр',
      percent: calculatePercentage(mainInfo?.data?.beforeAvgDistance || 1, mainInfo?.data?.avgDistance || 0.1),
    },
    {
      title: 'Разница ожиданий с реальностью',
      endText: ' мин.',
      count: mainInfo?.data?.avgBelated,
      percent: calculatePercentage(mainInfo?.data?.beforeAvgBelated || 1, mainInfo?.data?.avgBelated || 0.1),
    },
  ]
  const formattedExpenses = useMemo(
    () => chartInfo?.data?.result?.map((item) => ({ value: item.totalAmount, start_date: item.createdAt })),
    [chartInfo, DataTypeFilter]
  )
  const formattedDistances = useMemo(
    () => chartInfo?.data?.result?.map((item) => ({ value: item.distance, start_date: item.createdAt })),
    [chartInfo, DataTypeFilter]
  )
  const formattedTimeSpent = useMemo(
    () => chartInfo?.data?.result?.map((item) => ({ value: item.timeSpent, start_date: item.createdAt })),
    [chartInfo, DataTypeFilter]
  )
  const totalExpensesSum = chartInfo?.data?.result?.length ? chartInfo?.data?.result?.reduce((acc, item) => acc + item?.totalAmount, 0) : []

  return (
    <LoadingContainer readyState={!isLoading}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={6}>
        <Box display='inline-flex' justifyContent='space-between'>
          <Typography variant='h1'>Отчет о доставке</Typography>
          <Box display='inline-flex' mt={1} columnGap={2}>
            <DateRangeInput
              defaultFilterData={{ label: 'Этот месяц', start_date: dayjs().tz().startOf('month'), end_date: dayjs().tz() }}
              id='accounting-report-date-range'
            />
          </Box>
        </Box>
        <Box display='inline-flex' width='100%' columnGap={3} mt={5}>
          {OrdersStatistics?.map((el, ind) => (
            <DashboardInfoBox key={ind} {...el} />
          ))}
        </Box>
        <Box id='chart' display='inline-flex' columnGap={3} mt={4} width='100%'>
          <SingleLineChart
            id='dashboard-chart-4'
            isLoading={isLoadingChart}
            title='Расходы на доставку'
            width='100%'
            period={detailing}
            detalization={detalization}
            setDetalization={setDetalization}
            data={{ values: formattedExpenses, total: totalExpensesSum }}
            measurmentUnit='сум'
          />
        </Box>
        <Box display='inline-flex' columnGap={3} my={4} width='100%'>
          <SingleLineChart
            title='Ср. расстояние'
            width='100%'
            measurmentUnit='метр'
            period={detailing}
            detalization={detalization}
            setDetalization={setDetalization}
            data={{
              values: formattedDistances,
              total: chartInfo?.data?.result?.length ? chartInfo?.data?.result?.reduce((acc, item) => acc + item?.distance, 0) : [],
            }}
            colorCode='1'
            id='dashboard-chart-1'
          />
          <SingleLineChart
            measurmentUnit='минут'
            title='Ср. время доставки'
            width='100%'
            period={detailing}
            colorCode='2'
            detalization={detalization}
            setDetalization={setDetalization}
            id='dashboard-chart-2'
            data={{
              values: formattedTimeSpent,
              total: chartInfo?.data?.result?.length ? chartInfo?.data?.result?.reduce((acc, item) => acc + item?.timeSpent, 0) : [],
            }}
          />
        </Box>
        {!isMapLoading & !isMapFetching && <DeliveryMap mapInfo={mapInfo?.data || mapInfo?.data?.result} />}
      </Box>
    </LoadingContainer>
  )
}
