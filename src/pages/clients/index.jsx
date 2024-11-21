import { useEffect, useMemo, useState } from 'react'
import TabContainer from '../../../components/Tab/TabContainer'
import LoadingContainer from '../../../components/LoadingContainer'
import { Box, Button, Typography } from '@mui/material'
import InputSearch from '../../../components/Inputs/InputSearch'
import { user_statuses } from '../../assets/data/user-statuses'
import { useQueryParams } from '../../hooks/useQueryParams'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import tableHeaderSelector from './tableHeaderSelector'
import { useDispatch, useSelector } from 'react-redux'
import { resetTableHeader, updateTableHeader } from '../../redux-toolkit/tableSlices/clientTableColumns'
import ClientDrawer from './ClientDrawer'
import { LoadingButton } from '@mui/lab'
import ConfirmDialog from '../../../components/ConfirmDialog'
import BigTickIcon from '../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../assets/icons/BigWarningIcon'
import { error, success } from '../../../utils/toast'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownWideShort, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons'
import FilterMenu from './FilterMenu'
import ForwardArrow from '../../assets/icons/ForwardArrow'
import { useNavigate } from 'react-router-dom'
import CheckAccess from '../../../components/CheckAccess'
import { useTheme } from '@mui/material'

export default function ClientsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const { columns, loading } = useSelector((state) => state.clientTableColumns)
  const { values } = useQueryParams()
  const [status, setStatus] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [sourceType, setSourceType] = useState('ALL')
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const tableColumns = tableHeaderSelector({ userColumns: columns, setIsDrawerOpen, setOpenConfirmDialog })

  const userListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: values?.search,
      source: sourceType === 'ALL' ? undefined : sourceType,
      group: values?.group_id,
      ordersCountFrom: values?.from_order_count,
      ordersCountTo: values?.to_order_count,
      averageChequeFrom: values?.from_average_cheque,
      averageChequeTo: values?.to_average_cheque,
      lastOrderTimeStart: values?.from_last_order_time,
      lastOrderTimeEnd: values?.to_last_order_time,
      ...(status !== 'ALL' && { status }),
    }
  }, [
    status,
    values?.offset,
    values?.limit,
    values?.search,
    values?.group_id,
    sourceType,
    values?.from_order_count,
    values?.to_order_count,
    values?.from_average_cheque,
    values?.to_average_cheque,
    values?.from_last_order_time,
    values?.to_last_order_time,
  ])

  const {
    data: userList,
    isLoading: userListLoading,
    isFetching: isFetchingUserList,
    refetch,
  } = useQuery(['userList', userListFilter], () => requests.getUserList(userListFilter))

  const { mutate: changeUserStatus, isLoading: isChangingUserStatus } = useMutation(requests.updateUser, {
    onSuccess: () => {
      success('Статус пользователя успешно изменен!')
      setTimeout(() => {
        refetch()
      }, 500)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при обновлении статуса пользователя!')
      refetch()
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [userListFilter])

  useEffect(() => {
    const count =
      status === 'ACTIVE'
        ? userList?.data?.active
        : status === 'INACTIVE'
        ? userList?.data?.inactive
        : status === 'BLOCKED'
        ? userList?.data?.blocked
        : userList?.data.totalCount

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [userList?.data, values?.limit, status])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant='h1'>Клиенты</Typography>
          <CheckAccess id={'/reports/main'}>
            <Button color='secondary' onClick={() => navigate('/reports/main')}>
              Перейти в отчет <ForwardArrow fill={theme.palette.type === 'dark' ? '#FBF7FA' : '#3BA98F'} style={{ marginLeft: '20px' }} />
            </Button>
          </CheckAccess>
        </Box>
        <Box display='flex' mb={3} mt={4}>
          <TabContainer
            customTooltip
            tabs={user_statuses?.map((el) => ({ label: el.name, id: el.id }))}
            counts={[userList?.data?.totalCount, userList?.data?.active, userList?.data?.inactive, userList?.data?.blocked]}
            selected={status}
            setSelected={setStatus}
          />
        </Box>
        <Box columnGap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='producrs-search' name='search' placeholder='Введите информацию о продукте' uncontrolled />
          </Box>
          <Box mt={-2} minWidth={320}>
            <InputSwitch
              uncontrolled
              id='source-type'
              name='source-type'
              value={sourceType}
              defaultValue='ALL'
              onChange={(e) => setSourceType(e)}
              options={[
                { title: 'Все', value: 'ALL' },
                { title: 'Веб', value: 'WEB' },
                { title: 'Мобил', value: 'MOBILE' },
              ]}
            />
          </Box>
          <Box minWidth={180}>
            <Button
              fullWidth
              startIcon={<FontAwesomeIcon width={14} icon={filterMenu ? faArrowUpWideShort : faArrowDownWideShort} />}
              variant='contained'
              color='secondary'
              onClick={() => setFilterMenu((prev) => !prev)}
            >
              Фильтровать
            </Button>
          </Box>
        </Box>
        <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
        <Box>
          <AgGridTable
            id='users-main-table'
            tableSettings
            columns={tableColumns}
            data={userList?.data?.users || []}
            isDataLoading={isFetchingUserList || userListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            status={status}
            isRefreshing={loading || isFetchingUserList || userListLoading}
          />
        </Box>
      </Box>
      <ClientDrawer setOpenConfirmDialog={setOpenConfirmDialog} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(null)} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={
            openConfirmDialog?.type === 'activate'
              ? 'Активировать пользователя?'
              : openConfirmDialog?.type === 'blocked'
              ? 'Блокировать пользователя?'
              : 'Удалить магазин?'
          }
          desc={
            openConfirmDialog?.type === 'activate'
              ? 'Вы действительно хотите активировать пользователя, вы не можете вернуть этот прогресс после активации.'
              : 'Вы действительно хотите блокировать пользователя, вы не можете вернуть этот прогресс после блокировки.'
          }
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isChangingUserStatus}
                onClick={() =>
                  openConfirmDialog?.type === 'activate'
                    ? changeUserStatus({ id: openConfirmDialog.id, data: { status: 'ACTIVE' } })
                    : changeUserStatus({ id: openConfirmDialog.id, data: { status: 'BLOCKED' } })
                }
              >
                Да
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
