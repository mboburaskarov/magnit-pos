import { Box, Typography, CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
import { error as toastError } from '@utils/toast'
import { Store, Search, ArrowLeft, ArrowRight, Check, Eye, EyeOff, Delete, CornerDownLeft, RefreshCw, AlertTriangle } from 'lucide-react'
import { get } from 'lodash'
import { requests } from '../../../utils/requests'
import { request, eposRequest } from '../../../utils/axios'
import { fetchMachineId } from '../../../utils/deviceAgent'
import { isDevEnvironment } from '../../../utils/isDevEnvironment'
import thousandDivider from '../../../utils/thousandDivider'
import { setUserData } from '../../redux-toolkit/userSlice'
import LoadingContainer from '/components/LoadingContainer'

// Brand accent for the login experience. The design exposes this as a brand
// choice; we use the app's primary black to stay consistent with the rest of
// Magnit POS.
const ACCENT = '#111217'
const ACCENT_HOVER = '#2A2D38'
const MAX_PASSWORD = 32

const WEEKDAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

const useStyles = makeStyles((theme) => {
  const font = theme.fontFamily.Gilroy
  return {
    '@keyframes shake': {
      '0%, 100%': { transform: 'translateX(0)' },
      '20%': { transform: 'translateX(-9px)' },
      '40%': { transform: 'translateX(9px)' },
      '60%': { transform: 'translateX(-6px)' },
      '80%': { transform: 'translateX(6px)' },
    },
    screen: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      overflow: 'hidden',
      background: '#F7F9FC',
      color: '#111217',
      fontFamily: font,
    },

    // ---------- brand rail ----------
    rail: {
      width: '37%',
      minWidth: 400,
      maxWidth: 520,
      background: ACCENT,
      color: '#fff',
      padding: '52px 48px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    },
    railCircleLg: {
      position: 'absolute',
      width: 560,
      height: 560,
      border: '1.5px solid rgba(255,255,255,0.13)',
      borderRadius: '50%',
      right: -220,
      bottom: -200,
    },
    railCircleSm: {
      position: 'absolute',
      width: 340,
      height: 340,
      border: '1.5px solid rgba(255,255,255,0.10)',
      borderRadius: '50%',
      right: -110,
      bottom: -90,
    },
    railLogoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      position: 'relative',
      alignSelf: 'flex-start',
    },
    railLogo: {
      height: 32,
      width: 'auto',
      filter: 'brightness(0) invert(1)',
    },
    devBadge: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: '#fff',
      background: '#E23A32',
      padding: '3px 8px',
      borderRadius: 6,
      lineHeight: 1.4,
    },
    railCenter: { position: 'relative' },
    railDate: {
      fontSize: 15,
      fontWeight: 500,
      letterSpacing: '0.02em',
      opacity: 0.72,
      marginBottom: 10,
      color: '#fff',
    },
    railClock: {
      fontSize: 78,
      fontWeight: 700,
      lineHeight: '0.95',
      letterSpacing: '-0.02em',
      marginBottom: 28,
      fontVariantNumeric: 'tabular-nums',
      color: '#fff',
    },
    railCashboxName: {
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.15,
      marginBottom: 14,
      color: '#fff',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    railChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 11,
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(2px)',
      padding: '13px 18px',
      borderRadius: 14,
      maxWidth: '100%',
    },
    railChipText: {
      fontSize: 15.5,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    railHint: {
      position: 'relative',
      fontSize: 13.5,
      fontWeight: 500,
      opacity: 0.62,
      lineHeight: 1.5,
      whiteSpace: 'pre-line',
      color: '#fff',
    },

    // ---------- content shell ----------
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflow: 'hidden',
    },
    contentCenter: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
      position: 'relative',
      minWidth: 0,
    },

    // ---------- select ----------
    selectContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '44px 52px 0',
      overflow: 'hidden',
      minWidth: 0,
    },
    selectHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 24,
      marginBottom: 26,
      flexShrink: 0,
      flexWrap: 'wrap',
    },
    selectTitleRow: { display: 'flex', alignItems: 'center', gap: 12 },
    selectTitle: {
      fontSize: 31,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#111217',
      fontFamily: font,
    },
    countBadge: {
      fontSize: 15,
      fontWeight: 600,
      color: ACCENT,
      background: 'rgba(17,18,23,0.06)',
      padding: '5px 12px',
      borderRadius: 999,
    },
    selectSubtitle: {
      fontSize: 15,
      fontWeight: 500,
      color: '#6F6F6F',
      marginTop: 6,
    },
    searchWrap: { position: 'relative', width: 320, flexShrink: 0 },
    searchIcon: {
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: '#A4A5AB',
    },
    searchInput: {
      width: '100%',
      height: 52,
      padding: '0 16px 0 46px',
      border: '1.5px solid #E5E7EB',
      borderRadius: 13,
      background: '#fff',
      fontFamily: font,
      fontSize: 16,
      fontWeight: 500,
      color: '#111217',
      outline: 'none',
      transition: 'border-color .15s ease, box-shadow .15s ease',
      '&::placeholder': { color: '#A4A5AB', fontWeight: 500 },
      '&:focus': {
        borderColor: ACCENT,
        boxShadow: '0 0 0 4px rgba(17,18,23,0.10)',
      },
    },
    gridScroll: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '4px 8px 32px 0',
      minHeight: 0,
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 14,
      alignContent: 'start',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 11,
      padding: '22px 14px',
      borderRadius: 16,
      border: '1.5px solid #E5E7EB',
      background: '#fff',
      cursor: 'pointer',
      textAlign: 'center',
      position: 'relative',
      fontFamily: font,
      outline: 'none',
      transition: 'transform .14s ease, box-shadow .14s ease, border-color .14s ease, background .14s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 28px rgba(17,18,23,0.10)',
        borderColor: ACCENT,
      },
    },
    cardSelected: {
      borderColor: ACCENT,
      background: '#F4F5F7',
      boxShadow: '0 10px 26px rgba(17,18,23,0.12)',
    },
    cardBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: ACCENT,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardDisabled: {
      cursor: 'not-allowed',
      opacity: 0.55,
      '&:hover': {
        transform: 'none',
        boxShadow: 'none',
        borderColor: '#E5E7EB',
      },
    },
    cardName: {
      fontSize: 15,
      fontWeight: 600,
      color: '#111217',
      lineHeight: 1.3,
    },
    cardPosition: { fontSize: 12.5, fontWeight: 500, color: '#6F6F6F' },
    cardBusyNote: {
      fontSize: 12,
      fontWeight: 600,
      color: '#E23A32',
      lineHeight: 1.35,
    },
    cardActiveNote: {
      fontSize: 12,
      fontWeight: 600,
      color: '#1E9E52',
      lineHeight: 1.35,
    },
    emptyState: {
      padding: '64px 16px',
      textAlign: 'center',
      color: '#A4A5AB',
      fontSize: 16,
      fontWeight: 500,
    },

    // avatar (shared)
    avatar: {
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      background: 'rgba(17,18,23,0.06)',
      color: '#111217',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
    },
    avatarSel: { background: ACCENT, color: '#fff' },
    avatarImg: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },

    // selected sticky bar
    selectedBar: {
      flexShrink: 0,
      position: 'relative',
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
      padding: '18px 24px',
      margin: '0 0 24px',
      background: '#fff',
      border: '1.5px solid #E5E7EB',
      borderRadius: 16,
      boxShadow: '0 8px 30px rgba(17,18,23,0.08)',
    },
    selectedBarInfo: { display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 },
    selectedBarName: {
      fontSize: 16,
      fontWeight: 600,
      color: '#111217',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    continueBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      height: 56,
      padding: '0 30px',
      border: 'none',
      borderRadius: 13,
      background: ACCENT,
      color: '#fff',
      fontFamily: font,
      fontSize: 18,
      fontWeight: 600,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      transition: 'background .15s ease',
      '&:hover': { background: ACCENT_HOVER },
    },

    // ---------- error ----------
    errorInner: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      maxWidth: 480,
    },
    errorIcon: {
      width: 88,
      height: 88,
      borderRadius: '50%',
      background: '#FDECEC',
      color: '#E23A32',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 26,
    },
    errorTitle: {
      fontSize: 27,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#111217',
      margin: '0 0 14px',
      fontFamily: font,
    },
    errorText: {
      fontSize: 16,
      fontWeight: 500,
      color: '#6F6F6F',
      lineHeight: 1.55,
      margin: '0 0 24px',
    },
    deviceChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: '#F5F5F5',
      padding: '11px 18px',
      borderRadius: 12,
      marginBottom: 34,
    },
    deviceChipLabel: {
      fontSize: 13,
      fontWeight: 600,
      color: '#A4A5AB',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    },
    deviceChipValue: {
      fontFamily: "'SFMono-Regular', ui-monospace, Menlo, monospace",
      fontSize: 15,
      fontWeight: 600,
      color: '#111217',
    },
    retryBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 11,
      height: 56,
      padding: '0 32px',
      border: 'none',
      borderRadius: 13,
      background: ACCENT,
      color: '#fff',
      fontFamily: font,
      fontSize: 18,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background .15s ease',
      '&:hover': { background: ACCENT_HOVER },
    },

    // ---------- password / PIN entry ----------
    backLink: {
      position: 'absolute',
      top: 36,
      left: 44,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'none',
      border: 'none',
      padding: 0,
      color: '#6F6F6F',
      fontFamily: font,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'color .15s ease',
      '&:hover': { color: '#111217' },
    },
    identity: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 28,
    },
    identityName: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#111217',
      marginTop: 16,
      fontFamily: font,
    },
    identityPos: { fontSize: 15, fontWeight: 500, color: '#6F6F6F', marginTop: 4 },
    pwEntry: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    promptLabel: {
      fontSize: 15,
      fontWeight: 600,
      color: '#6F6F6F',
      marginBottom: 16,
    },
    fieldWrap: { position: 'relative', width: 320, marginBottom: 12 },
    fieldWrapShake: { animation: '$shake .4s ease' },
    field: {
      height: 64,
      borderRadius: 14,
      background: '#fff',
      border: '2px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      padding: '0 56px 0 20px',
      fontSize: 24,
      fontWeight: 700,
      color: '#111217',
      overflow: 'hidden',
    },
    fieldError: { borderColor: '#E23A32' },
    fieldValue: {
      letterSpacing: '0.16em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    fieldPlaceholder: { color: '#A4A5AB', fontWeight: 500, fontSize: 18 },
    revealBtn: {
      position: 'absolute',
      right: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 44,
      height: 44,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6F6F6F',
    },
    errorLine: {
      height: 22,
      margin: '6px 0 10px',
      fontSize: 14,
      fontWeight: 600,
      color: '#E23A32',
    },
    keypadGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 96px)',
      gap: 14,
    },
    keypadBtn: {
      width: 96,
      height: 80,
      borderRadius: 16,
      border: 'none',
      background: '#EEF0F4',
      color: '#111217',
      fontSize: 28,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontFamily: font,
      userSelect: 'none',
      transition: 'transform .08s ease, filter .08s ease',
      '&:active': { transform: 'scale(0.95)', filter: 'brightness(0.94)' },
      '&:disabled': { cursor: 'default', opacity: 0.7 },
    },
    keypadBtnBack: { background: '#E1E5EC', color: '#6F6F6F' },
    keypadBtnEnter: { background: ACCENT, color: '#fff' },

    // ---------- switch-cashbox confirmation ----------
    confirmOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(17,18,23,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 30,
    },
    confirmPanel: {
      width: 480,
      maxWidth: 'calc(100vw - 48px)',
      background: '#fff',
      borderRadius: 20,
      padding: '34px 34px 28px',
      textAlign: 'center',
      boxShadow: '0 24px 60px rgba(17,18,23,0.28)',
    },
    confirmTitle: {
      fontSize: 23,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#111217',
      marginBottom: 12,
      fontFamily: font,
    },
    confirmText: {
      fontSize: 15.5,
      fontWeight: 500,
      color: '#6F6F6F',
      lineHeight: 1.55,
      marginBottom: 28,
    },
    confirmActions: { display: 'flex', gap: 12 },
    confirmBtn: {
      flex: 1,
      height: 56,
      border: 'none',
      borderRadius: 13,
      fontFamily: font,
      fontSize: 17,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background .15s ease',
    },
    confirmBtnCancel: {
      background: '#EEF0F4',
      color: '#111217',
      '&:hover': { background: '#E1E5EC' },
    },
    confirmBtnGo: {
      background: ACCENT,
      color: '#fff',
      '&:hover': { background: ACCENT_HOVER },
    },

    // success
    successWrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18,
    },
    successIcon: {
      width: 88,
      height: 88,
      borderRadius: '50%',
      background: '#E9F8EF',
      color: '#1E9E52',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    successTitle: { fontSize: 22, fontWeight: 700, color: '#111217', fontFamily: font },
    successSub: { fontSize: 15, fontWeight: 500, color: '#6F6F6F' },
  }
})

const PHASE = {
  LOADING: 'loading',
  ERROR: 'error',
  SELECT: 'select',
  PASSWORD: 'password',
  AMOUNT: 'amount',
}

function displayName(cashier) {
  const full = (cashier?.full_name || '').trim()
  if (full) return full
  const composed = `${cashier?.first_name || ''} ${cashier?.last_name || ''}`.trim()
  return composed || '—'
}

function initials(cashier) {
  const first = (cashier?.first_name || '').trim()
  const last = (cashier?.last_name || '').trim()
  if (first || last) return ((first[0] || '') + (last[0] || '')).toUpperCase()
  const words = displayName(cashier).split(/\s+/).filter(Boolean)
  return (words.slice(0, 2).map((w) => w[0]).join('') || '?').toUpperCase()
}

export default function LoginPage() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [phase, setPhase] = useState(PHASE.LOADING)
  const [store, setStore] = useState(null)
  const [cashbox, setCashbox] = useState(null)
  const [cashiers, setCashiers] = useState([])
  const [selectedCashier, setSelectedCashier] = useState(null)
  const [switchTarget, setSwitchTarget] = useState(null)
  const [blockInfo, setBlockInfo] = useState(null)
  const [machineId, setMachineId] = useState(null)
  const [query, setQuery] = useState('')
  const [now, setNow] = useState(new Date())

  // password entry
  const [password, setPassword] = useState('')
  const [reveal, setReveal] = useState(false)
  const [pwError, setPwError] = useState('')
  const [shakeCount, setShakeCount] = useState(0)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [employeeData, setEmployeeData] = useState(null)
  const passwordRef = useRef('')

  // opening-amount entry (shown only when this device's cashbox has no
  // active session to continue - see resolveCashboxSession)
  const [openAmount, setOpenAmount] = useState('')
  const [openError, setOpenError] = useState('')
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    passwordRef.current = password
  }, [password])

  // live clock in the brand rail
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const loadDeviceInfo = async () => {
    setPhase(PHASE.LOADING)
    setBlockInfo(null)
    setMachineId(null)

    let id
    try {
      id = await fetchMachineId()
    } catch (err) {
      console.error('device agent unreachable:', err)
      setBlockInfo({
        title: 'Устройство недоступно',
        message:
          'Не удалось связаться с агентом устройства. Убедитесь, что Magnit Device Agent запущен на этом компьютере, и повторите попытку.',
      })
      setPhase(PHASE.ERROR)
      return
    }

    setMachineId(id)

    try {
      const { data } = await requests.getDeviceLoginInfo({ identifier: id })
      const info = data?.data || {}
      const box = info.cashbox || null
      const list = Array.isArray(info.cashiers) ? info.cashiers : []
      setStore(info.store || null)
      setCashbox(box)
      setCashiers(list)
      // the cashier holding this cashbox's open session is pre-selected
      const active = box?.active_cashier_id ? list.find((c) => c.id === box.active_cashier_id) : null
      setSelectedCashier(active || null)
      setSwitchTarget(null)
      setQuery('')
      setPhase(PHASE.SELECT)
    } catch (err) {
      const key = err?.response?.data?.data
      if (err?.response?.status === 404 || key === 'device.not.registered') {
        setBlockInfo({
          title: 'Устройство не зарегистрировано',
          message:
            'Эта касса не привязана к магазину. Обратитесь к администратору, чтобы зарегистрировать устройство и получить доступ к смене.',
        })
      } else {
        setBlockInfo({
          title: 'Ошибка',
          message: 'Не удалось получить данные устройства. Повторите попытку.',
        })
      }
      setPhase(PHASE.ERROR)
    }
  }

  useEffect(() => {
    loadDeviceInfo()
  }, [])

  // The device's cashbox is authoritative now - there's no manual kassa
  // picker anymore. If this device already has an active sale, drop the
  // cashier straight into it. Otherwise ask for the opening cash amount
  // right here and open the shift ourselves (PHASE.AMOUNT below).
  const resolveCashboxSession = async (employee) => {
    const storeId = cashbox?.store_id || employee?.store?.id
    const cashBoxId = cashbox?.id

    if (!cashBoxId) {
      window.location.replace('/redirect')
      return
    }

    const device_id = localStorage.getItem('device_id') || crypto.randomUUID()
    localStorage.setItem('device_id', device_id)

    const persistSelectedCashbox = () => {
      localStorage.setItem(
        'selected_cashbox',
        JSON.stringify({
          id: cashbox?.id,
          name: cashbox?.name,
          full_name: cashbox?.full_name,
          store_id: storeId,
          store_name: cashbox?.store_name || employee?.store?.name,
          is_open: true,
        }),
      )
    }

    try {
      const checkRes = await requests.checkSaleExist({ store_id: storeId, cash_box_id: cashBoxId, device_id })
      const saleId = get(checkRes, 'data.data.sale_id')
      if (saleId) {
        persistSelectedCashbox()
        window.location.replace(`/sales/pos/${saleId}`)
        return
      }

      if (get(checkRes, 'data.data.is_open')) {
        const opInfoRes = await requests.getCashBoxOperationInfo(cashBoxId)
        const cashBoxOpId = get(opInfoRes, 'data.data.id')
        if (cashBoxOpId) {
          const newSaleRes = await requests.saleCreate({ cash_box_operation_id: cashBoxOpId, store_id: storeId })
          const newSaleId = get(newSaleRes, 'data.id')
          if (newSaleId) {
            persistSelectedCashbox()
            window.location.replace(`/sales/pos/${newSaleId}`)
            return
          }
        }
      }
    } catch (err) {
      // No active sale/operation for this device (e.g. 404 "no open cashbox
      // operation") - expected whenever the shift needs to be (re)opened.
    }

    setPhase(PHASE.AMOUNT)
  }

  const submitOpenAmount = async () => {
    if (isOpening) return
    setIsOpening(true)
    setOpenError('')

    try {
      const zRes = await requests.openZReport({ token: 'DXJFX32CN1296678504F2', method: 'openZreport' })
      const zData = zRes?.data
      const zOk = get(zData, 'error', true) == false || get(zData, 'message', '').includes('ERROR_ZREPORT_IS_ALREADY_OPEN')
      if (!zOk) {
        const msg = get(zData, 'message', '')
        setOpenError(msg.includes('Ru:') ? msg.split('Ru:')[1] : msg || 'Kassani ochib bo‘lmadi')
        setIsOpening(false)
        return
      }
      localStorage.setItem('leftZreportCount', get(zData, 'leftZreportCount', 999))

      const device_id = localStorage.getItem('device_id') || crypto.randomUUID()
      localStorage.setItem('device_id', device_id)
      const storeId = cashbox?.store_id || employeeData?.store?.id

      const createRes = await requests.createCashOperationBox({
        cash_amount: Number(openAmount || 0),
        cash_box_id: cashbox?.id,
        description: '',
        store_id: storeId,
        employee_id: employeeData?.id,
        device_id,
        is_open: true,
      })
      const saleId = get(createRes, 'data.data.id')
      const respDeviceId = get(createRes, 'data.data.device_id')
      if (respDeviceId) localStorage.setItem('device_id', respDeviceId)
      if (!saleId) throw new Error('Sale not created')

      localStorage.setItem(
        'selected_cashbox',
        JSON.stringify({
          id: cashbox?.id,
          name: cashbox?.name,
          full_name: cashbox?.full_name,
          store_id: storeId,
          store_name: cashbox?.store_name || employeeData?.store?.name,
          is_open: true,
        }),
      )
      window.location.replace(`/sales/pos/${saleId}`)
    } catch (err) {
      setOpenError(err?.response?.data?.message || err?.message || 'Kassani ochib bo‘lmadi')
      setIsOpening(false)
    }
  }

  const pressAmountKey = (digit) => {
    setOpenError('')
    setOpenAmount((a) => (a.length >= 12 ? a : a + digit))
  }

  const backspaceAmount = () => {
    setOpenError('')
    setOpenAmount((a) => a.slice(0, -1))
  }

  // physical keyboard support while entering the opening amount
  useEffect(() => {
    if (phase !== PHASE.AMOUNT) return
    const handler = (e) => {
      if (isOpening) return
      if (e.key === 'Enter') {
        e.preventDefault()
        submitOpenAmount()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        backspaceAmount()
      } else if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        pressAmountKey(e.key)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isOpening, openAmount])

  const { mutate: logIn, isLoading: logInLoading } = useMutation(requests.logIn, {
    onSuccess: ({ data }) => {
      const userData = data.data
      // The machine's store is authoritative for this session: the cashbox
      // operation must open at the store the device belongs to, even if the
      // cashier's primary store differs (they may be listed here via store_ids).
      const employee = { ...userData.employee }
      if (store) {
        employee.store = store
        employee.store_id = store.id
      }
      localStorage.setItem('access_token', userData.token)
      localStorage.setItem('user_data', JSON.stringify(employee))
      // The `request`/`eposRequest` axios instances set their Authorization
      // header once, at module load, from whatever was in localStorage back
      // then (nothing, pre-login). Since we now call these APIs directly
      // from this same page load (no full reload), we must refresh the
      // header in place or every call below 401s with a stale "Bearer null".
      request.defaults.headers.Authorization = `Bearer ${userData.token}`
      eposRequest.defaults.headers.Authorization = `Bearer ${userData.token}`
      dispatch(setUserData(employee))
      setEmployeeData(employee)
      setLoginSuccess(true)
      setTimeout(() => {
        resolveCashboxSession(employee)
      }, 700)
    },
    onError: (err) => {
      const status = err?.response?.status
      const key = err?.response?.data?.data
      const msg =
        key === 'cashier.busy.in.another.cashbox'
          ? 'Смена уже открыта в другой кассе. Закройте её, чтобы войти на этой.'
          : key === 'device.not.registered'
          ? 'Устройство не зарегистрировано. Обратитесь к администратору.'
          : status === 409
          ? 'Неверный пароль'
          : status === 404
          ? 'Кассир не найден'
          : 'Не удалось войти. Повторите попытку.'
      setPwError(msg)
      toastError(msg)
      setPassword('')
      setShakeCount((c) => c + 1)
      console.error('login error:', err)
    },
  })

  // the cashier currently holding this cashbox's open session (if any)
  const activeCashierId = cashbox?.active_cashier_id || ''
  const activeCashier = activeCashierId ? cashiers.find((c) => c.id === activeCashierId) : null

  // name of the other cashbox where this cashier's open session lives, or ''
  const busyCashboxName = (cashier) =>
    cashier?.active_cashbox_id && cashier.active_cashbox_id !== cashbox?.id
      ? cashier.active_cashbox_name || 'другой кассе'
      : ''

  const pickCashier = (cashier) => {
    if (busyCashboxName(cashier)) return
    // picking someone other than the session holder switches the cashbox to
    // them — ask for confirmation first
    if (activeCashierId && cashier.id !== activeCashierId && selectedCashier?.id !== cashier.id) {
      setSwitchTarget(cashier)
      return
    }
    setSelectedCashier(cashier)
  }

  const goToPassword = () => {
    if (!selectedCashier) return
    setPassword('')
    setPwError('')
    setReveal(false)
    setLoginSuccess(false)
    setPhase(PHASE.PASSWORD)
  }

  const backToSelect = () => {
    setPassword('')
    setPwError('')
    setPhase(PHASE.SELECT)
  }

  const pressKey = (digit) => {
    setPwError('')
    setPassword((p) => (p.length >= MAX_PASSWORD ? p : p + digit))
  }

  const backspace = () => {
    setPwError('')
    setPassword((p) => p.slice(0, -1))
  }

  const submitPassword = () => {
    if (logInLoading || loginSuccess || !selectedCashier) return
    const pwd = (passwordRef.current || '').replace(/[()\s-]/g, '')
    if (!pwd) {
      setPwError('Введите пароль')
      toastError('Введите пароль')
      setShakeCount((c) => c + 1)
      return
    }
    // identifier lets the backend hand this cashbox's open session over to the
    // cashier logging in (and reject them if they hold a session elsewhere)
    logIn({ employee_id: selectedCashier.id, password: pwd, identifier: machineId })
  }

  // physical keyboard support while entering the password
  useEffect(() => {
    if (phase !== PHASE.PASSWORD) return
    const handler = (e) => {
      if (loginSuccess || logInLoading) return
      if (e.key === 'Enter') {
        e.preventDefault()
        submitPassword()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        backspace()
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        pressKey(e.key)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, loginSuccess, logInLoading, selectedCashier])

  const renderAvatar = (cashier, { size, fontSize, selected }) => (
    <Box
      className={`${classes.avatar} ${selected ? classes.avatarSel : ''}`}
      style={{ width: size, height: size, minWidth: size, fontSize }}
    >
      {cashier?.photo && (
        <img
          src={cashier.photo}
          alt=""
          className={classes.avatarImg}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      <span>{initials(cashier)}</span>
    </Box>
  )

  const renderRail = (variant) => {
    const pad = (n) => String(n).padStart(2, '0')
    const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    const weekday = WEEKDAYS[now.getDay()]
    const dateLabel = `${now.getDate()} ${MONTHS[now.getMonth()]}`
    const hint =
      variant === 'error'
        ? 'Это устройство ещё не привязано к магазину.\nВход невозможен, пока касса не настроена.'
        : variant === 'password'
        ? 'Введите пароль, чтобы открыть смену.\nНе сообщайте свой пароль другим сотрудникам.'
        : 'Рабочая смена начинается с входа кассира.\nВыберите себя из списка, чтобы продолжить.'

    return (
      <Box className={classes.rail}>
        <Box aria-hidden="true" className={classes.railCircleLg} />
        <Box aria-hidden="true" className={classes.railCircleSm} />
        <Box className={classes.railLogoRow}>
          <img src="/MagnitPOS.svg" alt="Magnit POS" className={classes.railLogo} />
          {isDevEnvironment() && <span className={classes.devBadge}>DEV</span>}
        </Box>

        <Box className={classes.railCenter}>
          <Typography className={classes.railDate}>
            {weekday}, {dateLabel}
          </Typography>
          <Typography className={classes.railClock}>{clock}</Typography>
          {variant !== 'error' && cashbox?.name && (
            <Typography className={classes.railCashboxName}>{cashbox.name}</Typography>
          )}
          {variant === 'error' ? (
            <Box className={classes.railChip}>
              <Store size={20} />
              <span className={classes.railChipText} style={{ opacity: 0.85 }}>
                Магазин не определён
              </span>
            </Box>
          ) : store?.name ? (
            <Box className={classes.railChip}>
              <Store size={20} />
              <span className={classes.railChipText}>{store.name}</span>
            </Box>
          ) : null}
        </Box>

        <Typography className={classes.railHint}>{hint}</Typography>
      </Box>
    )
  }

  // ---- Loading ----
  if (phase === PHASE.LOADING) {
    return <LoadingContainer fullHeight readyState={false} />
  }

  // ---- Blocked / error ----
  if (phase === PHASE.ERROR) {
    return (
      <Box className={classes.screen}>
        {renderRail('error')}
        <Box className={classes.contentCenter}>
          <Box className={classes.errorInner}>
            <Box className={classes.errorIcon}>
              <AlertTriangle size={42} />
            </Box>
            <Typography className={classes.errorTitle}>{blockInfo?.title}</Typography>
            <Typography className={classes.errorText}>{blockInfo?.message}</Typography>
            {machineId && (
              <Box className={classes.deviceChip}>
                <span className={classes.deviceChipLabel}>ID устройства</span>
                <span className={classes.deviceChipValue}>{machineId}</span>
              </Box>
            )}
            <button type="button" className={classes.retryBtn} onClick={loadDeviceInfo}>
              <RefreshCw size={20} />
              Повторить
            </button>
          </Box>
        </Box>
      </Box>
    )
  }

  // ---- Cashier selection ----
  if (phase === PHASE.SELECT) {
    const q = query.trim().toLowerCase()
    const filtered = !q ? cashiers : cashiers.filter((c) => displayName(c).toLowerCase().includes(q))

    return (
      <Box className={classes.screen}>
        {renderRail('select')}
        <Box className={classes.selectContent}>
          <Box className={classes.selectHeader}>
            <Box>
              <Box className={classes.selectTitleRow}>
                <Typography className={classes.selectTitle}>Выберите кассира</Typography>
                <span className={classes.countBadge}>{cashiers.length}</span>
              </Box>
              <Typography className={classes.selectSubtitle}>Нажмите на своё имя, затем введите пароль</Typography>
            </Box>
            <Box className={classes.searchWrap}>
              <Search size={20} className={classes.searchIcon} />
              <input
                type="text"
                placeholder="Поиск по имени"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedCashier(null)
                }}
                className={classes.searchInput}
              />
            </Box>
          </Box>

          <Box className={classes.gridScroll}>
            {filtered.length === 0 ? (
              <Box className={classes.emptyState}>
                {q
                  ? `По запросу «${query}» кассиров не найдено`
                  : 'Для этого магазина не найдено кассиров. Обратитесь к администратору.'}
              </Box>
            ) : (
              <Box className={classes.grid}>
                {filtered.map((cashier) => {
                  const selected = selectedCashier?.id === cashier.id
                  const busyIn = busyCashboxName(cashier)
                  return (
                    <Box
                      key={cashier.id}
                      component="button"
                      type="button"
                      disabled={Boolean(busyIn)}
                      title={busyIn ? `Смена открыта в кассе «${busyIn}». Закройте её, чтобы войти здесь.` : undefined}
                      className={`${classes.card} ${selected ? classes.cardSelected : ''} ${busyIn ? classes.cardDisabled : ''}`}
                      onClick={() => pickCashier(cashier)}
                    >
                      {selected && (
                        <span className={classes.cardBadge}>
                          <Check size={15} strokeWidth={3} />
                        </span>
                      )}
                      {renderAvatar(cashier, { size: 52, fontSize: 18, selected })}
                      <span className={classes.cardName}>{displayName(cashier)}</span>
                      {cashier.position && <span className={classes.cardPosition}>{cashier.position}</span>}
                      {busyIn ? (
                        <span className={classes.cardBusyNote}>Закройте смену в кассе «{busyIn}»</span>
                      ) : cashier.id === activeCashierId ? (
                        <span className={classes.cardActiveNote}>Смена на этой кассе</span>
                      ) : null}
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>

          {selectedCashier && (
            <Box className={classes.selectedBar}>
              <Box className={classes.selectedBarInfo}>
                {renderAvatar(selectedCashier, { size: 52, fontSize: 18, selected: true })}
                <Box sx={{ minWidth: 0 }}>
                  <div className={classes.selectedBarName}>{displayName(selectedCashier)}</div>
                  <div className={classes.cardPosition}>{selectedCashier.position || store?.name}</div>
                </Box>
              </Box>
              <button type="button" className={classes.continueBtn} onClick={goToPassword}>
                Продолжить
                <ArrowRight size={20} strokeWidth={2.2} />
              </button>
            </Box>
          )}
        </Box>

        {switchTarget && (
          <Box className={classes.confirmOverlay}>
            <Box className={classes.confirmPanel}>
              <Typography className={classes.confirmTitle}>Переключить кассу?</Typography>
              <Typography className={classes.confirmText}>
                Касса{cashbox?.name ? ` «${cashbox.name}»` : ''} сейчас закреплена за{' '}
                {activeCashier ? `кассиром ${displayName(activeCashier)}` : 'другим кассиром'}. После входа смена
                будет переключена на {displayName(switchTarget)}.
              </Typography>
              <Box className={classes.confirmActions}>
                <button
                  type="button"
                  className={`${classes.confirmBtn} ${classes.confirmBtnCancel}`}
                  onClick={() => setSwitchTarget(null)}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className={`${classes.confirmBtn} ${classes.confirmBtnGo}`}
                  onClick={() => {
                    setSelectedCashier(switchTarget)
                    setSwitchTarget(null)
                  }}
                >
                  Продолжить
                </button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    )
  }

  // ---- Opening amount (shown only when this device's cashbox has no active
  // session to continue - see resolveCashboxSession) ----
  if (phase === PHASE.AMOUNT) {
    return (
      <Box className={classes.screen}>
        {renderRail('password')}
        <Box className={classes.contentCenter}>
          <Box className={classes.identity}>
            {renderAvatar(selectedCashier, { size: 74, fontSize: 26, selected: false })}
            <Typography className={classes.identityName}>{displayName(selectedCashier)}</Typography>
            <Typography className={classes.identityPos}>{selectedCashier?.position || store?.name}</Typography>
          </Box>

          <Box className={classes.pwEntry}>
            <Typography className={classes.promptLabel}>
              {openError ? 'Iltimos, qaytadan urinib ko‘ring' : 'Kassa ochilish miqdorini kiriting (UZS)'}
            </Typography>

            <Box className={classes.fieldWrap}>
              <Box className={`${classes.field} ${openError ? classes.fieldError : ''}`}>
                {openAmount.length > 0 ? (
                  <span className={classes.fieldValue}>{thousandDivider(openAmount)}</span>
                ) : (
                  <span className={classes.fieldPlaceholder}>Miqdorni kiriting</span>
                )}
              </Box>
            </Box>

            <Box className={classes.errorLine}>{openError}</Box>

            <Box className={classes.keypadGrid}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  className={classes.keypadBtn}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pressAmountKey(digit)}
                  disabled={isOpening}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                className={`${classes.keypadBtn} ${classes.keypadBtnBack}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={backspaceAmount}
                aria-label="Удалить"
                disabled={isOpening}
              >
                <Delete size={26} />
              </button>
              <button
                type="button"
                className={classes.keypadBtn}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pressAmountKey('0')}
                disabled={isOpening}
              >
                0
              </button>
              <button
                type="button"
                className={`${classes.keypadBtn} ${classes.keypadBtnEnter}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={submitOpenAmount}
                aria-label="Открыть смену"
                disabled={isOpening}
              >
                {isOpening ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : <CornerDownLeft size={26} strokeWidth={2.2} />}
              </button>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  // ---- Password entry ----
  return (
    <Box className={classes.screen}>
      {renderRail('password')}
      <Box className={classes.contentCenter}>
        <button type="button" className={classes.backLink} onClick={backToSelect}>
          <ArrowLeft size={20} strokeWidth={2.2} />
          Назад к списку
        </button>

        <Box className={classes.identity}>
          {renderAvatar(selectedCashier, { size: 74, fontSize: 26, selected: false })}
          <Typography className={classes.identityName}>{displayName(selectedCashier)}</Typography>
          <Typography className={classes.identityPos}>{selectedCashier?.position || store?.name}</Typography>
        </Box>

        {loginSuccess ? (
          <Box className={classes.successWrap}>
            <span className={classes.successIcon}>
              <Check size={44} strokeWidth={2.4} />
            </span>
            <Typography className={classes.successTitle}>Вход выполнен</Typography>
            <Typography className={classes.successSub}>Открываем смену…</Typography>
          </Box>
        ) : (
          <Box className={classes.pwEntry}>
            <Typography className={classes.promptLabel}>
              {pwError ? 'Попробуйте ввести пароль ещё раз' : 'Введите пароль от учётной записи'}
            </Typography>

            <Box key={shakeCount} className={`${classes.fieldWrap} ${pwError ? classes.fieldWrapShake : ''}`}>
              <Box className={`${classes.field} ${pwError ? classes.fieldError : ''}`}>
                {password.length > 0 ? (
                  <span className={classes.fieldValue}>{reveal ? password : '•'.repeat(password.length)}</span>
                ) : (
                  <span className={classes.fieldPlaceholder}>Введите пароль</span>
                )}
              </Box>
              <button
                type="button"
                className={classes.revealBtn}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setReveal((r) => !r)}
                aria-label={reveal ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {reveal ? <Eye size={22} /> : <EyeOff size={22} />}
              </button>
            </Box>

            <Box className={classes.keypadGrid}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  className={classes.keypadBtn}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pressKey(digit)}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                className={`${classes.keypadBtn} ${classes.keypadBtnBack}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={backspace}
                aria-label="Удалить"
              >
                <Delete size={26} />
              </button>
              <button
                type="button"
                className={classes.keypadBtn}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pressKey('0')}
              >
                0
              </button>
              <button
                type="button"
                className={`${classes.keypadBtn} ${classes.keypadBtnEnter}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={submitPassword}
                aria-label="Войти"
                disabled={logInLoading}
              >
                {logInLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : <CornerDownLeft size={26} strokeWidth={2.2} />}
              </button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
