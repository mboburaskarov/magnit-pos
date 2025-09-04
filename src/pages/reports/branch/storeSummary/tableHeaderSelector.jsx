import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import thousandDivider from '../../../../../utils/thousandDivider'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}
const CustomHeader = (props) => {
  const lastStort = props.column.colDef.orderStoring
  const currentColId = props.column.colId
  const orderPosition = lastStort?.position || 0
  const ordercolId = lastStort?.colId || 0
  const onClick = () => {
    let newOrder = { position: 0, colId: '' }
    if (lastStort) {
      if (orderPosition == 2 && ordercolId == props.column.colId) {
        newOrder = {
          position: 0,
          colId: '',
        }
      } else {
        if (ordercolId != props.column.colId && ordercolId != '') {
          newOrder = {
            position: 1,
            colId: props.column.colId,
          }
        } else {
          newOrder = {
            position: orderPosition + 1,
            colId: props.column.colId,
          }
        }
      }
    }

    // Toggle sort direction manually
    props.column.colDef.setOrderStoring(newOrder)
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        padding: '12px',
        alignItems: 'center',
        textOverflow: 'ellipsis',
        alignSelf: 'stretch',
      }}
    >
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111217',
          fontSize: '16px',
          fontWeight: ' 600',
          lineHeight: '24px',
        }}
      >
        {props.displayName}
        <Box height={'18px'} ml='10px'>
          {orderPosition == 1 && currentColId == ordercolId && <ArrowUpward color='#ccc' />}
          {orderPosition == 2 && currentColId == ordercolId && <ArrowDownward color='#ccc' />}
        </Box>
      </Typography>
    </Box>
  )
}
export default function tableHeaderSelector({ clientsColumns, values, setOrderStoring, orderStoring }) {
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

    if (el.field === 'name') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Филиал',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'sale_amount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Общая сумма продаж',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'сум'} type='sale_amount' />),
      }
    }
    if (el.field === 'import_amount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Импорт в ожидании',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'сум'} type='import_amount' />),
      }
    }
    if (el.field === 'stock_amount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Общая сумма баланса',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'сум'} type='stock_amount' />),
      }
    }
    if (el.field === 'discount_amount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Общая сумма скидки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'сум'} type='stock_amount' />),
      }
    }
    if (el.field === 'total') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Итог',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'сум'} type='total' />),
      }
    }
  })

  return columns
}
