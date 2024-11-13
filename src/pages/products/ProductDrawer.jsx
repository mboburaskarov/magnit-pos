import { Box, Button, Typography } from '@mui/material'
import CardDrawer from '../../../components/Drawers/CardDrawer'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import SectionTitle from '../../../components/SectionTitle'
import DrawerInfoBox from '../../../components/Drawers/DrawerInfoBox'
import thousandDivider from '../../../utils/thousandDivider'
import ProductHistory from './ProductHistory'
import ImagePlaceholder from '../../assets/icons/ImagePlaceholder'
import getImageUrl from '../../../utils/getImageUrl'
import ReviewIcon from '../../assets/icons/ReviewIcon'
import LockIcon from '../../assets/icons/LockIcon'
import LockOpenIcon from '../../assets/icons/LockOpenIcon'
import CheckAccess from '../../../components/CheckAccess'
import CancelOrderIcon from '../../assets/icons/CancelOrderIcon'

const Image = ({ data, setImages }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '72px',
        height: '72px',
        borderRadius: 3,
        '&:hover': {
          '#overlay_image': {
            opacity: 0.5,
          },
        },
      }}
    >
      {data?.files?.[0] ? (
        <img src={getImageUrl(data?.files?.[0])} alt={data?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
      ) : (
        <ImagePlaceholder small />
      )}
      {data?.files?.[0] && (
        <Box
          sx={{
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            opacity: 0,
            borderRadius: 3,
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

export default function ProductDrawer({ isOpen: id, onClose, setImages, setOpenConfirmDialog, setRejectComment }) {
  const {
    data: productData,
    isLoading: productDataLoading,
    isFetching: isFetchingproductData,
  } = useQuery(['productData', id], () => requests.getSingleProduct(id), { enabled: !!id })

  return (
    <CardDrawer
      closeDrawer={onClose}
      title={
        <Box display='inline-flex'>
          <Image setImages={setImages} data={productData?.data} />
          <Typography mt={0.5} ml={2} fontSize={28} variant='h2'>
            {productData?.data?.name}
            <Typography display='flex' alignItems='center' color='grey.400' mt={1} variant='body1'>
              <ReviewIcon />
              <Typography ml={0.5} color='grey.400'>
                {productData?.data?.averageRating} рейтинг
              </Typography>{' '}
              • {productData?.data?.commentsCount} отзывов
            </Typography>
          </Typography>
        </Box>
      }
      isOpen={!!id}
      isLoading={productDataLoading && isFetchingproductData}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <CheckAccess id={'product-edit'}>
            <Button
              onClick={() => window.open(`/products/edit/${productData?.data._id}`, '_blank')}
              startIcon={<FontAwesomeIcon width={15} icon={faPen} />}
              fullWidth
            >
              Редактировать
            </Button>
          </CheckAccess>
          <CheckAccess id={productData?.data.status === 'ACTIVE' ? 'product-deactive' : 'product-active'}>
            <Button
              color='secondary'
              onClick={() => setOpenConfirmDialog({ type: productData?.data.status === 'ACTIVE' ? 'deactivate' : 'activate', id })}
              startIcon={productData?.data?.status !== 'ACTIVE' ? <LockOpenIcon size={21} /> : <LockIcon size={21} />}
              fullWidth
            >
              {productData?.data?.status !== 'ACTIVE' ? 'Активировать' : 'Деактивировать'}
            </Button>
          </CheckAccess>
          {productData?.data?.status !== 'INACTIVE' ? (
            <CheckAccess id={'product-delete'}>
              <Button
                onClick={() => setOpenConfirmDialog({ type: 'delete', id })}
                color='red'
                startIcon={<FontAwesomeIcon width={14} icon={faTrash} />}
                fullWidth
              >
                Удалить
              </Button>
            </CheckAccess>
          ) : (
            <CheckAccess id={'product-delete'}>
              <Button onClick={() => setRejectComment({ id: id, comment: undefined })} color='warning' startIcon={<CancelOrderIcon fill={'#FFF'} />} fullWidth>
                Отклонить
              </Button>
            </CheckAccess>
          )}
        </Box>
      }
    >
      <SectionTitle grey>История продукта</SectionTitle>
      <ProductHistory id={id} />
      {productData?.data?.status === 'REJECTED' && (
        <>
          <SectionTitle grey mt={6}>
            Причина отклона
          </SectionTitle>
          <Box mt={2} overflow={'hidden'} bgcolor={'grey.100'} borderRadius={3} p={4}>
            <Typography sx={{ width: '100%', wordBreak: 'break-word' }}>{productData?.data?.rejectedComment || 'Нет'}</Typography>
          </Box>
        </>
      )}
      <SectionTitle mt={6} grey>
        Доп. информация
      </SectionTitle>
      <DrawerInfoBox
        infoData={[
          { title: 'Цена', info: thousandDivider(productData?.data?.cost, 'сум') },
          { title: 'Скидочная цена', info: productData?.data?.discountCost ? thousandDivider(productData?.data?.discountCost, 'сум') : '-' },
          { title: 'Время подготовки', info: productData?.data?.preparationTime + ' минут' },
          { title: 'Название магазина', info: productData?.data?.shop[0] && productData?.data?.shop[0]?.name },
          { title: 'Наименование товара', info: productData?.data?.name },
          { title: 'Тип', info: productData?.data?.type === 'BUCHET' ? 'Buchet' : 'Market' },
          { title: 'Описание', info: productData?.data?.description, fullWidth: true },
          { title: 'Комментария', info: productData?.data?.description || '-', fullWidth: true },
          { title: 'Категории', info: productData?.data?.categories?.map((el) => `${el?.nameRu}, `), fullWidth: true },
          { title: 'Название размера', info: productData?.data?.size?.name || '-', fullWidth: true },
          { title: 'Ширина', info: productData?.data?.size?.width ? thousandDivider(productData?.data?.size?.width, 'см') : '-' },
          { title: 'Высота', info: productData?.data?.size?.height ? thousandDivider(productData?.data?.size?.height, 'см') : '-' },
        ]}
      />
    </CardDrawer>
  )
}
