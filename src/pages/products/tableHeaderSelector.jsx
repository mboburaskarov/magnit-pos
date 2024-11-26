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

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

const Image = ({ data, rowIndex, setImages }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '48px',
        height: '48px',
        borderRadius: 2,
        '&:hover': {
          '#overlay_image': {
            opacity: 0.5,
          },
        },
      }}
    >
      {/* {data?.main_photo?.[0] ? ( */}
      <img
        id={`product-image-${rowIndex}`}
        src={data?.main_photo || '/default-img.avif'}
        alt={data?.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
      />
      {/* ) : (
        <ProductImagePlaceholder />
      )} */}
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

export default function tableHeaderSelector({ productsColumns, setImages, setOpenConfirmDialog, setIsDrawerOpen }) {
  const columns = productsColumns?.map((el) => {
    if (el.field === 'main_photo') {
      return {
        ...el,
        headerName: 'Rasm',
        colId: el.field,
        cellRenderer: memo((p) => <Image {...p} setImages={setImages} />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Mahsulot nomi',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'sum') {
      return {
        ...el,
        headerName: 'Summa',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='sum' />),
      }
    }
    if (el.field === 'category') {
      return {
        ...el,
        headerName: 'Kategoriya',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='category' />),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: 'Sotish narxi',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='retail_price' />),
      }
    }
    if (el.field === 'vat') {
      return {
        ...el,
        headerName: 'QQS',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='%' withDevider {...p} type='vat' />),
      }
    }
    if (el.field === 'vat_price') {
      return {
        ...el,
        headerName: 'QQS narxi',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='sum' withDevider {...p} type='vat_price' />),
      }
    }
    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: 'Sotib olish narxi',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='supply_price' />),
      }
    }
    if (el.field === 'status') {
      return {
        ...el,
        headerName: 'Status',
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
        headerName: "Do'kon nomi",
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => <Typography>{data?.manufacturer}</Typography>),
      }
    }

    if (el.field === 'barcode') {
      return {
        ...el,
        headerName: 'Shtix-kod',
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
        headerName: 'Miqdori',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='quantity' />),
      }
    }
    if (el.field === 'expire_date') {
      return {
        ...el,
        headerName: 'Muddati',
        colId: el.field,
        cellRenderer: memo((p) => <TimeCell {...p} type='expire_date' format='DD.MM.YYYY' />),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: 'Amallar',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'product-edit product-delete product-active product-deactive'}>
            <Box display='inline-flex' columnGap={'8px'}>
              <CheckAccess id={'product-edit'}>
                <IconButton onClick={() => window.open(`/products/edit/${data.id}`, '_blank')} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'product-delete'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <DeleteIcon />
                </IconButton>
              </CheckAccess>
              {/* {data.status === 'ACTIVE' ? (
                <CheckAccess id={'product-deactive'}>
                  <IconButton onClick={() => setOpenConfirmDialog({ type: 'deactivate', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                    <PauseIcon />
                  </IconButton>
                </CheckAccess>
              ) : (
                <CheckAccess id={'product-active'}>
                  <IconButton onClick={() => setOpenConfirmDialog({ type: 'activate', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                    <PlayIcon />
                  </IconButton>
                </CheckAccess>
              )} */}
            </Box>
          </CheckAccess>
        )),
      }
    }
  })

  return columns
}
