import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import { Box, Grid, Typography } from '@mui/material'
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
import SingleBarChart from '../../../components/Charts/SingleLineChart'
import TotalOrdersByCity from '../../../components/Charts/SingleBarChart'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import tableHeaderSelector from './tableHeaderSelector'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'

export default function DashboarPage() {
  dayjs.extend(isoWeek)
  const [status, setStatus] = useState('ALL')

  const { type } = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [detailing, setDetaling] = useState('week')

  const [detalization, setDetalization] = useState({ name: 'Сегодня', value: 'day' })
  const check = type === 'SUPERADMIN' || type === 'ACCOUNTANT'
  const [sortBy, setSortBy] = useState(check ? 'SUM' : 'COUNT')
  const { columns, loading } = useSelector((state) => state.orderTableColumns)
  const [regions, setRegions] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const { t } = useTranslation()
  const dashboardFilter = useMemo(() => {
    return { type: sortBy, fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.start_date, values?.end_date, sortBy])
  const operator = values?.operator
  const shop = values?.shop
  const client = values?.client
  const orderListFilter = useMemo(() => {
    return {
      orderNumber: values?.search?.replaceAll('/', '\\'),
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      shopId: shop,
      regions: regions?.length ? regions?.map((item) => item?.id) : undefined,
      userId: client,
      moderatorId: operator,
      fromDate: values?.start_date,
      toDate: values?.end_date,
      detalization: detalization,
      source: values?.source,
      ...(status !== 'ALL' && { status }),
    }
  }, [
    status,
    values?.offset,
    values?.limit,
    detalization,
    values?.source,
    values?.search,
    shop,
    client,
    values?.start_date,
    values?.end_date,
    operator,
    regions,
  ])

  const DataTypeFilter = useMemo(() => dataTypeFilter(detalization), [values?.start_date, values?.end_date, detalization])
  const userData = useSelector((state) => state.user)

  const chartInfo = []
  useEffect(() => {
    const dateDifference = dayjs(dashboardFilter.toDate).diff(dashboardFilter.fromDate, 'day')
    setDetaling(getDetaling(dateDifference))
  }, [dashboardFilter, DataTypeFilter])

  const totalSum = chartInfo?.data?.reduce((acc, item) => acc + item?.totalAmount, 0)
  const totalCount = chartInfo?.data?.reduce((acc, item) => acc + item?.count, 0)
  const OrdersStatistics = ({ total_sale_amount, total_product_count, total_sale_count, total_store_count }) => {
    return [
      {
        title: t('all_sales'),
        icon: <RevenueIcon />,
        count: total_sale_amount,
        percent: 10,
        endText: 'сум',
      },
      {
        title: t('all_medicien'),
        icon: <ProductsIcon />,
        count: total_product_count,
        endText: 'сум',
        percent: -5,
      },
      {
        title: t('sales'),
        icon: <OrdersIcon />,
        count: total_sale_count,
        percent: 8,
      },
      {
        title: t('branches'),
        icon: <VendorsIcon />,
        count: total_store_count,
        percent: 20,
      },
    ]
  }
  const tableColumns = tableHeaderSelector({
    orderColumns: columns,
    searchTerm: values?.search,
    userData,
  })

  const dashboard_filter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      search: values?.search,
      start_date: values?.start_date,
      type: dataTypeFilter(detalization),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [values?.offset, detalization, values?.start_date, values?.end_date, values?.limit, values?.search])
  const { data: chartData, isLoading: isGetChartData, refetch } = useQuery(['chartData', dashboard_filter], () => requests.dashboradChart(dashboard_filter))
  const { data: countStats, isLoading: isCountStats } = useQuery(['countStats', dashboard_filter], () => requests.dashboradCountStats(dashboard_filter))
  const { data: topStores, isLoading: isTopStores } = useQuery(['TopStores', dashboard_filter], () => requests.dashboradTopStores(dashboard_filter))

  const toFixData = useMemo(
    () =>
      [
        {
          id: {
            year: 2025,
            month: 2,
            day: 20,
            hour: 11,
          },
          count: 1,
          total_amount: 1500,
          created_at: '2025-02-20',
        },
        {
          id: {
            year: 2025,
            month: 2,
            day: 20,
            hour: 13,
          },
          count: 2,
          total_amount: 3000,
          created_at: '2025-02-20',
        },
      ]?.map((item) => ({
        all_orders: item.total_amount,
        start_date: dayjs('2025-02-18T11:00:00Z')
          // ?.set('hour', item?.id?.hour || `00`)
          // ?.set('minutes', item?.id?.minute || `00`)
          // ?.add(item?.id?.hour ? 5 : 0, 'hour')
          .format('DD.MM.YYYY | HH:mm'),
        count: item.count,
        id: item?.id,
      })),
    [chartData, dashboard_filter]
  )

  return (
    <LoadingContainer readyState={true}>
      <DashboardHeader setSortBy={setSortBy} />
      <Box display='flex' flexDirection='column' position='relative' pt={0} px={'30px'} pb={3} width={'100%'}>
        <Grid width={'100%'} container>
          <Grid width={'100%'} item>
            <Grid container spacing={2}>
              {OrdersStatistics(get(countStats, 'data.data', {}))
                ?.filter((el) => (check ? el : el.title !== 'Общая сумма заказов'))
                ?.map((el, ind) => (
                  <Grid item xs={12} xl={3} sm={6} md={6} lg={6} gap={0} pb={'20px'} spacing={2}>
                    <DashboardInfoBox key={ind} {...el} />
                  </Grid>
                ))}
            </Grid>
            <Box display='inline-flex' columnGap={3} width='100%'>
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
          </Grid>
        </Grid>
        <Box mt={4} columnGap={3} display='inline-flex'>
          <DashboardTopClients sortBy={sortBy} data={get(topStores, 'data.data')} />
          <DashboardTopProducts sortBy={sortBy} data={get(topStores, 'data.data')} />
          <TotalOrdersByCity id='dashboard-chart' data={get(topStores, 'data.data')} />
        </Box>
        <Box sx={{ border: '1px solid #A4A5AB33', borderRadius: '32px', mt: '32px', p: '20px' }}>
          <Typography fontWeight={600} fontSize={'26px'} pl={'6px'} pb={'20px'} py={'24px'} lineHeight={'32px'}>
            {t('orders')}
          </Typography>
          <AgGridTable
            id='orders-main-table'
            tableSettings
            columns={tableColumns}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            status={status}
            emptyTableText={{
              title: 'Информация недоступна',
              description: 'Если вы не можете найти искомую информацию, нажмите кнопку «Добавить новую» и введите необходимую информацию.',
            }}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
