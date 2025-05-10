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
    if (el.field === 'stock_count') {
      return {
        ...el,
        headerName: 'Заявлено',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>
              {p.data?.stock_count} {p.data?.short_name}
            </Typography>
          </Box>
        )),
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
    if (el.field === 'difference_count') {
      return {
        ...el,
        headerName: 'Разница в количестве',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.difference_count}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: 'Цена продажи',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.retail_price}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'received_sum') {
      return {
        ...el,
        headerName: 'Сумма продажи',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.received_sum}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'scanned_sum') {
      return {
        ...el,
        headerName: 'Cканированная сумма',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.scanned_sum}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'difference_sum') {
      return {
        ...el,
        headerName: 'Разница суммы',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.difference_sum}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'expire_date') {
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
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{p.data?.serial_number}</Typography>
          </Box>
        )),
      }
    }
  })

  return columns
}
