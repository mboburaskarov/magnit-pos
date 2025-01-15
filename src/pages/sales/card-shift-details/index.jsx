import { Box, Button } from '@mui/material'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon'
import CashCloseDrawer from './cashCloseDrawer'
import CashTypeDrawer from './cashTypeDrawer'
import tableHeaderSelector from './tableHeaderSelector'

function CardShiftDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [open, setOpen] = useState(false)
  const [rowData, setRowData] = useState([])
  const [closeDrawer, setCloseDrawer] = useState(false)
  const methods = useForm()

  const { columns, loading } = useSelector((state) => state.cardShiftTableColumns)
  const { mutate: changeCloseBoxNetAmout, isLoading: ischangeCloseBoxNetAmout } = useMutation(requests.changeCloseBoxNetAmout, {
    onSuccess: () => {
      refetch()
      success('Продукт успешно удален!')
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении товара!')
      console.log('err', err)
    },
  })
  const tableColumns = tableHeaderSelector({
    cardShiftColumns: columns,
    t,
    changeCloseBoxNetAmout,
  })

  const {
    data: closeCashboxPaymentList,
    isLoading: closeCashboxPaymentListLoading,
    isFetching: isFetchingcloseCashboxPaymentList,
    refetch,
  } = useQuery('closeCashboxPaymentList', () => requests.getCloseCashboxPaymentList(id))

  useEffect(() => {
    if (closeCashboxPaymentList?.data?.data?.data) {
      // methods.setValue(`net_amount_222`, get(closeCashboxPaymentList, 'data.data.total_data.total_net_amount'))
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
        {/* <Button onClick={() => setOpen(true)}>open</Button> */}
        <Box sx={{ display: 'flex', pb: '20px', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
          <Box padding={'20px 50px'}>
            <AgGridTable
              id='products-main-table'
              tableSettings
              columns={tableColumns}
              data={rowData || []}
              isDataLoading={isFetchingcloseCashboxPaymentList || closeCashboxPaymentListLoading}
              pagination={false}
              updaterAction={(newData) => {
                if (newData) dispatch(updateTableHeader(newData))
              }}
              fullInfoAboutCurrentPage
              resetTable={() => dispatch(resetTableHeader({ refetch }))}
              isRefreshing={loading || isFetchingcloseCashboxPaymentList || closeCashboxPaymentListLoading}
            />
          </Box>
          <Button sx={{ width: '248px', marginLeft: 'auto', mr: '20px' }} onClick={() => setCloseDrawer(true)}>
            Закрыть кассу <ArrowRightIcon color={'#fff'} />
          </Button>
        </Box>

        <CashTypeDrawer open={open} setOpen={setOpen} />
        <CashCloseDrawer open={closeDrawer} setOpen={setCloseDrawer} />
      </Box>
    </FormProvider>
  )
}

export default CardShiftDetails
