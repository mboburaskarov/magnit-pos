import AgGridTable from '@components/AgGridTable/AgGridTable'
import { useQueryParams } from '@hooks/useQueryParams'
import { Box, Typography } from '@mui/material'
import { requests } from '@utils/requests'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import SelectSimple from '@components/Select/SelectSimple'
import { t } from 'i18next'
import ActivityDrawer from './avtibityDrawer'

export default function ActivityLogsPage() {
  //
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const userData = useSelector((state) => state.user)
  const [providerTypes, setProviderTypes] = useState([])
  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limit || 5,
      store_id: values?.store_id || userData?.store?.id,
      offset: values?.offset || 0,
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      provider_type: providerTypes?.id,
    }
  }, [values?.limit, providerTypes, values?.offset, values?.from_time, values?.to_time, values?.start_date, values?.end_date])
  const {
    data: getLogsList,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchinggetLogsList,
    refetch,
  } = useQuery(['getLogsList', productHistoryFilter], () => requests.getLogsList(productHistoryFilter))

  useEffect(() => {
    const count = getLogsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [getLogsList?.data, values?.limitHistory])

  const columns = useMemo(
    () => [
      {
        headerName: 'Действие',
        colId: 'provider_type',
        minWidth: 100,
        maxWidth: 250,
        width: 120,
        cellRenderer: ({ data, rowIndex }) => {
          const type = data?.provider_type
          return (
            <Typography
              onClick={() => setModal(data)}
              sx={{
                cursor: 'pointer',
                backgroundColor: type == 'payme' ? 'green.400' : type == 'epos' ? 'orange.400' : type == 'click' ? 'purple.500' : 'red.500',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '17px',
                fontWeight: 500,
                lineHeight: '24px',
                textAlign: 'center',
              }}
            >
              {data?.provider_type}
            </Typography>
          )
        },
      },
      {
        headerName: 'Метод',
        colId: 'method',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <SimpleText data={data} type={'method'} />,
      },
      {
        headerName: 'Запрос',
        colId: 'request',
        flex: 1,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography
            sx={{
              overflow: 'hidden',
              width: '-webkit-fill-available',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data?.payload || '-'}
          </Typography>
        ),
      },
      {
        headerName: 'Ответ',
        colId: 'response',
        flex: 1,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography
            sx={{
              overflow: 'hidden',
              width: '-webkit-fill-available',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data?.response || '-'}
          </Typography>
        ),
      },
      {
        headerName: 'Дата',
        colId: 'created_at',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(data?.created_at).format('DD.MM.YYYY HH:mm:ss')}</Typography>
          </Box>
        ),
      },
    ],
    []
  )
  const PROVIDER_TYPES = [
    { id: 'payme', name: 'Payme' },
    { id: 'epos', name: 'EPOS' },
    { id: 'dmed', name: 'DMED' },
    { id: 'click', name: 'CLICK' },
  ]
  const formattedData = getLogsList?.data?.data?.data

  const [openModal, setModal] = useState()
  return (
    <Box
      p={'30px'}
      sx={{
        '& .ag-cell-value': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          clear: 'both',
          display: 'inline-block',
          whiteSpace: 'nowrap',
        },
        '& .ag-cell-wrapper': {
          width: '-webkit-fill-available',
        },
      }}
    >
      <Box sx={{ mb: '20px' }}>
        <Box width='100%' display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
            {t('Журналы действий')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <SelectSimple
              name='provider_type'
              placeholder={'Действие'}
              isClearable={false}
              options={PROVIDER_TYPES}
              small
              beforeContent={'Действие'}
              minWidth='285px'
              white
              defaultValue={'payme'}
              maxWidth={'355px'}
              isSearchable={false}
              uncontrolled
              value={providerTypes}
              onChange={(e) => setProviderTypes(e)}
            />

            <Box width={'20px'} />
            <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
          </Box>
        </Box>
      </Box>
      <AgGridTable
        isDataLoading={isproductDataLoadingHistory || isFetchinggetLogsList}
        offsetQuery='offset'
        limitQuery='limit'
        id='products-history-table'
        totalCount={getLogsList?.data?.data?._meta?.total_count || 0}
        columns={columns}
        data={formattedData}
        updaterAction={() => {}}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
      <ActivityDrawer open={openModal} onClose={() => setModal(false)} data={formattedData} />
    </Box>
  )
}
