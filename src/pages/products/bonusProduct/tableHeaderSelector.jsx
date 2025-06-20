import { Box, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import CheckAccess from '../../../../components/CheckAccess'
import thousandDivider from '../../../../utils/thousandDivider'
import { imports_list_statuses } from '../../../assets/data/imports-list-statuses'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import EditIcon from '../../../assets/icons/EditIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
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
    if (el.field === 'product_name') {
      return {
        ...el,
        headerName: t('table_columns.name'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} data={p.data.product} type='name' />),
      }
    }

    if (el.field === 'bonus_amount') {
      return {
        ...el,
        headerName: 'Сумма бонуса',
        colId: el.field,
        cellRenderer: memo((p) => <Typography whiteSpace='pre-wrap'>{p.data?.bonus_amount}</Typography>),
      }
    }
    if (el.field === 'status') {
      return {
        ...el,
        headerName: t('table_columns.status'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <StatusCell
            id={`products-status-${p.rowIndex}`}
            color={imports_list_statuses.find((el) => el.id === p.data.status)?.color}
            bgcolor={imports_list_statuses.find((el) => el.id === p.data.status)?.bgcolor}
            title={imports_list_statuses.find((el) => el.id === p.data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'start_date') {
      return {
        ...el,
        headerName: 'Дата заказ',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'start_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.start_date).format('DD.MM.YYYY')}</Typography>
          </Box>
        )),
      }
    }

    if (el.field === 'end_data') {
      return {
        ...el,
        headerName: 'Дата заказ',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'end_data'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.end_date).format('DD.MM.YYYY')}</Typography>
          </Box>
        )),
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
              <CheckAccess id={'edit-product'}>
                <IconButton onClick={() => setopenEditBonusModal(data)} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'delete-product'}>
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
