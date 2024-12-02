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
    alignItems: 'center',
    width: '100%',
    minHeight: 72,

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
  } = useQuery(['productsList', productsListFilter], () => requests.getAllProducts(productsListFilter))
  const methods = useForm()
  const classes = useStyles()
  const productsData = productsList?.data?.data?.data
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
            placeholder={'Qidirish: mahsulot, kategoriya, shtrix-kod'}
            fullWidth
            onChange={(e) => {
              // console.log(e.target.value)

              // setFakeIndexForCheckSearch(-1)
              setSearchTerm(e.target.value)
              setShowOverlay(true)
              // setPage(1)
            }}
            // }}
            // onFocus={() => event('new_sale_search_attempts')}
            // onKeyDown={(e) => {
            //   if (e.key === 'Enter') {
            //     onEnter()
            //   }
            // }}
            // disabled={webkassaOn}
            // onClick={() => setFakeIndexForCheckSearch(-1)}
            // adornmentTextHotKey={t('buttons.press')}
            // value={searchTerm}
            // handleClickGiftCards={!giftCardsRoute && !giftCardSale && handleClickGiftCards}
            // inputRef={searchInputRef}
            // setSearchTerm={setSearchTerm}
          />
          <Box position={'relative'} minWidth={'240px'}>
            <SelectSimple
              id='operator'
              name='operator'
              minWidth='auto'
              fullWidth
              placeholder={
                <Typography ml={4} color='#bdbdbd'>
                  Sotuvchi
                </Typography>
              }
              // options={[]}
              getOptionLabel={(option) => (
                <Typography maxHeight={48} display='inline-flex' color='gray.600'>
                  <Box px={0.5} width={32}>
                    <UserOutlineIcon />
                  </Box>
                  {/* {option.fullName} */}
                </Typography>
              )}

              // filterOption={(candidate, input) => {
              //   const formatText = (text) => {
              //     const newText = String(text)?.toLowerCase()?.replaceAll(' ', '')
              //     return newText
              //   }
              //   const inputFrmttd = formatText(input)
              //   return formatText(candidate?.data?.fullName)?.includes(inputFrmttd) || formatText(candidate?.data?.phone)?.includes(inputFrmttd)
              // }}
            />
            <AssigneMeButton isSelected={true} />
          </Box>
          <ButtonWithPopup
            id={'ff'}
            noArrow
            // endIcon={<ArrowDown />}
            noMarginSvg
            placement='bottom-end'
            buttonLabel={
              <Box ml={'16px'} className='cash_register_icon_wrapper' bgcolor={'#F8F8F9'} padding={'12px'} width={'48px'} height={'48px'} borderRadius={'50%'}>
                <FinanceAndPaymentIcon />
              </Box>
            }
            popperData={[
              { title: 'Kassa aparatini yopish', icon: <UnlockIcon /> },
              { title: "Kassa aparatini o'zgartirish", icon: <FinanceAndPaymentIcon />, soon: true },
            ]}
            // popperContentProps={{
            //   customDateRanges: customDateRanges(),
            //   onCustomRangeSelect: (name) => setCustomDateRangeSelected(name),
            //   isFilter: true,
            //   dateState: {
            //     from: dateState.from,
            //     to: dateState.to,
            //     month: dateState.month,
            //   },
            //   setDateState: (val) => setDateState(val),
            //   onClose: (data) => onClose(data),
            // }}
            // PopperContent={DateFilterDrawerSingle}
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
              productsData?.map((product) => <SerchedItem handleAddProduct={handleAddProduct} product={product} searchTerm={searchTearm} classes={classes} />)
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
