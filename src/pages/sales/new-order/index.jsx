import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CartItem from './CartItem'
import CartSearchBar from './CartSearchBar'
import { LoadingButton } from '@mui/lab'
import { get, head, size } from 'lodash'
import Highlighter from 'react-highlight-words'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import SearchInput from '../../../../components/Inputs/SearchInput'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'
import LoadingContainer from '../../../../components/LoadingContainer'
import ClientCreateMini from '../../../../components/Sales/ClientCreateMini'
import OrderDrawer from '../../../../components/Sales/ClientCreateMini/OrderDrawer'
import DraftDrawer from '../../../../components/Sales/DraftDrawer'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import FileIcon from '../../../assets/icons/FileIcon'
import TimeAndDate from '../../../assets/icons/TimeandDateIcon'
import TimesSmallIcon from '../../../assets/icons/TimesSmallIcon'
import UserFilledIcon from '../../../assets/icons/UserFilledIcon'
import CreateDraftDrawer from './createDraftDrawer'
import ChangeShift from './ChangeShift'
import ShortcutsDrawer from '../../../../components/Sales/ShortcutsDrawer'
import thousandDivider from '../../../../utils/thousandDivider'
import OutLineTextFieldThousand from '../../../../components/Inputs/OutLineTextFieldThousand'
import LoadingOverflow from '../../../../components/LoadingOverflow'
import ProductDrawer from './ProductDrawer'
import CheckAccess from '../../../../components/CheckAccess'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import ReturnExchangeDrawer from '../../../../components/Sales/ReturnExchange/ReturnExchangeDrawer'
import useDebouncedValue from '../../../hooks/useDebouncedValue'
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
    marginBottom: '24px',
    // marginRight: '8px',
  },
  cart_detail_icon: {
    width: 48,
    ml: '16px',
    minWidth: '48px',
    borderRadius: '50%',
    height: 48,
    display: 'flex',
    marginLeft: '10px',
    alignItems: 'center',
    position: 'relative',
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
    backgroundColor: theme.palette.white,
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
    padding: '4px 14px',
  },
  hot_key: {
    borderRadius: '5px',
    padding: '5px 12px',
    height: '30px',
    width: '30px',
    borderColor: '#ececec',
    marginLeft: '10px',
    fontSize: '14px',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },
  small_hot_key: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: theme.palette.orange[500],
    width: 25,
    height: 25,
    borderRadius: '20px',
    color: '#fff',
    fontSize: 12,
    display: 'flex',
    border: '1px solid #fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
function NewSale() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const method = useForm()
  const classes = useStyles()
  const cartItemRef = useRef([])
  const [showOverlay, setShowOverlay] = useState(false)
  const [hasChange, setHasChange] = useState(false)
  const [isOpenDraft, setIsOpenDraft] = useState(false)
  const [isOpenReturnExchange, setIsOpenReturnExchange] = useState(false)
  const [isCreateOpenDraft, setIsCreateOpenDraft] = useState(false)
  const [openProductDrawer, setOpenProductDrawer] = useState(false)
  const [isOpenChangeShift, setIsOpenChangeShift] = useState(false)
  // const [searchTerm, setSearchTerm] = useState('')

  const [openClientCreateMini, setOpenClientCreateMini] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [customers, setCustomers] = useState([])
  const [discount, setDiscountType] = useState('percent')
  const [searchTerm, setSearchTerm, debouncedValue] = useDebouncedValue('', 200)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200)

  const [customerId, setCustomerId] = useState('')
  const [clientDetails, setClientDetails] = useState(null)
  const [quickCreateClientName, setQuickCreateClientName] = useState(null)
  const [inputDiscount, setInputDiscount] = useState(NaN)
  const [isOrderDrower, setIsOrderDrower] = useState(false)
  const searchRef = useRef('')
  const printContainer = useRef()
  let a = -1
  const focusPackInput = (event, id) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      const nextInput = cartItemRef.current[a + 1]
      if (a == cartItemRef.current.length - 2) {
        a = -1
      } else {
        a++
      }
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  useEffect(() => {
    setInputDiscount(0)
  }, [discount])
  const focusUnitInput = (event) => {
    if (event.key === 'ArrowRight' && !event.shiftKey) {
      const activeInput = document.activeElement
      if (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA') {
        let unitId = activeInput.name.split('_')
        const nextInput = cartItemRef.current[unitId[1] + 'unit']

        if (nextInput) {
          nextInput.focus()
        }
      }
    }
    if (event.key === 'ArrowLeft' && !event.shiftKey) {
      const activeInput = document.activeElement
      if (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA') {
        let unitId = activeInput.name.split('unit_quantity_')

        const nextInput = cartItemRef.current.find((el) => el.name == `quantity_${unitId[1]}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }
  const focusedItemDetailDrawerOpen = (event) => {
    if (event.key === 'Shift') {
      const activeInput = document.activeElement
      if (activeInput?.name?.split('quantity_').length <= 1) return

      if (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA') {
        let unitId = activeInput.name.split('quantity_')

        setOpenProductDrawer(get(cartItemsList, 'data.data.data', []).find((el) => el.id == unitId[1]))
      }
    }
  }

  const searchResult = useQuery(
    ['searchCustomers', debouncedSearchTerm],
    () =>
      requests.getAllCustomers({
        search: searchTerm,
      }),
    { enabled: false }
  )

  const { mutate: deleteAll } = useMutation(requests.deleteAll, {
    onSuccess: () => {
      setShowOverlay(false)
      refetchcartItemsList()
      setOpenConfirmDialog(null)

      success('Корзина была очищена!')
    },
    onError: (err) => {
      error('Ошибка при Корзина была очищена')
      console.log('err', err)
    },
  })
  const { mutate: saleCreate, isLoading: issaleCreate } = useMutation(requests.saleCreate, {
    onSuccess: ({ data }) => {
      window.open(`/sales/new-sale/${get(data, 'data.id')}`, '_blank', 'rel=noopener noreferrer')
    },
    onError: (err) => {
      error('Ошибка при создании продажи')
      console.log('err', err)
    },
  })
  const { mutate: changeDiscountValue, isLoading: ischangeDiscountValue } = useMutation(requests.changeDiscountValue, {
    onSuccess: () => {
      setTimeout(() => {
        setHasChange(false)
        refetchcartItemsList()
      }, 100)
    },
    onError: (err) => {
      setHasChange(false)

      error('Ошибка при изменении цены со скидкой.')
      console.log('err', err)
    },
  })
  const { mutate: handleAddProduct, isLoading: isCreatingProduct } = useMutation(requests.createCartItem, {
    onSuccess: () => {
      setShowOverlay(false)
      setSearchTerm('')
      refetchcartItemsList()
      method.setValue('search', '')
    },
    onError: (err) => {
      if (get(err, 'response.data.code') === 409) {
        error(`Описание
      Редактировать
      Введенное количество товара превышает существующее количество. 
      Максимальное количество упаковок на складе - ${get(err, 'response.data.data.pack_quantity')},
      единичное количество на складе - ${get(err, 'response.data.data.unit_quantity')}.`)
      } else {
        error('Ошибка при создании элемента карты.')
        console.log('err', err)
      }
    },
  })
  const { mutate: deleteCartItem, isLoading: isdeleteCartItem } = useMutation(requests.deleteCartItem, {
    onSuccess: () => {
      setShowOverlay(false)
      refetchcartItemsList()
      setOpenConfirmDialog(null)
      success('Продукт Элемент корзины был удален!')
    },
    onError: (err) => {
      error('Ошибка при Элемент корзины был удален')
      console.log('err', err)
    },
  })

  const {
    data: cartItemsList,
    refetch: refetchcartItemsList,
    isLoading: isCartItemsLIstLoading,
  } = useQuery(['cartItemsList', id], () =>
    requests.getCartItemList({ sale_id: id, limit: 20, offset: 0 }).catch((e) => get(e, 'response.data.code') == '409' && navigate('/sales/create'))
  )
  const { data: cashBoxDetails } = useQuery(['cashBoxDetails', id], () => requests.getCashBoxDetaildWithSaleId(id))

  // useEffect(() => {
  //   if (isNaN(inputDiscount)) return
  //   method.setValue('discount', inputDiscount)
  //   changeDiscount(inputDiscount)
  // }, [inputDiscount])

  useEffect(() => {
    refetchcartItemsList()
  }, [id])
  useEffect(() => {
    const cartList = cartItemsList?.data?.data?.data

    if (cartList?.length > 0) {
      if (isNaN(inputDiscount)) {
        const defaultType = get(head(cartList), 'discount_type', 'percent')
        setDiscountType(defaultType?.length > 0 ? defaultType : 'percent')
        setInputDiscount(get(head(cartList), 'discount_amount', 0))
      }
      cartList.map((item) => {
        method.setValue(`unit_quantity_${item.id}`, get(item, 'unit_quantity'))
        method.setValue(`quantity_${item.id}`, get(item, 'quantity'))
      })
    }
  }, [cartItemsList?.data])
  const changeDiscount = (value) => {
    if (discount != 'percent' && discount != 'cash') {
      return
    }
    if (!value && value != 0) {
      changeDiscountValue({
        id: id,
        body: {
          discount_type: discount,
          discount_value: Number(0),
        },
      })
      return
    }
    setHasChange(true)
    if (value > 100 && discount == 'percent') {
      changeDiscountValue({
        id: id,
        body: {
          discount_type: discount,
          discount_value: 100,
        },
      })
      return
    }
    changeDiscountValue({
      id: id,
      body: {
        discount_type: discount,
        discount_value: Number(value),
      },
    })
  }

  useEffect(() => {
    if (debouncedSearchTerm?.length > 2) {
      searchResult.refetch().then(({ data }) => {
        if (get(data, 'data.data.data')) {
          setCustomers(get(data, 'data.data.data'))
        } else {
          setCustomers([])
        }
      })
    }
  }, [debouncedSearchTerm])

  useHotkeys('tab', (event) => focusPackInput(event), { enableOnFormTags: true })
  useHotkeys(['ArrowRight', 'ArrowLeft'], (event) => focusUnitInput(event), { enableOnFormTags: true })
  useHotkeys('Shift', (event) => focusedItemDetailDrawerOpen(event), { enableOnFormTags: true })
  useHotkeys(['T', 't', 'е'], () => saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id') }), {
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  useHotkeys(['D', 'd', 'в'], () => size(get(cartItemsList, 'data.data.data')) !== 0 && setIsOpenDraft(true), {
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  useHotkeys(['A', 'a', 'ф'], () => setIsOpenChangeShift(true), {
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  useHotkeys('F10', () => setIsOrderDrower(true), {
    enableOnFormTags: true,
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  useHotkeys(['X', 'x', 'ч'], () => navigate(`/sales/cash-shift-detail/${get(cashBoxDetails, 'data.data.cash_box_operation_id')}?sale_id=${id}`), {
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  useHotkeys(['Q', 'q', 'й'], () => size(get(cartItemsList, 'data.data.data')) !== 0 && setIsCreateOpenDraft(true), {
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  useHotkeys(['U', 'u', 'г'], () => setOpenClientCreateMini(true), {
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  useHotkeys(
    ['/', '.'],
    (event) => {
      event.preventDefault() // Prevent the default behavior of the "/" key
      searchRef.current?.focus() // Focus the input field
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'], // Enable the hotkey even when these elements are focused
    }
  )

  const [debouncedDiscount, setDebouncedDiscount] = useState('')

  // Function to handle input changes
  const changeDiscountDebounce = (value) => {
    // if (inputDiscount !== value) setInputDiscount(0)
    setDebouncedDiscount(value)
  }

  // Debounce logic: Apply a delay before updating the debounced value
  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof debouncedDiscount !== 'number' || size(get(cartItemsList, 'data.data.data', [])) <= 0) {
        return
      }
      if (typeof debouncedDiscount !== 'number') {
        changeDiscount(0)
        return
      }
      setInputDiscount(0)
      setInputDiscount(debouncedDiscount)
      changeDiscount(debouncedDiscount)
    }, 200)

    return () => clearTimeout(handler) // Cleanup the timeout on re-renders
  }, [debouncedDiscount])

  useEffect(() => {
    console.log(debouncedValue)
    console.log('searchTerm')
    console.log(searchTerm)
  }, [debouncedValue])
  return (
    <FormProvider {...method}>
      <LoadingOverflow fullHeight readyState={!hasChange} />

      <Box display={'flex'}>
        <Box width={'70%'} position={'relative'} padding={'20px'}>
          <Box position={'relative'}>
            <CartSearchBar
              discount={{ type: discount, amount: inputDiscount }}
              searchRef={searchRef}
              openDraft={() => setIsOpenDraft(true)}
              setIsOpenChangeShift={setIsOpenChangeShift}
              refetchcartItemsList={refetchcartItemsList}
              cashBoxDetails={cashBoxDetails}
              showOverlay={showOverlay}
              setShowOverlay={setShowOverlay}
              handleAddProduct={handleAddProduct}
            />
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
                {/* {get(cashBoxDetails, 'data.data.sale_type', 'SALE') == 'RETURN' ? 'Возврат' : t('page.new_sale.label')} (
                {get(cartItemsList, 'data.data.item_count', 0)}) */}
                {t('page.new_sale.label')}
              </Typography>
              {get(cartItemsList, 'data.data.data', 0)?.length ? (
                <Box display={'flex'} sx={{ cursor: 'pointer' }} alignItems={'center'} onClick={() => setOpenConfirmDialog({ type: 'deleteAll' })}>
                  <Typography sx={{ mr: '12px', color: 'orange.500', fontSize: '14px', lineHeight: '20px', fontWeight: '600' }}>{t('delete_all')}</Typography>
                  <DeleteIcon width={'20px'} />
                </Box>
              ) : (
                <></>
              )}
            </Box>
            <LoadingContainer noHeight readyState={!isCartItemsLIstLoading}>
              {!size(get(cartItemsList, 'data.data.data')) ? (
                <Box className={classes.empty_list}>
                  <Typography fontWeight={'800'} fontSize={'24px'} lineHeight={'32px'}>
                    {t('page.new_sale.empty_cart_title')}
                  </Typography>
                  <Typography fontWeight={'500'} fontSize={'16px'} color={'bunker.500'} lineHeight={'24px'}>
                    {t('page.new_sale.empty_cart_desc')}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    overflowY: 'auto',
                    maxHeight: '75vh',
                    paddingBottom: '80px',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {get(cartItemsList, 'data.data.data', []).map((el, index) => (
                    <CartItem
                      setOpenProductDrawer={setOpenProductDrawer}
                      // onKeyDown={(e) => handleTabSwitch(e, el?.id)}
                      refetchcartItemsList={refetchcartItemsList}
                      method={method}
                      setOpenConfirmDialog={setOpenConfirmDialog}
                      item={el}
                      packRef={(els) => (cartItemRef.current[index] = els)}
                      unitRef={(els) => (cartItemRef.current[el?.id + 'unit'] = els)}
                      key={el?.id}
                      index={el?.id}
                    />
                  ))}
                </Box>
              )}
            </LoadingContainer>
          </Box>
          <ShortcutsDrawer />
        </Box>
        <Box className={classes.card_detail}>
          <Box display={'flex'}>
            <Box className={classes.cart_detail_id}>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'orange.500'} lineHeight={'26px'}>
                #{get(cashBoxDetails, 'data.data.sale_number')}
              </Typography>
            </Box>
            <Box
              onClick={() => saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id') })}
              className={classes.cart_detail_icon}
            >
              <FileIcon color='#000' />
            </Box>

            <Box onClick={() => setIsOpenDraft(true)} className={classes.cart_detail_icon}>
              <TimeAndDate />
            </Box>
            <Box onClick={() => {}} className={classes.cart_detail_icon}>
              {/* <Box onClick={() => setIsOpenReturnExchange(true)} className={classes.cart_detail_icon}> */}
              <FontAwesomeIcon icon={faExchangeAlt} />
            </Box>
          </Box>
          <Box mb={'24px'}>
            <Box sx={{ display: 'flex', mb: '4px', justifyContent: 'space-between' }}>
              <Label>{t('client')}</Label>
              <Typography sx={{ cursor: 'pointer' }} onClick={() => setOpenClientCreateMini(true)} color={'orange.500'} fontSize={'14px'} fontWeight={'600'}>
                {t('create')}
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
                      {t('balans')}: {get(customerId, 'balance')}
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
                placeholder={t('client.placeholder')}
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.keyCode === 13) onEnter()
                // }}
                value={searchTerm}
                setSearchTerm={setSearchTerm}
                client
                error={!!searchTerm && searchTerm?.length < 3}
              />
            )}
            {!!searchTerm && searchTerm?.length < 3 && (
              <Box display='flex' alignItems='center'>
                <Typography
                  sx={(theme) => ({
                    color: theme.palette.red[500],
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    lineHeight: '16.94px',
                    marginLeft: '4px',
                  })}
                >
                  {t('min_length_for_search_employee')}
                </Typography>
              </Box>
            )}
            {searchTerm?.length > 2 && (
              <OutsideClickHandler
                onOutsideClick={() => {
                  setSearchTerm('')
                }}
              >
                <Box className={classes.searchItemList}>
                  {size(customers) == 0 && (
                    <Box
                      id='searchResult0'
                      tabIndex={0}
                      onClick={() => {
                        setOpenClientCreateMini(true), setQuickCreateClientName(searchTerm)
                      }}
                      className={classes.noSuchClientAdd}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && fakeIndexForCheckClient === 0) {
                          setOpenClientCreateMini(true)
                        }
                      }}
                    >
                      <Typography style={{ marginLeft: '7px' }}>
                        {t('add')} “{searchTerm}”
                      </Typography>
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
                        setCustomerId({ id: item?.id, name: item?.first_name + ' ' + item?.last_name, balance: item?.balance })

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
              </OutsideClickHandler>
            )}
          </Box>
          <CheckAccess id={'new-sale-discount'}>
            <Box display={'flex'} alignItems={'center'}>
              <OutLineTextFieldThousand
                setValue={(e) => changeDiscountDebounce(e)}
                value={inputDiscount}
                type={'number'}
                fullWidth
                name='discount'
                label={'Скидка'}
                uncontrolled
                placeholder='Введите скидку'
              />
              <Box ml={'8px'}>
                <InputSwitch
                  uncontrolled
                  id='app-type'
                  name='app-type'
                  style={{ marginTop: '32px', width: 'auto' }}
                  defaultValue={discount}
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
                  <Box
                    sx={{ cursor: 'pointer', color: el === inputDiscount ? 'orange.500' : '#000' }}
                    onClick={() => setInputDiscount(el)}
                    className={classes.percent}
                  >
                    {el}%
                  </Box>
                ))}
              {discount === 'cash' &&
                [5, 10, 50, 100].map((el, index) => (
                  <Box
                    sx={{ cursor: 'pointer', color: el === inputDiscount / 1000 ? 'orange.500' : '#000' }}
                    onClick={() => setInputDiscount(`${el}000`)}
                    className={classes.percent}
                  >
                    {el}k
                  </Box>
                ))}
            </Box>
          </CheckAccess>
          <Box className={classes.priceDetails}>
            <Box display={'flex'} justifyContent={'space-between'} mb={'16px'}>
              <Typography fontWeight={'600'} fontSize={'18px'} color={'bunker.950'} lineHeight={'28px'}>
                {t('total_amount')}:
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'bunker.800'} lineHeight={'28px'}>
                {thousandDivider(get(cartItemsList, 'data.data.sum'), 'сум')}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} mb={'16px'}>
              <Typography fontWeight={'600'} fontSize={'18px'} color={'bunker.950'} lineHeight={'28px'}>
                {t('discount')}:
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'bunker.800'} lineHeight={'28px'}>
                {thousandDivider(get(cartItemsList, 'data.data.discount_amount'), 'сум')}
              </Typography>
            </Box>
            <Button
              disabled={size(get(cartItemsList, 'data.data.data')) === 0}
              onClick={() => setIsOrderDrower(true)}
              color='primary'
              sx={{ mb: '16px', display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography display={'flex'} alignItems={'center'} fontWeight={'500'} fontSize={'18px'} color={'white'} lineHeight={'26px'}>
                {t('pay')}
                <Box
                  sx={{
                    color: '#fff',
                    border: '2px solid #fff',
                    height: '34px',
                    display: 'flex',
                    padding: '2px',
                    ml: '15px',
                    fontSize: '12px',
                    minWidth: '34px',
                    alignItems: 'center',
                    borderRadius: '8px',
                    justifyContent: 'center',
                  }}
                >
                  F10
                </Box>
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'white'} lineHeight={'26px'}>
                {thousandDivider(get(cartItemsList, 'data.data.total_amount'), 'сум')}
              </Typography>
            </Button>
            <Button disabled={size(get(cartItemsList, 'data.data.data')) == 0} color='secondary' onClick={() => setIsCreateOpenDraft(true)}>
              <TimeAndDate disabled={size(get(cartItemsList, 'data.data.data'))} />
              <Typography ml={'12px'} fontWeight={'500'} fontSize={'18px'} color={'black'} lineHeight={'26px'}>
                {t('draft')}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>

      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={<BigWarningIcon />}
          title={'Удалить продукт?'}
          desc={openConfirmDialog.type === 'deleteAll' ? 'Вы хотите удалить все продукты?' : 'Вы хотите удалить продукт?'}
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
                Нет
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
                Да, Удалить
              </LoadingButton>
            </>
          }
        />
      )}
      <OrderDrawer
        cartItemsList={get(cartItemsList, 'data.data')}
        printContainer={printContainer}
        isOrderDrower={isOrderDrower}
        setInputDiscount={setInputDiscount}
        cashBoxDetails={cashBoxDetails}
        customerId={customerId}
        refetchcartItemsList={refetchcartItemsList}
        setIsOrderDrower={setIsOrderDrower}
      />
      <CreateDraftDrawer
        customerId={customerId}
        refetchcartItemsList={refetchcartItemsList}
        cashBoxDetails={cashBoxDetails}
        open={isCreateOpenDraft}
        setOpen={setIsCreateOpenDraft}
      />
      <ProductDrawer open={openProductDrawer} onClose={setOpenProductDrawer} />

      <ChangeShift open={isOpenChangeShift} setOpen={setIsOpenChangeShift} />
      <DraftDrawer cashBoxDetails={cashBoxDetails} open={isOpenDraft} setOpen={setIsOpenDraft} />
      <ReturnExchangeDrawer cashBoxDetails={cashBoxDetails} open={isOpenReturnExchange} setOpen={setIsOpenReturnExchange} />
      <ClientCreateMini
        setCustomerId={setCustomerId}
        quickCreateClientName={quickCreateClientName}
        openDrawer={openClientCreateMini}
        closeDrawer={() => setOpenClientCreateMini(false)}
        clientData={clientDetails}
        afterCreate={(clientId) => setCreatedClientId(clientId)}
      />
    </FormProvider>
  )
}

export default NewSale
