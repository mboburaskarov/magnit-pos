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
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Aптека',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' />),
      }
    }
    if (el.field === 'final_pack_quantity') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Итог (уп)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='final_pack_quantity' />),
      }
    }
    if (el.field === 'final_unit_quantity') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Итог (шт)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='final_unit_quantity' />),
      }
    }
    if (el.field === 'pack_qty') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Ткщ остаток (уп)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='pack_qty' />),
      }
    }
    if (el.field === 'unit_qty') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Ткщ остаток (шт)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='unit_qty' />),
      }
    }
    if (el.field === 'import_pack_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Приход (уп)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='import_pack_change' />),
      }
    }
    if (el.field === 'import_unit_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Приход (шт)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='import_unit_change' />),
      }
    }
    if (el.field === 'sales_pack_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Продажа (уп)"',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='sales_pack_change' />),
      }
    }
    if (el.field === 'sales_unit_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Продажа (шт)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='sales_unit_change' />),
      }
    }
    if (el.field === 'return_pack_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Возврат (уп)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='return_pack_change' />),
      }
    }
    if (el.field === 'return_unit_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Возврат (шт)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='return_unit_change' />),
      }
    }
    if (el.field === 'transfer_pack_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Перемещение (уп)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='transfer_pack_change' />),
      }
    }
    if (el.field === 'transfer_unit_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Перемещение (шт)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='transfer_unit_change' />),
      }
    }
    if (el.field === 'inventory_pack_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Инвентаризация (уп)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='inventory_pack_change' />),
      }
    }
    if (el.field === 'inventory_unit_change') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Инвентаризация (шт)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider={true} type='inventory_unit_change' />),
      }
    }
  })

  return columns
}
