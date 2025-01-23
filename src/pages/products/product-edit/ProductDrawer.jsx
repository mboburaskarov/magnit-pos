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
import DefaultImgIcon from '../../../assets/icons/defaultImgIcon'
import dayjs from 'dayjs'
import ProductRemainsHistory from './ProductRemainsHistory'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ImageGallery from '../../../../components/ImageGallery'

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
        '& svg': {
          width: '72px',
          height: '72px',
        },
      }}
    >
      {data?.photos?.[0] ? (
        <img
          onClick={() => setImages({ data: data?.photos })}
          src={getImageUrl(data?.photos?.[0])}
          alt={data?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
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

  const navigate = useNavigate()
  return (
    <CardDrawer
      closeDrawer={onClose}
      title={
        <Box display='inline-flex'>
          <Image setImages={setImages} data={productData?.data?.data} />
          <Typography mt={0.5} ml={2} fontSize={28} variant='h2'>
            {productData?.data?.data?.name}
            <Typography display='flex' alignItems='center' color='bunker.400' mt={1} fontWeight={'500'}>
              {get(productData, 'data.data.retail_price')} сум
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
              onClick={() => navigate(`/products/edit/${productData?.data?.data.id}`)}
              startIcon={<FontAwesomeIcon width={15} icon={faPen} />}
              fullWidth
            >
              Редактировать
            </Button>
          </CheckAccess>
        </Box>
      }
    >
      <Box height={'50px'} />
      <SectionTitle grey>История продукта</SectionTitle>
      <ProductHistory id={id} />
      <Box height={'50px'} />
      <SectionTitle grey>Остатки</SectionTitle>

      <ProductRemainsHistory id={id} />
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
          { title: 'Код продукта', info: productData?.data?.data?.material_code },
          { title: 'Баркод', info: thousandDivider(productData?.data?.data?.barcode, '') },
          { title: 'Цена', info: thousandDivider(productData?.data?.data?.retail_price, 'сум') },
          { title: 'Производитель', info: productData?.data?.data?.manufacturer },
          { title: 'Время подготовки', info: dayjs(productData?.data?.data?.created_at).format('DD.MM.YYYY') },
          { title: 'Единицы измерения', info: productData?.data?.data?.unit_type?.unit_name },
          { title: 'Наименование товара', info: productData?.data?.data?.name },
          { title: 'Тип', info: productData?.data?.data?.type === 'BUCHET' ? 'Buchet' : 'Market' },
          { title: 'Описание', info: productData?.data?.data?.description, fullWidth: true },
          { title: 'Категории', info: productData?.data?.data?.categories?.map((el) => `${el?.nameRu}, `), fullWidth: true },
        ]}
      />
    </CardDrawer>
  )
}
