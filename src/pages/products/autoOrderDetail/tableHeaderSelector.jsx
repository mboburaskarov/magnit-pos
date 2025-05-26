import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import CustomImg from '../../../../components/CustomImg'
import NumberFormatInput from '../../../../components/Inputs/OutLineTextFieldThousand'
import { toFlot } from '../../../../utils/parseFormatNumberToFloat'
import thousandDivider from '../../../../utils/thousandDivider'
import DefaultImgIcon from '../../../assets/icons/defaultImgIcon'
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

const Image = ({ data, rowIndex, setImages }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '40px',
        height: '40px',
        borderRadius: 2,
        '&:hover': {
          '#overlay_image': {
            opacity: 0.5,
          },
        },
      }}
    >
      {data?.main_photo?.[0] ? (
        <CustomImg
          id={`product-image-${rowIndex}`}
          src={data?.main_photo || 'default-img.avif'}
          alt={data?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <DefaultImgIcon />
      )}
      {data?.files?.[0] && (
        <Box
          sx={{
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            opacity: 0,
            borderRadius: 2,
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            bgcolor: 'green.600',
            position: 'absolute',
            zIndex: 2,
          }}
          id='overlay_image'
          onClick={() => setImages({ data: data?.files })}
        />
      )}
    </Box>
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
        cellRenderer: memo((p) => (
          <NumberFormatInput
            id={`store_product.${p.data.id}.kvant`}
            name={`store_product.${p.data.id}.kvant`}
            fullWidth
            required
            defaultValue={p?.data?.kvant}
            type='number'
            onBlur={({ target }) => {
              if (Number(toFlot(get(target, 'value'))) == p?.data?.kvant) {
                return
              }
              autoOrderChangeQuantity({
                kvant: Number(get(target, 'value')),
                id: p?.data?.id,
              })
            }}
            // defaultValue={get(p, 'data.small_quantity')}
            disabled={false}
          />
        )),
      }
    }
    if (el.field === 'min_stock') {
      return {
        ...el,
        headerName: 'Минимальный сток',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            id={`store_product.${p.data.id}.min_stock`}
            name={`store_product.${p.data.id}.min_stock`}
            fullWidth
            required
            InputProps={{
              onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
            }}
            defaultValue={p?.data?.min_stock}
            type='number'
            onBlur={({ target }) => {
              if (Number(get(target, 'value')) == '') {
                setValue(`store_product.${p.data.id}.min_stock`, '0')
              }
              if (Number(toFlot(get(target, 'value'))) == p?.data?.min_stock) {
                return
              }
              autoOrderChangeQuantity({
                min_stock: Number(get(target, 'value')),
                id: p?.data?.id,
              })
            }}
            // defaultValue={get(p, 'data.small_quantity')}
            disabled={false}
          />
        )),
      }
    }
    if (el.field === 'max_stock') {
      return {
        ...el,
        headerName: 'Максимальный сток',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            id={`store_product.${p.data.id}.max_stock`}
            name={`store_product.${p.data.id}.max_stock`}
            fullWidth
            required
            defaultValue={p?.data?.max_stock}
            type='number'
            onBlur={({ target }) => {
              if (Number(toFlot(get(target, 'value'))) == p?.data?.max_stock) {
                return
              }
              autoOrderChangeQuantity({
                max_stock: Number(toFlot(get(target, 'value'))),
                id: p?.data?.id,
              })
            }}
            // defaultValue={get(p, 'data.small_quantity')}
            disabled={false}
          />
        )),
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
        headerName: 'Продажа месяц средняя',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='month_sale_stock' />),
      }
    }
    if (el.field === 'weekly_quantity') {
      return {
        ...el,
        headerName: '7 дней продажа',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='day_sale_stock' />),
      }
    }
    if (el.field === 'order_growth') {
      return {
        ...el,
        headerName: 'Заказ 7 дней ( +Прирост 10%)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='order_growth' />),
      }
    }
    if (el.field === 'order_lead_time') {
      return {
        ...el,
        headerName: 'Плечо заказа. 6 раз / в неделю.',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='order_lead_time' />),
      }
    }

    if (el.field === 'suggested_order') {
      return {
        ...el,
        headerName: 'Заказ итог',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText tho {...p} type='suggested_order_quantity' />),
      }
    }
    if (el.field === 'adjusted_order') {
      return {
        ...el,
        headerName: 'Заказ итог',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            id={`store_product.${p.data.id}.suggested_order`}
            name={`store_product.${p.data.id}.suggested_order`}
            fullWidth
            required
            defaultValue={p?.data?.suggested_order_quantity}
            type='number'
            onBlur={({ target }) => {
              if (Number(toFlot(get(target, 'value'))) == p?.data?.suggested_order_quantity) {
                return
              }
              autoOrderChangeQuantity({
                adjusted_order_quantity: Number(get(target, 'value')),
                id: p?.data?.id,
              })
            }}
            // defaultValue={get(p, 'data.small_quantity')}
            disabled={false}
          />
          // <TextField
          //   id={`net_amount_${p?.data?.store_id + p?.data?.product_id}`}
          //   defaultValue={p?.data?.suggested_order}
          //   name={`adjusted_order_${p?.data?.id}`}
          //   type='number'
          // />
        )),
      }
    }
  })

  return columns
}
