import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/productReportTableColumns'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import LoadingContainer from '@components/LoadingContainer'
import InputSearch from '@components/Inputs/InputSearch'
import { Box, Button, Typography } from '@mui/material'
import { useQueryParams } from '@hooks/useQueryParams'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import LoadingBlock from '@components/LoadingBlock'
import { useMutation, useQuery } from 'react-query'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import { useTranslation } from 'react-i18next'
import { requests } from '@utils/requests'
import ArrowDown from '@icons/ArrowDown'
import Header from '@components/Header'
import { useTheme } from '@mui/styles'
import ArrowUp from '@icons/ArrowUp'
import { error } from '@utils/toast'
import { get } from 'lodash'
import dayjs from 'dayjs'

import ProductReportDashboard from './productReportDashboard'
import tableHeaderSelector from './tableHeaderSelector'
import FilterMenu from './FilterMenu'

const SELECTION_ID = 'checkboxSelectionField'

export default function ProductReportPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [selectedShops, setSelectedShops] = useState('all')
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)

  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.productReportTableColumns)
  const { values } = useQueryParams()

  const [offsetCount, setOffsetCount] = useState(0)
  const [filterMenu, setFilterMenu] = useState(false)

  const tableColumns = tableHeaderSelector({
    reportColumns: columns,
    values,
    setOrderStoring,
    orderStoring,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const productReportListFilter = useMemo(() => {
    return {
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_ids: selectedShops != 'all' ? selectedShops.map(({ id }) => id) : undefined,
      producer_id: values?.producer_id,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,

      employee_id: values?.employee_id,
    }
  }, [
    values?.offset,
    values?.limit,
    selectedShops,
    values?.producer_id,
    values?.search,
    values?.store_id,
    orderStoring,
    values?.from_time,
    values?.to_time,
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

  const { data: productReportDashboard, refetch: fetchProductReportDashboard } = useQuery(
    ['productReportDashboard', values?.search, productReportListFilter],
    () => requests.getProductReportStat(productReportListFilter),
  )

  useEffect(() => {
    refetch()
  }, [productReportListFilter])

  useEffect(() => {
    const count = productReportList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [productReportList?.data, values?.limit])

  const { mutate: getPorductReportExcelReport, isLoading: isgetPorductReportExcelReport } = useMutation(requests.getPorductReportExcelReport, {
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
      {isgetPorductReportExcelReport && <LoadingBlock zIndex={99} top={0} position={'fixed'} width={'100%'} left='0' />}
      <Header noActions isLoading={false} backIcon backHref='/reports/product' text={'Продажи по товарам '} />

      <Box display='flex' mx={'auto'} flexDirection='column' position='relative' pt={'0px'} px={'50px'} pb={'20px'}>
        <Box
          sx={{
            m: ' 0 0 20px',
            userSelect: 'none !important',
            cursor: 'pointer',
            '& > p': {
              cursor: 'pointer',
              userSelect: 'none !important',
            },
          }}
          display={'flex'}
          onClick={() => setIsOpenStatDashboard((p) => !p)}
        >
          {isOpenStatDashboard ? <ArrowUp color='#111217' /> : <ArrowDown />}
          <Typography sx={{ fontWeight: '600', whiteSpace: 'pre' }}>{isOpenStatDashboard ? 'Скрыть статистику' : 'Показать статистику'}</Typography>
        </Box>
        {isOpenStatDashboard && <ProductReportDashboard data={get(productReportDashboard, 'data.data')} />}
        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'24px'} width='100%'>
          <Box display={'flex'}>
            <Box
              width='100%'
              sx={{
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '500px',
                  height: 48,
                },
              }}
            >
              <InputSearch id='producrs-search' name='search' placeholder={'Филиал, Наименование'} uncontrolled />
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
            fullDownload={() => getPorductReportExcelReport({ ...productReportListFilter, offset: 0, limit: 6000000 })}
            downloadByFilter={() => getPorductReportExcelReport(productReportListFilter)}
            isDownloading={isgetPorductReportExcelReport}
            columns={tableColumns}
            totalCount={productReportList?.data?.data?._meta?.total_count || 0}
            data={productReportList?.data?.data?.data || []}
            isDataLoading={isFetchingproductReportList || productReportListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Продажи не существует',
              description: '...',
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
    </LoadingContainer>
  )
}
