import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'
import thousandDivider from '../../../../utils/thousandDivider'

export default function ProductRemainsHistory({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)

  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limit || 5,
      offset: values?.offset || 0,
    }
  }, [values?.limit, values?.offset])

  const {
    data: productReaminsDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductReaminsDataHistory,
    refetch,
  } = useQuery('productReaminsDataHistory', () => requests.getSingleProductRemainsHistory(productHistoryFilter, id))

  useEffect(() => {
    const count = productReaminsDataHistory?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))

    setOffsetCount(offsetsCount || 0)
  }, [productReaminsDataHistory?.data, values?.limit])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'Название',
        colId: 'store_name',
        minWidth: 200,
        maxWidth: 200,
        width: 200,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'store_name'}-${rowIndex}-${data?.store_id}`}>
            <Typography id={`${'store_name'}-${rowIndex}-${data?.store_id}`}>{data?.store?.name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Количество',
        colId: 'quantity',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <Typography id={`${'quantity'}-${rowIndex}-${data?.store_id}`}>{get(data, 'quantity')}</Typography>,
      },
      {
        headerName: 'Цена продажи',
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{thousandDivider(get(data, 'retail_price'), 'сум')}</Typography>
        ),
      },
    ],
    []
  )

  const formattedData = productReaminsDataHistory?.data?.data?.data

  return (
    <>
      <AgGridTable
        isDataLoading={isproductDataLoadingHistory || isFetchingproductReaminsDataHistory}
        offsetQuery='offset'
        limitQuery='limit'
        id='products-history-tableee'
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
    </>
  )
}
