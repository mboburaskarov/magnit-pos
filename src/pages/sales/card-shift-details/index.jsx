import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import axios from 'axios'
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Check, Delete, Pencil, User } from 'lucide-react'
import { useQueryParams } from '@hooks/useQueryParams'
import LoadingContainer from '@components/LoadingContainer'
import thousandDivider from '@utils/thousandDivider'
import { error, success } from '@utils/toast'
import { requests } from '@utils/requests'
import { loadSvgAsEscposHex } from '@utils/escposImage'
import { buildZReportReceiptLayout } from '@utils/receiptBuilder'

// Brand accent, consistent with the redesigned login screen: the design
// exposes this as a brand choice and we use the app's primary black.
const ACCENT = '#111217'
const DANGER = '#E23A32'
const GLYPH_BG = '#F1F3F7'
const MAX_DIGITS = 12

// Solid, filled glyphs from the design; the grey wrap shows through the cut-outs.
const CashGlyph = () => (
  <svg width='22' height='22' viewBox='0 0 24 24'>
    <rect x='1' y='6' width='22' height='12' rx='2.5' fill={ACCENT} />
    <rect x='3.2' y='9.7' width='3' height='4.6' rx='1' fill={GLYPH_BG} />
    <rect x='17.8' y='9.7' width='3' height='4.6' rx='1' fill={GLYPH_BG} />
    <circle cx='12' cy='12' r='2.7' fill={GLYPH_BG} />
  </svg>
)

const CardGlyph = () => (
  <svg width='22' height='22' viewBox='0 0 24 24'>
    <rect x='1' y='5' width='22' height='14' rx='3' fill={ACCENT} />
    <rect x='1' y='9.5' width='22' height='3' fill={GLYPH_BG} />
    <rect x='4' y='15' width='6' height='2' rx='1' fill={GLYPH_BG} />
  </svg>
)

const TransferGlyph = () => (
  <svg width='22' height='22' viewBox='0 0 24 24'>
    <path d='M12 1 L20 11 H15 V21 H9 V11 H4 Z' fill={ACCENT} />
  </svg>
)

const SplitGlyph = () => (
  <svg width='22' height='22' viewBox='0 0 24 24'>
    <rect x='1' y='4' width='9.5' height='16' rx='2.5' fill={ACCENT} />
    <rect x='13.5' y='4' width='9.5' height='16' rx='2.5' fill={GLYPH_BG} stroke={ACCENT} strokeWidth='1.4' />
    <line x1='12' y1='4' x2='12' y2='20' stroke={ACCENT} strokeWidth='1.4' strokeDasharray='2.4 2.4' />
  </svg>
)

const useStyles = makeStyles((theme) => {
  const font = theme.fontFamily.Gilroy
  return {
    screen: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: font,
      color: ACCENT,
      background: '#F7F9FC',
    },

    // ---------- header ----------
    header: {
      height: 54,
      flexShrink: 0,
      background: ACCENT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      color: '#fff',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
    backBtn: {
      width: 32,
      height: 32,
      borderRadius: 9,
      border: '1px solid rgba(255,255,255,0.10)',
      background: 'rgba(255,255,255,0.06)',
      color: '#E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background .15s ease, color .15s ease',
      '&:hover': { background: 'rgba(255,255,255,0.14)', color: '#fff' },
    },
    headerTitle: { fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: font },
    headerChip: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(255,255,255,0.05)',
      padding: '6px 12px',
      borderRadius: 9,
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: 12,
      color: '#E5E7EB',
    },
    headerChipDivider: { width: 1, height: 14, background: 'rgba(255,255,255,0.15)' },
    headerClock: {
      fontVariantNumeric: 'tabular-nums',
      fontFamily: 'ui-monospace, Menlo, monospace',
    },

    // ---------- entering layout ----------
    body: {
      flex: 1,
      display: 'flex',
      gap: 10,
      padding: 10,
      overflow: 'hidden',
      minHeight: 0,
    },
    colScroll: {
      overflowY: 'auto',
      '&::-webkit-scrollbar': { width: 9 },
      '&::-webkit-scrollbar-thumb': {
        background: '#D5D7E2',
        borderRadius: 8,
        border: '2px solid transparent',
        backgroundClip: 'content-box',
      },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
    },
    leftCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
    rightCol: { flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 },
    sectionLabel: {
      fontSize: 12,
      fontWeight: 700,
      color: ACCENT,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      paddingLeft: 2,
      fontFamily: font,
    },

    // ---------- cash-destination options ----------
    optionsRow: { display: 'flex', gap: 6, flexShrink: 0 },
    optionCard: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 8,
      padding: 11,
      borderRadius: 11,
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: font,
      background: '#fff',
      border: '2px solid #E9EBF0',
      minWidth: 0,
    },
    optionCardSelected: { borderColor: ACCENT },
    optionTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    optionGlyphWrap: {
      width: 30,
      height: 30,
      borderRadius: 9,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: GLYPH_BG,
      overflow: 'hidden',
    },
    optionCheck: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: ACCENT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: '#fff',
    },
    optionUncheck: { width: 22, height: 22, borderRadius: '50%', border: '2px solid #D5D7E2', flexShrink: 0 },
    optionTitle: { fontSize: 12.5, fontWeight: 700, color: ACCENT, lineHeight: 1.3, fontFamily: font },
    optionFooter: {
      width: '100%',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 5,
      borderTop: '1px dashed #E5E7EB',
      paddingTop: 6,
    },
    optionAmountLabel: {
      fontSize: 10,
      fontWeight: 700,
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    optionAmount: { fontSize: 13, fontWeight: 800, color: ACCENT, whiteSpace: 'nowrap' },
    unitSm: { fontSize: 9, color: '#9CA3AF', fontWeight: 700 },

    // ---------- amount cards / fields ----------
    moneyCard: {
      cursor: 'pointer',
      background: '#fff',
      border: '1.5px solid #E9EBF0',
      borderRadius: 12,
      padding: 11,
      boxShadow: '0 4px 16px rgba(17,18,23,0.04)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 9,
    },
    moneyCardActive: { borderColor: ACCENT },
    glyphWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: GLYPH_BG,
      flexShrink: 0,
      color: ACCENT,
    },
    moneyInfo: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 },
    moneyLabel: { fontSize: 14.5, fontWeight: 700, lineHeight: 1.2, color: ACCENT, fontFamily: font },
    moneyExpected: { fontSize: 12, fontWeight: 700, color: '#6F6F6F', lineHeight: 1.2, fontFamily: font },
    moneyRight: { width: 190, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 },
    field: {
      height: 44,
      borderRadius: 10,
      background: '#F7F9FC',
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 10px',
      gap: 5,
      cursor: 'pointer',
    },
    fieldActive: {
      background: '#F1F2F5',
      borderColor: ACCENT,
      boxShadow: '0 0 0 3px rgba(17,18,23,0.08)',
    },
    fieldText: {
      fontSize: 16,
      fontWeight: 800,
      fontVariantNumeric: 'tabular-nums',
      color: ACCENT,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    fieldTextEmpty: { color: '#B6BAC4' },
    fieldSuffix: { fontSize: 12, fontWeight: 700, color: '#9CA3AF' },
    diffRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 5,
      fontSize: 11.5,
      fontWeight: 700,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
    },
    remainderInfo: { flex: 1, minWidth: 0 },
    remainderTitle: { fontSize: 13.5, fontWeight: 700, color: ACCENT, fontFamily: font },
    remainderSub: { fontSize: 10.5, color: '#9CA3AF', marginTop: 1, fontFamily: font },

    // ---------- right column cards ----------
    panelCard: {
      background: '#fff',
      border: '1px solid #E9EBF0',
      borderRadius: 13,
      padding: '11px 13px',
      boxShadow: '0 4px 16px rgba(17,18,23,0.04)',
      flexShrink: 0,
    },
    panelHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    panelTitle: { fontSize: 13, fontWeight: 700, color: ACCENT, fontFamily: font },
    panelNote: { fontSize: 10, color: '#9CA3AF', fontWeight: 600, fontFamily: font },
    cashlessRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      padding: '7px 2px',
      borderTop: '1px solid #F1F3F7',
    },
    cashlessName: { display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 },
    cashlessDot: { width: 8, height: 8, borderRadius: '50%', background: ACCENT, flexShrink: 0 },
    cashlessLabel: { fontSize: 12.5, fontWeight: 600, color: '#374151' },
    cashlessAmount: { fontSize: 13, fontWeight: 800, color: ACCENT, whiteSpace: 'nowrap' },
    unitXs: { fontSize: 10, color: '#9CA3AF', fontWeight: 700 },

    // ---------- numpad ----------
    numpadCard: {
      background: '#fff',
      border: '1px solid #E9EBF0',
      borderRadius: 13,
      padding: 12,
      boxShadow: '0 4px 16px rgba(17,18,23,0.04)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    numpadLabel: {
      fontSize: 11,
      fontWeight: 700,
      color: ACCENT,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      margin: '2px 0 9px',
      alignSelf: 'flex-start',
      fontFamily: font,
    },
    keypadGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 78px)', gap: 10 },
    keypadBtn: {
      width: 78,
      height: 62,
      borderRadius: 13,
      border: 'none',
      background: '#EEF0F4',
      color: ACCENT,
      fontSize: 22,
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
    keypadBtnClear: { background: '#E1E5EC', fontSize: 17 },

    // ---------- submit / print retry ----------
    submitBlock: { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
    errorText: { fontSize: 12.5, fontWeight: 600, color: DANGER, textAlign: 'center', fontFamily: font },
    submitBtn: {
      height: 52,
      border: 'none',
      borderRadius: 13,
      fontSize: 15,
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: font,
      color: '#fff',
      background: ACCENT,
    },
    submitBtnDisabled: { background: '#C7CCD6' },
    retryCard: {
      background: '#fff',
      border: `1.5px solid ${DANGER}`,
      borderRadius: 13,
      padding: 16,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
    retryBtn: {
      flex: 1,
      height: 52,
      borderRadius: 12,
      border: 'none',
      background: DANGER,
      color: '#fff',
      fontSize: 15,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: font,
    },
    skipPrintBtn: {
      flex: 1,
      height: 52,
      borderRadius: 12,
      border: '1.5px solid #E5E7EB',
      background: '#fff',
      color: '#6F6F6F',
      fontSize: 15,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: font,
    },

    // ---------- discrepancy confirm modal ----------
    confirmOverlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 1400,
      background: 'rgba(17,18,23,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    confirmPanel: {
      width: 440,
      maxWidth: '94vw',
      background: '#fff',
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(17,18,23,0.35)',
      padding: 28,
      textAlign: 'center',
      fontFamily: font,
    },
    confirmIcon: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: '#FDECEC',
      color: DANGER,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmTitle: { fontSize: 20, fontWeight: 700, margin: '18px 0 8px', color: ACCENT, fontFamily: font },
    confirmText: { fontSize: 14.5, color: '#6F6F6F', lineHeight: 1.5, marginBottom: 18, fontFamily: font },
    mismatchList: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 },
    mismatchRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '11px 14px',
      borderRadius: 11,
      background: '#F7F9FC',
      border: '1px solid #E9EBF0',
    },
    mismatchLabel: { fontSize: 13.5, fontWeight: 700, color: ACCENT },
    mismatchValue: { fontSize: 13.5, fontWeight: 800, color: DANGER },
    confirmActions: { display: 'flex', gap: 10 },
    confirmCancel: {
      flex: 1,
      height: 52,
      borderRadius: 12,
      border: '1.5px solid #E5E7EB',
      background: '#fff',
      color: '#6F6F6F',
      fontSize: 15,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: font,
    },
    confirmGo: {
      flex: 1.2,
      height: 52,
      borderRadius: 12,
      border: 'none',
      background: DANGER,
      color: '#fff',
      fontSize: 15,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: font,
    },

    // ---------- success ----------
    successWrap: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    successInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 },
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
    successTitle: { fontSize: 22, fontWeight: 700, color: ACCENT, fontFamily: font },
    successSub: { fontSize: 15, fontWeight: 500, color: '#6F6F6F', fontFamily: font },
  }
})

const TARGET_LABELS = {
  actual: 'фактическая сумма наличных',
  uzcard: 'фактическая сумма Uzcard',
  humo: 'фактическая сумма Humo',
  closed: 'сумма, оставляемая в кассе',
}

const fmt = (n) => thousandDivider(Math.round(Math.abs(Number(n) || 0)))

function CloseShiftPage() {
  const classes = useStyles()
  const { id } = useParams()
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const userData = useSelector((state) => state.user)

  const [company, setCompany] = useState('1')
  const [amounts, setAmounts] = useState({ actual: '', uzcard: '', humo: '', closed: '' })
  const [target, setTarget] = useState('actual')
  const [formError, setFormError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [status, setStatus] = useState('entering')
  const [checkdata, setcheckdata] = useState()
  const [printError, setPrintError] = useState(null)
  const [now, setNow] = useState(new Date())

  // back to the sale this page was opened from (POS passes ?sale_id=)
  const saleId = get(values, 'sale_id')
  const goBack = () => (saleId ? navigate(`/sales/pos/${saleId}`) : navigate(-1))

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { data: operationDetailRes, isLoading: operationDetailLoading } = useQuery(
    ['cashboxOperationDetail', id],
    () => requests.getCashBoxOperationDetail(id),
    { enabled: !!id },
  )
  const operationDetail = get(operationDetailRes, 'data.data', {})
  // Наличные в кассе = открытие + чистые продажи наличными (продажи − возвраты) − расходы наличными
  const cashExpenses = (operationDetail.expenses || []).reduce((sum, e) => (e.payment_kind === 'cash' ? sum + (e.amount || 0) : sum), 0)
  const expectedCash = (operationDetail.opened_amount || 0) + (operationDetail.cash_net_amount || 0) - cashExpenses
  const availableCashless =
    (operationDetail.open_cashless_amount || 0) +
    (operationDetail.sales_uzcard || 0) +
    (operationDetail.sales_humo || 0) +
    (operationDetail.sales_click || 0) +
    (operationDetail.sales_payme || 0) +
    (operationDetail.sales_munis || 0)

  // mutation callbacks fire long after render — read entry state through a ref
  const stateRef = useRef({})
  stateRef.current = { amounts, company, availableCashless }

  const handleAgentZReportPrint = async (zrepoData) => {
    setPrintError(null)
    try {
      let logoHex = null
      try {
        logoHex = await loadSvgAsEscposHex('/MagnitLogoPremiumCheque.svg', 400, 576)
      } catch (e) {
        console.warn('Failed to load logo for Z-Report:', e)
      }

      const layoutLines = buildZReportReceiptLayout(zrepoData, {
        logoHex,
        name: get(userData, 'store.name'),
        address: get(userData, 'store.address'),
        cashier: `${get(userData, 'first_name', '')} ${get(userData, 'last_name', '')}`.trim(),
      })
      const reqPayload = {
        lines: layoutLines,
      }

      const res = await axios.post('http://localhost:7788/print/raw-template', reqPayload)
      if (res.data && res.data.ok) {
        success('Отчет Z успешно распечатан!')
        submitRegister()
        return true
      } else {
        throw new Error(res.data?.message || 'Agent print error')
      }
    } catch (err) {
      console.error('Z-Report printing failed:', err)
      setPrintError('Не удалось распечатать Z-отчет. Проверьте принтер и агент.')
      error('Ошибка печати Z-отчета!')
      return false
    }
  }

  const { mutate: closeCheckZReport, isLoading: iscloseCheckZReport } = useMutation(requests.closeCheckZReport, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        error(`err: ${get(data, 'message')?.split('Ru:')[1]}`)
        return
      } else {
        const zrepo = get(data, 'message')
        setcheckdata(zrepo)
        handleAgentZReportPrint(zrepo)
      }
    },
    onError: (err) => {
      error('Ошибка закрытия кассы! (close Z info Report)')
      console.error('err', err)
    },
  })

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
      // Kassa endi qurilma bo'yicha avtomatik aniqlanadi (login/index.jsx),
      // shuning uchun qo'lda tanlash sahifasi (sales/create) o'rniga
      // to'g'ridan-to'g'ri login ekraniga qaytariladi.
      setStatus('done')
      setTimeout(() => {
        navigate(`/login`)
      }, 1800)
    },
    onError: (err) => {
      error('Ошибка закрытия кассы!')
      console.error('err', err)
    },
  })

  const closing = iscloseZReport || iscloseCheckZReport || iscloseCashBoxRegister

  const submitRegister = () => {
    const current = stateRef.current
    const counted = Number(current.amounts.actual) || 0
    // Вариант 1 — вся наличность остаётся в кассе, 2 — всё передаётся компании,
    // 3 — в кассе остаётся введённая сумма, остальное передаётся компании.
    // closed_amount — остаётся в кассе, company_amount — передано компании;
    // их сумма и есть фактически пересчитанная наличность.
    const keptAmount = current.company === '3' ? Number(current.amounts.closed) || 0 : current.company === '2' ? 0 : counted
    if (keptAmount > counted) {
      error('Оставшаяся сумма не может быть больше фактической!')
      return
    }
    closeCashBoxRegister({
      id,
      data: {
        closed_amount: keptAmount,
        company_amount: counted - keptAmount,
        close_cashless_amount: current.availableCashless,
        is_company: current.company === '2',
      },
    })
  }

  // Live reconciliation of the three re-countable payment types against the
  // expected amounts; empty entry counts as 0 (design behaviour).
  const moneyFields = [
    { key: 'actual', label: 'Наличные', expected: expectedCash, glyph: <CashGlyph /> },
    { key: 'uzcard', label: 'Uzcard', expected: operationDetail.sales_uzcard || 0, glyph: <CardGlyph /> },
    { key: 'humo', label: 'Humo', expected: operationDetail.sales_humo || 0, glyph: <CardGlyph /> },
  ].map((f) => {
    const val = amounts[f.key]
    const d = (val === '' ? 0 : Number(val)) - f.expected
    return {
      ...f,
      empty: val === '',
      display: val === '' ? '0' : thousandDivider(Number(val)),
      diffOk: d === 0,
      diffText: d === 0 ? 'Совпадает с ожидаемой суммой' : d > 0 ? `Излишек: ${fmt(d)} UZS` : `Недостача: ${fmt(d)} UZS`,
    }
  })
  const mismatches = moneyFields.filter((f) => !f.diffOk).map((f) => ({ label: f.label, text: f.diffText }))

  const otherCashless = [
    { label: 'Click', amount: operationDetail.sales_click || 0 },
    { label: 'Payme', amount: operationDetail.sales_payme || 0 },
    { label: 'Munis', amount: operationDetail.sales_munis || 0 },
  ]

  const counted = amounts.actual === '' ? 0 : Number(amounts.actual)
  const closedNum = amounts.closed === '' ? 0 : Number(amounts.closed)
  const toCompany = Math.max(counted - closedNum, 0)
  const canSubmit = amounts.actual !== '' && (company !== '3' || closedNum <= counted)

  const options = [
    { id: '1', title: 'Оставить всю сумму в кассе', amountLabel: 'Останется в кассе', amount: counted, glyph: <CashGlyph /> },
    { id: '2', title: 'Передать всю сумму компании', amountLabel: 'Передать компании', amount: counted, glyph: <TransferGlyph /> },
    { id: '3', title: 'Оставить часть, остальное передать', amountLabel: 'Передать компании', amount: toCompany, glyph: <SplitGlyph /> },
  ]

  const pickOption = (optionId) => {
    setCompany(optionId)
    setTarget(optionId === '3' ? 'closed' : 'actual')
  }

  const pressDigit = (ch) => {
    setFormError('')
    setAmounts((a) => (a[target].length >= MAX_DIGITS ? a : { ...a, [target]: (a[target] + ch).replace(/^0+(?=\d)/, '') }))
  }
  const backspaceKey = () => {
    setFormError('')
    setAmounts((a) => ({ ...a, [target]: a[target].slice(0, -1) }))
  }
  const clearKey = () => {
    setFormError('')
    setAmounts((a) => ({ ...a, [target]: '' }))
  }

  const startClose = () => {
    setPrintError(null)
    closeZReport({
      token: 'DXJFX32CN1296678504F2',
      method: 'closeZreport',
    })
  }

  const handleSubmit = () => {
    if (closing) return
    if (amounts.actual === '') {
      setFormError('Пожалуйста, заполните все поля!')
      error('Пожалуйста, заполните все поля!')
      return
    }
    if (company === '3' && closedNum > counted) {
      setFormError('Оставляемая сумма не может быть больше фактической')
      error('Оставшаяся сумма не может быть больше фактической!')
      return
    }
    setFormError('')
    if (mismatches.length > 0) {
      setConfirmOpen(true)
      return
    }
    startClose()
  }

  const confirmClose = () => {
    setConfirmOpen(false)
    startClose()
  }

  // physical keyboard support for the numpad entry
  useEffect(() => {
    if (status !== 'entering' || confirmOpen) return
    const handler = (e) => {
      if (closing) return
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        backspaceKey()
      } else if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        pressDigit(e.key)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, confirmOpen, closing, target, amounts, company])

  const pad2 = (n) => String(n).padStart(2, '0')
  const cashierName = `${get(userData, 'first_name', '')} ${get(userData, 'last_name', '')}`.trim()

  const renderField = (value, active) => (
    <Box className={`${classes.field} ${active ? classes.fieldActive : ''}`}>
      <span className={`${classes.fieldText} ${value === '' ? classes.fieldTextEmpty : ''}`}>
        {value === '' ? '0' : thousandDivider(Number(value))}
      </span>
      <span className={classes.fieldSuffix}>UZS</span>
    </Box>
  )

  return (
    <Box className={classes.screen}>
      <Box component='header' className={classes.header}>
        <Box className={classes.headerLeft}>
          <Box component='button' type='button' className={classes.backBtn} onClick={goBack} aria-label='Назад'>
            <ArrowLeft size={16} strokeWidth={2.2} />
          </Box>
          <span className={classes.headerTitle}>Закрытие смены</span>
        </Box>
        <Box className={classes.headerChip}>
          <User size={13} color='#9CA3AF' />
          {cashierName || '—'}
          <span className={classes.headerChipDivider} />
          <span className={classes.headerClock}>
            {pad2(now.getHours())}:{pad2(now.getMinutes())}
          </span>
        </Box>
      </Box>

      {status === 'done' ? (
        <Box className={classes.successWrap}>
          <Box className={classes.successInner}>
            <span className={classes.successIcon}>
              <Check size={44} strokeWidth={2.4} />
            </span>
            <Typography className={classes.successTitle}>Касса закрыта</Typography>
            <Typography className={classes.successSub}>
              {printError ? 'Возврат ко входу…' : 'Z-отчёт отправлен на печать. Возврат ко входу…'}
            </Typography>
          </Box>
        </Box>
      ) : (
        <LoadingContainer noHeight readyState={!operationDetailLoading}>
          <Box className={classes.body}>
            {/* LEFT: what to do with cash + expected vs actual */}
            <Box className={`${classes.leftCol} ${classes.colScroll}`}>
              <Typography className={classes.sectionLabel}>Что сделать с наличными</Typography>

              <Box className={classes.optionsRow}>
                {options.map((o) => {
                  const selected = company === o.id
                  return (
                    <Box
                      key={o.id}
                      component='button'
                      type='button'
                      className={`${classes.optionCard} ${selected ? classes.optionCardSelected : ''}`}
                      onClick={() => pickOption(o.id)}
                    >
                      <Box className={classes.optionTop}>
                        <span className={classes.optionGlyphWrap}>{o.glyph}</span>
                        {selected ? (
                          <span className={classes.optionCheck}>
                            <Check size={13} strokeWidth={3} />
                          </span>
                        ) : (
                          <span className={classes.optionUncheck} />
                        )}
                      </Box>
                      <span className={classes.optionTitle}>{o.title}</span>
                      <Box className={classes.optionFooter}>
                        <span className={classes.optionAmountLabel}>{o.amountLabel}</span>
                        <span className={classes.optionAmount}>
                          {fmt(o.amount)} <span className={classes.unitSm}>UZS</span>
                        </span>
                      </Box>
                    </Box>
                  )
                })}
              </Box>

              {company === '3' && (
                <Box
                  className={`${classes.moneyCard} ${target === 'closed' ? classes.moneyCardActive : ''}`}
                  onClick={() => setTarget('closed')}
                >
                  <span className={classes.glyphWrap}>
                    <Pencil size={17} strokeWidth={2} />
                  </span>
                  <Box className={classes.remainderInfo}>
                    <Typography className={classes.remainderTitle}>Оставить в кассе</Typography>
                    <Typography className={classes.remainderSub}>
                      Компании: <b style={{ color: '#6F6F6F' }}>{fmt(toCompany)} UZS</b>
                    </Typography>
                  </Box>
                  <Box className={classes.moneyRight} sx={{ gap: 0 }}>
                    {renderField(amounts.closed, target === 'closed')}
                  </Box>
                </Box>
              )}

              <Typography className={classes.sectionLabel} sx={{ marginTop: '4px' }}>
                Ожидаемые суммы по типам оплаты
              </Typography>

              {moneyFields.map((f) => (
                <Box
                  key={f.key}
                  className={`${classes.moneyCard} ${target === f.key ? classes.moneyCardActive : ''}`}
                  onClick={() => setTarget(f.key)}
                >
                  <span className={classes.glyphWrap}>{f.glyph}</span>
                  <Box className={classes.moneyInfo}>
                    <Typography className={classes.moneyLabel}>{f.label}</Typography>
                    <Typography className={classes.moneyExpected}>
                      Ожидается {fmt(f.expected)} <span style={{ color: '#9CA3AF' }}>UZS</span>
                    </Typography>
                  </Box>
                  <Box className={classes.moneyRight}>
                    {renderField(amounts[f.key], target === f.key)}
                    <Box className={classes.diffRow} style={{ color: f.diffOk ? ACCENT : DANGER }}>
                      <span>{f.diffText}</span>
                      {f.diffOk ? <Check size={13} strokeWidth={2.6} /> : <AlertCircle size={13} />}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* RIGHT: non-cash info, numpad, close button */}
            <Box className={`${classes.rightCol} ${classes.colScroll}`}>
              <Box className={classes.panelCard}>
                <Box className={classes.panelHead}>
                  <Typography className={classes.panelTitle}>Прочие безналичные</Typography>
                  <Typography className={classes.panelNote}>сверяется автоматически</Typography>
                </Box>
                <Box display='flex' flexDirection='column' gap='2px'>
                  {otherCashless.map((o) => (
                    <Box key={o.label} className={classes.cashlessRow}>
                      <Box className={classes.cashlessName}>
                        <span className={classes.cashlessDot} />
                        <span className={classes.cashlessLabel}>{o.label}</span>
                      </Box>
                      <span className={classes.cashlessAmount}>
                        {fmt(o.amount)} <span className={classes.unitXs}>UZS</span>
                      </span>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box className={classes.numpadCard}>
                <Typography className={classes.numpadLabel}>Ввод: {TARGET_LABELS[target] || 'сумма'}</Typography>
                <Box className={classes.keypadGrid}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type='button'
                      className={classes.keypadBtn}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pressDigit(digit)}
                      disabled={closing}
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type='button'
                    className={`${classes.keypadBtn} ${classes.keypadBtnBack}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={backspaceKey}
                    aria-label='Удалить'
                    disabled={closing}
                  >
                    <Delete size={22} />
                  </button>
                  <button
                    type='button'
                    className={classes.keypadBtn}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pressDigit('0')}
                    disabled={closing}
                  >
                    0
                  </button>
                  <button
                    type='button'
                    className={`${classes.keypadBtn} ${classes.keypadBtnClear}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={clearKey}
                    aria-label='Очистить'
                    disabled={closing}
                  >
                    C
                  </button>
                </Box>
              </Box>

              {checkdata && printError ? (
                <Box className={classes.retryCard}>
                  <Typography className={classes.errorText}>{printError}</Typography>
                  <Box display='flex' gap='10px'>
                    <button type='button' className={classes.retryBtn} onClick={() => handleAgentZReportPrint(checkdata)}>
                      Повторить печать
                    </button>
                    <button type='button' className={classes.skipPrintBtn} onClick={submitRegister} disabled={iscloseCashBoxRegister}>
                      Завершить без печати
                    </button>
                  </Box>
                </Box>
              ) : (
                <Box className={classes.submitBlock}>
                  {formError && <Typography className={classes.errorText}>{formError}</Typography>}
                  <button
                    type='button'
                    className={`${classes.submitBtn} ${!canSubmit || closing ? classes.submitBtnDisabled : ''}`}
                    onClick={handleSubmit}
                    disabled={closing}
                  >
                    {closing ? (
                      <>
                        Закрытие… <CircularProgress size={18} sx={{ color: '#fff' }} />
                      </>
                    ) : (
                      <>
                        Закрыть кассу <ArrowRight size={18} strokeWidth={2.2} />
                      </>
                    )}
                  </button>
                </Box>
              )}
            </Box>
          </Box>
        </LoadingContainer>
      )}

      {confirmOpen && (
        <Box className={classes.confirmOverlay} onClick={() => setConfirmOpen(false)}>
          <Box className={classes.confirmPanel} onClick={(e) => e.stopPropagation()}>
            <span className={classes.confirmIcon}>
              <AlertTriangle size={30} strokeWidth={2} />
            </span>
            <Typography className={classes.confirmTitle}>Обнаружено расхождение</Typography>
            <Typography className={classes.confirmText}>
              Пересчитанные суммы не совпадают с ожидаемыми. Проверьте перед закрытием кассы:
            </Typography>
            <Box className={classes.mismatchList}>
              {mismatches.map((m) => (
                <Box key={m.label} className={classes.mismatchRow}>
                  <span className={classes.mismatchLabel}>{m.label}</span>
                  <span className={classes.mismatchValue}>{m.text}</span>
                </Box>
              ))}
            </Box>
            <Box className={classes.confirmActions}>
              <button type='button' className={classes.confirmCancel} onClick={() => setConfirmOpen(false)}>
                Проверить ещё раз
              </button>
              <button type='button' className={classes.confirmGo} onClick={confirmClose}>
                Всё равно закрыть
              </button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CloseShiftPage
