import { Box, Button, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useMemo, useState } from 'react'
import InputSearch from '../../../../components/Inputs/InputSearch'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import tableHeaderSelector from './tableHeaderSelector'
import { LoadingButton } from '@mui/lab'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { error, success } from '../../../../utils/toast'
import CheckAccess from '../../../../components/CheckAccess'
import { useDispatch, useSelector } from 'react-redux'
import UserCreateDrawer from './UserCreateDrawer'
import UserEditDrawer from './UserEditDrawer'
import SoonPage from '../../../../components/soon'
export default function UsersPage() {
  return <SoonPage />
  const dispatch = useDispatch()
  const { values } = useQueryParams()
  const { columns, loading } = useSelector((state) => state.usersTableColumns)
  const [offsetCount, setOffsetCount] = useState(0)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const tableColumns = tableHeaderSelector({ userColumns: columns, setIsDrawerOpen, setOpenConfirmDialog })

  const adminListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: values?.search,
    }
  }, [status, values?.offset, values?.limit, values?.search])

  const {
    data: adminsList,
    isLoading: adminListLoading,
    isFetching: isFetchingadminList,
    refetch,
  } = useQuery('adminsList', () => requests.getAllAdmins(adminListFilter))

  useEffect(() => {
    refetch()
  }, [adminListFilter])

  useEffect(() => {
    const count = adminsList?.data.totalCount

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [adminsList?.data, values?.limit, status])

  const { mutate: deleteAdmin, isLoading: isDeletingAdmin } = useMutation(requests.deleteAdmin, {
    onSuccess: () => {
      refetch()
      success('Пользователь успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении пользователя!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Typography variant='h1' mb={3}>
          Пользователи
        </Typography>

        <Box columnGap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='vendor-search' name='shop-search' placeholder='Введите информацию о пользователе для поиска' uncontrolled />
          </Box>
          <CheckAccess id={'user-create'}>
            <Box minWidth={216}>
              <Button
                onClick={() => setIsDrawerOpen({ type: 'create' })}
                fullWidth
                startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                variant='contained'
                color='primary'
              >
                Создать
              </Button>
            </Box>
          </CheckAccess>
        </Box>
        <Box>
          <AgGridTable
            id='admins-main-table'
            tableSettings
            columns={tableColumns}
            data={adminsList?.data?.admins || []}
            isDataLoading={isFetchingadminList || adminListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingadminList || adminListLoading}
          />
        </Box>
        <UserCreateDrawer
          refetch={refetch}
          setOpenConfirmDialog={setOpenConfirmDialog}
          isOpen={isDrawerOpen?.type === 'create'}
          onClose={() => setIsDrawerOpen(null)}
        />

        <UserEditDrawer
          refetch={refetch}
          setOpenConfirmDialog={setOpenConfirmDialog}
          isOpen={isDrawerOpen?.type === 'edit'}
          id={isDrawerOpen?.id}
          onClose={() => setIsDrawerOpen(null)}
        />
        {openConfirmDialog && (
          <ConfirmDialog
            open={!!openConfirmDialog}
            setOpen={setOpenConfirmDialog}
            icon={<BigWarningIcon />}
            title={'Удалить пользователя?'}
            desc={'Вы действительно хотите удалить пользователя? вы не можете вернуть этот прогресс, после удаления вы не сможете восстановить пользователя.'}
            actions={
              <>
                <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                  Нет
                </Button>
                <LoadingButton variant='contained' type='button' loading={isDeletingAdmin} onClick={() => deleteAdmin(openConfirmDialog.id)}>
                  Да
                </LoadingButton>
              </>
            }
          />
        )}
      </Box>
    </LoadingContainer>
  )
}
