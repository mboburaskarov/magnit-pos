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
import PlayIcon from '../../assets/icons/PlayIcon'
import PauseIcon from '../../assets/icons/PauseIcon'
import ExpressIcon from '../../assets/icons/ExpressIcon'
import StyledDialog from '../../../components/Dialogs/StyledDialog'
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
      {data?.files?.[0] ? (
        <img
          id={`product-image-${rowIndex}`}
          src={getImageUrl(data?.files?.[0])}
          alt={data?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <ProductImagePlaceholder />
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

export default function tableHeaderSelector({ productsColumns, setImages, setOpenConfirmDialog, setIsDrawerOpen }) {
  const columns = productsColumns?.map((el) => {
    if (el.field === 'photo') {
      return {
        ...el,
        headerName: 'Фото',
        colId: el.field,
        cellRenderer: memo((p) => <Image {...p} setImages={setImages} />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Наименования',
        colId: el.field,
        cellRenderer: memo(({ data }) => {
          const isExpress = (data?.type === 'BUCHET' && data?.preparationTime === 0) || data?.isExpress || false
          return (
            <Box
              sx={{ bgcolor: isExpress ? '#F7900930' : 'transparent', py: 1, px: 1.5, borderRadius: 3 }}
              columnGap={0.5}
              display='inline-flex'
              alignItems='center'
              onClick={() => setIsDrawerOpen(data._id)}
            >
              {isExpress && (
                <StyledTooltip title='Экспресс продукт'>
                  <ExpressIcon />
                </StyledTooltip>
              )}
              <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='green.500'>
                {data?.name}
              </Typography>
            </Box>
          )
        }),
      }
    }
    if (el.field === 'cost') {
      return {
        ...el,
        headerName: 'Цена',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='cost' />),
      }
    }
    if (el.field === 'discount_cost') {
      return {
        ...el,
        headerName: 'Цена со скидкой',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='discountCost' />),
      }
    }
    if (el.field === 'status') {
      return {
        ...el,
        headerName: 'Статус',
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

    if (el.field === 'shop_name') {
      return {
        ...el,
        headerName: 'Магазин',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`product-${type}-${rowIndex}`}>
            {data?.shop?.name}
          </Typography>
        )),
      }
    }
    if (el.field === 'preparation_time') {
      return {
        ...el,
        headerName: 'Время подготовки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='минут' withDevider {...p} type='preparationTime' />),
      }
    }
    if (el.field === 'rating_score') {
      return {
        ...el,
        headerName: 'Рейтинг',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='ratingScore' />),
      }
    }
    if (el.field === 'comments_count') {
      return {
        ...el,
        headerName: 'Кол-во отзывов',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='commentsCount' />),
      }
    }
    if (el.field === 'quantity') {
      return {
        ...el,
        headerName: 'Кол-во',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='quantity' />),
      }
    }
    if (el.field === 'product_lifetime') {
      return {
        ...el,
        headerName: 'Срок продукта',
        colId: el.field,
        cellRenderer: memo((p) => <TimeCell {...p} type='sellDate' format='DD.MM.YYYY HH:mm' />),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: 'Действия',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'product-edit product-delete product-active product-deactive'}>
            <Box display='inline-flex' columnGap={2}>
              <CheckAccess id={'product-edit'}>
                <IconButton onClick={() => window.open(`/products/edit/${data._id}`, '_blank')} sx={{ borderRadius: 3, p: '14px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'product-delete'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                  <DeleteIcon />
                </IconButton>
              </CheckAccess>
              {data.status === 'ACTIVE' ? (
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
              )}
            </Box>
          </CheckAccess>
        )),
      }
    }
  })

  return columns
}
