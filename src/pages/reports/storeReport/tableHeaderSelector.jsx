import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import thousandDivider from '../../../../utils/thousandDivider'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ clientsColumns, values, selectClientsFunc, t, setOpenConfirmDialog }) {
  const columns = clientsColumns?.map((el) => {
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

    if (el.field === 'material_code') {
      return {
        ...el,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_code' />),
      }
    }

    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'Филиал',
        colId: el.field,
        cellRenderer: memo((p) => <Typography color='#fe5000'>{p?.data.store_name}</Typography>),
      }
    }
    if (el.field === 'sale_date') {
      return {
        ...el,
        headerName: 'Дата ',
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{dayjs(get(p, 'data.sale_date')).format('DD.MM.YYYY')}</Typography>),
      }
    }
    if (el.field === 'total_amount') {
      return {
        ...el,
        headerName: 'Общая сумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='total_amount' />),
      }
    }
    if (el.field === 'cash') {
      return {
        ...el,
        headerName: 'Наличные',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='cash' />),
      }
    }
    if (el.field === 'humo') {
      return {
        ...el,
        headerName: 'HUMO',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='humo' />),
      }
    }
    if (el.field === 'return_amount') {
      return {
        ...el,
        headerName: 'Возврат',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='return_amount' />),
      }
    }
    if (el.field === 'uzcard') {
      return {
        ...el,
        headerName: 'UZCARD',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='uzcard' />),
      }
    }
    if (el.field === 'click') {
      return {
        ...el,
        headerName: 'CLICK',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='click' />),
      }
    }
  })

  return columns
}
