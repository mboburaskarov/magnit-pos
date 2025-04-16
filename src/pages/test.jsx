import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import RippedPaperZReportCheck from '../../components/ChequePaper/ZReportCheck'
import InputPassword from '../../components/Inputs/InputPasswordNew'
import NumberFormatInput from '../../components/Inputs/OutLineTextFieldThousand'
import SelectSimple from '../../components/Select/SelectSimple'
import { requests } from '../../utils/requests'
import { error, success } from '../../utils/toast'
import ArrowRightIcon from '../assets/icons/ArrowRightIcon'
const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  wrapper: {
    width: '860px',
    // minHeight: '540px',
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
function Test() {
  const classes = useStyles()
  const [hasAccess, setHasAccess] = useState(false)
  const methods = useForm()
  const userData = useSelector((state) => state.user)

  const navigate = useNavigate()
  const printContainer = useRef()
  const [company, setCompany] = useState('1')
  const [checkdata, setcheckdata] = useState()
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const documentName = useRef('Pharma CHEQUE')
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onAfterPrint: () => {
      //   navigate(`/sales/create`)
    },
  })

  const { data: registerCashList, refetch: refetchregisterCashList } = useQuery('registerCashList', () =>
    requests.getAllCashBoxList({ store_id: get(userData, 'store.id'), limit: 20, offset: 0 })
  )
  const { mutate: handleCashBoxCreate, isLoading: isCreatingCashbox } = useMutation(requests.createCashOperationBox, {
    onSuccess: ({ data }) => {
      success('tayyor')
    },
    onError: (err) => {
      error('Ошибка при создании кассы!')
      console.log('err', err)
    },
  })
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  const onSubmit = (data) => {
    const requestBody = {
      cash_amount: Number(get(data, 'opened_amout')),
      cash_box_id: get(data, 'registerCash_id.id', null),
      description: get(data, 'description'),
      store_id: get(userData, 'store.id'),
      employee_id: userData?.id,
      is_open: true,
    }

    handleCashBoxCreate(requestBody)
  }

  const { mutate: closeZReport, isLoading: iscloseZReport } = useMutation(requests.closeZReport, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        error(`err: ${get(data, 'message')?.split('Ru:')[1]}`)
        return
      } else {
        closeCheckZReport({
          token: 'DXJFX32CN1296678504F2',
          method: 'getZreportInfo',
          printerSize: 80,
          zReportId: 1,
        })
        success('Касса закрыта! (cose z report)')
      }
    },
    onError: (err) => {
      error('Ошибка закрытия кассы! (close Z Report)')
      console.log('err', err)
    },
  })

  const { mutate: closeCheckZReport, isLoading: iscloseCheckZReport } = useMutation(requests.closeCheckZReport, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        error(`err: ${get(data, 'message')?.split('Ru:')[1]}`)
        return
      } else {
        setcheckdata(get(data, 'message'))
        methods.handleSubmit(onSubmit, onError)()
        success('Касса закрыта! (cose z info report)')
      }
    },
    onError: (err) => {
      error('Ошибка закрытия кассы! (close Z info Report)')
      console.log('err', err)
    },
  })
  useEffect(() => {
    console.log(checkdata)

    if (checkdata) {
      handlePrint()
    }
  }, [checkdata])
  const { mutate: openZReport, isLoading: isopenZReport } = useMutation(requests.openZReport, {
    onSuccess: ({ data }) => {
      // if (true) {
      if (!get(data, 'error', true) && get(data, 'message') == 'SUCCESS') {
        success('tayyor')
        return
      } else {
        error(`err: ${get(data, 'message')?.split('Ru:')[1]}`)
      }
    },
    onError: (err) => {
      error('Ошибка при создании кассы! (open z report)')
      console.log('err', err)
    },
  })
  return (
    <Box>
      <Box sx={{ maxWidth: '400px', margin: 'auto', marginTop: '20px' }}>
        <InputPassword
          id='password'
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              if (e.target.value == 'parol') {
                setHasAccess(true)
              }
            }
          }}
          name='password'
          label={'Password'}
          autoCompleteOff
          required
          fullWidth
          minLength={8}
          secondary
        />
      </Box>
      {hasAccess && (
        <Box>
          <FormProvider {...methods}>
            <Box className={classes.box}>
              <Box className={classes.wrapper}>
                <Typography display={'flex'} alignItems={'center'} fontSize={'32px'} lineHeight={'48px'} fontWeight={'700'} color={'bunker.950'} p={'24px'}>
                  <>
                    <span className={classes.closeStoreDot} />
                    Kassa Yopiq
                  </>
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
                    </Box>
                    <Button type='submit' onClick={() => onSubmit()} sx={{ bottom: 0, '& > svg': { width: 24, height: 24, ml: '12px' } }}>
                      Kassani oching <ArrowRightIcon color={'#FF6018'} />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </FormProvider>
          <Box maxWidth={'1000px'} margin={'auto'} display={'flex'}>
            <Button
              type='submit'
              onClick={() =>
                openZReport({
                  token: 'DXJFX32CN1296678504F2', // Токен всегда равен DXJFX32CN1296678504F2, используется везде, Обязательное поле, String
                  method: 'openZreport', // Название метода, Обязательное поле, String
                })
              }
              sx={{ bottom: 0, '& > svg': { width: 24, height: 24, ml: '12px' } }}
            >
              e-pos Kassani oching <ArrowRightIcon color={'#FF6018'} />
            </Button>
            <Button
              type='submit'
              onClick={() =>
                closeZReport(
                  //   {
                  //   token: 'DXJFX32CN1296678504F2', // Токен всегда равен DXJFX32CN1296678504F2, используется везде, Обязательное поле, String
                  //   method: 'closeZreport', // Название метода, Обязательное поле, String
                  // }

                  {
                    token: 'DXJFX32CN1296678504F2',
                    method: 'getReceiptInfo',
                    number: 628,
                  }
                  // {
                  //   token: 'DXJFX32CN1296678504F2',
                  //   method: 'getReceiptsInfoByDate',
                  //   startDate: '20250318000000',
                  //   endDate: '20250321000000',
                  // }
                )
              }
              sx={{ bottom: 0, margin: '0 24px 24px', '& > svg': { width: 24, height: 24, ml: '12px' } }}
            >
              e-pos Закрыть кассу <ArrowRightIcon color={!true ? '#FF6018' : '#fff'} />
            </Button>
            <Button
              type='submit'
              onClick={() =>
                closeCheckZReport({
                  token: 'DXJFX32CN1296678504F2',
                  method: 'getZreportInfo',
                  printerSize: 80,
                  zReportId: 1,
                })
              }
              sx={{ bottom: 0, margin: '0 24px 24px', '& > svg': { width: 24, height: 24, ml: '12px' } }}
            >
              oldingi z achchot olish <ArrowRightIcon color={!true ? '#FF6018' : '#fff'} />
            </Button>
            <Button
              type='submit'
              onClick={() =>
                closeCheckZReport({
                  token: 'DXJFX32CN1296678504F2',
                  method: 'getZreportInfo',
                  printerSize: 80,
                  zReportId: 0,
                })
              }
              sx={{ bottom: 0, margin: '0 24px 24px', '& > svg': { width: 24, height: 24, ml: '12px' } }}
            >
              hozirgi z achchot olish <ArrowRightIcon color={!true ? '#FF6018' : '#fff'} />
            </Button>
            <Box
              maxWidth='400px'
              sx={{
                display: 'none',
                width: '255px',
              }}
            >
              <Box ref={printContainer}>
                <RippedPaperZReportCheck zrepo={checkdata} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Test
