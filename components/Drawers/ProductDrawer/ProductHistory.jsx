import AgGridTable from '@components/AgGridTable/AgGridTable'
import { useQueryParams } from '@hooks/useQueryParams'
import { Box, Typography } from '@mui/material'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { requests } from '@utils/requests'
import thousandDivider from '@utils/thousandDivider'
import { error } from '@utils/toast'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { formatCount } from './ProductMovementDashboard'
import TransferDetailModal from './transferDetailModal'

export default function ProductHistory({ id, unit_per_pack }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)

  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      store_id: values?.store_id || userData?.store?.id,
      offset: values?.offsetHistory || 0,
    }
  }, [values?.limitHistory, values?.offsetHistory, unit_per_pack])
  const {
    data: singleProductMovement,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingsingleProductMovement,
    refetch,
  } = useQuery(['singleProductMovement', productHistoryFilter], () => requests.getSingleProductMovement(productHistoryFilter, id))

  useEffect(() => {
    const count = singleProductMovement?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [singleProductMovement?.data, values?.limitHistory])

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
              } else if (type == '8') {
                navigate(`/sales/all-sales?limit=10&offset=0&search=${get(data, 'public_id')}&sale_id=${get(data, 'id')}`)
              } else if (type == '6') {
                setModal(data)
                // navigate(`/products/transfer-completed/${get(data, 'id')}`)
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
              : get(data, 'entry_type') == '7'
              ? 'Возврат '
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
                {formatCount(data?.quantity, unit_per_pack, false)}
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
        headerName: 'Aптека',
        colId: 'store',
        minWidth: 185,
        maxWidth: 285,
        width: 285,
        cellRenderer: ({ data, rowIndex }) => <Typography>{get(data, 'store_name')}</Typography>,
      },
    ],
    []
  )

  const formattedData = singleProductMovement?.data?.data?.data
  const { mutate: getSingleProductMovementExcel, isLoading: isgetSingleProductMovementExcel } = useMutation(requests.getSingleProductMovementExcel, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  const [oepnModal, setModal] = useState()
  return (
    <Box mt={'16px'}>
      <AgGridTable
        fullDownload={() => getSingleProductMovementExcel({ ...productHistoryFilter, id, limit: 1000000 })}
        downloadByFilter={() => getSingleProductMovementExcel({ ...productHistoryFilter, id })}
        isDownloading={isgetSingleProductMovementExcel}
        //
        isDataLoading={isproductDataLoadingHistory || isFetchingsingleProductMovement}
        offsetQuery='offsetHistory'
        limitQuery='limitHistory'
        id='products-history-table'
        totalCount={singleProductMovement?.data?.data?._meta?.total_count || 0}
        columns={columns}
        data={formattedData}
        offsetCount={offsetCount}
        defaultOffsetSize={5}
      />
      <TransferDetailModal open={oepnModal} setOpen={setModal} />
    </Box>
  )
}
