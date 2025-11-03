import { LoadingButton } from '@mui/lab'
import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../../components/ConfirmDialog'
import Header from '../../../../../components/Header'
import ImageGallery from '../../../../../components/ImageGallery'
import DateRangeInput from '../../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../../components/LoadingContainer'
import MultiOptionSelectNew from '../../../../../components/Select/MultiOptionSelectNew'
import { downloadLinkExcel } from '../../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../../utils/requests'
import { error, success } from '../../../../../utils/toast'
import BigTickIcon from '../../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../../assets/icons/DeleteIcon'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../../redux-toolkit/tableSlices/topReportsTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function TopBranchesPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.topReportsTableColumns)
  const { values } = useQueryParams()
  const [appType, setAppType] = useState('ALL')
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  const [selectedShops, setSelectedShops] = useState('all')

  const [selectClients, setselectClients] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

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
  const [selectedBonusType, setSelectedBonusType] = useState({ id: 'default', name: 'По умолчанию' })
  const sortTypes = [
    { id: 'default', name: 'По умолчанию' },
    { id: 'max_amount', name: 'Топ продажи сум' },
    { id: 'min_amount', name: 'Мин продажи сум' },
    { id: 'max_count', name: 'Больше продаж шт' },
    { id: 'min_count', name: 'Меньше продаж шт' },
  ]
  const topBranchesReportListFilter = useMemo(() => {
    const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
    const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)
    return {
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,

      store_ids: selectedShops === 'all' ? [] : selectedShops.map((el) => el.id),
    }
  }, [
    values?.offset,
    values?.from_time,
    values?.to_time,
    orderStoring,
    values?.limit,
    selectedBonusType,
    values?.search,
    selectedShops,
    values?.start_date,
    values?.end_date,
  ])
  const {
    data: topBranchesReportList,
    isLoading: topBranchesReportListLoading,
    isFetching: isFetchingtopBranchesReportList,
    refetch,
  } = useQuery(['topBranchesReportList', topBranchesReportListFilter], () => requests.topBranchReport(topBranchesReportListFilter))

  useEffect(() => {
    refetch()
  }, [topBranchesReportListFilter])

  useEffect(() => {
    const count = topBranchesReportList?.data?.data?._meta?.total_count
    setselectClients([])
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [topBranchesReportList?.data, values?.limit])
  const { mutate: clientsExcelReport, isLoading: isclientsExcelReport } = useMutation(requests.getClientsExcelReport, {
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
      <Header historyBack={true} noActions isLoading={false} backIcon backHref={'/reports/branch'} text={'Топ филиалам '} />
      <Box display='flex' mx={'auto'} flexDirection='column' position='relative' pt={'0px'} px={'50px'} pb={'20px'}>
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
              <InputSearch id='producrs-search' name='search' placeholder={'Наименование'} uncontrolled />
            </Box>
            <Box>
              <Box
                width={956}
                display={'flex'}
                sx={{
                  '& .select': {
                    // width: '175px !important',
                  },
                }}
              >
                <Box width={'15px'} />
                <DateRangeInput
                  defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }}
                  id='accounting-report-date-range'
                />
                <Box width={'15px'} />
                <MultiOptionSelectNew
                  zIndex={999}
                  placeholder={t('placeholders.select_shops')}
                  multiple
                  defaultSelectedAll
                  beforeContent={t('placeholders.select_shops')}
                  value={selectedShops}
                  allOptions={get(shopList, 'data.data.ids', [])}
                  selectAllLabel={t('Все филиалы')}
                  options={get(shopList, 'data.data.data', [])}
                  isLoading={false}
                  onChange={(val) => {
                    setSelectedShops(val)
                  }}
                  request={requests.getAllStores}
                />
                <Box width={'15px'} />
              </Box>
            </Box>
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
        <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
        <Box>
          <AgGridTable
            id='clients-main-table'
            tableSettings
            fullDownload={() => clientsExcelReport({ ...topBranchesReportListFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => clientsExcelReport(topBranchesReportListFilter)}
            isDownloading={isclientsExcelReport}
            columns={tableColumns}
            totalCount={topBranchesReportList?.data?.data?._meta?.total_count || 0}
            data={topBranchesReportList?.data?.data?.data || []}
            isDataLoading={isFetchingtopBranchesReportList || topBranchesReportListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Топ филиалам не существует',
              description: '...',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingtopBranchesReportList || topBranchesReportListLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
