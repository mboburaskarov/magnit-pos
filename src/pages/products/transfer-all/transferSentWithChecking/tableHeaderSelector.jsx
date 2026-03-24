import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import { useParams } from 'react-router-dom'

export default function tableHeaderSelector({ transferColumsn, values, methods, setScanedNumber }) {
  const { id } = useParams()

  const columns = transferColumsn?.map((el) => {
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
        headerName: 'Упакофка',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <NumberFormatInput
              value={p?.data?.expected_count}
              uncontrolled
              setValue={() => {}}
              onBlur={({ target }) => {
                if (p?.data?.expected_count == get(target, 'value')) return
                methods.setValue(`scanned_quantity_pack_${p?.data?.id}`, Number(get(target, 'value').replace(/\s+/g, '')))

                setScanedNumber({
                  transferId: id,
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
                methods.setValue(`scanned_quantity_unit_${p?.data?.id}`, Number(get(target, 'value').replace(/\s+/g, '')))
                setScanedNumber({
                  transferId: id,
                  product_id: get(p, 'data.id'),
                  barcode: get(p, 'data.barcode'),
                  type: 'MANUAL',
                  scanned_unit: Number(get(target, 'value').replace(/\s+/g, '')),
                })
              }}
              disabled={true}
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
