import { Box, Grid } from '@mui/material'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import CheckAccess from '../../../components/CheckAccess'
import LoadingContainer from '../../../components/LoadingContainer'
import { calculatePercentage } from '../../../utils/calculatePercentage'
import dataTypeFilter from '../../../utils/dataTypeFilter'
import { getDetaling } from '../../../utils/getDetaling'
import { requests } from '../../../utils/requests'
import OrdersIcon from '../../assets/icons/OrdersIcon'
import ProductsIcon from '../../assets/icons/ProductsIcon'
import RevenueIcon from '../../assets/icons/RevenueIcon'
import VendorsIcon from '../../assets/icons/VendorsIcon'
import { useQueryParams } from '../../hooks/useQueryParams'
import Dashboard_B2B from './Dashboard_B2B'
import DashboardInfoBox from './DashboardInfoBox'
export default function DashboarB2BPage() {
  dayjs.extend(isoWeek)
  const { type } = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [detailing, setDetaling] = useState('week')
  const [selectedShops, setSelectedShops] = useState('all')
  const [selectedComapanies, setSelectedComapanies] = useState('all')

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
        title: t('Импорт в ожидании (за весь период)'),
        icon: <RevenueIcon color='#fe5000' />,
        count: import_amount,
        percent: calculatePercentage(before_import_amount || 1, import_amount),
        id: 'import_amount',
        endText: 'сум',
        old: before_import_amount,
      },
      {
        title: t('Импорты старше 24 часов'),
        icon: <RevenueIcon color='#fe5000' />,
        count: not_last_24h_import_amount,
        percent: 0,
        id: 'current_import_amount',
        endText: 'сум',
        old: 0,
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
        icon: <VendorsIcon color='#fe5000' />,
        count: total_net_income,
        endText: 'сум',
        percent: calculatePercentage(before_total_net_income || 1, total_net_income),
        id: 'total_net_income',
        old: before_total_net_income,
      },
      {
        title: t('Общее количество продаж'),
        icon: <OrdersIcon color='#fe5000' />,
        count: total_sale_count,
        endText: 'шт',

        id: 'total_sale_count',
        percent: calculatePercentage(before_sale_count || 1, total_sale_count),
        old: before_sale_count,
      },
      {
        title: t('Общее количество остатков'),
        icon: <ProductsIcon color='#fe5000' />,
        count: total_product_count,
        endText: 'шт',

        percent: calculatePercentage(before_product_count || 1, total_product_count),
        id: 'total_product_count',
        old: before_product_count,
      },
      {
        title: t('Просроченные продукты'),
        icon: <VendorsIcon color='#fe5000' />,
        count: expired_soon_count,
        endText: 'шт',

        amount: expired_soon_amount,
        id: 'expired_soon_amount',
        percent: calculatePercentage(before_expiring_soon_count || 1, expired_soon_count),
        old: before_expired_soon_amount,
      },
      {
        title: t('Истекающий срок'),
        icon: <VendorsIcon color='#fe5000' />,
        count: expiring_soon_count,
        amount: expiring_soon_amount,
        id: 'expiring_soon_amount',
        endText: 'шт',
        percent: calculatePercentage(before_expiring_soon_count || 1, expiring_soon_count),
        old: before_expiring_soon_amount,
      },

      {
        title: t('Ваш бонус'),
        icon: <VendorsIcon color='#fe5000' />,
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
  const dashboard_company_filter = useMemo(() => {
    const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
    const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)

    return {
      limit: values?.limit || 15,
      search: values?.search,
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
      company_ids: selectedComapanies.length <= 63 && selectedComapanies != 'all' ? [...selectedComapanies?.map((a) => a.id)] : null || null,
      type: dataTypeFilter(detalization),
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [
    values?.offset,
    detalization,
    selectedComapanies,
    values?.start_date,
    values?.end_date,
    values?.from_time,
    values?.to_time,
    values?.limit,
    values?.search,
  ])
  const { data: chartData } = useQuery(['chartData', dashboard_filter], () => requests.dashboradChart(dashboard_filter))
  const { data: countStats } = useQuery(['countStats', dashboard_filter], () => requests.dashboradCountStats(dashboard_filter))
  const { data: companyCountStats } = useQuery(['companyCountStats', dashboard_company_filter], () => requests.dashboradCountStats(dashboard_company_filter))
  const { data: topStores } = useQuery(['TopStores', dashboard_filter], () => requests.dashboradTopStores(dashboard_filter))
  const { data: payments } = useQuery(['payments', dashboard_filter], () => requests.dashboradPayments(dashboard_filter))
  const { data: transaction } = useQuery(['transaction', dashboard_filter], () => requests.dashboradTransaction(dashboard_filter))
  const { data: topProducts } = useQuery(['TopProducts', dashboard_filter], () => requests.dashboradTopProducts(dashboard_filter))
  const { data: topBonusProducts } = useQuery(['TopBonusProducts', dashboard_filter], () => requests.dashboradTopBonusProducts(dashboard_filter))
  const { data: topSellers } = useQuery(['TopSellers', dashboard_filter], () => requests.dashboradTopSellers(dashboard_filter))

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
      <Box display='flex' flexDirection='column' position='relative' pt={0} px={'20px'} pb={3} width={'100%'}>
        <Grid width={'100%'} container>
          <Grid width={'100%'} item>
            <Dashboard_B2B setSelectedShops={setSelectedComapanies} selectedShops={selectedComapanies} />
            <Grid container mt={0} spacing={2}>
              {OrdersStatistics(get(companyCountStats, 'data.data', {}))
                ?.filter((el) => el?.id != 'bonus_amount')
                ?.filter((el) => (check ? el : el.title !== 'Общая сумма заказов'))
                ?.map((el, ind) => (
                  <CheckAccess id={`dashboard-box-${el.id}`}>
                    <Grid item xs={12} xl={4} sm={12} md={6} lg={4} gap={0} pb={'0px'} pt={'20px !important'} spacing={2}>
                      <DashboardInfoBox key={ind} {...el} />
                    </Grid>
                  </CheckAccess>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LoadingContainer>
  )
}
