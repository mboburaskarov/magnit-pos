import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Drawer, Typography } from '@mui/material'
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
import { theme } from '../../../assets/theme'

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
    <Drawer
      anchor='right'
      sx={{
        '& .MuiDrawer-paper': {
          width: '660px',
          // padding: '40px',
          borderRadius: '24px 0 0 24px',
          // backgroundColor: theme.palette.background.default,
        },
      }}
      onClose={() => onClose(false)}
      open={!!id}
      isLoading={productDataLoading && isFetchingproductData}
    >
      <Box display='inline-flex' pt={'40px'} pb={'20px'} px={'40px'}>
        <Image setImages={setImages} data={productData?.data?.data} />
        <Typography mt={0.5} ml={2} fontSize={24} color={'bunker.950'} lineHeight={'32px'} fontWeight={'700'}>
          {productData?.data?.data?.name}
          <Typography display='flex' alignItems='center' color='orange.500' mt={1} fontWeight={'500'}>
            {get(productData, 'data.data.retail_price')} сум
          </Typography>
        </Typography>
      </Box>
      <Box borderBottom={'1px solid'} borderColor={'bunker.100'} height={'50px'} />
      <Box px={'40px'} my={'20px'}>
        <SectionTitle grey>История импорта</SectionTitle>
        <ProductHistory id={id} />
      </Box>
      <Box borderBottom={'1px solid'} borderColor={'bunker.100'} height={'50px'} />

      <Box px={'40px'} my={'20px'}>
        <SectionTitle grey>Остатки</SectionTitle>

        <ProductRemainsHistory id={id} />
      </Box>
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
      <Box borderBottom={'1px solid'} borderColor={'bunker.100'} height={'50px'} />
      <Box px={'40px'} my={'20px'} mb={'80px'}>
        <SectionTitle grey>Доп. информация</SectionTitle>
        <DrawerInfoBox
          infoData={[
            { title: 'Код продукта', info: productData?.data?.data?.material_code },
            { title: 'Баркод', info: thousandDivider(productData?.data?.data?.barcode, '') },
            { title: 'Цена', info: thousandDivider(productData?.data?.data?.retail_price, 'сум') },
            { title: 'Производитель', info: productData?.data?.data?.manufacturer },
            { title: 'Сумма бонуса', info: thousandDivider(productData?.data?.data?.bonus_amount, 'сум') },
            { title: 'Бонусный процент', info: thousandDivider(productData?.data?.data?.bonus_percent, '%') },
            { title: 'Время подготовки', info: dayjs(productData?.data?.data?.created_at).format('DD.MM.YYYY') },
            { title: 'Единицы измерения', info: productData?.data?.data?.unit_type?.unit_name },
            { title: 'Наименование товара', info: productData?.data?.data?.name },
            { title: 'Тип', info: productData?.data?.data?.type === 'BUCHET' ? 'Buchet' : 'Market' },
            { title: 'Описание', info: productData?.data?.data?.description, fullWidth: true },
            { title: 'Категории', info: productData?.data?.data?.categories?.map((el) => `${el?.nameRu}, `), fullWidth: true },
          ]}
        />
      </Box>
      <Box
        sx={{
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
        }}
        bgcolor={'#fff'}
        position={'fixed'}
        bottom={'0'}
        p={'20px'}
        columnGap={2}
        width='660px'
        display='inline-flex'
      >
        <CheckAccess id={'product-edit'}>
          <Button
            sx={{
              height: '48px',
            }}
            color='secondary'
            onClick={() => navigate(`/products/edit/${productData?.data?.data.id}`)}
            startIcon={<FontAwesomeIcon width={15} icon={faPen} />}
            fullWidth
          >
            Редактировать
          </Button>
        </CheckAccess>
      </Box>
    </Drawer>
  )
}
