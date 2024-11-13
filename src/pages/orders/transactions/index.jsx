import { Box, Button, TextField, Typography } from '@mui/material'
import { useMutation, useQuery } from 'react-query'
import { useEffect, useMemo, useState } from 'react'
import InputSearch from '../../../../components/Inputs/InputSearch'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { useDispatch, useSelector } from 'react-redux'
import tableHeaderSelector from './tableHeaderSelector'
import LoadingContainer from '../../../../components/LoadingContainer'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/transactionsTableColumns'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import OrderDrawer from '../OrderDrawer'
import dayjs from 'dayjs'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import { useForm } from 'react-hook-form'
import { error, success } from '../../../../utils/toast'
import OrderNote from '../OrderNote'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import { LoadingButton } from '@mui/lab'
import LazySelect from '../../../../components/Select/LazySelect'
import { transaction_statuses } from '../../../assets/data/transaction-statuses'
import TabContainer from '../../../../components/Tab/TabContainer'
import { requests } from '../../../../utils/requests'

export default function TransactionsPage() {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user)
  const { columns } = useSelector((state) => state.transactionsTableColumns)
  const { values } = useQueryParams()
  const { register, handleSubmit, setValue } = useForm()
  const [status, setStatus] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [shop, setShop] = useState(null)
  const [client, setClient] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [isOrderCreateNote, setIsOrderCreateNote] = useState(false)
  const [orderIdForNote, setOrderIdForNote] = useState(null)
  const [openAllNotes, setOpenAllNotes] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [isShopWarning, setIsShopWarning] = useState(false)

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 1000, offset: 0 }))
  const { data: operatorsList } = useQuery('operatorsList', () => requests.getAllAdmins({ limit: 1000, offset: 0 }))
  const { data: orderNotes, refetch: refetchNotes } = useQuery(['orderNote', orderIdForNote], () => requests.getOrderNote({ orderId: orderIdForNote }), {
    enabled: !!orderIdForNote,
  })

  const orderListFilter = useMemo(() => {
    return {
      orderNumber: values?.search?.replaceAll('/', '\\'),
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      shopId: shop?._id,
      userId: client?._id,
      fromDate: values?.start_date,
      toDate: values?.end_date,
      ...(status !== 'ALL' && { isPaid: status === 'PAID' ? true : false }),
      // ...(status !== 'ALL' && { status }),
    }
  }, [status, values?.offset, values?.limit, values?.search, shop, client, values?.start_date, values?.end_date])

  const {
    data: orderList,
    isLoading: orderListLoading,
    isFetching: isFetchingOrderList,
    refetch,
  } = useQuery(['orderList', orderListFilter], () => requests.getAlltransactionsOrders({ ...orderListFilter }))

  const { mutate: assigneOperator } = useMutation(requests.assigneOperator, {
    onSuccess: () => {
      success('Заказ успешно передан оператору!')

      refetch()
    },
    onError: (err) => {
      error('Ошибка при назначении заказа оператору!')
      console.log('err', err)
    },
  })

  const tableColumns = tableHeaderSelector({
    orderColumns: columns,
    searchTerm: values?.search,
    setIsDrawerOpen,
    setIsOrderCreateNote,
    setOrderIdForNote,
    refetchNotes,
    setOpenAllNotes,
    setOpenConfirmDialog,
    operatorsList: operatorsList?.data?.admins || [],
    assigneOperator,
    userData,
    setIsShopWarning,
  })

  const { mutate: createOrderNote } = useMutation(requests.createOrderNote, {
    onSuccess: () => {
      setIsOrderCreateNote(false)
      success('Заголовок успешно создан!')

      refetch()
      refetchNotes()
    },
    onError: (err) => {
      error('Ошибка при создании заголовка!')
      console.log('err', err)
    },
  })
  const { mutate: reOrderCourier, isLoading: isReOrdering } = useMutation(requests.reOrderCourier, {
    onSuccess: () => {
      refetch()
      success('Повторный заказ курьера прошел успешно')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при перезаказе курьера!')
      setOpenConfirmDialog(null)

      console.log('err', err)
    },
  })
  const { mutate: cancelCourier } = useMutation(requests.editOrder, {
    onSuccess: () => {
      success('Отмена курьера прошла успешно!')
      setOpenConfirmDialog(null)
      refetch()
    },
    onError: (err) => {
      error('Ошибка при отмене курьера!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })
  const { mutate: cancelOrder } = useMutation(requests.cancelCourier, {
    onSuccess: () => {
      success('Отмена курьера прошла успешно')
      setOpenConfirmDialog(null)
      refetch()
    },
    onError: (err) => {
      error('Ошибка при отмене заказа!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })
  const { mutate: deleteOrder, isLoading: isDeletingOrder } = useMutation(requests.deleteOrder, {
    onSuccess: () => {
      success('Удаление заказа прошла успешно!')
      setOpenConfirmDialog(null)
      refetch()
    },
    onError: (err) => {
      error('Ошибка при удалении заказа!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })
  const { mutate: rePay, isLoading: isRePayLoading } = useMutation(requests.rePay, {
    onSuccess: () => {
      success('Оплата произведена повторно')
      setOpenConfirmDialog(null)
      refetch()
    },
    onError: (err) => {
      error('Ошибка при повторной оплате!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })
  const { mutate: createShopWarning } = useMutation(requests.createShopProblem, {
    onSuccess: () => {
      success('Создание предупреждения прошла успешно!')
      setIsShopWarning(null)
      console.log(1)
      refetch()
    },
    onError: (err) => {
      error('Ошибка при создании предупреждения!')
      setIsShopWarning(null)
      console.log('err', err)
    },
  })
  useEffect(() => {
    refetch()
  }, [orderListFilter])

  const handleCreateOrderNote = (data) => {
    createOrderNote({
      orderId: orderIdForNote,
      note: data.order_note_name,
    })
    setValue('order_note_name', '')
  }

  const handleCreateShopProblem = (data) => {
    createShopWarning({
      orderId: isShopWarning?.orderId,
      orderNumber: isShopWarning?.orderNumber,
      reason: data?.shop_warning_reason,
      shopId: isShopWarning?.shopId,
    })
    setValue('shop_warning_reason', '')
  }
  useEffect(() => {
    const statusData = transaction_statuses.find((el) => el.id === status)
    const count = orderList?.data?.[statusData.countName]
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [orderList?.data, values?.limit, status])

  const customTransactionObj = orderList?.data?.transactions?.map((el) => ({
    ...el,
    isPaid: el.isPaid || false,
    cardNumber: el.cardNumber,
    confirmTime: el.confirmTime,
    shopMargin: el.shopMargin || 0,
  }))

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant='h1'>Транзакци</Typography>
          <DateRangeInput
            defaultFilterData={{ label: 'За все время', start_date: dayjs().tz().startOf('month'), end_date: dayjs().tz() }}
            id='orders-date-range'
          />
        </Box>
        <Box display='flex' mb={3} mt={4}>
          <TabContainer
            customTooltip
            countOnTop
            tabs={transaction_statuses.filter((el) => !el.notVisible).map((el) => ({ id: el.id, label: el.name }))}
            counts={transaction_statuses.filter((el) => !el.notVisible).map((el) => orderList?.data?.[el.countName])}
            selected={status}
            setSelected={setStatus}
          />
        </Box>
        <Box columnGap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='orders-search' name='search' placeholder='Введите полный ID заказа' uncontrolled />
          </Box>
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
        <Box>
          <AgGridTable
            id='orders-main-table'
            tableSettings
            columns={tableColumns}
            data={customTransactionObj}
            isDataLoading={isFetchingOrderList || orderListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            resetTable={() => dispatch(resetTableHeader())}
            status={status}
          />
        </Box>
      </Box>
      <OrderDrawer refetch={refetch} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(null)} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 're-order' ? <BigTickIcon /> : <BigWarningIcon />}
          title={
            openConfirmDialog?.type === 'cancel-order'
              ? `Отменить заказ #${openConfirmDialog.orderNumber}?`
              : openConfirmDialog?.type === 're-order'
              ? `Заказать курьера повторно #${openConfirmDialog.orderNumber}?`
              : openConfirmDialog?.type === 're-pay'
              ? `Повторная оплата #${openConfirmDialog.orderNumber}?`
              : `Отменить курьера #${openConfirmDialog.orderNumber}?`
          }
          desc={
            openConfirmDialog?.type === 'cancel-order'
              ? 'Вы действительно хотите отменить этот заказ? Вы не можете вернуть этот прогресс после отмены заказа?'
              : openConfirmDialog?.type === 're-order'
              ? 'Вы действительно хотите повторно заказать курьера, вы не сможете вернуть этот прогресс после заказа курьера.'
              : openConfirmDialog?.type === 're-pay'
              ? 'Вы уверены, что хотите совершить платеж еще раз?'
              : 'Вы действительно хотите отменить курьера, вы не сможете вернуть этот прогресс после отмены курьера.'
          }
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isReOrdering || isReOrdering || isDeletingOrder || isRePayLoading}
                onClick={() =>
                  openConfirmDialog?.type === 'cancel-order'
                    ? deleteOrder({ orderId: openConfirmDialog.id })
                    : openConfirmDialog?.type === 're-order'
                    ? reOrderCourier({ orderId: openConfirmDialog.id })
                    : openConfirmDialog?.type === 're-pay'
                    ? rePay({
                        orderId: openConfirmDialog.id,
                        shopMargin: openConfirmDialog.shopMargin,
                        orderNumber: openConfirmDialog.orderNumber,
                        originalAmount: openConfirmDialog.originalAmount,
                        shopId: openConfirmDialog.shopId,
                      })
                    : openConfirmDialog?.type === 're-order'
                    ? cancelOrder({ claimId: openConfirmDialog.id })
                    : cancelCourier({ orderId: openConfirmDialog.id, status: 'REJECTED' })
                }
              >
                Да
              </LoadingButton>
            </>
          }
        />
      )}
      <StyledDialog
        open={isOrderCreateNote}
        title={'Введите название заметки'}
        buttonLabel={'Сохранить'}
        customOnSubmit={handleSubmit(handleCreateOrderNote)}
        onClose={() => setIsOrderCreateNote(false)}
      >
        {isOrderCreateNote && (
          <Box p={7} pt={5}>
            <TextField multiline {...register('order_note_name', { required: true })} fullWidth placeholder='Введите название заметки' />
          </Box>
        )}
      </StyledDialog>
      <StyledDialog open={openAllNotes} title={'Все заголовки'} onClose={() => setOpenAllNotes(false)}>
        {orderNotes?.data?.orders?.length > 0 && (
          <Box display={'flex'} flexDirection={'column'} gap={2} padding={7} pt={5}>
            {orderNotes?.data?.orders?.map((el, ind) => (
              <OrderNote key={ind} data={el} />
            ))}
          </Box>
        )}
      </StyledDialog>
      <StyledDialog
        buttonLabel={'Сохранить'}
        customOnSubmit={handleSubmit(handleCreateShopProblem)}
        onClose={() => setIsShopWarning(null)}
        open={isShopWarning}
        title={'Введите причину предупреждения'}
      >
        {isShopWarning && (
          <Box pt={5} p={7}>
            <TextField multiline {...register('shop_warning_reason', { required: true })} fullWidth placeholder='Введите причину предупреждения' />
          </Box>
        )}
      </StyledDialog>
    </LoadingContainer>
  )
}
