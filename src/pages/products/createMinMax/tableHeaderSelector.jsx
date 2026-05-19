import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '@components/AgGridTable/Cells/StatusCell'
import CheckAccess from '@components/CheckAccess'
import DeleteIcon from '@icons/DeleteIcon'
import EditIcon from '@icons/EditIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

const minmaxStatus = [
  {
    id: 'true',
    color: 'green.700',
    bgcolor: 'green.10',
    name: 'Активный',
  },
  {
    id: 'false',
    color: 'red.700',
    bgcolor: 'red.10',
    name: 'Неактивный',
  },
]

export default function tableHeaderSelector({ importsColumns, t, setOpenEditMinMaxModal }) {
  const { values } = useQueryParams()

  const columns = importsColumns?.map((el) => {
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
    if (el.field === 'product_name') {
      return {
        ...el,
        headerName: t('table_columns.name'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'Магазин',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' />),
      }
    }
    if (el.field === 'kvant') {
      return {
        ...el,
        headerName: 'Квант',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='kvant' />),
      }
    }
    if (el.field === 'min_quantity') {
      return {
        ...el,
        headerName: 'Мин',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='min_quantity' />),
      }
    }
    if (el.field === 'max_quantity') {
      return {
        ...el,
        headerName: 'Макс',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='max_quantity' />),
      }
    }
    if (el.field === 'is_active') {
      return {
        ...el,
        headerName: 'Статус',
        colId: el.field,
        cellRenderer: memo((p) => (
          <StatusCell
            id={`products-status-${p.rowIndex}`}
            color={minmaxStatus.find((el) => el.id == String(p.data.is_active))?.color}
            bgcolor={minmaxStatus.find((el) => el.id == String(p.data.is_active))?.bgcolor}
            title={minmaxStatus.find((el) => el.id == String(p.data.is_active))?.name}
          />
        )),
      }
    }
    if (el.field === 'code') {
      return {
        ...el,
        headerName: 'Код',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='material_code' />),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'product-edit product-delete product-active product-deactive'}>
            <Box display='inline-flex' columnGap={'8px'}>
              <CheckAccess id={'edit-min-max'}>
                <IconButton onClick={() => setOpenEditMinMaxModal(data)} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'delete-min-max'}>
                <IconButton sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
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
