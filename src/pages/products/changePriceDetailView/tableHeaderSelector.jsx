import { ArrowCircleRight } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import thousandDivider from '../../../../utils/thousandDivider'
import { useQueryParams } from '../../../hooks/useQueryParams'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{
        display: '-webkit-box',
        overflow: 'hidden',
        wordWrap: 'break-word',
        textOverflow: 'ellipsis',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': '3',
        whiteSpace: 'pre-line',
        color: !data?.[type] && 'gray.400',
        textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through',
      }}
      id={`product-${type}-${rowIndex}`}
    >
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ importsColumns, t, setValue, getValue, autoOrderChangeQuantity }) {
  const { values } = useQueryParams()

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
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'serial_number') {
      return {
        ...el,
        headerName: 'Артикул',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='serial_number' />),
      }
    }

    if (el.field === 'barcode') {
      return {
        ...el,
        headerName: 'Баркод',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='barcode' />),
      }
    }

    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: '	Цена продажи',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography
            sx={{
              whiteSpace: 'pre-line',
              display: 'flex',
              alignItems: 'center',
            }}
            id={`product-retail_price-${p?.rowIndex}`}
          >
            {thousandDivider(get(p, 'data.old_retail_price'), 'сум')}
            <ArrowCircleRight sx={{ m: '0 10px', fontSize: '25px', color: '#fe5000' }} />
            {thousandDivider(get(p, 'data.new_retail_price'), 'сум')}
          </Typography>
        )),
      }
    }

    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: 'Цена поставщика',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='old_supply_price' withDevider currency={'сум'} />),
      }
    }

    if (el.field === 'percent') {
      return {
        ...el,
        headerName: 'Наценка',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography
            sx={{
              whiteSpace: 'pre-line',
              display: 'flex',
              alignItems: 'center',
            }}
            id={`product-retail_price-${p?.rowIndex}`}
          >
            {thousandDivider(get(p, 'data.old_markup'), '%')}
            <ArrowCircleRight sx={{ m: '0 10px', fontSize: '25px', color: '#fe5000' }} />
            {thousandDivider(get(p, 'data.new_markup'), '%')}
          </Typography>
        )),
      }
    }
    if (el.field === 'scanned_count') {
      return {
        ...el,
        headerName: 'Кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='scanned_count' />),
      }
    }
  })

  return columns
}
