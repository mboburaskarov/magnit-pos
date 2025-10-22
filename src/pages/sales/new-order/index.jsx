import { Refresh } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, ListItem, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, head, size } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import CheckAccess from '../../../../components/CheckAccess'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import CustomImg from '../../../../components/CustomImg'
import LoadingContainer from '../../../../components/LoadingContainer'
import LoadingOverflow from '../../../../components/LoadingOverflow'
import ClientCreateMini from '../../../../components/Sales/ClientCreateMini'
import OrderDrawer from '../../../../components/Sales/ClientCreateMini/OrderDrawer'
import DraftDrawer from '../../../../components/Sales/DraftDrawer'
import OnlineSaleDrawer from '../../../../components/Sales/OnlineSaleNoor/OnlineSaleDrawer'
import ReturnExchangeDrawer from '../../../../components/Sales/ReturnExchange/ReturnExchangeDrawer'
import ShortcutsDrawer from '../../../../components/Sales/ShortcutsDrawer'
import StyledTooltip from '../../../../components/StyledTooltip'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import { error, success } from '../../../../utils/toast'
import notificationAudio from '../../../assets/audio/notification.mp3'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import useDebouncedValue from '../../../hooks/useDebouncedValue'
import CartDetailSide from './cart_detail_side'
import CartItem from './CartItem'
import CartSearchBar from './CartSearchBar'
import ChangeShift from './ChangeShift'
import CreateDraftDrawer from './createDraftDrawer'
import ImplementMarkingDialog from './ImplementMarkingDialog'
import ProductDrawer from './ProductDrawer'

import BonusProductDrawer from '../../../../components/Sales/bonusProductDrawer/BonusProductDrawer'
import SendRejectedProductDrawer from '../../../../components/Sales/SendRejectedProduct/SendRejectedProductDrawer'
import DecreasedCartItemMarkingCheck from './decreasedCartItemMarkingCheck'
import OrganizeDmedOrder from './OrganizeDmedOrder'
const useStyles = makeStyles((theme) => ({
  currentUser: {
    // minWidth: '120px',
    width: 'auto',
    height: '48px',
    padding: '4px 4px 4px 16px !important',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.gray[50],
    borderRadius: '40px !important',
  },
  avatarPlaceholder: {
    // position: 'relative',
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 12,
    fontWeight: 600,
    fontSize: 16,
    backgroundColor: theme.palette.orange[500],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    color: '#fff',
    transition: '0.3s',
    '& img': {
      width: '100%',
    },
  },
  bonus_amount: {
    margin: 0,
    lineHeight: '14px',
    fontWeight: 600,
    fontFamily: "'Gilroy', sans-serif",
    color: theme.palette.orange[500],
    fontSize: 12,
    transition: 'all .2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  shopname: {
    margin: 0,
    lineHeight: '20px',
    fontWeight: 600,
    fontFamily: "'Gilroy', sans-serif",
    color: theme.palette.bunker[400],
    fontSize: 14,
    transition: 'all .2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  username: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '600',
    lineHeight: '16px',
    fontSize: '16px',
    color: theme.palette.bunker[950],
  },
  card_detail: {
    width: '450px',
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
    borderColor: theme.palette.black,
    padding: '10px 16px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    marginTop: '20px',
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
    // position: 'absolute',
    // bottom: 20,
    // right: 0,
    // left: 0,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    // border: '1px solid',
    backgroundColor: theme.palette.white,
    borderRadius: '24px',
    // borderColor: theme.palette.bunker[100],
    boxShadow: '0px 0px 12px 0px #0000000A',
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
let a = -1
function NewSale() {
  const NotificationAudio = new Audio(notificationAudio)
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  const method = useForm()
  const classes = useStyles()
  const cartItemRef = useRef([])

  const [showOverlay, setShowOverlay] = useState(false)
  const [hasChange, setHasChange] = useState(false)
  const [isEposTurnOn, setisEposTurnOn] = useState(true)

  const [isOpenDraft, setIsOpenDraft] = useState(false)
  const [isOpenBonusProductDrawer, setIsOpenBonusProductDrawer] = useState(false)
  const [isOpenNoorDrawer, setIsOpenNoorDrawer] = useState(false)
  const [isOpenReturnExchange, setIsOpenReturnExchange] = useState(false)
  const [isOpenSendRejectedProduct, setIsOpenSendRejectedProduct] = useState(false)
  const [isCreateOpenDraft, setIsCreateOpenDraft] = useState(false)
  const [openProductDrawer, setOpenProductDrawer] = useState(false)
  const [isOpenChangeShift, setIsOpenChangeShift] = useState(false)
  const [dmedPrescriptionsList, setDmedPrescriptionsList] = useState([])
  const [liteOrder, setLiteOrder] = useState(false)
  const [sendToEpos, setSendToEpos] = useState(null)

  const [isOpenImplementMarkingDialog, setIsOpenImplementMarkingDialog] = useState(false)
  const [isOpenOrganizeDmedOrderDialog, setIsOpenOrganizeDmedOrderDialog] = useState(false)
  const [input, setInput] = useState('')
  const lastKeyPressTime = useRef(Date.now())
  const [lastNoorOrderCount, setLastNoorOrderCount] = useState(0)
  // const [searchTerm, setSearchTerm] = useState('')
  const [markingsList, setMarkingList] = useState({})
  const [dmedOrganizedList, setDmedOrganizedList] = useState([])
  const [openClientCreateMini, setOpenClientCreateMini] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [openRejectConfirmDialog, setOpenRejectConfirmDialog] = useState(null)
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
  const [serviceType, setServiceType] = useState('')
  const [isOpenRemoveMarkingDialog, setIsOpenRemoveMarkingDialog] = useState(false)
  const searchRef = useRef('')
  const searchResetRef = useRef('')
  const printContainer = useRef()
  const cartRef = cartItemRef.current

  const wsRef = useRef(null)

  // useEffect(() => {
  //   // Connect to backend

  //   const ws = new WebSocket(`wss://api-pharma.noor.uz/ws?store_id=${userData?.store?.id}`) // or wss://your-domain.com/ws
  //   wsRef.current = ws

  //   ws.onopen = () => {
  //     console.log('WebSocket connection established')
  //   }

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data)
  //     if (data?.event == 'noor_order') {
  //       refetchNoorOrderCount()
  //     }
  //     console.log('Received:', data)
  //   }

  //   ws.onerror = (error) => {
  //     console.error('WebSocket error:', error)
  //   }

  //   ws.onclose = () => {
  //     console.log('WebSocket closed')
  //   }

  //   return () => {
  //     ws.close()
  //   }
  // }, [])

  const { mutate: addDiscountCard, isLoading: isaddDiscountCard } = useMutation(requests.addDiscountCard, {
    onSuccess: ({ data }) => {
      console.log(data)

      refetchcartItemsList()
      success(`Карта скидки успешно добавлена - ${data?.data?.discount_percent}%`)
    },
    onError: (err) => {
      error('Ошибка при добавлении карты скидки')
      console.log('err', err)
    },
  })
  const { mutate: removeDiscountCard, isLoading: isremoveDiscountCard } = useMutation(requests.removeDiscountCard, {
    onSuccess: ({ data }) => {
      setCustomerId('')
      refetchcartItemsList()

      success('Карта скидки успешно удалена')
    },
    onError: (err) => {
      error('Ошибка при удалении карты скидки')
      console.log('err', err)
    },
  })
  useEffect(() => {
    if (customerId?.id && customerId?.new != false) {
      addDiscountCard({
        customer_id: customerId?.id,
        barcode: customerId?.barcode,
        sale_id: id,
      })
    }
    // refetchcartItemsList()
  }, [customerId])
  for (const key in cartRef) {
    if (cartRef[key] === null) {
      delete cartRef[key]
    }
  }
  const focusPackInput = (event, id) => {
    let clearRef = cartRef.filter((el) => el)
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      const nextInput = clearRef[a + 1]
      if (a == clearRef.length - 2) {
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
          cartRef.find((el) => el.name == `quantity_${unitId[1]}`).value = 0
        }
        const nextInput = cartRef[unitId[1] + 'unit']

        if (nextInput) {
          nextInput.focus()
        }
      }
    }
    if (event.key === '-' && !event.shiftKey) {
      const activeInput = document.activeElement
      if (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA') {
        let unitId = activeInput.name.split('unit_quantity_')

        const nextInput = cartRef.find((el) => el.name == `quantity_${unitId[1]}`)
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
  const conditionalCreateCartItem = async (params) => {
    const shouldSend = true // Your logic here
    // const shouldSend = size(get(cartItemsList, 'data.data.data')) <= 9 // Your logic here
    if (!shouldSend) {
      // Optional: throw an error or just return a dummy response
      throw new Error('Condition not met. Request not sent.')
      // or return Promise.reject({ message: 'Not allowed' })
    }
    return requests.createCartItem(params)
  }

  const { mutate: handleAddProduct, isLoading: isCreatingProduct } = useMutation(conditionalCreateCartItem, {
    onSuccess: ({ data }) => {
      const searchValue = searchRef.current.value

      if (searchValue.length > 30 && get(data, 'data.is_marking', false)) {
        //save to marking
        addNewMarking(data?.data?.id, searchValue)
      }

      searchResetRef.current.clearValue()
      searchRef?.current?.focus()
      setShowOverlay(false)
      refetchcartItemsList()
    },
    onError: (err) => {
      searchResetRef.current.clearValue()
      if (get(err, 'response.data.code') === 406) {
        success('Продажа обновлена')
        navigate(`/sales/create`)
        return
      }
      if (get(err, 'response.data.code') === 422) {
        error('Маркировка товара не соответствует его штрих-коду. Пожалуйста, введите корректную маркировку.')
        return
      }
      if (get(err, 'response.data.code') === 404) {
        error('Товар не найден или не соответствует информации в базе данных.')
        return
      }
      if (get(err, 'response.data.code') === 409) {
        error(`Описание
      Редактировать
      Введенное количество товара превышает существующее количество. 
      Максимальное количество упаковок на складе - ${get(err, 'response.data.data.pack_quantity')},
      единичное количество на складе - ${get(err, 'response.data.data.unit_quantity')}.`)
      } else {
        if (err.toString().includes('Error: Condition not met. Request not sent')) {
          error('Ошибка при создании элемента карты. Максимальное количество товаров в корзине 10')
          return
        }
        error(`Ошибка при создании элемента карты. ${err.toString().includes('Error: Condition not met. Request not sent')}`)
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
  const { mutate: sendToRejectedProduct, isLoading: issendToRejectedProduct } = useMutation(requests.sendToRejectedProduct, {
    onSuccess: () => {
      setOpenRejectConfirmDialog(false)
      setIsOpenSendRejectedProduct(false)
      navigate(`/sales/new-sale/${id}`)
      success('Продукт был отправлен в «Отказ»')
    },
    onError: (err) => {
      error('Ошибка при Продукт был отправлен в «Отказ»')
      console.log('err', err)
    },
  })

  const {
    data: cartItemsList,
    refetch: refetchcartItemsList,
    isLoading: isCartItemsLIstLoading,
  } = useQuery(['cartItemsList', id], () => requests.getCartItemList({ sale_id: id, limit: 100, offset: 0 }), {
    onSuccess: () => {
      setHasChange(false)
    },
    onError: (e) => {
      if (get(e, 'response.data.code') == '409') {
        navigate('/sales/create')
      }
    },
  })
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
  const { mutate: checkEPOSTurnOn, isLoading: ischeckEPOSTurnOn } = useMutation(requests.checkEPOSTurnOn, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        setisEposTurnOn(false)
      }
    },
    onError: (err) => {
      setisEposTurnOn(false)
      error('Программа EPOS отключена. Запустить программу EPOS (uz: epos dasturi o‘chirilgan. Epos dasturini yoqing)')
      console.log('err', err)
    },
  })
  useEffect(() => {
    checkEPOSTurnOn({
      token: 'DXJFX32CN1296678504F2',
      method: 'checkStatus',
    })
  }, [])
  useEffect(() => {
    const customer = get(cashBoxDetails, 'data.data.customer')

    if (customer?.first_name) {
      setCustomerId({ id: customer?.id, name: customer?.first_name + ' ' + customer?.first_name, balance: 0, barcode: '', new: false })
    }
  }, [cashBoxDetails])
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
        if (cartRef.findIndex((el) => el.id == document?.activeElement?.id) == cartRef.length - 1) {
          setTimeout(() => {
            cartRef[0].focus()
          }, 200)
        } else {
          a = cartRef.findIndex((el) => el.id == document?.activeElement?.id)

          setTimeout(() => {
            cartRef[a + 1].focus()
          }, 200)
        }
        deleteCartItem(document?.activeElement?.id?.split('quantity_')[1])
      }
    },
    { enableOnFormTags: true }
  )

  useHotkeys(['NumpadAdd', 'NumpadSubtract'], (event) => focusUnitInput(event), { enableOnFormTags: true, preventDefault: true })

  useHotkeys('Shift', (event) => focusedItemDetailDrawerOpen(event), { enableOnFormTags: true })

  useHotkeys(
    'F9',
    () => {
      if (isAllMarkingFill()) {
        setIsOrderDrower(true)
      } else {
        setIsOpenImplementMarkingDialog({ mode: 'full' })
      }
    },
    {
      preventDefault: true,
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
    if (Object.values(markingsList[id] || {}).includes(marking)) {
      return false
    }

    setMarkingList((prev) => ({ ...prev, [id]: { ...prev[id], [index]: marking } }))
    return true
  }
  const addNewMarking = (id, marking) => {
    if (Object.values(markingsList[id] || {}).includes(marking)) {
      return
    }

    setMarkingList((prev) => ({ ...prev, [id]: { ...prev[id], [prev[id] ? Number(Object.keys(prev[id]).pop()) + 1 : 0]: marking } }))
  }
  const removeMarking = ({ quantity, unit_per_pack, unit_quantity, id, request }) => {
    const currentCount = calculate(quantity, unit_quantity, unit_per_pack)

    const previusCount = Object.values(markingsList[id] || {})?.filter((a) => a?.length).length
    const userIsFilledMarkingCount = Object.values(markingsList[id] || {})?.filter((a) => a?.length).length

    if (userIsFilledMarkingCount > currentCount) {
      setIsOpenRemoveMarkingDialog({ diff: previusCount - currentCount, id, request, available: Object.values(markingsList[id] || {}) })
    } else {
      changeCartItemQuantity(request)
    }
  }
  const isAllMarkingFill = () => {
    const newmarkingCount = {}

    get(cartItemsList, 'data.data.data').map((item) => {
      if (item.is_marking) {
        newmarkingCount[item.id] = markingCount[item.id]
      }
    })

    const cartsMarkingCount = Object.values(newmarkingCount)?.reduce((acc, i) => acc + i, 0)
    if (cartsMarkingCount == 0) {
      return true
    }
    const userIsFilledMarkingCount = Object.values(markingsList)
      ?.map((e) => Object.values(e)?.filter((a) => a?.length))
      ?.map((e) => Object.keys(e).length)
      ?.reduce((acc, i) => acc + i, 0)
    console.log(cartsMarkingCount, userIsFilledMarkingCount)

    return cartsMarkingCount === userIsFilledMarkingCount
  }
  const isAllMarkingFillBeforeAdd = () => {
    const newmarkingCount = {}

    get(cartItemsList, 'data.data.data').map((item) => {
      if (item.is_marking) {
        newmarkingCount[item.id] = markingCount[item.id]
      }
    })

    const cartsMarkingCount = Object.values(newmarkingCount)?.reduce((acc, i) => acc + i, 0)
    const userIsFilledMarkingCount = Object.values(markingsList)
      ?.map((e) => Object.values(e)?.filter((a) => a?.length))
      ?.map((e) => Object.keys(e).length)
      ?.reduce((acc, i) => acc + i, 0)

    return cartsMarkingCount === userIsFilledMarkingCount
  }
  const cartmarkingCount = () => {
    const newmarkingCount = {}

    get(cartItemsList, 'data.data.data').map((item) => {
      if (item.is_marking) {
        newmarkingCount[item.id] = markingCount[item.id]
      }
    })

    const cartsMarkingCount = Object.values(newmarkingCount)?.reduce((acc, i) => acc + i, 0)

    return cartsMarkingCount
  }
  const filledMarkingCounts = () => {
    const newmarkingCount = {}

    get(cartItemsList, 'data.data.data').map((item) => {
      if (item.is_marking) {
        newmarkingCount[item.id] = markingCount[item.id]
      }
    })

    const userIsFilledMarkingCount = Object.values(markingsList)
      ?.map((e) => Object.values(e)?.filter((a) => a?.length))
      ?.map((e) => Object.keys(e).length)
      ?.reduce((acc, i) => acc + i, 0)

    return userIsFilledMarkingCount
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
    if (['K', 'k', 'л'].includes(event.key)) {
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
  const { data: sellerBonusInOneSale } = useQuery(
    ['sellerBonusInOneSale'],
    () => requests.getSellerBonusInOneSale({ operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), employee_id: get(userData, 'id') }),
    { enabled: get(cashBoxDetails, 'data.data.cash_box_operation_id', '')?.length > 0 }
  )
  const { data: noorOrderCount, refetch: refetchNoorOrderCount } = useQuery(['noorOrderCount'], () => requests.getNoorOrderCount({}), {
    onSuccess: ({ data }) => {
      setLastNoorOrderCount(get(data, 'data.count', 0))
      if (lastNoorOrderCount < get(data, 'data.count', 0)) {
        // NotificationAudio.play()
      }
    },
  })
  // useEffect(() => {
  //   const noorTimeout = setInterval(() => {
  //     refetchNoorOrderCount()
  //   }, 5000)

  //   return () => clearInterval(noorTimeout)
  // }, [])
  const { mutate: checkEposFlesh, isLoading: ischeckEposFlesh } = useMutation(requests.checkEposFlesh, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true) && get(data, 'message', '').includes('cannot connect card')) {
        error("EPOS Flash не установлен (EPOS qurulmasi su'g'irib qo'yilgan")
        setIsOrderDrower(false)
        setLiteOrder(false)
        return
      }
    },
    onError: (err) => {
      setIsOrderDrower(false)
      setLiteOrder(false)
      error('Ошибка EPOS getFiscalsList')
      console.log('err', err)
    },
  })
  useEffect(() => {
    if (isOrderDrower || liteOrder) {
      checkEposFlesh({
        token: 'DXJFX32CN1296678504F2',
        method: 'getFiscalsList',
        printerSize: 80,
        zReportId: 1,
      })
    }
  }, [isOrderDrower, liteOrder])
  return (
    <FormProvider {...method}>
      <LoadingOverflow fullHeight readyState={!hasChange} />
      {isEposTurnOn || get(userData, 'type') === 'SUPERADMIN' ? (
        <Box display={'flex'}>
          <Box width={'calc(100% - 384px)'} position={'relative'} padding={'20px'}>
            <Box position={'relative'}>
              <CartSearchBar
                cartItemsList={cartItemsList}
                dmedPrescriptionsList={dmedPrescriptionsList}
                setOpenRejectConfirmDialog={setOpenRejectConfirmDialog}
                setDmedPrescriptionsList={setDmedPrescriptionsList}
                discount={{ type: discount, amount: inputDiscount }}
                searchRef={searchRef}
                openDraft={() => setIsOpenDraft(true)}
                setIsOpenChangeShift={setIsOpenChangeShift}
                refetchcartItemsList={refetchcartItemsList}
                cashBoxDetails={cashBoxDetails}
                showOverlay={showOverlay}
                searchResetRef={searchResetRef}
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
                <Box display={'flex'} alignItems={'center'}>
                  <Link to={`/sales/new-sale-v2/${id}`}>
                    <Typography fontWeight={'700'} fontSize={'28px'} lineHeight={'40px'}>
                      {t('menu.orders.new_order.heading')}
                    </Typography>
                  </Link>
                  {get(cartItemsList, 'data.data.data', 0)?.length ? (
                    <StyledTooltip title={'Удалить все продукты'}>
                      <Box
                        display={'flex'}
                        sx={{ cursor: 'pointer', ml: '16px', backgroundColor: 'bg.10', p: '6px 19px', borderRadius: '40px' }}
                        height={'48px'}
                        alignItems={'center'}
                        onClick={() => setOpenConfirmDialog({ type: 'deleteAll' })}
                      >
                        <Typography onClick={() => setIsOpenOrganizeDmedOrderDialog(true)} sx={{ mr: '12px', mt: '3px', fontSize: '22px', fontWeight: '600' }}>
                          {size(get(cartItemsList, 'data.data.data', 0))}
                        </Typography>
                        <DeleteIcon width={'20px'} />
                      </Box>
                    </StyledTooltip>
                  ) : (
                    <></>
                  )}
                  <Box
                    onClick={() => {
                      refetchcartItemsList()
                      setHasChange(true)
                    }}
                    sx={{
                      cursor: 'pointer',
                      ml: '16px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'bg.10',
                      p: '6px 19px',
                      borderRadius: '40px',
                      svg: {
                        width: '23px',
                        height: '23px',
                        fill: '#fe5000',
                      },
                    }}
                  >
                    <Refresh />
                  </Box>
                </Box>
                <Box display={'flex'}>
                  <CheckAccess id={'noor-order'}>
                    <ListItem sx={{ mr: '20px' }} className={`${classes.currentUser} drawer_user_avatar`} id='avatar' onClick={() => setIsOpenNoorDrawer(true)}>
                      <Box width={'100%'} display='flex' alignItems='center' justifyContent='space-between'>
                        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                          <Typography id='user-username' className={classes.username}>
                            Онлайн-продажи
                          </Typography>
                          <p id='user-shopname' className={`${classes.bonus_amount} `}>
                            Noor
                          </p>
                        </Box>
                        <Box
                          sx={{
                            ml: '12px',
                            backgroundColor: '#fff',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '50%',
                            justifyContent: 'center',
                            '& img': {
                              width: '38px',
                            },
                          }}
                        >
                          <img src={'/noor-black.png'} />
                          {get(noorOrderCount, 'data.data.count') > 0 && (
                            <Box>
                              <Typography
                                sx={{
                                  position: 'absolute',
                                  right: -5,
                                  top: -8,
                                  backgroundColor: '#f33',
                                  color: '#fff',
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: '600',
                                }}
                              >
                                {get(noorOrderCount, 'data.data.count', 0)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                  </CheckAccess>
                  <ListItem className={`${classes.currentUser} drawer_user_avatar`} id='avatar' onClick={() => setIsUserOpen(userData)}>
                    <Box width={'100%'} display='flex' alignItems='center' justifyContent='space-between'>
                      <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
                        <Typography id='user-username' className={classes.username}>
                          {get(userData, 'first_name')}
                        </Typography>
                        <p id='user-shopname' className={`${classes.bonus_amount} `}>
                          +{thousandDivider(get(sellerBonusInOneSale, 'data.data.bonus', 0), 'сум')}
                        </p>
                      </Box>
                      <div className={classes.avatarPlaceholder}>
                        <CustomImg src={get(userData, 'photo')} />
                      </div>
                    </Box>
                  </ListItem>
                </Box>
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
                        markingsList={markingsList}
                        removeMarking={removeMarking}
                        searchRef={searchRef}
                        setOpenProductDrawer={setOpenProductDrawer}
                        // onKeyDown={(e) => handleTabSwitch(e, el?.id)}
                        refetchcartItemsList={refetchcartItemsList}
                        method={method}
                        setOpenConfirmDialog={setOpenConfirmDialog}
                        item={el}
                        packRef={(els) => (cartItemRef.current[index] = els)}
                        unitRef={(els) => (cartItemRef.current[el.id + 'unit'] = els)}
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
            setIsOpenBonusProductDrawer={setIsOpenBonusProductDrawer}
            setServiceType={setServiceType}
            serviceType={serviceType}
            setSendToEpos={setSendToEpos}
            sendToEpos={sendToEpos}
            setDmedOrganizedList={setDmedOrganizedList}
            setIsOpenOrganizeDmedOrderDialog={setIsOpenOrganizeDmedOrderDialog}
            dmedOrganizedList={dmedOrganizedList}
            setIsOpenSendRejectedProduct={setIsOpenSendRejectedProduct}
            dmedPrescriptionsList={dmedPrescriptionsList}
            cashBoxDetails={cashBoxDetails}
            setDmedPrescriptionsList={setDmedPrescriptionsList}
            saleCreate={saleCreate}
            userData={userData}
            hasChange={hasChange}
            markingsList={markingsList}
            removeDiscountCard={removeDiscountCard}
            liteOrder={liteOrder}
            setLiteOrder={setLiteOrder}
            printContainer={printContainer}
            classes={classes}
            setMarkingList={setMarkingList}
            setHasChange={setHasChange}
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
            setIsOpenDraft={setIsOpenDraft}
          />
        </Box>
      ) : (
        <Box display={'flex'} alignItems={'center'} color={'red.500'} fontSize={'20px'} fontWeight={'700'} justifyContent={'center'} height={'100vh'}>
          Программа EPOS отключена. Запустить программу EPOS{' '}
        </Box>
      )}

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
      {openRejectConfirmDialog && (
        <ConfirmDialog
          open={!!openRejectConfirmDialog}
          setOpen={setOpenRejectConfirmDialog}
          icon={<BigWarningIcon />}
          title={'Oтправить "Отказ" ?'}
          desc={'Вы хотите отправить этот продукт, чтобы "Отказ"'}
          supDesc={openRejectConfirmDialog.type === 'deleteAll' ? '' : openRejectConfirmDialog?.name}
          actions={
            <>
              <Button
                sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                onClick={() => setOpenRejectConfirmDialog(null)}
              >
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isdeleteCartItem}
                onClick={() => {
                  sendToRejectedProduct({
                    rejected_times: get(openRejectConfirmDialog, 'count'),
                    product_id: get(openRejectConfirmDialog, 'id'),
                    store_id: get(userData, 'store.id'),
                    product_name: get(openRejectConfirmDialog, 'product_name'),
                  })
                }}
              >
                Да
              </LoadingButton>
            </>
          }
        />
      )}
      <OrderDrawer
        serviceType={serviceType}
        setDmedOrganizedList={setDmedOrganizedList}
        dmedOrganizedList={dmedOrganizedList}
        cartItemsList={get(cartItemsList, 'data.data')}
        printContainer={printContainer}
        dmedPrescriptionsList={dmedPrescriptionsList}
        isOrderDrower={isOrderDrower}
        setCustomerId={setCustomerId}
        setInputDiscount={setInputDiscount}
        sendToEpos={sendToEpos}
        cashBoxDetails={cashBoxDetails}
        customerId={customerId}
        refetchcartItemsList={refetchcartItemsList}
        markingsList={markingsList}
        setDmedPrescriptionsList={setDmedPrescriptionsList}
        markingCount={markingCount}
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
        liteOrder={liteOrder}
        setLiteOrder={setLiteOrder}
        cartmarkingCount={cartmarkingCount}
        isAllMarkingFillBeforeAdd={isAllMarkingFillBeforeAdd}
        filledMarkingCounts={filledMarkingCounts}
        markingCount={markingCount}
        isAllMarkingFill={isAllMarkingFill}
        cartItems={get(cartItemsList, 'data.data.data', [])}
        markingsList={markingsList}
        setMarkingList={setMarkingList}
        refetchcartItemsList={refetchcartItemsList}
        setIsOrderDrower={setIsOrderDrower}
        open={isOpenImplementMarkingDialog}
        implementMarkingList={implementMarkingList}
        handleClose={() => setIsOpenImplementMarkingDialog(false)}
      />
      <OrganizeDmedOrder
        setDmedOrganizedList={setDmedOrganizedList}
        medicine={get(cartItemsList, 'data.data.data', [])}
        dmedPrescriptionsList={dmedPrescriptionsList}
        open={isOpenOrganizeDmedOrderDialog}
        handleClose={() => setIsOpenOrganizeDmedOrderDialog(false)}
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
      <BonusProductDrawer cashBoxDetails={cashBoxDetails} open={isOpenBonusProductDrawer} setOpen={setIsOpenBonusProductDrawer} />
      <OnlineSaleDrawer cashBoxDetails={cashBoxDetails} open={isOpenNoorDrawer} setOpen={setIsOpenNoorDrawer} />
      <ReturnExchangeDrawer cashBoxDetails={cashBoxDetails} open={isOpenReturnExchange} setOpen={setIsOpenReturnExchange} />
      <SendRejectedProductDrawer
        setOpenRejectConfirmDialog={setOpenRejectConfirmDialog}
        cashBoxDetails={cashBoxDetails}
        open={isOpenSendRejectedProduct}
        setOpen={setIsOpenSendRejectedProduct}
      />
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
