import React, { useEffect, useState } from 'react'
import CartSearchBar from './CartSearchBar'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CartItem from './CartItem'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import FileIcon from '../../../assets/icons/FileIcon'
import TimeAndDate from '../../../assets/icons/TimeandDateIcon'
import TextField from '../../../../components/Inputs/TextField'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import SearchInput from '../../../../components/Inputs/SearchInput'
import { useDebounce } from 'use-debounce'
import { Palette } from '@mui/icons-material'
import Label from '../../../../components/Label'
import { get, size } from 'lodash'
import Highlighter from 'react-highlight-words'
import ClientVerification from './ClientVerification'
import UserFilledIcon from '../../../assets/icons/UserFilledIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import ClientCreateMini from '../../../../components/Sales/ClientCreateMini'
import OrderDrawer from '../../../../components/Sales/ClientCreateMini/OrderDrawer'
import DraftDrawer from '../../../../components/Sales/DraftDrawer'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import TimesSmallIcon from '../../../assets/icons/TimesSmallIcon'

const useStyles = makeStyles((theme) => ({
  card_detail: {
    width: '30%',
    borderLeft: `1px solid ${theme.palette.bunker[100]}`,
    minHeight: '100vh',
    padding: '20px',
    '& .MuiInputBase-root': {
      borderRadius: '40px ',
    },
    position: 'relative',
  },
  cart_detail_id: {
    borderRadius: '40px',
    border: '1px dashed',
    borderColor: 'bunker.300',
    padding: '10px 16px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: '8px',
  },
  cart_detail_icon: {
    width: 48,
    ml: '16px',
    minWidth: '48px',
    borderRadius: '50%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    marginLeft: '16px',
    justifyContent: 'center',
    backgroundColor: theme.palette.bg[10],
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.bunker[100],
    },
  },
  empty_list: {
    border: `1px dashed ${theme.palette.bunker[300]}`,
    display: 'flex',
    borderRadius: '16px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 64px',
    marginTop: '16px',
    backgroundColor: `${theme.palette.bg[10]}`,
  },

  percent: {
    width: '100%',
    backgroundColor: theme.palette.bg[10],
    borderRadius: '24px',
    height: '32px',
    textAlign: 'center',
    verticalAlign: 'middle',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginRight: '8px',
    fontWeight: '500',
    lineHeight: '24px',
    // borderColor: 'transparent',
    fontSize: '16px',
    '&:last-child': {
      marginRight: '0',
    },
  },
  priceDetails: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: 'calc(100% - 40px)',
    left: 0,
    margin: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderRadius: '16px',
    borderColor: theme.palette.bunker[100],
    boxShadow: '0px 4px 12px 0px #00000014',
  },

  searchItemList: {
    // maxHeight: 320,
    overflowY: 'scroll',
    position: 'absolute',
    zIndex: 2,
    width: 'calc(100% - 40px)',
    // maxWidth: 316,
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.boxShadow['16-8'],
  },
  searchItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: 56,
    padding: '0 16px',
    cursor: 'pointer',
    '&:focus-visible': {
      outline: 'none !important',
      backgroundColor: theme.palette.gray[100],
    },
  },
  noSuchClientAdd: {
    cursor: 'pointer',
    alignItems: 'center',
    display: 'inline-flex',
    width: '100%',
    height: 62,
    padding: '0 16px',
    '&:focus-visible': {
      outline: 'none !important',
      backgroundColor: theme.palette.gray[100],
    },
  },
  warningIcon: {
    color: theme.palette.red[500],
  },
  clientInfo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.white,
    height: 48,
    borderRadius: 40,
    border: '2px solid',
    borderColor: theme.palette.bunker[100],
    padding: '4px 12px',
  },
}))
function NewSale() {
  const userData = useSelector((state) => state.user)
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const method = useForm()
  const classes = useStyles()
  const totalPrice = 0

  const [showOverlay, setShowOverlay] = useState(false)
  const [isOpenDraft, setIsOpenDraft] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [openClientCreateMini, setOpenClientCreateMini] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [customers, setCustomers] = useState([])
  const [discount, setDiscountType] = useState('percent')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200)
  const [customerId, setCustomerId] = useState('')
  const [clientDetails, setClientDetails] = useState(null)
  const [inputDiscount, setInputDiscount] = useState(0)

  const searchResult = useQuery(
    ['searchCustomers', debouncedSearchTerm],
    () =>
      requests.getAllCustomers({
        search: searchTerm,
      }),
    { enabled: false }
  )

  const { mutate: deleteAll, isLoading: isdeleteAll } = useMutation(requests.deleteAll, {
    onSuccess: () => {
      setShowOverlay(false)
      refetchcartItemsList()
      setOpenConfirmDialog(null)

      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара! #2')
      console.log('err', err)
    },
  })
  const { mutate: payForSale, isLoading: ispayForSale } = useMutation(requests.payForSale, {
    onSuccess: () => {},
    onError: (err) => {
      error('Ошибка при создании товара! #1')
      console.log('err', err)
    },
  })
  const { mutate: changeDiscountValue, isLoading: ischangeDiscountValue } = useMutation(requests.changeDiscountValue, {
    onSuccess: () => {
      refetchcartItemsList()
    },
    onError: (err) => {
      error('Ошибка при создании товара! #5')
      console.log('err', err)
    },
  })
  const { mutate: handleAddProduct, isLoading: isCreatingProduct } = useMutation(requests.createCartItem, {
    onSuccess: () => {
      setShowOverlay(false)
      refetchcartItemsList()
      // success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара! #4')
      console.log('err', err)
    },
  })
  const { mutate: deleteCartItem, isLoading: isdeleteCartItem } = useMutation(requests.deleteCartItem, {
    onSuccess: () => {
      setShowOverlay(false)
      refetchcartItemsList()
      setOpenConfirmDialog(null)
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара! #3')
      console.log('err', err)
    },
  })

  const { data: cartItemsList, refetch: refetchcartItemsList } = useQuery('cartItemsList', () =>
    requests.getCartItemList({ sale_id: id, limit: 1000, offset: 0 }).catch(() => navigate('/sales/create'))
  )
  const { data: cashBoxDetails, refetch: refetchCashBoxDetaild } = useQuery('cashBoxDetails', () => requests.getCashBoxDetaildWithSaleId(id))

  useEffect(() => {
    method.setValue('discount', inputDiscount)
  }, [inputDiscount, method.setValue])

  useEffect(() => {
    refetchcartItemsList()
  }, [])

  useEffect(() => {
    changeDiscountValue({
      id: id,
      body: {
        discount_type: discount,
        discount_value: Number(method.getValues('discount')),
      },
    })
  }, [method.watch('discount')])

  useEffect(() => {
    if (customerId) {
      requests.getSingleCustomers(customerId).then(({ data }) => {
        setClientDetails(get(data, 'data'))
      })
    }
  }, [customerId])

  useEffect(() => {
    if (debouncedSearchTerm?.length > 3) {
      searchResult.refetch().then(({ data }) => {
        if (get(data, 'data.data.data')) {
          setCustomers(get(data, 'data.data.data'))
        } else {
          setCustomers([])
        }
      })
    }
  }, [debouncedSearchTerm])

  const pay = () => {
    payForSale({ cash_box_id: 1, employee_id: userData?.id })
  }
  return (
    <FormProvider {...method}>
      <Box display={'flex'}>
        <Box width={'70%'} padding={'20px'}>
          <Box position={'relative'}>
            <CartSearchBar showOverlay={showOverlay} setShowOverlay={setShowOverlay} handleAddProduct={handleAddProduct} />
          </Box>
          <Box mt={8} />
          <Box padding={'24px 0'}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                mb: '16px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography fontWeight={'700'} fontSize={'28px'} lineHeight={'40px'}>
                Sotuv (0)
              </Typography>
              {get(cartItemsList, 'data.data.data', 0).length ? (
                <Box display={'flex'} alignItems={'center'} onClick={() => setOpenConfirmDialog({ type: 'deleteAll' })}>
                  <Typography sx={{ mr: '12px', color: 'orange.500', fontSize: '14px', lineHeight: '20px', fontWeight: '600' }}>
                    Barchasini o'chirish
                  </Typography>
                  <DeleteIcon width={'20px'} />
                </Box>
              ) : (
                <></>
              )}
            </Box>
            {!cartItemsList?.data?.data?.data?.length ? (
              <Box className={classes.empty_list}>
                <Typography fontWeight={'800'} fontSize={'24px'} lineHeight={'32px'}>
                  Savat hozircha boʻsh
                </Typography>
                <Typography fontWeight={'500'} fontSize={'16px'} color={'bunker.500'} lineHeight={'24px'}>
                  Qidiruv paneli orqali mahsulotlarni qo'shing yoki mahsulotlarni skanerlang
                </Typography>
              </Box>
            ) : (
              <Box>
                {cartItemsList?.data?.data?.data?.map((el) => (
                  <CartItem setOpenConfirmDialog={setOpenConfirmDialog} item={el} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
        <Box className={classes.card_detail}>
          <Box display={'flex'} alignItems={'center'} mb={'24px'}>
            <Box className={classes.cart_detail_id}>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'orange.500'} lineHeight={'26px'}>
                #4343434
              </Typography>
            </Box>
            <Box className={classes.cart_detail_icon}>
              <FileIcon />
            </Box>
            <Box onClick={() => setIsOpenDraft(true)} className={classes.cart_detail_icon}>
              <TimeAndDate />
            </Box>
            <Box className={classes.cart_detail_icon}>
              <DeleteIcon width={'24px'} />
            </Box>
          </Box>
          <Box mb={'24px'}>
            <Box sx={{ display: 'flex', mb: '4px', justifyContent: 'space-between' }}>
              <Label>Mijoz</Label>
              <Typography onClick={() => setOpenClientCreateMini(true)} color={'orange.500'} fontSize={'14px'} fontWeight={'600'}>
                Yaratish
              </Typography>
            </Box>
            {customerId ? (
              <Box className={classes.clientInfo}>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                  <UserFilledIcon />
                  <Box ml={2}>
                    <Typography sx={{ fontSize: '18px', lineHeight: '28px', fontWeight: '500', color: 'bunker.950' }} style={{ cursor: 'pointer' }}>
                      {get(customerId, 'name')}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', lineHeight: '16px', fontWeight: '500', color: 'bunker.400' }} color='textSecondary'>
                      Balans: {get(customerId, 'balance')}
                    </Typography>
                  </Box>
                </Box>
                <Box height={'24px'} onClick={() => setCustomerId('')}>
                  <TimesSmallIcon />
                </Box>
              </Box>
            ) : (
              <SearchInput
                id='client-search-bar'
                name='search'
                placeholder={'menu.orders.new_order.cart_container.client_placeholder'}
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) onEnter()
                }}
                value={searchTerm}
                // inputRef={clientInputRef}
                setSearchTerm={setSearchTerm}
                client
                // disabled={disabled}
                error={!!searchTerm && searchTerm?.length < 4}
              />
            )}
            {!!searchTerm && searchTerm?.length < 4 && (
              <Box display='flex' alignItems='center'>
                <Box className={classes.warningIcon}>{/* <FontAwesomeIcon icon={faExclamationCircle} /> */}</Box>
                <Typography
                  sx={(theme) => ({
                    color: theme.palette.red[500],
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    lineHeight: '16.94px',
                    marginLeft: '4px',
                  })}
                >
                  Qidirish uchun kamida 4 ta belgi kiriting
                </Typography>
              </Box>
            )}
            {searchTerm?.length > 3 && (
              <Box className={classes.searchItemList}>
                {size(customers) == 0 && (
                  <Box
                    id='searchResult0'
                    tabIndex={0}
                    onClick={() => setOpenClientCreateMini(true)}
                    className={classes.noSuchClientAdd}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && fakeIndexForCheckClient === 0) {
                        setOpenClientCreateMini(true)
                      }
                    }}
                  >
                    {/* <PlusSmallIcon fill='#fff' /> */}
                    <Typography style={{ marginLeft: '7px' }}>“{searchTerm}”</Typography>
                  </Box>
                )}

                {customers?.map((item, index) => (
                  <Box
                    key={index}
                    tabIndex={index + 1}
                    id={`searchResult${index + 1}`}
                    className={classes.searchItem}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && fakeIndexForCheckClient === index + 1) {
                        setCustomerId({ id: item?.id, name: item?.first_name + ' ' + item?.first_name, balance: item?.balance })
                      }
                    }}
                    onClick={() => {
                      setCustomerId({ id: item?.id, name: item?.first_name + ' ' + item?.first_name, balance: item?.balance })

                      setSearchTerm()
                    }}
                  >
                    <Typography>
                      <Highlighter
                        highlightClassName='highlighter'
                        searchWords={searchTerm ? searchTerm?.split(' ') : []}
                        autoEscape
                        textToHighlight={`${item.first_name} ${item.last_name}`}
                      />
                    </Typography>
                    <Typography style={{ color: 'gray.400', whiteSpace: 'pre' }}>
                      <Highlighter
                        highlightClassName='highlighter'
                        searchWords={searchTerm ? searchTerm?.split(' ') : []}
                        autoEscape
                        textToHighlight={item.phone_numbers?.join('\r\n') || ''}
                      />
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            {/* <TextField required fullWidth name='description' label='Mizoj' placeholder='Mijoz yoki telefon raqami' /> */}
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <TextField required type={'number'} fullWidth name='discount' label='Mijoz' placeholder='Chegirmani kiritng' />
            <Box ml={'8px'}>
              <InputSwitch
                uncontrolled
                id='app-type'
                name='app-type'
                // value={appType}
                style={{ marginTop: '20px', width: 'auto' }}
                defaultValue='percent'
                onChange={setDiscountType}
                options={[
                  { title: '%', value: 'percent' },
                  { title: 'UZS', value: 'cash' },
                ]}
              />
            </Box>
          </Box>
          <Box mt='8px' display={'flex'}>
            {discount === 'percent' &&
              [15, 30, 50, 75].map((el, index) => (
                <Box sx={{ color: el === inputDiscount ? 'orange.500' : '#000' }} onClick={() => setInputDiscount(el)} className={classes.percent}>
                  {el}%
                </Box>
              ))}
            {discount === 'cash' &&
              [50, 100, 300, 500].map((el, index) => (
                <Box sx={{ color: el === inputDiscount ? 'orange.500' : '#000' }} onClick={() => setInputDiscount(el)} className={classes.percent}>
                  {el}k
                </Box>
              ))}
          </Box>
          <Box className={classes.priceDetails}>
            <Box display={'flex'} justifyContent={'space-between'} mb={'16px'}>
              <Typography fontWeight={'600'} fontSize={'18px'} color={'bunker.950'} lineHeight={'28px'}>
                Jami narxi:
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'bunker.800'} lineHeight={'28px'}>
                383 450 so'm
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} mb={'16px'}>
              <Typography fontWeight={'600'} fontSize={'18px'} color={'bunker.950'} lineHeight={'28px'}>
                Chegirma:
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'bunker.800'} lineHeight={'28px'}>
                57 450 so'm
              </Typography>
            </Box>
            <Button onClick={() => pay()} color='primary' sx={{ mb: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'white'} lineHeight={'26px'}>
                To'lov
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'white'} lineHeight={'26px'}>
                57 450 so'm
              </Typography>
            </Button>
            <Button color='secondary'>
              <TimeAndDate />
              <Typography ml={'12px'} fontWeight={'500'} fontSize={'18px'} color={'black'} lineHeight={'26px'}>
                Draft
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
      {/* <OrderDrawer
        eposOn={true}
        webkassaOn={true}
        accessToPrint={true}
        isOpen={true}
        closeDrawer={() => {}}
        // printContainer={printContainer}
        cheque={[]}
        paymentTypes={[]}
        cashbackPercent={[]}
        loyaltyProgramType={[]}
        cashbackPaymentPercentage={100}
        isLoading={false}
        clientInfo={[]}
        setClientInfo={() => {}}
        onSubmit={() => {}}
        shop={{}}
        user={{}}
        orderNumber={'34343'}
        setOpenClientCreateMini={setOpenClientCreateMini}
        setOpenClientCard={() => {}}
        setQuickCreateClientName={() => {}}
        // clientInputRef={clientInputRef}
        createdClientId={() => {}}
        setCreatedClientId={() => {}}
        openDebt={false}
        setOpenDebt={() => {}}
        eposTransaction={'eposTransaction'}
        webkassaTransaction={'webkassaTransaction'}
        sellers={'sellersName'}
        deleteDebt={() => {}}
        eposChecked={'eposChecked'}
        setEposChecked={() => {}}
        // control={control}
        // isAutoIncome={!!autoIncomePayments?.length}
        // setOpenAutoIncome={setOpenAutoIncome}
      /> */}
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={<BigWarningIcon />}
          title={
            openConfirmDialog?.type === 'activate'
              ? 'Активировать продукт?'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Деактивировать продукт?'
              : 'Удалить продукт?'
          }
          desc={
            openConfirmDialog?.type === 'activate'
              ? 'Вы действительно хотите активировать продукт, вы не можете вернуть этот прогресс после активации.'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Вы действительно хотите деактивировать продукт, вы не можете вернуть этот прогресс после деактивации.'
              : openConfirmDialog.type === 'deleteAll'
              ? 'Barcha mahsulotlarni o’chirmoqchimisiz'
              : 'mahsulotini o’chirmoqchimisiz?'
          }
          supDesc={openConfirmDialog.type === 'deleteAll' ? '' : openConfirmDialog?.name}
          actions={
            <>
              <Button
                sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                onClick={() => setOpenConfirmDialog(null)}
              >
                Yo'q
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isdeleteCartItem}
                onClick={() => {
                  openConfirmDialog.type === 'deleteOne'
                    ? deleteCartItem(openConfirmDialog.id)
                    : deleteAll({ ids: get(cartItemsList, 'data.data.data', []).map((el) => el.id) })
                }}
              >
                Ha, o'chirish
              </LoadingButton>
            </>
          }
        />
      )}
      <DraftDrawer open={isOpenDraft} setOpen={setIsOpenDraft} />
      <ClientCreateMini
        quickCreateClientName={'quickCreateClientName'}
        openDrawer={openClientCreateMini}
        closeDrawer={() => setOpenClientCreateMini(false)}
        // setOpenClientCreate={setOpenClientCreate}
        // setClientDataMini={setClientDataMini}
        clientData={clientDetails}
        // handleAddClient={handleAddClient}
        afterCreate={(clientId) => setCreatedClientId(clientId)}
      />
      <ClientVerification isOpen={false} clientInfo={clientDetails} closeDrawer={() => {}} handleAddClient={() => {}} setClientInfo={() => {}} />
    </FormProvider>
  )
}

export default NewSale
