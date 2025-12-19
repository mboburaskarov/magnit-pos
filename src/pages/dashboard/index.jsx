import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import SingleLineChart from '@components/Charts/SingleLineChart'
import CheckAccess from '@components/CheckAccess'
import LoadingContainer from '@components/LoadingContainer'
import { paymentTypes } from '@constants/paymentTypes'
import { useQueryParams } from '@hooks/useQueryParams'
import ChartArrowUp from '@icons/dashboard/ChartArrowUp'
import Gift from '@icons/dashboard/Gift'
import HomeSetting from '@icons/dashboard/HomeSetting'
import HourglassEnd from '@icons/dashboard/HourglassEnd'
import MoneyArrowDown from '@icons/dashboard/MoneyArrowDown'
import ShoppingBasketArrow from '@icons/dashboard/ShoppingBasketArrow'
import ShoppingBasketCheck from '@icons/dashboard/ShoppingBasketCheck'
import StopWatchMinus from '@icons/dashboard/StopWatchMinus'
import Time24 from '@icons/dashboard/Time24'
import TimeForward from '@icons/dashboard/TimeForward'
import Wallet from '@icons/dashboard/Wallet'
import RightArrowIcon from '@icons/RightArrowIcon'
import { Box, Button, Grid, Typography } from '@mui/material'
import { calculatePercentage } from '@utils/calculatePercentage'
import dataTypeFilter from '@utils/dataTypeFilter'
import { getDetaling } from '@utils/getDetaling'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import DashboardHeader from './DashboardHeader'
import DashboardInfoBox from './DashboardInfoBox'
import DashboardTopsBox from './DashboardTopsBox'
import ImportPage from './expiredImports/index'

export const dashboardBoxData = [
  {
    title: 'Общая сумма продаж',
    icon: <MoneyArrowDown color='#fe5000' />,
    count: 'sale_amount',
    endText: 'сум',
    id: 'sale_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_sale_amount',
  },
  {
    title: 'Себестоимость',
    icon: <ChartArrowUp color='#fe5000' />,
    count: 'production_cost',
    endText: 'сум',
    id: 'production_cost',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_production_cost',
  },
  {
    title: 'Чистая прибыль',
    icon: <ChartArrowUp color='#fe5000' />,
    count: 'income_amount',
    endText: 'сум',
    id: 'income_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_income_amount',
  },
  {
    title: 'Импорт в ожидании (за весь период)',
    icon: <TimeForward color='#fe5000' />,
    count: 'import_amount',
    endText: 'сум',
    id: 'import_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_import_amount',
  },
  {
    title: 'Импорты старше 24 часов',
    icon: <Time24 color='#fe5000' />,
    count: 'not_last_24h_import_amount',
    endText: 'сум',
    id: 'not_last_24h_import_amount',
    percent: () => 0,
    old: 'before_not_last_24h_import_amount',
  },
  {
    title: 'Общая сумма баланса',
    icon: <Wallet color='#fe5000' />,
    count: 'stock_total_amount',
    endText: 'сум',
    id: 'stock_total_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_stock_amount',
  },
  {
    title: 'Общее количество продаж',
    icon: <ShoppingBasketArrow color='#fe5000' />,
    count: 'sale_count',
    endText: 'шт',
    id: 'sale_count',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_sale_count',
  },
  {
    title: 'Общее количество остатков',
    icon: <ShoppingBasketCheck color='#fe5000' />,
    count: 'total_product_count',
    endText: 'шт',
    id: 'total_product_count',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_product_count',
  },
  {
    title: 'Просроченные продукты',
    icon: <StopWatchMinus color='#fe5000' />,
    count: 'expired_soon_count',
    endText: 'сум',
    withoutDivider: true,
    id: 'expired_soon_amount',
    amount: 'expired_soon_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_expired_soon_amount',
  },
  {
    title: 'Истекающие через 3 месяца',
    icon: <HourglassEnd color='#fe5000' />,
    count: 'expiring_soon_count',
    amount: 'expiring_soon_amount',
    withoutDivider: true,
    endText: 'сум',
    id: 'expiring_soon_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_expiring_soon_amount',
  },
  {
    title: 'Количество карт лояльности',
    icon: <Gift color='#fe5000' />,
    count: 'total_loyalty_card_count',
    endText: 'шт',
    id: 'total_loyalty_card_count',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_total_loyalty_card_count',
  },
  {
    title: 'Общая сумма карты лояльности',
    icon: <Gift color='#fe5000' />,
    count: 'total_loyalty_card_balance',
    endText: 'сум',
    id: 'total_loyalty_card_balance',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_total_loyalty_card_balance',
  },
  {
    title: 'Новые карты лояльности на сегодня',
    icon: <Gift color='#fe5000' />,
    count: 'today_created_loyalty_card_count',
    endText: 'шт',
    id: 'today_created_loyalty_card_count',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_today_created_loyalty_card_count',
  },
  {
    title: 'Ваш бонус',
    icon: <Gift color='#fe5000' />,
    count: 'bonus_amount',
    endText: 'сум',
    id: 'bonus_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    old: 'before_bonus_amount',
  },
]
export default function DashboarPage() {
  dayjs.extend(isoWeek)
  const { values } = useQueryParams()
  const [detailing, setDetaling] = useState('week')
  const [selectedAllB2B, setSelectedAllB2B] = useState(false)
  const [selectedShops, setSelectedShops] = useState('all')
  const [detalization, setDetalization] = useState({ name: 'по дням', value: 'day' })
  const [chartType, setchartType] = useState({ name: 'Продажи', value: 'sale' })
  const [sortBy, setSortBy] = useState('SUM')
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

  const dashboard_filter = useMemo(() => {
    return {
      is_franchise: selectedAllB2B ? true : false,
      is_pharma: selectedShops == 'all' ? true : false,
      limit: values?.limit || 15,
      search: values?.search,
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      store_ids: selectedShops.length <= 63 && selectedShops != 'all' ? [...selectedShops?.map((a) => a.id)] : null || null,
      type: dataTypeFilter(detalization),
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [
    values?.offset,
    detalization,
    selectedShops,
    selectedAllB2B,
    values?.start_date,
    values?.end_date,
    values?.from_time,
    values?.to_time,
    values?.limit,
    values?.search,
  ])

  const { data: chartData, isLoading: isChartLoading } = useQuery(['chartData', dashboard_filter], () => requests.dashboradChart(dashboard_filter))
  const { data: topStores, isLoading: isTopStoreLoading } = useQuery(['TopStores', dashboard_filter], () => requests.dashboradTopStores(dashboard_filter))
  const { data: payments, isLoading: isPaymentsLoading } = useQuery(['payments', dashboard_filter], () => requests.dashboradPayments(dashboard_filter))
  const { data: transaction, isLoading: isTransactionLoading } = useQuery(['transaction', dashboard_filter], () =>
    requests.dashboradTransaction(dashboard_filter)
  )
  const { data: topProducts, isLoading: isTopProductsLoading } = useQuery(['TopProducts', dashboard_filter], () =>
    requests.dashboradTopProducts(dashboard_filter)
  )
  const { data: topBonusProducts, isLoading: isTopBonusProductLoading } = useQuery(['TopBonusProducts', dashboard_filter], () =>
    requests.dashboradTopBonusProducts(dashboard_filter)
  )
  const { data: topSellers, isLoading: isTopSellerLoading } = useQuery(['TopSellers', dashboard_filter], () => requests.dashboradTopSellers(dashboard_filter))

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

  const regenerated = paymentTypes.map((p) => ({
    ...p,
    name: p?.title,
    count: payments?.data?.data?.[`${p.prop}_count`],
    percent: payments?.data?.data?.[`${p.prop}_percent`],
    amount: payments?.data?.data?.[p.prop] ?? 0,
  }))
  const addDateToLink = (link) => {
    if (values?.start_date && values?.end_date) {
      return `${link}&start_date=${values?.start_date}&end_date=${values?.end_date}&from_time=${values?.from_time}&to_time=${values?.to_time}`
    }
    return `${link}`
  }
  return (
    <LoadingContainer readyState={true}>
      <DashboardHeader setSelectedAllB2B={setSelectedAllB2B} setSelectedShops={setSelectedShops} selectedShops={selectedShops} />

      <Box display='flex' flexDirection='column' position='relative' pt={0} px={'20px'} pb={'32px'} width={'100%'}>
        <Grid width={'100%'} container>
          <Grid width={'100%'} item>
            <Grid container mt={0} spacing={2}>
              {dashboardBoxData.map((el, ind) => (
                <CheckAccess id={`dashboard-box-${el.id}`} key={el.id}>
                  <Grid item xs={12} xl={3} sm={12} md={6} lg={4} gap={0} pb={'0px'} pt={'20px !important'}>
                    <DashboardInfoBox key={ind} {...el} dashboard_filter={dashboard_filter} />
                  </Grid>
                </CheckAccess>
              ))}
              <CheckAccess id={`franchise-dashboard-box`}>
                <Grid item xs={12} xl={3} sm={12} md={6} lg={4} gap={0} pb={'0px'} pt={'20px !important'}>
                  <Box
                    sx={(theme) => ({
                      display: 'flex',
                      alignItems: 'start',
                      justifyContent: 'start',
                      border: 1,
                      borderColor: '#A4A5AB33',
                      borderRadius: '16px',
                      minHeight: '154px',
                      width: '100%',
                      height: '100%',
                    })}
                  >
                    <Box
                      key={1}
                      sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        p: '20px',
                        height: '164px',

                        m: 0,
                      })}
                    >
                      <HomeSetting color='#fe5000' />
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: '600',
                          lineHeight: '20px',
                          my: '12px',
                        }}
                      >
                        Перейти к панели управления B2B
                      </Typography>
                      <Link to={'/dashboard/b2b'}>
                        <Button
                          sx={{
                            borderRadius: '50px',
                            mr: '4px',
                            p: '9px 16px',
                            height: '30px',
                            backgroundColor: 'white !important',
                            color: 'orange.500',
                            fontSize: '14px',
                            borderColor: 'orange.500',
                            '& svg': {
                              flexShrink: 0,
                            },
                          }}
                          color='secondary'
                        >
                          Показать <RightArrowIcon />
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Grid>
              </CheckAccess>
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
                  isLoading={isChartLoading}
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
      </Box>
      <Box sx={{ padding: '0 20px' }}>
        <CheckAccess id={'dashboard-transactions-vendor'}>
          <Grid width={'100%'} container spacing={2}>
            <Grid item xs={6} xl={6} sm={6} md={6} lg={6} gap={2}>
              <DashboardTopsBox
                id='dashboard-chart'
                data={regenerated}
                title={'Платежи'}
                collapseCount={9}
                isLoading={isPaymentsLoading}
                subTitle={thousandDivider(Math.round(regenerated.reduce((a, b) => a + b.amount, 0)), 'сум')}
                tableData={[
                  { title: 'Тип Платежи	', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
            <Grid item xs={6} xl={6} sm={6} md={6} lg={6} gap={2}>
              <DashboardTopsBox
                id='dashboard-chart'
                data={get(transaction, 'data.data')}
                title={'Транзакции'}
                isLoading={isTransactionLoading}
                subTitle={thousandDivider(
                  get(transaction, 'data.data', [])?.reduce((a, b) => {
                    const count = parseFloat((b.count || '0').replace(',', '.'))
                    return a + count
                  }, 0),

                  'шт'
                )}
                tableData={[
                  { title: 'Тип	', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
          </Grid>
        </CheckAccess>
        <CheckAccess id={'dashboard-vendor'}>
          <Grid width={'100%'} container mt={'32px'} spacing={2}>
            <Grid item xs={6} xl={6} sm={6} md={6} lg={6} gap={0} pb={'0px'} pt={'20px !important'}>
              <DashboardTopsBox
                id='dashboard-chart'
                href={addDateToLink('/reports/top-branchs')}
                data={get(topStores, 'data.data')}
                title={'Топ филиалам'}
                isLoading={isTopStoreLoading}
                tableData={[
                  { title: 'Филиал', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'total_amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
            <Grid item xs={6} xl={6} sm={6} md={6} lg={6} gap={0} pb={'0px'} pt={'20px !important'}>
              <DashboardTopsBox
                id='dashboard-chart'
                data={get(topProducts, 'data.data')}
                isLoading={isTopProductsLoading}
                title={'Топ продукты'}
                href={addDateToLink('/reports/top-products')}
                tableData={[
                  { title: 'Продукт', colId: 'name' },
                  { title: 'Кол-во ', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'total_amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
          </Grid>
        </CheckAccess>
        <CheckAccess id={'dashboard-seller'}>
          <Grid width={'100%'} mt={'32px'} container spacing={2}>
            <Grid item xs={6} xl={6} sm={6} md={6} lg={6}>
              <DashboardTopsBox
                id='dashboard-chart'
                data={get(topSellers, 'data.data')}
                isLoading={isTopSellerLoading}
                title={'Топ продавцы'}
                href={addDateToLink('/reports/top-vendors')}
                tableData={[
                  { title: 'Продавец	', colId: 'full_name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'total_amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
            <Grid item xs={6} xl={6} sm={6} md={6} lg={6}>
              <DashboardTopsBox
                id='dashboard-chart'
                data={get(topBonusProducts, 'data.data')}
                isLoading={isTopBonusProductLoading}
                title={'Бонусные продукты'}
                href={addDateToLink('/reports/bonus-products')}
                tableData={[
                  { title: 'Продукт	', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'bonus_amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
          </Grid>
        </CheckAccess>
      </Box>
      <CheckAccess id={'dashboard-expired-imports'}>
        <Box>
          <ImportPage dashboard_filter={dashboard_filter} />
        </Box>
      </CheckAccess>
    </LoadingContainer>
  )
}
