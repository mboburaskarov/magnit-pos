import { Box, Typography } from '@mui/material'
import Highlighter from 'react-highlight-words'

import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import PrizeBoxIcon from '../../../src/assets/icons/PrizeBoxIcon'
import { useQueryParams } from '../../../src/hooks/useQueryParams'
import thousandDivider from '../../../utils/thousandDivider'
import CustomImg from '../../CustomImg'

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
    width: '384px',
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
    // marginTop: 16,
    // borderRadius: 16,
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
export default function ResultItem({
  index,
  handleAddProduct,
  discount,
  setOpenRejectConfirmDialog,
  itemRef,
  fakeIndexForCheckSearch,
  item,
  conflictItem = false,
  isSimilar = false,
  isChild = true,
  setSearchTerm,
  searchTerm,
  lastElementRef,
  product,
}) {
  const classes = useStyles()
  const [itemCount, setItemcount] = useState(1)
  const { values } = useQueryParams()

  useEffect(() => {
    setItemcount(1)
  }, [values?.search])
  console.log(product, item)

  return (
    // <Box className={classes.searchResult}>
    <Box
      id={item?.id}
      className={classes.searchItem + ' search-item'}
      // onClick={() => {
      //   handleAddProduct({
      //     discount_type: get(discount, 'type', 'percent'),
      //     discount_value: Number(get(discount, 'amount', 0)),
      //     sale_id: id,
      //     store_product_id: get(product, 'id', 'err #1'),
      //   })
      // }}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        outline: 'none',
      }}
      tabIndex={index}
      key={index}
      ref={itemRef}
    >
      <Box display={'flex'} width={'100%'} alignItems={'center'}>
        <Box
          className={classes.searchItemBox + ' main-Box'}
          sx={{
            borderTopLeftRadius: index == 0 ? 16 : 0,
            borderBottomLeftRadius: index == 29 ? 16 : 0,
            borderTopRightRadius: index == 0 ? 16 : 0,
            borderBottomRightRadius: index == 29 ? 16 : 0,
          }}
        >
          <Box flex='1 0 20%' maxWidth={'100%'} overflow={'hidden'} display='flex' alignItems='center'>
            <div className={classes.searchImage}>
              <CustomImg src={product?.main_photo || '65eb3e64-185f-4642-8261-1aeec7379760.jpg'} />
            </div>
            <Box ml={2} width={'100%'} overflow={'hidden'}>
              <Typography
                textOverflow={'ellipsis'}
                maxWidth={'calc(100% - 1px)'}
                whiteSpace={'nowrap'}
                // style={{ textDecoration: get(product, 'expire_day', 0) <= 0 ? 'line-through' : 'none' }}
                overflow={'hidden'}
                id='product-name'
                className={classes.itemName}
              >
                <Highlighter
                  highlightClassName='highlighter'
                  searchWords={[searchTerm]}
                  autoEscape
                  textToHighlight={`${product?.name} / ${product?.category_name} (${product?.producer_name})`}
                />
              </Typography>
              <Typography display={'flex'} id='product-barcode'>
                <Highlighter
                  highlightClassName='highlighter'
                  searchWords={searchTerm ? searchTerm?.split(' ') : []}
                  autoEscape
                  className={classes.itemBarcode}
                  textToHighlight={product?.barcode}
                />
                <Typography color={get(product, 'expire_day', 0) < 0 ? 'red.500' : 'bunker.700'} fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'}>
                  {/* / {dayjs(get(product, 'expire_date')).format('DD.MM.YYYY')} ({get(product, 'expire_day', 0)} kun) */}
                </Typography>
              </Typography>
            </Box>
          </Box>
          {item?.bonus_amount > 0 && (
            <Box
              sx={{
                borderRadius: '24px',
                padding: '0 9px',
                height: '22px',
                display: 'flex',
                mr: '10px',
                alignItems: 'center',
                backgroundColor: 'orange.500',
              }}
            >
              <PrizeBoxIcon />
              <Typography ml='4px' color={'white'} fontSize={'10px'} fontWeight={'600'}>
                {thousandDivider(item.bonus_amount, 'сум')}
              </Typography>
            </Box>
          )}
          {/* {!conflictItem && (
            <Box flex='0 0 22%' pr={2} textAlign='right'>
              <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
                <Box>
                  <Typography whiteSpace={'pre'} className={classes.itemQuantity}>
                    <span>Кол: {item?.quantity}</span>
                  </Typography>
                  <Typography whiteSpace={'pre'} className={classes.itemPrice}>
                    {thousandDivider(product?.retail_price, 'сум')}{' '}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )} */}
        </Box>
      </Box>
    </Box>
    // </Box>
  )
}
