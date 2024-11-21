import { Box, Button, Typography } from '@mui/material'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import InputSearch from '../../../components/Inputs/InputSearch'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import LoadingContainer from '../../../components/LoadingContainer'
import { requests } from '../../../utils/requests'
import tableHeaderSelector from './tableHeaderSelector'
import { resetTableHeader, updateTableHeader } from '../../redux-toolkit/tableSlices/couriers'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { error, success } from '../../../utils/toast'
import { useQueryParams } from '../../hooks/useQueryParams'
import PayDialog from './components/PayDialog'
import Edit from './components/Edit'
import Create from './components/Create'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function TransactionsPage() {
  const dispatch = useDispatch()
  const methods = useForm()
  const { values } = useQueryParams()
  const [state, setState] = useState({ isCouriersDrawerOpen: null, isEditDrawerOpen: null, isCreateDrawerOpen: null })
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [selectedCourier, setSelectedCourier] = useState(null)
  const availableOrders = selectedCourier?.ordersCount - selectedCourier?.paidOrdersCount
  const { columns } = useSelector((state) => state.courierstableColumns)
  const couriersFilter = useMemo(() => {
    return {
      search: values?.search?.replaceAll('/', '\\'),
      offset: values?.offset || 0,
      limit: values?.limit || 10,
    }
  }, [values?.search, values?.offset, values?.limit])

  const {
    data: couriersList,
    isLoading: couriersListLoading,
    isFetching: isFetchingCouriersList,
    refetch,
  } = useQuery(['orderList'], () => requests.getAllCouriers(couriersFilter))

  const { mutate: payCourierOrders } = useMutation(requests.payCourierOrders, {
    onSuccess: () => {
      success('Kурьер успешно оплачен!')
      refetch()
      setSelectedCourier(null)
      dispatch(resetTableHeader())
      setState({ isCouriersDrawerOpen: false })
    },
    onError: (err) => {
      error(err?.response?.data?.message)
    },
  })
  const { mutate: createCourier } = useMutation(requests.createCourier, {
    onSuccess: () => {
      success('Kурьер успешно Добавлен!')
      refetch()
      dispatch(resetTableHeader())
      setState({ isCreateDrawerOpen: false })
    },
    onError: (err) => {
      error(err?.response?.data?.message)
    },
  })
  const { mutate: editCourier } = useMutation(requests.editCourier, {
    onSuccess: () => {
      success('Kурьер успешно Добавлен!')
      refetch()
      dispatch(resetTableHeader())
      setState({ isCreateDrawerOpen: false })
    },
    onError: (err) => {
      error(err?.response?.data?.message)
    },
  })
  const tableColumns = tableHeaderSelector({
    couriersColumns: columns,
    setSelectedCourier,
    setState,
  })
  const [isRefresh, setIsRefresh] = useState(false)

  useEffect(() => {
    if (isRefresh) {
      requests.refreshCouriers()
      refetch()
      setIsRefresh(false)
    }
  }, [isRefresh])
  useEffect(() => {
    refetch()
  }, [couriersFilter])
  useEffect(() => {
    if (selectedCourier) {
      methods.setValue('available-orders', availableOrders)
      methods.setValue('cardNumber', selectedCourier?.cardNumber)
    }
  }, [selectedCourier])
  const onSubmit = () => {
    const availableOrdersValue = methods.getValues('available-orders')
    const type = methods.getValues('payment-type')

    if (availableOrdersValue < 0) {
      error('Неверное количество заказов для оплаты!')
      methods.setValue('available-orders', availableOrders)
    } else if (availableOrdersValue > availableOrders) {
      error('Неверное количество заказов для оплаты!')
      methods.setValue('available-orders', availableOrders)
    } else {
      payCourierOrders({ courierId: selectedCourier?._id, ordersCount: availableOrdersValue, type })
    }
  }

  const onSubmitCreate = () => {
    const pinfl = methods.getValues('pinfl')
    const cardNumber = methods.getValues('cardNumber')
    createCourier({ pinfl, cardNumber })
  }
  const onSubmitEit = () => {
    const cardNumber = methods.getValues('cardNumber')

    editCourier({ id: selectedCourier?._id, data: { cardNumber } })
  }

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Typography variant='h1' mb={4}>
          Курьеры
        </Typography>
        <Box gap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='couriers-search' name='search' placeholder='Введите имя курьера' uncontrolled />
          </Box>

          <Button
            onClick={() => {
              setState({ isCreateDrawerOpen: true })
            }}
            startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
            variant='contained'
            color='primary'
          >
            Создать
          </Button>
        </Box>
        <Box>
          <AgGridTable
            id='couriers-table'
            tableSettings
            columns={tableColumns}
            data={couriersList?.data?.couriers}
            isDataLoading={isFetchingCouriersList || couriersListLoading}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            resetTable={() => {
              setIsRefresh(true)
              dispatch(resetTableHeader())
            }}
          />
        </Box>
        <PayDialog
          {...{
            methods,
            isCouriersDrawerOpen: state?.isCouriersDrawerOpen,
            selectedCourier,
            setState,
            availableOrders,
            setPaymentMethod,
            onSubmit,
            paymentMethod,
          }}
        />
        <Edit {...{ methods, state, selectedCourier, setState, onSubmit: onSubmitEit }} />
        <Create
          {...{
            methods,
            state,
            selectedCourier,
            setState,
            onSubmit: onSubmitCreate,
          }}
        />
      </Box>
    </LoadingContainer>
  )
}
