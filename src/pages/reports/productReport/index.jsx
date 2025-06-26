import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import Header from '../../../../components/Header'
import ImageGallery from '../../../../components/ImageGallery'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingBlock from '../../../../components/LoadingBlock'
import LoadingContainer from '../../../../components/LoadingContainer'
import { downloadLinkExcel } from '../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/productReportTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function ProductReportPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [selectedShops, setSelectedShops] = useState('all')
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.productReportTableColumns)
  const { values } = useQueryParams()

  const [selectClients, setselectClients] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const selectClientsFunc = (isChecked, id) => {
    if (isChecked) {
      setselectClients((p) => [...p, id])
    } else {
      setselectClients((p) => p.filter((ids) => ids !== id))
    }
  }
  const tableColumns = tableHeaderSelector({
    clientsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    selectClientsFunc,
    setOrderStoring,
    orderStoring,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID && el.field !== 'category')
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

  const productReportListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_ids: selectedShops != 'all' ? selectedShops.map(({ id }) => id) : undefined,
      producer_id: values?.producer_id,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,

      employee_id: values?.employee_id,
      start_date: values?.start_date || dayjs(new Date()).format('YYYY-MM-DD'),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
    }
  }, [
    values?.offset,
    values?.limit,
    selectedShops,
    values?.producer_id,
    values?.search,
    values?.store_id,
    orderStoring,
    values?.employee_id,
    values?.start_date,
    values?.end_date,
  ])
  const {
    data: productReportList,
    isLoading: productReportListLoading,
    isFetching: isFetchingproductReportList,
    refetch,
  } = useQuery(['productReportList', productReportListFilter], () => requests.getProductReport(productReportListFilter))

  const { mutate: deleteClient, isLoading: isDeletingProduct } = useMutation(requests.deleteClient, {
    onSuccess: () => {
      refetch()
      success('Kлиент успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении клиент!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [productReportListFilter])

  useEffect(() => {
    const count = productReportList?.data?.data?._meta?.total_count
    setselectClients([])
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [productReportList?.data, values?.limit])
  const { mutate: getPorductReportExcelReport, isLoading: isgetPorductReportExcelReport } = useMutation(requests.getPorductReportExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={true}>
      {isgetPorductReportExcelReport && <LoadingBlock zIndex={99} top={0} position={'absolute'} width={'100%'} left='0' />}
      <Header noActions isLoading={false} backIcon backHref='/reports/product' text={'Продажи по товарам '} />
      <Box display='flex' mx={'auto'} flexDirection='column' position='relative' pt={'24px'} px={'50px'} pb={'20px'}>
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
              <InputSearch id='producrs-search' name='search' placeholder={'ID, Имя, Телефон'} uncontrolled />
            </Box>

            <Box minWidth={113} ml={'16px'} mr={'10px'}>
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
            {selectClients.length > 0 && (
              <>
                <Box minWidth={48} ml={'16px'}>
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
                    variant='contained'
                    color='secondary'
                    onClick={() => deleteClient({ data: selectClients })}
                  >
                    <DeleteIcon width='24px' />
                  </Button>
                </Box>
              </>
            )}
            <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
          </Box>

          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                changeColumnSequence={changeColumnSequence}
                resetTableHeader={resetTableHeader}
              />
            </Box>
          </Box>
        </Box>
        <FilterMenu selectedShops={selectedShops} setSelectedShops={setSelectedShops} open={filterMenu} setOpen={setFilterMenu} />
        <Box>
          <AgGridTable
            id='clients-main-table'
            tableSettings
            uniqId='cart_item_id'
            fullDownload={() => getPorductReportExcelReport({ ...productReportListFilter, limit: 1000000 })}
            downloadByFilter={() => getPorductReportExcelReport(productReportListFilter)}
            isDownloading={isgetPorductReportExcelReport}
            columns={tableColumns}
            totalCount={productReportList?.data?.data?._meta?.total_count || 0}
            data={productReportList?.data?.data?.data || []}
            isDataLoading={isFetchingproductReportList || productReportListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Клиент не существует',
              description: 'Если вы не нашли искомого Клиента, нажмите кнопку «Добавить нового» и введите необходимую информацию.',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingproductReportList || productReportListLoading}
          />
        </Box>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить клиента?'}
          desc={'Хотите ли вы удалить клиента?'}
          supDesc={'“Azitromitsin 250 mg”'}
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
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteClient({ data: [openConfirmDialog.id] })}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
