import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import StyledTooltip from '@components/StyledTooltip'
import DeleteIcon from '@icons/DeleteIcon'
import EditIcon from '@icons/EditIcon'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import CheckAccess from '@components/CheckAccess'

export default function tableHeaderSelector({ productsColumns, t, selectVendors, values, setOpenConfirmDialog }) {
  const navigate = useNavigate()
  const columns = productsColumns?.map((el) => {
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
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('name'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'permission_count') {
      return {
        ...el,
        headerName: t('permissions'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='permission_count' />),
      }
    }
    if (el.field === 'description') {
      return {
        ...el,
        headerName: t('description'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <StyledTooltip title={p.data.description}>
            <SimpleText width={el.width} {...p} type='description' />
          </StyledTooltip>
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
            <CheckAccess id={'role:edit'}>
              <IconButton onClick={() => navigate(`/roles/edit/${data.id}`)} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <EditIcon />
              </IconButton>
            </CheckAccess>
            <CheckAccess id={'role:delete'}>
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
