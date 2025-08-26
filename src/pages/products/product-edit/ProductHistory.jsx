import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function ProductHistory({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const navigate = useNavigate()
  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      store_id: values?.store_id,
      offset: values?.offsetHistory || 0,
    }
  }, [values?.limitHistory, values?.offsetHistory])
  // salom
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
              } else if (type == '6') {
                navigate(`/products/transfer-completed/${get(data, 'id')}`)
              } else if (type == '5') {
                navigate(`/products/return-to-warehouse-completed/${get(data, 'id')}`)
              } else if (type == '3') {
                navigate(`/products/write-off-completed/${get(data, 'id')}`)
              } else if (type == '2') {
                navigate(`/products/inventory-completed/${get(data, 'id')}`)
              } else {
                navigate(`/products/imports/${get(data, 'id')}?tab=details`)
              }
            }}
          >
            {get(data, 'entry_type') == '6'
              ? 'Перемещение '
              : get(data, 'entry_type') == '5'
              ? 'Возврат на склад '
              : get(data, 'entry_type') == '3'
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
      },
      {
        headerName: 'APTEKA',
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
