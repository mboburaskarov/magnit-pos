import { Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import thousandDivider from '../../../../utils/thousandDivider'
import { seller_bonus_statuses } from '../../../assets/data/seller-bonus-statuses'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ vendorsColumns, t }) {
  const columns = vendorsColumns?.map((el) => {
    if (el.field === 'sales_count') {
      return {
        ...el,
        headerName: 'Количество продаж',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          return <SimpleText withDevider {...p} type='count' />
        }),
      }
    }
    if (el.field === 'bonus_amount') {
      return {
        ...el,
        headerName: 'Бонусы',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='amount' />),
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
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line', color: 'orange.500', cursor: 'pointer' }}>{get(p, 'data.[full_name]')}</Typography>
        )),
      }
    }
    if (el.field === 'store') {
      return {
        ...el,
        headerName: t('branch'),
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{get(p, 'data.store_name')}</Typography>),
      }
    }
    if (el.field === 'phone') {
      return {
        ...el,
        headerName: t('phone'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.type}-${p.rowIndex}`}>
            {formatPhoneNumber(p.data.phone)}
          </Typography>
        )),
      }
    }
    if (el.field === 'role') {
      return {
        ...el,
        headerName: t('role'),
        colId: el.field,
        cellRenderer: memo((p) => <Typography whiteSpace={'pre-line'}>{p.data.role}</Typography>),
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
            color={seller_bonus_statuses.find((el) => el.id === data.status)?.color || 'red.700'}
            bgcolor={seller_bonus_statuses.find((el) => el.id === data.status)?.bgcolor || 'red.10'}
            title={seller_bonus_statuses.find((el) => el.id === data.status)?.name || 'Неоплаченный'}
          />
        )),
      }
    }
  })

  return columns
}
