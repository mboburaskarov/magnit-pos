import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '@components/CheckAccess'
import ConfirmDialog from '@components/ConfirmDialog'
import HeaderWithDashboardWrapper from '@components/HeaderWithDashboard'
import ImageGallery from '@components/ImageGallery'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import BigTickIcon from '@icons/BigTickIcon'
import BigWarningIcon from '@icons/BigWarningIcon'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/transferTableColumns'
import CreateReturn from './createReturn'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
import TransferDashboard from './transferDashboard'
import StatusDetailModal from './statusDetailModal'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import { height } from '@mui/system'

export default function TransferPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.transferTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [orderModel, setOrderModel] = useState(false)
  const [statusModal, setStatusModal] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [filterMenu, setFilterMenu] = useState(false)

  const { mutate: downloadNakladnoy, isLoading: isDownloadNakladnoy } = useMutation(requests.downloadTransferNakladnoy, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })

  const tableColumns = tableHeaderSelector({
    transferColumns: columns,
    t,
    downloadNakladnoy,
    setStatusModal,
    setOpenConfirmDialog: setOpenConfirmDialog,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const transferListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,

      store_id: values?.store_id,
      start_date: values?.start_date,
      end_date: values?.end_date,
      status: values?.status,
      writeoff_date: values?.import_date,
      received_amount_to: values?.received_amount_to,
      received_amount_from: values?.received_amount_from,
    }
  }, [
    values?.offset,
    values?.limit,
    values?.end_date,
    values?.start_date,
    values?.search,
    values?.status,
    values?.store_id,
    values?.received_amount_to,
    values?.received_amount_from,
  ])
  const {
    data: transferList,
    isLoading: transferListLoading,
    isFetching: isFetchingtransferList,
    refetch,
  } = useQuery(['transferlist', transferListFilter], () => requests.getAllTransfer(transferListFilter))

  useEffect(() => {
    refetch()
  }, [transferListFilter])

  useEffect(() => {
    const count = transferList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [transferList?.data, values?.limit])

  const { mutate: deleteTransfer, isLoading: isDeletingProduct } = useMutation(requests.deleteTransferAndReturn, {
    onSuccess: () => {
      refetch()
      success('Возврат был успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении Возврат!')
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })
  const { mutate: getReturnToWarehouseExcelReport, isLoading: isgetReturnToWarehouseExcelReport } = useMutation(requests.getTransferExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  const { data: statusCountList, refetch: fetchStatusCountList } = useQuery(['transferStatusCountList', values?.search, transferListFilter], () =>
    requests.getTransferStatusCount(transferListFilter),
  )
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <HeaderWithDashboardWrapper title={'Перемещение'} component={<TransferDashboard data={get(statusCountList, 'data.data', 0)} />} />
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
              <InputSearch id='producrs-search' name='search' placeholder={'Перемещение номер, наименование'} uncontrolled />
            </Box>

            <Box minWidth={113} ml={'16px'}>
              <Button
                sx={{
                  height: '48px',
                  padding: 0,
                  bgcolor: '#fff',
                  border: '1px solid #ECEDF2',
                  color: 'dark.500',
                  fontWeight: '500',
                  fontSize: '16px',
                  lineHeight: '24px',
                  '& span': {
                    mr: '12px',
                  },
                }}
                fullWidth
                startIcon={<FilterMenuIcon color={theme.palette.black} />}
                variant='contained'
                color='secondary'
                onClick={() => setFilterMenu((prev) => !prev)}
              >
                <Typography fontWeight={600} fontSize={'16px'} lineHeight={'25px'}>
                  {t('filter_dialog.label')}
                </Typography>
              </Button>
            </Box>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                resetTableHeader={resetTableHeader}
                changeColumnSequence={changeColumnSequence}
              />
            </Box>
            <CheckAccess id={'create-transfer'} noAccess>
              <Box minWidth={156}>
                <Button sx={{ height: '48px' }} type='submit' onClick={() => setOrderModel(true)} fullWidth variant='contained' color='primary'>
                  Новое перемещение
                </Button>
              </Box>
            </CheckAccess>
          </Box>
        </Box>
        <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
        <CreateReturn refetch={refetch} open={orderModel} setOpen={setOrderModel} />
        <StatusDetailModal open={statusModal} setOpen={setStatusModal} />

        <Box
          sx={{
            '& .ag-root-wrapper': {
              // height: 'calc(100vh - 300px) !important',
              overflowY: 'auto',
            },
          }}
        >
          <AgGridTable
            id='imports-main-table'
            fullDownload={() => getReturnToWarehouseExcelReport({ ...transferListFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => getReturnToWarehouseExcelReport(transferListFilter)}
            isDownloading={isgetReturnToWarehouseExcelReport}
            tableSettings
            columns={tableColumns}
            defaultOffsetIndex={Number(values?.offset / values?.limit + 1 || 1)}
            data={transferList?.data?.data?.data || []}
            totalCount={transferList?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingtransferList || transferListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            emptyTableText={{
              title: 'Перемещение недоступен',
              description: 'Если вы не можете найти искомый Перемещение',
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingtransferList || transferListLoading}
          />
        </Box>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить Перемещение?'}
          desc={'Вы уверены что хотите удалить Перемещение?'}
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
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteTransfer({ id: openConfirmDialog.id })}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
