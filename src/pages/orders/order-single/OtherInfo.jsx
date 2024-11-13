import { Box, Typography } from '@mui/material'
import TextField from '../../../../components/Inputs/TextField'
import PostCardBackground from '../../../assets/icons/PostCardBackground'
import Label from '../../../../components/Label'
import { order_statuses } from '../../../assets/data/order-statuses'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'

export default function OtherInfo({ orderData, yandexCourirerInfo }) {
  const isExistDeliveryType = order_statuses.findIndex((el) => el.id === orderData.status) >= 6
  return (
    <Box>
      <Box width='100%' columnGap={3} alignItems='flex-end' display='inline-flex'>
        <TextField
          label='Тип доставки'
          name='type_delivery'
          value={
            isExistDeliveryType ? (orderData?.isDelivery ? (orderData?.isYandex ? 'Доставка с Яндекс' : 'Доставка с курьером') : 'Самовызов') : 'Неопределенный'
          }
          fullWidth
          disabled
          uncontrolled
        />
        <TextField label='Статус Яндекс' name='yandex_status' value={orderData?.yandexStatus || 'Неопределенный'} fullWidth disabled uncontrolled />
        {orderData?.courierPhone && (
          <a style={{ width: '100%', display: 'block' }} href={`tel:${orderData?.courierPhone}`}>
            <Label>Номер телефона курьера</Label>
            <Box marginTop={'8px'} padding={'16px'} width={'100%'} border='2px dashed' borderRadius={4} borderColor='grey.200'>
              <Typography variant='body1'>{formatPhoneNumber(`${orderData?.courierPhone}`)}</Typography>
            </Box>
          </a>
        )}
        <TextField label='Тип оплаты' name='type_delivery' value={orderData?.paymentType} fullWidth disabled uncontrolled />
      </Box>
      <Box width='100%' mt={3} columnGap={3} alignItems='flex-end' display='inline-flex'>
        <TextField label='Название местоположения' name='location_name' value={orderData?.savedLocation?.name} fullWidth disabled uncontrolled />
        <TextField label='Локации' name='location_name' value={orderData?.savedLocation?.location?.name} fullWidth disabled uncontrolled />
      </Box>
      <Box width='100%' mt={3} columnGap={3} alignItems='flex-end' display='inline-flex'>
        <TextField label='Код двери' name='door_code' value={orderData?.savedLocation?.door_code || 'Неопределенный'} fullWidth disabled uncontrolled />
        <TextField label='Квартира' name='flat' value={orderData?.savedLocation?.flat || 'Неопределенный'} fullWidth disabled uncontrolled />
        <TextField label='Этаж' name='floor' value={orderData?.savedLocation?.floor || 'Неопределенный'} fullWidth disabled uncontrolled />
        <TextField label='Подъезд' name='porch' value={orderData?.savedLocation?.location?.porch || 'Неопределенный'} fullWidth disabled uncontrolled />
      </Box>
      <Box width='100%' mt={3} columnGap={3} alignItems='flex-end' display='inline-flex'>
        <TextField
          label='Комментарий от клиента'
          name='comment_from_client'
          value={orderData?.someInformation || 'Неопределенный'}
          fullWidth
          disabled
          uncontrolled
        />
      </Box>
      {orderData?.products.length > 0 && (
        <Box width='100%' mt={3} flexDirection='column' display='inline-flex'>
          <Label mb={2}>Открытка</Label>
          {orderData?.products.map((product) => (
            <>
              {product?.postcards?.map((text) => (
                <Box sx={{ zoom: '1.3' }} position='relative'>
                  <Typography
                    sx={{
                      left: 28.85,
                      bottom: 25,
                      position: 'absolute',
                      bgcolor: 'grey.200',
                      color: 'grey.600',
                      py: 1,
                      px: 1.5,
                      borderRadius: '0 0 8px 8px',
                    }}
                    fontSize={14}
                    fontWeight={500}
                    mb={1}
                    width={473}
                  >
                    Название продукта - {product.productId.name}
                  </Typography>
                  <PostCardBackground />
                  <Typography
                    maxWidth={413}
                    top={110}
                    left={60}
                    position='absolute'
                    dangerouslySetInnerHTML={{ __html: text?.replaceAll('\n', '<br/>') || '' }}
                    color='#6c6c6c'
                    mb={1}
                    fontWeight={500}
                    fontSize={14}
                    lineHeight='17px'
                  />
                </Box>
              ))}
            </>
          ))}
        </Box>
      )}
      {orderData?.postcard && (
        <Box sx={{ zoom: '1.3' }} position='relative'>
          <PostCardBackground />
          <Typography
            maxWidth={413}
            top={110}
            left={60}
            position='absolute'
            dangerouslySetInnerHTML={{ __html: orderData?.postcard?.replaceAll('\n', '<br/>') || '' }}
            color='gray.600'
            mb={1}
            fontWeight={500}
            fontSize={14}
            lineHeight='17px'
          />
        </Box>
      )}
    </Box>
  )
}
