import { Box, Button, Container, IconButton, Typography } from '@mui/material'
import Header from '../../../../components/Header'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import LoadingContainer from '../../../../components/LoadingContainer'
import SectionTitle from '../../../../components/SectionTitle'
import { useRef, useState } from 'react'
import CompareImageGallery from '../../../../components/CompareImageGallery'
import MainInfo from './MainInfo'
import { order_statuses } from '../../../assets/data/order-statuses'
import ShopInfo from './ShopInfo'
import ProductsInOrders from './ProductsInOrders'
import OtherInfo from './OtherInfo'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { error, success } from '../../../../utils/toast'
import BigWarningCircleIcon from '../../../assets/icons/BigWarningCircleIcon'
import { LoadingButton } from '@mui/lab'
import TextField from '../../../../components/Inputs/TextField'
import ImageGallery from '../../../../components/ImageGallery'
import MapShow from '../../../../components/MapShow'
import { useMemo } from 'react'
import OrderEditDialog from './OrderEditDialog'
import OrderNote from '../OrderNote'
import OrderNoteIcon from '../../../assets/icons/OrderNoteIcon'
import StyledTooltip from '../../../../components/StyledTooltip'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
// import { useForm } from 'react-hook-form'
import CheckAccess from '../../../../components/CheckAccess'
import ShopWarning from '../ShopWarning'

export default function OrderSinglePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isOrderCreateNote, setIsOrderCreateNote] = useState(false)
  const [openCompareGallery, setOpenCompareGallery] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [rejectComment, setRejectComment] = useState()
  const [openImageGallery, setOpenImageGallery] = useState(null)
  const [orderNoteInputValue, setOrderNoteInputValue] = useState('')
  const [orderDoneNote, setOrderDoneNote] = useState('')
  const orderNoteRef = useRef(null)

  const { data: orderData, isLoading: orderDataLoading } = useQuery(['orderData', id], () => requests.getSingleOrder(id), {
    enabled: !!id,
    onError: () => {
      navigate('/orders/all')
      error('Ошибка при загрузке заказа!')
    },
    retry: 1
  })
  const claimId = orderData?.data?.claimId
  const { data: deliveryInfo } = useQuery(['deliveryInfo', id], () => requests.getYandexDeliveryInfo(id), { enabled: !!orderData?.data?.id })
  const { data: yandexCourirerInfo } = useQuery(['yandexCourirerInfo', claimId], () => requests.getYandexCourirerInfo(claimId), { enabled: !!claimId })
  const { data: yandexTracking, refetch: refetchYandexTracking } = useQuery(['yandexTracking', claimId], () => requests.getYandexTracking(claimId), {
    enabled: !!claimId,
  })
  const { data: shopProblems } = useQuery(
    ['shopProblems', orderData?.data?.orderNumber],
    () =>
      requests.getShopProblems({
        orderNumber: orderData?.data?.orderNumber,
        limit: 1000,
        fromDate: '2023-01-01T00:00:00.000Z',
      }),
    { enabled: !!orderData?.data?.orderNumber }
  )

  const { mutate: acceptOrder, isLoading: isAcceptingOrder } = useMutation(requests.acceptOrder, {
    onSuccess: () => {
      navigate('/orders/all')
      success('Заказ успешно принят!')
    },
    onError: (err) => {
      error('Ошибка при принятии заказа!')
      console.log('err', err)
    },
  })
  const { mutate: cancelOrder, isLoading: isCancellingOrder } = useMutation(requests.cancelOrder, {
    onSuccess: () => {
      navigate('/orders/all')
      success('Заказ успешно отклонен!')
    },
    onError: (err) => {
      error('Ошибка при отмене заказа!')
      console.log('err', err)
    },
  })
  const { mutate: finishOrder, isLoading: isFinishingOrder } = useMutation(requests.finishOrder, {
    onSuccess: () => {
      navigate('/orders/all')
      success('Заказ успешно выполнен')
    },
    onError: (err) => {
      error('Ошибка при завершении заказа!')
      console.log('err', err)
    },
  })

  const { data: orderNotes, refetch: refetchOrderNotes } = useQuery(['orderNote', id], () => requests.getOrderNote({ orderId: id }), {
    enabled: !!orderData?.data?.id,
  })

  const { mutate: createOrderNote } = useMutation(requests.createOrderNote, {
    onSuccess: () => {
      setIsOrderCreateNote(false)
      success('Заголовок успешно создан!')

      refetchOrderNotes()
    },
    onError: (err) => {
      error('Ошибка при создании заголовка!')
      console.log('err', err)
    },
  })

  const handleCreateOrderNote = () => {
    if (orderNoteInputValue) {
      createOrderNote({
        orderId: id,
        note: orderNoteInputValue,
      })
      setOrderNoteInputValue('')
      setIsOrderCreateNote(false)
      return
    }
    orderNoteRef.current.focus()
  }

  const shopPoints = [orderData?.data?.shop?.location?.lat, orderData?.data?.shop?.location?.long]
  const driverPoints = [yandexTracking?.data?.position?.lat, yandexTracking?.data?.position?.lon]
  const receiverPoints = [orderData?.data?.savedLocation?.location?.lat, orderData?.data?.savedLocation?.location?.long]

  const checkOrderStatus = useMemo(() => {
    const orderStatus = orderData?.data?.status
    if (orderStatus === 'PAID' || orderStatus === 'CHECKING' || orderStatus === 'IN_PROGRESS' || orderStatus === 'APPROVED') {
      return true
    }
    return false
  }, [orderData?.data?.status])

  return (
    <LoadingContainer readyState={!orderDataLoading}>
      <Box pb={10}>
        <Header
          buttonText={orderData?.data?.status === 'CHECKING' ? 'Одобрить' : 'Завершить'}
          cancelButtonLabel='Отклонять'
          backIcon
          backHref='/orders/all'
          customButton={
            <>
              <Box ml={2}>
                <CheckAccess id={'order-note'}>
                  {' '}
                  <StyledTooltip title='Добавить заметку'>
                    <IconButton
                      sx={{
                        borderRadius: 3,
                        padding: '14px',
                        background: '#119676',
                        ':hover': {
                          background: '#0F8064',
                        },
                      }}
                      onClick={() => {
                        setIsOrderCreateNote(true)
                      }}
                    >
                      <OrderNoteIcon color={'#fff'} />
                    </IconButton>
                  </StyledTooltip>
                </CheckAccess>
              </Box>
              {orderData?.data?.status !== 'DONE' ? (
                <>
                  <CheckAccess id={'order-edit'}>
                    <Button onClick={() => setOpenConfirmDialog('edit')} sx={{ minWidth: 132, ml: 1.5 }} size='small'>
                      Изменить
                    </Button>
                  </CheckAccess>
                </>
              ) : null}
            </>
          }
          text={'Заказ #' + orderData?.data?.orderNumber}
          noCancel={orderData?.data?.status !== 'CHECKING'}
          noPrimaryBtn={orderData?.data?.status === 'CHECKING' ? false : orderData?.data?.status === 'IN_DELIVERY' ? false : true}
          description={`Cтатус • ${order_statuses.find((el) => el.id === orderData?.data?.status)?.name}`}
          onSubmit={() => setOpenConfirmDialog('approve')}
          cancel={() => setOpenConfirmDialog('cancel')}
        />
        <Container>
          <SectionTitle noWrap withLine>
            Основная информация
          </SectionTitle>
          <MainInfo deliveryInfo={deliveryInfo} orderData={orderData} openCompareGallery={openCompareGallery} setOpenCompareGallery={setOpenCompareGallery} />
          <SectionTitle mt={4} noWrap withLine>
            Кол-во продуктов
          </SectionTitle>
          <ProductsInOrders isDataLoading={orderDataLoading} setImages={setOpenImageGallery} products={orderData?.data?.products} />

          <SectionTitle mt={4} noWrap withLine>
            Информация o магазине
          </SectionTitle>
          <ShopInfo orderData={orderData} />
          {yandexTracking?.data && (
            <>
              <SectionTitle mt={4} noWrap withLine>
                <a target='_blank' rel='noreferrer' href={yandexTracking?.data?.route_points?.[1]?.sharing_link}>
                  <Typography color='green.500' variant='h3'>
                    Информация о доставке
                  </Typography>
                </a>
              </SectionTitle>
              <MapShow
                onlyTwoPoint={orderData?.data?.status === 'IN_DELIVERY'}
                points={orderData?.data?.status === 'IN_DELIVERY' ? [driverPoints, receiverPoints] : [driverPoints, shopPoints, receiverPoints]}
                refetchData={() => refetchYandexTracking()}
                name='Направление доставки'
              />
            </>
          )}
          <SectionTitle mt={4} noWrap withLine>
            Остальное информация
          </SectionTitle>
          <OtherInfo yandexCourirerInfo={yandexCourirerInfo?.data} orderData={orderData?.data} />
          {orderData?.data?.status === 'DONE' && orderData?.data?.doneComment && (
            <>
              <SectionTitle mt={3} noWrap withLine>
                Заметка о выполнении заказа
              </SectionTitle>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <OrderNote
                  data={{
                    _id: orderData?.data?._id,
                    note: orderData?.data?.doneComment,
                    createdAt: orderData?.data?.doneAt,
                  }}
                />
              </Box>
            </>
          )}
          {orderNotes?.data?.orders?.length && (
            <>
              <SectionTitle mt={3} noWrap withLine>
                Заметки
              </SectionTitle>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                {orderNotes?.data?.orders?.map((el) => (
                  <>
                    <OrderNote data={el} />
                  </>
                ))}
              </Box>
            </>
          )}
          {shopProblems?.data?.shopProblems?.length && (
            <>
              <SectionTitle mt={3} noWrap withLine>
                Предупреждения магазину
              </SectionTitle>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                {shopProblems?.data?.shopProblems?.map((el) => (
                  <>
                    <ShopWarning data={el} />
                  </>
                ))}
              </Box>
            </>
          )}
        </Container>
      </Box>
      <CompareImageGallery
        open={openCompareGallery}
        setOpen={setOpenCompareGallery}
        imagesToCompareArr={orderData?.data?.products?.map((el) => el.productId.files?.[0])}
        imagesArr={orderData?.data?.orderPicture}
      />
      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery?.data} />
      <ConfirmDialog
        open={openConfirmDialog === 'approve'}
        setOpen={setOpenConfirmDialog}
        icon={<BigWarningIcon />}
        title='Принять заказ?'
        desc='Вы проверили заказ все детали и фотографии? Вы действительно хотите принять. Вы действительно хотите принять'
        actions={
          <Box>
            <Box>
              <TextField multiline fullWidth placeholder='Введите название заметки' value={orderDoneNote} setValue={setOrderDoneNote} uncontrolled />
            </Box>
            <Box mt={2} justifyContent='center' display='flex'>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isAcceptingOrder || isFinishingOrder}
                onClick={() =>
                  orderData?.data?.status === 'IN_DELIVERY'
                    ? finishOrder({ orderId: orderData?.data?._id, doneComment: orderDoneNote || '' })
                    : acceptOrder({ orderId: orderData?.data?._id })
                }
              >
                Да
              </LoadingButton>
            </Box>
          </Box>
        }
      />
      <OrderEditDialog
        checkOrderStatus={checkOrderStatus}
        orderId={id}
        isOpen={openConfirmDialog === 'edit'}
        orderData={orderData}
        setIsOpen={setOpenConfirmDialog}
      />
      <ConfirmDialog
        open={openConfirmDialog === 'cancel'}
        setOpen={setOpenConfirmDialog}
        icon={<BigWarningCircleIcon />}
        title='Отклонить заказ?'
        desc='Вы уверены, что хотите отклонить этот заказ? Вы проверили все продукты заказа и информацию?'
        actions={
          <Box width='100%' flexDirection='column' display='flex'>
            <TextField mini value={rejectComment} setValue={setRejectComment} uncontrolled fullWidth placeholder='Введите комментарий' />
            <Box mt={2} justifyContent='center' display='inline-flex'>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isCancellingOrder}
                onClick={() => cancelOrder({ orderId: orderData?.data?._id, rejectedComment: rejectComment })}
              >
                Да
              </LoadingButton>
            </Box>
          </Box>
        }
      />
      <StyledDialog
        open={isOrderCreateNote}
        title={'Введите название заметки'}
        buttonLabel={'Сохранить'}
        customOnSubmit={() => handleCreateOrderNote()}
        onClose={() => setIsOrderCreateNote(false)}
      >
        <Box p={7} pt={5}>
          <TextField
            required
            inputRef={orderNoteRef}
            uncontrolled
            multiline
            value={orderNoteInputValue}
            setValue={setOrderNoteInputValue}
            fullWidth
            placeholder='Введите название заметки'
          />
        </Box>
      </StyledDialog>
    </LoadingContainer>
  )
}
