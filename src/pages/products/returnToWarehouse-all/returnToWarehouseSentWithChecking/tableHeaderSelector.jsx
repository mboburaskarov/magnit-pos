import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import { useParams } from 'react-router-dom'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ importsColumns, values, setScanedNumber }) {
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
        cellRenderer: memo((p) => <SimpleText {...p} type={'export_date'} customText={`${p.data?.received_count} ${p.data?.short_name}`} />),
      }
    }

    if (el.field === 'expected_count') {
      return {
        ...el,
        headerName: 'Упакофка',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <NumberFormatInput
              uncontrolled
              setValue={() => {}}
              value={p?.data?.expected_count}
              onBlur={({ target }) => {
                if (p?.data?.expected_count == get(target, 'value')) return

                setScanedNumber({
                  returnId: id,
                  product_id: get(p, 'data.id'),
                  barcode: get(p, 'data.barcode'),
                  type: 'MANUAL',
                  scanned_pack: Number(get(target, 'value').replace(/\s+/g, '')),
                })
              }}
              placeholder={'0'}
              defaultValue={p?.data?.expected_count}
              id={`scanned_quantity_pack_${p?.data?.id}`}
              name={`scanned_quantity_pack_${p?.data?.id}`}
              type='number'
              fullWidth
            />
          </Box>
        )),
      }
    }
    if (el.field === 'scanned_unit') {
      return {
        ...el,
        headerName: 'Штук',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <NumberFormatInput
              uncontrolled
              setValue={() => {}}
              onBlur={({ target }) => {
                if (p?.data?.scanned_unit == get(target, 'value')) return

                setScanedNumber({
                  id,
                  product_id: get(p, 'data.id'),
                  barcode: get(p, 'data.barcode'),
                  type: 'MANUAL',
                  scanned_unit: Number(get(target, 'value').replace(/\s+/g, '')),
                })
              }}
              disabled={p?.data?.unit_per_pack == 1 || p?.data?.unit_per_pack == p?.data?.scanned_pack}
              placeholder={'0'}
              value={p?.data?.scanned_unit}
              defaultValue={p?.data?.scanned_unit}
              id={`scanned_quantity_unit_${p?.data?.id}`}
              name={`scanned_quantity_unit_${p?.data?.id}`}
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
