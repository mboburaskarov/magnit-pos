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
import { useSelector } from 'react-redux'
import { resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/onlineOrderTableColumns'

function OnlineOrders() {
  const [orderType, setOrderType] = useState('all')
  const [offsetCount, setOffsetCount] = useState(0)
  const { values } = useQueryParams()
  const navigate = useNavigate()
  const onlineOrderFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
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
      {false && <LoadingBlock zIndex={99} top={0} position={'absolute'} width={'100%'} left='0' />}
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Box display={'flex'} mb={'10px'} justifyContent={'space-between'}>
          <Typography onClick={() => navigate('/products/all-by-import')} variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
            {t('Онлайн заказы')}
          </Typography>
        </Box>
        <Box minWidth={320} sx={{ display: 'flex' }}>
          <InputSwitch
            noMarginTop
            uncontrolled
            id='order-type'
            name='order-type'
            value={orderType}
            defaultValue='ALL'
            onChange={(e) => setOrderType(e)}
            options={[
              { title: t('switch.title.all'), value: 'ALL', count: thousandDivider(1000) },
              { title: t('switch.title.active'), value: 'active', count: thousandDivider(1000) },
            ]}
          />
        </Box>
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
