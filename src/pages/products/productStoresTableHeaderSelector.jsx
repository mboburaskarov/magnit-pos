import { memo } from 'react'
import { Box, IconButton, TextField, Typography } from '@mui/material'
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
// import TextField from '../../../components/Inputs/TextField'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}
const SimpleInput = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Box>
      {/* <TextField id={`product-${type}-${rowIndex}`} /> */}
      {/* <TextField id={`product-${type}-${rowIndex}`} fullWidth name='description' label='Izoh' placeholder='Fikr kiriting' /> */}
    </Box>
  )
}

export default function productStoresTableHeaderSelector({ productsColumns, values, setImages, t, setOpenConfirmDialog, setIsDrawerOpen }) {
  // const { values } = useQueryParams()
  console.log(productsColumns)

  const columns = productsColumns?.map((el) => {
    if (el.field === 'name') {
      return {
        ...el,
        headerName: "Do'kon",
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
            <Typography fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      }
    }
    if (el.field === 'amount') {
      return {
        ...el,
        headerName: 'Miqdor',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleInput currency='' {...p} type='name' />),
      }
    }
    if (el.field === 'min_amount') {
      return {
        ...el,
        headerName: 'Kichik miqdor',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleInput currency='' {...p} type='name' />),
      }
    }
  })

  return columns
}
