import dayjs from 'dayjs'
import LoadingContainer from '../../../../components/LoadingContainer'
import { Box, Typography } from '@mui/material'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import { useEffect, useMemo, useState } from 'react'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { calculatePercentage } from '../../../../utils/calculatePercentage'
import DashboardInfoBox from '../../dashboard/DashboardInfoBox'
import SingleLineChart from '../../../../components/Charts/SingleLineChart'
import { getDetaling } from '../../../../utils/getDetaling'
import AppReportInfoBox from './AppReportInfoBox'
import dataTypeFilter from '../../../../utils/dataTypeFilter'

export default function ReportAppPage() {
  const { values } = useQueryParams()
  const [detailing, setDetaling] = useState('week')
  const [detalization, setDetalization] = useState({ name: 'по дням', value: 'day' })

  const appReportFilter = useMemo(() => {
    return { fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.start_date, values?.end_date])

  const DataTypeFilter = useMemo(() => dataTypeFilter(detalization), [values?.start_date, values?.end_date, detalization])
  const {
    data: appInfoByCount,
    refetch: refetchAppInfoByCount,
    isLoading: isAppReportByCountLoading,
  } = useQuery('appReportByCount', () => requests.getAppReportByCount(appReportFilter))
  const {
    data: downloadActionChart,
    refetch: refetchDownloadActionChart,
    isRefetching: isDowloadActionChartRefetching,
    isLoading: isDownloadActionChartLoading,
  } = useQuery('downloadActionChart', () => requests.getDownloadActionChart({ ...appReportFilter, type: DataTypeFilter }))
  const {
    data: usersByDeviceModel,
    refetch: refetchUsersByDeviceModel,
    isLoading: isUsersByDeviceModelLoading,
  } = useQuery('usersByDeviceModel', () => requests.getUsersByDeviceModel({ ...appReportFilter, limit: 20, offset: 0 }))
  const {
    data: appEvents,
    refetch: refetchAppEvents,
    isLoading: isAppEventsLoading,
  } = useQuery('appEvents', () => requests.getAppEvents({ ...appReportFilter, limit: 20, offset: 0 }))
  const {
    data: appApiRequests,
    refetch: refetchAppApiRequests,
    isLoading: isAppApiRequestsLoading,
  } = useQuery('appApiRequests', () => requests.getAppRequestCount({ ...appReportFilter, limit: 20, offset: 0 }))
  const {
    data: appVersionHistory,
    refetch: refetchAppVersionHistory,
    isLoading: isAppVersionHistory,
  } = useQuery('appVersionHistory', () => requests.getAppVersionHistory({ ...appReportFilter }))
  const {
    data: appDeletedUsers,
    refetch: refetchAppDeletedUsers,
    isLoading: isAppDeletedUsersLoading,
    isRefetching: isAppDeletedUsersRefetching,
  } = useQuery('appDeletedUsers', () => requests.getAppDeletedUsers({ ...appReportFilter, type: DataTypeFilter }))
  useEffect(() => {
    const dateDifference = dayjs(appReportFilter.toDate).diff(appReportFilter.fromDate, 'day')
    setDetaling(getDetaling(dateDifference))
    refetchAppInfoByCount()
    refetchDownloadActionChart()
    refetchUsersByDeviceModel()
    refetchAppEvents()
    refetchAppApiRequests()
    refetchAppDeletedUsers()
    refetchAppVersionHistory()
  }, [appReportFilter, DataTypeFilter])
  const AppStatistics = [
    {
      title: 'Кол-во установок',
      count: appInfoByCount?.data?.downloadCount,
      percent: calculatePercentage(appInfoByCount?.data?.beforeDownloadCount || 1, appInfoByCount?.data?.downloadCount),
    },
    {
      title: 'Кол-во удаленных пользователей',
      count: Math.round(appInfoByCount?.data?.deletedUsersCount || 0),
      percent: calculatePercentage(appInfoByCount?.data?.beforeDeletedUsersCount || 1, appInfoByCount?.data?.deletedUsersCount),
    },
    {
      title: 'Кол-во версий',
      count: appInfoByCount?.data?.versionsCount,
      percent: calculatePercentage(appInfoByCount?.data?.beforeVersionsCount || 1, appInfoByCount?.data?.versionsCount),
    },
    {
      title: 'Кол-во ивентов',
      count: appInfoByCount?.data?.eventsCount,
      percent: calculatePercentage(appInfoByCount?.data?.beforeEventsCount || 1, appInfoByCount?.data?.eventsCount),
    },
    {
      title: 'Кол-во запросов',
      count: appInfoByCount?.data?.apiRequestsCount,
      percent: calculatePercentage(appInfoByCount?.data?.beforeApiRequestsCount || 1, appInfoByCount?.data?.apiRequestsCount),
    },
  ]
  const formattedDownloads = useMemo(
    () => downloadActionChart?.data?.map((item) => ({ value: item.count, start_date: item.convertedDate })),
    [downloadActionChart, DataTypeFilter]
  )
  const formattedDeleted = useMemo(
    () => appDeletedUsers?.data?.map((item) => ({ value: item.count, start_date: item.convertedDate })),
    [appDeletedUsers, DataTypeFilter]
  )
  return (
    <LoadingContainer
      readyState={
        !isAppReportByCountLoading &&
        !isDownloadActionChartLoading &&
        !isUsersByDeviceModelLoading &&
        !isAppEventsLoading &&
        !isAppApiRequestsLoading &&
        !isAppDeletedUsersLoading &&
        !isAppVersionHistory
      }
    >
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={6}>
        <Box display='inline-flex' justifyContent='space-between'>
          <Typography variant='h1'>Отчет о приложении</Typography>
          <Box display='inline-flex' mt={1} columnGap={2}>
            <DateRangeInput
              defaultFilterData={{ label: 'Этот месяц', start_date: dayjs().tz().startOf('month'), end_date: dayjs().tz() }}
              id='app-report-date-range'
            />
          </Box>
        </Box>
        <Box display='inline-flex' width='100%' columnGap={3} mt={5}>
          {AppStatistics?.map((el, ind) => (
            <DashboardInfoBox key={ind} {...el} />
          ))}
        </Box>

        <Box display='inline-flex' columnGap={3} my={4} width='100%'>
          <SingleLineChart
            title='Скаченных'
            width='100%'
            measurmentUnit='шт'
            isLoading={isDowloadActionChartRefetching}
            period={detailing}
            detalization={detalization}
            setDetalization={setDetalization}
            data={{
              values: formattedDownloads,
              total: downloadActionChart?.data?.length ? downloadActionChart?.data?.reduce((acc, item) => acc + item?.count, 0) : [],
            }}
            colorCode='1'
            id='dashboard-chart-1'
          />
          <SingleLineChart
            measurmentUnit='шт'
            title='Удаленных пользователей'
            width='100%'
            isLoading={isAppDeletedUsersRefetching}
            period={detailing}
            colorCode='2'
            detalization={detalization}
            setDetalization={setDetalization}
            id='dashboard-chart-2'
            data={{
              values: formattedDeleted,
              total: appDeletedUsers?.data?.length ? appDeletedUsers?.data?.reduce((acc, item) => acc + item?.count, 0) : [],
            }}
          />
        </Box>
        <Box columnGap={3} display='inline-flex'>
          <AppReportInfoBox data={usersByDeviceModel?.data?.deviceModels} headerText={'Устройства клиентов'} />
          <AppReportInfoBox data={appEvents?.data?.events} headerText={'Ивенты'} />
        </Box>
        <Box mt={4} mb={4} display={'inline-flex'} columnGap={3}>
          <AppReportInfoBox data={appApiRequests?.data?.requests} headerText={'Запросы'} />
          <AppReportInfoBox data={appVersionHistory?.data?.versions} headerText={'Версии'} />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
