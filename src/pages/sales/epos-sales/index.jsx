import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput/DateRangeInput'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import { error } from '../../../../utils/toast'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function EposSales({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const navigate = useNavigate()
  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      offset: values?.offsetHistory || 0,
      start_date: values?.start_date || dayjs(new Date()).format('YYYY-MM-DD'),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
    }
  }, [values?.limitHistory, values?.offsetHistory])

  const {
    data: productDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductDataHistory,
    refetch,
  } = useQuery(['productDataHistory', productHistoryFilter], () => requests.getSingleProductMovement(productHistoryFilter, id))

  useEffect(() => {
    const count = productDataHistory?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [productDataHistory?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const { mutate: closeZReport, isLoading: iscloseZReport } = useMutation(requests.closeZReport, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        error(`err: ${get(data, 'message')?.split('Ru:')[1]}`)
        return
      }
    },
    onError: (err) => {
      error('Ошибка закрытия кассы! (close Z Report)')
      console.log('err', err)
    },
  })
  useEffect(() => {
    closeZReport({
      token: 'DXJFX32CN1296678504F2',
      method: 'getReceiptsInfoByDate',
      startDate: values?.start_date ? `${values?.start_date.replaceAll('-', '')}000000` : `${dayjs(new Date()).format('YYYY-MM-DD').replaceAll('-', '')}000000`,
      endDate:
        values?.start_date != values?.end_date
          ? `${dayjs(new Date()).format('YYYY-MM-DD').replaceAll('-', '')}000000`
          : `${values?.end_date.replaceAll('-', '')}000000`,
    })
  }, [])
  const columns = useMemo(
    () => [
      {
        headerName: 'Дата',
        colId: 'created_at',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(data?.created_at).format('DD.MM.YYYY HH:mm')}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Действие',
        colId: 'document_number',
        minWidth: 250,
        maxWidth: 250,
        width: 250,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography
            color={'orange.500'}
            onClick={() => {
              const type = get(data, 'entry_type')
              if (type == '4') {
                navigate(`/sales/all-sales?limit=10&offset=0&search=${get(data, 'public_id')}&sale_id=${get(data, 'id')}`)
              } else if (type == '3') {
                navigate(`/products/write-off-completed/${get(data, 'id')}`)
              } else if (type == '2') {
                navigate(`/products/inventory-completed/${get(data, 'id')}`)
              } else {
                navigate(`/products/imports/${get(data, 'import.id')}?tab=details`)
              }
            }}
          >
            {get(data, 'entry_type') == '3'
              ? 'Списание '
              : get(data, 'entry_type') == '1'
              ? 'Импорт '
              : get(data, 'entry_type') == '2'
              ? 'Инвентаризация '
              : 'Продажa '}
            #{get(data, 'public_id')}
          </Typography>
        ),
      },
      {
        headerName: 'Количество',
        colId: 'accepted_count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <Typography ml={'4px'} color={'bunker.500'}>
                {data?.count}
              </Typography>
            </Box>
          </>
        ),
        // <Typography>{get(data, 'import.accepted_count')}</Typography>,
      },
      {
        headerName: 'Цена',
        colId: 'accepted_count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(data?.sum, 'сум')}
              </Typography>
            </Box>
          </>
        ),
        // <Typography>{get(data, 'import.accepted_count')}</Typography>,
      },
      {
        headerName: 'Aптека',
        colId: 'store',
        minWidth: 185,
        maxWidth: 285,
        width: 285,
        cellRenderer: ({ data, rowIndex }) => <Typography>{get(data, 'store_name')}</Typography>,
      },
    ],
    []
  )

  const formattedData = productDataHistory?.data?.data?.data

  return (
    <Box mt={'16px'}>
      <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />

      <AgGridTable
        isDataLoading={isproductDataLoadingHistory || isFetchingproductDataHistory}
        offsetQuery='offsetHistory'
        limitQuery='limitHistory'
        id='products-history-table'
        totalCount={productDataHistory?.data?.data?._meta?.total_count || 0}
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
    </Box>
  )
}
