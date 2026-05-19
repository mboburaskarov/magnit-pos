import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import useGlobalWebSocket from '@hooks/useGlobalWebSocket'
import useIntersectionObserver from '@hooks/useIntersectionObserver'
import SingleLineChart from '@components/Charts/SingleLineChart'
import CheckAccess from '@components/CheckAccess'
import LoadingContainer from '@components/LoadingContainer'
import { paymentTypes } from '@constants/paymentTypes'
import { useQueryParams } from '@hooks/useQueryParams'
import { DollarSign, ShoppingCart, Users, Activity, Package, Wallet } from 'lucide-react'
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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

const mockStatusDistribution = [
  { status: 'Новый', count: 48 },
  { status: 'Принят', count: 31 },
  { status: 'Готовится', count: 57 },
  { status: 'Курьер принял', count: 23 },
]
const ORDER_STATUS_COLORS = { Новый: '#2563EB', Принят: '#7C3AED', Готовится: '#F59E0B', 'Курьер принял': '#10B981' }
const ORDER_STATUS_LABELS = { Новый: 'Новый', Принят: 'Принят', Готовится: 'Готовится', 'Курьер принял': 'Курьер принял' }
import { Link, useNavigate } from 'react-router-dom'

import DashboardHeader from './DashboardHeader'
import DashboardInfoBox from './DashboardInfoBox'
import DashboardTopsBox from './DashboardTopsBox'
import ImportPage from './expiredImports/index'
import DashboardTargetIcon from '@/assets/icons/DashboardTargetIcon'
import TargetDrawer from './TargetDrawer'

export const dashboardBoxData = (navigate, setOpenDrawer) => [
  {
    title: 'Общая выручка',
    icon: <DollarSign size={20} strokeWidth={2} />,
    count: 'sale_amount',
    endText: 'сум',
    id: 'sale_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    theme: 'lavender',
  },
  {
    title: 'Всего заказов',
    icon: <ShoppingCart size={20} strokeWidth={2} />,
    count: 'sale_count',
    endText: 'шт',
    id: 'sale_count',
    percent: (before, current) => calculatePercentage(before || 1, current),
    theme: 'black',
  },
  {
    title: 'Средний чек',
    icon: <DollarSign size={20} strokeWidth={2} />,
    count: 'average_receipt',
    endText: 'сум',
    id: 'average_receipt',
    percent: (before, current) => calculatePercentage(before || 1, current),
    theme: 'white',
    iconColor: '#F59E0B',
  },
  {
    title: 'Себестоимость',
    icon: <Activity size={20} strokeWidth={2} />,
    count: 'production_cost',
    endText: 'сум',
    id: 'production_cost',
    percent: (before, current) => calculatePercentage(before || 1, current),
    theme: 'white',
    iconColor: '#DC2626',
  },
  {
    title: 'Чистая прибыль',
    icon: <DollarSign size={20} strokeWidth={2} />,
    count: 'income_amount',
    endText: 'сум',
    id: 'income_amount',
    percent: (before, current) => calculatePercentage(before || 1, current),
    theme: 'white',
    iconColor: '#6366F1',
  },
  {
    title: 'Новые клиенты',
    icon: <Users size={20} strokeWidth={2} />,
    count: 'today_created_loyalty_card_count',
    endText: 'шт',
    action: () => {
      navigate('/clients/all?tab=loyalty-cards')
    },
    id: 'today_created_loyalty_card_count',
    percent: (before, current) => calculatePercentage(before || 1, current),
    theme: 'grey',
  },
]
export default function DashboarPage() {
  dayjs.extend(isoWeek)
  const { values } = useQueryParams()

  const [detailing, setDetaling] = useState('week')
  const [selectedAllB2B, setSelectedAllB2B] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedShops, setSelectedShops] = useState('all')
  const [detalization, setDetalization] = useState({ name: 'по дням', value: 'day' })
  const [chartType, setchartType] = useState({ name: 'Продажи', value: 'sale' })
  const [sortBy, setSortBy] = useState('SUM')
  const navigate = useNavigate()
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
  }, [values?.offset, detalization, selectedShops, selectedAllB2B, values?.start_date, values?.end_date, values?.from_time, values?.to_time, values?.limit])

  const { data: chartData, isLoading: isChartLoading } = useQuery(['chartData', dashboard_filter], () => requests.dashboradChart(dashboard_filter))

  const { targetRef: topsBoxRef, hasIntersected: shouldLoadTopsData } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px',
  })

  const { data: topStores, isLoading: isTopStoreLoading } = useQuery(['TopStores', dashboard_filter], () => requests.dashboradTopStores(dashboard_filter), {
    enabled: shouldLoadTopsData,
  })
  const { data: payments, isLoading: isPaymentsLoading } = useQuery(['payments', dashboard_filter], () => requests.dashboradPayments(dashboard_filter), {
    enabled: shouldLoadTopsData,
  })
  const { data: transaction, isLoading: isTransactionLoading } = useQuery(
    ['transaction', dashboard_filter],
    () => requests.dashboradTransaction(dashboard_filter),
    { enabled: shouldLoadTopsData },
  )
  const { data: topProducts, isLoading: isTopProductsLoading } = useQuery(
    ['TopProducts', dashboard_filter],
    () => requests.dashboradTopProducts(dashboard_filter),
    { enabled: shouldLoadTopsData },
  )
  const { data: topBonusProducts, isLoading: isTopBonusProductLoading } = useQuery(
    ['TopBonusProducts', dashboard_filter],
    () => requests.dashboradTopBonusProducts(dashboard_filter),
    { enabled: shouldLoadTopsData },
  )
  const { data: topSellers, isLoading: isTopSellerLoading } = useQuery(['TopSellers', dashboard_filter], () => requests.dashboradTopSellers(dashboard_filter), {
    enabled: shouldLoadTopsData,
  })

  const isTopsDataLoading =
    isTopStoreLoading || isPaymentsLoading || isTransactionLoading || isTopProductsLoading || isTopBonusProductLoading || isTopSellerLoading

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
    [chartData, dashboard_filter],
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
      return `${link}?start_date=${values?.start_date}&end_date=${values?.end_date}&from_time=${values?.from_time}&to_time=${values?.to_time}`
    }
    return `${link}`
  }
  return (
    <LoadingContainer readyState={true}>
      <Box sx={{ padding: '20px 24px', backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        <DashboardHeader setSelectedAllB2B={setSelectedAllB2B} setSelectedShops={setSelectedShops} selectedShops={selectedShops} />

        <Box display='flex' flexDirection='column' position='relative' pt={0} pb={'24px'}>
          <div className='mdash-kpi-grid' style={{ marginTop: '20px' }}>
            {dashboardBoxData(navigate, setOpenDrawer).map((el, ind) => (
              <CheckAccess id={`dashboard-box-${el.id}`} key={el.id}>
                <DashboardInfoBox key={ind} {...el} dashboard_filter={dashboard_filter} />
              </CheckAccess>
            ))}
          </div>

          <CheckAccess id={'dashboard-chart'} style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginTop: '20px' }}>
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
                setSortBy={setSortBy}
                dataKey={sortBy === 'SUM' ? 'all_orders' : 'count'}
                data={{
                  values: toFixData,
                  total: sortBy === 'SUM' ? totalSum : totalCount,
                }}
                measurmentUnit={sortBy === 'SUM' ? ' сум' : ' шт'}
              />

              <div className='mdash-kpi-card' style={{ padding: '20px 20px 12px 20px', borderRadius: '20px', minHeight: 'auto' }}>
                <div className='mdash-chart-header' style={{ marginBottom: '16px' }}>
                  <div>
                    <h3 className='mdash-chart-title'>Аналитические показатели</h3>
                    <p className='mdash-chart-subtitle'>Данные за текущий месяц</p>
                  </div>
                </div>
                <div style={{ position: 'relative', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={mockStatusDistribution}
                        dataKey='count'
                        nameKey='status'
                        cx='50%'
                        cy='50%'
                        innerRadius={85}
                        outerRadius={115}
                        strokeWidth={0}
                        paddingAngle={2}
                      >
                        {mockStatusDistribution.map((entry, i) => (
                          <Cell key={i} fill={ORDER_STATUS_COLORS[entry.status]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(v, n) => [v, ORDER_STATUS_LABELS[n] ?? n]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#0F1115' }}>159</div>
                    <div style={{ fontSize: 12, color: '#667085' }}>Orders</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '24px' }}>
                  {mockStatusDistribution.map((s) => (
                    <div key={s.status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: ORDER_STATUS_COLORS[s.status], flexShrink: 0 }} />
                        <span style={{ color: '#667085', fontWeight: 500 }}>{ORDER_STATUS_LABELS[s.status]}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: '#0F1115' }}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CheckAccess>
        </Box>
        <Box ref={topsBoxRef}>
          {!shouldLoadTopsData && (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography>Scroll down to load statistics...</Typography>
            </Box>
          )}
          {shouldLoadTopsData && isTopsDataLoading && (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography>Loading statistics...</Typography>
            </Box>
          )}

          {/* Row 1: Топ продукты + Топ категорий */}
          <CheckAccess id={'dashboard-vendor'}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <DashboardTopsBox
                id='dashboard-top-products'
                data={get(topProducts, 'data.data')}
                isLoading={isTopProductsLoading}
                title={'Топ продуктов'}
                href={addDateToLink('/reports/top-products')}
                tableData={[
                  { title: 'Продукт', colId: 'name' },
                  { title: 'Количество', colId: 'count', sortable: true },
                  { title: 'Выручка', colId: 'total_amount', sortable: true },
                ]}
              />
              <DashboardTopsBox
                id='dashboard-top-branchs'
                href={addDateToLink('/reports/top-branchs')}
                data={get(topStores, 'data.data')}
                title={'Топ категорий'}
                isLoading={isTopStoreLoading}
                tableData={[
                  { title: 'Категория', colId: 'name' },
                  { title: 'Количество', colId: 'count', sortable: true },
                  { title: 'Выручка', colId: 'total_amount', sortable: true },
                ]}
              />
            </div>
          </CheckAccess>

          {/* Row 2: Платежи + Транзакции */}
          <CheckAccess id={'dashboard-transactions-vendor'}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <DashboardTopsBox
                id='dashboard-payments'
                data={regenerated}
                title={'Платежи'}
                collapseCount={11}
                isLoading={isPaymentsLoading}
                subTitle={thousandDivider(Math.round(regenerated.reduce((a, b) => a + b.amount, 0)), 'сум')}
                tableData={[
                  { title: 'Тип Платежи', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
              <DashboardTopsBox
                id='dashboard-transactions'
                data={get(transaction, 'data.data')}
                title={'Транзакции'}
                isLoading={isTransactionLoading}
                subTitle={thousandDivider(
                  get(transaction, 'data.data', [])?.reduce((a, b) => {
                    const count = parseFloat((b.count || '0').replace(',', '.'))
                    return a + count
                  }, 0),
                  'шт',
                )}
                tableData={[
                  { title: 'Тип', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </div>
          </CheckAccess>

          {/* Row 3: Топ продавцы + Бонусные продукты */}
          <CheckAccess id={'dashboard-seller'}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <DashboardTopsBox
                id='dashboard-sellers'
                data={get(topSellers, 'data.data')}
                isLoading={isTopSellerLoading}
                title={'Топ продавцы'}
                href={addDateToLink('/reports/top-vendors')}
                tableData={[
                  { title: 'Продавец', colId: 'full_name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'total_amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
              <DashboardTopsBox
                id='dashboard-bonus'
                data={get(topBonusProducts, 'data.data')}
                isLoading={isTopBonusProductLoading}
                title={'Бонусные продукты'}
                href={addDateToLink('/reports/bonus-products')}
                tableData={[
                  { title: 'Продукт', colId: 'name' },
                  { title: 'Кол-во', colId: 'count', sortable: true },
                  { title: 'Сумма', colId: 'bonus_amount', sortable: true },
                  { title: 'Прирост', colId: 'stat' },
                ]}
              />
            </div>
          </CheckAccess>
        </Box>
        <TargetDrawer openDrawer={openDrawer} closeDrawer={() => setOpenDrawer(false)} />
      </Box>
    </LoadingContainer>
  )
}
