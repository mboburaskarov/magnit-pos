import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import { useParams } from 'react-router-dom'
import NumberFormatInput from '../../../../components/Inputs/OutLineTextFieldThousand'
import thousandDivider from '../../../../utils/thousandDivider'
const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400', textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through' }}
      id={`product-${type}-${rowIndex}`}
    >
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

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
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.barcode}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Название',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.name}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'material_code') {
      return {
        ...el,
        headerName: 'Артикул',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.material_code}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'export_date') {
      return {
        ...el,
        headerName: 'Срок годности',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.expire_date).format('DD.MM.YYYY')}</Typography>
          </Box>
        )),
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
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>
              {p.data?.received_count} {p.data?.short_name}
            </Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'scanned_pack') {
      return {
        ...el,
        headerName: 'Упакофка',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <NumberFormatInput
              onBlur={({ target }) => {
                if (p?.data?.scanned_pack == get(target, 'value')) return

                setScanedNumber({
                  id,
                  product_id: get(p, 'data.id'),
                  barcode: get(p, 'data.barcode'),
                  type: 'MANUAL',
                  scanned_pack: Number(get(target, 'value').replace(/\s+/g, '')),
                  scanned_unit: p?.data?.scanned_unit,
                })
              }}
              placeholder={'0'}
              disabled={true}
              defaultValue={p?.data?.scanned_pack}
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
              onBlur={({ target }) => {
                if (p?.data?.scanned_unit == get(target, 'value')) return

                setScanedNumber({
                  id,
                  product_id: get(p, 'data.id'),
                  barcode: get(p, 'data.barcode'),
                  type: 'MANUAL',
                  scanned_pack: p?.data?.scanned_pack,
                  scanned_unit: Number(get(target, 'value').replace(/\s+/g, '')),
                })
              }}
              disabled={true}
              placeholder={'0'}
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
