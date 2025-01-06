import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TimeCell from '../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../utils/thousandDivider'
import getImageUrl from '../../../utils/getImageUrl'
import { products_statuses } from '../../assets/data/products-statuses'
import ProductImagePlaceholder from '../../assets/icons/ProductImagePlaceholder'
import EditIcon from '../../assets/icons/EditIcon'
import DeleteIcon from '../../assets/icons/DeleteIcon'
import ExpressIcon from '../../assets/icons/ExpressIcon'
import StyledTooltip from '../../../components/StyledTooltip'
import CheckAccess from '../../../components/CheckAccess'
import { useQueryParams } from '../../hooks/useQueryParams'
import { get } from 'lodash'
import InputQuantity from '../../../components/Inputs/InputQuantity'
import TextField from '../../../components/Inputs/TextField'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function productStoresTableHeaderSelector({
  productsColumns,
  values,
  setImages,
  t,
  setOpenConfirmDialog,
  setIsDrawerOpen,
  register,
  getValues,
  setValues,
  applyAllFunc,
}) {
  // const { values } = useQueryParams()

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
          const absoluteIndex = Number(get(values, 'offset', 0)) + 1 + rowIndex

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
          <InputQuantity
            applyAll
            aplyAllFunc={() => applyAllFunc(p.data.id, 'quantity')}
            id={`store_product.${p.data.id}.quantity`}
            name={`store_product.${p.data.id}.quantity`}
            fullWidth
            adornment={p.data?.measurement_unit?.short_name}
            adornmentPosition='end'
            required
            defaultValue={get(p, 'data.quantity')}
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
          <InputQuantity
            applyAll
            aplyAllFunc={() => applyAllFunc(p.data.id, 'small_quantity')}
            id={`store_product.${p.data.id}.small_quantity`}
            name={`store_product.${p.data.id}.small_quantity`}
            fullWidth
            required
            type='number'
            defaultValue={get(p, 'data.small_quantity')}
            disabled={false}
          />
        )),
      }
    }
  })

  return columns
}
