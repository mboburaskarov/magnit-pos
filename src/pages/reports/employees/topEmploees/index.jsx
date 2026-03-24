import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/topReportsTableColumns'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import MultiOptionSelectNew from '@components/Select/MultiOptionSelectNew'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import LoadingContainer from '@components/LoadingContainer'
import SelectSimple from '@components/Select/SelectSimple'
import InputSearch from '@components/Inputs/InputSearch'
import { useQueryParams } from '@hooks/useQueryParams'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { requests } from '@utils/requests'
import Header from '@components/Header'
import { error } from '@utils/toast'
import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import dayjs from 'dayjs'

import tableHeaderSelector from './tableHeaderSelector'
import FilterMenu from './FilterMenu'

export default function TopEmployeesPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.topReportsTableColumns)
  const { values } = useQueryParams()
  const [selectedShops, setSelectedShops] = useState('all')
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  const [offsetCount, setOffsetCount] = useState(0)
  const [filterMenu, setFilterMenu] = useState(false)
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const tableColumns = tableHeaderSelector({
    employeesColumns: columns,
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
  const [selectedBonusType, setSelectedBonusType] = useState({ id: 'default', name: 'По умолчанию' })
  const sortTypes = [
    { id: 'default', name: 'По умолчанию' },
    { id: 'max_amount', name: 'Топ продажи сум' },
    { id: 'min_amount', name: 'Мин продажи сум' },
    { id: 'max_count', name: 'Больше продаж шт' },
    { id: 'min_count', name: 'Меньше продаж шт' },
  ]
  const topEmployeesReportListFilter = useMemo(() => {
    return {
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,

      store_ids: selectedShops === 'all' ? [] : selectedShops.map((el) => el.id),
    }
  }, [
    values?.offset,
    orderStoring,
    values?.from_time,
    values?.to_time,
    values?.limit,
    selectedBonusType,
    values?.search,
    selectedShops,
    values?.start_date,
    values?.end_date,
  ])
  const {
    data: topEmployeesReportList,
    isLoading: topEmployeesReportListLoading,
    isFetching: isFetchingtopEmployeesReportList,
    refetch,
  } = useQuery(['topEmployeesReportList', topEmployeesReportListFilter], () => requests.topVendorReport(topEmployeesReportListFilter))

  useEffect(() => {
    refetch()
  }, [topEmployeesReportListFilter])

  useEffect(() => {
    const count = topEmployeesReportList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [topEmployeesReportList?.data, values?.limit])
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
      <Header noActions isLoading={false} backIcon backHref='/reports/vendor' text={'Топ продавцы '} />
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
              <InputSearch id='producrs-search' name='search' placeholder={'Имя'} uncontrolled />
            </Box>
            <Box>
              <Box
                width={956}
                display={'flex'}
                sx={{
                  '& .select': {},
                }}
              >
                <Box width={'15px'} />

                <SelectSimple
                  name='customer_id'
                  placeholder={t('placeholders.enterSortType')}
                  isClearable={false}
                  options={sortTypes}
                  small
                  beforeContent={t('placeholders.SortType')}
                  minWidth='285px'
                  white
                  maxWidth={'355px'}
                  isSearchable={false}
                  uncontrolled
                  value={selectedBonusType}
                  onChange={(e) => setSelectedBonusType(e)}
                />
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
            fullDownload={() => clientsExcelReport({ ...topEmployeesReportListFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => clientsExcelReport(topEmployeesReportListFilter)}
            isDownloading={isclientsExcelReport}
            columns={tableColumns}
            totalCount={topEmployeesReportList?.data?.data?._meta?.total_count || 0}
            data={topEmployeesReportList?.data?.data?.data || []}
            isDataLoading={isFetchingtopEmployeesReportList || topEmployeesReportListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Продавцы не существуют',
              description: 'Если вы не нашли искомого продавца, нажмите кнопку «Добавить нового» и введите необходимую информацию.',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingtopEmployeesReportList || topEmployeesReportListLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
