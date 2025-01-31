import { Box, Button, Typography } from '@mui/material'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon'
import CashCloseDrawer from './cashCloseDrawer'
import CashTypeDrawer from './cashTypeDrawer'
import tableHeaderSelector from './tableHeaderSelector'
import LeftArrowIcon from '../../../assets/icons/LeftArrow'
import dayjs from 'dayjs'
import { useQueryParams } from '../../../hooks/useQueryParams'

function CardShiftDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { values } = useQueryParams()

  const [open, setOpen] = useState(false)
  const [rowData, setRowData] = useState([])
  const [closeDrawer, setCloseDrawer] = useState(false)
  const methods = useForm()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.cardShiftTableColumns)
  const { mutate: changeCloseBoxNetAmout, isLoading: ischangeCloseBoxNetAmout } = useMutation(requests.changeCloseBoxNetAmout, {
    onSuccess: () => {
      refetch()
      // success('Продукт успешно удален!')
    },
    onError: (err) => {
      refetch()
      error('Ошибка редактирования чистой цены!')
      console.log('err', err)
    },
  })
  const tableColumns = tableHeaderSelector({
    cardShiftColumns: columns,
    t,
    setValue: methods.setValue,
    changeCloseBoxNetAmout,
  })

  const {
    data: closeCashboxPaymentList,
    isLoading: closeCashboxPaymentListLoading,
    isFetching: isFetchingcloseCashboxPaymentList,
    refetch,
  } = useQuery('closeCashboxPaymentList', () => requests.getCloseCashboxPaymentList(id))
  const { data: getCashBoxOperationInfo } = useQuery('getCashBoxOperationInfo', () => requests.getCashBoxOperationInfo(id))
  useEffect(() => {
    if (closeCashboxPaymentList?.data?.data?.data) {
      setRowData([
        ...closeCashboxPaymentList?.data?.data?.data,
        {
          id: 'ag-grid-footer',
          name: 'Итого',
          amount: get(closeCashboxPaymentList, 'data.data.total_data.total_amount'),
          net_amount: get(closeCashboxPaymentList, 'data.data.total_data.total_net_amount'),
          expense_amount: get(closeCashboxPaymentList, 'data.data.total_data.total_expense_amount'),
          difference_amount: get(closeCashboxPaymentList, 'data.data.total_data.total_difference_amount'),
        },
      ])
      get(closeCashboxPaymentList, 'data.data.data', []).map((importData) => {
        methods.setValue(`net_amount_${get(importData, 'id')}`, get(importData, 'net_amount'))
      })
    }
  }, [closeCashboxPaymentList])

  return (
    <FormProvider {...methods}>
      <Box>
        <Box sx={{ p: '20px', alignItems: 'center', display: 'flex' }}>
          <Box
            sx={{
              width: '48px',
              height: '48px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'bunker.100',
            }}
            onClick={() => navigate(`/sales/new-sale/${get(values, 'sale_id')}`)}
          >
            <LeftArrowIcon />
          </Box>
          <Box p={'0 20px'}>
            <Typography fontWeight={'700'} fontSize={'32px'} lineHeight={'48px'}>
              {get(getCashBoxOperationInfo, 'data.data.first_name')}
            </Typography>
            <Typography color={'bunker.500'} fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
              {get(getCashBoxOperationInfo, 'data.data.store_name')} • Kassa ochilgan vaqt:{' '}
              {dayjs(get(getCashBoxOperationInfo, 'data.data.start_time')).format('DD.MM.YYYY HH:mm')}
            </Typography>
          </Box>
          <Button sx={{ width: '248px', marginLeft: 'auto', mr: '10px' }} onClick={() => setCloseDrawer(true)}>
            Закрыть кассу <ArrowRightIcon color={'#fff'} />
          </Button>
        </Box>

        <Box
          sx={{
            '& .ag-center-cols-container': {
              width: '100% !important',
            },
            display: 'flex',
            pb: '20px',
            flexDirection: 'column',
            minHeight: '100vh',
            justifyContent: 'space-between',
          }}
        >
          <Box padding={'20px'}>
            <AgGridTable
              id='products-main-table'
              tableSettings
              columns={tableColumns}
              data={rowData || []}
              totalCount={closeCashboxPaymentList?.data?.data?.data?._meta?.total_count || 0}
              isDataLoading={isFetchingcloseCashboxPaymentList || closeCashboxPaymentListLoading}
              pagination={false}
              updaterAction={(newData) => {
                if (newData) dispatch(updateTableHeader(newData))
              }}
              emptyTableText={{
                title: 'Оплата недоступен',
                description: 'Если вы не можете найти искомый Оплата, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
              }}
              fullInfoAboutCurrentPage
              resetTable={() => dispatch(resetTableHeader({ refetch }))}
              isRefreshing={loading || isFetchingcloseCashboxPaymentList || closeCashboxPaymentListLoading}
            />
          </Box>
        </Box>

        <CashTypeDrawer open={open} setOpen={setOpen} />
        <CashCloseDrawer open={closeDrawer} setOpen={setCloseDrawer} />
      </Box>
    </FormProvider>
  )
}

export default CardShiftDetails
