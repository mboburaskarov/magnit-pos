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
import dayjs from 'dayjs'
import { useTheme } from '@mui/styles'
import DefaultImgIcon from '../../assets/icons/defaultImgIcon'
import { useNavigate } from 'react-router-dom'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400', textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through' }}
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
        <img
          id={`product-image-${rowIndex}`}
          src={data?.main_photo || '/default-img.avif'}
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

export default function tableHeaderSelector({ productsColumns, values, setImages, t, setOpenConfirmDialog, setOpenProductDrawer, setIsDrawerOpen }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const getDateColor = (date) => {
    if (date > 25) return { color: theme.palette.green[700] }
    if (date > 3 && date < 25) return { color: theme.palette.orange[400] }
    if (date < 3) return { color: theme.palette.red[400] }
  }
  // const { values } = useQueryParams()
  const columns = productsColumns?.map((el) => {
    if (el.field === 'main_photo') {
      return {
        ...el,
        headerName: t('table_columns.photo'),
        colId: el.field,
        cellRenderer: memo((p) => <Image {...p} setImages={setImages} />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('table_columns.name'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box sx={{ '& p': { color: 'orange.500' }, cursor: 'pointer' }} onClick={() => setOpenProductDrawer(p.data.id)}>
            <SimpleText {...p} type='name' />
          </Box>
        )),
      }
    }
    if (el.field === 'sum') {
      return {
        ...el,
        headerName: t('table_columns.price'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='sum' />),
      }
    }
    if (el.field === 'category') {
      return {
        ...el,
        headerName: t('table_columns.category'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line', color: 'gray.400' }} id={`product-${p.data.categories[0]?.name}-${p.rowIndex}`}>
            {get(p, 'data.categories.[0].name', '-')}
          </Typography>
        )),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: t('table_columns.retail_price'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='retail_price' />),
      }
    }
    if (el.field === 'vat') {
      return {
        ...el,
        headerName: t('table_columns.vat'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='%' withDevider {...p} type='vat' />),
      }
    }
    if (el.field === 'vat_price') {
      return {
        ...el,
        headerName: t('table_columns.vat_price'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='sum' withDevider {...p} type='vat_price' />),
      }
    }
    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: t('table_columns.supply_price'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='supply_price' />),
      }
    }
    if (el.field === 'status') {
      return {
        ...el,
        headerName: t('table_columns.status'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`products-status-${rowIndex}`}
            bgcolor={products_statuses.find((el) => el.id === data.status)?.color}
            title={products_statuses.find((el) => el.id === data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'manufacturer') {
      return {
        ...el,
        headerName: t('table_columns.manufacturer'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText type={'manufacturer'} {...p} />),
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

    if (el.field === 'barcode') {
      return {
        ...el,
        headerName: t('table_columns.barcode'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' {...p} type='barcode' />),
      }
    }
    if (el.field === 'product_variability') {
      return {
        ...el,
        headerName: 'Ishlab chiqaruvchi',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='sum' withDevider {...p} type='product_variability' />),
      }
    }

    if (el.field === 'quantity') {
      return {
        ...el,
        headerName: t('table_columns.quantity'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='quantity' />),
      }
    }
    if (el.field === 'expire_date') {
      return {
        ...el,
        headerName: t('table_columns.expire_date'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['expire_date']).format('DD.MM.YYYY')}</Typography>
            <Typography color={getDateColor(p.data['expire_day'])}>{p.data['expire_day']} kun</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'product-edit product-delete product-active product-deactive'}>
            <Box display='inline-flex' columnGap={'8px'}>
              <CheckAccess id={'product-edit'}>
                <IconButton onClick={() => navigate(`/products/edit/${data.id}`)} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'product-delete'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <DeleteIcon />
                </IconButton>
              </CheckAccess>
            </Box>
          </CheckAccess>
        )),
      }
    }
  })

  return columns
}
