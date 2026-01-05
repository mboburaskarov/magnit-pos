import AgGridTable from '@components/AgGridTable/AgGridTable'
import { useQueryParams } from '@hooks/useQueryParams'
import { Box, CircularProgress, IconButton, Typography } from '@mui/material'
import { requests } from '@utils/requests'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import SelectSimple from '@components/Select/SelectSimple'
import { t } from 'i18next'

import { Download, Launch, RemoveRedEye } from '@mui/icons-material'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { get } from 'lodash'
import { error } from '@utils/toast'
import StyledTooltip from '@components/StyledTooltip'

export default function BranchOstatkiPage() {
  //
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const userData = useSelector((state) => state.user)
  const [providerTypes, setProviderTypes] = useState({
    id: 'epos',
    name: 'EPOS',
  })
  const branchOstatkiFilter = useMemo(() => {
    return {
      limit: values?.limit || 5,
      store_id: values?.store_id || userData?.store?.id,
      offset: values?.offset || 0,
      start_date: getFilterStartDate(values),
      end_date: getFilterEndDate(values),
      provider_type: providerTypes?.id || 'epos',
    }
  }, [values?.limit, providerTypes, values?.offset, values?.from_time, values?.to_time, values?.start_date, values?.end_date])

  const {
    data: storesList,
    isLoading: storesListLoading,
    isFetching: isFetchingstoresList,
    refetch,
  } = useQuery(['storesList', branchOstatkiFilter], () => requests.getAllStores(branchOstatkiFilter))
  useEffect(() => {
    const count = storesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit || 0))

    setOffsetCount(offsetsCount || 0)
  }, [storesList?.data, values?.limit])
  const { mutate: getBranchOstatkiWithInvenotry, isLoading: isGetBranchOstatkiWithInvenotry } = useMutation(requests.getBranchOstatkiWithInvenotry, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  const columns = useMemo(
    () => [
      {
        headerName: 'Название',
        colId: 'name',
        minWidth: 200,
        maxWidth: 400,
        width: 350,
        cellRenderer: ({ data, rowIndex }) => {
          const type = data?.provider_type
          return <SimpleText data={data} type={'name'} />
        },
      },
      {
        headerName: 'Наименование полное',
        colId: 'detailed_name',
        flex: 1,
        cellRenderer: ({ data, rowIndex }) => <SimpleText data={data} type={'detailed_name'} />,
      },
      {
        headerName: 'В Аптекае код',
        colId: 'store_code',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <SimpleText data={data} type={'store_code'} />,
      },

      {
        headerName: t('table_columns.actions'),
        colId: 'actions',
        minWidth: 90,
        pinned: 'right',
        maxWidth: 90,
        width: 90,
        cellRenderer: ({ data, rowIndex }) => (
          <StyledTooltip title={'Общий график действий продуктов'}>
            <Box
              sx={{
                ml: '10px',
                backgroundColor: 'bg.10',
                padding: '10px',
                borderRadius: '50%',
                display: 'flex',
                width: '38px',
                cursor: 'pointer',
                height: '38px',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': {
                  width: '18px',
                  height: '18px',
                },
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
              }}
              onClick={() => {
                getBranchOstatkiWithInvenotry({ store_id: get(data, 'id'), limit: 10000, offset: 0 })
              }}
            >
              {isGetBranchOstatkiWithInvenotry ? <CircularProgress size={18} thickness={5} /> : <Download sx={{ color: '#FF6018' }} />}
            </Box>
          </StyledTooltip>
        ),
      },
    ],
    [isGetBranchOstatkiWithInvenotry]
  )
  const PROVIDER_TYPES = [
    { id: 'payme', name: 'Payme' },
    { id: 'epos', name: 'EPOS' },
    { id: 'dmed', name: 'DMED' },
    { id: 'click', name: 'CLICK' },
  ]

  const formattedData = storesList?.data?.data?.data

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
            {t('Общее движение аптечных товаров')}
          </Typography>
        </Box>
      </Box>
      <AgGridTable
        isRefreshing={isGetBranchOstatkiWithInvenotry}
        isDataLoading={storesListLoading}
        offsetQuery='offset'
        limitQuery='limit'
        id='products-history-table'
        totalCount={storesList?.data?.data?._meta?.total_count || 0}
        columns={columns}
        data={formattedData}
        updaterAction={() => {}}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
    </Box>
  )
}
