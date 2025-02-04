import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { Link, useNavigate } from 'react-router-dom'
import { faArrowCircleDown, faArrowCircleUp, faCheckCircle, faCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import palette from '../../../../src/assets/theme/mui.config'
import thousandDivider from '../../../../utils/thousandDivider'

export default function ProductHistory({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const navigate = useNavigate()
  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      offset: values?.offsetHistory || 0,
    }
  }, [values?.limitHistory, values?.offsetHistory])

  const {
    data: productDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductDataHistory,
    refetch,
  } = useQuery(['productDataHistory', productHistoryFilter], () => requests.getSingleProductHistory(productHistoryFilter, id))

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
            <Typography>{dayjs(data?.import.created_at).format('DD.MM.YYYY HH:mm')}</Typography>
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
          <Typography color={'orange.500'} onClick={() => navigate(`/products/imports/${get(data, 'import.id')}?tab=details`)}>
            {get(data, 'import.status') == 'writeoff' ? 'Списание/' : 'Импорт/'}
            {get(data, 'import.document_number')}
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
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(data?.received_count)}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.violet[500]} icon={faArrowCircleUp} />

              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(data?.accepted_count)}
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
              <FontAwesomeIcon color={palette.yellow[500]} icon={faArrowCircleDown} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(data?.received_amount, 'сум')}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <FontAwesomeIcon color={palette.green[500]} icon={faCheckCircle} />
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(data?.accepted_amount, 'сум')}
              </Typography>
            </Box>
          </>
        ),
        // <Typography>{get(data, 'import.accepted_count')}</Typography>,
      },
      {
        headerName: 'Магазин',
        colId: 'store',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <Typography>{get(data, 'import.store.name')}</Typography>,
      },
    ],
    []
  )

  const formattedData = productDataHistory?.data?.data?.data

  return (
    <>
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
    </>
  )
}
