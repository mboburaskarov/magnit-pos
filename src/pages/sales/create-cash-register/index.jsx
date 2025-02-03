import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OutLineTextField from '../../../../components/Inputs/OutLineTextField'
import TextField from '../../../../components/Inputs/TextField'
import LoadingContainer from '../../../../components/LoadingContainer'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon'
import CartOutlineIcon from '../../../assets/icons/CartOutline'
import MoneyOutlineIcon from '../../../assets/icons/MoneyOutline'
import NumberFormatInput from '../../../../components/Inputs/OutLineTextFieldThousand'
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
    boxShadow: '0px 4px 12px 0px #00000014',
    '& h5': {
      marginBottom: '4px',
    },
    '& .MuiInputBase-root': {
      height: '48px',
      borderRadius: '40px !important',
      marginTop: '0px',
    },
  },
  card_box: {
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
  closeStoreDot: {
    width: 30,
    height: 30,
    display: 'flex',
    borderRadius: '50%',
    backgroundColor: 'red',
    marginRight: '10px',
    marginBottom: '5px',
  },
}))
function NewCashRegister() {
  const classes = useStyles()
  const userData = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [isLoading, setIsLoding] = useState(false)
  const [canCreate, setCanCreate] = useState(false)
  const methods = useForm()
  const { data: registerCashList, refetch: refetchregisterCashList } = useQuery('registerCashList', () =>
    requests.getRegisterCashList({ store_id: get(userData, 'store.id'), limit: 20, offset: 0 })
  )
  const {
    data: registerCashData,
    refetch: refetchregisterCashData,
    isLoading: isrRgisterCashDataLoading,
    isFetched,
  } = useQuery('registerCashData', () => requests.getRegisterCashData(get(methods.getValues('registerCash_id'), 'id', false)))

  const { mutate: checkSaleExist, isLoading: isCheckSaleExist } = useMutation(requests.checkSaleExist, {
    onSuccess: ({ data }) => {
      setIsLoding(false)

      if (get(data, 'data.is_open', false)) {
        navigate(`/sales/new-sale/${get(data, 'data.sale_id')}`)
      }
    },
    onError: (err) => {
      setIsLoding(false)

      // error('Ошибка при создании товара!')
      console.log('err', err)
    },
  })
  useEffect(() => {
    checkSaleExist(get(userData, 'store.id'))
  }, [])
  useEffect(() => {
    if (registerCashData) setCanCreate((a) => ({ ...a, canCreate: true }))
  }, [registerCashData])
  useEffect(() => {
    refetchregisterCashData().then(() => {
      setCanCreate({ canCreate: true, is_open: get(methods.watch('registerCash_id'), 'is_open') })
    })
  }, [methods.watch('registerCash_id')])

  const { mutate: handleCashBoxCreate, isLoading: isCreatingCashbox } = useMutation(requests.createCashOperationBox, {
    onSuccess: ({ data }) => {
      data
      navigate(`/sales/new-sale/${get(data, 'data.id')}`)
    },
    onError: (err) => {
      error('Ошибка при создании кассы!')
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      cash_amount: Number(get(data, 'opened_amout')),
      cash_box_id: get(data, 'registerCash_id.id', null),
      description: get(data, 'description'),
      employee_id: userData?.id,
      is_open: true,
    }

    handleCashBoxCreate(requestBody)
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  return (
    <LoadingContainer readyState={!isCheckSaleExist}>
      <FormProvider {...methods}>
        <Box className={classes.box}>
          <Box className={classes.wrapper}>
            <Typography display={'flex'} alignItems={'center'} fontSize={'32px'} lineHeight={'48px'} fontWeight={'700'} color={'bunker.950'} p={'24px'}>
              {get(canCreate, 'is_open') ? (
                'Kassirni tanlang'
              ) : (
                <>
                  <span className={classes.closeStoreDot} />
                  Kassa Yopiq
                </>
              )}
            </Typography>
            <Box display={'flex'} p={'40px'} borderTop={'1px solid'} borderColor={'bunker.100'}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ '& div': { backgroundColor: 'transparent' } }}>
                  <SelectSimple
                    onChange={() => {}}
                    options={registerCashList?.data?.data?.data}
                    required
                    label={'Kassa'}
                    placeholder='Kassirni tanlang'
                    name={'registerCash_id'}
                  />
                  <Box height={'24px'} />
                  <NumberFormatInput
                    endAdornmentText={'UZS'}
                    end
                    type='number'
                    fullWidth
                    name='opened_amout'
                    label='Ochilish miqdori'
                    placeholder='Miqdorni kiriting'
                  />
                  <Box height={'24px'} />

                  <TextField fullWidth name='description' label='Izoh' placeholder='Fikr kiriting' />
                </Box>
                <Button
                  type='submit'
                  onClick={methods.handleSubmit(onSubmit, onError)}
                  disabled={!get(canCreate, 'canCreate')}
                  sx={{ bottom: 0, '& > svg': { width: 24, height: 24, ml: '12px' } }}
                >
                  Kassani oching <ArrowRightIcon color={!get(canCreate, 'canCreate') ? '#FF6018' : '#fff'} />
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
                      {get(registerCashData, 'data.data.closed_amount', null)}
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
                      0
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
    </LoadingContainer>
  )
}

export default NewCashRegister
