import AgGridTable from '@components/AgGridTable/AgGridTable'
import { useQueryParams } from '@hooks/useQueryParams'
import { Box, Typography } from '@mui/material'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

export default function ProductRemainsHistory({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)

  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.remainsLimit || 5,
      offset: values?.remainsOffset || 0,
      store_id: values?.store_id,
    }
  }, [values?.remainsLimit, values?.store_id, values?.remainsOffset])

  const {
    data: productReaminsDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductReaminsDataHistory,
    refetch,
  } = useQuery(['productReaminsDataHistory', productHistoryFilter], () => requests.getSingleProductRemainsHistory(productHistoryFilter, id))

  useEffect(() => {
    const count = productReaminsDataHistory?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.remainsLimit))

    setOffsetCount(offsetsCount || 0)
  }, [productReaminsDataHistory?.data, values?.remainsLimit])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'Aптека',
        colId: 'store_name',
        minWidth: 200,
        maxWidth: 350,
        width: 300,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'store_name'}-${rowIndex}-${data?.store_id}`}>
            <Typography whiteSpace='pre-line' id={`${'store_name'}-${rowIndex}-${data?.store_id}`}>
              {data?.store?.name}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: 'Баркод',
        colId: 'barcode',
        minWidth: 200,
        maxWidth: 350,
        width: 300,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'barcode'}-${rowIndex}-${data?.store_id}`}>
            <Typography id={`${'barcode'}-${rowIndex}-${data?.store_id}`}>{data?.barcode}</Typography>
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
      {
        headerName: 'Цена покупки',
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{thousandDivider(get(data, 'supply_price'), 'сум')}</Typography>
        ),
      },
      {
        headerName: 'Наценка',
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{thousandDivider(get(data, 'markup'), '%')}</Typography>
        ),
      },
      {
        headerName: 'НДС',
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{thousandDivider(get(data, 'vat'), '%')}</Typography>
        ),
      },
      {
        headerName: 'Срок',
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{dayjs(get(data, 'expire_date')).format('DD.MM.YYYY')}</Typography>
        ),
      },
    ],
    []
  )

  const formattedData = productReaminsDataHistory?.data?.data?.data

  return (
    <Box mt={'16px'}>
      <AgGridTable
        isDataLoading={isproductDataLoadingHistory || isFetchingproductReaminsDataHistory}
        offsetQuery='remainsOffset'
        limitQuery='remainsLimit'
        id='products-history-tableee'
        totalCount={productReaminsDataHistory?.data?.data?._meta?.total_count || 0}
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
    </Box>
  )
}
