import { Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import NumberFormatInput from '../../../components/Inputs/OutLineTextFieldThousand'
import thousandDivider from '../../../utils/thousandDivider'

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
            placeholder={'0'}
            onBlur={(e) => {
              changeAmount('supply_price', p.data.id, Number(get(e, 'target.value')))
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
            onBlur={(e) => {
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
            maxNumber={100}
            onBlur={(e) => {
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
            onBlur={(e) => {
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
        headerName: 'Бонус',
        colId: el.field,
        cellRenderer: memo((p) => (
          <NumberFormatInput
            maxNumber={100}
            applyAll
            aplyAllFunc={() => applyAllPriceFunc(p.data.id, 'bonus_amount')}
            id={`store_product.${p.data.id}.bonus_amount`}
            name={`store_product.${p.data.id}.bonus_amount`}
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
