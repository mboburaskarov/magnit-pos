import { setUserData } from '@/redux-toolkit/userSlice'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import LogoMain from '@icons/LogoMain'

import { Box, Button, Typography, Dialog } from '@mui/material'
import { makeStyles } from '@mui/styles'
import hasAccess from '@utils/hasAccess'
import { requests } from '@utils/requests'
import { EPOS_STATUS_PAYLOAD, EPOS_TERMINAL_PAYLOAD, getEposTerminalId, isAllowedTerminal } from '@utils/terminalAccess'
import { error } from '@utils/toast'
import { get } from 'lodash'
import { useEffect, useState, useRef, useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, AlertCircle, Banknote, CreditCard } from 'lucide-react'

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
    minHeight: '0px',
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
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    borderRadius: '12px',
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
    height: '72px',
    minHeight: '72px',
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
    height: '72px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s ease',
    '&:active': {
      backgroundColor: '#1d4ed8',
      transform: 'scale(0.98)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      backgroundColor: '#e2e8f0',
      color: '#94a3b8',
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
    maxHeight: '380px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingRight: '4px',
    position: 'absolute',
    top: '60px',
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: '#ffffff',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    padding: '8px',
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
  eposDialogRoot: {
    '& .MuiDialog-paper.MuiDialog-paper': {
      width: '100%',
      maxWidth: 480,
      padding: '40px 32px',
      borderRadius: 24,
      boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.15) !important',
      border: `1px solid ${theme.palette.bunker[100]}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 16,
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
    },
    zIndex: 1400,
  },
  eposIconContainer: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: theme.palette.red[10] || '#FFF1F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.red[500] || '#F45B69',
    marginBottom: 8,
  },
  eposTitle: {
    fontSize: '24px !important',
    fontWeight: '800 !important',
    color: (theme.palette.black || '#111217') + ' !important',
    margin: '0 !important',
  },
  eposDescription: {
    fontSize: '16px !important',
    color: (theme.palette.gray[600] || '#6F6F6F') + ' !important',
    lineHeight: '1.5 !important',
    margin: '0 !important',
  },
  eposStatusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: theme.palette.background.gray || '#F9F9FA',
    borderRadius: 12,
    border: `1px solid ${theme.palette.bunker[100]}`,
    width: '100%',
    boxSizing: 'border-box',
    marginTop: 8,
  },
  eposStatusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.bunker[300] || '#B1B7C8',
    animation: '$pulse 2s infinite ease-in-out',
  },
  eposStatusText: {
    fontSize: '14px !important',
    fontWeight: '600 !important',
    color: (theme.palette.gray[600] || '#6F6F6F') + ' !important',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.9)',
      opacity: 0.6,
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(0.9)',
      opacity: 0.6,
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

  // Loading, error and status states for the overlay
  const [initLoading, setInitLoading] = useState(true)
  const [initError, setInitError] = useState(false)
  const [initErrorMessage, setInitErrorMessage] = useState('')
  const [statusText, setStatusText] = useState('Подключаем POS и подготавливаем чек')
  const [showTimerHint, setShowTimerHint] = useState(false)
  const [retryAction, setRetryAction] = useState(null)

  // Track if a continue action is in progress
  const [isContinuing, setIsContinuing] = useState(false)

  // Focused Input Tracking
  const [focusedInput, setFocusedInput] = useState('opened_amout')

  // Touch register list picker states
  const [showRegisterList, setShowRegisterList] = useState(false)
  const [registerSearchQuery, setRegisterSearchQuery] = useState('')

  const { mutate: getUserInfo } = useMutation(requests.getUserInfo, {
    onSuccess: ({ data }) => {
      dispatch(setUserData({ ...data?.data }))
    },
    onError: (err) => {
      error('Foydalanuvchi ma‘lumotlarini olishda xatolik yuz berdi!')
      setInitError(true)
      setInitLoading(false)
      setInitErrorMessage('Foydalanuvchi ma‘lumotlarini yuklab bo‘lmadi. Internet aloqasini tekshiring.')
      setRetryAction(() => () => {
        setInitError(false)
        setInitLoading(true)
        getUserInfo()
      })
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

  const initStartedRef = useRef(false)
  const abortControllerRef = useRef(null)

  const runInitCheck = useCallback(async () => {
    if (initStartedRef.current) return
    initStartedRef.current = true

    setInitLoading(true)
    setInitError(false)
    setInitErrorMessage('')
    setStatusText('Подключаем POS и подготавливаем чек')
    setShowTimerHint(false)

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller
    const { signal } = controller

    const timer = setTimeout(() => {
      if (!signal.aborted) {
        setShowTimerHint(true)
      }
    }, 6000)

    const withTimeout = (promise, ms = 12000) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => {
          const tId = setTimeout(() => reject(new Error('TIMEOUT')), ms)
          signal.addEventListener('abort', () => clearTimeout(tId))
        }),
      ])
    }

    try {
      // Step 1: Check EPOS
      setStatusText('Проверка соединения с EPOS...')
      const eposStatus = await withTimeout(requests.checkEPOSTurnOn(EPOS_STATUS_PAYLOAD, { signal }))

      if (get(eposStatus, 'data.error', true)) {
        setisEposTurnOn({ is_open: false, message: 'Программа EPOS отключена. Запустить программу EPOS!' })
        setInitLoading(false)
        clearTimeout(timer)
        return
      }

      // Step 2: Z-Report & Terminal ID check
      setStatusText('Проверка статуса Z-отчёта...')
      const zReportStatus = await withTimeout(requests.closeCheckZReport(EPOS_TERMINAL_PAYLOAD, { signal }))

      const terminalID = getEposTerminalId(zReportStatus?.data)
      const terminalIds = userData?.store?.terminal_ids || []
      const allowedTerminal = isAllowedTerminal(terminalID, terminalIds)

      if (!allowedTerminal && hasAccess('check-terminal-id', userData)) {
        setisEposTurnOn({
          is_open: false,
          message: `Вы в другом филиале! Epos: ${terminalID} AccountID: ${terminalIds?.join(',')}`,
        })
        setInitLoading(false)
        clearTimeout(timer)
        return
      }

      if (get(zReportStatus, 'data.error', true)) {
        setisEposTurnOn({ is_open: false, message: 'Программа EPOS отключена. Запустить программу EPOS!' })
        setInitLoading(false)
        clearTimeout(timer)
        return
      }

      setisEposTurnOn({ is_open: true, message: '' })

      // Step 3: Check Active Sale
      setStatusText('Проверка активной кассовой сессии...')

      let device_id = localStorage.getItem('device_id')
      if (device_id === 'null' || device_id === 'undefined') {
        device_id = null
      }
      if (!device_id) {
        device_id = terminalID
      }
      if (!device_id && userData?.store?.terminal_ids?.length > 0) {
        device_id = userData.store.terminal_ids[0]
      }

      // Guard: if device_id is missing, there's nothing to resolve here — send
      // the cashier back to /login, which owns the single device-bound
      // cashbox flow now (no manual cashbox picker).
      if (!device_id) {
        clearTimeout(timer)
        window.location.replace('/login')
        return
      }

      // Store device_id to ensure it's not null on next run
      localStorage.setItem('device_id', device_id)

      const checkSaleResponse = await withTimeout(requests.checkSaleExist({ store_id: get(userData, 'store.id'), device_id }, { signal }))

      if (get(checkSaleResponse, 'data.data.is_open', false)) {
        const saleId = get(checkSaleResponse, 'data.data.sale_id')
        if (window.parent) {
          window.parent.postMessage(
            {
              type: 'SAVE_CASH_BOX',
              payload: checkSaleResponse?.data?.data,
            },
            '*',
          )
        }
        navigate(`/sales/pos/${saleId}`, { replace: true })
        clearTimeout(timer)
        return
      }

      // No active sale on an open cashbox for this device: the manual
      // cashbox picker below is deprecated (one device = one cashbox now) —
      // send the cashier to /login to resolve/open their shift there instead.
      clearTimeout(timer)
      window.location.replace('/login')
      return
    } catch (err) {
      if (signal.aborted) return
      console.error('Initialization error:', err)

      // No open cashbox operation for this device: same as above, resolve
      // it through /login rather than the deprecated manual picker here.
      const isNoOpenCashbox =
        err?.response?.status === 404 ||
        err?.response?.data?.code === 404 ||
        (err?.response?.data?.data && String(err.response.data.data).includes('You have no open cashbox operation')) ||
        (err?.response?.data?.message && String(err.response.data.message).includes('You have no open cashbox operation'))

      if (isNoOpenCashbox) {
        clearTimeout(timer)
        window.location.replace('/login')
        return
      }

      setInitError(true)
      setInitLoading(false)
      const isTimeout = err?.message === 'TIMEOUT'
      setInitErrorMessage(
        isTimeout
          ? 'Время ожидания запроса истекло. Пожалуйста, проверьте подключение к сети и EPOS.'
          : err?.response?.data?.message || 'Не удалось связаться с сервером кассы. Проверьте подключение.',
      )
      setRetryAction(() => () => {
        initStartedRef.current = false
        runInitCheck()
      })
    } finally {
      clearTimeout(timer)
    }
  }, [userData, navigate])

  useEffect(() => {
    if (userData?.store?.id) {
      runInitCheck()
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      initStartedRef.current = false
    }
  }, [userData?.store?.id, runInitCheck])

  useEffect(() => {
    if (registerCashData) setCanCreate((a) => ({ ...a, canCreate: true }))
  }, [registerCashData])

  useEffect(() => {
    refetchregisterCashData().then(() => {
      setCanCreate({ canCreate: true, is_open: get(methods.watch('registerCash_id'), 'is_open') })
    })
  }, [methods.watch('registerCash_id')])

  // Auto-select the cashbox saved in localStorage on list load
  const registers = registerCashList?.data?.data?.data || []
  useEffect(() => {
    if (registers.length > 0 && !methods.watch('registerCash_id')) {
      const saved = localStorage.getItem('selected_cashbox')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const found = registers.find((r) => r.id === parsed.id)
          if (found) {
            methods.setValue('registerCash_id', found, { shouldValidate: true })
          } else {
            methods.setValue('registerCash_id', parsed, { shouldValidate: true })
          }
        } catch (e) {
          console.error('Error parsing selected_cashbox:', e)
        }
      }
    }
  }, [registers, methods])

  const { mutate: handleCashBoxCreate, isLoading: isCreatingCashbox } = useMutation(requests.createCashOperationBox, {
    onSuccess: ({ data }) => {
      const saleId = get(data, 'data.id')
      const device_id = get(data, 'data.device_id')
      localStorage.setItem('device_id', device_id)
      const selectedReg = methods.getValues('registerCash_id')
      const cashboxInfo = {
        id: selectedReg.id,
        name: selectedReg.name,
        full_name: selectedReg.full_name,
        store_id: selectedReg.store_id || get(userData, 'store.id'),
        store_name: selectedReg.store_name || get(userData, 'store.name'),
        is_open: true,
      }
      localStorage.setItem('selected_cashbox', JSON.stringify(cashboxInfo))
      if (window.parent) {
        window.parent.postMessage(
          {
            type: 'SAVE_CASH_BOX',
            payload: {
              ...cashboxInfo,
              sale_id: saleId,
              cash_box_id: selectedReg.id,
              device_id,
              opened_at: Date.now(),
            },
          },
          '*',
        )
      }
      navigate(`/sales/pos/${saleId}`)
    },
    onError: (err) => {
      error('Kassani ochib bo‘lmadi')
      console.error('err', err)
      setInitError(true)
      setInitErrorMessage(err?.response?.data?.message || err?.message || 'Kassani ochib bo‘lmadi')
      setRetryAction(() => () => handleOpenCashbox())
    },
  })

  const onSubmit = (data) => {
    const device_id = localStorage.getItem('device_id') || crypto.randomUUID()
    const requestBody = {
      opened_amount: Number(get(data, 'opened_amout') || 0),
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
    error('Iltimos, barcha maydonlarni to‘ldiring!')
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
          error(`err: ${get(data, 'message', 'Kassani ochib bo‘lmadi (open z report)')}`)
        }
      }
    },
    onError: (err) => {
      error('Kassani ochib bo‘lmadi')
      console.error('err', err)
      setInitError(true)
      setInitErrorMessage(err?.response?.data?.message || err?.message || 'Kassani ochib bo‘lmadi')
      setRetryAction(() => () => handleOpenCashbox())
    },
  })

  const isEposDisconnected = !isEposTurnOn.is_open && (!isEposTurnOn.message || !isEposTurnOn.message.includes('филиале'))

  useEffect(() => {
    if (!isEposDisconnected) return

    const interval = setInterval(async () => {
      try {
        const response = await requests.checkEPOSTurnOn(EPOS_STATUS_PAYLOAD)
        if (response && !get(response, 'data.error', true)) {
          initStartedRef.current = false
          runInitCheck()
          clearInterval(interval)
        }
      } catch (err) {
        // Silent catch during polling
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isEposDisconnected, runInitCheck])

  // Custom function to continue an already open cashbox
  const handleContinueOpenCashbox = async (selectedRegister) => {
    setIsContinuing(true)
    const device_id = localStorage.getItem('device_id') || crypto.randomUUID()
    localStorage.setItem('device_id', device_id)

    const cashboxInfo = {
      id: selectedRegister.id,
      name: selectedRegister.name,
      full_name: selectedRegister.full_name,
      store_id: selectedRegister.store_id || get(userData, 'store.id'),
      store_name: selectedRegister.store_name || get(userData, 'store.name'),
      is_open: true,
    }

    localStorage.setItem('selected_cashbox', JSON.stringify(cashboxInfo))

    try {
      const checkRes = await requests.checkSaleExist({
        store_id: cashboxInfo.store_id,
        cash_box_id: cashboxInfo.id,
        device_id,
      })

      const saleId = get(checkRes, 'data.data.sale_id')
      if (saleId) {
        if (window.parent) {
          window.parent.postMessage(
            {
              type: 'SAVE_CASH_BOX',
              payload: {
                ...cashboxInfo,
                sale_id: saleId,
                cash_box_id: cashboxInfo.id,
                device_id,
                opened_at: Date.now(),
              },
            },
            '*',
          )
        }
        navigate(`/sales/pos/${saleId}`)
        return
      }
    } catch (err) {
      console.log('No active sale found for cashbox, will fetch operation and create a new sale:', err)
    }

    try {
      const opInfoRes = await requests.getCashBoxOperationInfo(cashboxInfo.id)
      const cashBoxOpId = get(opInfoRes, 'data.data.id')

      if (!cashBoxOpId) {
        throw new Error('Cashbox operation ID not found')
      }

      const newSaleRes = await requests.saleCreate({
        cash_box_operation_id: cashBoxOpId,
        store_id: cashboxInfo.store_id,
      })

      const newSaleId = get(newSaleRes, 'data.id')
      if (!newSaleId) {
        throw new Error('Failed to create a new sale')
      }

      if (window.parent) {
        window.parent.postMessage(
          {
            type: 'SAVE_CASH_BOX',
            payload: {
              ...cashboxInfo,
              sale_id: newSaleId,
              cash_box_id: cashboxInfo.id,
              device_id,
              opened_at: Date.now(),
            },
          },
          '*',
        )
      }
      navigate(`/sales/pos/${newSaleId}`)
    } catch (err) {
      console.error('Error continuing open cashbox:', err)
      error('Kassani davom ettirib bo‘lmadi')
    } finally {
      setIsContinuing(false)
    }
  }

  const handleOpenCashbox = () => {
    const selectedRegister = methods.watch('registerCash_id')
    if (!selectedRegister) {
      error('Iltimos, kassani tanlang!')
      return
    }
    if (!get(selectedRegister, 'is_open', true)) {
      openZReport({
        token: 'DXJFX32CN1296678504F2',
        method: 'openZreport',
      })
    } else {
      handleContinueOpenCashbox(selectedRegister)
    }
  }

  // Keypad processing logic
  const handleKeypadPress = (val) => {
    if (val === 'enter') {
      const selectedRegister = methods.watch('registerCash_id')
      if (selectedRegister) {
        if (selectedRegister.is_open) {
          handleContinueOpenCashbox(selectedRegister)
        } else {
          if (!isopenZReport && !isCreatingCashbox) {
            handleOpenCashbox()
          }
        }
      }
      return
    }

    if (!focusedInput) return
    const currentVal = methods.getValues(focusedInput) || ''
    const currentString = String(currentVal)

    if (val === 'clear') {
      methods.setValue(focusedInput, '', { shouldValidate: true })
    } else if (val === 'backspace') {
      const nextString = currentString.slice(0, -1)
      methods.setValue(focusedInput, nextString ? Number(nextString) : '', { shouldValidate: true })
    } else {
      // Append number digits
      const nextString = currentString + val
      methods.setValue(focusedInput, Number(nextString), { shouldValidate: true })
    }
  }

  const filteredRegisters = registers.filter((reg) => (reg.full_name || reg.name || '').toLowerCase().includes(registerSearchQuery.toLowerCase()))

  const selectedRegister = methods.watch('registerCash_id')
  const openingAmount = methods.watch('opened_amout')

  let buttonText = 'Kassani tanlang'
  let isSubmitDisabled = true

  if (selectedRegister) {
    if (selectedRegister.is_open) {
      buttonText = 'Davom ettirish (Enter)'
      isSubmitDisabled = isContinuing
    } else {
      buttonText = 'Kassani ochish (Enter)'
      isSubmitDisabled = isopenZReport || isCreatingCashbox
    }
  }

  // Handle global Enter key down listener
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (showRegisterList) return

        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur()
        }

        event.preventDefault()
        if (selectedRegister) {
          if (selectedRegister.is_open) {
            handleContinueOpenCashbox(selectedRegister)
          } else {
            if (!isopenZReport && !isCreatingCashbox && !isContinuing) {
              handleOpenCashbox()
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [selectedRegister, isopenZReport, isCreatingCashbox, isContinuing, methods, showRegisterList])

  const isPageLoading = initLoading || isopenZReport || isCreatingCashbox || isContinuing

  if (isPageLoading || initError) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: '#0B1220', // Premium dark navy background
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Magnit POS Logo */}
          <Box sx={{ mb: 4, height: '40px', display: 'flex', alignItems: 'center' }}>
            <LogoMain />
          </Box>

          {initError ? (
            // Error State UI
            <>
              <Box sx={{ color: '#ef4444', mb: 3 }}>
                <AlertCircle size={64} strokeWidth={1.5} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '28px', mb: 2, color: '#ffffff' }}>Не удалось создать продажу</Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '16px', mb: 4, lineHeight: 1.5 }}>
                {initErrorMessage || 'Проверьте подключение и попробуйте снова.'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
                <Button
                  variant='contained'
                  onClick={() => {
                    setInitError(false)
                    if (retryAction) retryAction()
                  }}
                  sx={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '15px',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                  }}
                >
                  Повторить
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => navigate(-1)}
                  sx={{
                    borderColor: '#475569',
                    color: '#cbd5e1',
                    fontWeight: 700,
                    fontSize: '15px',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#94a3b8',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  Вернуться назад
                </Button>
              </Box>
            </>
          ) : (
            // Loading State UI
            <>
              {/* Spinning Progress Circle */}
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                  borderTopColor: '#2563eb',
                  animation: 'spin 1s linear infinite',
                  mb: 4,
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography sx={{ fontWeight: 800, fontSize: '28px', mb: 1, color: '#ffffff' }}>Создание кассы</Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '16px', mb: 2, lineHeight: 1.5 }}>Идёт создание кассовой сессии, пожалуйста подождите…</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>{statusText || 'Подключаем POS и подготавливаем чек'}</Typography>

              {showTimerHint && (
                <Typography
                  sx={{
                    color: '#475569',
                    fontSize: '12px',
                    mt: 3,
                    animation: 'fadeIn 0.5s ease-in-out',
                    '@keyframes fadeIn': {
                      from: { opacity: 0 },
                      to: { opacity: 1 },
                    },
                  }}
                >
                  Это может занять несколько секунд
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <FormProvider {...methods}>
      <Box className={classes.box}>
        <Box className={classes.wrapper}>
          <Box className={classes.header}>
            {selectedRegister ? (
              <>
                <span className={selectedRegister.is_open ? classes.openStoreDot : classes.closeStoreDot} />
                <Typography fontSize={'24px'} fontWeight={'700'} color={'#ffffff'}>
                  Kassa {selectedRegister.is_open ? 'Ochiq' : 'Yopiq'} — {selectedRegister.name}
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
            <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column' }}>
              {/* Top part: cashbox select + opening amount */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Box>
                  <Typography fontSize={'14px'} fontWeight={'700'} color={'#475569'} mb={'8px'}>
                    Kassa *
                  </Typography>

                  {showRegisterList ? (
                    <Box sx={{ position: 'relative', zIndex: 100 }}>
                      <Box className={classes.registerSearchWrapper}>
                        <input
                          type='text'
                          className={classes.registerSearchInput}
                          placeholder='Kassani qidirish...'
                          value={registerSearchQuery}
                          onChange={(e) => setRegisterSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </Box>
                      <Box
                        className={classes.registerListScroll}
                        sx={{
                          maxHeight: '380px',
                          overflowY: 'auto',
                          zIndex: 100,
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          p: '8px',
                          border: '2px solid #cbd5e1',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                          position: 'absolute',
                          top: '60px',
                          left: 0,
                          right: 0,
                          // Custom scrollbar styling
                          '&::-webkit-scrollbar': {
                            width: '6px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: '#f8fafc',
                            borderRadius: '3px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#cbd5e1',
                            borderRadius: '3px',
                          },
                          '&::-webkit-scrollbar-thumb:hover': {
                            background: '#94a3b8',
                          },
                        }}
                      >
                        {filteredRegisters.map((reg) => (
                          <Box
                            key={reg.id}
                            onClick={() => {
                              methods.setValue('registerCash_id', reg, { shouldValidate: true })
                              setShowRegisterList(false)
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              p: '10px 16px',
                              backgroundColor: selectedRegister?.id === reg.id ? '#eff6ff' : '#ffffff',
                              border: '2px solid',
                              borderColor: selectedRegister?.id === reg.id ? '#2563eb' : '#e2e8f0',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              userSelect: 'none',
                              transition: 'all 0.15s ease',
                              '&:hover': {
                                backgroundColor: '#f8fafc',
                                borderColor: '#cbd5e1',
                              },
                              '&:active': {
                                transform: 'scale(0.99)',
                              },
                            }}
                          >
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{reg.full_name || reg.name}</span>
                                <span
                                  style={{
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    border: '1px solid #e2e8f0',
                                  }}
                                >
                                  {reg.name}
                                </span>
                              </div>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>{reg.store_name || get(userData, 'store.name')}</span>
                              <div style={{ marginTop: '2px', display: 'flex' }}>
                                {reg.is_open ? (
                                  <span
                                    style={{
                                      backgroundColor: '#dcfce7',
                                      color: '#15803d',
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      padding: '1px 6px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    Ochiq
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      backgroundColor: '#fee2e2',
                                      color: '#b91c1c',
                                      fontSize: '11px',
                                      fontWeight: '700',
                                      padding: '1px 6px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    Yopiq
                                  </span>
                                )}
                              </div>
                            </div>
                            {selectedRegister?.id === reg.id && <Check color='#2563eb' size={20} style={{ marginLeft: '8px' }} />}
                          </Box>
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
                              {selectedRegister.name} • {selectedRegister.store_name || get(userData, 'store.name')}
                            </span>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {selectedRegister.is_open ? (
                                <Box
                                  sx={{
                                    backgroundColor: '#dcfce7',
                                    color: '#15803d',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    px: '8px',
                                    py: '2px',
                                    borderRadius: '6px',
                                  }}
                                >
                                  Ochiq
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    backgroundColor: '#fee2e2',
                                    color: '#b91c1c',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    px: '8px',
                                    py: '2px',
                                    borderRadius: '6px',
                                  }}
                                >
                                  Yopiq
                                </Box>
                              )}
                            </Box>
                          </div>
                          <button type='button' className={classes.changeRegisterBtn} onClick={() => setShowRegisterList(true)}>
                            O&apos;zgartirish
                          </button>
                        </div>
                      ) : (
                        <button type='button' className={classes.touchSelectTrigger} onClick={() => setShowRegisterList(true)}>
                          <span>Kassirni tanlang</span>
                          <ChevronRight size={20} />
                        </button>
                      )}
                    </Box>
                  )}
                </Box>
                {selectedRegister && !selectedRegister.is_open && (
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
                )}
              </Box>

              {/* Bottom part: Naqd / Karta wrapper cards pinned to bottom */}
              <Box display='flex' gap='16px' sx={{ mt: 'auto', pt: '16px' }}>
                <Box className={classes.card_box} flex={1}>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box className={classes.iconBox}>
                      <Banknote size={24} strokeWidth={1.5} />
                    </Box>
                    <Typography fontSize={'18px'} fontWeight={'700'} color={'#0f172a'}>
                      Naqd
                    </Typography>
                  </Box>
                  <Box my={'12px'} border={'1px solid'} borderColor={'#f1f5f9'} />
                  <Box display={'flex'} justifyContent={'end'}>
                    <Typography display={'flex'} fontSize={'20px'} fontWeight={'700'} color={'#0f172a'}>
                      {get(registerCashData, 'data.data.closed_amount', null) || 0}
                      <Typography mx={'4px'} fontSize={'20px'} fontWeight={'700'} color={'#64748b'}>
                        UZS
                      </Typography>
                    </Typography>
                  </Box>
                </Box>

                <Box className={classes.card_box} flex={1}>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box className={classes.iconBox}>
                      <CreditCard size={24} strokeWidth={1.5} />
                    </Box>
                    <Typography fontSize={'18px'} fontWeight={'700'} color={'#0f172a'}>
                      Karta
                    </Typography>
                  </Box>
                  <Box my={'12px'} border={'1px solid'} borderColor={'#f1f5f9'} />
                  <Box display={'flex'} justifyContent={'end'}>
                    <Typography display={'flex'} fontSize={'20px'} fontWeight={'700'} color={'#0f172a'}>
                      0
                      <Typography mx={'4px'} fontSize={'20px'} fontWeight={'700'} color={'#64748b'}>
                        UZS
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </Box>
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
                        type='button'
                        className={btnClass}
                        onClick={() => handleKeypadPress(key === 'C' ? 'clear' : key === '⌫' ? 'backspace' : key)}
                      >
                        {key}
                      </button>
                    )
                  })}
                </div>
                <button type='button' className={classes.enterBtn} disabled={isSubmitDisabled} onClick={() => handleKeypadPress('enter')}>
                  {buttonText}
                </button>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={!isEposTurnOn?.is_open} disableEscapeKeyDown onClose={() => {}} className={classes.eposDialogRoot} disableScrollLock>
        <Box className={classes.eposIconContainer}>
          <AlertCircle size={36} strokeWidth={2} />
        </Box>
        <Typography className={classes.eposTitle}>{isEposTurnOn.message?.includes('филиале') ? 'Неверный филиал' : 'EPOS не запущен'}</Typography>
        <Typography className={classes.eposDescription}>
          {isEposTurnOn.message?.includes('филиале') ? isEposTurnOn.message : 'Для продолжения работы запустите программу EPOS на этом компьютере.'}
        </Typography>
        <Box className={classes.eposStatusRow}>
          <span className={classes.eposStatusDot} />
          <Typography className={classes.eposStatusText}>
            {isEposTurnOn.message?.includes('филиале') ? 'Статус: ошибка терминала' : 'Статус: отключено'}
          </Typography>
        </Box>
      </Dialog>
    </FormProvider>
  )
}

export default NewCashRegister
