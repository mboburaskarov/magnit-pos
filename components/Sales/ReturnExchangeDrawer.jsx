import React, { useEffect, useMemo, useState } from 'react'
import * as qs from 'qs'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Drawer, Typography, CircularProgress } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { Skeleton } from '@mui/material'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import InputSearch from '../Inputs/InputSearch'
import LoadingContainer from '../LoadingContainer'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import DateOrderAccordionItem from '../DateOrderAccordion/DateOrderAccordionItem'
import FilterButton from '../Buttons/ButtonWithPopup'
import ArrowBackIcon from '../../src/assets/icons/ArrowRightIcon'
import { colors } from '../../utils/getColors'
import { numberToPrice } from '../../utils/numberToPrice'
import CashIcon from '../../src/assets/icons/InComeCashIcon'
import dayjs from 'dayjs'
import addToReturnPayment from './DraftChildDrawer'
import addToReturnsAction from './DraftChildDrawer'
import { useDispatch, useSelector } from 'react-redux'
import TablePagination from '../Table/Pagination'
import event from '../../utils/event'
import Link from '../../components/LoadingBlock' //change
import OrderItemCheck from './OrderItemCheck'
import EmptyOrderList from './EmptyOrderList'
import OrderFilterMenu from './OrderFilterMenu'
import OrderListItem from './OrderListItem'
import { product_types } from '../../constants/product-types'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import useDidUpdate from '../../src/hooks/useDidUpdate'
import useDebounce from '../../src/hooks/useDebounce'
import { calculateCashbackAmount } from '../../utils/calculateCashbackAmount'
import GiftCardListItem from './GiftCardListItem'
import { getGiftCardTitle } from '../../utils/getGiftCardTitle'
import { paymeGoId } from '../../constants/paymeGoId'
import { requests } from '../../utils/requests'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '768px',
      padding: 64,
      paddingBottom: 0,
      borderRadius: '64px 0 0 64px',
      backgroundColor: theme.palette.background.default,
    },
  },
  loader_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  },
  body: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    fontSize: 36,
    lineHeight: '42px',
    fontFamily: theme.fontFamily.gilroyBold,
    color: theme.palette.black,
  },
  price: {
    fontSize: 36,
    lineHeight: '42px',
    fontFamily: theme.fontFamily.gilroyBold,
    color: theme.palette.blue[500],
  },
  salesNumber: {
    marginBottom: 12,
    fontSize: 24,
    lineHeight: '29px',
  },
  cashier_block: {
    display: 'inline-flex',
    alignItems: 'center',
    '& span': {
      display: 'inline-block',
      marginRight: 4,
      color: theme.palette.gray[300],
    },
  },
  user_circle: {
    display: 'inline-block',
    height: 16,
    width: 16,
    borderRadius: '50%',
    marginRight: 8,
  },
  actions: {
    position: 'fixed',
    bottom: 0,
    width: 640,
    backgroundColor: theme.palette.background.default,
  },
  base: {
    paddingBottom: 104,
  },
  payment_detail: {
    flex: '0 0 50%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 208,
    padding: '10px 16px',
    borderRadius: 16,
    backgroundColor: theme.palette.gray[100],
    marginRight: 8,
    marginBottom: 8,
    '&:nth-child(3n)': {
      marginRight: 0,
    },
    '& p:last-child': {
      color: theme.palette.blue[500],
      marginTop: 4,
    },
  },
  box_detail: {
    flex: '0 0 50%',
    padding: '11px 16px',
    borderRadius: 16,
    backgroundColor: theme.palette.gray[100],
    '&:nth-child(odd)': {
      marginRight: 8,
    },
  },
  box_title: {
    marginBottom: 4,
    color: theme.palette.gray[400],
  },
  box_name: {
    display: 'flex',
    alignItems: 'center',
    '& span': {
      display: 'block',
      height: 16,
      width: 16,
      borderRadius: '50%',
      marginRight: 8,
    },
  },
  skeleton: {
    borderRadius: 24,
    marginBottom: 8,
    height: '96px',
  },
}))

export default function ReturnExchangeDrawer({
  isOpen,
  closeDrawer,
  returnExchangeOrder,
  setExchangeOrderDetails,
  clientRef,
  singleOrder,
  setSingleOrder,
  webkassaOn,
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const { values } = useQueryParams()
  const navigate = useNavigate()
  const current_shop_id = useSelector((state) => state.company)
  const [filterMenu, setFilterMenu] = useState(false)
  const [list, setList] = useState([])
  const [items, setItems] = useState([])
  const dispatch = useDispatch()
  const [data, setData] = useState({
    startDate: '',
    endDate: '',
    clientId: '',
  })
  const [pageCount, setPageCount] = useState(1)
  const [limit, setLimit] = useState(5)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 200)

  const {
    data: orderDetails,
    refetch,
    isLoading,
  } = useQuery(['orderDetails', singleOrder?.id], () => requests.order.getSingle(singleOrder?.id), {
    enabled: false,
  })

  const {
    customer_id,
    order_id,
    cashbox_id,
    order_items,
    total_price,
    user,
    order_payments,
    shop,
    customer: customerDetails,
    with_cashback,
    loyalty_balance_income,
    loyalty_balance_outcome,
    comment,
  } = orderDetails?.data?.order_detail || {}

  const { data: customer, refetch: refetchCusomter } = useQuery(['customer', customer_id], () => requests.customer.getSingle(customer_id), { enabled: false })

  const forbiddenRoutes = useSelector((state) => state.permissionRoutes)
  const returnFromOtherStore = forbiddenRoutes?.find((item) => item?.slug === 'return-from-another-store')

  const {
    data: orderList,
    isLoading: isOrdersLoading,
    refetch: fetchOrders,
    isFetching: isOrdersFetching,
  } = useQuery(
    'orderList',
    () =>
      requests.order.getAll({
        limit,
        page,
        search: values?.returnSearch,
        start_date: data?.startDate,
        end_date: data?.endDate,
        customer_id: data?.clientId,
        order_types: 'SALE,EXCHANGE',
        shop_id: returnFromOtherStore && current_shop_id,
      }),
    { enabled: isOpen }
  )

  useEffect(() => {
    if (customer_id) {
      refetchCusomter()
    }
  }, [customer_id])

  useEffect(() => {
    fetchOrders()
  }, [values?.returnSearch, data, limit, page])

  useEffect(() => {
    if (orderList?.data) {
      setList(orderList?.data)
    }
  }, [orderList?.data])

  useEffect(() => {
    if (singleOrder) {
      refetch()
    }
  }, [singleOrder])

  const onSubmit = () => {
    event('new_sale_return_exchange_attempts')
    const getTotalPrice = (item) => {
      if (item.discount_unit === 'PERCENTAGE' && item?.discount_value) {
        const price = item?.price - item?.price * (item?.discount_value / 100)
        return price * item.measurement_value
      }
      if (item.discount_unit === 'CURRENCY') {
        const price = item.discount_value * item.measurement_value
        return price
      }
      return item.price * item.measurement_value
    }
    const returnItems = items?.map((item) => ({
      ...item,
      order_id,
      total_price: getTotalPrice(item),
      items_price: Math.abs(item.price) * item.measurement_value,
      barcode: item.product.barcode,
      name: item.product.name,
      sku: item.product.sku,
      retail_price: item.price,
      custom_fields: item.product.custom_fields,
      discount: {
        unit: item.discount_unit,
        value: item.discount_value,
      },
      total_measurement_value: item.measurement_value,
      returnType: true,
    }))
    const requestBody = {
      cashbox_id,
      order_items: items?.map((el) => ({
        measurement_value: el?.measurement_value,
        product_id: el?.product_id,
      })),
      shop_id: current_shop_id,
    }
    setExchangeOrderDetails({
      cashbox_id,
      shop_id: current_shop_id,
    })
    returnExchangeOrder({ id: orderDetails?.data?.id, data: requestBody })
    returnItems.forEach((item) => {
      dispatch(addToReturnsAction(item))
    })
    if (customer?.data) {
      clientRef.current = customer?.data
    }
    if (webkassaOn) {
      dispatch(addToReturnPayment(order_payments))
    }

    closeDrawer()
  }

  useDidUpdate(() => {
    const searchParams = qs.stringify(
      {
        ...values,
        page: 1,
        returnSearch: debouncedSearchTerm || undefined,
      },
      { addQueryPrefix: true }
    )
    setPage(1)
    navigate(`${location.pathname}${searchParams}`)
  }, [debouncedSearchTerm])

  useEffect(() => {
    const pages = Math.ceil(list?.count / limit)
    setPageCount(pages ?? 1)
  }, [list, limit])

  const columns = useMemo(
    () => [
      {
        Header: 'Column 2',
        accessor: 'col2',
      },
    ],
    []
  )

  const returnedItemsList =
    order_items
      ?.filter((el) => el.returned_measurement_value > 0)
      ?.map((itm) => ({
        ...itm,
        measurement_value: itm.returned_measurement_value,
        type: 'RETURN',
      })) || []

  const orderItemListFiltered =
    order_items
      ?.filter((el) => el.measurement_value !== el.returned_measurement_value && !!el.measurement_value)
      ?.map((itm) => ({
        ...itm,
        measurement_value: itm.measurement_value - itm.returned_measurement_value,
        type: orderDetails?.data?.order_type,
      })) || []

  const orderItemsList = [...orderItemListFiltered, ...returnedItemsList]
  const theme = useTheme()
  return (
    <>
      <Drawer open={isOpen} onClose={closeDrawer} anchor='right' elevation={1} className={classes.drawer}>
        <Box className={classes.wrapper}>
          <Box className={classes.body}>
            <Box hidden={Boolean(singleOrder)}>
              <Box width='100%' display='flex' justifyContent='space-between' alignItems='center'>
                <Box>
                  <Typography variant='h1' className={classes.title}>
                    {t('menu.orders.all.returns_and_exchanges')}
                  </Typography>
                </Box>
                <Box onClick={closeDrawer}>
                  <CloseIcon color={theme.palette.black} />
                </Box>
              </Box>
              <Box display='flex' width='100%' mt={4}>
                <Box flex='1 0 70%' mr={1}>
                  <InputSearch
                    name='search'
                    placeholder={t('menu.orders.all.id_placeholder')}
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </Box>
                <Box flex='0 0 25%' minWidth={192}>
                  <Box flex='0 0 10%' mr={1} minWidth={192}>
                    <FilterButton filterMenu={filterMenu} setFilterMenu={setFilterMenu} />
                  </Box>
                </Box>
              </Box>
              <OrderFilterMenu filterMenu={filterMenu} setFilterMenu={setFilterMenu} setDate={setData} />
              <LoadingContainer readyState={!isOrdersLoading}>
                {list.orders?.length > 0 ? (
                  <Box mt={4}>
                    {list?.orders?.map((item, index) => (
                      <>
                        {isOrdersFetching ? (
                          <Skeleton variant='rectangular' animation='wave' className={classes.skeleton} />
                        ) : (
                          <DateOrderAccordionItem setIsOpen={setSingleOrder} data={item} key={index} searchTerm={values?.returnSearch} />
                        )}
                      </>
                    ))}
                    <TablePagination columns={columns} data={list.orders} pageCount={pageCount} setLimit={setLimit} setPage={setPage} />
                  </Box>
                ) : (
                  <EmptyOrderList />
                )}
              </LoadingContainer>
            </Box>
            {isLoading ? (
              <Box className={classes.loader_container}>
                <CircularProgress />
              </Box>
            ) : (
              <Box hidden={!singleOrder}>
                <Box width='100%' display='flex' alignItems='center'>
                  <Box onClick={() => setSingleOrder(null)}>
                    <ArrowBackIcon />
                  </Box>
                  <Box ml={4}>
                    <Typography className={classes.salesNumber}>{`${t('menu.orders.all.sale')} #${orderDetails?.data?.order_number}`}</Typography>
                    <Typography variant='h1' className={classes.price}>
                      {numberToPrice(total_price)}
                    </Typography>
                  </Box>
                </Box>
                <Box flexGrow='1' mt={4}>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography>{t('menu.orders.new_order.heading')}</Typography>
                    <Typography className={classes.cashier_block}>
                      <span>{t('menu.orders.all.filter_menu_order.cashier')}:</span>
                      <span className={classes.user_circle} style={{ background: colors[0] }} /> {user?.name}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    {orderItemsList?.map((item, index) =>
                      item.type === 'RETURN' ? (
                        <OrderListItem
                          type={orderDetails?.data?.order_type}
                          key={index}
                          data={item}
                          returned={item?.product_type_id !== product_types[1]?.id}
                          isDuplicate={orderItemsList?.filter((el) => el?.product_id === item?.product_id)?.length === 2}
                        />
                      ) : item?.product?.type === 'CERTIFICATE' ? (
                        <GiftCardListItem key={index} data={item} />
                      ) : (
                        <OrderItemCheck key={index} data={item} items={items} setItems={setItems} />
                      )
                    )}
                  </Box>
                </Box>

                <Box my={4}>
                  <Typography>{t('menu.orders.all.payment')}</Typography>
                  <Box display='flex' flexWrap='wrap' mt={2}>
                    {order_payments?.map((item) => (
                      <Box className={classes.payment_detail} key={item.id}>
                        <Box>
                          <Typography>
                            {item?.is_certificate || item?.is_voucher
                              ? t(getGiftCardTitle(item.company_payment_type?.name))
                              : item?.company_payment_type_id === paymeGoId
                              ? 'Payme Go'
                              : item.company_payment_type.name}
                          </Typography>
                          <Typography>{numberToPrice(item.paid_amount)}</Typography>
                        </Box>
                        <CashIcon />
                      </Box>
                    ))}
                    {orderDetails?.data?.debt && (
                      <Box id='debt-payment' className={classes.payment_detail}>
                        <Box>
                          <Typography>{t('menu.sales.all.debt')}</Typography>
                          <Typography>{numberToPrice(orderDetails?.data?.debt?.amount)}</Typography>
                        </Box>
                        <CashIcon />
                      </Box>
                    )}
                    {!!with_cashback && (
                      <Box className={classes.payment_detail}>
                        <Box>
                          <Typography>{t('menu.sales.all.balance')}</Typography>{' '}
                          <Typography style={{ color: 'dodgerblue' }} className={classes.box_name}>
                            {numberToPrice(with_cashback)}
                          </Typography>
                        </Box>
                        <CashIcon />
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box mt={4} mb={2}>
                  <Typography>{t('menu.orders.all.details')}</Typography>
                  <Box display='flex' mt={2}>
                    <Box className={classes.box_detail}>
                      <Typography className={classes.box_title}>{t('menu.orders.all.datetime')}:</Typography>
                      <Typography>{dayjs(orderDetails?.data?.display_sold_at).format('DD.MM.YYYY | HH:mm:ss')}</Typography>
                    </Box>
                    <Box className={classes.box_detail}>
                      <Typography className={classes.box_title}>{t('menu.orders.all.filter_menu_order.shop_label')}:</Typography>
                      <Typography className={classes.box_name}>
                        <span style={{ background: colors[2] }} />
                        {shop?.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {!!comment && (
                  <Box id='created-details-comment' className={classes.box_detail} style={{ marginRight: 0 }}>
                    <Typography className={classes.box_title}>{t('create_new_product.main_section.description')}:</Typography>
                    <Typography>{comment}</Typography>
                  </Box>
                )}
                <Box display='flex' mt={2}>
                  {customerDetails?.name && (
                    <Box id='client-details' className={classes.box_detail} mr={1}>
                      <Typography className={classes.box_title}>{t('titles.client')}</Typography>
                      <Typography className={classes.box_name}>
                        <Link style={{ color: 'dodgerblue' }} to={`/clients/card/${customer_id}`}>
                          {customerDetails?.name}
                        </Link>
                      </Typography>
                    </Box>
                  )}
                  {(!!loyalty_balance_income || !!loyalty_balance_outcome) && (
                    <Box id='cashback-details' className={classes.box_detail}>
                      <Typography className={classes.box_title}>{t('loyalty_program.cashback')}</Typography>
                      <Typography style={{ color: 'dodgerblue' }} className={classes.box_name}>
                        {calculateCashbackAmount(loyalty_balance_income, loyalty_balance_outcome)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <div className={classes.actions}>
                  <Box width='100%' pb={4} pt={2}>
                    <Button
                      primary
                      fullWidth
                      disabled={items.length === 0 || order_payments?.find((item) => item?.company_payment_type_id === paymeGoId)}
                      onClick={onSubmit}
                      id='return_exchange'
                    >
                      {t('menu.orders.all.returns_and_exchanges')}
                    </Button>
                  </Box>
                </div>
                <div className={classes.base} />
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
