import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/salesTableColumns'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import ZReportManualCheck from '@components/ChequePaper/zReportManualCheck'
import ImageGallery from '@components/ImageGallery'
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingBlock from '@components/LoadingBlock'
import LoadingContainer from '@components/LoadingContainer'
import { useQueryParams } from '@hooks/useQueryParams'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import LeftArrowIcon from '@icons/LeftArrow'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import { requests } from '@utils/requests'
import { error } from '@utils/toast'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'

import FilterMenu from './FilterMenu'
import PrintManualZReport from './printManualZReport'
import SaleDrawer from './saleDrawer'
import SaleMiniDashboardHeader from './saleMiniDashboardHeader'
import tableHeaderSelector from './tableHeaderSelector'
import { useWebView } from '@/layouts/WebviewProvider'
const LoadingExcel = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        zIndex: 9999,
        maxWidth: '250px',
        backgroundColor: 'white',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid #ECEDF2',
      }}
    >
      <CircularProgress size={20} sx={{ color: 'orange.500' }} />
      <Box>
        <Typography fontWeight={600} fontSize={'14px'}>
          Загрузка Excel...
        </Typography>
        <Typography fontSize={'12px'} color='text.secondary'>
          Пожалуйста, подождите
        </Typography>
      </Box>
    </Box>
  )
}
export default function AllSalesPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.salesTableColumns)
  const { isWebview } = useWebView()
  const { values } = useQueryParams()
  const [orderModel, setOrderModel] = useState(false)
  const navigate = useNavigate()
  const [regions, setRegions] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [hasFilter, setHasFilter] = useState(Object.keys(values).length > 2)
  const [openSaleDrawer, setOpenSaleDrawer] = useState(false)
  const [manualZreportData, setManualZreportData] = useState([])
  const [isCustomersSales, setIsCustomersSales] = useState(false)

  const [currentSaleId, setCurrentSaleId] = useState(get(values, 'sale_id', ''))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gridApi, setGridApi] = useState(null)

  const tableColumns = tableHeaderSelector({
    salesColumns: columns,
    values,
    setOpenSaleDrawer,
  })
  const printContainer = useRef()
  const documentName = useRef('Pharma CHEQUE')
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onAfterPrint: () => {},
  })
  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])
  const [controlleroffset, setControllerOffset] = useState(0)

  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])

  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])

  const salesListFilter = useMemo(() => {
    setIsCustomersSales(values?.customer_id ? true : false)
    setHasFilter(Object.keys(values).length > 2)
    return {
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      limit: values?.limit || 10,
      offset: controlleroffset || 0,
      search: values?.search,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      store_id: values?.store_id,
      category_id: values?.category_id,
      producer: values?.producer,
      payment_type_id: values?.payment_type_id,
      vendor_id: values?.vendor_id,
      employee_id: values?.employee_id,
      cashbox_id: values?.cashbox_id,
      sale_type: values?.sale_type,
      type: values?.type,
      referral: values?.referral,

      total_amount_to: values?.total_amount_to,
      total_amount_from: values?.total_amount_from,
      customer_id: values?.customer_id,
    }
  }, [
    controlleroffset,
    values?.limit,
    values?.referral,
    values?.sale_type,
    values?.type,
    values?.from_time,
    values?.to_time,
    values?.search,
    values?.payment_type_id,
    values?.producer,
    values?.employee_id,
    values?.cashbox_id,
    values?.customer_id,

    values?.category_id,
    values?.vendor_id,
    values?.store_id,
    values?.total_amount_to,
    values?.total_amount_from,
    values?.start_date,
    values?.end_date,
  ])

  const {
    data: salesList,
    isLoading: salesListLoading,
    isFetching: isFetchingsalesList,
    refetch,
  } = useQuery(['salesList', salesListFilter], () => requests.getAllSales(salesListFilter))

  const { data: saleStatsData } = useQuery(['saleStatsData', salesListFilter], () => requests.getAllSaleStats(salesListFilter))

  useEffect(() => {
    if (get(values, 'sale_id')) {
      setOpenSaleDrawer(true)
    }
    refetch()
  }, [salesListFilter])

  useEffect(() => {
    // Auto-focus row when currentSaleId changes
    if (gridApi && currentSaleId) {
      // Give grid time to render rows
      setTimeout(() => {
        const rowNode = gridApi.getRowNode(currentSaleId) // Remove String() conversion

        if (rowNode && rowNode.rowIndex !== undefined) {
          // Scroll to row
          gridApi.ensureNodeVisible(rowNode, 'middle')

          if (rowNode) {
            // Get the row element and scroll to it
            const rowElement = document.querySelector(`[row-id="${currentSaleId}"]`)

            if (rowElement) {
              rowElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }
          }
          // Focus the cell - pass column key as string
          gridApi.setFocusedCell(rowNode, 'id', null)
          gridApi.deselectAll()
          // Select the row
          rowNode.setSelected(true)
          gridApi.refreshCells({
            rowNodes: [rowNode],
            force: true,
          })
          // Optional: flash the row for visual feedback
          // gridApi.flashCells({ rowNodes: [rowNode] })
        } else {
          console.warn('Row not found for ID:', currentSaleId)
        }
      }, 0)
    }
  }, [gridApi, currentSaleId])

  useEffect(() => {
    const count = salesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [salesList?.data, values?.limit])

  const { mutate: allSalesExcelReport, isLoading: isallSalesExcelReport } = useMutation(requests.getAllSalesExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })

  return (
    <LoadingContainer readyState={true}>
      {isallSalesExcelReport && <LoadingExcel />}

      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box
            onClick={() =>
              isCustomersSales &&
              navigate(
                `/reports/discount-card-report?start_date=${values?.start_date}&end_date=${values?.end_date}&from_time=${values?.from_time}&to_time=${values?.to_time}`,
              )
            }
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isCustomersSales && (
              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: 'bunker.100',
                  '&:hover': {
                    backgroundColor: 'gray.10',
                  },
                }}
              >
                <LeftArrowIcon />
              </Box>
            )}
            <Typography ml={'20px'} variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
              {t('sales')} {values?.customer_name && `(${values?.customer_name})`}
            </Typography>
          </Box>

          <Button sx={{ height: '48px' }} onClick={() => setOrderModel(true)}>
            Распечатать отчет
          </Button>
        </Box>
        <SaleMiniDashboardHeader saleStatsData={get(saleStatsData, 'data.data')} />
        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box width='100%' display={'flex'}>
            <Box
              sx={{
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '400px',
                  height: 48,
                },
              }}
            >
              <InputSearch fullWidth id='producrs-search' name='search' placeholder={'ID, Филиал'} uncontrolled />
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
                startIcon={<FilterMenuIcon color={!hasFilter ? theme.palette.black : theme.palette.orange[500]} />}
                variant='contained'
                color='secondary'
                onClick={() => setFilterMenu((prev) => !prev)}
              >
                <Typography color={!hasFilter ? theme.palette.black : theme.palette.orange[500]} fontWeight={600} fontSize={'16px'} lineHeight={'25px'}>
                  {t('filter_dialog.label')}
                </Typography>
              </Button>
            </Box>
            <Box width={'20px'} />
            <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
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
          </Box>
        </Box>
        <FilterMenu setRegions={setRegions} open={filterMenu} setOpen={setFilterMenu} />
        <Box
          sx={{
            '& .ag-row-focus': {
              backgroundColor: '#fff !important',
            },
            '& .ag-row-selected': {
              backgroundColor: '#fff3e0 !important',
            },
          }}
        >
          <AgGridTable
            id='products-main-table'
            downloadByFilter={() => allSalesExcelReport(salesListFilter)}
            fullDownload={() => allSalesExcelReport({ ...salesListFilter, offset: 0, limit: 1000000 })}
            isDownloading={isallSalesExcelReport}
            tableSettings
            columns={tableColumns}
            data={salesList?.data?.data?.data || []}
            totalCount={salesList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingsalesList || salesListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            emptyTableText={{
              title: 'Продажи недоступен',
              description: 'Если вы не можете найти искомый Продажи, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingsalesList || salesListLoading || currentSaleId}
            onGridApiReady={setGridApi}
          />
        </Box>
      </Box>
      <SaleDrawer
        ids={(salesList?.data?.data?.data || []).map(({ id }) => id)}
        open={openSaleDrawer}
        setOpen={setOpenSaleDrawer}
        currentSaleId={currentSaleId}
        setCurrentSaleId={setCurrentSaleId}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <PrintManualZReport setManualZreportData={setManualZreportData} handlePrint={handlePrint} refetch={refetch} open={orderModel} setOpen={setOrderModel} />

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      <ZReportManualCheck printContainer={printContainer} data={manualZreportData} />
    </LoadingContainer>
  )
}
