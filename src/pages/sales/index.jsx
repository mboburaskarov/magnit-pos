import { Box, Button, TextField, Typography } from '@mui/material'
import TabContainer from '../../../components/Tab/TabContainer'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import { useEffect, useMemo, useState } from 'react'
import InputSearch from '../../../components/Inputs/InputSearch'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import { useDispatch, useSelector } from 'react-redux'
import tableHeaderSelector from './tableHeaderSelector'
import LoadingContainer from '../../../components/LoadingContainer'
import { useQueryParams } from '../../hooks/useQueryParams'
import { resetTableHeader, updateTableHeader } from '../../redux-toolkit/tableSlices/orderTableColumns'
import OrderDrawer from './OrderDrawer'
import dayjs from 'dayjs'
import DateRangeInput from '../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import StyledDialog from '../../../components/Dialogs/StyledDialog'
import { useForm } from 'react-hook-form'
import { error, success } from '../../../utils/toast'
import OrderNote from './OrderNote'
import BigTickIcon from '../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../assets/icons/BigWarningIcon'
import ConfirmDialog from '../../../components/ConfirmDialog'
import { LoadingButton } from '@mui/lab'
import { order_statuses } from '../../assets/data/order-statuses'
import FilterMenu from './FilterMenu'
import { faArrowDownWideShort, faArrowUpWideShort, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CheckAccess from '../../../components/CheckAccess'
import CreateWithNoorDrawer from './CreateWithNoorDrawer'
import TrackingDrawer from './TrackingDrawer'
import SoonPage from '../../../components/soon'

export default function SalesPage() {
  return <SoonPage />
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user)
  const { columns, loading } = useSelector((state) => state.orderTableColumns)
  const { values } = useQueryParams()
  const { register, handleSubmit, setValue } = useForm()
  const [status, setStatus] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [isOrderCreateNote, setIsOrderCreateNote] = useState(false)

  const [orderIdForNote, setOrderIdForNote] = useState(null)
  const [openAllNotes, setOpenAllNotes] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [regions, setRegions] = useState([])
  const [isShopWarning, setIsShopWarning] = useState(false)
  const [trackingWebview, setTrackingWebview] = useState(null)
  const operator = values?.operator
  const shop = values?.shop
  const client = values?.client

  const { data: operatorsList } = useQuery('operatorsList', () => requests.getAllAdmins({ limit: 20, offset: 0 }))
  const { data: orderNotes, refetch: refetchNotes } = useQuery(['orderNote', orderIdForNote], () => requests.getOrderNote({ orderId: orderIdForNote }), {
    enabled: !!orderIdForNote,
  })

  const orderListFilter = useMemo(() => {
    return {
      orderNumber: values?.search?.replaceAll('/', '\\'),
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      shopId: shop,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      userId: client,
      moderatorId: operator,
      fromDate: values?.start_date,
      toDate: values?.end_date,
      source: values?.source,
      ...(status !== 'ALL' && { status }),
    }
  }, [status, values?.offset, values?.limit, values?.source, values?.search, shop, client, values?.start_date, values?.end_date, operator, regions])

  const {
    data: orderList,
    isLoading: orderListLoading,
    isFetching: isFetchingOrderList,
    refetch,
  } = useQuery(['orderList', orderListFilter], () => requests.getAllOrders(orderListFilter))

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
    setTrackingWebview,
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
    const statusData = order_statuses.find((el) => el.id === status)
    const count = orderList?.data?.[statusData.countName]
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [orderList?.data, values?.limit, status])

  // return <SoonPage />
}
