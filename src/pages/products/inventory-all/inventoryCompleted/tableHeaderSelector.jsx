import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'

export default function tableHeaderSelector({ inventoryColumns, values }) {
  const columns = inventoryColumns?.map((el) => {
    if (el.field === 'number') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offset', 0)) + 1 + rowIndex
          return (
            <Typography fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
              {p?.data?.id == 'ag-grid-footer' ? '' : absoluteIndex}
            </Typography>
          )
        }),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Название',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }

    if (el.field === 'unit_per_pack') {
      return {
        ...el,
        headerName: 'УП',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='unit_per_pack' />),
      }
    }
    if (el.field === 'current_quantity') {
      return {
        ...el,
        headerName: 'Програм кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='current_quantity' />),
      }
    }
    if (el.field === 'current_quantity_pattern') {
      return {
        ...el,
        headerName: 'Програм кол-во',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography>
            {p?.data?.current_unit > 0
              ? `${Math.floor(p?.data?.current_quantity)}(${p?.data?.current_unit}/${p?.data?.unit_per_pack})`
              : p?.data?.current_quantity}
          </Typography>
        )),
      }
    }
    if (el.field === 'current_sum') {
      return {
        ...el,
        headerName: 'Програм Cумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type='current_sum' />),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,

        headerName: 'Цена',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type='retail_price' />),
      }
    }

    if (el.field === 'barcode') {
      return {
        ...el,
        headerName: 'Штрих-код',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='barcode' />),
      }
    }
    if (el.field === 'expired_date') {
      return {
        ...el,
        headerName: 'Срок',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['expire_date']).format('DD.MM.YYYY')}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'fact_quantity') {
      return {
        ...el,
        headerName: 'Факт УП',

        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='fact_quantity' />),
      }
    }
    if (el.field === 'fact_unit') {
      return {
        ...el,
        headerName: 'Факт кол-во',

        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='fact_unit' />),
      }
    }
    if (el.field === 'fact_quantity_pattern') {
      return {
        ...el,
        headerName: 'Факт  кол-во',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography>
            {p?.data?.fact_unit > 0 ? `${Math.floor(p?.data?.fact_quantity)}(${p?.data?.fact_unit}/${p?.data?.unit_per_pack})` : p?.data?.fact_quantity}
          </Typography>
        )),
      }
    }
    if (el.field === 'fact_sum') {
      return {
        ...el,
        headerName: 'Факт Cумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type='fact_sum' />),
      }
    }
    if (el.field === 'difference_quantity') {
      return {
        ...el,
        headerName: 'Разница кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='difference_quantity' />),
      }
    }
    if (el.field === 'difference_quantity_pattern') {
      return {
        ...el,
        headerName: 'Разница кол-во',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography>
            {p?.data?.difference_unit > 0
              ? `${Math.floor(p?.data?.difference_quantity)}(${p?.data?.difference_unit}/${p?.data?.unit_per_pack})`
              : p?.data?.difference_quantity}
          </Typography>
        )),
      }
    }
    if (el.field === 'difference_sum') {
      return {
        ...el,
        headerName: 'Разница сумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type='difference_sum' />),
      }
    }
  })

  return columns
}
