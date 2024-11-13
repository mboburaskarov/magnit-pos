import { useEffect, useMemo, useState } from 'react'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import { IconButton, Typography } from '@mui/material'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import CopyIcon from '../../../assets/icons/CopyIcon'
import { success } from '../../../../utils/toast'
import { order_statuses } from '../../../assets/data/order-statuses'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'
import dayjs from 'dayjs'
import { getObjectDiff } from '../../../../utils/getObjectDiff'
import ChangeIcon from '../../../assets/icons/ChangeIcon'
import ProductChangesDialog from '../../products/ProductChangesDialog'

export default function OrderHistory({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [changesData, setChangesData] = useState(null)

  const orderHistoryFilter = useMemo(() => {
    return {
      orderId: id,
      limit: values?.limitHistory || 5,
      offset: values?.offsetHistory || 0,
    }
  }, [values?.limitHistory, values?.offsetHistory])

  const {
    data: orderDataHistory,
    isLoading: isOrderDataLoadingHistory,
    isFetching: isFetchingOrderDataHistory,
    refetch,
  } = useQuery('orderDataHistory', () => requests.getSingleOrderHistory(orderHistoryFilter))

  useEffect(() => {
    const count = orderDataHistory?.data.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limitHistory))
    setOffsetCount(offsetsCount || 0)
  }, [orderDataHistory?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [orderHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'Дата',
        colId: 'date',
        minWidth: 180,
        maxWidth: 180,
        width: 180,
        cellRenderer: ({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='createdAt' format='DD.MM.YYYY HH:mm' />,
      },
      {
        headerName: 'Cтатус',
        colId: 'status',
        minWidth: 150,
        maxWidth: 150,
        width: 150,
        cellRenderer: ({ data }) => (
          <StatusCell bgcolor={order_statuses.find((el) => el.id === data.status)?.color} title={order_statuses.find((el) => el.id === data.status)?.name} />
        ),
      },
      {
        headerName: 'Пользователь',
        colId: 'user',
        minWidth: 50,
        cellRenderer: ({ data }) => (
          <Typography sx={{ whiteSpace: 'pre-line', color: !data?.userInfo?.fullName && 'grey.400' }}>
            {data?.userInfo?.fullName || 'Неопределенный'}
          </Typography>
        ),
      },
      {
        headerName: 'Дли-ность',
        colId: 'duration',
        minWidth: 125,
        width: 125,
        maxWidth: 125,
        cellRenderer: ({ data }) => <Typography sx={{ whiteSpace: 'pre-line', color: !data?.duration && 'grey.400' }}>{data?.duration || '-'}</Typography>,
      },
      {
        headerName: 'ID',
        colId: 'id_product',
        minWidth: 160,
        width: 160,
        maxWidth: 160,
        cellRenderer: ({ data }) => (
          <>
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(data?._id)
                success(`ID скопирован ${data._id}`)
              }}
              sx={{ borderRadius: 4, height: 48, width: 48, mr: 2 }}
            >
              <CopyIcon />
            </IconButton>
            <IconButton disabled={!data?.differenceData?.length} onClick={() => setChangesData(data?.differenceData)} sx={{ p: 1, height: 48, width: 48 }}>
              <ChangeIcon color={!data?.differenceData?.length && '#bdbdbd'} />
            </IconButton>
          </>
        ),
      },
    ],
    []
  )

  const formattedData = orderDataHistory?.data?.orders?.map((el, ind) => {
    const oldData = orderDataHistory?.data?.orders?.length === ind + 1 ? orderDataHistory?.data?.nextOrder : orderDataHistory?.data?.orders?.[ind + 1] || el

    const diff = oldData?.createdAt ? dayjs(el.createdAt).diff(oldData?.createdAt, 'minute') : 0

    const diffBetweenObj = !!oldData?.orderInfo && !!el?.orderInfo && getObjectDiff(oldData?.orderInfo, el?.orderInfo)
    const differenceData =
      !!oldData?.orderInfo &&
      !!el?.orderInfo &&
      diffBetweenObj
        ?.filter((elm1) => elm1 !== 'updatedAt' && elm1 !== '__v')
        ?.map((elm2) => ({
          keyName: elm2,
          oldValue: oldData?.orderInfo?.[elm2],
          newValue: el?.orderInfo?.[elm2],
        }))

    return { ...el, duration: (diff || 0) + ' минут', differenceData }
  })

  return (
    <>
      <AgGridTable
        isDataLoading={isOrderDataLoadingHistory || isFetchingOrderDataHistory}
        offsetQuery='offsetHistory'
        limitQuery='limitHistory'
        id='orders-history-table'
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
      <ProductChangesDialog changesData={changesData} setChangesData={setChangesData} />
    </>
  )
}
