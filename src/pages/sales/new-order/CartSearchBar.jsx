import React, { useEffect, useMemo, useState } from 'react'
import InputSearch from '../../../../components/Inputs/InputSearch'
import FinanceAndPaymentIcon from '../../../assets/icons/FinanceAndPaymentIcon'
import { Box, Button, Typography } from '@mui/material'
import SelectSimple from '../../../../components/Select/SelectSimple'
import HeadPhonesIcon from '../../../assets/icons/HeadPhonesIcon'
import { FormProvider, useForm } from 'react-hook-form'
import AssigneMeButton from './AssigneMeButton'
import UnlockIcon from '../../../assets/icons/UnlockIcon'
import UserOutlineIcon from '../../../assets/icons/UserOutlineIcon'
import SerchedItem from './SerchedItem'
import { makeStyles } from '@mui/styles'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { useQuery } from 'react-query'
import ButtonWithPopup from '../../../../components/Buttons/ButtonWithPopup'
import ArrowDown from '../../../assets/icons/ArrowDown'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { get } from 'lodash'
const useStyles = makeStyles((theme) => ({
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
    // padding: 3,
    zIndex: 27,
    // maxHeight: '83vh',
    // overflow: 'scroll',
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
    // backgroundColor: theme.palette.background.default,
    borderRadius: 16,
    position: 'relative',
    zIndex: 100,
    cursor: 'pointer',
    // '&:focus-visible': {
    //   transition: 'all 0.01s ease',
    //   boxShadow: `0 0 0px 3px ${theme.palette.red[500]} !important`,
    //   outline: 'transparent !important',
    //   background: theme.palette.gray[101],
    // },
  },
}))
function CartSearchBar({ handleAddProduct, showOverlay, setShowOverlay }) {
  const { values } = useQueryParams()
  const [searchTearm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)

  const productsListFilter = useMemo(() => {
    return {
      search: searchTearm,
    }
  }, [searchTearm])
  const {
    data: productsList,
    isLoading: productsListLoading,
    isFetching: isFetchingproductsList,
    refetch,
  } = useQuery(['productsList', productsListFilter], () => requests.getAllStoreProducts({ id: get(userData, 'store.id') }, productsListFilter))
  const methods = useForm()
  const classes = useStyles()
  const productsData = productsList?.data?.data
  console.log(productsList)

  return (
    <Box className={classes.quick_search} mb={4}>
      <FormProvider {...methods}>
        <Box display={'flex'}>
          <InputSearch
            id='product-search'
            style={{ zIndex: showOverlay ? 25 : 10 }}
            sx={{ marginRight: '16px !important', height: '48px !important', '& .MuiOutlinedInput-root': { height: '48px' } }}
            name='search'
            // uncontrolled
            placeholder={'Поиск: товар, категория, штрих-код'}
            fullWidth
            onChange={(e) => {
              // setFakeIndexForCheckSearch(-1)
              setSearchTerm(e.target.value)
              setShowOverlay(true)
              // setPage(1)
            }}
          />
          <Box position={'relative'} minWidth={'240px'}>
            <SelectSimple
              id='operator'
              name='operator'
              minWidth='auto'
              borderNone
              fullWidth
              placeholder={
                <Typography ml={4} color='#bdbdbd'>
                  Сотрудники
                </Typography>
              }
              // options={[]}
              getOptionLabel={(option) => (
                <Typography maxHeight={48} display='inline-flex' color='gray.600'>
                  <Box px={0.5} width={32}>
                    <UserOutlineIcon />
                  </Box>
                </Typography>
              )}
            />
            <AssigneMeButton isSelected={true} />
          </Box>
          <ButtonWithPopup
            id={'ff'}
            noArrow
            ml={'16px'}
            // endIcon={<ArrowDown />
            noMarginSvg
            placement='bottom-end'
            buttonLabel={
              <Box className='cash_register_icon_wrapper' bgcolor={'#F8F8F9'} padding={'12px'} width={'48px'} height={'48px'} borderRadius={'50%'}>
                <FinanceAndPaymentIcon />
              </Box>
            }
            popperData={[
              { title: 'Kassa aparatini yopish', icon: <UnlockIcon />, clickHandler: () => navigate('/sales/cash-shift/f') },
              { title: "Kassa aparatini o'zgartirish", icon: <FinanceAndPaymentIcon />, soon: true },
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
        {console.log(productsData)}
        {showOverlay && searchTearm && (
          <Box className={classes.searchResult}>
            {productsData?.length ? (
              productsData?.map((product) => (
                <SerchedItem
                  isChild={false}
                  handleAddProduct={handleAddProduct}
                  item={product}
                  product={get(product, 'product')}
                  searchTerm={searchTearm}
                  classes={classes}
                />
              ))
            ) : (
              <span>Dori mavjud emas</span>
            )}
          </Box>
        )}
      </FormProvider>
    </Box>
  )
}

export default CartSearchBar
