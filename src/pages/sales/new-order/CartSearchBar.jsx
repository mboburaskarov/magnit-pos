import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, head, size } from 'lodash'
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import ButtonWithPopup from '../../../../components/Buttons/ButtonWithPopup'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import InputSearch from '../../../../components/Inputs/InputSearch'
import StyledTooltip from '../../../../components/StyledTooltip'
import extractNumbers from '../../../../utils/extractBarcodeFromMarking'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import FinanceAndPaymentIcon from '../../../assets/icons/FinanceAndPaymentIcon'
import UnlockIcon from '../../../assets/icons/UnlockIcon'
import SerchedItem from './SerchedItem'
const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 30,
    borderRadius: '50%',
  },
  overlay: {
    cursor: 'pointer',
    position: 'fixed',
    backgroundColor: theme.palette.black + '60',
    zIndex: ({ searchTerm }) => (searchTerm ? 101 : 24),
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  quick_search: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
  },
  itemPrice: {
    fontWeight: '500',
    lineHeight: '24px',
    fontSize: '16px',
    color: theme.palette.bunker[950],
  },
  searchResult: {
    height: '100vh',
    overflowY: 'auto',
    zIndex: 27,
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.gray[300],
      width: 6,
      borderRadius: 2,
    },
  },
  searchImage: {
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    width: '48px',
    minWidth: '48px',
    height: '48px',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  itemName: {
    marginBottom: 4,
    color: theme.palette.orange[500],
    // width: 300,
    fontWeight: '600',
    lineHeight: '24px',
    fontSize: '16px',
    wordWrap: 'break-word',
    '& .highlighter': {
      backgroundColor: theme.palette.orange[150],
      padding: '4px 1px',
      borderRadius: '4px',
      color: theme.palette.orange[500],
    },
  },
  itemBarcode: {
    fontWeight: '500',
    lineHeight: '20px',
    fontSize: '14px',
    color: theme.palette.bunker[500],
  },
  itemQuantity: {
    fontWeight: '500',
    lineHeight: '20px',
    fontSize: '14px',
    color: theme.palette.bunker[500],
  },
  searchItemBox: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    maxHeight: '90px',
    backgroundColor: '#fff',
    padding: '12px 12px 12px 16px',
    borderRadius: 16,
  },
  searchItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    width: '100%',
    minHeight: 72,
    flexDirection: 'column',
    marginTop: 16,
    borderRadius: 16,
    position: 'relative',
    zIndex: 100,
    cursor: 'pointer',
  },
  currentUser: {
    maxWidth: '200px',
    height: '48px',
    padding: '4px 12px 4px 4px !important',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.gray[50],
    borderRadius: '32px !important',
  },
  avatarPlaceholder: {
    position: 'relative',
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
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
    width: 130,
    margin: 0,
    lineHeight: '19px',
    fontWeight: 600,
    fontFamily: "'Gilroy', sans-serif",
    color: theme.palette.orange[500],
    fontSize: 16,
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
    lineHeight: '24px',
    fontSize: '16px',
    color: theme.palette.bunker[950],
  },
}))
let a = -1
function CartSearchBar({
  refetchcartItemsList,
  openDraft,
  discount,
  addNewMarking,
  searchResetRef,
  searchRef,

  handleAddProduct,
  setIsOpenChangeShift,
  cashBoxDetails,
  showOverlay,
  shouldWorkEnter,
  setShowOverlay,
}) {
  const [searchTearm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [closeCashBox, setCloseCashBox] = useState(false)
  const [debouncedSearchTerm] = useDebounce(searchTearm, 200)
  const searchItemRef = useRef([])
  const userData = useSelector((state) => state.user)
  const { id } = useParams()
  useImperativeHandle(searchResetRef, () => ({
    clearValue: () => setSearchTerm(''),
  }))

  const productsListFilter = useMemo(() => {
    return {
      search: searchTearm.slice(0, 31),
    }
  }, [debouncedSearchTerm])
  const { data: productsList } = useQuery(['storeProductsList', productsListFilter], () =>
    requests.getAllStoreProducts({ id: get(userData, 'store.id') }, productsListFilter)
  )
  const { data: sellerBonusInOneSale } = useQuery(
    ['sellerBonusInOneSale'],
    () => requests.getSellerBonusInOneSale({ operation_id: get(cashBoxDetails, 'data.data.cash_box_operation_id'), employee_id: get(userData, 'id') }),
    { enabled: get(cashBoxDetails, 'data.data.cash_box_operation_id', '')?.length > 0 }
  )
  const { data: darftList, refetch, isDarftList } = useQuery(['darftList'], () => requests.getDarftList())

  const methods = useForm()
  const classes = useStyles()
  const productsData = productsList?.data?.data

  const selectDownItems = () => {
    if (a == searchItemRef.current.length - 1) {
      a = 0
    } else {
      a = a + 1
    }

    const nextInput = searchItemRef.current[a]
    if (nextInput) {
      nextInput.focus()
    }
  }
  const selectUpItems = () => {
    if (a == 0) {
      a = searchItemRef.current.length - 1
    } else {
      a = a - 1
    }
    const nextInput = searchItemRef.current[a]

    if (nextInput) {
      nextInput.focus()
    }
  }
  useHotkeys('j', () => methods.setFocus('product-search'), {
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  useHotkeys('ArrowDown', (event) => selectDownItems(event), { enableOnFormTags: true })
  useHotkeys(
    'Enter',
    (event) => {
      if (!shouldWorkEnter) {
        return
      }
      if (document.activeElement.id?.length === 36) {
        // setSearchTerm('')
        setShowOverlay(false)

        handleAddProduct({
          discount_type: get(discount, 'type', 'percent'),
          discount_value: Number(get(discount, 'amount', 0)),
          store_product_id: get(document, 'activeElement.id', 'err #3'),
          sale_id: id,
          type: 'cart_item_select',
        })
      }
    },
    {
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  useHotkeys('ArrowUp', (event) => selectUpItems(event), { enableOnFormTags: true })
  return (
    <Box className={classes.quick_search} mb={4}>
      <FormProvider {...methods}>
        <Box display={'flex'}>
          <InputSearch
            inputRef={searchRef}
            id='product-search'
            hasShortCut
            disabled={get(cashBoxDetails, 'data.data.sale_type') == 'RETURN'}
            style={{ zIndex: showOverlay ? 25 : 10 }}
            sx={{ width: '100%', marginRight: '16px !important', height: '48px !important', '& .MuiOutlinedInput-root': { height: '48px' } }}
            name='search'
            placeholder={'Поиск: товар, категория, штрих-код'}
            fullWidth
            onFocus={() => {
              a = 0
              setShowOverlay(true)
            }}
            value={searchTearm}
            setSearchTerm={setSearchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
            }}
            onKeyDown={(e) => {
              setShowOverlay(true)

              if (e.key == 'Escape') {
                e.preventDefault()
                setShowOverlay(false)
              }
              if (e.key == 'Enter') {
                setShowOverlay(false)
                if (productsData.length !== 1) {
                  console.log(extractNumbers(searchTearm), productsData)

                  handleAddProduct({
                    discount_type: get(discount, 'type', 'percent'),
                    discount_value: Number(get(discount, 'amount', 0)),
                    sale_id: id,
                    type: 'first_item',
                    barcode: get(head(productsData), 'barcode'),
                  })
                } else {
                  const markingBarcode = extractNumbers(searchTearm)
                  const productBarcode = get(head(productsData), 'barcode')
                  if (markingBarcode != productBarcode) {
                    error('xato barcode yoki markirofka')
                    return
                  }
                  handleAddProduct({
                    discount_type: get(discount, 'type', 'percent'),
                    discount_value: Number(get(discount, 'amount', 0)),
                    sale_id: id,
                    type: 'marking',
                    barcode: searchTearm.slice(0, 31),
                  })
                }
              }
            }}
          />
          <StyledTooltip title={'Закрыть кассу & Обмен сменами'}>
            <ButtonWithPopup
              id={'ff'}
              noArrow
              // ml={'16px'}
              sx={{ height: '48px', width: 48, border: '1px solid transparent !important' }}
              noMarginSvg
              placement='bottom-end'
              onClick={() => refetch()}
              buttonLabel={
                <Box
                  sx={{ '&:hover': { bgcolor: 'transparent !important' } }}
                  className='cash_register_icon_wrapper'
                  bgcolor={'bg.10 !important'}
                  padding={'10px'}
                  width={'48px'}
                  height={'48px'}
                  borderRadius={'50%'}
                >
                  <FinanceAndPaymentIcon />
                </Box>
              }
              popperData={[
                {
                  title: 'Закрыть кассу',
                  icon: <UnlockIcon />,
                  clickHandler: () => {
                    if (size(get(darftList, 'data.data.data')) > 0) {
                      setCloseCashBox(true)
                    } else {
                      navigate(`/sales/cash-shift-detail/${get(cashBoxDetails, 'data.data.cash_box_operation_id')}?sale_id=${id}`)
                    }
                  },
                },
                { title: 'Обмен сменами', icon: <FinanceAndPaymentIcon />, soon: false, clickHandler: () => setIsOpenChangeShift(true) },
              ]}
            />
          </StyledTooltip>
        </Box>
        {showOverlay && searchTearm && (
          <div
            onClick={() => {
              setShowOverlay(false)
            }}
            className={classes.overlay}
          />
        )}
        {showOverlay && searchTearm && (
          <Box className={classes.searchResult}>
            {productsData?.length ? (
              productsData?.map((product, index) => (
                <SerchedItem
                  isChild={false}
                  discount={discount}
                  index={index}
                  handleAddProduct={handleAddProduct}
                  setSearchTerm={setSearchTerm}
                  item={product}
                  itemRef={(el) => (searchItemRef.current[index] = el)}
                  product={product}
                  searchTerm={'searchTearm'}
                  classes={classes}
                />
              ))
            ) : (
              <Box sx={{ zIndex: 999999, display: 'flex', justifyContent: 'center', paddingTop: '75px', height: '100vh' }}>
                <Typography zIndex={'9999999'} fontSize={'25px'} fontWeight={'600'} color={'#fff'}>
                  Продукт не найден
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {closeCashBox && (
          <ConfirmDialog
            open={closeCashBox}
            setOpen={setCloseCashBox}
            icon={<BigWarningIcon />}
            title={'Закрыть кассу?'}
            desc={'Сначала очистите черновики, а затем закройте кассу или нажмите «Продолжить», чтобы оставить черновики без изменений.'}
            supDesc={'Есть черновики.'}
            actions={
              <>
                <Button
                  sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                  fullWidth
                  color='secondary'
                  variant='contained'
                  onClick={() => {
                    openDraft()
                    setCloseCashBox(false)
                  }}
                >
                  Просмотреть черновики
                </Button>
                <LoadingButton
                  variant='contained'
                  type='button'
                  // loading={isdeleteCartItem}
                  onClick={() => {
                    navigate(`/sales/cash-shift-detail/${get(cashBoxDetails, 'data.data.cash_box_operation_id')}?sale_id=${id}`)
                  }}
                >
                  Продолжить
                </LoadingButton>
              </>
            }
          />
        )}
      </FormProvider>
    </Box>
  )
}

export default CartSearchBar
