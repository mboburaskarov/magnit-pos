import { Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import InputQuantity from '../../../components/Inputs/InputQuantity'
import thousandDivider from '../../../utils/thousandDivider'
import { maxWidth } from '@mui/system'
import NumberFormatInput from '../../../components/Inputs/OutLineTextFieldThousand'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function productPriceTableHeaderSelector({
  productsColumns,
  setValues,
  setOpenChangeQuantity,
  productData,
  values,
  t,
  applyAllPriceFunc,
  changeAmount,
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
    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: 'Цена покупки',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            applyAll
            aplyAllFunc={() => applyAllPriceFunc(p.data.id, 'supply_price')}
            id={`store_product.${p.data.id}.supply_price`}
            name={`store_product.${p.data.id}.supply_price`}
            fullWidth
            // adornment={'sum'}
            // adornmentPosition='end'
            placeholder={'0'}
            onFocus={({ target }) => {
              if (Number(get(target, 'value')) == 0) {
                setValues(`store_product.${p.data.id}.supply_price`, '')
                return
              }
            }}
            onBlur={(e) => {
              if (Number(get(e, 'target.value')) == '') {
                setValues(`store_product.${p.data.id}.supply_price`, 0)
                return
              }
              changeAmount('supply_price', p.data.id, Number(get(e, 'target.value')))
              // if (get(e, 'target.value') != get(p, 'data.supply_price') && get(productData, 'id', false)) {
              //   setOpenChangeQuantity({
              //     supply_price: get(p, 'data.supply_price'),
              //     name: `store_product.${p.data.id}`,
              //     measurement_value: get(e, 'target.value') - get(p, 'data.supply_price'),
              //     oldValue: get(p, 'data.supply_price'),
              //   })
              // }
            }}
            required
            defaultValue={0}
            type='number'
            disabled={false}
          />
        )),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: 'Цена продажи с НДС',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            onFocus={({ target }) => {
              if (Number(get(target, 'value')) == 0) {
                setValues(`store_product.${p.data.id}.retail_price`, '')
                return
              }
            }}
            onBlur={(e) => {
              if (Number(get(e, 'target.value')) == '') {
                setValues(`store_product.${p.data.id}.retail_price`, 0)
                return
              }
              changeAmount('retail_price', p.data.id, Number(get(e, 'target.value')))
            }}
            applyAll
            aplyAllFunc={() => applyAllPriceFunc(p.data.id, 'retail_price')}
            id={`store_product.${p.data.id}.retail_price`}
            name={`store_product.${p.data.id}.retail_price`}
            fullWidth
            required
            type='number'
            defaultValue={0}
            disabled={false}
          />
        )),
      }
    }
    if (el.field === 'vat') {
      return {
        ...el,
        headerName: `${t('create_new_product.vat')} %`,
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            onFocus={({ target }) => {
              if (Number(get(target, 'value')) == 0) {
                setValues(`store_product.${p.data.id}.vat`, '')
                return
              }
            }}
            onBlur={(e) => {
              if (Number(get(e, 'target.value')) == '') {
                setValues(`store_product.${p.data.id}.vat`, 0)
                return
              }
              if (Number(get(e, 'target.value')) > 100) {
                setValues(`store_product.${p.data.id}.vat`, 100)
                return
              }
              changeAmount('vat', p.data.id, Number(get(e, 'target.value')))
            }}
            applyAll
            aplyAllFunc={() => applyAllPriceFunc(p.data.id, 'vat')}
            id={`store_product.${p.data.id}.vat`}
            name={`store_product.${p.data.id}.vat`}
            fullWidth
            required
            type='number'
            defaultValue={0}
            disabled={false}
          />
        )),
      }
    }
    if (el.field === 'markup') {
      return {
        ...el,
        headerName: 'Наценка',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            onFocus={({ target }) => {
              if (Number(get(target, 'value')) == 0) {
                setValues(`store_product.${p.data.id}.markup`, '')
                return
              }
            }}
            onBlur={(e) => {
              if (Number(get(e, 'target.value')) == '') {
                setValues(`store_product.${p.data.id}.markup`, 0)
                return
              }
              changeAmount('markup', p.data.id, Number(get(e, 'target.value')))
            }}
            applyAll
            aplyAllFunc={() => applyAllPriceFunc(p.data.id, 'markup')}
            id={`store_product.${p.data.id}.markup`}
            name={`store_product.${p.data.id}.markup`}
            fullWidth
            required
            type='number'
            defaultValue={0}
            disabled={false}
          />
        )),
      }
    }
    if (el.field === 'bonus_percent') {
      return {
        ...el,
        headerName: 'Бонус %',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            onFocus={({ target }) => {
              if (Number(get(target, 'value')) == 0) {
                setValues(`store_product.${p.data.id}.bonus_percent`, '')
                return
              }
            }}
            onBlur={(e) => {
              if (Number(get(e, 'target.value')) == '') {
                setValues(`store_product.${p.data.id}.bonus_percent`, 0)
                return
              }
              if (Number(get(e, 'target.value')) > 100) {
                setValues(`store_product.${p.data.id}.bonus_percent`, 100)
                return
              }
            }}
            applyAll
            aplyAllFunc={() => applyAllPriceFunc(p.data.id, 'bonus_percent')}
            id={`store_product.${p.data.id}.bonus_percent`}
            name={`store_product.${p.data.id}.bonus_percent`}
            fullWidth
            required
            type='number'
            defaultValue={0}
            disabled={false}
          />
        )),
      }
    }
  })

  return columns
}
