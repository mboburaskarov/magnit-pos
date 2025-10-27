import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomImg from '../../../../components/CustomImg'
import InputQuantity from '../../../../components/Inputs/InputQuantity'
import { get } from 'lodash'
import { makeStyles } from '@mui/styles'
import DeleteIconBig from '../../../assets/icons/DeleteIconBig'
import DeleteMiddleIcon from '../../../assets/icons/DeleteMiddleIcon'
import TrashIcon from '../../../assets/icons/TrashIcon'
import thousandDivider from '../../../../utils/thousandDivider'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import PrizeBoxIcon from '../../../assets/icons/PrizeBoxIcon'
import GiftIcon from '../../../assets/icons/GiftIcon'
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
  searchImage: {
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    width: '48px',
    marginRight: '20px',
    minWidth: '48px',
    height: '48px',
    borderRadius: '6px',
    overflow: 'hidden',
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
    right: 12,
    width: 0,

    margin: 0,
    '& p': {
      color: `${theme.palette.gray[400]} !important`,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '500',
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
export default function CartItem({
  index,
  searchRef,
  packRef = () => {},
  setOpenProductDrawer,
  unitRef,

  refetchcartItemsList,
  method,
  item,
  setOpenConfirmDialog,
  removeMarking,
}) {
  const theme = useTheme()
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
    <TableRow
      key={item.id}
      className='table-row'
      sx={{
        height: '80px',
        '& td': { padding: '0px', textAlign: 'left !important' },
        '& td': { border: 'none' },
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
              width: '36px',
              marginRight: '2px',
              minWidth: '36px',
              height: '36px',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <CustomImg src={item?.main_photo || '65eb3e64-185f-4642-8261-1aeec7379760.jpg'} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: 'bunker.950' }}>{item?.name}</Typography>
            <Typography variant='caption' sx={{ fontWeight: 500, fontSize: 12, lineHeight: '16px', color: 'bunker.500' }}>
              {item?.barcode} / Полка: {item?.shelf}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{ width: '100px' }}>
        <Typography sx={{ fontWeight: 500, fontSize: 16, lineHeight: '24px', color: 'bunker.950' }}>
          {item.quantity_stock > 0 && `${item.quantity_stock}уп`} {item.unit_quantity_stock > 0 && `${item.unit_quantity_stock}шт`}
        </Typography>
      </TableCell>
      <TableCell sx={{ width: '60px' }}>
        <Box
          sx={{
            '& .MuiInputBase-root': {
              borderRadius: '6px !important',
            },
            '& .MuiFormControl-root': {
              height: '35px !important',
              width: '40px !important',
            },
            '& input': {
              textAlign: 'end',
              padding: '7px 6px 6px !important',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: '600',
              color: 'bunker.950',
            },
            '& .MuiFormControl-root > .MuiOutlinedInput-root.Mui-focused': {
              border: `1px solid ${theme.palette.orange[500]} !important`,
            },
          }}
        >
          <InputQuantity
            id={`quantity_${item?.id}`}
            name={`quantity_${item?.id}`}
            adornmentPosition='end'
            adornmentClassName={cls.adornment}
            max={100}
            // adornment={item?.short_name}
            inputRef={(e) => packRef(e, index)}
            onKeyDown={({ key }) => {
              if (key === 'Enter' || key == 'Escape') {
                searchRef?.current?.focus()
              }
            }}
            defaultValue={get(item, 'quantity', 0)}
            type='number'
            disabled={false}
            onFocus={({ target }) => {
              method.setValue(`quantity_${item?.id}`, '')
            }}
            onBlur={({ target }) => {
              if (Number(get(target, 'value')) == '') {
                method.setValue(`quantity_${item?.id}`, get(item, 'quantity', 0))
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
        </Box>
      </TableCell>
      <TableCell sx={{ width: '90px' }}>
        <Box
          sx={(theme) => ({
            '& .MuiFormControl-root .MuiInputBase-root': {
              borderRadius: '6px !important',
              display: 'flex',
              alignItems: 'end',
            },

            '& .MuiFormControl-root': {
              height: '35px !important',
              width: '64px !important',
            },
            '& input': {
              textAlign: 'end',
              padding: '4px 32px 4px 6px !important',
              fontSize: '14px',
              height: '23px',
              lineHeight: '20px',
              fontWeight: '500',
              color: 'bunker.950',
            },
            '& .MuiFormControl-root > .MuiOutlinedInput-root.Mui-focused': {
              border: `1px solid ${theme.palette.orange[500]} !important`,
            },
          })}
        >
          <InputQuantity
            type='number'
            id={`inputQuantitys${index}`}
            name={`unit_quantity_${item?.id}`}
            defaultValue={get(item, 'unit_quantity', 1)}
            adornmentPosition='end'
            initWidth='90px'
            onKeyDown={({ key }) => {
              if (key === 'Enter' || key == 'Escape') {
                searchRef?.current?.focus()
              }
            }}
            adornment={
              <Typography pr='8px' display={'flex'}>
                <Box fontSize={'14px'} lineHeight={'20px'} fontWeight={'500'} color='bunker.400'>
                  /{item.unit_per_pack}
                </Box>
              </Typography>
            }
            inputRef={(e) => unitRef(e)}
            adornmentClassName={cls.adornment}
            max={100}
            onFocus={({ target }) => {
              method.setValue(`unit_quantity_${item?.id}`, '')
            }}
            onBlur={({ target }) => {
              if (Number(get(target, 'value')) == '') {
                method.setValue(`unit_quantity_${item?.id}`, get(item, 'unit_quantity', 1))
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
      </TableCell>
      <TableCell sx={{ width: '150px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ color: 'orange.500', fontWeight: 600, fontSize: 16, lineHeight: '24px' }}>{thousandDivider(item?.total_price, 'сум')}</Typography>
          <Typography variant='caption' sx={{ color: 'bunker.400', fontWeight: 500, fontSize: 12, lineHeight: '16px' }}>
            {item?.discount_price > 0 ? (
              <> {thousandDivider(item?.discount_price * item.quantity || item.unit_quantity, 'сум')}/шт</>
            ) : (
              <> {thousandDivider(item?.unit_price, 'сум')}/шт</>
            )}
          </Typography>
          {item?.bonus_amount > 0 && (
            <Box
              sx={{
                borderRadius: '24px',
                padding: '0 9px 0 0',
                display: 'flex',
                mr: '10px',
                mt: '2px',
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: 'yellow.500',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GiftIcon color='#fff' />
              </Box>
              <Typography ml='4px' color={'bunker.950'} fontSize={'12px'} lineHeight={'16px'} fontWeight={'500'}>
                +{thousandDivider(item.bonus_amount, 'сум')}
              </Typography>
            </Box>
          )}
        </Box>
      </TableCell>
      <TableCell sx={{ width: '40px', p: '0 !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              width: 40,
              borderRadius: '50%',
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'red.100',
              },
            }}
            onClick={() => setOpenConfirmDialog({ type: 'deleteOne', id: item?.id, name: item?.name })}
          >
            <TrashIcon />
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  )
}
