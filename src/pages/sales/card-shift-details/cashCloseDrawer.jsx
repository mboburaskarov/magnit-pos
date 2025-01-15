import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import React, { useState } from 'react'
import CloseIcon from '../../../assets/icons/CloseIcon'
import WaitingCashAmoutIcon from '../../../assets/icons/WaitingCashAmoutIcon'
import InComeCashIcon from '../../../assets/icons/InComeCashIcon'
import ExpenseCashIcon from '../../../assets/icons/ExpenseCashIcon'
import LoadingContainer from '../../../../components/LoadingContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { get } from 'lodash'
import OutLineTextField from '../../../../components/Inputs/OutLineTextField'
import TextField from '../../../../components/Inputs/TextField'
import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon'
import MoneyOutlineIcon from '../../../assets/icons/MoneyOutline'
import CartOutlineIcon from '../../../assets/icons/CartOutline'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { error, success } from '../../../../utils/toast'
import { useNavigate, useParams } from 'react-router-dom'
const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      borderRadius: '24px 24px 0 0',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
    },
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '24px 0 0 24px',
    // height: '100vh',
    width: '100%',
  },
  wrapper: {
    width: '100vw',
    minHeight: '540px',
    // border: '1px solid',
    // borderColor: theme.palette.bunker[100],
    // borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    // padding: '40px',
    // boxShadow: '0px 4px 12px 0px #00000014',
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
  closeStoreDot: {
    width: 30,
    height: 30,
    display: 'flex',
    borderRadius: '50%',
    backgroundColor: 'red',
    marginRight: '10px',
    marginBottom: '5px',
  },
  switchBox: {
    padding: '10px 20px',
    height: '48px',
    borderRadius: '24px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontSize: '16px',
    color: theme.palette.bunker[950],
    lineHeight: '28px',
    backgroundColor: theme.palette.bg[10],
    border: '2px solid tranparent',
  },
}))
function CashCloseDrawer({ open, setOpen }) {
  const classes = useStyles()
  const { id } = useParams()
  const navigate = useNavigate()

  const [company, setCompany] = useState('1')
  const methods = useForm()
  const [isOpenChild, setIsOpenChild] = useState(false)
  const theme = useTheme()
  const {
    data: closeCashboxPaymentsInfo,
    isLoading: closeCashboxPaymentsInfoLoading,
    isFetching: isFetchingcloseCashboxPaymentsInfo,
    refetch,
  } = useQuery('closeCashboxPaymentsInfo', () => requests.getCloseCashboxPaymentsInfo(id))
  const { mutate: closeCashBoxRegister, isLoading: iscloseCashBoxRegister } = useMutation(requests.closeCashBoxRegister, {
    onSuccess: () => {
      // refetch()

      setOpen(false)
      navigate(`/sales/create`)
      success('Продукт успешно удален!')
    },
    onError: (err) => {
      // refetch()
      error('Ошибка при удалении товара!')
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    closeCashBoxRegister({
      id,
      data: {
        cash_amount: get(closeCashboxPaymentsInfo, 'data.data.cash_amount'),
        cashless_amount: get(closeCashboxPaymentsInfo, 'data.data.cashless_amount'),
        closed_amount: get(data, 'closed_amount'),
        is_company: company == 2 ? true : false,
      },
    })
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='bottom' elevation={1} className={classes.drawer}>
      <LoadingContainer noHeight readyState={!false}>
        <FormProvider {...methods}>
          <Box className={classes.box}>
            <Box className={classes.wrapper}>
              <Typography
                borderBottom={'1px solid'}
                borderColor={'bunker.100'}
                display={'flex'}
                alignItems={'center'}
                fontSize={'32px'}
                lineHeight={'48px'}
                fontWeight={'700'}
                color={'bunker.950'}
                p={'24px'}
              >
                Закрыть кассу
              </Typography>
              <Box width={'80vw'} margin={'auto'} display={'flex'} p={'40px'}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ '& div': { backgroundColor: 'transparent' } }}>
                    {/* <SelectSimple
                      onChange={() => {}}
                      options={registerCashList?.data?.data}
                      required
                      label={'Kassa'}
                      placeholder='Kassirni tanlang'
                      name={'registerCash_id'}
                    /> */}
                    <Box>
                      <Typography
                        onClick={() => setCompany(1)}
                        sx={{ border: `2px solid ${company == 1 ? '#fe5003' : 'transparent'}` }}
                        className={classes.switchBox}
                      >
                        Оставьте всю сумму на кассе
                      </Typography>
                      <Typography
                        onClick={() => setCompany(2)}
                        sx={{ border: `2px solid ${company == 2 ? '#fe5003' : 'transparent'}` }}
                        className={classes.switchBox}
                      >
                        Переведите всю сумму на счет компании
                      </Typography>
                      <Typography
                        onClick={() => setCompany(3)}
                        sx={{ border: `2px solid ${company == 3 ? '#fe5003' : 'transparent'}` }}
                        className={classes.switchBox}
                      >
                        Оставьте часть в кассе и передайте остальную часть
                      </Typography>
                    </Box>
                    {company === 3 && (
                      <>
                        {/* <Box height={'24px'} /> */}
                        <OutLineTextField
                          endAdornmentText={'UZS'}
                          end
                          type={'number'}
                          fullWidth
                          name='closed_amount'
                          label='Оставшаяся сумма'
                          placeholder='Введите оставшуюся сумму'
                        />
                      </>
                    )}
                    {/* <Box height={'24px'} /> */}

                    {/* <TextField fullWidth name='description' label='Izoh' placeholder='Fikr kiriting' /> */}
                  </Box>
                </Box>
                <Box sx={{ border: '1px solid', mx: '40px', borderColor: 'bunker.100' }} />

                <Box sx={{ width: '100%' }}>
                  <Typography fontSize={'16px'} lineHeight={'24px'} fontWeight={'600'} color={'bunker.700'}>
                    Доступно на кассе:
                  </Typography>
                  <Box className={classes.card_box}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box className={classes.iconBox}>
                        <MoneyOutlineIcon />
                      </Box>
                      <Typography fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'bunker.950'}>
                        Наличные
                      </Typography>
                    </Box>
                    <Box my={'16px'} border={'1px solid'} borderColor={'bunker.100'} />
                    <Box display={'flex'} justifyContent={'end'}>
                      <Typography display={'flex'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'orange.500'}>
                        {get(closeCashboxPaymentsInfo, 'data.data.cash_amount', null)}
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
                        Карта
                      </Typography>
                    </Box>
                    <Box my={'16px'} border={'1px solid'} borderColor={'bunker.100'} />
                    <Box display={'flex'} justifyContent={'end'}>
                      <Typography display={'flex'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'} color={'orange.500'}>
                        {get(closeCashboxPaymentsInfo, 'data.data.cashless_amount', null)}
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
          <Button
            type='submit'
            onClick={methods.handleSubmit(onSubmit, onError)}
            // disabled={!get(canCreate, 'canCreate')}
            sx={{ bottom: 0, margin: '0 24px 24px', '& > svg': { width: 24, height: 24, ml: '12px' } }}
          >
            Закрыть кассу <ArrowRightIcon color={!true ? '#FF6018' : '#fff'} />
          </Button>
        </FormProvider>
      </LoadingContainer>
    </Drawer>
  )
}

export default CashCloseDrawer
