import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
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
      limit: values?.limitHistory || 5,
      offset: values?.offsetHistory || 0,
    }
  }, [values?.limitHistory, values?.offsetHistory])

  const {
    data: productReaminsDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductReaminsDataHistory,
    refetch,
  } = useQuery('productReaminsDataHistory', () => requests.getSingleProductRemainsHistory(productHistoryFilter, id))
  console.log(productReaminsDataHistory)

  useEffect(() => {
    const count = productReaminsDataHistory?.data?.data?.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limitHistory))
    setOffsetCount(offsetsCount || 0)
  }, [productReaminsDataHistory?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'Название',
        colId: 'store_name',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.store?.name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Количество',
        colId: 'quantity',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <Typography>{get(data, 'quantity')}</Typography>,
      },
      {
        headerName: 'Цена продажи',
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <Typography>{thousandDivider(get(data, 'retail_price'), 'сум')}</Typography>,
      },
    ],
    []
  )

  const formattedData = productReaminsDataHistory?.data?.data?.data

  return (
    <>
      <AgGridTable
        isDataLoading={isproductDataLoadingHistory || isFetchingproductReaminsDataHistory}
        offsetQuery='offsetHistory'
        limitQuery='limitHistory'
        id='products-history-table'
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
    </>
  )
}
