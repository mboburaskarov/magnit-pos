import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Typography } from '@mui/material'
import { get } from 'lodash'
import { useQuery } from 'react-query'
import CheckAccess from '../../../../components/CheckAccess'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import DrawerInfoBox from '../../../../components/Drawers/DrawerInfoBox'
import SectionTitle from '../../../../components/SectionTitle'
import getImageUrl from '../../../../utils/getImageUrl'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import CancelOrderIcon from '../../../assets/icons/CancelOrderIcon'
import ImagePlaceholder from '../../../assets/icons/ImagePlaceholder'
import ProductHistory from './ProductHistory'

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
      {data?.photos?.[0] ? (
        <img src={getImageUrl(data?.photos?.[0])} alt={data?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
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

export default function ProductDrawer({ open: id, onClose, setImages, setOpenConfirmDialog, setRejectComment }) {
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
          <Image setImages={setImages} data={productData?.data?.data} />
          <Typography mt={0.5} ml={2} fontSize={28} variant='h2'>
            {productData?.data?.data?.name}
            <Typography display='flex' alignItems='center' color='bunker.400' mt={1} fontWeight={'500'}>
              {get(productData, 'data.data.sum')} сум
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
              color='secondary'
              onClick={() => window.open(`/products/edit/${productData?.data?.data.id}`, '_blank')}
              startIcon={<FontAwesomeIcon width={15} icon={faPen} />}
              fullWidth
            >
              Редактировать
            </Button>
          </CheckAccess>
          {/* <CheckAccess id={productData?.data?.data?.status === 'ACTIVE' ? 'product-deactive' : 'product-active'}>
            <Button
              color='secondary'
              onClick={() => setOpenConfirmDialog({ type: productData?.data?.data.status === 'ACTIVE' ? 'deactivate' : 'activate', id })}
              startIcon={productData?.data?.data?.status !== 'ACTIVE' ? <LockOpenIcon size={21} /> : <LockIcon size={21} />}
              fullWidth
            >
              {productData?.data?.data?.status !== 'ACTIVE' ? 'Активировать' : 'Деактивировать'}
            </Button>
          </CheckAccess> */}
          {productData?.data?.data?.status !== 'INACTIVE' ? (
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
      {productData?.data?.data?.status === 'REJECTED' && (
        <>
          <SectionTitle grey mt={6}>
            Причина отклона
          </SectionTitle>
          <Box mt={2} overflow={'hidden'} bgcolor={'grey.100'} borderRadius={3} p={4}>
            <Typography sx={{ width: '100%', wordBreak: 'break-word' }}>{productData?.data?.data?.rejectedComment || 'Нет'}</Typography>
          </Box>
        </>
      )}
      <SectionTitle mt={6} grey>
        Доп. информация
      </SectionTitle>
      <DrawerInfoBox
        infoData={[
          { title: 'Цена', info: thousandDivider(productData?.data?.data?.sum, 'сум') },
          { title: 'Скидочная цена', info: productData?.data?.data?.discountCost ? thousandDivider(productData?.data?.data?.discountCost, 'сум') : '-' },
          { title: 'Время подготовки', info: productData?.data?.data?.preparationTime + ' минут' },
          { title: 'Название магазина', info: productData?.data?.data?.shop?.[0] && productData?.data?.data?.shop?.[0]?.name },
          { title: 'Наименование товара', info: productData?.data?.data?.name },
          { title: 'Тип', info: productData?.data?.data?.type === 'BUCHET' ? 'Buchet' : 'Market' },
          { title: 'Описание', info: productData?.data?.data?.description, fullWidth: true },
          { title: 'Комментария', info: productData?.data?.data?.description || '-', fullWidth: true },
          { title: 'Категории', info: productData?.data?.data?.categories?.map((el) => `${el?.nameRu}, `), fullWidth: true },
          { title: 'Название размера', info: productData?.data?.data?.size?.name || '-', fullWidth: true },
          { title: 'Ширина', info: productData?.data?.data?.size?.width ? thousandDivider(productData?.data?.data?.size?.width, 'см') : '-' },
          { title: 'Высота', info: productData?.data?.data?.size?.height ? thousandDivider(productData?.data?.data?.size?.height, 'см') : '-' },
        ]}
      />
    </CardDrawer>
  )
}
