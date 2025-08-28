import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import * as qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import Header from '../../../../../components/Header'
import DateRangeInput from '../../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import LoadingBlock from '../../../../../components/LoadingBlock'
import LoadingContainer from '../../../../../components/LoadingContainer'
import LazySelect from '../../../../../components/Select/LazySelect'
import { downloadLinkExcel } from '../../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../../utils/requests'
import { error } from '../../../../../utils/toast'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../../redux-toolkit/tableSlices/storeReportTableColumns'
import StoreReposrMiniDashboardHeader from './storeReposrMiniDashboardHeader'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function StoreReportPage() {
  const dispatch = useDispatch()
  const methods = useForm()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.storeReportTableColumns)
  const { values } = useQueryParams()
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const [offsetCount, setOffsetCount] = useState(0)

  const tableColumns = tableHeaderSelector({
    clientsColumns: columns,
    t,
    values,
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

  const storeReportListFilter = useMemo(() => {
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

      store_id: values?.store_id || undefined,
    }
  }, [values?.offset, values?.limit, orderStoring, values?.store_id, values?.search, values?.start_date, values?.end_date])
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
  const { mutate: getStoreReportExcelReport, isLoading: isgetStoreReportExcelReport } = useMutation(requests.getStoreReportExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.log(err)

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

  const { data: saleStatsData } = useQuery(['saleStatsData', storeReportListFilter], () => requests.getStoreStats(storeReportListFilter))

  return (
    <LoadingContainer readyState={true}>
      {isgetStoreReportExcelReport && <LoadingBlock zIndex={99} top={0} position={'absolute'} width={'100%'} left='0' />}
      <Header noActions isLoading={false} backIcon backHref='/reports/branch' text={'Отчет филиала '} />
      <Box display='flex' mx={'auto'} flexDirection='column' position='relative' pt={'24px'} px={'50px'} pb={'20px'}>
        <StoreReposrMiniDashboardHeader saleStatsData={get(saleStatsData, 'data.data')} />

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
            fullDownload={() => getStoreReportExcelReport({ ...storeReportListFilter, limit: 1000000 })}
            downloadByFilter={() => getStoreReportExcelReport(storeReportListFilter)}
            isDownloading={isgetStoreReportExcelReport}
            columns={tableColumns}
            totalCount={storeReportList?.data?.data?._meta?.total_count || 0}
            data={storeReportList?.data?.data?.data || []}
            isDataLoading={isFetchingstoreReportList || storeReportListLoading}
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
            isRefreshing={loading || isFetchingstoreReportList || storeReportListLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
