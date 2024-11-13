import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import { Box, Grid } from '@mui/material'
import LoadingContainer from '../../../components/LoadingContainer'
import OrderNewIcon from '../../assets/icons/OrderNewIcon'
import DashboardInfoBox from './DashboardInfoBox'
import SingleLineChart from '../../../components/Charts/SingleLineChart'
import { useEffect, useMemo, useState } from 'react'
import DashboardTopSales from './DashboardTopSales'
import DashboardTopClients from './DashboardTopClients'
import DashboardTopProducts from './DashboardTopProducts'
import DashboardVendorsMap from './DashboardVendorsMap'
import DashboardTopCategories from './DashboardTopCategories'
import { useQueryParams } from '../../hooks/useQueryParams'
import { calculatePercentage } from '../../../utils/calculatePercentage'
import getPriceShorterNumber from '../../../utils/getShorterPriceNumber'
import { getDetaling } from '../../../utils/getDetaling'
import DashboardHeader from './DashboardHeader'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import dataTypeFilter from '../../../utils/dataTypeFilter'
import { useSelector } from 'react-redux'
import RevenueIcon from '../../assets/icons/RevenueIcon'
import ProductsIcon from '../../assets/icons/ProductsIcon'
import OrdersIcon from '../../assets/icons/OrdersIcon'
import VendorsIcon from '../../assets/icons/VendorsIcon'

export default function DashboarPage() {
  dayjs.extend(isoWeek)
  const { type } = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [detailing, setDetaling] = useState('week')
  const [detalization, setDetalization] = useState({ name: 'By day', value: 'day' })
  const check = type === 'SUPER_ADMIN' || type === 'ACCOUNTANT'
  const [sortBy, setSortBy] = useState(check ? 'SUM' : 'COUNT')

  const dashboardFilter = useMemo(() => {
    return { type: sortBy, fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.start_date, values?.end_date, sortBy])

  const DataTypeFilter = useMemo(() => dataTypeFilter(detalization), [values?.start_date, values?.end_date, detalization])

  const { data: mainInfo, refetch: refetchMainInfo, isLoading } = useQuery('mainListDashboard', () => requests.getDashboardMainInfo(dashboardFilter))
  const { data: topSales, refetch: refetchTopSales } = useQuery('topSalesDashboard', () => requests.getDashboardTopSales(dashboardFilter))
  const { data: topClients, refetch: refetchTopClients } = useQuery('topClientsDashboard', () => requests.getDashboardTopClients(dashboardFilter))
  const { data: topProducts, refetch: refetchTopProducts } = useQuery('topProductsDashboard', () => requests.getDashboardTopProducts(dashboardFilter))
  const { data: topCategories, refetch: refetchTopCategories } = useQuery('topCategoriesDashboard', () => requests.getDashboardTopCategories(dashboardFilter))
  const { data: vendorMap } = useQuery('topVendorMap', () => requests.getDashboardVendorMap())
  const { data: chartInfo, refetch: refetchChartData } = useQuery('chartInfoDashboard', () =>
    requests.getDashboardChartInfo({ ...dashboardFilter, type: DataTypeFilter })
  )
  useEffect(() => {
    refetchMainInfo()
    refetchTopSales()
    refetchTopClients()
    refetchTopProducts()
    refetchTopCategories()

    const dateDifference = dayjs(dashboardFilter.toDate).diff(dashboardFilter.fromDate, 'day')
    setDetaling(getDetaling(dateDifference))
    refetchChartData()
  }, [dashboardFilter, DataTypeFilter])
  const toFixData = useMemo(
    () =>
      chartInfo?.data?.map((item) => ({
        all_orders: item.totalAmount,
        start_date: dayjs(item?.createdAt)
          ?.set('hour', item?._id?.hour || `00`)
          ?.set('minutes', item?._id?.minute || `00`)
          ?.add(item?._id?.hour ? 5 : 0, 'hour')
          .format('DD.MM.YYYY | HH:mm'),
        count: item.count,
        _id: item?._id,
      })),
    [chartInfo, DataTypeFilter]
  )
  const totalSum = chartInfo?.data?.reduce((acc, item) => acc + item?.totalAmount, 0)
  const totalCount = chartInfo?.data?.reduce((acc, item) => acc + item?.count, 0)
  const OrdersStatistics = [
    {
      title: 'Total Revenue',
      icon: <RevenueIcon />,
      count: 0,
      percent: 10,
    },
    {
      title: 'Total Products',
      icon: <ProductsIcon />,
      count: 0,
      endText: '$',
      withoutDivider: String(mainInfo?.data?.ordersTotalAmount).length > 6,
      percent: -5,
    },
    {
      title: 'Total Orders',
      icon: <OrdersIcon />,
      count: 0,
      percent: 8,
    },
    {
      title: 'Total Vendors',
      icon: <VendorsIcon />,
      count: 0,
      percent: 20,
    },
  ]

  return (
    <LoadingContainer readyState={!isLoading}>
      <DashboardHeader setSortBy={setSortBy} />
      <Box display='flex' flexDirection='column' position='relative' pt={0} px={4} pb={3}>
        <Box display='flex' flexDirection='row' position='relative' gap={2} pt={0} pb={3}>
          <Box display='flex' flexDirection='column' position='relative' width={'70%'} pt={0} pb={0}>
            <Grid container spacing={2} mt={'30px'} gap={'0'}>
              {OrdersStatistics?.filter((el) => (check ? el : el.title !== 'Общая сумма заказов'))?.map((el, ind) => (
                <Grid xs={12} xl={6} sm={6} md={6} lg={6} gap={0} padding={'10px'} spacing={0}>
                  <DashboardInfoBox key={ind} {...el} />
                </Grid>
              ))}
            </Grid>
            <Box display='inline-flex' columnGap={3} mt={5} width='100%'>
              <SingleLineChart
                width='100%'
                id='dashboard-chart'
                period={detailing}
                detalization={detalization}
                setDetalization={setDetalization}
                sortBy={sortBy}
                dataKey={sortBy === 'SUM' ? 'all_orders' : 'count'}
                data={{
                  values: toFixData,
                  total: sortBy === 'SUM' ? totalSum : totalCount,
                }}
                measurmentUnit={sortBy === 'SUM' ? ' сум' : ' шт'}
              />
            </Box>
          </Box>
          <Box display='flex' width='30%' mt={5}>
            <DashboardTopSales sortBy={sortBy} data={topSales?.data} />
          </Box>
        </Box>
        <Box mt={4} columnGap={3} display='inline-flex'>
          <DashboardTopClients sortBy={sortBy} data={topClients?.data} />
          <DashboardTopProducts sortBy={sortBy} data={topProducts?.data} />
        </Box>
        <Box mb={4} mt={4} columnGap={3} display='inline-flex'>
          <DashboardVendorsMap vendorsData={vendorMap?.data} />
          <DashboardTopCategories sortBy={sortBy} data={topCategories?.data} />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
