import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/storeSummaryTableColumns';
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll';
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput';
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate';
import MultiOptionSelectNew from '@components/Select/MultiOptionSelectNew';
import { makeFormattedData } from '@utils/helper/makeFormattedTableData';
import AgGridTable from '@components/AgGridTable/AgGridTable';
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL';
import LoadingContainer from '@components/LoadingContainer';
import InputSearch from '@components/Inputs/InputSearch';
import { useQueryParams } from '@hooks/useQueryParams';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { requests } from '@utils/requests';
import ArrowDown from '@icons/ArrowDown';
import Header from '@components/Header';
import ArrowUp from '@icons/ArrowUp';
import { error } from '@utils/toast';
import { get } from 'lodash';
import dayjs from 'dayjs';

import StoreSummaryReportDashboard from './StoreSummaryReportDashboardReportDashboard';
import tableHeaderSelector from './tableHeaderSelector';
import FilterMenu from './FilterMenu';


export default function StoreSummaryPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.storeSummaryTableColumns)
  const { values } = useQueryParams()
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  const [selectedShops, setSelectedShops] = useState('all')
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)

  const [offsetCount, setOffsetCount] = useState(0)
  const [filterMenu, setFilterMenu] = useState(false)
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })
  const [selectedComapanies, setSelectedComapanies] = useState('all')

  const tableColumns = tableHeaderSelector({
    branchesColumns: columns,
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

  const storeSummaryReportListFilter = useMemo(() => {
    return {
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,

      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
      company_ids: selectedComapanies.length <= 63 && selectedComapanies != 'all' ? [...selectedComapanies?.map((a) => a.id)] : null || null,

      store_ids: selectedShops === 'all' ? [] : selectedShops.map((el) => el.id),
    }
  }, [
    values?.offset,
    values?.from_time,
    values?.to_time,
    orderStoring,
    selectedComapanies,
    values?.limit,
    values?.search,
    selectedShops,
    values?.start_date,
    values?.end_date,
  ])
  const {
    data: storeSummaryReportList,
    isLoading: storeSummaryReportListLoading,
    isFetching: isFetchingstoreSummaryReportList,
    refetch,
  } = useQuery(['storeSummaryReportList', storeSummaryReportListFilter], () => requests.storeSummaryReport(storeSummaryReportListFilter))

  useEffect(() => {
    refetch()
  }, [storeSummaryReportListFilter])

  useEffect(() => {
    const count = storeSummaryReportList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [storeSummaryReportList?.data, values?.limit])

  const { mutate: clientsExcelReport, isLoading: isclientsExcelReport } = useMutation(requests.storeSummaryExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  const { data: storeSummaryReportStat, refetch: fetchstoreSummaryReportStat } = useQuery(
    ['storeSummaryReportStat', values?.search, storeSummaryReportListFilter],
    () => requests.getStoreSummaryReportStat(storeSummaryReportListFilter)
  )

  return (
    <LoadingContainer readyState={true}>
      <Header noActions isLoading={false} backIcon backHref='/reports/branch' text={'Остаток Аптека '} />
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
        {isOpenStatDashboard && <StoreSummaryReportDashboard data={get(storeSummaryReportStat, 'data.data')} />}
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
                  '& .select': {},
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
                <Box
                  sx={{
                    ml: '10px',
                    maxWidth: 400,
                    '.selection': {
                      height: '48px',
                    },
                  }}
                >
                  <MultiOptionSelectNew
                    zIndex={9}
                    placeholder={t('placeholders.select_shops')}
                    multiple
                    customFilter={{
                      is_franchise: true,
                    }}
                    defaultSelectedAll
                    beforeContent={t('placeholders.select_shops')}
                    value={selectedComapanies}
                    selectAllLabel={t('Все B2B')}
                    isLoading={false}
                    onChange={(val) => {
                      setSelectedComapanies(val)
                    }}
                    request={requests.getAllCompanies}
                  />
                </Box>
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
            uniqId='name'
            id='clients-main-table'
            tableSettings
            fullDownload={() => clientsExcelReport({ ...storeSummaryReportListFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => clientsExcelReport(storeSummaryReportListFilter)}
            isDownloading={isclientsExcelReport}
            columns={tableColumns}
            totalCount={storeSummaryReportList?.data?.data?._meta?.total_count || 0}
            data={storeSummaryReportList?.data?.data?.data || []}
            isDataLoading={isFetchingstoreSummaryReportList || storeSummaryReportListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Остаток Аптека не существует',
              description: '...',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingstoreSummaryReportList || storeSummaryReportListLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
