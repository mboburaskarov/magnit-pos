import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { convertoRuOrEngToEng } from '@utils/convertoRuOrEngToEng';
import ButtonWithPopup from '@components/Buttons/ButtonWithPopup';
import FinanceAndPaymentIcon from '@icons/FinanceAndPaymentIcon';
import { useNavigate, useParams } from 'react-router-dom';
import InputSearch from '@components/Inputs/InputSearch';
import { FormProvider, useForm } from 'react-hook-form';
import { convertEngToRu } from '@utils/convertoEngToRu';
import { Box, Button, Typography } from '@mui/material';
import StyledTooltip from '@components/StyledTooltip';
import ConfirmDialog from '@components/ConfirmDialog';
import RussianFlagIcon from '@icons/RussianFlagIcon';
import { useMutation, useQuery } from 'react-query';
import BigWarningIcon from '@icons/BigWarningIcon';
import { useHotkeys } from 'react-hotkeys-hook';
import UnlockIcon from '@icons/UnlockIcon';
import { useDebounce } from 'use-debounce';
import { requests } from '@utils/requests';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { get, head, size } from 'lodash';
import { error } from '@utils/toast';

import SerchedItem from './SerchedItem';


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
    borderRadius: 16,
    marginTop: '10px',
    height: 'calc(100vh - 80px)',

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
    backgroundColor: theme.palette.gray[50],
    padding: '12px 12px 12px 16px',
  },
  searchItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    width: '100%',
    minHeight: 72,
    flexDirection: 'column',
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

let a = -2

function CartSearchBar({
  cartItemsList,
  openDraft,
  dmedPrescriptionsList,
  setDmedPrescriptionsList,
  discount,
  setOpenRejectConfirmDialog,
  searchResetRef,
  searchRef,
  handleAddProduct,
  setIsOpenChangeShift,
  cashBoxDetails,
  showOverlay,
  shouldWorkEnter,
  setShowOverlay,
}) {
  const methods = useForm()
  const classes = useStyles()
  const [searchTearm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [closeCashBox, setCloseCashBox] = useState(false)
  const [debouncedSearchTerm] = useDebounce(searchTearm, 200)
  const searchItemRef = useRef([])
  const [inputlang, setInputLang] = useState('ru')

  const { mutate: getDmedPrescriptions, isLoading: isgetDmedPrescriptions } = useMutation(requests.getDmedPrescriptions, {
    onSuccess: ({ data }) => {
      setDmedPrescriptionsList(data?.data)
      setShowOverlay(false)
      setSearchTerm('')
    },
    onError: (err) => {
      setSearchTerm('')

      error('Ошибка при DMED')
      console.error('err', err)
    },
  })

  useEffect(() => {
    setInputLang(localStorage.getItem('inputlang') === 'ru' ? 'ru' : 'en')
  }, [])
  const userData = useSelector((state) => state.user)
  const { id } = useParams()
  useImperativeHandle(searchResetRef, () => ({
    clearValue: () => setSearchTerm(''),
  }))

  const productsListFilter = useMemo(() => {
    return {
      search: searchTearm.slice(0, 31),
      offset: 0,
      limit: 30,
    }
  }, [debouncedSearchTerm])
  const { data: productsList, isFetching: isProductsFetching } = useQuery(
    ['storeProductsList', productsListFilter],
    () => requests.getAllStoreProducts({ id: get(userData, 'store.id') }, productsListFilter),
    { enabled: searchTearm.length > 0 }
  )

  const { data: darftList, refetch, isDarftList } = useQuery(['darftList'], () => requests.getDarftList({ store_id: get(userData, 'store.id') }))

  const productsData = productsList?.data?.data

  useEffect(() => {
    a = -1
  }, [searchTearm])
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

  useHotkeys(
    'ctrl+shift',
    () => {
      if (inputlang === 'en') {
        setInputLang('ru')
        localStorage.setItem('inputlang', 'ru')
      } else {
        setInputLang('en')
        localStorage.setItem('inputlang', 'en')
      }
    },
    {
      enableOnFormTags: true,
    }
  )

  useHotkeys(
    'Escape',
    (event) => {
      setSearchTerm('')
      searchRef.current.value = ''
      searchRef.current.focus()
    },
    { enableOnFormTags: true }
  )

  useHotkeys('ArrowDown', (event) => selectDownItems(event), { enableOnFormTags: true })
  useHotkeys(
    'Enter',
    (event) => {
      if (!shouldWorkEnter) {
        return
      }
      if (document.activeElement.id?.length === 36) {
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
    <Box className={classes.quick_search} mb='16px'>
      <FormProvider {...methods}>
        <Box display={'flex'}>
          <InputSearch
            inputRef={searchRef}
            id='product-search'
            hasShortCut
            disabled={
              get(cashBoxDetails, 'data.data.sale_type') == 'RETURN' ||
              (dmedPrescriptionsList.length == size(get(cartItemsList, 'data.data.data', 0)) && size(get(cartItemsList, 'data.data.data', 0) != 0))
            }
            style={{ zIndex: showOverlay ? 25 : 10 }}
            sx={{ width: '100%', marginRight: '16px !important', height: '40px !important', '& .MuiOutlinedInput-root': { height: '48px' } }}
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
              if (inputlang === 'ru') {
                setSearchTerm(convertEngToRu(e.target.value))
              } else {
                setSearchTerm(e.target.value)
              }
            }}
            onKeyDown={(e) => {
              setShowOverlay(true)

              if (e.key == 'Escape') {
                e.preventDefault()
                setShowOverlay(false)
              }
              if (e.key == 'Enter') {
                if (searchTearm.includes('prescriptions')) {
                  let patient_id = searchTearm?.split('-')?.[1]
                  let safe_code = searchTearm?.split('-')?.[2]
                  getDmedPrescriptions({ patient_id, safe_code, sale_id: id })
                  return
                }

                if (searchTearm?.length < 50) return

                setShowOverlay(false)
                if (productsData?.length === 1 || searchTearm?.length < 8) {
                  handleAddProduct({
                    discount_type: get(discount, 'type', 'percent'),
                    discount_value: Number(get(discount, 'amount', 0)),
                    sale_id: id,
                    type: 'first_item',
                    barcode: get(head(productsData), 'barcode'),
                  })
                } else {
                  if (inputlang === 'ru') {
                    handleAddProduct({
                      discount_type: get(discount, 'type', 'percent'),
                      discount_value: Number(get(discount, 'amount', 0)),
                      sale_id: id,
                      type: 'marking',
                      barcode: convertoRuOrEngToEng(searchTearm.slice(0, 31)),
                    })
                  } else {
                    handleAddProduct({
                      discount_type: get(discount, 'type', 'percent'),
                      discount_value: Number(get(discount, 'amount', 0)),
                      sale_id: id,
                      type: 'marking',
                      barcode: searchTearm.slice(0, 31),
                    })
                  }
                }
              }
            }}
          />
          <StyledTooltip title={'Сменить язык'}>
            <Box
              onClick={() => {
                if (inputlang === 'en') {
                  setInputLang('ru')
                  localStorage.setItem('inputlang', 'ru')
                } else {
                  setInputLang('en')
                  localStorage.setItem('inputlang', 'en')
                }
              }}
              sx={{
                bgcolor: 'bg.10',
                height: '40px',
                width: '40px',
                userSelect: 'none',
                flexShrink: 0,
                mr: '16px',
                display: 'flex',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid transparent !important',
                borderColor: inputlang == 'ru' ? '#fe5000 !important' : 'transparent',
              }}
            >
              <RussianFlagIcon />
            </Box>
          </StyledTooltip>
          <StyledTooltip title={'Закрыть кассу & Обмен сменами'}>
            <ButtonWithPopup
              id={'ff'}
              noArrow
              sx={{ height: '40px', width: 40, border: '1px solid transparent !important' }}
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
                  setOpenRejectConfirmDialog={setOpenRejectConfirmDialog}
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
            desc={'Сначала очистите черновики, а затем закройте кассу.'}
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
              </>
            }
          />
        )}
      </FormProvider>
    </Box>
  )
}

export default CartSearchBar
