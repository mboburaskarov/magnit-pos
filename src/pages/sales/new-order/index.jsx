import React, { useState } from 'react'
import CartSearchBar from './CartSearchBar'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CartItem from './CartItem'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import { FormProvider, useForm } from 'react-hook-form'
import FileIcon from '../../../assets/icons/FileIcon'
import TimeAndDate from '../../../assets/icons/TimeandDateIcon'
import TextField from '../../../../components/Inputs/TextField'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  card_detail: {
    width: '30%',
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
    borderColor: 'bunker.300',
    padding: '10px 16px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cart_detail_icon: {
    width: 48,
    ml: '16px',
    minWidth: '48px',
    borderRadius: '50%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'bg.10',
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
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: 'calc(100% - 40px)',
    left: 0,
    margin: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderRadius: '16px',
    borderColor: theme.palette.bunker[100],
    boxShadow: '0px 4px 12px 0px #00000014',
  },
}))
function NewSale() {
  const userData = useSelector((state) => state.user)
  const [showOverlay, setShowOverlay] = useState(true)
  const [inputDiscount, setInputDiscount] = useState(0)
  const { data: cartItemsList, refetch: refetchcartItemsList } = useQuery('cartItemsList', () =>
    requests.getCartItemList({ employee_id: userData?.id, limit: 1000, offset: 0 })
  )
  const classes = useStyles()
  const { mutate: handleAddProduct, isLoading: isCreatingProduct } = useMutation(requests.createCartItem, {
    onSuccess: () => {
      setShowOverlay(false)
      refetchcartItemsList()
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
      console.log('err', err)
    },
  })
  console.log(inputDiscount)

  const { mutate: deleteCartItem, isLoading: isdeleteCartItem } = useMutation(requests.deleteCartItem, {
    onSuccess: () => {
      setShowOverlay(false)
      refetchcartItemsList()
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
      console.log('err', err)
    },
  })
  const { mutate: deleteAll, isLoading: isdeleteAll } = useMutation(requests.deleteAll, {
    onSuccess: () => {
      setShowOverlay(false)
      refetchcartItemsList()
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
      console.log('err', err)
    },
  })
  const method = useForm()
  console.log(cartItemsList)

  const { t } = useTranslation()
  return (
    <FormProvider {...method}>
      <Box display={'flex'}>
        <Box width={'70%'} padding={'20px'}>
          <Box position={'relative'}>
            <CartSearchBar showOverlay={showOverlay} setShowOverlay={setShowOverlay} handleAddProduct={handleAddProduct} />
          </Box>
          <Box mt={8} />
          <Box padding={'24px 0'}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                mb: '16px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography fontWeight={'700'} fontSize={'28px'} lineHeight={'40px'}>
                Sotuv (0)
              </Typography>
              <Box display={'flex'} alignItems={'center'} onClick={() => deleteAll(cartItemsList?.data?.data?.data?.map((el) => el.id))}>
                <Typography sx={{ mr: '12px', color: 'orange.500', fontSize: '14px', lineHeight: '20px', fontWeight: '600' }}>Barchasini o'chirish</Typography>

                <DeleteIcon width={'20px'} />
              </Box>
            </Box>
            {false ? (
              <Box className={classes.empty_list}>
                <Typography fontWeight={'800'} fontSize={'24px'} lineHeight={'32px'}>
                  Savat hozircha boʻsh
                </Typography>
                <Typography fontWeight={'500'} fontSize={'16px'} color={'bunker.500'} lineHeight={'24px'}>
                  Qidiruv paneli orqali mahsulotlarni qo'shing yoki mahsulotlarni skanerlang
                </Typography>
              </Box>
            ) : (
              <Box>
                {cartItemsList?.data?.data?.data?.map((el) => (
                  <CartItem deleteCartItem={deleteCartItem} item={el} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
        <Box className={classes.card_detail}>
          <Box display={'flex'} alignItems={'center'} mb={'24px'}>
            <Box className={classes.cart_detail_id}>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'orange.500'} lineHeight={'26px'}>
                #4343434
              </Typography>
            </Box>
            <Box className={classes.cart_detail_icon}>
              <FileIcon />
            </Box>
            <Box className={classes.cart_detail_icon}>
              <TimeAndDate />
            </Box>
            <Box className={classes.cart_detail_icon}>
              <DeleteIcon />
            </Box>
          </Box>
          <Box mb={'24px'}>
            <TextField required fullWidth name='description' label='Mizoj' placeholder='Mijoz yoki telefon raqami' />
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <TextField required type={'number'} fullWidth name='description' label='Mijoz' placeholder='Chegirmani kiritng' />
            <Box ml={'8px'}>
              <InputSwitch
                uncontrolled
                id='app-type'
                name='app-type'
                // value={appType}
                style={{ marginTop: '40px', width: 'auto' }}
                defaultValue='ALL'
                onChange={(e) => console.log(e)}
                options={[
                  { title: '%', value: 'ALL' },
                  { title: 'UZS', value: 'medicine' },
                ]}
              />
            </Box>
          </Box>
          <Box mt='8px' display={'flex'}>
            {[15, 30, 50, 75].map((el, index) => (
              <Box sx={{ color: el === inputDiscount ? 'orange.500' : '#000' }} onClick={() => setInputDiscount(el)} className={classes.percent}>
                {el}%
              </Box>
            ))}
          </Box>
          <Box className={classes.priceDetails}>
            <Box display={'flex'} justifyContent={'space-between'} mb={'16px'}>
              <Typography fontWeight={'600'} fontSize={'18px'} color={'bunker.950'} lineHeight={'28px'}>
                Jami narxi:
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'bunker.800'} lineHeight={'28px'}>
                383 450 so'm
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} mb={'16px'}>
              <Typography fontWeight={'600'} fontSize={'18px'} color={'bunker.950'} lineHeight={'28px'}>
                Chegirma:
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'bunker.800'} lineHeight={'28px'}>
                57 450 so'm
              </Typography>
            </Box>
            <Button color='primary' sx={{ mb: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'white'} lineHeight={'26px'}>
                To'lov
              </Typography>
              <Typography fontWeight={'500'} fontSize={'18px'} color={'white'} lineHeight={'26px'}>
                57 450 so'm
              </Typography>
            </Button>
            <Button color='secondary'>
              <TimeAndDate />
              <Typography ml={'12px'} fontWeight={'500'} fontSize={'18px'} color={'black'} lineHeight={'26px'}>
                Draft
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default NewSale
