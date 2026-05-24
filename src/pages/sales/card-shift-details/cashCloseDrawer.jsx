import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import RippedPaperZReportCheck from '@components/ChequePaper/ZReportCheck'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Drawer, Typography } from '@mui/material'
import LoadingContainer from '@components/LoadingContainer'
import { useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import thousandDivider from '@utils/thousandDivider'
import { useMutation, useQuery } from 'react-query'
import MoneyOutlineIcon from '@icons/MoneyOutline'
import ArrowRightIcon from '@icons/ArrowRightIcon'
import CartOutlineIcon from '@icons/CartOutline'
import { useReactToPrint } from 'react-to-print'
import { error, success } from '@utils/toast'
import { requests } from '@utils/requests'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import { Check, X } from 'lucide-react'
import '../new-sale/pos/PosLayout.css'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      borderRadius: '0px !important',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
    },
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0px',
    width: '100%',
  },
  wrapper: {
    width: '100vw',
    minHeight: '540px',
    display: 'flex',
    flexDirection: 'column',
    '& h5': {
      marginBottom: '4px',
    },
    '& .MuiInputBase-root': {
      height: '56px',
      borderRadius: '12px !important',
      marginTop: '0px',
    },
  },
  header: {
    backgroundColor: '#111827',
    color: '#ffffff',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px',
  },
  touchOptionCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: '64px',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    userSelect: 'none',
    transition: 'all 0.15s ease',
    marginBottom: '16px',
    boxSizing: 'border-box',
    '&:active': {
      backgroundColor: '#f8fafc',
      transform: 'scale(0.99)',
    },
    '&.selected': {
      backgroundColor: '#eff6ff',
      borderColor: '#2563eb',
    },
  },
  optionText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.4',
  },
  compactCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    border: '2px solid',
    borderColor: theme.palette.bunker[100],
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    marginBottom: '16px',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    marginRight: 12,
    padding: '12px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formField: {
    mt: '16px',
    '& .MuiInputBase-root': {
      height: '56px !important',
      borderRadius: '12px !important',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px !important',
    }
  },
  closeButton: {
    height: '56px',
    borderRadius: '0px !important',
    backgroundColor: '#2563eb !important',
    color: '#ffffff !important',
    fontWeight: '700 !important',
    fontSize: '16px !important',
    boxShadow: 'none !important',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#1d4ed8 !important',
    },
    '&:disabled': {
      backgroundColor: '#e2e8f0 !important',
      color: '#94a3b8 !important',
      cursor: 'not-allowed !important',
    },
  },
}))

function CashCloseDrawer({ open, setOpen }) {
  const classes = useStyles()
  const { id } = useParams()
  const navigate = useNavigate()
  const printContainer = useRef()
  const [company, setCompany] = useState('1')
  const [checkdata, setcheckdata] = useState()
  const methods = useForm()
  const reactToPrintContent = useCallback(() => printContainer.current, [])
  const documentName = useRef('Pharma CHEQUE')
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: documentName.current,
    removeAfterPrint: true,
    onAfterPrint: () => {
      navigate(`/sales/create`)
    },
  })

  const { data: closeCashboxPaymentsInfo } = useQuery(['closeCashboxPaymentsInfo', open], () => requests.getCloseCashboxPaymentsInfo(id), {
    enabled: open,
  })

  const { mutate: closeCheckZReport, isLoading: iscloseCheckZReport } = useMutation(requests.closeCheckZReport, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        error(`err: ${get(data, 'message')?.split('Ru:')[1]}`)
        return
      } else {
        setcheckdata(get(data, 'message'))
        methods.handleSubmit(onSubmit, onError)()
      }
    },
    onError: (err) => {
      error('Ошибка закрытия кассы! (close Z info Report)')
      console.error('err', err)
    },
  })

  useEffect(() => {
    if (checkdata) {
      handlePrint()
    }
  }, [checkdata])

  const { mutate: closeZReport, isLoading: iscloseZReport } = useMutation(requests.closeZReport, {
    onSuccess: ({ data }) => {
      if (get(data, 'message', '').includes('ERROR_ZREPORT_IS_NOT_OPEN') || get(data, 'error', true) == false) {
        closeCheckZReport({
          token: 'DXJFX32CN1296678504F2',
          method: 'getZreportInfo',
          printerSize: 80,
          zReportId: 1,
        })
        success('Касса закрыта! (cose z report)')
        return
      } else {
        error(`err: ${get(data, 'message')?.split('Ru:')[1]}`)
        return
      }
    },
    onError: (err) => {
      error('Ошибка закрытия кассы! (close Z Report)')
      console.error('err', err)
    },
  })

  const { mutate: closeCashBoxRegister, isLoading: iscloseCashBoxRegister } = useMutation(requests.closeCashBoxRegister, {
    onSuccess: () => {
      setOpen(false)
    },
    onError: (err) => {
      error('Ошибка закрытия кассы!')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    closeCashBoxRegister({
      id,
      data: {
        cash_amount: get(closeCashboxPaymentsInfo, 'data.data.cash_amount'),
        cashless_amount: get(closeCashboxPaymentsInfo, 'data.data.cashless_amount'),
        closed_amount: Number(get(data, 'closed_amount')),
        is_company: company == 2 ? true : false,
      },
    })
  }

  const onError = (err) => {
    console.error('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='bottom' elevation={1} className={classes.drawer}>
      <LoadingContainer noHeight readyState={!false}>
        <FormProvider {...methods}>
          <Box className={classes.box}>
            <Box className={classes.wrapper}>
              <Box className="pos-std-header">
                <Typography className="pos-std-title">
                  Закрыть кассу
                </Typography>
                <button type="button" className="pos-std-close-btn" onClick={() => setOpen(false)}>
                  <X size={20} />
                </button>
              </Box>

              <Box display={'flex'} p={'32px 32px 0'} gap={'32px'}>
                {/* Left side touchscreen options */}
                <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <div
                      onClick={() => setCompany('1')}
                      className={`${classes.touchOptionCard} ${company === '1' ? 'selected' : ''}`}
                    >
                      <span className={classes.optionText}>Оставьте всю сумму на кассе</span>
                      {company === '1' && <Check size={20} color="#2563eb" />}
                    </div>

                    <div
                      onClick={() => setCompany('2')}
                      className={`${classes.touchOptionCard} ${company === '2' ? 'selected' : ''}`}
                    >
                      <span className={classes.optionText}>Переведите всю сумму на счет компании</span>
                      {company === '2' && <Check size={20} color="#2563eb" />}
                    </div>

                    <div
                      onClick={() => setCompany('3')}
                      className={`${classes.touchOptionCard} ${company === '3' ? 'selected' : ''}`}
                    >
                      <span className={classes.optionText}>Оставьте часть в кассе и передайте остальную часть</span>
                      {company === '3' && <Check size={20} color="#2563eb" />}
                    </div>
                  </Box>

                  {company === '3' && (
                    <Box className={classes.formField}>
                      <NumberFormatInput
                        endAdornmentText={'UZS'}
                        end
                        type={'number'}
                        fullWidth
                        name='closed_amount'
                        label='Оставшаяся сумма'
                        placeholder='Введите оставшуюся сумму'
                      />
                    </Box>
                  )}
                </Box>

                {/* Vertical Divider */}
                <Box sx={{ borderLeft: '2px solid', borderColor: 'bunker.100', mx: '8px' }} />

                {/* Right side compact payment summaries */}
                <Box sx={{ width: '45%' }}>
                  <Typography fontSize={'15px'} fontWeight={'700'} color={'#475569'} mb={'16px'}>
                    Доступно на кассе:
                  </Typography>

                  <Box className={classes.compactCard}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box className={classes.iconBox}>
                        <MoneyOutlineIcon />
                      </Box>
                      <Typography fontSize={'18px'} fontWeight={'700'} color={'#0f172a'}>
                        Наличные
                      </Typography>
                    </Box>
                    <Typography fontSize={'20px'} fontWeight={'800'} color={'#2563eb'} display="flex" alignItems="center">
                      {thousandDivider(get(closeCashboxPaymentsInfo, 'data.data.cash_amount', null)) || 0}
                      <span style={{ marginLeft: '4px', fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>UZS</span>
                    </Typography>
                  </Box>

                  <Box className={classes.compactCard}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box className={classes.iconBox}>
                        <CartOutlineIcon />
                      </Box>
                      <Typography fontSize={'18px'} fontWeight={'700'} color={'#0f172a'}>
                        Карта
                      </Typography>
                    </Box>
                    <Typography fontSize={'20px'} fontWeight={'800'} color={'#2563eb'} display="flex" alignItems="center">
                      {thousandDivider(get(closeCashboxPaymentsInfo, 'data.data.cashless_amount', null)) || 0}
                      <span style={{ marginLeft: '4px', fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>UZS</span>
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Flex Spacer to push button down */}
              <Box flexGrow={1} minHeight="24px" />

              {/* Bottom fixed full-width button */}
              <Button
                disabled={iscloseZReport}
                type='button'
                onClick={() => {
                  closeZReport({
                    token: 'DXJFX32CN1296678504F2',
                    method: 'closeZreport',
                  })
                }}
                className={classes.closeButton}
                fullWidth
              >
                Закрыть кассу <ArrowRightIcon color="#fff" />
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </LoadingContainer>

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
    </Drawer>
  )
}

export default CashCloseDrawer
