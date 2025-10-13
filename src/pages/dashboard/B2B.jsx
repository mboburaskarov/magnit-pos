import { Box, Grid } from '@mui/material'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { get } from 'lodash'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import CheckAccess from '../../../components/CheckAccess'
import LoadingContainer from '../../../components/LoadingContainer'
import { calculatePercentage } from '../../../utils/calculatePercentage'
import { requests } from '../../../utils/requests'
import OrdersIcon from '../../assets/icons/OrdersIcon'
import ProductsIcon from '../../assets/icons/ProductsIcon'
import RevenueIcon from '../../assets/icons/RevenueIcon'
import VendorsIcon from '../../assets/icons/VendorsIcon'
import { useQueryParams } from '../../hooks/useQueryParams'
import Dashboard_B2B from './Dashboard_B2B'
import DashboardInfoBox from './DashboardInfoBox'
import MoneyArrowDown from '../../assets/icons/dashboard/MoneyArrowDown'
import ChartArrowUp from '../../assets/icons/dashboard/ChartArrowUp'
import TimeForward from '../../assets/icons/dashboard/TimeForward'
import Time24 from '../../assets/icons/dashboard/Time24'
import Wallet from '../../assets/icons/dashboard/Wallet'
import ShoppingBasketArrow from '../../assets/icons/dashboard/ShoppingBasketArrow'
import ShoppingBasketCheck from '../../assets/icons/dashboard/ShoppingBasketCheck'
import StopWatchMinus from '../../assets/icons/dashboard/StopWatchMinus'
import HourglassEnd from '../../assets/icons/dashboard/HourglassEnd'
export default function DashboarB2BPage() {
  dayjs.extend(isoWeek)
  const { type } = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [selectedComapanies, setSelectedComapanies] = useState('all')

  const check = type === 'SUPERADMIN' || type === 'ACCOUNTANT'
  const { t } = useTranslation()

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
    ]
  }

  const dashboard_company_filter = useMemo(() => {
    const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
    const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)
    console.log(selectedComapanies)

    return {
      limit: values?.limit || 15,
      search: values?.search,
      is_franchise: selectedComapanies == 'all' ? true : undefined,
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
      company_ids: selectedComapanies.length <= 63 && selectedComapanies != 'all' ? [...selectedComapanies?.map((a) => a.id)] : null || null,
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [values?.offset, selectedComapanies, values?.start_date, values?.end_date, values?.from_time, values?.to_time, values?.limit, values?.search])
  const { data: companyCountStats, isLoading } = useQuery(
    ['companyCountStats', dashboard_company_filter],
    () => requests.dashboradCountStats(dashboard_company_filter),
    {
      staleTime: 1000 * 60 * 1, // 1 minutes — won’t refetch until 1 mins passed
    }
  )

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={0} px={'20px'} pb={3} width={'100%'}>
        <Grid width={'100%'} container>
          <Grid width={'100%'} item>
            <Dashboard_B2B setSelectedShops={setSelectedComapanies} selectedShops={selectedComapanies} />
            <Grid container mt={0} spacing={2}>
              {OrdersStatistics(get(companyCountStats, 'data.data', {}))
                ?.filter((el) => (check ? el : el.title !== 'Общая сумма заказов'))
                ?.map((el, ind) => (
                  <CheckAccess id={`dashboard-box-${el.id}`}>
                    <Grid item xs={12} xl={4} sm={12} md={6} lg={4} gap={0} pb={'0px'} pt={'20px !important'} spacing={2}>
                      <DashboardInfoBox isLoading={isLoading} key={ind} {...el} />
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
