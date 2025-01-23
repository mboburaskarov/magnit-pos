import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function ProductHistory({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)

  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limit || 5,
      offset: values?.offset || 0,
    }
  }, [values?.limit, values?.offset])

  const {
    data: productDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductDataHistory,
    refetch,
  } = useQuery('productDataHistory', () => requests.getSingleProductHistory(productHistoryFilter, id))

  useEffect(() => {
    const count = productDataHistory?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [productDataHistory?.data, values?.limit])

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
            <Typography>{dayjs(data?.import.created_at).format('DD.MM.YYYY HH:mm')}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'ID',
        colId: 'document_number',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <Typography>{get(data, 'import.document_number')}</Typography>,
      },
      {
        headerName: 'Количество',
        colId: 'accepted_count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <Typography>{get(data, 'import.accepted_count')}</Typography>,
      },
      {
        headerName: 'Магазин',
        colId: 'store',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <Typography>{get(data, 'import.stores.name')}</Typography>,
      },
    ],
    []
  )

  const formattedData = productDataHistory?.data?.data?.data

  return (
    <>
      <AgGridTable
        isDataLoading={isproductDataLoadingHistory || isFetchingproductDataHistory}
        offsetQuery='offset'
        limitQuery='limit'
        id='products-history-table'
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
    </>
  )
}
