import { Box, Button, Typography } from '@mui/material'
import CardDrawer from '../../../components/Drawers/CardDrawer'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import dayjs from 'dayjs'
import { order_statuses } from '../../assets/data/order-statuses'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import OrderImageBox from './OrderImageBox'
import { useState } from 'react'
import CompareImageGallery from '../../../components/CompareImageGallery'
import ImageGallery from '../../../components/ImageGallery'
import SectionTitle from '../../../components/SectionTitle'
import OrderHistory from './order-single/OrderHistory'
import ProductsInOrders from './order-single/ProductsInOrders'
import DrawerInfoBox from '../../../components/Drawers/DrawerInfoBox'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
import ConfirmDialog from '../../../components/ConfirmDialog'
import BigWarningIcon from '../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import BigWarningCircleIcon from '../../assets/icons/BigWarningCircleIcon'
import { error, success } from '../../../utils/toast'
import TextField from '../../../components/Inputs/TextField'
import MapShow from '../../../components/MapShow'
import Label from '../../../components/Label'
import PostCardBackground from '../../assets/icons/PostCardBackground'
// import { useForm } from 'react-hook-form'
import BigTickIcon from '../../assets/icons/BigTickIcon'

const navigteOnClick = (phoneNumber) => {
  const navtel = document.createElement('a')
  navtel.href = `tel:${phoneNumber}`
  navtel.click()
  navtel.remove()
}
export default function OrderDrawer({ isOpen: order, onClose, refetch }) {
  const { _id } = order || {}
  const navigate = useNavigate()
  const [openCompareGallery, setOpenCompareGallery] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [rejectComment, setRejectComment] = useState()
  const [openImageGallery, setOpenImageGallery] = useState(null)
  const {
    data: orderData,
    isLoading: orderDataLoading,
    isFetching: isFetchingOrderData,
  } = useQuery(['orderData', _id], () => requests.getSingleOrder(_id), { enabled: !!_id })

  const claimId = orderData?.data?.claimId
  const service = order?.deliveryService
  const { data: deliveryInfo } = useQuery(['deliveryInfo', _id], () => requests.getYandexDeliveryInfo(_id), { enabled: !!_id })
  const { data: yandexCourirerInfo } = useQuery(['deliveryCourirerInfo', claimId, service], () => requests.getYandexCourirerInfo({ claimId, service }), {
    enabled: !!order && !!claimId && !!service,
  })
  const { data: yandexTracking, refetch: refetchYandexTracking } = useQuery(
    ['yandexTracking', claimId, service],
    () => requests.getYandexTracking({ claimId, service }),
    {
      enabled: !!order && !!claimId && !!service,
    }
  )

  const { mutate: acceptOrder, isLoading: isAcceptingOrder } = useMutation(requests.acceptOrder, {
    onSuccess: () => {
      setOpenConfirmDialog(null)
      onClose()
      refetch()
      success('Заказ успешно принят!')
    },
    onError: (err) => {
      refetch()
      error('Ошибка при принятии заказа!')
      console.log('err', err)
    },
  })
  const { mutate: cancelOrder, isLoading: isCancellingOrder } = useMutation(requests.cancelOrder, {
    onSuccess: () => {
      setOpenConfirmDialog(null)
      onClose()
      refetch()
      success('Заказ успешно отклонен!')
    },
    onError: (err) => {
      refetch()
      error('Ошибка при отмене заказа!')
      console.log('err', err)
    },
  })
  const { mutate: finishOrder, isLoading: isFinishingOrder } = useMutation(requests.finishOrder, {
    onSuccess: () => {
      refetch()
      setOpenConfirmDialog(null)
      onClose()
      success('Заказ успешно выполнен')
    },
    onError: (err) => {
      refetch()
      error('Ошибка при завершении заказа!')
      console.log('err', err)
    },
  })

  const shopPoints = [orderData?.data?.shop?.location?.lat, orderData?.data?.shop?.location?.long]
  const driverPoints = [yandexTracking?.data?.position?.lat, yandexTracking?.data?.position?.lon]
  const receiverPoints = [orderData?.data?.savedLocation?.location?.lat, orderData?.data?.savedLocation?.location?.long]
  const [orderDoneNote, setOrderDoneNote] = useState('')
  return (
    <>
      <CardDrawer
        closeDrawer={onClose}
        title={
          <Box display='inline-flex'>
            <OrderImageBox
              small
              setOpenCompareGallery={setOpenCompareGallery}
              count={orderData?.data?.orderPicture?.length}
              url={orderData?.data?.orderPicture?.length ? orderData?.data?.orderPicture?.[0] : ''}
            />

            <Typography mt={0.5} ml={2} fontSize={28} variant='h2'>
              Заказ {dayjs(orderData?.data?.createdAt).format('DD.MM.YYYY HH:mm')}
              <Typography color='gray.400' mt={1} variant='body1'>
                Cтатус • {order_statuses.find((el) => el.id === orderData?.data?.status)?.name}
              </Typography>
            </Typography>
          </Box>
        }
        isOpen={!!_id}
        isLoading={orderDataLoading && isFetchingOrderData}
        actions={
          <Box columnGap={2} width='100%' display='inline-flex'>
            <Button onClick={() => navigate(`/orders/${orderData?.data._id}`)} startIcon={<FontAwesomeIcon icon={faEye} />} fullWidth>
              Посмотреть
            </Button>
            {orderData?.data?.status === 'CHECKING' && (
              <>
                <Button color='secondary' onClick={() => setOpenConfirmDialog('approve')} startIcon={<FontAwesomeIcon icon={faCheck} />} fullWidth>
                  Одобрить
                </Button>
                <Button onClick={() => setOpenConfirmDialog('cancel')} color='red' startIcon={<FontAwesomeIcon icon={faXmark} />} fullWidth>
                  Отклонять
                </Button>
              </>
            )}
            {(orderData?.data?.status === 'IN_DELIVERY' || orderData?.data?.status === 'DELIVERED') && (
              <>
                <Button color='secondary' onClick={() => setOpenConfirmDialog('approve')} startIcon={<FontAwesomeIcon icon={faCheck} />} fullWidth>
                  Завершить
                </Button>
              </>
            )}
          </Box>
        }
      >
        <SectionTitle gray>История заказа</SectionTitle>
        <OrderHistory id={_id} />
        <SectionTitle mt={6} gray>
          Кол-во продуктов
        </SectionTitle>
        <ProductsInOrders setImages={setOpenImageGallery} products={orderData?.data?.products} />
        <SectionTitle mt={6} gray>
          Доп. информация
        </SectionTitle>
        <DrawerInfoBox
          infoData={[
            { title: 'Имя клиента', info: orderData?.data?.client?.fullName },
            {
              title: 'Телефон клиента',
              info: formatPhoneNumber('+' + orderData?.data?.client?.phone),
              onBoxCLick: () => {
                navigteOnClick('+' + orderData?.data?.client?.phone)
              },
            },
            { title: 'Имя получателя', info: orderData?.data?.receiver?.fullName },
            {
              title: 'Телефон получателя',
              info: formatPhoneNumber('+' + orderData?.data?.receiver?.phoneNumber),
              onBoxCLick: () => {
                navigteOnClick('+' + orderData?.data?.receiver?.phoneNumber)
              },
            },
            { title: 'Время создания', info: dayjs(orderData?.data?.createdAt).format('DD.MM.YYYY HH:mm') },
            { title: 'Время забирания', info: dayjs(orderData?.data?.deliveryTime).subtract(deliveryInfo?.data?.eta, 'minute').format('DD.MM.YYYY HH:mm') },
            { title: 'Срок доставки', info: dayjs(orderData?.data?.deliveryTime).format('DD.MM.YYYY HH:mm') },
            { title: 'Время выполнения', info: orderData?.data?.doneAt ? dayjs(orderData?.data?.doneAt).format('DD.MM.YYYY HH:mm') : 'Заказ не завершен' },
            { title: 'Комментарий от клиента', info: orderData?.someInformation || '-', fullWidth: true },
          ]}
        />
        {yandexTracking?.data && (
          <Box mb={4}>
            <SectionTitle noWrap withLine>
              <a target='_blank' rel='noreferrer' href={yandexTracking?.data?.route_points?.[1]?.sharing_link}>
                <Typography color='green.500' variant='h3'>
                  Информация о доставке
                </Typography>
              </a>
            </SectionTitle>
            <MapShow
              height={350}
              refetchData={() => refetchYandexTracking()}
              onlyTwoPoint={orderData?.data?.status === 'IN_DELIVERY'}
              points={orderData?.data?.status === 'IN_DELIVERY' ? [driverPoints, receiverPoints] : [driverPoints, shopPoints, receiverPoints]}
              name={'Телефон яндекс курьера: ' + (yandexCourirerInfo?.data?.phone ? formatPhoneNumber(yandexCourirerInfo?.data?.phone) : '-')}
            />
          </Box>
        )}
        {orderData?.data?.products.length > 0 && (
          <Box width='100%' mb={1} flexDirection='column' display='inline-flex'>
            <Label mb={1}>Открытка</Label>

            {orderData?.data?.products.map((product) => (
              <>
                {product?.postcards?.map((text, ind) => (
                  <Box key={ind} sx={{ zoom: '1' }} position='relative'>
                    <Typography
                      sx={{
                        left: 29,
                        bottom: 25,
                        position: 'absolute',
                        bgcolor: 'gray.200',
                        color: 'gray.600',
                        py: 1,
                        px: 1.5,
                        borderRadius: '0 0 8px 8px',
                      }}
                      fontSize={14}
                      fontWeight={500}
                      mb={1}
                      width={473}
                    >
                      Название продукта - {product?.productId?.name}
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
        {orderData?.data?.postcard && (
          <Box sx={{ zoom: '1' }} position='relative'>
            <PostCardBackground />
            <Typography
              maxWidth={413}
              top={110}
              left={60}
              position='absolute'
              dangerouslySetInnerHTML={{ __html: orderData?.data?.postcard.replaceAll('\n', '<br/>') || '' }}
              color='gray.600'
              mb={1}
              fontWeight={500}
              fontSize={14}
              lineHeight='17px'
            />
          </Box>
        )}
      </CardDrawer>

      <CompareImageGallery
        backgroundBlack
        open={openCompareGallery}
        setOpen={setOpenCompareGallery}
        imagesToCompareArr={orderData?.data?.products?.map((el) => el?.productId.files?.length && el?.productId.files?.[0])}
        imagesArr={orderData?.data?.orderPicture}
      />
      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery?.data} />

      <ConfirmDialog
        open={openConfirmDialog === 'approve'}
        setOpen={setOpenConfirmDialog}
        icon={orderData?.data?.status === 'IN_DELIVERY' || orderData?.data?.status === 'DELIVERED' ? <BigTickIcon /> : <BigWarningIcon />}
        title={orderData?.data?.status === 'IN_DELIVERY' || orderData?.data?.status === 'DELIVERED' ? 'Завершить заказ?' : 'Принять заказ?'}
        desc={
          orderData?.data?.status === 'IN_DELIVERY' || orderData?.data?.status === 'DELIVERED'
            ? 'Вы действительно хотите завершить заказ? Вы не можете отменить этот процесс.'
            : 'Вы проверили заказ все детали и фотографии? Вы действительно хотите принять'
        }
        actions={
          <Box>
            {orderData?.data?.status !== 'IN_DELIVERY' && orderData?.data?.status !== 'DELIVERED' && (
              <Box>
                <TextField multiline fullWidth placeholder='Введите название заметки' value={orderDoneNote} setValue={setOrderDoneNote} uncontrolled />
              </Box>
            )}
            <Box mt={2} justifyContent='center' display='flex'>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isAcceptingOrder || isFinishingOrder}
                onClick={() => {
                  if (orderData?.data?.status === 'IN_DELIVERY' || orderData?.data?.status === 'DELIVERED') {
                    finishOrder({ orderId: orderData?.data?._id, doneComment: orderDoneNote || '' })
                  } else acceptOrder({ orderId: orderData?.data?._id })
                }}
              >
                Да
              </LoadingButton>
            </Box>
          </Box>
        }
      />
      <ConfirmDialog
        open={openConfirmDialog === 'cancel'}
        setOpen={setOpenConfirmDialog}
        icon={<BigWarningCircleIcon />}
        title='Отклонить заказ?'
        desc='Вы уверены, что хотите отклонить этот заказ? Вы проверили все продукты заказа и информацию?'
        actions={
          <Box width='100%' flexDirection='column' display='flex'>
            <TextField required mini value={rejectComment} setValue={setRejectComment} uncontrolled fullWidth placeholder='Введите комментарий' />
            <Box mt={2} justifyContent='center' display='inline-flex'>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isCancellingOrder}
                onClick={() => cancelOrder({ orderId: orderData?.data?._id, rejectedComment: rejectComment || '' })}
              >
                Да
              </LoadingButton>
            </Box>
          </Box>
        }
      />
    </>
  )
}
