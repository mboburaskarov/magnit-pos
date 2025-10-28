import { ArrowRightRounded } from '@mui/icons-material'
import { Box, Button, Grid, Typography } from '@mui/material'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
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
import { paymentTypes } from '../../../constants/paymentTypes'
import VendorsIcon from '../../assets/icons/VendorsIcon'
import MoneyArrowDown from '../../assets/icons/dashboard/MoneyArrowDown'
import { useQueryParams } from '../../hooks/useQueryParams'
import DashboardHeader from './DashboardHeader'
import DashboardInfoBox from './DashboardInfoBox'
import ImportPage from './expiredImports/index'
import ChartArrowUp from '../../assets/icons/dashboard/ChartArrowUp'
import TimeForward from '../../assets/icons/dashboard/TimeForward'
import Time24 from '../../assets/icons/dashboard/Time24'
import Wallet from '../../assets/icons/dashboard/Wallet'
import ShoppingBasketArrow from '../../assets/icons/dashboard/ShoppingBasketArrow'
import ShoppingBasketCheck from '../../assets/icons/dashboard/ShoppingBasketCheck'
import StopWatchMinus from '../../assets/icons/dashboard/StopWatchMinus'
import HourglassEnd from '../../assets/icons/dashboard/HourglassEnd'
import Gift from '../../assets/icons/dashboard/Gift'
import DashboardTopsBox from '../../../components/Charts/DashboardTopsBox'
import LeftArrowIcon from '../../assets/icons/LeftArrow'
import RightArrowRound from '../../assets/icons/dashboard/RightArrowRound'
import RightArrowIcon from '../../assets/icons/RightArrowIcon'
import HomeSetting from '../../assets/icons/dashboard/HomeSetting'
export default function DashboarPage() {
  dayjs.extend(isoWeek)
  const { type } = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [detailing, setDetaling] = useState('week')
  const [selectedShops, setSelectedShops] = useState('all')
  const [selectedComapanies, setSelectedComapanies] = useState('all')
  const navigate = useNavigate()
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
    expired_soon_amount,
    total_net_income,
    stock_total_amount,
    bonus_amount,
    expiring_soon_count,
    expired_soon_count,
    before_sale_amount,
    before_product_count,
    before_sale_count,
    not_last_24h_import_amount,
    before_expiring_soon_amount,
    before_expired_soon_amount,
    import_amount,
    before_import_amount,
    before_total_net_income,
    before_stock_amount,
    before_bonus_amount,
    before_expiring_soon_count,
    before_product_turnover,
    product_turnover,
  }) => {
    return [
      {
        title: t('Общая сумма продаж'),
        icon: <MoneyArrowDown color='#fe5000' />,
        count: total_sale_amount,
        percent: calculatePercentage(before_sale_amount || 1, total_sale_amount),
        id: 'total_sale_amount',
        endText: 'сум',
        old: before_sale_amount,
      },
      {
        title: t('Себестоимость'),
        icon: <ChartArrowUp color='#fe5000' />,
        count: product_turnover,
        percent: calculatePercentage(before_sale_amount || 1, product_turnover),
        id: 'product_turnover',
        endText: 'сум',
        old: before_product_turnover,
      },
      {
        title: t('Чистая прибыль'),
        icon: <ChartArrowUp color='#fe5000' />,
        count: total_net_income,
        endText: 'сум',
        percent: calculatePercentage(before_total_net_income || 1, total_net_income),
        id: 'total_net_income',
        old: before_total_net_income,
      },
      {
        title: t('Импорт в ожидании (за весь период)'),
        icon: <TimeForward color='#fe5000' />,
        count: import_amount,
        percent: calculatePercentage(before_import_amount || 1, import_amount),
        id: 'import_amount',
        endText: 'сум',
        old: before_import_amount,
      },
      {
        title: t('Импорты старше 24 часов'),
        icon: <Time24 color='#fe5000' />,
        count: not_last_24h_import_amount,
        percent: 0,
        id: 'current_import_amount',
        endText: 'сум',
        old: 0,
      },
      {
        title: t('Общая сумма баланса'),
        icon: <Wallet color='#fe5000' />,

        count: stock_total_amount,
        endText: 'сум',
        id: 'stock_total_amount',
        percent: calculatePercentage(before_stock_amount || 1, stock_total_amount),
        old: before_stock_amount,
      },

      {
        title: t('Общее количество продаж'),
        icon: <ShoppingBasketArrow color='#fe5000' />,
        count: total_sale_count,
        endText: 'шт',

        id: 'total_sale_count',
        percent: calculatePercentage(before_sale_count || 1, total_sale_count),
        old: before_sale_count,
      },
      {
        title: t('Общее количество остатков'),
        icon: <ShoppingBasketCheck color='#fe5000' />,
        count: total_product_count,
        endText: 'шт',

        percent: calculatePercentage(before_product_count || 1, total_product_count),
        id: 'total_product_count',
        old: before_product_count,
      },
      {
        title: t('Просроченные продукты'),
        icon: <StopWatchMinus color='#fe5000' />,
        count: expired_soon_count,
        endText: 'шт',

        amount: expired_soon_amount,
        id: 'expired_soon_amount',
        percent: calculatePercentage(before_expiring_soon_count || 1, expired_soon_count),
        old: before_expired_soon_amount,
      },
      {
        title: t('Истекающий срок'),
        icon: <HourglassEnd color='#fe5000' />,
        count: expiring_soon_count,
        amount: expiring_soon_amount,
        id: 'expiring_soon_amount',
        endText: 'шт',
        percent: calculatePercentage(before_expiring_soon_count || 1, expiring_soon_count),
        old: before_expiring_soon_amount,
      },

      {
        title: t('Ваш бонус'),
        icon: <Gift color='#fe5000' />,
        count: bonus_amount,
        id: 'bonus_amount',
        percent: calculatePercentage(before_bonus_amount || 1, bonus_amount),
        endText: 'сум',
        old: before_bonus_amount,
      },
    ]
  }

  const dashboard_filter = useMemo(() => {
    const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
    const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)

    return {
      is_franchise: selectedShops == 'all' ? false : undefined,

      limit: values?.limit || 15,
      search: values?.search,
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
      store_ids: selectedShops.length <= 63 && selectedShops != 'all' ? [...selectedShops?.map((a) => a.id)] : null || null,
      type: dataTypeFilter(detalization),
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [values?.offset, detalization, selectedShops, values?.start_date, values?.end_date, values?.from_time, values?.to_time, values?.limit, values?.search])

  const { data: chartData, isLoading: isChartLoading } = useQuery(['chartData', dashboard_filter], () => requests.dashboradChart(dashboard_filter))
  const { data: countStats, isLoading } = useQuery(['countStats', dashboard_filter], () => requests.dashboradCountStats(dashboard_filter), {
    staleTime: 1000 * 60 * 1, // 1 minutes — won’t refetch until 1 mins passed
  })
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
    amount: payments?.data?.data?.[p.prop] ?? 0,
  }))

  return (
    <LoadingContainer readyState={true}>
      <DashboardHeader setSelectedShops={setSelectedShops} selectedShops={selectedShops} />

      <Box display='flex' flexDirection='column' position='relative' pt={0} px={'20px'} pb={'32px'} width={'100%'}>
        <Grid width={'100%'} container>
          <Grid width={'100%'} item>
            <Grid container mt={0} spacing={2}>
              {OrdersStatistics(get(countStats, 'data.data', {}))
                ?.filter((el) => (check ? el : el.title !== 'Общая сумма заказов'))
                ?.map((el, ind) => (
                  <CheckAccess id={`dashboard-box-${el.id}`}>
                    <Grid item xs={12} xl={4} sm={12} md={6} lg={4} gap={0} pb={'0px'} pt={'20px !important'} spacing={2}>
                      <DashboardInfoBox key={ind} {...el} isLoading={isLoading} />
                    </Grid>
                  </CheckAccess>
                ))}
              <CheckAccess id={`franchise-dashboard-box`}>
                <Grid item xs={12} xl={4} sm={12} md={6} lg={4} gap={0} pb={'0px'} pt={'20px !important'} spacing={2}>
                  <Box
                    sx={(theme) => ({
                      display: 'flex',
                      alignItems: 'start',
                      justifyContent: 'start',
                      border: 1,
                      borderColor: '#A4A5AB33',
                      borderRadius: '16px',
                      // cursor: 'pointer',
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
                        minHeight: '115px',

                        m: 0,
                      })}
                    >
                      <HomeSetting color='#fe5000' />
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: '600',
                          lineHeight: '32px',
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
                            height: '40px',
                            backgroundColor: 'white !important',
                            color: 'orange.500',
                            borderColor: 'orange.500',
                            '& svg': {
                              flexShrink: 0,
                            },
                          }}
                          // disabled={size(get(cartItemsList, 'data.data.data')) == 0}
                          color='secondary'
                          onClick={() => setIsCreateOpenDraft(true)}
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
                  { title: 'Тип Платежи	', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
          </Grid>
          {/* <Transactions
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
              /> */}
        </CheckAccess>
        <CheckAccess id={'dashboard-vendor'}>
          <Grid width={'100%'} container mt={'32px'} spacing={2}>
            <Grid item xs={6} xl={6} sm={6} md={6} lg={6} gap={0} pb={'0px'} pt={'20px !important'}>
              <DashboardTopsBox
                id='dashboard-chart'
                href='/reports/top-branchs?backHref=/dashboard'
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
                href='/reports/top-products?backHref=/dashboard'
                tableData={[
                  { title: 'Продукт', colId: 'name' },
                  { title: 'Кол-во ', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'total_amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
          </Grid>
          {/* <TotalOrdersByCity id='dashboard-chart' data={get(topStores, 'data.data')} /> */}
          {/* <TopProducts id='dashboard-chart' data={get(topProducts, 'data.data')} /> */}
        </CheckAccess>
        <CheckAccess id={'dashboard-seller'}>
          <Grid width={'100%'} mt={'32px'} container spacing={2}>
            <Grid item xs={6} xl={6} sm={6} md={6} lg={6}>
              <DashboardTopsBox
                id='dashboard-chart'
                data={get(topSellers, 'data.data')}
                isLoading={isTopSellerLoading}
                title={'Топ продавцы'}
                href='/reports/top-vendors?backHref=/dashboard'
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
                href='/reports/bonus-products?backHref=/dashboard'
                tableData={[
                  { title: 'Продукт	', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'bonus_amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </Grid>
          </Grid>
          {/* <TopSellers id='dashboard-chart' data={get(topSellers, 'data.data')} /> */}
          {/* <TopBonusProducts id='dashboard-chart' data={get(topBonusProducts, 'data.data')} /> */}
        </CheckAccess>
      </Box>
      <CheckAccess id={'dashboard-expired-imports'}>
        <Box>
          <ImportPage />
        </Box>
      </CheckAccess>
    </LoadingContainer>
  )
}
