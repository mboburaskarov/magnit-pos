import { Box, ListItem, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import React, { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ButtonWithPopup from '../../../../components/Buttons/ButtonWithPopup'
import InputSearch from '../../../../components/Inputs/InputSearch'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import FinanceAndPaymentIcon from '../../../assets/icons/FinanceAndPaymentIcon'
import UnlockIcon from '../../../assets/icons/UnlockIcon'
import UserOutlineIcon from '../../../assets/icons/UserOutlineIcon'
import AssigneMeButton from './AssigneMeButton'
import SerchedItem from './SerchedItem'
import { useHotkeys } from 'react-hotkeys-hook'
import { error } from '../../../../utils/toast'
import ArrowDown from '../../../assets/icons/ArrowDown'
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
    width: 'calc(100% - 168px)',
    display: 'flex',
    backgroundColor: '#fff',
    padding: '12px 16px',
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
    cursor: 'pointer',
    maxWidth: '200px',
    marginTop: 'auto !important',
    padding: '4px 12px 4px 4px !important',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.gray[50],
    borderRadius: '32px !important',
    '&:hover': {
      backgroundColor: theme.palette.bunker[100],
    },
  },
  avatarPlaceholder: {
    position: 'relative',
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
    fontWeight: 600,
    fontSize: 16,
    backgroundColor: theme.palette.green[600],
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
function CartSearchBar({ refetchcartItemsList, searchRef, handleAddProduct, setIsOpenChangeShift, cashBoxDetails, showOverlay, setShowOverlay }) {
  const [searchTearm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  const { id } = useParams()

  const productsListFilter = useMemo(() => {
    return {
      search: searchTearm,
    }
  }, [searchTearm])
  const { data: productsList } = useQuery(['storeProductsList', productsListFilter], () =>
    requests.getAllStoreProducts({ id: get(userData, 'store.id') }, productsListFilter)
  )
  const methods = useForm()
  const classes = useStyles()
  const productsData = productsList?.data?.data
  const { mutate: getStoreProductByBarcode } = useMutation(requests.getStoreProductByBarcode, {
    onSuccess: ({ data }) => {
      // if (data?.length) {
      setSearchTerm('')
      refetchcartItemsList()
      // }
      setShowOverlay(false)
    },
    onError: (err) => {
      error('Ошибка при получении похожих товаров.')
      console.log('err', err)
      setShowOverlay(false)
    },
  })
  // useHotkeys(
  //   't',
  //   () =>
  //     getStoreProductByBarcode({
  //       data: {
  //         sale_id: id,
  //         barcode: searchTearm,
  //       },
  //     }),
  //   { enabled: true, enableOnTags: ['INPUT', 'TEXTAREA'] }
  // )
  useHotkeys('j', () => methods.setFocus('product-search'), {
    enableOnTags: ['INPUT', 'TEXTAREA'],
  })
  return (
    <Box className={classes.quick_search} mb={4}>
      <FormProvider {...methods}>
        <Box display={'flex'}>
          <InputSearch
            inputRef={searchRef}
            id='product-search'
            hasShortCut
            style={{ zIndex: showOverlay ? 25 : 10 }}
            sx={{ marginRight: '16px !important', height: '48px !important', '& .MuiOutlinedInput-root': { height: '48px' } }}
            name='search'
            placeholder={'Поиск: товар, категория, штрих-код'}
            fullWidth
            value={searchTearm}
            setSearchTerm={setSearchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowOverlay(true)
            }}
            onKeyDown={({ key }) =>
              key == 'Enter' &&
              getStoreProductByBarcode({
                sale_id: id,
                barcode: searchTearm,
              })
            }
          />
          <ListItem className={`${classes.currentUser} drawer_user_avatar`} id='avatar' onClick={() => setIsUserOpen(userData)}>
            <Box mr={'15px'} display='flex' alignItems='center' justifyContent='flex-start'>
              <div className={classes.avatarPlaceholder}>
                <img src={get(userData, 'photo')} />
              </div>

              <Box maxWidth='73%'>
                <Typography id='user-username' className={classes.username}>
                  {get(userData, 'first_name')}
                </Typography>
                <p id='user-shopname' className={`${classes.shopname} shopname`}>
                  {get(userData, 'store.name')}
                </p>
              </Box>
            </Box>
            {/* <Box display={'flex'} alignItems={'center'}>
              <ArrowDown />
            </Box> */}
          </ListItem>
          {/* <Box position={'relative'} minWidth={'240px'}>
            <SelectSimple
              id='operator'
              name='operator'
              minWidth='auto'
              borderNone
              fullWidth
              disabled
              placeholder={
                <Typography ml={4} color='bunker.950'>
                  {get(userData, 'first_name')}
                </Typography>
              }
              getOptionLabel={(option) => (
                <Typography maxHeight={48} display='inline-flex' color='gray.600'>
                  <Box px={0.5} width={32}>
                    <UserOutlineIcon />
                  </Box>
                </Typography>
              )}
            />
            <AssigneMeButton classes={classes} userData={userData} isSelected={true} />
          </Box> */}
          <ButtonWithPopup
            id={'ff'}
            noArrow
            ml={'16px'}
            noMarginSvg
            placement='bottom-end'
            buttonLabel={
              <Box className='cash_register_icon_wrapper' bgcolor={'#F8F8F9'} padding={'12px'} width={'48px'} height={'48px'} borderRadius={'50%'}>
                <FinanceAndPaymentIcon />
              </Box>
            }
            popperData={[
              {
                title: 'Закрыть кассу',
                icon: <UnlockIcon />,
                clickHandler: () => navigate(`/sales/cash-shift/${get(cashBoxDetails, 'data.data.cash_box_operation_id')}?sale_id=${id}`),
              },
              { title: 'Обмен сменами', icon: <FinanceAndPaymentIcon />, soon: false, clickHandler: () => setIsOpenChangeShift(true) },
            ]}
          />
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
              productsData?.map((product) => (
                <SerchedItem
                  isChild={false}
                  handleAddProduct={handleAddProduct}
                  setSearchTerm={setSearchTerm}
                  item={product}
                  product={product}
                  searchTerm={searchTearm}
                  classes={classes}
                />
              ))
            ) : (
              <></>
            )}
          </Box>
        )}
      </FormProvider>
    </Box>
  )
}

export default CartSearchBar
