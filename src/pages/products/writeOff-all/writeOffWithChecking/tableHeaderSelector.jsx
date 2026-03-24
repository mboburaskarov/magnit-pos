import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import { useParams } from 'react-router-dom'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ importsColumns, values, t, setScanedNumber }) {
  const { id } = useParams()
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
        cellRenderer: memo((p) => <SimpleText {...p} type={'barcode'} customText={p.data?.barcode} />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Название',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'name'} customText={p.data?.name} />),
      }
    }
    if (el.field === 'material_code') {
      return {
        ...el,
        headerName: 'Артикул',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'material_code'} customText={p.data?.material_code} />),
      }
    }
    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: 'Цена продажи',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type={'supply_price'} />),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: 'Цена поставки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type={'retail_price'} />),
      }
    }
    if (el.field === 'stock_count') {
      return {
        ...el,
        headerName: 'Текущее кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type={'stock_count'} customText={`${p.data?.stock_count} ${p.data?.short_name}`} />),
      }
    }
    if (el.field === 'scanned_count') {
      return {
        ...el,
        headerName: 'Сканированные',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <NumberFormatInput
              onBlur={({ target }) => {
                if (p?.data?.scanned_count == get(target, 'value')) return

                setScanedNumber({
                  id,
                  product_id: get(p, 'data.id'),
                  barcode: get(p, 'data.barcode'),
                  type: 'MANUAL',
                  scanned_count: Number(get(target, 'value').replace(/\s+/g, '')),
                })
              }}
              placeholder={'0'}
              defaultValue={p?.data?.scanned_count}
              id={`scanned_quantity_${p?.data?.id}`}
              name={`scanned_quantity_${p?.data?.id}`}
              type='number'
              fullWidth
            />
          </Box>
        )),
      }
    }
  })

  return columns
}
