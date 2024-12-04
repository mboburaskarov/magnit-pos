import SelectSimple from '../../../../components/Select/SelectSimple'
import RightArrowSmallIcon from './../../../assets/icons/RightArrowSmallIcon'
import { Box, Typography, TextField as MuiTextField, Container, Button } from '@mui/material'
import TextField from '../../../../components/Inputs/TextField'
import thousandDivider from '../../../../utils/thousandDivider'
import { useEffect, useMemo, useState } from 'react'
import getImageUrl from '../../../../utils/getImageUrl'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useNavigate } from 'react-router-dom'
import { error, success } from '../../../../utils/toast'
import Label from '../../../../components/Label'
import Header from '../../../../components/Header'
import { order_statuses } from '../../../assets/data/order-statuses'
import SectionTitle from '../../../../components/SectionTitle'
import MapSelect from '../../../../components/MapSelect'
import InputDatePicker from '../../../../components/Inputs/InputDatePicker'
import dayjs from 'dayjs'
import { countries } from '../../../assets/data/countries'
import PhoneNumber from '../../../../components/Inputs/PhoneNumber'

export default function OrderEditDialog({ isOpen, orderData, setIsOpen, orderId, checkOrderStatus }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [shop, setShop] = useState(null)
  const [deliveryTime, setDeliveryTime] = useState(null)
  const [deliveryAddress, setDeliveryAddress] = useState(null)
  const [country, setCountry] = useState(countries[0])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [name, setName] = useState('')

  const shopId = useMemo(() => {
    return { dbId: shop?._id }
  }, [shop])
  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 1000, offset: 0 }))
  const { data: productsList, refetch } = useQuery('productsList', () => requests.getAllProducts(shopId))

  const { mutate: editOrder } = useMutation(requests.editOrder, {
    onSuccess: () => {
      navigate('/orders/all')
      success('Заказ успешно изменен (cмена магазина)')
    },
    onError: (err) => {
      error('Ошибка при изменении заказа (cмена магазина)!')
      console.log('err', err)
    },
  })
  const { mutate: reOrderCourier } = useMutation(requests.reOrderCourier, {
    onSuccess: () => {
      navigate('/orders/all')
      success('Заказ успешно изменен (адресная информация)')
    },
    onError: (err) => {
      error('Ошибка при изменении заказа (адресная информация)!')
      console.log('err', err)
    },
  })
  const isSameAddress = useMemo(
    () =>
      JSON.stringify([orderData?.data?.savedLocation?.location?.lat, orderData?.data?.savedLocation?.location?.long]) ===
      JSON.stringify(deliveryAddress?.points),
    [orderData?.data?.savedLocation?.location?.lat, orderData?.data?.savedLocation?.location?.long, deliveryAddress?.points]
  )

  useEffect(() => {
    refetch()
    setProducts([])
  }, [shop])

  useEffect(() => {
    orderData?.data?.products?.map((_, index) => {
      setProducts((product) => {
        product[index] = {
          productDetails: undefined,
          amount: '1',
        }

        return product
      })
    })
  }, [])

  const editDone = () => {
    const isSameDate =
      deliveryTime !== null ? dayjs(deliveryTime).format('YYYY-MM-DD hh:mm') === dayjs(orderData?.data?.deliveryTime).format('YYYY-MM-DD hh:mm') : true
    const isReOrderDisabled = isSameDate && isSameAddress

    if (name || phoneNumber) {
      const cleanedPhoneNumber = phoneNumber?.replace(/[X() ]/g, '')
      const phoneLengthIsValid = cleanedPhoneNumber?.length === 9

      if (!name || !phoneLengthIsValid) {
        return error('Пожалуйста, заполните обязательные поля')
      }
    }

    const productIds = products.map((product) => {
      return { productId: product?.productDetails?._id, amount: parseInt(product?.amount) }
    })
    editOrder({
      orderId,
      shopId: shop?._id,
      productIds: productIds.filter((item) => item.productId !== undefined),
      personalInformation:
        phoneNumber?.replace(/[X() ]/g, '').length === 9 && name
          ? {
              fullName: name,
              phoneNumber: country.dial_code + phoneNumber?.replace(/[X() ]/g, ''),
            }
          : undefined,
    })
    if (!isReOrderDisabled) {
      reOrderCourier({
        orderId: orderId,
        ...(!isSameDate && { yandexDueDate: dayjs(deliveryTime) }),
        ...(!isSameAddress && {
          location: {
            name: deliveryAddress.name,
            long: deliveryAddress?.points?.[1],
            lat: deliveryAddress?.points?.[0],
          },
        }),
      })
    }
  }
  return (
    <Box
      display={isOpen ? 'block' : 'none'}
      top={0}
      left={0}
      right={0}
      bottom={0}
      position={isOpen ? 'fixed' : 'relative'}
      width='100vw'
      height='100vh'
      sx={{ zIndex: isOpen ? 1200 : -1, bgcolor: 'white' }}
    >
      <Header
        buttonText={orderData?.data?.status === 'CHECKING' ? 'Одобрить' : 'Завершить'}
        backIcon
        backHref='/orders/all'
        customButton={
          <>
            <Button onClick={() => setIsOpen(null)} sx={{ minWidth: 132 }} size='small' color='error'>
              Отменить
            </Button>
            <Button onClick={editDone} sx={{ minWidth: 132, ml: 1.5 }} size='small'>
              Применить
            </Button>
          </>
        }
        text={'Заказ #' + orderData?.data?.orderNumber}
        description={`Cтатус • ${order_statuses.find((el) => el.id === orderData?.data?.status)?.name}`}
        noPrimaryBtn
      />
      <Box height='100%' sx={{ overflow: 'scroll', height: 'calc(100vh - 132px)', mt: '156px !important' }} mb={7} pb={8}>
        <Container>
          <SectionTitle noWrap withLine>
            Сменить магазин
          </SectionTitle>
          <Label mb={1}>Магазин</Label>
          <Box mb={2.5} gap={1} display={'flex'} alignItems={'center'}>
            <TextField dashed fullWidth disabled uncontrolled value={orderData?.data?.shop?.name} />
            <Box>
              <RightArrowSmallIcon />
            </Box>
            <SelectSimple
              id='shop'
              fullWidth
              minWidth={'auto'}
              name='shop'
              placeholder={'Выберите магазин'}
              uncontrolled
              options={shopList?.data?.shops?.filter((item) => item?.name !== orderData?.data?.shop?.name)}
              value={shop}
              disabled={!checkOrderStatus}
              dashed={!checkOrderStatus}
              onChange={(e) => setShop(e)}
            />
            <img
              src={shop === null ? getImageUrl(orderData?.data?.shop?.mainPicture) : getImageUrl(shop?.mainPicture)}
              alt='shop'
              style={{ width: '56px', borderRadius: '16px', border: '2px solid', borderColor: '#EEE', height: '56px', objectFit: 'cover' }}
            />
          </Box>
          <Label mb={1}>{orderData?.data?.products.length === 1 ? 'Товар' : 'Товары'}</Label>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            {orderData?.data?.products?.map((item, index) => {
              const productsofShop = productsList?.data?.products
              return (
                <Box gap={1} display={'flex'} alignItems={'center'} key={item.productId._id}>
                  <TextField dashed fullWidth disabled uncontrolled value={item.productId.name} />
                  <Box>
                    <RightArrowSmallIcon />
                  </Box>
                  <>
                    <SelectSimple
                      disabled={!checkOrderStatus || !shop}
                      dashed={!checkOrderStatus}
                      id='products'
                      fullWidth
                      minWidth={'auto'}
                      name='products'
                      placeholder={'Выберите товар'}
                      getOptionLabel={(e) => (
                        <Typography variant='inherit'>
                          {e.name} {thousandDivider(e.cost) + ' сум'}
                        </Typography>
                      )}
                      uncontrolled
                      menuPlacement={index > 1 ? 'top' : 'bottom'}
                      options={productsofShop}
                      value={products[index]?.productDetails}
                      onChange={(selectedProduct) => {
                        setProducts((product) => {
                          product[index] = {
                            productDetails: selectedProduct,
                            amount: '1',
                          }
                          return [...product]
                        })
                      }}
                    />
                  </>
                  <MuiTextField
                    type='text'
                    sx={{ border: '2px solid', width: '120px', height: 56, borderColor: 'gray.200', borderRadius: '16px' }}
                    disabled={!shop || !products[index]?.productDetails}
                    size='small'
                    value={products[index]?.amount}
                    defaultValue={1}
                    onChange={(newAmount) => {
                      setProducts((product) => {
                        product[index].amount = newAmount.target.value
                        return [...product]
                      })
                    }}
                  />
                </Box>
              )
            })}
          </Box>
          <SectionTitle mt={3} noWrap withLine>
            Изменить информацию о пользователе
          </SectionTitle>
          <Box display={'flex'} gap={2} flexDirection={'column'}>
            <PhoneNumber
              placeholder='Введите номер телефона'
              label='Номер телефона'
              secondary
              fullWidth
              country={country}
              uncontrolled
              setCountry={setCountry}
              setValue={setPhoneNumber}
            />
            <TextField uncontrolled label={'Имя'} fullWidth placeholder={'Введите имя пользователя'} value={name} onChange={(e) => setName(e.target.value)} />
          </Box>
          <SectionTitle mt={3} noWrap withLine>
            Изменить информацию о доставке
          </SectionTitle>
          <Label mb={1}>Время доставки</Label>
          <Box alignItems='center' columnGap={2} display='flex' position='relative'>
            <InputDatePicker
              required
              placeholder={'Выберите дату'}
              name='notification_push_date'
              id='notification_push_date'
              noMarginTop
              withTime
              value={new Date(orderData?.data?.deliveryTime)}
              disabled
              dashed
              uncontrolled
            />
            <Box>
              <RightArrowSmallIcon />
            </Box>
            <InputDatePicker
              required
              placeholder={'Выберите дату'}
              minDate={Date.now()}
              name='notification_push_date'
              id='notification_push_date'
              noMarginTop
              withTime
              value={deliveryTime}
              onChange={(e) => {
                setDeliveryTime(e)
              }}
              uncontrolled
            />
          </Box>
          <MapSelect
            defaultValue={
              orderData?.data?.savedLocation?.location && [orderData?.data?.savedLocation?.location?.lat, orderData?.data?.savedLocation?.location?.long]
            }
            label='Адрес получателя'
            onChange={(address) => setDeliveryAddress(address)}
          />
        </Container>
      </Box>
    </Box>
  )
}
