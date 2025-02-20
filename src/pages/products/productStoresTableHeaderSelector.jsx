import { Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import InputQuantity from '../../../components/Inputs/InputQuantity'
import thousandDivider from '../../../utils/thousandDivider'
import InputDatePicker from '../../../components/Inputs/InputDatePicker'
import NumberFormatInput from '../../../components/Inputs/OutLineTextFieldThousand'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function productStoresTableHeaderSelector({
  productsColumns,
  setValues,
  setOpenChangeQuantity,
  productData,
  values,
  t,
  applyAllFunc,
  applyAllDateFunc,
}) {
  const columns = productsColumns?.map((el) => {
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('store'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' {...p} type='name' />),
      }
    }
    if (el.field === 'number') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offsetStore', 0)) + 1 + rowIndex

          return (
            <Typography id={`product-${'number'}-${rowIndex}`} fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      }
    }
    if (el.field === 'amount') {
      return {
        ...el,
        headerName: 'Количество',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            applyAll
            aplyAllFunc={() => applyAllFunc(p.data.id, 'pack_quantity')}
            id={`store_product.${p.data.id}.pack_quantity`}
            name={`store_product.${p.data.id}.pack_quantity`}
            fullWidth
            canApplyAll={!get(productData, 'id', false)}
            adornment={p.data?.measurement_unit?.short_name}
            adornmentPosition='end'
            onBlur={(e) => {
              if (get(e, 'target.value') != get(p, 'data.pack_quantity') && get(productData, 'id', false)) {
                setOpenChangeQuantity({
                  supply_price: get(p, 'data.supply_price'),
                  name: `store_product.${p.data.id}`,
                  measurement_value: get(e, 'target.value') - get(p, 'data.pack_quantity'),
                  oldValue: get(p, 'data.pack_quantity'),
                })
              }
            }}
            required
            // defaultValue={get(p, 'data.pack_quantity')}
            type='number'
            disabled={false}
          />
        )),
      }
    }
    if (el.field === 'min_amount') {
      return {
        ...el,
        headerName: 'Небольшое количество',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            applyAll
            aplyAllFunc={() => applyAllFunc(p.data.id, 'small_quantity')}
            id={`store_product.${p.data.id}.small_quantity`}
            name={`store_product.${p.data.id}.small_quantity`}
            fullWidth
            required
            type='number'
            disabled={false}
          />
        )),
      }
    }
    if (el.field === 'expire_date') {
      return {
        ...el,
        headerName: 'Срок действия',
        colId: el.field,
        cellRenderer: memo((p) => (
          <InputDatePicker
            noMarginTop
            defaultValue={new Date()}
            name={`store_product.${p.data.id}.expire_date`}
            minDate={new Date()}
            aplyAllFunc={() => applyAllDateFunc(p.data.id, 'expire_date')}
            applyAll={true}
            canApplyAll={true}
            id={`store_product.${p.data.id}.expire_date`}
            // label='Дата срока'
            placeholder='Дата срока'
          />
        )),
      }
    }
  })

  return columns
}
