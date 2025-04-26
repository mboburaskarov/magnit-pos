import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '../../../../components/CheckAccess'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
// import SoonPage from '../../../../components/soon/index'
import dayjs from 'dayjs'
import { downloadExcel } from '../../../../utils/downloadEXCEL'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/returnToWarehouseTableColumns'
import CreateReturn from './createReturn'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'
export default function ReturnToWarehousePage() {
  // return <SoonPage />
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.returnToWarehouseTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [orderModel, setOrderModel] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const [filterMenu, setFilterMenu] = useState(false)
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog: setOpenConfirmDialog,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID)
        ?.map((el) => ({
          ...el,
          label: el.headerName,
          desc: el.desc,
          name: el.colId,
          always_active: el?.always_active ?? el?.always_active,
        }))

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const returnsListFilter = useMemo(() => {
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
    data: returnsList,
    isLoading: returnsListLoading,
    isFetching: isFetchingreturnsList,
    refetch,
  } = useQuery(['returnsList', returnsListFilter], () => requests.getAllReturnToWarehouse(returnsListFilter))

  useEffect(() => {
    refetch()
  }, [returnsListFilter])

  useEffect(() => {
    const count = returnsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [returnsList?.data, values?.limit])
  const { mutate: importsExcelReport, isLoading: isimportsExcelReport } = useMutation(requests.getImportsExcelReport, {
    onSuccess: ({ data }) => {
      downloadExcel(data, 'Возврат')
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })
  const { mutate: deleteWriteOff, isLoading: isDeletingProduct } = useMutation(requests.deleteReturnToWarehouse, {
    onSuccess: () => {
      refetch()
      success('Возврат был успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении Возврат!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })
  const { mutate: getReturnToWarehouseExcelReport, isLoading: isgetReturnToWarehouseExcelReport } = useMutation(requests.getReturnToWarehouseExcelReport, {
    onSuccess: ({ data }) => {
      downloadExcel(data, `Возврат | ${dayjs().format('YYYY-MM-DD HH:mm')}`)
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {'Возврат'}
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
              <InputSearch id='producrs-search' name='search' placeholder={'Возврат номер, наименование'} uncontrolled />
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
            <CheckAccess id={'create-return-to-warehouse'} noAccess>
              <Box minWidth={156}>
                <Button
                  sx={{ height: '48px' }}
                  type='submit'
                  onClick={() => setOrderModel(true)}
                  fullWidth
                  // startIcon={<PlusIcon color='#fff' />}
                  variant='contained'
                  color='primary'
                >
                  Новая Возврат
                </Button>
              </Box>
            </CheckAccess>
          </Box>
        </Box>
        <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
        <CreateReturn refetch={refetch} open={orderModel} setOpen={setOrderModel} />

        <Box>
          <AgGridTable
            id='imports-main-table'
            fullDownload={() => getReturnToWarehouseExcelReport({ ...returnsListFilter, limit: 1000000 })}
            downloadByFilter={() => getReturnToWarehouseExcelReport(returnsListFilter)}
            // fullDownload={() => importsExcelReport({ ...returnsListFilter, limit: 1000000 })}
            // downloadByFilter={() => importsExcelReport(returnsListFilter)}
            isDownloading={isimportsExcelReport}
            tableSettings
            columns={tableColumns}
            defaultOffsetIndex={Number(values?.offset / values?.limit + 1 || 1)}
            data={returnsList?.data?.data?.data || []}
            totalCount={returnsList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingreturnsList || returnsListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            emptyTableText={{
              title: 'Возврат недоступен',
              description: 'Если вы не можете найти искомый Возврат',
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingreturnsList || returnsListLoading}
          />
        </Box>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить инвентаризацию?'}
          desc={'Вы уверены что хотите удалить инвентаризацию?'}
          // supDesc={'“Azitromitsin 250 mg”'}
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
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteWriteOff({ id: openConfirmDialog.id })}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
