import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import React, { memo } from 'react'
import { useMutation } from 'react-query'
import InputQuantity from '../../../../components/Inputs/InputQuantity'
import StyledTooltip from '../../../../components/StyledTooltip'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import { error } from '../../../../utils/toast'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import PrizeBoxIcon from '../../../assets/icons/PrizeBoxIcon'

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
    paddingRight: '20px',
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
    position: 'relative',
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
  pName: {
    cursor: 'pointer',
    '&:hover': {
      color: `${theme.palette.bunker[400]} !important`,
    },
  },

  text: {
    minWidth: 0,
    display: 'flex',
    marginBottom: '3px',
    // flexDirection: 'column',
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
  implementMarkingList,
  markingsList,
  setMarkingList,
  index,
  packRef = () => {},
  setOpenProductDrawer,
  unitRef,
  onKeyDown,
  refetchcartItemsList,
  method,
  item,
  setOpenConfirmDialog,
  removeMarking,
}) => {
  const cls = useStyles()

  const { mutate: changeCartItemQuantity } = useMutation(requests.changeCartItemQuantity, {
    onSuccess: ({ data }) => {
      if (!get(data, 'data.increase')) {
        removeMarking(get(data, 'data'))
      }
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
  return (
    <Box display={'flex'} width={'100%'}>
      <Box id={`cartItem${index}`} tabIndex={index} className={cls.root}>
        <Box className={cls.content}>
          <Box className={cls.details}>
            <Box
              display={'flex'}
              sx={{
                '& .MuiInputBase-root': {
                  width: get(item, 'unit_per_pack') == 0 ? '100%' : '100%',
                },
              }}
            >
              {get(item, 'unit_per_pack') >= 0 && (
                <>
                  <InputQuantity
                    id={`quantity_${item?.id}`}
                    name={`quantity_${item?.id}`}
                    adornmentPosition='end'
                    adornmentClassName={cls.adornment}
                    max={100}
                    adornment={item?.short_name}
                    inputRef={(e) => packRef(e, index)}
                    onKeyDown={onKeyDown}
                    defaultValue={get(item, 'quantity', 0)}
                    type='number'
                    disabled={false}
                    onFocus={({ target }) => {
                      if (Number(get(target, 'value')) == 0) {
                        method.setValue(`quantity_${item?.id}`, '')
                      }
                    }}
                    onBlur={({ target }) => {
                      if (Number(get(target, 'value')) == '') {
                        method.setValue(`quantity_${item?.id}`, '0')
                      }
                      if (get(item, 'quantity') == Number(get(target, 'value'))) {
                        return
                      }
                      if (method.getValues(`unit_quantity_${item?.id}`) == 0 && Number(get(target, 'value') == 0)) {
                        method.setValue(`quantity_${item?.id}`, get(target, 'value'))
                      } else {
                        if (get(item, 'quantity') > Number(get(target, 'value'))) {
                          removeMarking({
                            quantity: Number(get(target, 'value')),
                            unit_per_pack: get(item, 'unit_per_pack'),
                            unit_quantity: Number(method.getValues(`unit_quantity_${item?.id}`)),
                            id: get(item, 'id'),
                            request: {
                              id: get(item, 'id'),
                              data: {
                                quantity: Number(get(target, 'value')),
                                store_product_id: get(item, 'store_product_id'),

                                unit_quantity: Number(method.getValues(`unit_quantity_${item?.id}`)),
                              },
                            },
                          })
                          method.setValue(`quantity_${item?.id}`, item?.quantity)
                          method.setValue(`unit_quantity_${item?.id}`, item?.unit_quantity)
                        } else {
                          changeCartItemQuantity({
                            id: get(item, 'id'),
                            data: {
                              quantity: Number(get(target, 'value')),
                              store_product_id: get(item, 'store_product_id'),

                              unit_quantity: Number(method.getValues(`unit_quantity_${item?.id}`)),
                            },
                          })
                        }
                      }
                    }}
                  />
                  <Box width={'5px'} />
                </>
              )}
              {get(item, 'unit_per_pack') > 0 ? (
                <Box
                  sx={{
                    '& .MuiInputBase-root': {
                      // width: get(item, 'unit_per_pack') == 0 ? '110px' : '110px',
                    },
                  }}
                >
                  <InputQuantity
                    id={`inputQuantitys${index}`}
                    name={`unit_quantity_${item?.id}`}
                    defaultValue={get(item, 'unit_quantity', 1)}
                    adornmentPosition='end'
                    initWidth='90px'
                    adornment={
                      <Typography pr='8px' display={'flex'}>
                        <Box fontSize={'12px'} m={'0px 0'} color='bunker.950'>
                          /{item.unit_per_pack}
                        </Box>{' '}
                        <Typography m={'0 4px 0'}>шт</Typography>
                      </Typography>
                    }
                    inputRef={(e) => unitRef(e)}
                    adornmentClassName={cls.adornment}
                    max={100}
                    type='number'
                    onFocus={({ target }) => {
                      if (Number(get(target, 'value')) == 0) {
                        method.setValue(`unit_quantity_${item?.id}`, '')
                      }
                    }}
                    onBlur={({ target }) => {
                      if (Number(get(target, 'value')) == '') {
                        method.setValue(`unit_quantity_${item?.id}`, '0')
                      }
                      if (get(item, 'unit_quantity') == Number(get(target, 'value'))) {
                        return
                      }

                      if (method.getValues(`quantity_${item?.id}`) == 0 && Number(get(target, 'value') == 0)) {
                        method.setValue(`unit_quantity_${item?.id}`, get(target, 'value'))
                      } else {
                        if (get(item, 'unit_quantity') > Number(get(target, 'value'))) {
                          removeMarking({
                            quantity: Number(method.getValues(`quantity_${item?.id}`)),
                            unit_per_pack: get(item, 'unit_per_pack'),
                            unit_quantity: Number(get(target, 'value')),
                            id: get(item, 'id'),
                            request: {
                              id: get(item, 'id'),
                              data: {
                                quantity: Number(method.getValues(`quantity_${item?.id}`)),
                                store_product_id: get(item, 'store_product_id'),
                                unit_quantity: Number(get(target, 'value')),
                              },
                            },
                          })
                          method.setValue(`quantity_${item?.id}`, item?.quantity)
                          method.setValue(`unit_quantity_${item?.id}`, item?.unit_quantity)
                        } else {
                          changeCartItemQuantity({
                            id: get(item, 'id'),
                            data: {
                              quantity: Number(method.getValues(`quantity_${item?.id}`)),
                              store_product_id: get(item, 'store_product_id'),
                              unit_quantity: Number(get(target, 'value')),
                            },
                          })
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <></>
              )}
              <Box width={'10px'} />
              {/* <Box className={cls.img_cont}>
                <img src={item?.main_photo || '/default-img.avif'} />
              </Box> */}
            </Box>
            <Box ml={'8px'} display={'flex'} width={'100%'} flexDirection={'column'}>
              <Box onClick={() => setOpenProductDrawer(item)} id='product-details' className={cls.text}>
                <Typography
                  className={cls.pName}
                  sx={{ fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                >
                  {item?.name}
                </Typography>
                {/* <Typography sx={{ minWidth: '30px', whiteSpace: 'pre', color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '600' }}>
                  A4
                </Typography> */}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  '& svg > g > path': { stroke: '#FF6018' },
                  '& svg': { width: '20px', height: '20px' },
                }}
              >
                <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                  <Typography sx={{ color: 'bunker.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>
                    {item?.barcode} {get(item, 'shelf', '').length > 0 ? `/ Полка: ${get(item, 'shelf', 'X')}` : ''}/ Остаток:{' '}
                    {item.quantity_stock > 0 && `${item.quantity_stock}уп`} {item.unit_quantity_stock > 0 && `${item.unit_quantity_stock}шт`}
                  </Typography>
                </Box>
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
                  {item.bonus_amount}сум
                </Typography>
              </Box>
            )}
            <Box display={'flex'} alignItems={'center'}>
              {/* {item?.discount_value > 0 && (
                <Typography
                  whiteSpace={'pre'}
                  sx={{
                    bgcolor: 'red.500',
                    color: '#fff',
                    px: '6px',
                    mr: '5px',
                    py: '3px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    lineHeight: '20px',
                    fontWeight: '500',
                  }}
                >
                  - {item?.discount_value}%
                </Typography>
              )} */}

              <Box alignItems={'end'} display={'flex'} flexDirection={'column'}>
                {item.quantity > 0 && (
                  <StyledTooltip title={'Это цена одного товара без скидки.'}>
                    <Box display={'flex'}>
                      {/* {item?.discount_price > 0 && (
                      <Typography sx={{ mr: '10px', whiteSpace: 'pre', color: 'orange.500', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>
                        {thousandDivider(item?.discount_price, 'сум')}
                      </Typography>
                    )} */}

                      <Typography
                        textDecoration='line-through'
                        sx={{
                          mr: '10px',
                          color: 'bunker.200',
                          whiteSpace: 'pre',
                          fontSize: item?.discount_price > 0 ? '14px' : '16px',
                          lineHeight: '24px',
                          fontWeight: '600',
                          // textDecoration: item?.discount_price > 0 ? 'line-through' : 'none',
                          color: item?.discount_price > 0 ? 'bunker.300' : 'bunker.500',
                        }}
                      >
                        {thousandDivider(item?.unit_price, 'сум')}
                      </Typography>
                    </Box>
                  </StyledTooltip>
                )}
                <Box display={'flex'}>
                  {item?.discount_price > 0 && (
                    <Typography sx={{ mr: '10px', whiteSpace: 'pre', color: 'orange.500', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>
                      {thousandDivider(item?.discount_price * item.quantity, 'сум')}
                    </Typography>
                  )}
                  <Typography
                    textDecoration='line-through'
                    sx={{
                      mr: '10px',
                      color: 'orange.500',
                      whiteSpace: 'pre',
                      fontSize: item?.discount_price > 0 ? '14px' : '16px',
                      lineHeight: '24px',
                      mt: '1px',
                      fontWeight: '600',
                      textDecoration: item?.discount_price > 0 ? 'line-through' : 'none',
                      color: item?.discount_price > 0 ? 'bunker.300' : 'orange.500',
                    }}
                  >
                    {thousandDivider(item?.total_price, 'сум')}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {/* {item?.bonus_amount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: get(item, 'discount_price', 0) > 0 ? -13 : -14,
                    right: -35,
                    backgroundColor: '#fe5000',
                    color: '#fff',
                    // width: '100px',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '2px 15px 2px 25px',
                    transform: 'rotate(35deg)',
                  }}
                  id='product-details'
                >
                  Bonus
                </Box>
              )} */}
              <Box
                sx={{
                  width: 40,
                  ml: '8px',
                  borderRadius: '50%',
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red.10',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'red.100',
                  },
                }}
                onClick={() => setOpenConfirmDialog({ type: 'deleteOne', id: item?.id, name: item?.name })}
              >
                <DeleteIcon width='20px' />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* <Box display={'flex'} flexDirection={'column'} padding={'16px'} bgcolor={'bg.10'} ml={'8px'} height={'80px'} borderRadius={'16px'} minWidth={'120px'}>
        <Typography sx={{ color: 'bunker.950', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>Bonus</Typography>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>
            {thousandDivider(item?.bonus_amount, 'сум')}
          </Typography>
        </Box>
      </Box> */}
    </Box>
  )
}

export default memo(CartItem)
