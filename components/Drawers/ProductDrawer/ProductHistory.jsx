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
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { formatCount } from './ProductMovementDashboard'
import TransferDetailModal from './transferDetailModal'
import { getFilterEndDate, getFilterStartDate } from '@/hooks/getFilterDate'
import { Link, useLocation } from 'react-router-dom'

export default function ProductHistory({ id, unit_per_pack }) {
  const { t } = useTranslation()
  const location = useLocation()

  // to‘liq hozirgi URL (query bilan)
  const from = location.pathname + location.search

  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)

  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      store_id: values?.store_id || userData?.store?.id,
      offset: values?.offsetHistory || 0,
      // start_date: getFilterStartDate(values),
      // end_date: getFilterEndDate(values),
      id,
    }
  }, [values?.limitHistory, id, values?.offsetHistory, unit_per_pack, values?.from_time, values?.to_time, values?.start_date, values?.end_date])
  const {
    data: singleProductMovement,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingsingleProductMovement,
    refetch,
  } = useQuery(['singleProductMovement', productHistoryFilter], () => requests.getSingleProductMovement(productHistoryFilter), { enabled: !!id })

  useEffect(() => {
    const count = singleProductMovement?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [singleProductMovement?.data, values?.limitHistory])

  const columns = useMemo(
    () => [
      {
        headerName: t('table_columns.date'),
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
        headerName: t('table_columns.action'),
        colId: 'document_number',
        minWidth: 250,
        maxWidth: 250,
        width: 250,
        cellRenderer: ({ data, rowIndex }) => {
          const entryType = get(data, 'entry_type')
          const id = get(data, 'id')
          const publicId = get(data, 'public_id')

          const routeMap = {
            4: `/sales/all-sales?limit=10&offset=0&search=${publicId}&sale_id=${id}`,
            8: `/sales/all-sales?limit=10&offset=0&search=${publicId}&sale_id=${id}`,
            5: `/products/return-to-warehouse-completed/${id}`,
            3: `/products/write-off-completed/${id}`,
            2: `/products/inventory-completed/${id}`,
          }

          const link = routeMap[entryType] ?? `/products/imports/${id}?tab=details`

          return (
            <Typography
              color='orange.500'
              component={entryType == '6' ? 'span' : Link}
              to={entryType == '6' ? undefined : link}
              state={{ from }}
              onClick={() => {
                if (entryType == '6') {
                  setModal(data)
                }
              }}
              sx={{ cursor: 'pointer' }}
            >
              {entryType == '6'
                ? t('product_drawer.movement.transfer')
                : entryType == '5'
                  ? t('product_drawer.movement.return_to_warehouse')
                  : entryType == '7'
                    ? t('product_drawer.history.return_action')
                    : entryType == '3'
                      ? t('product_drawer.history.writeoff_action')
                      : entryType == '4'
                        ? t('product_drawer.history.sale_action')
                        : entryType == '2'
                          ? t('product_drawer.movement.inventory')
                          : t('product_drawer.history.import_action')}{' '}
              #{publicId}
            </Typography>
          )
        },
      },
      {
        headerName: t('table_columns.quantity'),
        colId: 'accepted_count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <Typography ml={'4px'} color={'bunker.500'}>
                {formatCount(data?.quantity, unit_per_pack, false, t)}
              </Typography>
            </Box>
          </>
        ),
      },
      {
        headerName: t('table_columns.price'),
        colId: 'accepted_count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(data?.sum, t('pos.currency_short'))}
              </Typography>
            </Box>
          </>
        ),
      },
      {
        headerName: t('table_columns.store'),
        colId: 'store',
        minWidth: 185,
        maxWidth: 285,
        width: 285,
        cellRenderer: ({ data, rowIndex }) => <Typography>{get(data, 'store_name')}</Typography>,
      },
    ],
    [unit_per_pack, t],
  )

  const formattedData = singleProductMovement?.data?.data?.data
  const { mutate: getSingleProductMovementExcel, isLoading: isgetSingleProductMovementExcel } = useMutation(requests.getSingleProductMovementExcel, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error(t('product_drawer.excel_download_error'))
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
