import { useEffect, useMemo, useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { useQueryParams } from '../../hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import TimeCell from '../../../components/AgGridTable/Cells/TimeCell'
import { products_statuses } from '../../assets/data/products-statuses'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import { success } from '../../../utils/toast'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import CopyIcon from '../../assets/icons/CopyIcon'
import ProductChangesDialog from '../products/ProductChangesDialog'
import ChangeIcon from '../../assets/icons/ChangeIcon'
import { getObjectDiff } from '../../../utils/getObjectDiff'

export default function ShopHistory({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [changesData, setChangesData] = useState(null)

  const shopHistoryFilter = useMemo(() => {
    return {
      shopId: id,
      limit: values?.limitHistory || 5,
      offset: values?.offsetHistory || 0,
    }
  }, [values?.limitHistory, values?.offsetHistory])

  const {
    data: shopDataHistory,
    isLoading: isShopDataLoadingHistory,
    isFetching: isFetchingShopDataHistory,
    refetch,
  } = useQuery('shopDataHistory', () => requests.getSingleShopHistory(shopHistoryFilter))

  useEffect(() => {
    const count = shopDataHistory?.data.totalCount
    const offsetsCount = Math.ceil(count / Number(values?.limitHistory))
    setOffsetCount(offsetsCount || 0)
  }, [shopDataHistory?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [shopHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'Дата',
        colId: 'date',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='createdAt' format='DD.MM.YYYY HH:mm' />,
      },
      {
        headerName: 'Cтатус',
        colId: 'status',
        minWidth: 150,
        maxWidth: 150,
        width: 150,
        cellRenderer: ({ data }) => (
          <StatusCell
            bgcolor={products_statuses.find((el) => el.id === data.status)?.color}
            title={products_statuses.find((el) => el.id === data.status)?.name}
          />
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
        headerName: 'ID',
        colId: 'id_product',
        minWidth: 80,
        width: 80,
        maxWidth: 80,
        cellRenderer: ({ data }) => (
          <IconButton disabled={!data?.differenceData?.length} onClick={() => setChangesData(data?.differenceData)} sx={{ p: 1, height: 48, width: 48 }}>
            <ChangeIcon color={!data?.differenceData?.length && '#bdbdbd'} />
          </IconButton>
        ),
      },
    ],
    []
  )

  const formattedData = shopDataHistory?.data?.shopLogs?.map((el, ind) => {
    const oldData = (shopDataHistory?.data?.shopLogs?.length === ind + 1 ? shopDataHistory?.data?.nextShop : shopDataHistory?.data?.shopLogs?.[ind + 1]) || el

    const diff = dayjs(el.createdAt).diff(oldData?.createdAt, 'minute')

    const diffBetweenObj = getObjectDiff(oldData?.shopInfo, el?.shopInfo)
    const differenceData = diffBetweenObj
      ?.filter((elm1) => elm1 !== 'updatedAt' && elm1 !== '__v')
      ?.map((elm2) => ({
        keyName: elm2,
        oldValue: oldData?.shopInfo?.[elm2],
        newValue: el?.shopInfo?.[elm2],
      }))

    return { ...el, duration: (diff || 0) + ' минут', differenceData }
  })

  return (
    <>
      <AgGridTable
        isDataLoading={isShopDataLoadingHistory || isFetchingShopDataHistory}
        offsetQuery='offsetHistory'
        limitQuery='limitHistory'
        id='products-history-table'
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
      <ProductChangesDialog changesData={changesData} setChangesData={setChangesData} />
    </>
  )
}
