import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TimeCell from '../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../utils/thousandDivider'
import getImageUrl from '../../../utils/getImageUrl'
import { products_statuses } from '../../assets/data/products-statuses'
import ProductImagePlaceholder from '../../assets/icons/ProductImagePlaceholder'
import EditIcon from '../../assets/icons/EditIcon'
import DeleteIcon from '../../assets/icons/DeleteIcon'
import ExpressIcon from '../../assets/icons/ExpressIcon'
import StyledTooltip from '../../../components/StyledTooltip'
import CheckAccess from '../../../components/CheckAccess'
import { useQueryParams } from '../../hooks/useQueryParams'
import { get } from 'lodash'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ clientsColumns, setselectClients, values, setImages, t, setOpenConfirmDialog, setIsDrawerOpen }) {
  // const { values } = useQueryParams()
  const columns = clientsColumns?.map((el) => {
    if (el.field === 'checkbox') {
      return {
        ...el,
        headerName: '',
        colId: el.field,
        cellRenderer: memo((p) => (
          <input onChange={(e) => setselectClients(e.target.checked, p.data.id)} name='checkbox_zero' className='customCheckbox' type='checkbox' />
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
        cellRenderer: memo((p) => <Typography>{get(p, 'data.[first_name]') + ' ' + get(p, 'data.[last_name]')}</Typography>),
      }
    }
    if (el.field === 'phone_number') {
      return {
        ...el,
        headerName: t('phone_number'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.type}-${p.rowIndex}`}>
            {p.data.phone[0]}
          </Typography>
        )),
      }
    }
    if (el.field === 'tags') {
      return {
        ...el,
        headerName: t('tags'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`products-status-${rowIndex}`}
            bgcolor={products_statuses.find((el) => el.id === data.teg)?.color}
            title={products_statuses.find((el) => el.id === data.teg)?.name}
          />
        )),
      }
    }

    if (el.field === 'sale_amount') {
      return {
        ...el,
        headerName: 'Сумма покупки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='sale_amount' />),
      }
    }
    if (el.field === 'sale_date') {
      return {
        ...el,
        headerName: 'Последняя покупка',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='sale_date' />),
      }
    }
    if (el.field === 'birthday') {
      return {
        ...el,
        headerName: 'Дата рождения',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='birthday' />),
      }
    }
    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Дата регистрации',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='created_at' />),
      }
    }
    if (el.field === 'store') {
      return {
        ...el,
        headerName: 'Зарегистрируйтесь в филиале',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.type}-${p.rowIndex}`}>
            {get(p, 'data.store.name', '-')}
          </Typography>
        )),
      }
    }
    if (el.field === 'balance') {
      return {
        ...el,
        headerName: 'Баланс',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='balance' />),
      }
    }
    if (el.field === 'debt_amount') {
      return {
        ...el,
        headerName: 'Текущий долг',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='debt_amount' />),
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
              <CheckAccess id={'product-edit'}>
                <IconButton onClick={() => window.open(`/products/edit/${data.id}`, '_blank')} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'product-delete'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <DeleteIcon />
                </IconButton>
              </CheckAccess>
              {/* {data.status === 'ACTIVE' ? (
                <CheckAccess id={'product-deactive'}>
                  <IconButton onClick={() => setOpenConfirmDialog({ type: 'deactivate', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                    <PauseIcon />
                  </IconButton>
                </CheckAccess>
              ) : (
                <CheckAccess id={'product-active'}>
                  <IconButton onClick={() => setOpenConfirmDialog({ type: 'activate', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                    <PlayIcon />
                  </IconButton>
                </CheckAccess>
              )} */}
            </Box>
          </CheckAccess>
        )),
      }
    }
  })

  return columns
}
