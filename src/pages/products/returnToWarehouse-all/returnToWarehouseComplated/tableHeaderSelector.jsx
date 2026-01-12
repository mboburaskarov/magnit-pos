import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ importsColumns, values }) {
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

    if (el.field === 'barcode') {
      return {
        ...el,
        headerName: 'Штрих-код',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'barcode'} />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Название',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'name'} />),
      }
    }
    if (el.field === 'material_code') {
      return {
        ...el,
        headerName: 'Артикул',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'material_code'} />),
      }
    }
    if (el.field === 'producer') {
      return {
        ...el,
        headerName: 'Производитель',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'producer'} />),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: 'Цена',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type={'retail_price'} />),
      }
    }
    if (el.field === 'export_date') {
      return {
        ...el,
        headerName: 'Срок годности',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'export_date'} customText={dayjs(p.data?.expire_date).format('DD.MM.YYYY')} />),
      }
    }
    if (el.field === 'serial_number') {
      return {
        ...el,
        headerName: 'Серийный номер',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type={'serial_number'} />),
      }
    }
    if (el.field === 'stock_count') {
      return {
        ...el,
        headerName: 'Текущее кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'stock_count'} customText={`${p.data?.received_count} ${p.data?.short_name}`} />),
      }
    }
    if (el.field === 'expected_count') {
      return {
        ...el,
        headerName: 'Отп кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText data={p?.data} type={'expected_count'} />),
      }
    }

    if (el.field === 'scanned_pack') {
      return {
        ...el,
        headerName: 'Скан кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText data={p?.data} type={'scanned_pack'} />),
      }
    }
    if (el.field === 'accepted_count') {
      return {
        ...el,
        headerName: 'Принятое кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText data={p?.data} type={'accepted_count'} />),
      }
    }
  })

  return columns
}
