import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
// import ImageGallery from 'components/ImageGallery/ImageGallery'
import PencilIcon from '../../../assets/icons/ArrowDown'
import TrashIconGray from '../../../assets/icons/ArrowDown'
import React, { memo, useState } from 'react'
// import { asyncRemoveFromCartAction } from 'store/actions/cartActions/cartActions'
import event from '../../../../utils/event'
import { numberToPrice } from '../../../../utils/numberToPrice'
import InputQuantity from '../../../../components/Inputs/InputQuantity'
import EditorIcon from '../../../assets/icons/EditorIcon'
import EditIcon from '../../../assets/icons/EditIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import SelectSimple from '../../../../components/Select/SelectSimple'

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: 16,
    borderRadius: 16,
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    background: theme.palette.bg[10],
    marginBottom: 8,
    height: '80px',
    '& .MuiFormControl-root': {
      backgroundColor: 'transparent',
    },
    '& .MuiInputBase-root': {
      '& input[type=number]': {
        padding: '10px 0px 10px 10px !important',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '28px',
      },
      borderRadius: '12px',
      // border: 'none',
    },
    '& select': {},
    '& button': {
      border: 0,
      outline: 0,
      background: 'transparent',
      cursor: 'pointer',
      padding: 2,
    },
    '&:focus-visible': {
      transition: 'all 0.01s ease',
      boxShadow: `0 0 0px 3px ${theme.palette.red[500]} !important`,
      outline: 'transparent !important',
    },
  },
  content: {
    // display: 'flex',
    width: '100%',
    // marginLeft: 12,
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '60%',
  },
  img_cont: {
    height: 48,
    minWidth: 48,
    maxWidth: 48,
    borderRadius: 6,
    border: `1px solid ${theme.palette.gray[200]}`,
    overflow: 'hidden',
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
    },
  },

  text: {
    minWidth: 0,
    marginLeft: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& p': {
      display: '-webkit-box',
      '-webkit-line-clamp': 1,
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      margin: 0,
      // maxWidth: 300,
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '19px',
      wordWrap: 'break-word',
      '& span': {
        color: theme.palette.gray[400],
        margin: '0 4px',
      },
    },
  },
  name: {
    color: theme.palette.gray[600],
    marginBottom: 8,
  },
  articul: {
    color: theme.palette.gray[400],
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    minWidth: '40%',
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
    color: theme.palette.red[500],
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    '& svg': {
      marginBottom: -3,
      marginLeft: 4,
    },
  },
  newPrice: {
    display: 'block',
    fontSize: 16,
    lineHeight: '19px',
    fontWeight: 600,
    color: theme.palette.red[500],
  },
  oldPrice: {
    display: 'block',
    fontSize: 14,
    lineHeight: '16px',
    fontWeight: 600,
    textDecoration: 'line-through',
    color: theme.palette.gray[400],
  },
  right: {
    marginLeft: 12,
  },
  seller: {
    display: 'flex',
    alignItems: 'center',
    '& span': {
      display: 'block',
      height: 16,
      width: 16,
      borderRadius: '50%',
      marginRight: 8,
    },
  },
  trashBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    transition: 'all .2s',
    '&:hover': {
      backgroundColor: theme.palette.red[500],
      '& svg': {
        fill: '#fff',
      },
    },
  },
  giftCardAmount: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.red[500],
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    '& svg': {
      marginBottom: -3,
      marginLeft: 4,
    },
  },
  adornment: {
    position: 'relative',
    right: 42,
    width: 0,
    margin: 0,
    '& p': {
      color: `${theme.palette.gray[400]} !important`,
    },
  },
  discountPercent: {
    backgroundColor: theme.palette.red[500],
    color: theme.palette.white,
    marginRight: 8,
    borderRadius: 32,
    padding: '4px 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    fontFamily: theme.fontFamily.Inter,
  },
}))

const CartItem = ({
  data,
  setCurrentData,
  addItem,
  index,
  fakeIndexForCheck,
  setFakeIndexForCheck,
  searchInputRef,
  discountInputRef,
  clientInputRef,
  eposOn,
  refetchLabels,
  allSellers,
  item,
  deleteCartItem,
}) => {
  console.log(item)

  const cls = useStyles()
  const [quon, setQuon] = useState(0)
  return (
    <Box display={'flex'} width={'100%'}>
      <Box
        id={`cartItem${index}`}
        tabIndex={index}
        className={cls.root}
        onKeyDown={(event) => {
          if (event.code === 'KeyD' && fakeIndexForCheck === index) {
            addItem(data?.id, 0)
            dispatch(asyncRemoveFromCartAction(data?.id, 'cartItem'))
            setFakeIndexForCheck(-1)
            if (isMarked) {
              deleteProductLabels()
            }
          }
          if (!data?.wholeSaleEnabled && event.code === 'KeyS' && fakeIndexForCheck === index) {
            setCurrentData(data)
          }
        }}
      >
        <Box className={cls.content}>
          <Box className={cls.details}>
            <Box
              display={'flex'}
              sx={{
                '& .MuiInputBase-root': {
                  width: '80px',
                },
              }}
            >
              <InputQuantity
                id={`inputQuantity${index}`}
                value={quon}
                name='quantity'
                onChange={({ target }) => console.log(target.value)}
                // adornment={data?.measurement_unit?.short_name}
                adornmentPosition='end'
                adornmentClassName={cls.adornment}
                max={2}
                // maxErrorMessage={maxErrorMessage}
                type='number'
                disabled={false}
              />
              <Box>
                <SelectSimple white boxStyle={{ margin: '0 8px' }} minWidth={'84px'} borderRadius='12px' placeholder='' name={'dd'} />
              </Box>
              <Box className={cls.img_cont}>
                <img
                  src={
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ5Tq8i6RC-Bm15tgZljQIp-TZjTv2qgnuLpvMmvnHwb4vOFpBMaio8MSQ9raE9kof5OU&usqp=CAU' ||
                    '/default-img.avif'
                  }
                  onClick={() => data.main_image_url && setProductId(data.id)}
                />
              </Box>
              <Box id='product-details' className={cls.text}>
                <Typography
                  sx={{ color: 'bunker.950', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}
                  textOverflow={'ellipsis'}
                  // maxWidth={'calc(100%)'}
                  // whiteSpace={'nowrap'}

                  overflow={'hidden'}
                >
                  {item?.product?.name}
                </Typography>
                <Typography sx={{ color: 'bunker.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}> {item?.product?.barcode}</Typography>
              </Box>
            </Box>

            <Box display={'flex'}>
              <Box id='product-details' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', justifyContent: 'center' }}>
                <Typography sx={{ color: 'bunker.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>A4</Typography>
                <Box sx={{ display: 'flex', '& svg > g > path': { stroke: '#FF6018' }, '& svg': { width: '20px', height: '20px' } }}>
                  <Typography sx={{ mr: '10px', color: 'orange.500', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>
                    {' '}
                    {item?.product?.supply_price}
                  </Typography>
                  <EditIcon />
                </Box>
              </Box>
              <Box
                sx={{
                  width: 48,
                  ml: '16px',
                  borderRadius: '50%',
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red.10',
                }}
                onClick={() => deleteCartItem(item?.id)}
              >
                <DeleteIcon width='24px' />
              </Box>
            </Box>
          </Box>

          <Box className={cls.actions}>
            <Box className={cls.left}>
              {/* <Box className={cls.price}>
                {data?.discount_percent ? (
                  <span id='product-discount-percent' className={cls.discountPercent}>
                    {Math.round(data?.discount_percent * 100) / 100}%
                  </span>
                ) : null}
                <Box style={{ cursor: !data?.wholeSaleEnabled && 'pointer' }} onClick={() => !discountRoute && setCurrentData(data)}>
                  {(data.discount_value || data?.hasCommonDiscount || data?.discount_unit === 'CURRENCY') && (
                    <span id='discount-product-price' className={cls.newPrice}>
                      {numberToPrice(+(data.total_price / data.measurement_value).toFixed(2))}
                    </span>
                  )}
                  <span
                    id='product-price'
                    style={{ color: data?.wholeSaleEnabled && '#8B5CF6' }}
                    className={data.discount_value || data?.hasCommonDiscount || data?.discount_unit === 'CURRENCY' ? cls.oldPrice : ''}
                  >
                    {numberToPrice(data?.price)}
                  </span>
                </Box>
                {!discountRoute && (
                  <button onClick={() => setCurrentData(data)} type='button'>
                    <PencilIcon style={{ fill: data?.wholeSaleEnabled && '#8B5CF6' }} />
                  </button>
                )}
              </Box> */}
              {/* {!!data.sellers?.length &&
                data.sellers.map((item) => (
                  <Box className={cls.seller}>
                    <span
                      style={{
                        background: item?.color ? item?.color : allSellers?.find((el) => el?.seller_id === item?.seller_id)?.color,
                      }}
                    />
                    <Typography component='h5'>{item?.seller_name}</Typography>
                  </Box>
                ))} */}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display={'flex'} flexDirection={'column'} padding={'16px'} bgcolor={'bg.10'} ml={'8px'} height={'80px'} borderRadius={'16px'} minWidth={'160px'}>
        <Typography sx={{ color: 'bunker.950', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>Sotuv bonusi</Typography>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>2%</Typography>
          <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>4 986 so'm</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default memo(CartItem)
