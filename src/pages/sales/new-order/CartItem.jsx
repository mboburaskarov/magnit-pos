import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { memo, useState } from 'react'
import InputQuantity from '../../../../components/Inputs/InputQuantity'
import StyledTooltip from '../../../../components/StyledTooltip'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import EditIcon from '../../../assets/icons/EditIcon'

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
    '& .MuiFormControl-root': {
      backgroundColor: 'transparent !important',
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
  setOpenConfirmDialog,
}) => {
  const cls = useStyles()
  const [quon, setQuon] = useState(1)
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
              <StyledTooltip placement='top' title='Кусок'>
                <InputQuantity
                  id={`inputQuantity${index}`}
                  name='box'
                  adornmentPosition='end'
                  adornmentClassName={cls.adornment}
                  max={100}
                  defaultValue={1}
                  type='number'
                  disabled={false}
                />
              </StyledTooltip>
              <Box>
                <StyledTooltip placement='top' title='Пачка'>
                  <InputQuantity
                    id={`inputQuantity${index}`}
                    name='quantity'
                    defaultValue={1}
                    adornmentPosition='end'
                    adornmentClassName={cls.adornment}
                    max={100}
                    type='number'
                    disabled={false}
                  />
                </StyledTooltip>
              </Box>
              <Box className={cls.img_cont}>
                <img src={item?.product?.main_photo || '/default-img.avif'} onClick={() => data.main_image_url && setProductId(data.id)} />
              </Box>
              <Box id='product-details' className={cls.text}>
                <Typography sx={{ color: 'bunker.950', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }} textOverflow={'ellipsis'} overflow={'hidden'}>
                  {item?.product?.name}
                </Typography>
                <Typography sx={{ color: 'bunker.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}> {item?.product?.barcode}</Typography>
              </Box>
            </Box>

            <Box display={'flex'}>
              <Box id='product-details' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', justifyContent: 'center' }}>
                <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '600' }}>A4</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    '& svg > g > path': { stroke: '#FF6018' },
                    '& svg': { width: '20px', height: '20px' },
                  }}
                >
                  <Typography sx={{ mr: '10px', color: 'orange.500', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>
                    {' '}
                    {item?.total_price}
                  </Typography>
                  <Box sx={{ cursor: 'pointer' }}>
                    <EditIcon />
                  </Box>
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
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'red.100',
                  },
                }}
                onClick={() => setOpenConfirmDialog({ type: 'deleteOne', id: item?.id, name: item?.product?.name })}
              >
                <DeleteIcon width='24px' />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display={'flex'} flexDirection={'column'} padding={'16px'} bgcolor={'bg.10'} ml={'8px'} height={'80px'} borderRadius={'16px'} minWidth={'160px'}>
        <Typography sx={{ color: 'bunker.950', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>Sotuv bonusi</Typography>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}> {item?.product?.bonus_percent}%</Typography>
          <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>{item?.product?.bonus_amount}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default memo(CartItem)
