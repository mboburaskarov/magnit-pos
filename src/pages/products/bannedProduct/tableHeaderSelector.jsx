import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import CheckAccess from '@components/CheckAccess'
import DeleteIcon from '@icons/DeleteIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ bannedProductColumns, t, setOpenConfirmDialog }) {
  const { values } = useQueryParams()

  const columns = bannedProductColumns?.map((el) => {
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
        cellRenderer: memo((p) => <SimpleText {...p} type='product_name' />),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: t('store'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' />),
      }
    }
    if (el.field === 'created_by') {
      return {
        ...el,
        headerName: t('Создатель'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='created_by' />),
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
              <CheckAccess id={'delete-bonus-product'}>
                <IconButton
                  onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: data.name })}
                  sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
                >
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
