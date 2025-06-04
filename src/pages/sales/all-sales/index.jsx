import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ZReportManualCheck from '../../../../components/ChequePaper/zReportManualCheck'
import ImageGallery from '../../../../components/ImageGallery'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { downloadLinkExcel } from '../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/salesTableColumns'
import FilterMenu from './FilterMenu'
import PrintManualZReport from './printManualZReport'
import SaleDrawer from './saleDrawer'
import SaleMiniDashboardHeader from './saleMiniDashboardHeader'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function AllSalesPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.salesTableColumns)
  const { values } = useQueryParams()
  const [orderModel, setOrderModel] = useState(false)

  const [regions, setRegions] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [hasFilter, setHasFilter] = useState(Object.keys(values).length > 2)
  const [openSaleDrawer, setOpenSaleDrawer] = useState(false)
  const [manualZreportData, setManualZreportData] = useState([])
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenSaleDrawer,
  })
  //
  const printContainer = useRef()
  const documentName = useRef('Pharma CHEQUE')
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onAfterPrint: () => {},
  })
  //
  /// filter table columns with permission
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
  const [controlleroffset, setControllerOffset] = useState(0)
  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])
  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])
  const salesListFilter = useMemo(() => {
    setHasFilter(Object.keys(values).length > 2)
    return {
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
      total_amount_to: values?.total_amount_to,
      total_amount_from: values?.total_amount_from,
      start_date: values?.start_date ? values?.start_date + 'T' + values?.from_time : dayjs(new Date()).format('YYYY-MM-DD'),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date + 'T' + values?.to_time,
    }
  }, [
    controlleroffset,
    values?.limit,
    values?.sale_type,
    values?.from_time,
    values?.to_time,
    values?.search,
    values?.payment_type_id,
    values?.producer,
    values?.employee_id,
    values?.cashbox_id,

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
    const count = salesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [salesList?.data, values?.limit])
  const { mutate: allSalesExcelReport, isLoading: isallSalesExcelReport } = useMutation(requests.getAllSalesExcelReport, {
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
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
            {t('sales')}
          </Typography>
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
        <Box>
          <AgGridTable
            id='products-main-table'
            downloadByFilter={() => allSalesExcelReport(salesListFilter)}
            fullDownload={() => allSalesExcelReport({ ...salesListFilter, limit: 1000000 })}
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
            isRefreshing={loading || isFetchingsalesList || salesListLoading}
          />
        </Box>
      </Box>
      <SaleDrawer ids={(salesList?.data?.data?.data || []).map(({ id }) => id)} open={openSaleDrawer} setOpen={setOpenSaleDrawer} />
      <PrintManualZReport setManualZreportData={setManualZreportData} handlePrint={handlePrint} refetch={refetch} open={orderModel} setOpen={setOrderModel} />

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      <ZReportManualCheck printContainer={printContainer} data={manualZreportData} />
    </LoadingContainer>
  )
}
