import InputSwitch from '@components/Inputs/InputSwitch'
import LoadingContainer from '@components/LoadingContainer'
import { Box, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import { t } from 'i18next'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import tableHeaderSelector from './tableHeaderSelector'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { requests } from '@utils/requests'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/onlineOrderTableColumns'
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import dayjs from 'dayjs'
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import InputSearch from '@components/Inputs/InputSearch'
import SaleDrawer from '@/pages/sales/all-sales/saleDrawer'

function OnlineOrders() {
  const [orderType, setOrderType] = useState('all')
  const [offsetCount, setOffsetCount] = useState(0)
  const dispatch = useDispatch()
  const [openSaleDrawer, setOpenSaleDrawer] = useState(false)

  const { values } = useQueryParams()
  const navigate = useNavigate()
  const onlineOrderFilter = useMemo(() => {
    return {
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      limit: values?.limit || 10,
      search: values?.search,
      status:
        orderType == 'searching_courier' ? 2 : orderType == 'waiting_courier' ? 4 : orderType == 'completed' ? 3 : orderType == 'cancelled' ? -1 : undefined,
      offset: values?.offset || 0,
    }
  }, [values, orderType])
  const { columns, loading } = useSelector((state) => state.onlineOrdersTableColumns)

  const {
    data: onlineOrderList,
    isLoadonlineOng: orderLoading,
    isFetching: isFetchOrder,
    refetch,
  } = useQuery(['ordonlineOr', onlineOrderFilter], () => requests.getAllOnlineOrders(onlineOrderFilter))
  useEffect(() => {
    const count = onlineOrderList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [onlineOrderList, onlineOrderFilter])
  const tableColumns = tableHeaderSelector({ orderColumns: columns })

  return (
    <LoadingContainer readyState={true}>
      {false && <LoadingBlock zIndex={99} top={0} position={'fixed'} width={'100%'} left='0' />}
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'}>
        <Box display={'flex'} mb={'10px'} justifyContent={'space-between'}>
          <Typography onClick={() => navigate('/products/all-by-import')} variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
            {t('Онлайн заказы')}
          </Typography>
        </Box>
        <Box minWidth={320} sx={{ display: 'flex' }}>
          {/* ? 'Новый'
                : p.data.online_status == '2'
                ? 'Поиск курьера'
                : p.data.online_status == '3'
                ? 'Завершено'
                : p.data.online_status == '4'
                ? 'Ожидает курьера'
                : p.data.online_status == '-1'
                ? 'Отменен' */}
          <InputSwitch
            noMarginTop
            uncontrolled
            id='order-type'
            name='order-type'
            value={orderType}
            defaultValue='ALL'
            onChange={(e) => setOrderType(e)}
            options={[
              { title: t('switch.title.all'), value: 'ALL', tooltip: 'Все заказы' },
              { title: t('switch.title.searching_courier'), value: 'searching_courier', tooltip: 'Поиск курьера' },
              { title: t('switch.title.waiting_courier'), value: 'waiting_courier', tooltip: 'Ожидает курьера' },
              { title: t('switch.title.completed'), value: 'completed', tooltip: 'Завершено' },
              { title: t('switch.title.cancelled'), value: 'cancelled', tooltip: 'Отменен' },
            ]}
          />
        </Box>
      </Box>
      <Box px={'20px'} pt={'10px'} display={'flex'}>
        <Box
          sx={{
            '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
            '& .MuiFormControl-root, .MuiFormControl-root:hover': {
              background: 'transparent',
              width: '400px',
              height: 48,
            },
            mr: '10px',
          }}
        >
          <InputSearch fullWidth id='producrs-search' name='search' placeholder={'ID, Аптека'} uncontrolled />
        </Box>
        <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
      </Box>
      <Box p={'20px'}>
        <AgGridTable
          id='online-orders-main-table'
          tableSettings
          columns={tableColumns}
          totalCount={onlineOrderList?.data?.data?._meta?.total_count || 0}
          data={onlineOrderList?.data?.data?.data || []}
          isDataLoading={isFetchOrder}
          offsetCount={offsetCount}
          emptyTableText={{
            title: 'Заказы не найдены',
            description: 'Если вы не нашли искомого Заказа, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
          }}
          updaterAction={(newData) => {
            if (newData) dispatch(updateTableHeader(newData))
          }}
          fullInfoAboutCurrentPage
          resetTable={() => dispatch(resetTableHeader({ refetch }))}
          isRefreshing={false}
        />
      </Box>
     
    </LoadingContainer>
  )
}

export default OnlineOrders
