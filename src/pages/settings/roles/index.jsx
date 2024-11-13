import { Box, Button, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import { useEffect, useMemo, useState } from 'react'
import TabContainer from '../../../../components/Tab/TabContainer'
import InputSearch from '../../../../components/Inputs/InputSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/rolesTableColumns'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import tableHeaderSelector from './tableHeaderSelector'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { useQueryParams } from '../../../hooks/useQueryParams'
import RolesCreateDrawer from './RolesCreateDrawer'
import { OverlayNoRowsTemplate } from '../../../../components/AgGridTable/AgGridComponents'
import LoadingBlurry from '../../../../components/LoadingBlurry'
import ActionsBox from './ActionsBox'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import { error, success } from '../../../../utils/toast'
import RoleEditDrawer from './RoleEditDrawer'
import CheckAccess from '../../../../components/CheckAccess'

export default function RolesPage() {
  const [status, setStatus] = useState('ROLES')
  const { columns, loading } = useSelector((state) => state.rolesTableColumns)
  const [offsetCount, setOffsetCount] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const { values } = useQueryParams()
  const tableColumns = tableHeaderSelector({ rolesColumns: columns, setOpenConfirmDialog, setIsDrawerOpen })
  const dispatch = useDispatch()

  const rolesListParams = useMemo(() => {
    return {
      limit: values?.limit,
      offset: values?.offset || 0,
    }
  }, [values?.limit, values?.offset])

  const {
    data: rolesList,
    isLoading: rolesListLoading,
    isFetching: isFetchingrolesList,
    refetch,
  } = useQuery('rolesList', () => requests.getAllRoles(rolesListParams), {
    enabled: status === 'ROLES',
  })
  const {
    data: actionList,
    isLoading: actionListLoading,
    isFetching: isFetchingActionList,
    refetch: refetchActions,
  } = useQuery('actionList', () => requests.getAllActions(), {
    enabled: status === 'ACTION',
  })
  const { mutate: deleteRole, isLoading: isDeletingRole } = useMutation(requests.deleteRole, {
    onSuccess: () => {
      refetch()
      success('Роль успешно удален!')
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении роли!')
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })
  const { mutate: deleteAction, isLoading: isDeletingAction } = useMutation(requests.deleteActions, {
    onSuccess: () => {
      refetchActions()
      success('Действие успешно удалено!')
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetchActions()
      error('Ошибка при удалении действии!')
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    const count = rolesList?.data?.totalCount

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [rolesList?.data?.orders, values?.limit, status])
  useEffect(() => {
    refetch()
  }, [rolesListParams])
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Typography variant='h1'>Роли</Typography>
        <Box mt={4}>
          <Box mb={3}>
            <TabContainer
              customTooltip
              tabs={[
                { label: 'Роли', id: 'ROLES' },
                { label: 'Действия', id: 'ACTION' },
              ]}
              selected={status}
              setSelected={setStatus}
            />
          </Box>
          <Box columnGap={2} display='inline-flex' width='100%'>
            <Box width='100%'>
              <InputSearch fullWidth id='roles-search' name='search' placeholder='Поиск по ролям' uncontrolled />
            </Box>
            {status === 'ROLES' ? (
              <CheckAccess id={'role-create'}>
                <Box minWidth={156}>
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
            ) : (
              <CheckAccess id={'action-create'}>
                <Box minWidth={156}>
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
            )}
          </Box>
          <Box>
            {status === 'ROLES' ? (
              <AgGridTable
                id='roles-main-table'
                tableSettings
                columns={tableColumns}
                data={rolesList?.data?.orders || []}
                isDataLoading={isFetchingrolesList || rolesListLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                isRefreshing={loading || isFetchingrolesList || rolesListLoading}
              />
            ) : (
              <Box mb={4} mt={4}>
                <LoadingBlurry isLoading={actionListLoading || isFetchingActionList} height={-50} outside />
                {actionList?.data?.actions?.map((category, ind) => (
                  <ActionsBox key={ind} data={category} ind={ind} setIsDrawerOpen={setIsDrawerOpen} setOpenConfirmDialog={setOpenConfirmDialog} />
                ))}
                {!actionList?.data?.actions?.length && <OverlayNoRowsTemplate />}
              </Box>
            )}
          </Box>
        </Box>
        <RolesCreateDrawer
          isOpen={isDrawerOpen?.type === 'create'}
          refetch={status === 'ROLES' ? refetch : refetchActions}
          onClose={() => setIsDrawerOpen(null)}
          status={status}
        />
        <RoleEditDrawer
          refetch={status === 'ROLES' ? refetch : refetchActions}
          isOpen={isDrawerOpen?.type === 'role_edit'}
          id={isDrawerOpen?.id}
          onClose={() => setIsDrawerOpen(null)}
          status={status}
        />
      </Box>
      {openConfirmDialog?.type === 'delete' && (
        <ConfirmDialog
          open={openConfirmDialog?.type == 'delete'}
          setOpen={setOpenConfirmDialog}
          icon={<BigWarningIcon />}
          title={'Удалить Роль'}
          desc={'Вы действительно хотите удалить роль?'}
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton variant='contained' type='button' loading={isDeletingRole} onClick={() => deleteRole(openConfirmDialog.id)}>
                Да
              </LoadingButton>
            </>
          }
        />
      )}
      {openConfirmDialog?.type === 'action_delete' && (
        <ConfirmDialog
          open={openConfirmDialog?.type == 'action_delete'}
          setOpen={setOpenConfirmDialog}
          icon={<BigWarningIcon />}
          title={'Удалить действие'}
          desc={'Вы действительно хотите удалить действие?'}
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton variant='contained' type='button' loading={isDeletingAction} onClick={() => deleteAction(openConfirmDialog.id)}>
                Да
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
