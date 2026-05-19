import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '@components/CheckAccess'
import ConfirmDialog from '@components/ConfirmDialog'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import StyledTooltip from '@components/StyledTooltip'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import BigTickIcon from '@icons/BigTickIcon'
import BigWarningIcon from '@icons/BigWarningIcon'
import CategoryIcon from '@icons/CategoryIcon'
import PlusIcon from '@icons/PlusIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/branchTableColumns'
import BranchDrawer from './BranchDrawer'
import tableHeaderSelector from './tableHeaderSelector'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import AddTargetToBranch from './addTargetToBranch'
import TargetIcon from '@/assets/icons/TargetIcon'
import BigTargetIcon from '@/assets/icons/BigTargetIcon'

export default function BranchesPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.branchTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openBranchDrawer, setOpenBranchDrawer] = useState(false)
  const [openAddTargetToBranch, setOpenAddTargetToBranch] = useState(false)
  const navigate = useNavigate()
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const storesListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
    }
  }, [values?.offset, values?.limit, values?.search])

  const {
    data: storesList,
    isLoading: storesListLoading,
    isFetching: isFetchingstoresList,
    refetch,
  } = useQuery(['storesList', storesListFilter], () => requests.getAllStores(storesListFilter))
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    setOpenBranchDrawer,
    values,
    storesList,
    setOpenConfirmDialog,
    setOpenAddTargetToBranch,
  })

  const { mutate: deleteStore, isLoading: isDeletingProduct } = useMutation(requests.deleteStore, {
    onSuccess: () => {
      refetch()
      success('Магазин успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении Магазин!')
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [storesListFilter])

  useEffect(() => {
    const count = storesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [storesList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Аптеки
        </Typography>

        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'}>
            <Box
              width='100%'
              sx={{
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '400px',
                  height: 48,
                },
              }}
            >
              <InputSearch id='producrs-search' name='search' placeholder={'Поиск по таблице'} uncontrolled />
            </Box>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <CheckAccess id={'can-add-payment-service'}>
              <StyledTooltip title={'Управление Ключи'}>
                <Box
                  onClick={() => navigate('/settings/payments-assets')}
                  sx={{
                    backgroundColor: 'bg.10',
                    padding: '10px',
                    borderRadius: '10px',
                    mr: '10px',
                    display: 'flex',
                    width: '38px',
                    height: '38px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CategoryIcon />
                </Box>
              </StyledTooltip>
            </CheckAccess>

            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                changeColumnSequence={changeColumnSequence}
                resetTableHeader={resetTableHeader}
              />
            </Box>
            <CheckAccess id={'branch:add:target'}>
              <Box
                sx={{
                  minWidth: '124px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 20px',
                  borderRadius: '32px',
                  border: '1px solid #D0D5DD',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#F5F7FA',
                  },
                  '& svg': {
                    height: '20px',
                  },
                  mr: '16px',
                }}
                onClick={() => setOpenAddTargetToBranch(true)}
              >
                <BigTargetIcon color={'#000'} />
                <Typography sx={{ fontSize: '16px', fontWeight: '600', lineHeight: '24px', ml: '14px', color: '#000' }}>Таргет</Typography>
              </Box>
            </CheckAccess>
            <CheckAccess id={'branch:create'}>
              <Box minWidth={156}>
                <Button
                  sx={{ height: '48px' }}
                  onClick={() => setOpenBranchDrawer({ mode: 'create' })}
                  fullWidth
                  startIcon={<PlusIcon color='#fff' />}
                  variant='contained'
                  color='primary'
                >
                  {t('button.add_new.text')}
                </Button>
              </Box>
            </CheckAccess>
          </Box>
        </Box>
        <Box>
          <AgGridTable
            id='products-main-table'
            tableSettings
            columns={tableColumns}
            emptyTableText={{
              title: 'Аптеки недоступен',
              description: 'Если вы не можете найти искомый Аптеки, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            data={storesList?.data?.data?.data || []}
            totalCount={storesList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingstoresList || storesListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingstoresList || storesListLoading}
          />
        </Box>
      </Box>

      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить Магазин?'}
          desc={'хотите удалить свой Магазин?'}
          supDesc={openConfirmDialog.name}
          actions={
            <>
              <Button
                sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                onClick={() => setOpenConfirmDialog(null)}
              >
                Нет
              </Button>
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteStore(openConfirmDialog.id)}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
      <AddTargetToBranch open={openAddTargetToBranch} refetch={refetch} setOpen={setOpenAddTargetToBranch} />
      <BranchDrawer refetchBranchList={refetch} openDrawer={openBranchDrawer} closeDrawer={() => setOpenBranchDrawer(false)} />
    </LoadingContainer>
  )
}
