import { useEffect, useMemo, useState } from 'react'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { Box, IconButton, Typography } from '@mui/material'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'
import dayjs from 'dayjs'
import { products_statuses } from '../../../assets/data/products-statuses'
import { getObjectDiff } from '../../../../utils/getObjectDiff'
import ChangeIcon from '../../../assets/icons/ChangeIcon'
import { get } from 'lodash'
// import ProductChangesDialog from './ProductChangesDialog'

export default function ProductHistory({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [changesData, setChangesData] = useState(null)

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
  } = useQuery('productDataHistory', () => requests.getSingleProductHistory(productHistoryFilter, id))

  useEffect(() => {
    const count = productDataHistory?.data?.data?.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limitHistory))
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
      // {
      //   headerName: 'Cтатус',
      //   colId: 'status',
      //   minWidth: 150,
      //   maxWidth: 150,
      //   width: 150,
      //   cellRenderer: ({ data }) => (
      //     <StatusCell
      //       bgcolor={products_statuses.find((el) => el.id === data.status)?.color}
      //       title={products_statuses.find((el) => el.id === data.status)?.name}
      //     />
      //   ),
      // },
      // {
      //   headerName: 'Пользователь',
      //   colId: 'user',
      //   minWidth: 50,
      //   cellRenderer: ({ data }) => (
      //     <Typography sx={{ whiteSpace: 'pre-line', color: !data?.userInfo?.fullName && 'grey.400' }}>
      //       {data?.userInfo?.fullName || 'Неопределенный'}
      //     </Typography>
      //   ),
      // },
      // {
      //   headerName: 'Дли-ность',
      //   colId: 'duration',
      //   minWidth: 125,
      //   width: 125,
      //   maxWidth: 125,
      //   cellRenderer: ({ data }) => <Typography sx={{ whiteSpace: 'pre-line', color: !data?.duration && 'grey.400' }}>{data?.duration || '-'}</Typography>,
      // },
      // {
      //   headerName: 'Изменения',
      //   colId: 'changes',
      //   minWidth: 128,
      //   width: 128,
      //   maxWidth: 128,
      //   cellRenderer: ({ data }) => (
      //     <IconButton disabled={!data?.differenceData?.length} onClick={() => setChangesData(data?.differenceData)} sx={{ p: 1, height: 48, width: 48 }}>
      //       <ChangeIcon color={!data?.differenceData?.length && '#bdbdbd'} />
      //     </IconButton>
      //   ),
      // },
    ],
    []
  )

  const formattedData = productDataHistory?.data?.data
  // ?.map((el, ind) => {
  //   const oldData = (productDataHistory?.data?.length === ind + 1 ? productDataHistory?.data?.data : productDataHistory?.data?.data?.[ind + 1]) || el

  //   const diff = dayjs(el.createdAt).diff(oldData?.createdAt, 'minute')

  //   const diffBetweenObj = getObjectDiff(oldData?.productInfo, el?.productInfo)
  //   const differenceData = diffBetweenObj
  //     ?.filter((elm1) => elm1 !== 'updatedAt' && elm1 !== '__v')
  //     ?.map((elm2) => ({
  //       keyName: elm2,
  //       oldValue: oldData?.productInfo?.[elm2],
  //       newValue: el?.productInfo?.[elm2],
  //     }))

  //   return { ...el, duration: (diff || 0) + ' минут', differenceData }
  // })
  return (
    <>
      <AgGridTable
        isDataLoading={isproductDataLoadingHistory || isFetchingproductDataHistory}
        offsetQuery='offsetHistory'
        limitQuery='limitHistory'
        id='products-history-table'
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
      {/* <ProductChangesDialog changesData={changesData} setChangesData={setChangesData} /> */}
    </>
  )
}
