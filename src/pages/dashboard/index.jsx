import { Box, Grid } from '@mui/material'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import TotalOrdersByCity from '../../../components/Charts/SingleBarChart'
import SingleLineChart from '../../../components/Charts/SingleLineChart'
import TopBonusProducts from '../../../components/Charts/TopBonusProducts'
import TopProducts from '../../../components/Charts/TopProducts'
import TopSellers from '../../../components/Charts/TopSellers'
import Transactions from '../../../components/Charts/transactions'
import CheckAccess from '../../../components/CheckAccess'
import LoadingContainer from '../../../components/LoadingContainer'
import { calculatePercentage } from '../../../utils/calculatePercentage'
import dataTypeFilter from '../../../utils/dataTypeFilter'
import { getDetaling } from '../../../utils/getDetaling'
import { requests } from '../../../utils/requests'
import thousandDivider from '../../../utils/thousandDivider'
import OrdersIcon from '../../assets/icons/OrdersIcon'
import ProductsIcon from '../../assets/icons/ProductsIcon'
import RevenueIcon from '../../assets/icons/RevenueIcon'
import VendorsIcon from '../../assets/icons/VendorsIcon'
import { useQueryParams } from '../../hooks/useQueryParams'
import DashboardHeader from './DashboardHeader'
import DashboardInfoBox from './DashboardInfoBox'

export default function DashboarPage() {
  dayjs.extend(isoWeek)
  const { type } = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [detailing, setDetaling] = useState('week')
  const [selectedShops, setSelectedShops] = useState('all')

  const [detalization, setDetalization] = useState({ name: 'по дням', value: 'day' })
  const [chartType, setchartType] = useState({ name: 'Продажи', value: 'sale' })
  const check = type === 'SUPERADMIN' || type === 'ACCOUNTANT'
  const [sortBy, setSortBy] = useState('SUM')
  const { t } = useTranslation()
  const dashboardFilter = useMemo(() => {
    return { type: sortBy, fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.start_date, values?.end_date, sortBy])

  const DataTypeFilter = useMemo(() => dataTypeFilter(detalization), [values?.start_date, values?.end_date, detalization])

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
    expiring_soon_amount,
    total_net_income,
    stock_total_amount,
    bonus_amount,
    expiring_soon_count,
    before_sale_amount,
    before_product_count,
    before_sale_count,
    before_expiring_soon_amount,
    before_total_net_income,
    before_stock_amount,
    before_bonus_amount,
    before_expiring_soon_count,
  }) => {
    return [
      {
        title: t('Общая сумма продаж'),
        icon: <RevenueIcon color='#fe5000' />,
        count: total_sale_amount,
        percent: calculatePercentage(before_sale_amount || 1, total_sale_amount),
        id: 'total_sale_amount',
        endText: 'сум',
        old: before_sale_amount,
      },
      {
        title: t('Общая сумма баланса'),
        icon: <RevenueIcon color='#fe5000' />,

        count: stock_total_amount,
        endText: 'сум',
        id: 'stock_total_amount',
        percent: calculatePercentage(before_stock_amount || 1, stock_total_amount),
        old: before_stock_amount,
      },
      {
        title: t('Чистая прибыль'),
        icon: <VendorsIcon />,
        count: total_net_income,
        endText: 'сум',
        percent: calculatePercentage(before_total_net_income || 1, total_net_income),
        id: 'total_net_income',
        old: before_total_net_income,
      },
      {
        title: t('Общее количество продаж'),
        icon: <OrdersIcon />,
        count: total_sale_count,
        id: 'total_sale_count',
        percent: calculatePercentage(before_sale_count || 1, total_sale_count),
        old: before_sale_count,
      },
      {
        title: t('Общее количество остатков'),
        icon: <ProductsIcon />,
        count: total_product_count,
        endText: '',
        percent: calculatePercentage(before_product_count || 1, total_product_count),
        id: 'total_product_count',
        old: before_product_count,
      },
      {
        title: t('Просроченные продукты'),
        icon: <VendorsIcon />,
        count: expiring_soon_count,
        amount: expiring_soon_amount,
        id: 'expiring_soon_amount',
        percent: calculatePercentage(before_expiring_soon_count || 1, expiring_soon_count),
        old: before_expiring_soon_count,
      },

      {
        title: t('Ваш бонус'),
        icon: <VendorsIcon />,
        count: bonus_amount,
        id: 'bonus_amount',
        percent: calculatePercentage(before_bonus_amount || 1, bonus_amount),
        endText: 'сум',
        old: before_bonus_amount,
      },
    ]
  }

  const dashboard_filter = useMemo(() => {
    return {
      limit: values?.limit || 5,
      search: values?.search,
      start_date: values?.start_date || dayjs().format('YYYY-MM-DD'),
      store_ids: selectedShops.length <= 63 && selectedShops != 'all' ? [...selectedShops?.map((a) => a.id)] : null || null,
      type: dataTypeFilter(detalization),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [values?.offset, detalization, selectedShops, values?.start_date, values?.end_date, values?.limit, values?.search])
  const { data: chartData, isLoading: isGetChartData, refetch } = useQuery(['chartData', dashboard_filter], () => requests.dashboradChart(dashboard_filter))
  const {
    data: countStats,
    isLoading: isCountStats,
    refetch: refetchStat,
  } = useQuery(['countStats', dashboard_filter], () => requests.dashboradCountStats(dashboard_filter))
  const { data: topStores, isLoading: isTopStores } = useQuery(['TopStores', dashboard_filter], () => requests.dashboradTopStores(dashboard_filter))
  const { data: payments, isLoading: ispayments } = useQuery(['payments', dashboard_filter], () => requests.dashboradPayments(dashboard_filter))
  const { data: transaction, isLoading: istransaction } = useQuery(['transaction', dashboard_filter], () => requests.dashboradTransaction(dashboard_filter))
  const { data: topProducts, isLoading: isTopProducts } = useQuery(['TopProducts', dashboard_filter], () => requests.dashboradTopProducts(dashboard_filter))
  const { data: topBonusProducts, isLoading: isTopBonusProducts } = useQuery(['TopBonusProducts', dashboard_filter], () =>
    requests.dashboradTopBonusProducts(dashboard_filter)
  )
  const { data: topSellers, isLoading: isTopSellers } = useQuery(['TopSellers', dashboard_filter], () => requests.dashboradTopSellers(dashboard_filter))
  useEffect(() => {
    const refetchStatData = setInterval(() => {
      refetchStat()
    }, 10000)
    return () => {
      clearInterval(refetchStatData)
    }
  }, [])
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

  return (
    <LoadingContainer readyState={true}>
      <DashboardHeader setSelectedShops={setSelectedShops} selectedShops={selectedShops} />

      <Box display='flex' flexDirection='column' position='relative' pt={0} px={'20px'} pb={3} width={'100%'}>
        <Grid width={'100%'} container>
          <Grid width={'100%'} item>
            <Grid container mt={0} spacing={2}>
              {OrdersStatistics(get(countStats, 'data.data', {}))
                ?.filter((el) => (check ? el : el.title !== 'Общая сумма заказов'))
                ?.map((el, ind) => (
                  <CheckAccess id={`dashboard-box-${el.id}`}>
                    <Grid item xs={12} xl={4} sm={12} md={6} lg={4} gap={0} pb={'0px'} pt={'20px !important'} spacing={2}>
                      <DashboardInfoBox key={ind} {...el} />
                    </Grid>
                  </CheckAccess>
                ))}
            </Grid>
            <CheckAccess id={'dashboard-chart'}>
              <Box mt={'32px'} display='inline-flex' columnGap={3} width='100%'>
                <SingleLineChart
                  width='100%'
                  id='dashboard-chart'
                  period={detailing}
                  detalization={detalization}
                  setDetalization={setDetalization}
                  chartType={chartType}
                  setchartType={setchartType}
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
        <CheckAccess id={'dashboard-transactions-vendor'}>
          <Box justifyContent={'stretch'} mt={4} columnGap={3} display='flex'>
            <Transactions
              id='dashboard-chart'
              data={get(payments, 'data.data')}
              title={'Платежи'}
              subTitle={thousandDivider(Math.round(get(payments, 'data.data', [])?.reduce((a, b) => a + b.amount, 0)), 'сум')}
            />
            <Transactions
              id='dashboard-chart'
              data={get(transaction, 'data.data')}
              title={'Транзакции'}
              subTitle={thousandDivider(
                get(transaction, 'data.data', [])?.reduce((a, b) => {
                  const count = parseFloat((b.count || '0').replace(',', '.'))
                  return a + count
                }, 0),

                'шт'
              )}
            />
          </Box>
        </CheckAccess>
        <CheckAccess id={'dashboard-vendor'}>
          <Box justifyContent={'stretch'} mt={4} columnGap={3} display='flex'>
            <TotalOrdersByCity id='dashboard-chart' data={get(topStores, 'data.data')} />
            <TopProducts id='dashboard-chart' data={get(topProducts, 'data.data')} />
          </Box>
        </CheckAccess>
        <CheckAccess id={'dashboard-seller'}>
          <Box justifyContent={'stretch'} mt={4} columnGap={3} display='flex'>
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
