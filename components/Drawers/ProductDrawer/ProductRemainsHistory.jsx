import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import { useQueryParams } from '@hooks/useQueryParams'
import { Box, Typography } from '@mui/material'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

export default function ProductRemainsHistory({ id }) {
  const { t } = useTranslation()
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const userData = useSelector((state) => state.user)

  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.remainsLimit || 5,
      offset: values?.remainsOffset || 0,
      store_id: values?.store_id || userData?.store?.id,
      id,
    }
  }, [
    values?.from_time,
    values?.to_time,
    values?.store_id,
    id,
    values?.start_date,
    values?.end_date,
    values?.remainsLimit,
    id,
    values?.store_id,
    values?.remainsOffset,
  ])

  const {
    data: productReaminsDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductReaminsDataHistory,
    refetch,
  } = useQuery(['productReaminsDataHistory', productHistoryFilter], () => requests.getSingleProductRemainsHistory(productHistoryFilter))

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
        headerName: t('table_columns.store'),
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
        headerName: t('table_columns.barcode'),
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
        headerName: t('table_columns.quantity'),
        colId: 'quantity',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <Typography id={`${'quantity'}-${rowIndex}-${data?.store_id}`}>{get(data, 'quantity')}</Typography>,
      },
      {
        headerName: t('table_columns.retail_price'),
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{thousandDivider(get(data, 'retail_price'), t('pos.currency_short'))}</Typography>
        ),
      },
      {
        headerName: t('table_columns.supply_price'),
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{thousandDivider(get(data, 'supply_price'), t('pos.currency_short'))}</Typography>
        ),
      },
      {
        headerName: t('table_columns.markup'),
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{thousandDivider(get(data, 'markup'), '%')}</Typography>
        ),
      },
      {
        headerName: t('table_columns.vat'),
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{thousandDivider(get(data, 'vat'), '%')}</Typography>
        ),
      },
      {
        headerName: t('table_columns.expire_date'),
        colId: 'retail_price',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Typography id={`${'retail_price'}-${rowIndex}-${data?.store_id}`}>{dayjs(get(data, 'expire_date')).format('DD.MM.YYYY')}</Typography>
        ),
      },
    ],
    [t],
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
