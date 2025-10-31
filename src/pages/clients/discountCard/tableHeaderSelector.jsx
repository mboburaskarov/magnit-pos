import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'

import CheckAccess from '@components/CheckAccess'
import thousandDivider from '@utils/thousandDivider'
import DeleteIcon from '@icons/DeleteIcon'
import EditIcon from '@icons/EditIcon'
import { useQueryParams } from '@hooks/useQueryParams'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400', textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through' }}
      id={`product-${type}-${rowIndex}`}
    >
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ importsColumns, t, setOpenConfirmDialog, setopenEditBonusModal }) {
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
    if (el.field === 'percent') {
      return {
        ...el,
        headerName: 'Процент',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='percent' />),
      }
    }
    if (el.field === 'barcode') {
      return {
        ...el,
        headerName: 'Баркод',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='barcode' />),
      }
    }

    if (el.field === 'full_name') {
      return {
        ...el,
        headerName: 'Клиент',
        colId: el.field,
        cellRenderer: memo((p) => <Typography whiteSpace='pre-wrap'>{p.data?.full_name}</Typography>),
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
              <CheckAccess id={'edit-bonus-product'}>
                <IconButton onClick={() => setopenEditBonusModal(data)} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
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
