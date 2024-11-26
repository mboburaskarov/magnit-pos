import { Box, Button, Typography } from '@mui/material'
import LoadingContainer from '../../../components/LoadingContainer'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import DateRangeInput from '../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import dayjs from 'dayjs'
import DashboardInfoBox from '../dashboard/DashboardInfoBox'
import { useEffect, useMemo, useState } from 'react'
import { useQueryParams } from '../../hooks/useQueryParams'
import SingleLineChart from '../../../components/Charts/SingleLineChart'
import { getDetaling } from '../../../utils/getDetaling'
import UsersLocationsMap from './UsersLocationsMap'
import { calculatePercentage } from '../../../utils/calculatePercentage'
import { useNavigate } from 'react-router-dom'
import ForwardArrow from '../../assets/icons/ForwardArrow'
import { useTheme } from '@mui/material'
import dataTypeFilter from '../../../utils/dataTypeFilter'
import CheckAccess from '../../../components/CheckAccess'
import SoonPage from '../../../components/soon'

export default function ReportMainPage() {
  return <SoonPage />
  const { values } = useQueryParams()
  const navigate = useNavigate()
  const [detailing, setDetaling] = useState('week')
  const [detalization, setDetalization] = useState({ name: 'по дням', value: 'day' })
  const theme = useTheme()

  const DataTypeFilter = useMemo(() => dataTypeFilter(detalization), [values?.start_date, values?.end_date, detalization])

  const usersReportFilter = useMemo(() => {
    return { fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.start_date, values?.end_date])

  const { data: mainInfo, refetch: refetchMainInfo } = useQuery('usersMainInfo', () => requests.getUsersMainInfo(usersReportFilter))
  const { data: mapInfo, refetch: refetchMapInfo } = useQuery('usersMapInfo', () => requests.getUsersMapInfo({ ...usersReportFilter, offset: 0, limit: 50000 }))
  const {
    data: chartInfo,
    refetch: refetchChartInfo,
    isLoading: isLoadingChart,
  } = useQuery('ListDeliveryReport', () => requests.getUsersChartInfo({ ...usersReportFilter, type: DataTypeFilter }))

  const UsersStatistics = [
    {
      title: 'Все клиенты',
      count: mainInfo?.data?.current?.totalUsersCount,
      endText: 'чел',
      percent: calculatePercentage(mainInfo?.data?.before?.totalUsersCount || 1, mainInfo?.data?.current?.totalUsersCount),
    },
    {
      title: 'Активные клиенты',
      count: mainInfo?.data?.current?.activeUsersCount,
      endText: 'чел',
      percent: calculatePercentage(mainInfo?.data?.before?.activeUsersCount || 1, mainInfo?.data?.current?.activeUsersCount),
    },
    {
      title: 'Неактивные клиенты',
      name: mainInfo?.data?.current?.topReferal?.app,
      count: mainInfo?.data?.current?.totalUsersCount - mainInfo?.data?.current?.activeUsersCount,
      endText: 'чел',
      percent: calculatePercentage(mainInfo?.data?.before?.activeUsersCount || 1, mainInfo?.data?.current?.activeUsersCount),
    },
    {
      title: `Источник (mobile)`,
      count: mainInfo?.data?.current?.usersSource?.mobile,
      percent: 10,
    },
    {
      title: `Источник (web)`,
      count: mainInfo?.data?.current?.usersSource?.web,
      percent: 10,
    },
  ]

  useEffect(() => {
    const dateDifference = dayjs(usersReportFilter.toDate).diff(usersReportFilter.fromDate, 'day')
    setDetaling(getDetaling(dateDifference))
    refetchChartInfo()
    refetchMainInfo()
    refetchMapInfo()
  }, [usersReportFilter, DataTypeFilter])

  const UserGroups = [
    {
      title: `Zero ${mainInfo?.data?.current?.usersGroup?.zero?.desc} заказов`,
      count: mainInfo?.data?.current?.usersGroup?.zero?.count,
      endText: 'чел',
      noDot: true,
    },
    {
      title: `Mini ${mainInfo?.data?.current?.usersGroup?.mini?.desc} заказ`,
      count: mainInfo?.data?.current?.usersGroup?.mini?.count,
      endText: 'чел',
      noDot: true,
    },
    {
      title: `Medium ${mainInfo?.data?.current?.usersGroup?.medium?.desc}`,
      count: mainInfo?.data?.current?.usersGroup?.medium?.count,
      endText: 'чел',
      noDot: true,
    },
    {
      title: `Great ${mainInfo?.data?.current?.usersGroup?.great?.desc}`,
      count: mainInfo?.data?.current?.usersGroup?.great?.count,
      endText: 'чел',
      noDot: true,
    },
    {
      title: `Shark ${mainInfo?.data?.current?.usersGroup?.shark?.desc}`,
      count: mainInfo?.data?.current?.usersGroup?.shark?.count,
      endText: 'чел',
      noDot: true,
    },
  ]

  const totalActiveUsers = UserGroups?.filter((el) => !el?.title?.includes('Zero'))?.reduce((acc, item) => acc + item?.count, 0)

  const formattedUsersChartData = useMemo(
    () => (chartInfo?.data?.length > 0 ? chartInfo?.data?.map((item) => ({ value: item.count, start_date: item.createdAt })) : []),
    [chartInfo, DataTypeFilter]
  )

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box display='inline-flex' justifyContent='space-between'>
          <Typography variant='h1'>Отчет клиентов</Typography>
          <Box display='inline-flex' mt={1} columnGap={2}>
            <CheckAccess id={'/clients/all'}>
              <Button color='secondary' onClick={() => navigate('/clients/all')}>
                Перейти в список <ForwardArrow fill={theme.palette.type === 'dark' ? '#FBF7FA' : '#3BA98F'} style={{ marginLeft: '20px' }} />
              </Button>
            </CheckAccess>
            <DateRangeInput
              defaultFilterData={{ label: 'Этот год', start_date: dayjs().tz().startOf('month'), end_date: dayjs().tz() }}
              id='users-report-date-range'
            />
          </Box>
        </Box>
        <Box justifyContent='flex-end' mb={1.5} mt={4} columnGap={2} display='inline-flex' width='100%'>
          {UsersStatistics.map((item, index) => (
            <DashboardInfoBox key={index} {...item} />
          ))}
        </Box>
        <Box sx={(theme) => ({ p: 3, boxShadow: theme.boxShadow['16-8'], borderRadius: 4, width: '100%' })} justifyContent='flex-end' mt={2} width='100%'>
          <Typography mb={2} sx={(theme) => ({ fontSize: 24, lineHeight: '28px', fontFamily: theme.fontFamily.Gilroy, color: theme.palette.black })}>
            Всего заказавших: {totalActiveUsers} клиентов
          </Typography>
          <Box width='100%' columnGap={2} display='inline-flex'>
            {UserGroups?.map((item, index) => (
              <DashboardInfoBox key={index} {...item} />
            ))}
          </Box>
        </Box>
        <Box display='inline-flex' columnGap={3} my={4} width='100%'>
          <SingleLineChart
            title='График клиентов'
            width='100%'
            measurmentUnit='чел'
            period={detailing}
            detalization={detalization}
            isLoading={isLoadingChart}
            setDetalization={setDetalization}
            data={{
              values: formattedUsersChartData,
              total: chartInfo?.data?.length ? chartInfo?.data?.reduce((acc, item) => acc + item?.count, 0) : [],
            }}
            id='dashboard-chart-1'
            colorCode={'2'}
          />
        </Box>
        <UsersLocationsMap mapInfo={mapInfo?.data?.userLocations?.users} />
      </Box>
    </LoadingContainer>
  )
}
