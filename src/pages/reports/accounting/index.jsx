import { Box, Button, IconButton, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import tableHeaderSelector from './tableHeaderSelector'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useEffect, useMemo, useState } from 'react'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { error, success } from '../../../../utils/toast'
import SelectSimple from '../../../../components/Select/SelectSimple'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigWarningCircleIcon from '../../../assets/icons/BigWarningCircleIcon'
import { LoadingButton } from '@mui/lab'
import dayjs from 'dayjs'
import TickIcon from '../../../assets/icons/TickIcon'
import StyledTooltip from '../../../../components/StyledTooltip'

export default function ReportAccountingPage() {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [offsetNonPaidCount, setNonPaidOffsetCount] = useState(0)
  const [shop, setShop] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [openBulkPayConfirmDialog, setOpenBulkPayConfirmDialog] = useState(null)
  const [isNonPaid, setIsNonPaid] = useState(false)
  const [selectedRowsIds, setSelectedRowIds] = useState([])

  const tableColumns = tableHeaderSelector({ setOpenConfirmDialog, isNonPaid })

  const accountingReportFilter = useMemo(() => {
    return { limit: values?.limit || 10, offset: values?.offset || 0, dbId: shop?._id, fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.limit, values?.offset, shop, values?.start_date, values?.end_date])

  const accountingNonPaidReportFilter = useMemo(() => {
    return { limit: values?.limitNonPaid || 10, offset: values?.offsetNonPaid || 0, dbId: shop?._id, fromDate: values?.start_date, toDate: values?.end_date }
  }, [values?.limitNonPaid, values?.offsetNonPaid, shop, values?.start_date, values?.end_date])

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 1000, offset: 0 }))

  const {
    data: accountingReportData,
    isLoading: isLoadingAccountingReportData,
    isFetching: isFetchingAccountingReportData,
    refetch,
  } = useQuery('accountingReportData', () => requests.getAccountingReport(accountingReportFilter))

  const {
    data: accountingNonPaidReportData,
    isLoading: isLoadingNonPaidAccountingReportData,
    isFetching: isFetchingNonPaidAccountingReportData,
    refetch: refetchNonPaid,
  } = useQuery('accountingNonPaidReportData', () => requests.getNonPaidAccountingReport(accountingNonPaidReportFilter))

  const { mutate: getReportExcel, isLoading: isDownloadingExcel } = useMutation(requests.getAccountingReportExcel, {
    onSuccess: ({ data }) => {
      const link = document.createElement('a')
      link.href = data?.[0]?.url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    onError: (err) => {
      error('Ошибка при загрузке Excel — бухгалтерские отчеты!')
      console.error(err)
    },
  })
  const { mutate: getNonPaidReportExcel, isLoading: isDownloadingNonPaidExcel } = useMutation(requests.getNonPaidAccountingReportExcel, {
    onSuccess: ({ data }) => {
      const link = document.createElement('a')
      link.href = data?.[0]?.url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    onError: (err) => {
      error('Ошибка при загрузке Excel — бухгалтерские отчеты!')
      console.error(err)
    },
  })
  const { mutate: makeTransactionPaid, isLoading: isMakingTransactionPaid } = useMutation(requests.makeTransactionPaid, {
    onSuccess: () => {
      setOpenConfirmDialog(null)
      refetch()
      refetchNonPaid()
      success('Деньги успешно переведены!')
    },
    onError: (err) => {
      refetch()
      error('Ошибка при переводе денег!')
      console.log('err', err)
    },
  })
  const { mutate: makeTransactionPaidWithID } = useMutation(requests.makeTransactionPaidWithID, {
    onSuccess: () => {
      setOpenConfirmDialog(null)
      refetch()
      refetchNonPaid()
      setOpenBulkPayConfirmDialog(null)
      success('Деньги успешно переведены!')
    },
    onError: (err) => {
      refetch()
      error('Ошибка при переводе денег!')

      console.log('err', err)
    },
  })

  useEffect(() => {
    const count = accountingReportData?.data.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [accountingReportData?.data, values?.limit])

  useEffect(() => {
    const count = accountingNonPaidReportData?.data.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limitNonPaid))
    setNonPaidOffsetCount(offsetsCount || 0)
  }, [accountingNonPaidReportData?.data, values?.limitNonPaid])

  useEffect(() => {
    refetch()
  }, [accountingReportFilter])

  useEffect(() => {
    refetchNonPaid()
  }, [accountingNonPaidReportFilter])

  useEffect(() => {
    refetch()
  }, [accountingReportFilter])
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box display='inline-flex' justifyContent='space-between'>
          <Typography variant='h1'>Бухгалтерский отчет</Typography>
          <Box display='inline-flex' mt={1} columnGap={2}>
            <DateRangeInput
              defaultFilterData={{ label: 'Этот месяц', start_date: dayjs().tz().startOf('month'), end_date: dayjs().tz() }}
              id='accounting-report-date-range'
            />
            <Box minWidth={240}>
              <SelectSimple
                id='shop'
                name='shop'
                minWidth='auto'
                placeholder={'Выберите магазин'}
                uncontrolled
                options={shopList?.data.shops}
                value={shop}
                onChange={(e) => setShop(e)}
              />
            </Box>
          </Box>
        </Box>
        <Box justifyContent='flex-end' mb={-1} mt={4} columnGap={2} display='inline-flex' width='100%'>
          <InputSwitch
            uncontrolled
            noMarginTop
            name='activity_type'
            required={true}
            defaultValue='PAID'
            onChange={(id) => setIsNonPaid(id === 'NON_PAID')}
            options={[
              { title: 'Оплаченные транзакции', value: 'PAID' },
              { title: 'Неоплаченные транзакции', value: 'NON_PAID' },
            ]}
          />
          {selectedRowsIds.length > 0 && (
            <StyledTooltip title={'Статус оплаченных выбранных транзакций'}>
              <IconButton onClick={() => setOpenBulkPayConfirmDialog(true)} sx={{ height: 56, width: 56, borderRadius: 4, p: '14px' }}>
                <TickIcon />
              </IconButton>
            </StyledTooltip>
          )}
        </Box>
        <Box>
          <AgGridTable
            selection={isNonPaid}
            addAllProducts={() => setSelectedRowIds(accountingNonPaidReportData?.data?.contracts?.map((el) => el._id))}
            deleteAllProducts={() => setSelectedRowIds([])}
            selectedRowsIds={selectedRowsIds}
            setAddedItems={(data) => setSelectedRowIds([...selectedRowsIds, data?._id])}
            setRemovedItems={(data) => setSelectedRowIds(selectedRowsIds.filter((el) => el !== data?._id))}
            offsetQuery={isNonPaid ? 'offsetNonPaid' : 'offset'}
            limitQuery={isNonPaid ? 'limitNonPaid' : 'limit'}
            download={() => (isNonPaid ? getNonPaidReportExcel(accountingNonPaidReportFilter) : getReportExcel(accountingReportFilter))}
            id='report-accounting-main-table'
            columns={tableColumns}
            data={isNonPaid ? accountingNonPaidReportData?.data?.contracts : accountingReportData?.data?.contracts || []}
            isDataLoading={
              isNonPaid
                ? isLoadingNonPaidAccountingReportData || isFetchingNonPaidAccountingReportData
                : isLoadingAccountingReportData || isFetchingAccountingReportData
            }
            offsetCount={isNonPaid ? offsetNonPaidCount : offsetCount}
            isDownloading={isNonPaid ? isDownloadingNonPaidExcel : isDownloadingExcel}
          />
        </Box>
      </Box>
      <ConfirmDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        icon={<BigWarningCircleIcon />}
        title='Перевели деньги?'
        desc='Вы действительно перевели деньги на банковский счет продавца? Вы не можете отказаться от этого процесса.'
        actions={
          <Box width='100%' display='flex'>
            <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
              Нет
            </Button>
            <LoadingButton
              variant='contained'
              type='button'
              loading={isMakingTransactionPaid}
              onClick={() => makeTransactionPaid({ orderId: openConfirmDialog })}
            >
              Да
            </LoadingButton>
          </Box>
        }
      />
      <ConfirmDialog
        open={openBulkPayConfirmDialog}
        setOpen={setOpenBulkPayConfirmDialog}
        icon={<BigWarningCircleIcon />}
        title={`Перевели деньги ${selectedRowsIds?.length} счет?`}
        desc={`Вы действительно перевели деньги на ${selectedRowsIds?.length} банковский счет продавца? Вы не можете отказаться от этого процесса.`}
        actions={
          <Box width='100%' display='flex'>
            <Button variant='contained' color='secondary' onClick={() => setOpenBulkPayConfirmDialog(null)}>
              Нет
            </Button>
            <LoadingButton variant='contained' type='button' onClick={() => makeTransactionPaidWithID({ orderIds: selectedRowsIds })}>
              Да
            </LoadingButton>
          </Box>
        }
      />
    </LoadingContainer>
  )
}
