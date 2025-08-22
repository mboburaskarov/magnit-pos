import { Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import thousandDivider from '../../../../../utils/thousandDivider'
import { useQueryParams } from '../../../../hooks/useQueryParams'

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

export default function tableHeaderSelector({ importsColumns }) {
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
    if (el.field === 'product_name') {
      return {
        ...el,
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='product_name' />),
      }
    }

    if (el.field === 'kvant') {
      return {
        ...el,
        headerName: 'Квант',
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{p?.data?.kvant}</Typography>),

        // cellRenderer: memo((p) => (
        //   <NumberFormatInput
        //     id={`store_product.${p.data.id}.kvant`}
        //     name={`store_product.${p.data.id}.kvant`}
        //     fullWidth
        //     required
        //     defaultValue={p?.data?.kvant}
        //     type='number'
        //     onBlur={({ target }) => {
        //       if (Number(toFlot(get(target, 'value'))) == p?.data?.kvant) {
        //         return
        //       }
        //       autoOrderChangeQuantity({
        //         kvant: Number(get(target, 'value')),
        //         id: p?.data?.id,
        //       })
        //     }}
        //     disabled={false}
        //   />
        // )),
      }
    }
    if (el.field === 'min_stock') {
      return {
        ...el,
        headerName: 'Минимальный сток',
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{p?.data?.min_stock}</Typography>),

        // cellRenderer: memo((p) => (
        //   <NumberFormatInput
        //     id={`store_product.${p.data.id}.min_stock`}
        //     name={`store_product.${p.data.id}.min_stock`}
        //     fullWidth
        //     required
        //     InputProps={{
        //       onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
        //     }}
        //     defaultValue={p?.data?.min_stock}
        //     type='number'
        //     onBlur={({ target }) => {
        //       if (Number(get(target, 'value')) == '') {
        //         setValue(`store_product.${p.data.id}.min_stock`, '0')
        //       }
        //       if (Number(toFlot(get(target, 'value'))) == p?.data?.min_stock) {
        //         return
        //       }
        //       autoOrderChangeQuantity({
        //         min_stock: Number(get(target, 'value')),
        //         id: p?.data?.id,
        //       })
        //     }}
        //     disabled={false}
        //   />
        // )),
      }
    }
    if (el.field === 'max_stock') {
      return {
        ...el,
        headerName: 'Максимальный сток',
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{p?.data?.max_stock}</Typography>),

        // cellRenderer: memo((p) => (
        //   <NumberFormatInput
        //     id={`store_product.${p.data.id}.max_stock`}
        //     name={`store_product.${p.data.id}.max_stock`}
        //     fullWidth
        //     required
        //     defaultValue={p?.data?.max_stock}
        //     type='number'
        //     onBlur={({ target }) => {
        //       if (Number(toFlot(get(target, 'value'))) == p?.data?.max_stock) {
        //         return
        //       }
        //       autoOrderChangeQuantity({
        //         max_stock: Number(toFlot(get(target, 'value'))),
        //         id: p?.data?.id,
        //       })
        //     }}
        //     disabled={false}
        //   />
        // )),
      }
    }
    if (el.field === 'current_stock') {
      return {
        ...el,
        headerName: 'Остаток',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography>
            {p?.data?.current_stock} {p?.data?.unit_name}
          </Typography>
        )),
      }
    }
    if (el.field === 'response_order_quantity') {
      return {
        ...el,
        headerName: 'Фактическое количество',
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{p?.data?.response_order_quantity}</Typography>),
      }
    }
    if (el.field === 'monthly_quantity') {
      return {
        ...el,
        headerName: 'Продажа ко-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='sale_count' />),
      }
    }
    if (el.field === 'weekly_quantity') {
      return {
        ...el,
        headerName: 'Срок д/п',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='import_day' />),
      }
    }
    if (el.field === 'order_growth') {
      return {
        ...el,
        headerName: 'Заказ',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='order_count' />),
      }
    }
    if (el.field === 'order_lead_time') {
      return {
        ...el,
        headerName: 'Период продажа',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='daily_sale_count' />),
      }
    }

    if (el.field === 'suggested_order') {
      return {
        ...el,
        headerName: 'Остаток на дату текущей поставки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText tho {...p} type='stock_on_delivery_date' />),
      }
    }
    if (el.field === 'adjusted_order') {
      return {
        ...el,
        headerName: 'Остаток на дату следующей поставки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='reserve_quantity' />),
      }
    }
  })

  return columns
}
