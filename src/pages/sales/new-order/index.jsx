import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, head, size } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import LoadingContainer from '../../../../components/LoadingContainer'
import LoadingOverflow from '../../../../components/LoadingOverflow'
import ClientCreateMini from '../../../../components/Sales/ClientCreateMini'
import OrderDrawer from '../../../../components/Sales/ClientCreateMini/OrderDrawer'
import DraftDrawer from '../../../../components/Sales/DraftDrawer'
import ReturnExchangeDrawer from '../../../../components/Sales/ReturnExchange/ReturnExchangeDrawer'
import ShortcutsDrawer from '../../../../components/Sales/ShortcutsDrawer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import useDebouncedValue from '../../../hooks/useDebouncedValue'
import CartItem from './CartItem'
import CartSearchBar from './CartSearchBar'
import ChangeShift from './ChangeShift'
import ImplementMarkingDialog from './ImplementMarkingDialog'
import ProductDrawer from './ProductDrawer'
import CartDetailSide from './cart_detail_side'
import CreateDraftDrawer from './createDraftDrawer'
import DecreasedCartItemMarkingCheck from './decreasedCartItemMarkingCheck'
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
  const userData = useSelector((state) => state.user)
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
  const [isOpenImplementMarkingDialog, setIsOpenImplementMarkingDialog] = useState(false)
  const [input, setInput] = useState('')
  const lastKeyPressTime = useRef(Date.now())

  // const [searchTerm, setSearchTerm] = useState('')
  const [markingsList, setMarkingList] = useState({})
  const [openClientCreateMini, setOpenClientCreateMini] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [markingCount, setMarkingCount] = useState({})
  const [customers, setCustomers] = useState([])
  const [discount, setDiscountType] = useState('percent')
  const [searchTerm, setSearchTerm, debouncedValue] = useDebouncedValue('', 200)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200)

  const [customerId, setCustomerId] = useState('')
  const [clientDetails, setClientDetails] = useState(null)
  const [quickCreateClientName, setQuickCreateClientName] = useState(null)
  const [inputDiscount, setInputDiscount] = useState(NaN)
  const [isOrderDrower, setIsOrderDrower] = useState(false)
  const [isOpenRemoveMarkingDialog, setIsOpenRemoveMarkingDialog] = useState(false)
  const searchRef = useRef('')
  const searchResetRef = useRef('')
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
    if (event.key === '+' && !event.shiftKey) {
      const activeInput = document.activeElement
      if (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA') {
        let unitId = activeInput.name.split('_')
        if (unitId[0] === 'quantity') {
          cartItemRef.current.find((el) => el.name == `quantity_${unitId[1]}`).value = 0
        }
        const nextInput = cartItemRef.current[unitId[1] + 'unit']

        if (nextInput) {
          nextInput.focus()
        }
      }
    }
    console.log(event)
    if (event.key === '-' && !event.shiftKey) {
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
  useEffect(() => {
    searchRef?.current?.focus()
  }, [searchRef.current])
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
    onSuccess: ({ data }) => {
      const searchValue = searchRef.current.value
      if (searchValue.length > 30) {
        //save to marking
        addNewMarking(data?.data?.id, searchValue)
      }
      searchResetRef.current.clearValue()

      setShowOverlay(false)
      refetchcartItemsList()
    },
    onError: (err) => {
      searchResetRef.current.clearValue()
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

  useEffect(() => {
    refetchcartItemsList()
  }, [id])
  function safeFloorDivide(a, b) {
    return b === 0 ? 0 : a === 0 ? 0 : Math.ceil(a / b)
  }
  const calculate = (quantity, unitQuantity, quantityPerPeck) => {
    if (unitQuantity > quantityPerPeck) {
      return safeFloorDivide(unitQuantity, quantityPerPeck) + quantity
    } else {
      if (unitQuantity === 0) {
        return quantity
      } else {
        return safeFloorDivide(unitQuantity, quantityPerPeck) + quantity
      }
    }
  }
  const { mutate: changeCartItemQuantity } = useMutation(requests.changeCartItemQuantity, {
    onSuccess: ({ data }) => {
      refetchcartItemsList()
    },
    onError: (err) => {
      refetchcartItemsList()
      method.setValue(`quantity_${item?.id}`, item?.quantity)
      method.setValue(`unit_quantity_${item?.id}`, item?.unit_quantity)
      if (get(err, 'response.data.code') === 409) {
        error(`Описание
Редактировать
Введенное количество товара превышает существующее количество. 
Максимальное количество упаковок на складе - ${get(err, 'response.data.data.pack_quantity')},
единичное количество на складе - ${get(err, 'response.data.data.unit_quantity')}.`)
      } else {
        error('Ошибка при получении похожих товаров.')
      }
      console.log('err', err)
    },
  })
  useEffect(() => {
    const cartList = cartItemsList?.data?.data?.data

    if (cartList?.length > 0) {
      if (isNaN(inputDiscount)) {
        const defaultType = get(head(cartList), 'discount_type', 'percent')
        setDiscountType(defaultType?.length > 0 ? defaultType : 'percent')
        setInputDiscount(get(head(cartList), 'discount_amount', 0))
      }
      cartList.map((item) => {
        setMarkingCount((p) => ({ ...p, [item.id]: calculate(item.quantity, item.unit_quantity, item.unit_per_pack) }))
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
  useHotkeys(
    'Delete',
    (event) => {
      if (document.activeElement?.id?.includes('quantity_')) {
        deleteCartItem(document?.activeElement?.id?.split('quantity_')[1])
      }
    },
    { enableOnFormTags: true }
  )

  useHotkeys(['+'], (event) => focusUnitInput(event), { enableOnFormTags: true, preventDefault: true })
  useHotkeys('Shift', (event) => focusedItemDetailDrawerOpen(event), { enableOnFormTags: true })

  useHotkeys(
    'F10',
    () => {
      if (isAllMarkingFill()) {
        setIsOrderDrower(true)
      } else {
        setIsOpenImplementMarkingDialog(true)
      }
    },
    {
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )

  const [debouncedDiscount, setDebouncedDiscount] = useState('')

  const changeDiscountDebounce = (value) => {
    setDebouncedDiscount(value)
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof debouncedDiscount !== 'number' && size(get(cartItemsList, 'data.data.data', [])) > 0) {
        changeDiscount(0)
        setInputDiscount(0)

        return
      }
      if (typeof debouncedDiscount !== 'number' || size(get(cartItemsList, 'data.data.data', [])) <= 0) {
        return
      }
      if (typeof debouncedDiscount !== 'number') {
        changeDiscount(0)
        setInputDiscount(0)

        return
      }
      setInputDiscount(0)
      setInputDiscount(debouncedDiscount)
      changeDiscount(debouncedDiscount)
    }, 200)

    return () => clearTimeout(handler)
  }, [debouncedDiscount])
  const implementMarkingList = (marking, id, index) => {
    setMarkingList((prev) => ({ ...prev, [id]: { ...prev[id], [index]: marking } }))
  }
  const addNewMarking = (id, marking) => {
    if (Object.values(markingsList[id] || {}).includes(marking)) {
      return
    }
    setMarkingList((prev) => ({ ...prev, [id]: { ...prev[id], [prev[id] ? Number(Object.keys(prev[id]).pop()) + 1 : 0]: marking } }))
  }
  const removeMarking = ({ quantity, unit_per_pack, unit_quantity, id, request }) => {
    const currentCount = calculate(quantity, unit_quantity, unit_per_pack)
    const previusCount = Object.values(markingsList[id] || {}).length
    const userIsFilledMarkingCount = Object.values(markingsList[id] || {})?.filter((a) => a?.length).length

    if (userIsFilledMarkingCount > currentCount) {
      setIsOpenRemoveMarkingDialog({ diff: previusCount - currentCount, id, request, available: Object.values(markingsList[id] || {}) })
    } else {
      changeCartItemQuantity(request)
    }
  }
  const isAllMarkingFill = () => {
    const cartsMarkingCount = Object.values(markingCount)?.reduce((acc, i) => acc + i, 0)
    const userIsFilledMarkingCount = Object.values(markingsList)
      ?.map((e) => Object.values(e)?.filter((a) => a?.length))
      ?.map((e) => Object.keys(e).length)
      ?.reduce((acc, i) => acc + i, 0)

    return cartsMarkingCount === userIsFilledMarkingCount
  }
  const isAllMarkingFillById = (id) => {
    const cartsMarkingCount = markingCount[id]
    const userIsFilledMarkingCount = Object.values(markingsList[id] || {})?.filter((a) => a?.length).length
    return cartsMarkingCount === userIsFilledMarkingCount
  }
  const removeOneMarking = (data, targetId) => {
    const result = { ...data }

    delete result[targetId]

    return result
  }
  useHotkeys('*', (event) => {
    const currentTime = Date.now()
    const timeDiff = currentTime - lastKeyPressTime.current
    lastKeyPressTime.current = currentTime

    if (timeDiff < 1000) {
      setInput((prev) => prev + event.key)
      return
    } else {
      setInput(event.key)
    }

    if (['X', 'x', 'ч'].includes(event.key)) {
      navigate(`/sales/cash-shift-detail/${get(cashBoxDetails, 'data.data.cash_box_operation_id')}?sale_id=${id}`)
      setInput('') // Reset after detection
    }
    if (['Q', 'q', 'й'].includes(event.key)) {
      size(get(cartItemsList, 'data.data.data')) !== 0 && setIsCreateOpenDraft(true)
      setInput('') // Reset after detection
    }
    if (['U', 'u', 'г'].includes(event.key)) {
      setOpenClientCreateMini(true)
      setInput('') // Reset after detection
    }
    if (['D', 'd', 'в'].includes(event.key)) {
      setIsOpenDraft(true)
      setInput('') // Reset after detection
    }
    if (['T', 't', 'е'].includes(event.key)) {
      saleCreate({ cash_box_operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), store_id: get(userData, 'store.id') })
      setInput('') // Reset after detection
    }
    if (['A', 'a', 'ф'].includes(event.key)) {
      setIsOpenChangeShift(true)
      setInput('') // Reset after detection
    }
    if (['Slash', 'Period'].includes(event.code)) {
      event.preventDefault() // Prevent the default behavior of the "/" key
      searchRef.current?.focus() // Focus the input field
    }
  })

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
              searchResetRef={searchResetRef}
              addNewMarking={addNewMarking}
              setShowOverlay={setShowOverlay}
              shouldWorkEnter={!isOpenRemoveMarkingDialog && !isOpenImplementMarkingDialog}
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
                {t('menu.orders.new_order.heading')}
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
                      implementMarkingList={implementMarkingList}
                      markingsList={markingsList}
                      removeMarking={removeMarking}
                      setMarkingList={setMarkingList}
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

        <CartDetailSide
          cashBoxDetails={cashBoxDetails}
          saleCreate={saleCreate}
          userData={userData}
          classes={classes}
          setIsOpenReturnExchange={setIsOpenReturnExchange}
          setOpenClientCreateMini={setOpenClientCreateMini}
          customerId={customerId}
          setCustomerId={setCustomerId}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          customers={customers}
          setQuickCreateClientName={setQuickCreateClientName}
          // fakeIndexForCheckClient={fakeIndexForCheckClient}
          changeDiscountDebounce={changeDiscountDebounce}
          inputDiscount={inputDiscount}
          isAllMarkingFill={isAllMarkingFill}
          setIsOrderDrower={setIsOrderDrower}
          setIsOpenImplementMarkingDialog={setIsOpenImplementMarkingDialog}
          setDiscountType={setDiscountType}
          setIsCreateOpenDraft={setIsCreateOpenDraft}
          discount={discount}
          cartItemsList={cartItemsList}
          setInputDiscount={setInputDiscount}
        />
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
                  if (openConfirmDialog.type === 'deleteOne') {
                    // return

                    setMarkingCount((p) => {
                      const newState = { ...p }
                      delete newState[openConfirmDialog.id] // Remove the key completely
                      return newState
                    })
                    setMarkingList((p) => removeOneMarking(p, openConfirmDialog.id))
                    deleteCartItem(openConfirmDialog.id)
                  } else {
                    setMarkingList({})
                    setMarkingCount(0)
                    deleteAll({ ids: get(cartItemsList, 'data.data.data', []).map((el) => el.id) })
                  }
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
        markingsList={markingsList}
        setMarkingList={setMarkingList}
        setMarkingCount={setMarkingCount}
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
      <ImplementMarkingDialog
        markingCount={markingCount}
        isAllMarkingFill={isAllMarkingFill}
        cartItems={get(cartItemsList, 'data.data.data', [])}
        markingsList={markingsList}
        setMarkingList={setMarkingList}
        setIsOrderDrower={setIsOrderDrower}
        open={isOpenImplementMarkingDialog}
        implementMarkingList={implementMarkingList}
        handleClose={() => setIsOpenImplementMarkingDialog(false)}
      />
      <DecreasedCartItemMarkingCheck
        markingCount={markingCount}
        isAllMarkingFillById={isAllMarkingFillById}
        refetchcartItemsList={refetchcartItemsList}
        cartItems={get(cartItemsList, 'data.data.data', [])}
        markingsList={markingsList}
        setMarkingList={setMarkingList}
        open={isOpenRemoveMarkingDialog}
        implementMarkingList={implementMarkingList}
        handleClose={() => setIsOpenRemoveMarkingDialog(false)}
      />
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
