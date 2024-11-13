import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import EditIcon from '../../../assets/icons/EditIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import { vendor_statuses, vendor_types } from '../../../assets/data/vendor-statuses'
import CheckAccess from '../../../../components/CheckAccess'

const vendorColumns = [
  {
    field: 'id',
    hide: false,
    minWidth: 70,
    width: 90,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'type',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'shop_name',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'phone_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'created_date',
    hide: false,
    minWidth: 70,
    width: 198,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 200,
    width: 200,
  },
]

export default function tableHeaderSelector({ setOpenConfirmDialog, setIsDrawerOpen }) {
  const columns = vendorColumns?.map((el) => {
    if (el.field === 'id') {
      return {
        ...el,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo(() => <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }}>{Math.floor(Math.random() * 90000) + 10000}</Typography>),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Наименования',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box onClick={() => setIsDrawerOpen({ type: 'edit', id: data._id })}>
            <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='green.500'>
              {data?.fullName}
            </Typography>
          </Box>
        )),
      }
    }

    if (el.field === 'type') {
      return {
        ...el,
        headerName: 'Тип деятельности',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`vendor-types-${rowIndex}`}
            bgcolor={vendor_types.find((el) => el.id === data.type)?.color}
            title={vendor_types.find((el) => el.id === data.type)?.name}
          />
        )),
      }
    }
    if (el.field === 'shop_name') {
      return {
        ...el,
        headerName: 'Название магазина',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }}>{data?.shops?.name}</Typography>),
      }
    }
    if (el.field === 'phone_number') {
      return {
        ...el,
        headerName: 'Номер телефона',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`vendor-${type}-${rowIndex}`}>
            {formatPhoneNumber('+' + data?.phone)}
          </Typography>
        )),
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
            id={`vendor-status-${rowIndex}`}
            bgcolor={vendor_statuses.find((el) => el.id === data.status)?.color}
            title={vendor_statuses.find((el) => el.id === data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'actions') {
      return {
        ...el,
        headerName: 'Действия',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'vendor-edit vendor-delete'}>
            <Box display='inline-flex' columnGap={2}>
              <CheckAccess id={'vendor-edit'}>
                <IconButton onClick={() => setIsDrawerOpen({ type: 'edit', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'vendor-delete'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                  <DeleteIcon />
                </IconButton>
              </CheckAccess>
            </Box>
          </CheckAccess>
        )),
      }
    }
  })

  return columns
}
