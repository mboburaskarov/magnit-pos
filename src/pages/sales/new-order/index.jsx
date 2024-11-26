import React from 'react'
import CartSearchBar from './CartSearchBar'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CartItem from './CartItem'
import { useMutation } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import DeleteIcon from '../../../assets/icons/DeleteIcon'

const useStyles = makeStyles((theme) => ({
  card_detail: {
    borderLeft: `1px solid ${theme.palette.bunker[100]}`,
    minHeight: '100vh',
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
}))
function NewSale() {
  const classes = useStyles()

  const { mutate: handleAddProduct, isLoading: isCreatingProduct } = useMutation(requests.createProduct, {
    onSuccess: () => {
      navigate(`${location.pathname}`)
      success('Продукт успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании товара!')
      console.log('err', err)
    },
  })
  return (
    <Box display={'flex'}>
      <Box width={'100%'} padding={'20px'}>
        <Box position={'relative'}>
          <CartSearchBar handleAddProduct={handleAddProduct} />
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
            <Box display={'flex'} alignItems={'center'}>
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
              <CartItem />
              <CartItem />
              <CartItem />
              <CartItem />
            </Box>
          )}
        </Box>
      </Box>
      <Box className={classes.card_detail} width={'440px'}></Box>
    </Box>
  )
}

export default NewSale
