import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '@components/AgGridTable/Cells/StatusCell'
import { formatPhoneNumber } from '@utils/formatPhoneNumber'
import { vendor_statuses } from '@/assets/data/vendor-statuses'
import DeleteIcon from '@icons/DeleteIcon'
import EditIcon from '@icons/EditIcon'
import LockIcon from '@icons/LockIcon'
import UnLockIcon from '@icons/UnLock'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import CheckAccess from '@components/CheckAccess'

export default function tableHeaderSelector({ setopenCreateVendorDrawer, values, vendorsColumns, t, setOpenConfirmDialog, selectVendors }) {
  const columns = vendorsColumns?.map((el) => {
    if (el.field === 'number') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offset', 0)) + 1 + rowIndex

          return (
            <Typography fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      }
    }
    if (el.field === 'checkbox') {
      return {
        ...el,
        headerName: '',
        colId: el.field,
        cellRenderer: memo((p) => (
          <input onChange={(e) => selectVendors(e.target.checked, p.data.id)} name='checkbox_zero' className='customCheckbox' type='checkbox' />
        )),
      }
    }
    if (el.field === 'public_id') {
      return {
        ...el,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='public_id' />),
      }
    }
    if (el.field === 'fish') {
      return {
        ...el,
        headerName: t('fish'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='fish' customText={get(p, 'data.[first_name]') + ' ' + get(p, 'data.[last_name]')} />),
      }
    }
    if (el.field === 'store') {
      return {
        ...el,
        headerName: t('branch'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText data={get(p, 'data.[store]')} type={'name'} />),
      }
    }
    if (el.field === 'phone') {
      return {
        ...el,
        headerName: t('phone'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText type={'phone'} customText={formatPhoneNumber(p.data.phone)} />),
      }
    }
    if (el.field === 'role') {
      return {
        ...el,
        headerName: t('role'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            type={'role'}
            customText={get(p, 'data.roles', [])
              .map((e) => e?.name)
              .join(',')}
          />
        )),
      }
    }

    if (el.field === 'status') {
      return {
        ...el,
        headerName: t('status'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`products-status-${rowIndex}`}
            color={vendor_statuses.find((el) => el.id === data.status)?.color}
            bgcolor={vendor_statuses.find((el) => el.id === data.status)?.bgcolor}
            title={vendor_statuses.find((el) => el.id === data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'actions') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box display='inline-flex' columnGap={'8px'}>
            <CheckAccess id={'employee:inactive'}>
              {data.status === 'active' ? (
                <>
                  <IconButton
                    sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
                    onClick={() => setOpenConfirmDialog({ type: 'deactivate', id: data.id, name: get(data, '[first_name]') + ' ' + get(data, '[last_name]') })}
                  >
                    <LockIcon color='#111217' />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
                    onClick={() => setOpenConfirmDialog({ type: 'activate', id: data.id, name: get(data, '[first_name]') + ' ' + get(data, '[last_name]') })}
                  >
                    <UnLockIcon color='#111217' />
                  </IconButton>
                </>
              )}
            </CheckAccess>
            <CheckAccess id={'employee:edit'}>
              <IconButton onClick={() => setopenCreateVendorDrawer({ mode: 'edit', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <EditIcon />
              </IconButton>
            </CheckAccess>
            <CheckAccess id={'employee:delete'}>
              <IconButton
                onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: get(data, '[first_name]') + ' ' + get(data, '[last_name]') })}
                sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
              >
                <DeleteIcon />
              </IconButton>
            </CheckAccess>
          </Box>
        )),
      }
    }
  })

  return columns
}
