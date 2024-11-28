import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useEffect } from 'react'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import TextField from '../../../../components/Inputs/TextField'
import MoneyOutlineIcon from '../../../assets/icons/MoneyOutline'
import CartOutlineIcon from '../../../assets/icons/CartOutline'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon'
import { get } from 'lodash'
const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  wrapper: {
    width: '860px',
    minHeight: '540px',
    border: '1px solid',
    borderColor: theme.palette.bunker[100],
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    // padding: '40px',
    boxShadow: '0px 4px 12px 0px #00000014',
    '& h5': {
      // marginTop: '20px',
      marginBottom: '4px',
    },
    '& .MuiInputBase-root': {
      height: '48px',
      borderRadius: '40px !important',
      marginTop: '0px',
    },
  },
  card_box: {
    // height: '160px',
    border: '1px solid',
    borderColor: theme.palette.bunker[100],
    borderRadius: '16px',
    padding: '24px',
    marginTop: '16px',
    boxShadow: ' 0px 2px 8px 0px #0000000A',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    marginRight: 12,
    padding: '12px',
    backgroundColor: theme.palette.orange[500],
    borderRadius: '50%',
  },
}))
function NewCashRegister() {
  const classes = useStyles()

  const methods = useForm()
  // const { watch } = useFormContext()
  const { data: registerCashList, refetch: refetchregisterCashList } = useQuery('registerCashList', () =>
    requests.getRegisterCashList({ limit: 1000, offset: 0 })
  )
  const { data: registerCashData, refetch: refetchregisterCashData } = useQuery('registerCashData', () =>
    requests.getRegisterCashData(methods.watch('registerCash_id')?.id)
  )
  // const { data: storeList, refetch: refetchstoreList } = useQuery('storeList', () => requests.getAllShops({ limit: 1000, offset: 0 }))
  useEffect(() => {
    refetchregisterCashList()
    // refetchstoreList()
  }, [])

  useEffect(() => {
    refetchregisterCashData()
  }, [methods.watch('registerCash_id')])
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
    <FormProvider {...methods}>
      <Box className={classes.box}>
        <Box className={classes.wrapper}>
          <Typography fontSize={'32px'} lineHeight={'48px'} fontWeight={'700'} color={'bunker.950'} p={'24px'}>
            Kassirni tanlang
          </Typography>
          <Box display={'flex'} p={'40px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box sx={{ '& div': { backgroundColor: 'transparent' } }}>
                <SelectSimple
                  onChange={() => console.log()}
                  options={registerCashList?.data?.data}
                  required
                  label={'Kassa'}
                  placeholder='Kassirni tanlang'
                  name={'registerCash_id'}
                />
                <Box height={'24px'} />
                <TextField required type={'number'} fullWidth name='description' label='Ochilish miqdori' placeholder='Miqdorni kiriting' />
                <Box height={'24px'} />

                <TextField required fullWidth name='description' label='Izoh' placeholder='Fikr kiriting' />
              </Box>
              <Button disabled={true} sx={{ bottom: 0, '& > svg': { width: 24, height: 24, ml: '12px' } }}>
                Kassani oching <ArrowRightIcon />
              </Button>
            </Box>
            <Box sx={{ border: '1px solid', mx: '40px', borderColor: 'bunker.100' }} />

            <Box sx={{ width: '100%' }}>
              <Typography fontSize={'16px'} lineHeight={'24px'} fontWeight={'600'} color={'bunker.700'}>
                Kassangizda mavjud:
              </Typography>
              <Box className={classes.card_box}>
                <Box display={'flex'} alignItems={'center'}>
                  <Box className={classes.iconBox}>
                    <MoneyOutlineIcon />
                  </Box>
                  <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'bunker.950'}>
                    Naqd
                  </Typography>
                </Box>
                <Box my={'16px'} border={'1px solid'} borderColor={'bunker.100'} />
                <Box display={'flex'} justifyContent={'end'}>
                  <Typography display={'flex'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'orange.500'}>
                    {get(registerCashData, 'data.data.cash_amount', null)}
                    <Typography mx={'4px'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'bunker.400'}>
                      UZS
                    </Typography>
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.card_box}>
                <Box display={'flex'} alignItems={'center'}>
                  <Box className={classes.iconBox}>
                    <CartOutlineIcon />
                  </Box>
                  <Typography fontSize={'24px'} lineHeight={'48px'} fontWeight={'700'} color={'bunker.950'}>
                    Karta
                  </Typography>
                </Box>
                <Box my={'16px'} border={'1px solid'} borderColor={'bunker.100'} />
                <Box display={'flex'} justifyContent={'end'}>
                  <Typography display={'flex'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'orange.500'}>
                    {get(registerCashData, 'data.data.cashless_amount', null)}
                    <Typography mx={'4px'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'bunker.400'}>
                      UZS
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default NewCashRegister
