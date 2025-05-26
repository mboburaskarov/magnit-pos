import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import { useParams } from 'react-router-dom'
import thousandDivider from '../../../../utils/thousandDivider'
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
const CustomHeader = (props) => {
  const lastStort = props.column.colDef.orderStoring
  const currentColId = props.column.colId
  const orderPosition = lastStort?.position || 0
  const ordercolId = lastStort?.colId || 0
  const onClick = () => {
    console.log(props.column.colDef)

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
    console.log(newOrder)

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

export default function tableHeaderSelector({ importsColumns, setOrderStoring, orderStoring, editable = false, values, t, setScanedNumber }) {
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
    //
    if (el.field === 'fact_quantity') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Факт УП',
        editable: editable,

        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText {...p} withDevider type='fact_quantity' />
          // <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
          //   <NumberFormatInput
          //     onBlur={({ target }) => {
          //       if (p?.data?.fact_quantity == get(target, 'value')) return

          //       setScanedNumber({
          //         id,
          //         product_id: get(p, 'data.id'),
          //         barcode: get(p, 'data.barcode'),
          //         type: 'MANUAL',
          //         fact_quantity: Number(get(target, 'value').replace(/\s+/g, '')),
          //       })
          //     }}
          //     disabled={p?.data?.unit_per_pack == 0}
          //     placeholder={'0'}
          //     defaultValue={p?.data?.fact_quantity}
          //     id={`fact_quantity_${p?.data?.id}`}
          //     name={`fact_quantity_${p?.data?.id}`}
          //     type='number'
          //     fullWidth
          //   />
          // </Box>
        )),
      }
    }
    if (el.field === 'fact_unit') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Факт кол-во',
        editable: editable,

        colId: el.field,
        cellRenderer: memo(
          (p) => <SimpleText {...p} withDevider type='fact_unit' />

          // <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
          //   <NumberFormatInput
          //     onBlur={({ target }) => {
          //       if (p?.data?.fact_unit == get(target, 'value')) return

          //       setScanedNumber({
          //         id,
          //         product_id: get(p, 'data.id'),
          //         barcode: get(p, 'data.barcode'),
          //         type: 'MANUAL',
          //         fact_unit: Number(get(target, 'value').replace(/\s+/g, '')),
          //       })
          //     }}
          //     placeholder={'0'}
          //     defaultValue={p?.data?.fact_unit}
          //     id={`fact_unit_${p?.data?.id}`}
          //     name={`fact_unit_${p?.data?.id}`}
          //     type='number'
          //     fullWidth
          //   />
          // </Box>
        ),
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
    // if (el.field === 'barcode') {
    //   return {
    //     ...el,
    //     headerName: 'Штрих-код',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         {/* <Typography>{p.data?.barcode}</Typography> */}
    //         <TextField
    //           onBlur={({ target }) => {
    //             if (p?.data?.barcode == get(target, 'value')) return

    //             setScanedNumber({
    //               id,
    //               product_id: get(p, 'data.id'),
    //               type: 'MANUAL',
    //               barcode: get(target, 'value').replace(/\s+/g, ''),
    //             })
    //           }}
    //           placeholder={'0'}
    //           defaultValue={p.data?.barcode}
    //           id={`barcode.${p?.data?.id}`}
    //           name={`barcode.${p?.data?.id}`}
    //           // type='number'
    //           fullWidth
    //         />
    //       </Box>
    //     )),
    //   }
    // }

    // if (el.field === 'material_code') {
    //   return {
    //     ...el,
    //     headerName: 'Артикул',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{p.data?.material_code}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'stock_count') {
    //   return {
    //     ...el,
    //     headerName: 'Заявлено',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>
    //           {p.data?.stock_count} {p.data?.short_name}
    //         </Typography>
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'scanned_count') {
    //   return {
    //     ...el,
    //     headerName: 'Сканированные',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <NumberFormatInput
    //           onBlur={({ target }) => {
    //             if (p?.data?.scanned_count == get(target, 'value')) return

    //             setScanedNumber({
    //               id,
    //               product_id: get(p, 'data.id'),
    //               barcode: get(p, 'data.barcode'),
    //               type: 'MANUAL',
    //               scanned_count: Number(get(target, 'value').replace(/\s+/g, '')),
    //             })
    //           }}
    //           placeholder={'0'}
    //           defaultValue={p?.data?.scanned_count}
    //           id={`scanned_quantity_${p?.data?.id}`}
    //           name={`scanned_quantity_${p?.data?.id}`}
    //           type='number'
    //           fullWidth
    //         />
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'difference_count') {
    //   return {
    //     ...el,
    //     headerName: 'Разница',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{p.data?.difference_count}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'retail_price') {
    //   return {
    //     ...el,
    //     headerName: 'Цена продажи',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{p.data?.retail_price}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'received_sum') {
    //   return {
    //     ...el,
    //     headerName: 'Сумма продажи',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{p.data?.received_sum}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'scanned_sum') {
    //   return {
    //     ...el,
    //     headerName: 'Cканированная сумма',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{p.data?.scanned_sum}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'difference_sum') {
    //   return {
    //     ...el,
    //     headerName: 'Разница суммы',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{p.data?.difference_sum}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'expire_date') {
    //   return {
    //     ...el,
    //     headerName: 'Срок годности',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         {/* <Typography>{dayjs(p.data?.expire_date).format('DD.MM.YYYY')}</Typography> */}
    //         <TextField
    //           onBlur={({ target }) => {
    //             if (p?.data?.expire_date == get(target, 'value')) return

    //             setScanedNumber({
    //               id,
    //               product_id: get(p, 'data.id'),
    //               barcode: get(p, 'data.barcode'),
    //               type: 'MANUAL',
    //               expire_date: get(target, 'value').replace(/\s+/g, ''),
    //             })
    //           }}
    //           placeholder={'0'}
    //           defaultValue={dayjs(p.data?.expire_date).format('DD.MM.YYYY')}
    //           id={`expire_date_${p?.data?.id}`}
    //           name={`expire_date_${p?.data?.id}`}
    //           // type='number'
    //           fullWidth
    //         />
    //       </Box>
    //     )),
    //   }
    // }
    // if (el.field === 'serial_number') {
    //   return {
    //     ...el,
    //     headerName: 'Серийный номер',
    //     colId: el.field,
    //     cellRenderer: memo((p) => (
    //       <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
    //         <Typography>{p.data?.serial_number}</Typography>
    //       </Box>
    //     )),
    //   }
    // }
  })

  return columns
}
