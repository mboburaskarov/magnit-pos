import { Box, Typography } from '@mui/material'
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
        cellRenderer: memo((p) => <SimpleText {...p} type='material_code' />),
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
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'Филиал',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' />),
      }
    }
    if (el.field === 'product_name') {
      return {
        ...el,
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='product_name' />),
      }
    }
    if (el.field === 'producer_name') {
      return {
        ...el,
        headerName: 'Производитель',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='producer_name' />),
      }
    }
    if (el.field === 'serial_number') {
      return {
        ...el,
        headerName: 'Серия',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='serial_number' />),
      }
    }
    if (el.field === 'expire_date') {
      return {
        ...el,
        headerName: 'Срок. Годности',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['expire_date']).format('DD.MM.YYYY')}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'quantity') {
      return {
        ...el,
        headerName: 'Кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='quantity' />),
      }
    }

    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: 'Цена прихода',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='supply_price' />),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: 'Цена продажная',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='retail_price' />),
      }
    }

    if (el.field === 'supply_price_sum') {
      return {
        ...el,
        headerName: 'Сумма прихода',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='supply_price_sum' />),
      }
    }
    if (el.field === 'retail_price_sum') {
      return {
        ...el,
        headerName: 'Сумма продажная',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='retail_price_sum' />),
      }
    }
    if (el.field === 'markup_sum') {
      return {
        ...el,
        headerName: 'Сумма наценки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='markup_sum' />),
      }
    }
    if (el.field === 'vat_sum') {
      return {
        ...el,
        headerName: 'Сумма НДС',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider currency={'сум'} {...p} type='vat_sum' />),
      }
    }
    if (el.field === 'completed_at') {
      return {
        ...el,
        headerName: 'Дата продажи',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['expire_date']).format('DD.MM.YYYY hh:mm')}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'full_name') {
      return {
        ...el,
        headerName: 'ФИО',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='full_name' />),
      }
    }
    if (el.field === 'sale_number') {
      return {
        ...el,
        headerName: 'ID ЧЕКА ',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='sale_number' />),
      }
    }
    if (el.field === 'marking_count') {
      return {
        ...el,
        headerName: 'Маркировки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='marking_count' />),
      }
    }
  })

  return columns
}
