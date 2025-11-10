import { SimpleText } from '@components/AgGridTable/Cells/SimpleText';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import { get } from 'lodash';
import dayjs from 'dayjs';


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
export default function tableHeaderSelector({ reportColumns, values, setOrderStoring, orderStoring }) {
  const columns = reportColumns?.map((el) => {
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
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='material_code' />),
      }
    }
    if (el.field === 'public_id') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='public_id' />),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Филиал',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' />),
      }
    }
    if (el.field === 'product_name') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='product_name' />),
      }
    }
    if (el.field === 'producer_name') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Производитель',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='producer_name' />),
      }
    }
    if (el.field === 'serial_number') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Серия',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='serial_number' />),
      }
    }
    if (el.field === 'expire_date') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Срок. Годности',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='expire_date' customText={dayjs(p.data?.['expire_date']).format('DD.MM.YYYY')} />),
      }
    }
    if (el.field === 'quantity') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='quantity' />),
      }
    }

    if (el.field === 'supply_price') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Цена прихода',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='supply_price' />),
      }
    }
    if (el.field === 'total_discount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Общее сумма скидки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='total_discount' />),
      }
    }

    if (el.field === 'retail_price') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Цена продажная',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='retail_price' />),
      }
    }

    if (el.field === 'supply_price_sum') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Сумма прихода',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='supply_price_sum' />),
      }
    }
    if (el.field === 'retail_price_sum') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Сумма продажная',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='retail_price_sum' />),
      }
    }
    if (el.field === 'markup_sum') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Сумма наценки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='markup_sum' />),
      }
    }
    if (el.field === 'vat_sum') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Сумма НДС',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='vat_sum' />),
      }
    }
    if (el.field === 'completed_at') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Дата продажи',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='completed_at' customText={dayjs(p.data?.['completed_at']).format('DD.MM.YYYY HH:mm:ss')} />),
      }
    }
    if (el.field === 'full_name') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'ФИО',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='full_name' />),
      }
    }
    if (el.field === 'sale_number') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'ID ЧЕКА ',
        colId: el.field,

        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography color={'orange.500'}>
              {get(p, 'data.sale_type', 'SALE') == 'SALE' ? 'Продажа' : 'Возврат'} #{get(p, 'data.sale_number')}
            </Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'marking_count') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Маркировки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='marking_count' />),
      }
    }
  })

  return columns
}
