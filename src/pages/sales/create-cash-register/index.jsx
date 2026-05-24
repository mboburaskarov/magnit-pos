import { setUserData } from '@/redux-toolkit/userSlice'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import LoadingContainer from '@components/LoadingContainer'
import ArrowRightIcon from '@icons/ArrowRightIcon'
import CartOutlineIcon from '@icons/CartOutline'
import MoneyOutlineIcon from '@icons/MoneyOutline'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import hasAccess from '@utils/hasAccess'
import { requests } from '@utils/requests'
import { EPOS_STATUS_PAYLOAD, EPOS_TERMINAL_PAYLOAD, getEposTerminalId, isAllowedTerminal } from '@utils/terminalAccess'
import { error } from '@utils/toast'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f1f5f9',
  },
  wrapper: {
    width: '960px',
    minHeight: '580px',
    border: '2px solid',
    borderColor: theme.palette.bunker[100],
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
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
    borderTopLeftRadius: '22px',
    borderTopRightRadius: '22px',
  },
  card_box: {
    border: '2px solid',
    borderColor: theme.palette.bunker[100],
    borderRadius: '16px',
    padding: '16px 20px',
    boxShadow: 'none',
    backgroundColor: '#ffffff',
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
  closeStoreDot: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    marginRight: '12px',
  },
  openStoreDot: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    marginRight: '12px',
  },
  keypadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    padding: '16px',
    boxSizing: 'border-box',
  },
  keypadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    gap: '10px',
    flex: 1,
  },
  keypadBtn: {
    height: '100%',
    minHeight: '48px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '22px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.1s ease',
    userSelect: 'none',
    '&:active': {
      backgroundColor: '#e2e8f0',
      borderColor: '#cbd5e1',
      transform: 'scale(0.94)',
    },
  },
  actionBtn: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    '&:active': {
      backgroundColor: '#e2e8f0',
    },
  },
  enterBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    gridColumn: 'span 3',
    fontSize: '16px',
    height: '56px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s ease',
    '&:active': {
      backgroundColor: '#1d4ed8',
      transform: 'scale(0.98)',
    },
  },
  touchSelectTrigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '56px',
    padding: '0 20px',
    backgroundColor: '#ffffff',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer',
    textAlign: 'left',
    outline: 'none',
    '&:active': {
      borderColor: '#2563eb',
      backgroundColor: '#f8fafc',
    },
  },
  selectedRegisterCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#eff6ff',
    border: '2px solid #2563eb',
    borderRadius: '12px',
  },
  registerDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  registerName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
  },
  registerMeta: {
    fontSize: '12px',
    color: '#475569',
  },
  changeRegisterBtn: {
    height: '36px',
    padding: '0 16px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    fontWeight: '600',
    color: '#2563eb',
    cursor: 'pointer',
    outline: 'none',
    '&:active': {
      backgroundColor: '#f1f5f9',
    },
  },
  registerSearchWrapper: {
    marginBottom: '12px',
  },
  registerSearchInput: {
    width: '100%',
    height: '56px',
    borderRadius: '12px',
    border: '2px solid #cbd5e1',
    padding: '0 20px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: '#2563eb',
    },
  },
  registerListScroll: {
    maxHeight: '220px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingRight: '4px',
  },
  registerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: '56px',
    padding: '12px 18px',
    backgroundColor: '#ffffff',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    userSelect: 'none',
    transition: 'all 0.15s ease',
    '&:active': {
      backgroundColor: '#f8fafc',
      transform: 'scale(0.99)',
    },
  },
  selectedRow: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  submitButton: {
    height: '56px',
    borderRadius: '12px !important',
    backgroundColor: '#2563eb !important',
    color: '#ffffff !important',
    fontWeight: '700 !important',
    fontSize: '16px !important',
    boxShadow: 'none !important',
    marginTop: '16px',
    '&:active': {
      backgroundColor: '#1d4ed8 !important',
    },
    '&:disabled': {
      opacity: '0.6 !important',
      cursor: 'not-allowed !important',
      backgroundColor: '#e2e8f0 !important',
      color: '#94a3b8 !important',
    },
  },
}))

function NewCashRegister() {
  const classes = useStyles()
  const userData = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [canCreate, setCanCreate] = useState(false)
  const methods = useForm()
  const dispatch = useDispatch()
  const [isEposTurnOn, setisEposTurnOn] = useState({ is_open: true, message: '' })
  
  // Focused Input Tracking
  const [focusedInput, setFocusedInput] = useState('opened_amout')
  
  // Touch register list picker states
  const [showRegisterList, setShowRegisterList] = useState(false)
  const [registerSearchQuery, setRegisterSearchQuery] = useState('')

  const { mutate: getUserInfo } = useMutation(requests.getUserInfo, {
    onSuccess: ({ data }) => {
      dispatch(setUserData({ ...data?.data }))
    },
    onError: () => {
      error('Ошибка получения пользовательских данных.!')
    },
  })
  useEffect(() => {
    getUserInfo()
  }, [])
  
  const { data: registerCashList } = useQuery(['registerCashList', userData], () =>
    requests.getAllCashBoxList({ store_id: get(userData, 'store.id'), limit: 20, offset: 0 }),
  )
  const { data: registerCashData, refetch: refetchregisterCashData } = useQuery('registerCashData', () =>
    requests.getRegisterCashData(get(methods.getValues('registerCash_id'), 'id', false)),
  )

  const { mutate: checkSaleExist, isLoading: isCheckSaleExist } = useMutation(requests.checkSaleExist, {
    onSuccess: ({ data }) => {
      if (get(data, 'data.is_open', false)) {
        navigate(`/sales/pos/${get(data, 'data.sale_id')}`)
        navigate(`/sales/pos/${get(data, 'data.sale_id')}`)
        if (window.parent) {
          window.parent.postMessage(
            {
              type: 'SAVE_CASH_BOX',
              payload: data?.data,
            },
            '*',
          )
        }
      }
    },
    onError: (err) => {
      console.error('err', err)
    },
  })

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
      const saleId = get(data, 'data.id')
      const device_id = get(data, 'data.device_id')
      localStorage.setItem('device_id', device_id)
      if (window.parent) {
        window.parent.postMessage(
          {
            type: 'SAVE_CASH_BOX',
            payload: {
              sale_id: saleId,
              cash_box_id: get(methods.getValues(), 'registerCash_id.id'),
              device_id,
              is_open: true,
              opened_at: Date.now(),
            },
          },
          '*',
        )
      }
      navigate(`/sales/pos/${saleId}`)
    },
    onError: (err) => {
      error('Ошибка при создании кассы!')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    const device_id = localStorage.getItem('device_id') || crypto.randomUUID()
    const requestBody = {
      cash_amount: Number(get(data, 'opened_amout')),
      cash_box_id: get(data, 'registerCash_id.id', null),
      description: '', // Izoh / comment input removed completely
      store_id: get(userData, 'store.id'),
      employee_id: userData?.id,
      device_id: device_id,
      is_open: true,
    }

    handleCashBoxCreate(requestBody)
  }

  const onError = (err) => {
    console.error('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  const { mutate: openZReport, isLoading: isopenZReport } = useMutation(requests.openZReport, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true) == false || get(data, 'message', '').includes('ERROR_ZREPORT_IS_ALREADY_OPEN')) {
        localStorage.setItem('leftZreportCount', get(data, 'leftZreportCount', 999))
        methods.handleSubmit((data) => onSubmit(data), onError)()
        return
      } else {
        if (get(data, 'message', '').includes('Ru:')) {
          error(`err: ${get(data, 'message')?.split('Ru:')[1]}`)
        } else {
          error(`err: ${get(data, 'message', 'Ошибка при создании кассы! (open z report)')}`)
        }
      }
    },
    onError: (err) => {
      error('Ошибка при создании кассы! (open z report)')
      console.error('err', err)
    },
  })

  const { mutate: checkEPOSTurnOn, isLoading: ischeckEPOSTurnOn } = useMutation(requests.checkEPOSTurnOn, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        setisEposTurnOn({ is_open: false, message: 'Программа EPOS отключена. Запустить программу EPOS!' })
      } else {
        closeCheckZReport(EPOS_TERMINAL_PAYLOAD)
      }
    },
    onError: (err) => {
      setisEposTurnOn({ is_open: false, message: 'Программа EPOS отключена. Запустить программу EPOS!' })
      error('Программа EPOS отключена. Запустить программу EPOS')
      console.error('err', err)
    },
  })

  const { mutate: closeCheckZReport, isLoading: iscloseCheckZReport } = useMutation(requests.closeCheckZReport, {
    onSuccess: ({ data }) => {
      const terminalID = getEposTerminalId(data)
      const terminalIds = userData?.store?.terminal_ids || []
      const allowedTerminal = isAllowedTerminal(terminalID, terminalIds)

      if (!allowedTerminal && hasAccess('check-terminal-id', userData)) {
        setisEposTurnOn({ is_open: false, message: `Вы в другом филиале! Epos: ${terminalID} Pharma: ${terminalIds?.join(',')}` })
        return
      }
      if (get(data, 'error', true)) {
        setisEposTurnOn({ is_open: false, message: 'Программа EPOS отключена. Запустить программу EPOS!' })
      } else {
        const device_id = localStorage.getItem('device_id')
        checkSaleExist({ store_id: get(userData, 'store.id'), device_id })
      }
    },
    onError: (err) => {
      setisEposTurnOn({ is_open: false, message: 'Программа EPOS отключена. Запустить программу EPOS!' })
      error('Ошибка закрытия кассы! (close Z info Report)')
      console.log('err', err)
    },
  })

  useEffect(() => {
    checkEPOSTurnOn(EPOS_STATUS_PAYLOAD)
  }, [])

  const handleOpenCashbox = () => {
    const selectedRegister = methods.watch('registerCash_id')
    if (!selectedRegister) {
      error('Пожалуйста, выберите кассу!')
      return
    }
    if (!get(selectedRegister, 'is_open', true)) {
      openZReport({
        token: 'DXJFX32CN1296678504F2',
        method: 'openZreport',
      })
    } else {
      methods.handleSubmit((data) => onSubmit(data), onError)()
    }
  }

  // Keypad processing logic
  const handleKeypadPress = (val) => {
    if (!focusedInput) return
    const currentVal = methods.getValues(focusedInput) || ''
    const currentString = String(currentVal)
    
    if (val === 'clear') {
      methods.setValue(focusedInput, '', { shouldValidate: true })
    } else if (val === 'backspace') {
      const nextString = currentString.slice(0, -1)
      methods.setValue(focusedInput, nextString ? Number(nextString) : '', { shouldValidate: true })
    } else if (val === 'enter') {
      handleOpenCashbox()
    } else {
      // Append number digits
      const nextString = currentString + val
      methods.setValue(focusedInput, Number(nextString), { shouldValidate: true })
    }
  }

  const registers = registerCashList?.data?.data?.data || []
  const filteredRegisters = registers.filter((reg) =>
    (reg.full_name || reg.name || '').toLowerCase().includes(registerSearchQuery.toLowerCase())
  )

  const selectedRegister = methods.watch('registerCash_id')
  const isSubmitDisabled = get(canCreate, 'is_open') || isopenZReport || isCreatingCashbox || !selectedRegister

  return (
    <LoadingContainer readyState={!isCheckSaleExist && !iscloseCheckZReport && !ischeckEPOSTurnOn}>
      <FormProvider {...methods}>
        {isEposTurnOn?.is_open ? (
          <Box className={classes.box}>
            <Box className={classes.wrapper}>
              <Box className={classes.header}>
                {get(canCreate, 'is_open') ? (
                  <>
                    <span className={classes.openStoreDot} />
                    <Typography fontSize={'24px'} fontWeight={'700'} color={'#ffffff'}>
                      Kassa Ochiq ({get(registerCashList, 'data.data.data', null).find((a) => a.id == get(methods.watch('registerCash_id'), 'id'))?.full_name})
                    </Typography>
                  </>
                ) : (
                  <>
                    <span className={classes.closeStoreDot} />
                    <Typography fontSize={'24px'} fontWeight={'700'} color={'#ffffff'}>
                      Kassa Yopiq
                    </Typography>
                  </>
                )}
              </Box>

              <Box display={'flex'} p={'32px'} gap={'32px'} alignItems={'stretch'}>
                {/* Left side inputs and summary */}
                <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography fontSize={'14px'} fontWeight={'700'} color={'#475569'} mb={'8px'}>
                      Kassa *
                    </Typography>
                    
                    {showRegisterList ? (
                      <Box>
                        <Box className={classes.registerSearchWrapper}>
                          <input
                            type="text"
                            className={classes.registerSearchInput}
                            placeholder="Kassani qidirish..."
                            value={registerSearchQuery}
                            onChange={(e) => setRegisterSearchQuery(e.target.value)}
                            autoFocus
                          />
                        </Box>
                        <Box className={classes.registerListScroll}>
                          {filteredRegisters.map((reg) => (
                            <div
                              key={reg.id}
                              className={`${classes.registerRow} ${selectedRegister?.id === reg.id ? classes.selectedRow : ''}`}
                              onClick={() => {
                                methods.setValue('registerCash_id', reg, { shouldValidate: true })
                                setShowRegisterList(false)
                              }}
                            >
                              <div className={classes.registerDetails}>
                                <span className={classes.registerName}>{reg.full_name || reg.name}</span>
                                <span className={classes.registerMeta}>
                                  Status: {reg.is_open ? 'Ochiq (Open)' : 'Yopiq (Closed)'}
                                </span>
                              </div>
                              {selectedRegister?.id === reg.id && (
                                <Check color="#2563eb" size={20} />
                              )}
                            </div>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        {selectedRegister ? (
                          <div className={classes.selectedRegisterCard}>
                            <div className={classes.registerDetails}>
                              <span className={classes.registerName}>{selectedRegister.full_name || selectedRegister.name}</span>
                              <span className={classes.registerMeta}>
                                Status: {selectedRegister.is_open ? 'Ochiq (Open)' : 'Yopiq (Closed)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              className={classes.changeRegisterBtn}
                              onClick={() => setShowRegisterList(true)}
                            >
                              O'zgartirish
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={classes.touchSelectTrigger}
                            onClick={() => setShowRegisterList(true)}
                          >
                            <span>Kassirni tanlang</span>
                            <ChevronRight size={20} />
                          </button>
                        )}
                      </Box>
                    )}

                    <Box height={'24px'} />
                    
                    <Box className={classes.formField}>
                      <NumberFormatInput
                        endAdornmentText={'UZS'}
                        end
                        type='number'
                        fullWidth
                        name='opened_amout'
                        label='Ochilish miqdori'
                        placeholder='Miqdorni kiriting'
                        onFocus={() => setFocusedInput('opened_amout')}
                      />
                    </Box>
                  </Box>

                  <Box display="flex" gap="16px" mt="20px">
                    <Box className={classes.card_box} flex={1}>
                      <Box display={'flex'} alignItems={'center'}>
                        <Box className={classes.iconBox}>
                          <MoneyOutlineIcon />
                        </Box>
                        <Typography fontSize={'18px'} fontWeight={'700'} color={'#0f172a'}>
                          Naqd
                        </Typography>
                      </Box>
                      <Box my={'12px'} border={'1px solid'} borderColor={'#f1f5f9'} />
                      <Box display={'flex'} justifyContent={'end'}>
                        <Typography display={'flex'} fontSize={'20px'} fontWeight={'700'} color={'#2563eb'}>
                          {get(registerCashData, 'data.data.closed_amount', null) || 0}
                          <Typography mx={'4px'} fontSize={'20px'} fontWeight={'700'} color={'#94a3b8'}>
                            UZS
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>

                    <Box className={classes.card_box} flex={1}>
                      <Box display={'flex'} alignItems={'center'}>
                        <Box className={classes.iconBox}>
                          <CartOutlineIcon />
                        </Box>
                        <Typography fontSize={'18px'} fontWeight={'700'} color={'#0f172a'}>
                          Karta
                        </Typography>
                      </Box>
                      <Box my={'12px'} border={'1px solid'} borderColor={'#f1f5f9'} />
                      <Box display={'flex'} justifyContent={'end'}>
                        <Typography display={'flex'} fontSize={'20px'} fontWeight={'700'} color={'#2563eb'}>
                          0
                          <Typography mx={'4px'} fontSize={'20px'} fontWeight={'700'} color={'#94a3b8'}>
                            UZS
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    type='button'
                    onClick={handleOpenCashbox}
                    disabled={isSubmitDisabled}
                    className={classes.submitButton}
                    fullWidth
                  >
                    Kassani oching <ArrowRightIcon color={isSubmitDisabled ? '#94a3b8' : '#fff'} />
                  </Button>
                </Box>

                {/* Right side numeric keypad */}
                <Box sx={{ width: '45%', display: 'flex', flexDirection: 'column' }}>
                  <div className={classes.keypadContainer}>
                    <div className={classes.keypadGrid}>
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => {
                        let btnClass = classes.keypadBtn
                        if (key === 'C' || key === '⌫') {
                          btnClass = `${classes.keypadBtn} ${classes.actionBtn}`
                        }
                        return (
                          <button
                            key={key}
                            type="button"
                            className={btnClass}
                            onClick={() => handleKeypadPress(key === 'C' ? 'clear' : key === '⌫' ? 'backspace' : key)}
                          >
                            {key}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      type="button"
                      className={classes.enterBtn}
                      disabled={isSubmitDisabled}
                      onClick={() => handleKeypadPress('enter')}
                    >
                      Kassani oching (Enter)
                    </button>
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box display={'flex'} alignItems={'center'} color={'#ef4444'} fontSize={'20px'} fontWeight={'700'} justifyContent={'center'} height={'100vh'}>
            {get(isEposTurnOn, 'message')}
          </Box>
        )}
      </FormProvider>
    </LoadingContainer>
  )
}

export default NewCashRegister
