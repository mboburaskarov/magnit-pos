import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '@components/CheckAccess'
import ConfirmDialog from '@components/ConfirmDialog'
import HeaderWithDashboardWrapper from '@components/HeaderWithDashboard'
import ImageGallery from '@components/ImageGallery'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import BigTickIcon from '@icons/BigTickIcon'
import BigWarningIcon from '@icons/BigWarningIcon'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/inventoryTableColumns'
import CreateInventory from './createInventory'
import FilterMenu from './FilterMenu'
import InventoryDashboard from './inventoryDashboard'
import tableHeaderSelector from './tableHeaderSelector'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import MgPageHeader from '@components/MgPageHeader'

export default function InventoryPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.inventoryTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [orderModel, setOrderModel] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const [filterMenu, setFilterMenu] = useState(false)
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(false)
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog: setOpenConfirmDialog,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const inventoryListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: values?.store_id,
      start_date: values?.start_date,
      end_date: values?.end_date,
      status: values?.status,
    }
  }, [values?.offset, values?.limit, values?.end_date, values?.start_date, values?.search, values?.status, values?.store_id])
  const {
    data: inventoryList,
    isLoading: inventoryListLoading,
    isFetching: isFetchinginventoryList,
    refetch,
  } = useQuery(['inventoryList', inventoryListFilter], () => requests.getAllInventory(inventoryListFilter))

  useEffect(() => {
    refetch()
  }, [inventoryListFilter])

  useEffect(() => {
    const count = inventoryList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [inventoryList?.data, values?.limit])

  const { mutate: deleteInventory, isLoading: isDeletingProduct } = useMutation(requests.deleteInventory, {
    onSuccess: () => {
      refetch()
      success('Инвентаризация был успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении Инвентаризация!')
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })

  const { data: statusCountList } = useQuery(['inventoryStatusCountList', values?.search, inventoryListFilter], () =>
    requests.getInventoryStatusCount(inventoryListFilter)
  )
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' px={'24px'} pb={'20px'}>
        <MgPageHeader
          title='Инвентаризация'
          subtitle={`Всего: ${new Intl.NumberFormat('ru-UZ').format(inventoryList?.data?.data?._meta?.total_count || 0)}`}
          showStatsToggle
          isOpenStats={isOpenStatDashboard}
          onStatsToggle={() => setIsOpenStatDashboard((p) => !p)}
          showCreate
          onCreate={() => setOrderModel(true)}
          createLabel='Создать'
          createPermissionId='create-inventory'
        />

        {isOpenStatDashboard && <InventoryDashboard data={get(statusCountList, 'data.data', 0)} />}

        <div className='mg-table-card' style={{ marginTop: '12px' }}>
          {/* Toolbar block matching table-toolbar exactly */}
          <div
            className='mg-table-toolbar'
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--mg-border)' }}
          >
            <div className='mg-table-toolbar-left' style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              {/* Search field Box */}
              <Box
                width='100%'
                maxWidth={400}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                    border: '1px solid #ECEDF2',
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    px: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                    background: 'transparent',
                    width: '100%',
                    height: '40px',
                  },
                }}
              >
                <InputSearch id='producrs-search' name='search' placeholder={'Инвентаризацияный номер, наименование'} uncontrolled />
              </Box>
            </div>

            <div className='mg-table-toolbar-right' style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Filter button */}
              <button
                type='button'
                className={`mg-btn mg-btn-secondary ${filterMenu ? 'active' : ''}`}
                onClick={() => setFilterMenu((prev) => !prev)}
                style={{
                  height: '40px',
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #ECEDF2',
                  borderRadius: '12px',
                  background: '#fff',
                  color: '#111217',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <FilterMenuIcon color='#111217' />
                <span style={{ fontSize: '14px' }}>{t('filter_dialog.label')}</span>
              </button>

              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                resetTableHeader={resetTableHeader}
                changeColumnSequence={changeColumnSequence}
              />
            </div>
          </div>

          <Box style={{ padding: 0 }}>
            <AgGridTable
              id='imports-main-table'
              isDownloading={inventoryListLoading}
              tableSettings
              columns={tableColumns}
              defaultOffsetIndex={Number(values?.offset / values?.limit + 1 || 1)}
              data={inventoryList?.data?.data?.data || []}
              totalCount={inventoryList?.data?.data?._meta?.total_count || 0}
              isDataLoading={isFetchinginventoryList || inventoryListLoading}
              offsetCount={offsetCount}
              updaterAction={(newData) => {
                if (newData) dispatch(updateTableHeader(newData))
              }}
              emptyTableText={{
                title: 'Инвентаризация недоступен',
                description: 'Если вы не можете найти искомый Инвентаризация',
              }}
              fullInfoAboutCurrentPage
              resetTable={() => dispatch(resetTableHeader({ refetch }))}
              isRefreshing={loading || isFetchinginventoryList || inventoryListLoading}
            />
          </Box>
        </div>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить инвентаризацию?'}
          desc={'Вы уверены что хотите удалить инвентаризацию?'}
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
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteInventory({ id: openConfirmDialog.id })}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
