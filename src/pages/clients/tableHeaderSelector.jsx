import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TimeCell from '../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
import { shop_statuses } from '../../assets/data/shop-statuses'
import ImageCell from '../../../components/AgGridTable/Cells/ImageCell'
import LockIcon from '../../assets/icons/LockIcon'
import LockOpenIcon from '../../assets/icons/LockOpenIcon'
import CheckAccess from '../../../components/CheckAccess'
import thousandDivider from '../../../utils/thousandDivider'
const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}
export default function tableHeaderSelector({ userColumns, setIsDrawerOpen, setOpenConfirmDialog }) {
  const columns = userColumns?.map((el) => {
    if (el.field === 'photo') {
      return {
        ...el,
        headerName: 'Фото',
        colId: el.field,
        cellRenderer: memo(({ data }) => {
          return <ImageCell imageArr={[data?.avatar]} />
        }),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Имя',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box onClick={() => setIsDrawerOpen(data._id)}>
            <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='green.500'>
              {data?.fullName}
            </Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'phone_number') {
      return {
        ...el,
        headerName: 'Номер телефона',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`shop-${type}-${rowIndex}`}>
            {formatPhoneNumber('+' + data?.phone)}
          </Typography>
        )),
      }
    }
    if (el.field === 'registration_source') {
      return {
        ...el,
        headerName: 'Источник регистрации',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography style={{ whiteSpace: 'pre-line' }}>{data?.registeredBy}</Typography>),
      }
    }
    if (el.field === 'created_date') {
      return {
        ...el,
        headerName: 'Дата создания',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='createdAt' format='DD.MM.YYYY HH:mm' />),
      }
    }

    if (el.field === 'status') {
      return {
        ...el,
        headerName: 'Статус',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`shop-status-${rowIndex}`}
            bgcolor={shop_statuses.find((el) => el.id === data.status)?.color}
            title={shop_statuses.find((el) => el.id === data.status)?.name}
          />
        )),
      }
    }
    if (el.field === 'last_order_date') {
      return {
        ...el,
        headerName: 'Дата последнего заказа',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='lastOrderTime' format='DD.MM.YYYY HH:mm' />),
      }
    }
    if (el.field === 'average_cheque') {
      return {
        ...el,
        headerName: 'Средний чек',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='averageCheque' />),
      }
    }
    if (el.field === 'orders_count') {
      return {
        ...el,
        headerName: 'Кол-во заказов',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='шт' withDevider {...p} type='ordersCount' />),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: 'Действия',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box display='inline-flex' columnGap={2}>
            {/* <IconButton onClick={() => navigate(`/shops/edit/${data._id}`)} sx={{ borderRadius: 3, p: '14px' }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
              <DeleteIcon />
            </IconButton> */}
            {data?.status === 'ACTIVE' ? (
              <CheckAccess id={'client-deactive'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'blocked', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                  <LockIcon color='#FA004B' />
                </IconButton>
              </CheckAccess>
            ) : (
              <CheckAccess id={'client-active'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'activate', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                  <LockOpenIcon />
                </IconButton>
              </CheckAccess>
            )}
          </Box>
        )),
      }
    }
  })

  return columns
}
