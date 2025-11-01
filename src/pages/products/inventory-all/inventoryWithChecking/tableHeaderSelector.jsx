import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, TextField, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import thousandDivider from '../../../../../utils/thousandDivider'
const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400', textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through' }}
      id={`product-${type}-${rowIndex}`}
    >
      {typeof data?.[type] != 'undefined' ? (withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-') : ''}
    </Typography>
  )
}
const DatePiker = (props) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])
  return (
    <TextField
      inputRef={inputRef}
      value={props.value}
      // onChange={(e) => props.api.stopEditing(false)}
      onBlur={() => props.api.stopEditing(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') props.api.stopEditing(false)
        if (e.key === 'Escape') props.api.stopEditing(true)
      }}
      onInput={(e) => props.setValue(e.target.value)}
      name='expired_date'
      type='date'
    />
  )
}
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

    // Toggle sort direction manually
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

export default function tableHeaderSelector({ level = 2, importsColumns, setOrderStoring, orderStoring, editable = false, values, t, setScanedNumber }) {
  const { id } = useParams()
  const columns = importsColumns?.map((el) => {
    if (el.field === 'number') {
      return {
        ...el,
        headerComponent: CustomHeader,
        setOrderStoring,
        orderStoring,
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
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Название',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }

    if (el.field === 'unit_per_pack') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'УП',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='unit_per_pack' />),
      }
    }
    if (el.field === 'current_quantity') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Програм кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='current_quantity' />),
      }
    }
    if (el.field === 'current_quantity_pattern') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
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
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Програм Cумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type='current_sum' />),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        editable: editable,
        headerName: 'Цена',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type='retail_price' />),
      }
    }

    if (el.field === 'barcode') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        editable: editable,
        setOrderStoring,
        headerName: 'Штрих-код',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='barcode' />),
      }
    }
    if (el.field === 'expired_date') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        editable: editable && level == 2,
        setOrderStoring,
        headerName: 'Срок',
        colId: el.field,
        // cellEditor: DatePiker,
        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['expire_date']).format('DD.MM.YYYY')}</Typography>
          </Box>
        )),
      }
    }
    //
    if (el.field === 'fact_quantity') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Факт УП',

        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='fact_quantity' />),
      }
    }
    if (el.field === 'fact_unit') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Факт кол-во',

        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='fact_unit' />),
      }
    }
    if (el.field === 'fact_quantity_pattern') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
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
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Факт Cумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type='fact_sum' />),
      }
    }
    //
    if (el.field === 'difference_quantity') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Разница кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider type='difference_quantity' />),
      }
    }
    if (el.field === 'difference_quantity_pattern') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
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
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Разница сумма',
        colId: el.field,
        // sortingOrder: ['asc', 'desc'],
        cellRenderer: memo((p) => <SimpleText {...p} currency={'сум'} withDevider type='difference_sum' />),
      }
    }
  })

  return columns
}
