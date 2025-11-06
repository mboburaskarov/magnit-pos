import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/storeReportTableColumns';
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll';
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput';
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate';
import MultiOptionSelectNew from '@components/Select/MultiOptionSelectNew';
import { makeFormattedData } from '@utils/helper/makeFormattedTableData';
import AgGridTable from '@components/AgGridTable/AgGridTable';
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL';
import LoadingContainer from '@components/LoadingContainer';
import InputSearch from '@components/Inputs/InputSearch';
import LazySelect from '@components/Select/LazySelect';
import { useQueryParams } from '@hooks/useQueryParams';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import LoadingBlock from '@components/LoadingBlock';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { requests } from '@utils/requests';
import { useForm } from 'react-hook-form';
import Header from '@components/Header';
import { error } from '@utils/toast';
import { Box } from '@mui/material';
import { get } from 'lodash';
import dayjs from 'dayjs';
import * as qs from 'qs';

import StoreReportMiniDashboardHeader from './storeReportMiniDashboardHeader';
import tableHeaderSelector from './tableHeaderSelector';
import SendSaleTo1C from './sendSaleTo1C';


export default function StoreReportPage() {
  const dispatch = useDispatch()
  const methods = useForm()
  const navigate = useNavigate()
  const [selectedComapanies, setSelectedComapanies] = useState('all')

  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.storeReportTableColumns)
  const { values } = useQueryParams()
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const [offsetCount, setOffsetCount] = useState(0)
  const [open, setOpen] = useState(false)

  const tableColumns = tableHeaderSelector({
    branchesColumns: columns,
    t,
    values,
    setOrderStoring,
    orderStoring,
    setOpen,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const storeReportListFilter = useMemo(() => {
    return {
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
      company_ids: selectedComapanies.length <= 63 && selectedComapanies != 'all' ? [...selectedComapanies?.map((a) => a.id)] : null || null,

      store_id: values?.store_id || undefined,
    }
  }, [
    values?.offset,
    selectedComapanies,
    values?.from_time,
    values?.to_time,
    values?.limit,
    orderStoring,
    values?.store_id,
    values?.search,
    values?.start_date,
    values?.end_date,
  ])
  const {
    data: storeReportList,
    isLoading: storeReportListLoading,
    isFetching: isFetchingstoreReportList,
    refetch,
  } = useQuery(['storeReportList', storeReportListFilter], () => requests.getStoreReport(storeReportListFilter))

  useEffect(() => {
    refetch()
  }, [storeReportListFilter])

  useEffect(() => {
    const count = storeReportList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [storeReportList?.data, values?.limit])

  const { data: saleStatsData } = useQuery(['saleStatsData', storeReportListFilter], () => requests.getStoreStats(storeReportListFilter))

  const { mutate: getStoreReportExcelReport, isLoading: isgetStoreReportExcelReport } = useMutation(requests.getStoreReportExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  useEffect(() => {
    const store_id = methods.getValues('store_id')
    const requestBody = {
      store_id: store_id?.id || undefined,
      store_name: store_id?.name || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    navigate(`/reports/store-report${requestParams}`)
  }, [methods.watch('store_id')])

  return (
    <LoadingContainer readyState={true}>
      {isgetStoreReportExcelReport && <LoadingBlock zIndex={99} top={0} position={'absolute'} width={'100%'} left='0' />}
      <Header noActions isLoading={false} backIcon backHref='/reports/branch' text={'Отчет филиала '} />
      <Box display='flex' mx={'auto'} flexDirection='column' position='relative' pt={'0px'} px={'50px'} pb={'20px'}>
        <StoreReportMiniDashboardHeader saleStatsData={get(saleStatsData, 'data.data')} />

        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'} sx={{ width: '100%' }}>
            <Box
              sx={{
                mr: '10px',
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '400px',
                  height: 48,
                },
              }}
            >
              <InputSearch id='producrs-search' name='search' placeholder={'Филиал'} uncontrolled />
            </Box>

            <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
            <Box
              sx={{
                minWidth: '400px',
                width: '400px',
                ml: '10px',
              }}
            >
              <LazySelect
                slug='users'
                boxStyle={{ width: '100%' }}
                id='store'
                name='store_id'
                isMulti={false}
                placeholder={t('Выберите Аптека')}
                minWidth='auto'
                isClearable={true}
                label={''}
                request={requests.getAllStores}
                filters={{ limit: 100 }}
                control={methods.control}
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
            </Box>
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
        <Box>
          <AgGridTable
            id='clients-main-table'
            uniqId='uid'
            tableSettings
            fullDownload={() => getStoreReportExcelReport({ ...storeReportListFilter, offset: 0, limit: 1000000 })}
            downloadByFilter={() => getStoreReportExcelReport(storeReportListFilter)}
            isDownloading={isgetStoreReportExcelReport}
            columns={tableColumns}
            totalCount={storeReportList?.data?.data?._meta?.total_count || 0}
            data={storeReportList?.data?.data?.data || []}
            isDataLoading={isFetchingstoreReportList || storeReportListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Отчет филиала не существует',
              description: '...',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingstoreReportList || storeReportListLoading}
          />
        </Box>
        <SendSaleTo1C open={open} setOpen={setOpen} refetch={() => {}} />
      </Box>
    </LoadingContainer>
  )
}
