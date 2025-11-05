import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '@components/AgGridTable/Cells/StatusCell'
import CheckAccess from '@components/CheckAccess'
import DeleteIcon from '@icons/DeleteIcon'
import EditIcon from '@icons/EditIcon'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ setOpenCreatePermission, values, vendorsColumns, t, setOpenConfirmDialog }) {
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

    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Тип',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'Aптека',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} data={p?.data?.store} type='name' />),
      }
    }

    if (el.field === 'is_enable') {
      return {
        ...el,
        headerName: t('status'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`products-status-${rowIndex}`}
            color={get(data, 'is_active', false) === true ? 'green.700' : 'red.700'}
            bgcolor={get(data, 'is_active', false) === true ? 'green.10' : 'red.10'}
            title={get(data, 'is_active', false) === true ? 'Активный' : 'Неактивный'}
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
            <CheckAccess id={'payment-assets-edit'}>
              <IconButton onClick={() => setOpenCreatePermission({ mode: 'edit', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <EditIcon />
              </IconButton>
            </CheckAccess>
            <CheckAccess id={'payment-assets-delete'}>
              <IconButton
                onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: get(data, 'store.name') + ' - ' + get(data, 'name') })}
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
