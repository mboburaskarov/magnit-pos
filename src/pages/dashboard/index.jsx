import { Box, Button, Grid } from '@mui/material'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import TotalOrdersByCity from '../../../components/Charts/SingleBarChart'
import SingleLineChart from '../../../components/Charts/SingleLineChart'
import LoadingContainer from '../../../components/LoadingContainer'
import dataTypeFilter from '../../../utils/dataTypeFilter'
import { getDetaling } from '../../../utils/getDetaling'
import { requests } from '../../../utils/requests'
import OrdersIcon from '../../assets/icons/OrdersIcon'
import ProductsIcon from '../../assets/icons/ProductsIcon'
import RevenueIcon from '../../assets/icons/RevenueIcon'
import VendorsIcon from '../../assets/icons/VendorsIcon'
import { useQueryParams } from '../../hooks/useQueryParams'
import DashboardHeader from './DashboardHeader'
import DashboardInfoBox from './DashboardInfoBox'
import tableHeaderSelector from './tableHeaderSelector'
import RippedPaperCheck from '../../../components/ChequePaper/ZReportCheck'
import RippedPaperZReportCheck from '../../../components/ChequePaper/ZReportCheck'
import TopProducts from '../../../components/Charts/TopProducts'
import TopSellers from '../../../components/Charts/TopSellers'
import TopBonusProducts from '../../../components/Charts/TopBonusProducts'
import CheckAccess from '../../../components/CheckAccess'

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
  const OrdersStatistics = ({
    total_sale_amount,
    total_product_count,
    total_sale_count,
    total_store_count,
    expiring_soon_amount,
    total_net_income,
    stock_total_amount,
    bonus_amount,
    expiring_soon_count,
  }) => {
    return [
      {
        title: t('Общая сумма продаж'),
        icon: <RevenueIcon />,
        count: total_sale_amount,
        percent: 10,
        id: 'total_sale_amount',
        endText: 'сум',
      },
      {
        title: t('Общая сумма баланса'),
        icon: <RevenueIcon />,

        count: stock_total_amount,
        endText: 'сум',
        id: 'stock_total_amount',
        percent: -5,
      },
      {
        title: t('Чистая прибыль'),
        icon: <VendorsIcon />,
        count: total_net_income,
        endText: 'сум',
        percent: 20,
        id: 'total_net_income',
      },
      {
        title: t('Общее количество продаж'),
        icon: <OrdersIcon />,
        count: total_sale_count,
        id: 'total_sale_count',
        percent: 8,
      },
      {
        title: t('Общее количество остатков'),
        icon: <ProductsIcon />,
        count: total_product_count,
        endText: '',
        percent: 20,
        id: 'total_product_count',
      },
      {
        title: t('Просроченные продукты'),
        icon: <VendorsIcon />,
        count: expiring_soon_count,
        amount: expiring_soon_amount,
        id: 'expiring_soon_amount',
        percent: 20,
      },

      {
        title: t('Ваш бонус'),
        icon: <VendorsIcon />,
        count: bonus_amount,
        id: 'bonus_amount',
        percent: 20,
        endText: 'сум',
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
      limit: values?.limit || 5,
      search: values?.search,
      start_date: values?.start_date || dayjs().format('YYYY-MM-DD'),
      store_id: values?.store_id || null,
      type: dataTypeFilter(detalization),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [values?.offset, detalization, values?.store_id, values?.start_date, values?.end_date, values?.limit, values?.search])
  const { data: chartData, isLoading: isGetChartData, refetch } = useQuery(['chartData', dashboard_filter], () => requests.dashboradChart(dashboard_filter))
  const { data: countStats, isLoading: isCountStats } = useQuery(['countStats', dashboard_filter], () => requests.dashboradCountStats(dashboard_filter))
  const { data: topStores, isLoading: isTopStores } = useQuery(['TopStores', dashboard_filter], () => requests.dashboradTopStores(dashboard_filter))
  const { data: topProducts, isLoading: isTopProducts } = useQuery(['TopProducts', dashboard_filter], () => requests.dashboradTopProducts(dashboard_filter))
  const { data: topBonusProducts, isLoading: isTopBonusProducts } = useQuery(['TopBonusProducts', dashboard_filter], () =>
    requests.dashboradTopBonusProducts(dashboard_filter)
  )
  const { data: topSellers, isLoading: isTopSellers } = useQuery(['TopSellers', dashboard_filter], () => requests.dashboradTopSellers(dashboard_filter))

  const toFixData = useMemo(
    () =>
      chartData?.data?.data?.map((item) => ({
        all_orders: item.total_amount,
        all_orders2: item.total_amount * 2,
        start_date: dayjs(item?.created_at)
          ?.set('hour', item?.id?.hour || `00`)
          ?.set('minutes', item?.id?.minute || `00`)
          ?.add(item?.id?.hour ? 5 : 0, 'hour')
          .format('DD.MM.YYYY | HH:mm'),
        count: item.count,
        id: item?.id,
      })),
    [chartData, dashboard_filter]
  )

  const { mutate: getZReportByDate, isLoading: isgetZReportByDate } = useMutation(requests.getZReportByDate, {
    onSuccess: ({ data }) => {},
    onError: (err) => {},
  })
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
                  <CheckAccess id={`dashboard-box-${el.id}`}>
                    <Grid item xs={12} xl={4} sm={12} md={6} lg={4} gap={0} pb={'20px'} spacing={2}>
                      <DashboardInfoBox key={ind} {...el} />
                    </Grid>
                  </CheckAccess>
                ))}
            </Grid>
            <CheckAccess id={'dashboard-chart'}>
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
            </CheckAccess>
          </Grid>
        </Grid>
        <CheckAccess id={'dashboard-vendor'}>
          <Box mt={4} columnGap={3} display='inline-flex'>
            <TotalOrdersByCity id='dashboard-chart' data={get(topStores, 'data.data')} />
            <TopProducts id='dashboard-chart' data={get(topProducts, 'data.data')} />
          </Box>
        </CheckAccess>
        <CheckAccess id={'dashboard-seller'}>
          <Box mt={4} columnGap={3} display='inline-flex'>
            <TopSellers id='dashboard-chart' data={get(topSellers, 'data.data')} />
            <TopBonusProducts id='dashboard-chart' data={get(topBonusProducts, 'data.data')} />
          </Box>
        </CheckAccess>
      </Box>
      {/* <Button
        onClick={() => {
          getZReportByDate({
            token: 'DXJFX32CN1296678504F2', // Токен всегда равен DXJFX32CN1296678504F2, используется везде, Обязательное поле, String
            method: 'openZreport', // Название метода, Обязательное поле, String
          })
        }}
      >
        open
      </Button> */}
      {/* <Button
        sx={{
          width: '200px',
        }}
        onClick={() => {
          getZReportByDate({
            token: 'DXJFX32CN1296678504F2',
            method: 'getReceiptsInfoByDate',
            startDate: '20250318000000',
            endDate: '20250321000000',
          })
        }}
      >
        check
      </Button> */}
    </LoadingContainer>
  )
}
