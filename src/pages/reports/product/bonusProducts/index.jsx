import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/topReportsTableColumns';
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll';
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput';
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate';
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

import BonusProductReportDashboard from './bonusPoductReportDashboard';
import tableHeaderSelector from './tableHeaderSelector';
import FilterMenu from './FilterMenu';


export default function BonusProductsPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.topReportsTableColumns)
  const { values } = useQueryParams()

  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)
  const [offsetCount, setOffsetCount] = useState(0)
  const [filterMenu, setFilterMenu] = useState(false)
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
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

  const bonusProductsReportListFilter = useMemo(() => {
    return {
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
    }
  }, [values?.offset, values?.from_time, values?.to_time, orderStoring, values?.limit, values?.search, values?.start_date, values?.end_date])

  const {
    data: bonusProductsReportList,
    isLoading: bonusProductsReportListLoading,
    isFetching: isFetchingbonusProductsReportList,
    refetch,
  } = useQuery(['bonusProductsReportList', bonusProductsReportListFilter], () => requests.bonusProductsReport(bonusProductsReportListFilter))

  useEffect(() => {
    refetch()
  }, [bonusProductsReportListFilter])

  useEffect(() => {
    const count = bonusProductsReportList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [bonusProductsReportList?.data, values?.limit])
  const { mutate: bonusProductsExcelReport, isLoading: isbonusProductsExcelReport } = useMutation(requests.getBonusProductsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  const { data: bonusProductReportDashboard, refetch: fetchProductReportDashboard } = useQuery(
    ['bonusProductReportDashboard', values?.search, bonusProductsReportListFilter],
    () => requests.getBonusProductsReportStat(bonusProductsReportListFilter)
  )

  return (
    <LoadingContainer readyState={true}>
      <Header noActions isLoading={false} backIcon backHref='/reports/product' text={'Бонусные продукты '} />
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
        {isOpenStatDashboard && <BonusProductReportDashboard data={get(bonusProductReportDashboard, 'data.data')} />}
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
            fullDownload={() => bonusProductsExcelReport({ ...bonusProductsReportListFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => bonusProductsExcelReport(bonusProductsReportListFilter)}
            isDownloading={isbonusProductsExcelReport}
            columns={tableColumns}
            totalCount={bonusProductsReportList?.data?.data?._meta?.total_count || 0}
            data={bonusProductsReportList?.data?.data?.data || []}
            isDataLoading={isFetchingbonusProductsReportList || bonusProductsReportListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Продукт не существует',
              description: 'Если вы не нашли искомого продукта, нажмите кнопку «Добавить нового» и введите необходимую информацию.',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingbonusProductsReportList || bonusProductsReportListLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
