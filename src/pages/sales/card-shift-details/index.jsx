import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import axios from 'axios'
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Check, Delete, Equal, Lock, Minus, Plus, User } from 'lucide-react'
import { useQueryParams } from '@hooks/useQueryParams'
import LoadingContainer from '@components/LoadingContainer'
import thousandDivider from '@utils/thousandDivider'
import { error, success } from '@utils/toast'
import { requests } from '@utils/requests'
import { loadSvgAsEscposHex } from '@utils/escposImage'
import { buildZReportReceiptLayout } from '@utils/receiptBuilder'

const ACCENT = '#111217'
const DANGER = '#E23A32'
const WARN = '#B26A00'
const OK = '#1E9E52'
const GLYPH_BG = '#F1F3F7'
const MAX_DIGITS = 12
// Ledger grid: label | expected | fact | diff
const GRID = '1fr 112px 168px 115px'

const CashGlyph = () => (
  <svg width='18' height='18' viewBox='0 0 24 24'>
    <rect x='1' y='6' width='22' height='12' rx='2.5' fill={ACCENT} />
    <rect x='3.2' y='9.7' width='3' height='4.6' rx='1' fill={GLYPH_BG} />
    <rect x='17.8' y='9.7' width='3' height='4.6' rx='1' fill={GLYPH_BG} />
    <circle cx='12' cy='12' r='2.7' fill={GLYPH_BG} />
  </svg>
)

const CashlessGlyph = () => (
  <svg width='16' height='16' viewBox='0 0 24 24'>
    <rect x='2' y='4' width='20' height='16' rx='3' fill='#B6BAC4' />
    <circle cx='12' cy='12' r='4.2' fill={GLYPH_BG} />
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
      height: 52,
      flexShrink: 0,
      background: ACCENT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      color: '#fff',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 13 },
    backBtn: {
      width: 34,
      height: 34,
      borderRadius: 9,
      border: '1px solid rgba(255,255,255,0.10)',
      background: 'rgba(255,255,255,0.06)',
      color: '#E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      '&:hover': { background: 'rgba(255,255,255,0.14)', color: '#fff' },
    },
    headerTitle: { fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: font },
    headerChip: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      background: 'rgba(255,255,255,0.05)',
      padding: '7px 12px',
      borderRadius: 9,
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: 12.5,
      color: '#E5E7EB',
    },
    headerChipDivider: { width: 1, height: 14, background: 'rgba(255,255,255,0.15)' },
    headerClock: { fontVariantNumeric: 'tabular-nums', fontFamily: 'ui-monospace, Menlo, monospace' },

    // ---------- layout ----------
    body: { flex: 1, display: 'flex', gap: 12, padding: 14, overflow: 'hidden', minHeight: 0 },
    rightCol: { flex: '0 0 306px', display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0, minHeight: 0 },

    // ---------- ledger table ----------
    ledger: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      minHeight: 0,
      background: '#fff',
      border: '1px solid #E9EBF0',
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 3px 12px rgba(17,18,23,0.03)',
    },
    thead: {
      display: 'grid',
      gridTemplateColumns: GRID,
      padding: '11px 16px',
      borderBottom: '1px solid #EDEFF3',
      background: '#FAFBFC',
      fontSize: 10,
      fontWeight: 700,
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      flexShrink: 0,
      fontFamily: font,
    },
    ledgerRows: { flex: 1, minHeight: 0, overflowY: 'auto' },
    row: {
      display: 'grid',
      gridTemplateColumns: GRID,
      alignItems: 'center',
      minHeight: 58,
      padding: '0 16px',
      borderBottom: '1px solid #F3F4F7',
      borderLeft: '3px solid transparent',
      cursor: 'pointer',
      fontFamily: font,
    },
    rowActive: { background: '#F1F2F5', borderLeftColor: ACCENT },
    rowAuto: { cursor: 'default' },
    cellLabel: { display: 'flex', alignItems: 'center', gap: 11, fontSize: 14, fontWeight: 700, minWidth: 0 },
    cellLabelAuto: { color: '#8A8F9C' },
    glyphWrap: {
      width: 32,
      height: 32,
      borderRadius: 9,
      background: GLYPH_BG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden',
    },
    glyphWrapActive: { background: '#fff' },
    brandLogo: { height: 11, width: 'auto', maxWidth: 24 },
    cellExpected: {
      textAlign: 'right',
      fontSize: 13.5,
      fontWeight: 600,
      color: '#6F6F6F',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    },
    cellExpectedAuto: { color: '#9CA3AF' },
    cellRight: { display: 'flex', justifyContent: 'flex-end' },

    // ---------- fact field ----------
    field: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 138,
      height: 40,
      boxSizing: 'border-box',
      borderRadius: 10,
      background: '#F7F9FC',
      border: '1px solid #E5E7EB',
      padding: '0 10px',
      gap: 5,
      minWidth: 0,
    },
    fieldActive: { background: '#fff', border: `1.5px solid ${ACCENT}`, boxShadow: '0 0 0 3px rgba(17,18,23,0.08)' },
    fieldText: {
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: ACCENT,
    },
    fieldTextEmpty: { color: '#B6BAC4' },
    fieldSuffix: { fontSize: 10.5, fontWeight: 700, color: '#9CA3AF', flexShrink: 0 },
    autoChip: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 138,
      height: 40,
      boxSizing: 'border-box',
      borderRadius: 10,
      background: GLYPH_BG,
      padding: '0 10px',
      fontSize: 12,
      fontWeight: 700,
      color: '#9CA3AF',
      fontFamily: font,
    },
    autoChipLabel: { display: 'flex', alignItems: 'center', gap: 5 },
    autoChipVal: { fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },

    // ---------- diff pills ----------
    pill: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '5px 10px',
      borderRadius: 20,
      fontSize: 11.5,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      fontFamily: font,
    },
    pillOk: { background: '#E9F8EF', color: OK },
    pillShort: { background: '#FDECEC', color: DANGER },
    pillOver: { background: '#FFF4E5', color: WARN },
    pillNeutral: { background: GLYPH_BG, color: '#B6BAC4' },

    // ---------- totals footer ----------
    tfoot: {
      display: 'grid',
      gridTemplateColumns: GRID,
      alignItems: 'center',
      minHeight: 56,
      padding: '0 16px',
      background: ACCENT,
      color: '#fff',
      flexShrink: 0,
      fontFamily: font,
    },
    tfootLabel: { fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' },
    tfootNum: { textAlign: 'right', fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
    tfootUnit: { fontSize: 10, fontWeight: 700, color: '#9CA3AF' },
    tfootPillOk: { background: 'rgba(255,255,255,0.12)', color: '#5CD68A' },
    tfootPillBad: { background: DANGER, color: '#fff' },

    // ---------- numpad ----------
    numpadCard: {
      background: '#fff',
      border: '1px solid #E9EBF0',
      borderRadius: 14,
      padding: 12,
      boxShadow: '0 4px 16px rgba(17,18,23,0.04)',
      flexShrink: 0,
    },
    numpadExpr: {
      fontSize: 13,
      fontWeight: 700,
      color: '#9CA3AF',
      fontVariantNumeric: 'tabular-nums',
      height: 18,
      margin: '0 2px 8px',
      fontFamily: font,
    },
    keypadGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 62, gap: 8 },
    keypadBtn: {
      border: 'none',
      borderRadius: 11,
      background: '#EEF0F4',
      color: ACCENT,
      fontSize: 19,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontFamily: font,
      userSelect: 'none',
      transition: 'transform .08s ease, filter .08s ease',
      '&:active': { transform: 'scale(0.95)', filter: 'brightness(0.94)' },
      '&:disabled': { cursor: 'default', opacity: 0.65 },
    },
    keypadBtnBack: { background: '#E1E5EC', color: '#6F6F6F' },
    keypadBtnComma: { background: '#E1E5EC', fontSize: 21 },
    keypadBtnClear: { background: '#E1E5EC', fontSize: 14, fontWeight: 800 },
    keypadBtnOp: { background: ACCENT, color: '#fff' },
    keypadBtnOpActive: { background: '#3A3D4A' },
    keypadBtnEq: { background: OK, color: '#fff' },

    // ---------- cash destination ----------
    sectionLabel: {
      fontSize: 10.5,
      fontWeight: 700,
      color: ACCENT,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      paddingLeft: 2,
      marginTop: 2,
      fontFamily: font,
    },
    optionRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: '#fff',
      border: '2px solid #E9EBF0',
      borderRadius: 11,
      padding: '9px 12px',
      minHeight: 44,
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: font,
      width: '100%',
    },
    optionRowSelected: { borderColor: ACCENT },
    optionCheck: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: ACCENT,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    optionUncheck: { width: 20, height: 20, borderRadius: '50%', border: '2px solid #D5D7E2', flexShrink: 0, boxSizing: 'border-box' },
    optionInfo: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 },
    optionTitle: { fontSize: 12.5, fontWeight: 700, lineHeight: 1.2, color: ACCENT, fontFamily: font },
    optionSub: { fontSize: 10.5, fontWeight: 600, color: '#9CA3AF', lineHeight: 1.3, fontFamily: font },
    splitRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: '#fff',
      border: '2px solid #E9EBF0',
      borderRadius: 11,
      padding: '8px 12px',
      cursor: 'pointer',
      fontFamily: font,
    },
    splitRowActive: { borderColor: ACCENT },

    // ---------- submit / retry ----------
    spacer: { flex: 1 },
    errorText: { fontSize: 12.5, fontWeight: 600, color: DANGER, textAlign: 'center', fontFamily: font },
    submitBtn: {
      height: 54,
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
      flexShrink: 0,
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
      color: OK,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    successTitle: { fontSize: 22, fontWeight: 700, color: ACCENT, fontFamily: font },
    successSub: { fontSize: 15, fontWeight: 500, color: '#6F6F6F', fontFamily: font },
  }
})

const fmt = (n) => thousandDivider(Math.round(Math.abs(Number(n) || 0)))
const parseAmount = (raw) => Number(String(raw || '').replace(',', '.')) || 0

const formatAmountDisplay = (raw) => {
  if (raw === '' || raw == null) return '0'
  const [intPart, decPart] = String(raw).split(',')
  const intFmt = thousandDivider(Number(intPart || 0))
  return decPart !== undefined ? `${intFmt},${decPart}` : intFmt
}

const formatResultForEntry = (n) => {
  const rounded = Math.round(Math.max(0, n) * 1000) / 1000
  const [intPart, decPart] = String(rounded).split('.')
  if (!decPart) return intPart
  return `${intPart},${decPart.padEnd(3, '0').slice(0, 3)}`
}

const applyOp = (total, op, val) => (op === '-' ? total - val : total + val)

function CloseShiftPage() {
  const classes = useStyles()
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { values } = useQueryParams()
  const userData = useSelector((state) => state.user)

  const [company, setCompany] = useState('1')
  const [amounts, setAmounts] = useState({ actual: '', uzcard: '', humo: '', closed: '' })
  const [target, setTarget] = useState('actual')
  const [calcState, setCalcState] = useState({ total: 0, op: null })
  const [formError, setFormError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [status, setStatus] = useState('entering')
  const [checkdata, setcheckdata] = useState()
  const [printError, setPrintError] = useState(null)
  const [now, setNow] = useState(new Date())

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
  const cashExpenses = (operationDetail.expenses || []).reduce((sum, e) => (e.payment_kind === 'cash' ? sum + (e.amount || 0) : sum), 0)
  const expectedCash = (operationDetail.opened_amount || 0) + (operationDetail.cash_net_amount || 0) - cashExpenses
  const availableCashless =
    (operationDetail.open_cashless_amount || 0) +
    (operationDetail.sales_uzcard || 0) +
    (operationDetail.sales_humo || 0) +
    (operationDetail.sales_click || 0) +
    (operationDetail.sales_payme || 0) +
    (operationDetail.sales_uzum || 0) +
    (operationDetail.sales_munis || 0)

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

      let kassaNumber = '-'
      try {
        const savedCashbox = JSON.parse(localStorage.getItem('selected_cashbox') || 'null')
        kassaNumber = savedCashbox?.full_name || savedCashbox?.name || '-'
      } catch (e) {
        kassaNumber = '-'
      }

      const keptAmount = company === '3' ? parseAmount(amounts.closed) : company === '2' ? 0 : counted
      const givenToCompanyAmount = counted - keptAmount

      const enrichedZrepo = {
        ...zrepoData,
        moneyRows: moneyFields.map((f) => ({
          label: f.label,
          expected: f.expected,
          fact: parseAmount(amounts[f.key]),
          diff: f.diff,
        })),
        autoRows: autoRows.map((o) => ({ label: o.label, amount: o.amount })),
        totalExpected,
        totalEntered,
        totalDiff,
        keptInRegister: keptAmount,
        givenToCompany: givenToCompanyAmount,
      }

      const layoutLines = buildZReportReceiptLayout(enrichedZrepo, {
        logoHex,
        name: get(userData, 'store.name'),
        address: get(userData, 'store.address'),
        cashier: `${get(userData, 'first_name', '')} ${get(userData, 'last_name', '')}`.trim(),
        kassaNumber,
      })
      const res = await axios.post('http://localhost:7788/print/raw-template', { lines: layoutLines })
      if (res.data && res.data.ok) {
        success(t('close_shift.zreport_print_success'))
        submitRegister()
        return true
      } else {
        throw new Error(res.data?.message || 'Agent print error')
      }
    } catch (err) {
      console.error('Z-Report printing failed:', err)
      setPrintError(t('close_shift.print_failed_desc'))
      error(t('close_shift.print_error_toast'))
      return false
    }
  }

  const { mutate: closeCheckZReport, isLoading: iscloseCheckZReport } = useMutation(requests.closeCheckZReport, {
    onSuccess: ({ data }) => {
      if (get(data, 'error', true)) {
        error(`${t('pos.error_prefix')}${get(data, 'message')?.split('Ru:')[1]}`)
        return
      } else {
        const zrepo = get(data, 'message')
        setcheckdata(zrepo)
        handleAgentZReportPrint(zrepo)
      }
    },
    onError: (err) => {
      error(t('close_shift.error_closing_register'))
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
        success(t('close_shift.register_closed_success'))
        return
      } else {
        error(`${t('pos.error_prefix')}${get(data, 'message')?.split('Ru:')[1]}`)
        return
      }
    },
    onError: (err) => {
      error(t('close_shift.error_closing_register'))
      console.error('err', err)
    },
  })

  const { mutate: closeCashBoxRegister, isLoading: iscloseCashBoxRegister } = useMutation(requests.closeCashBoxRegister, {
    onSuccess: () => {
      setStatus('done')
      setTimeout(() => {
        navigate(`/login`)
      }, 1800)
    },
    onError: (err) => {
      error(t('close_shift.error_closing_register'))
      console.error('err', err)
    },
  })

  const closing = iscloseZReport || iscloseCheckZReport || iscloseCashBoxRegister

  const submitRegister = () => {
    const current = stateRef.current
    const counted = parseAmount(current.amounts.actual)
    const keptAmount = current.company === '3' ? parseAmount(current.amounts.closed) : current.company === '2' ? 0 : counted
    if (keptAmount > counted) {
      error(t('close_shift.error_kept_exceeds_actual'))
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

  // Automatically reconciled payment types — same 58px rows, locked chip in "Факт".
  const autoRows = [
    { key: 'click', label: 'Click', img: '/images/click.png', amount: operationDetail.sales_click || 0 },
    { key: 'payme', label: 'Payme', img: '/images/payme.png', amount: operationDetail.sales_payme || 0 },
    { key: 'uzum', label: 'Uzum', img: '/uzum.png', amount: operationDetail.sales_uzum || 0 },
    { key: 'uzqr', label: 'UzQR', img: null, amount: operationDetail.sales_munis || 0 },
  ]

  // Re-countable rows; empty entry shows a neutral badge (no scary red until typed).
  const moneyFields = [
    { key: 'actual', label: t('close_shift.cash_label'), expected: expectedCash, img: null },
    { key: 'uzcard', label: 'Uzcard', expected: operationDetail.sales_uzcard || 0, img: '/images/uzcard.png' },
    { key: 'humo', label: 'Humo', expected: operationDetail.sales_humo || 0, img: '/images/humo.png' },
  ].map((f) => {
    const empty = amounts[f.key] === ''
    const d = parseAmount(amounts[f.key]) - f.expected
    return {
      ...f,
      empty,
      diff: d,
      diffText:
        d === 0
          ? t('close_shift.diff_matches')
          : d > 0
          ? t('close_shift.diff_surplus', { amount: fmt(d) })
          : t('close_shift.diff_shortage', { amount: fmt(d) }),
    }
  })
  const mismatches = moneyFields.filter((f) => f.diff !== 0).map((f) => ({ label: f.label, text: f.diffText }))

  const counted = parseAmount(amounts.actual)
  const closedNum = parseAmount(amounts.closed)
  const toCompany = Math.max(counted - closedNum, 0)
  const canSubmit = amounts.actual !== '' && (company !== '3' || closedNum <= counted)

  const totalExpected = moneyFields.reduce((t, f) => t + f.expected, 0)
  const totalEntered = moneyFields.reduce((t, f) => t + parseAmount(amounts[f.key]), 0)
  const totalDiff = totalEntered - totalExpected
  const anyEntered = moneyFields.some((f) => !f.empty)

  const options = [
    { id: '1', title: t('close_shift.option_keep_all_title'), sub: t('close_shift.option_keep_all_sub', { amount: fmt(counted) }) },
    { id: '2', title: t('close_shift.option_give_all_title'), sub: t('close_shift.option_give_all_sub') },
    { id: '3', title: t('close_shift.option_split_title'), sub: t('close_shift.option_split_sub') },
  ]

  const finalizePendingCalc = () => {
    if (!calcState.op) return
    const currentVal = parseAmount(amounts[target])
    const result = applyOp(calcState.total, calcState.op, currentVal)
    setAmounts((a) => ({ ...a, [target]: formatResultForEntry(result) }))
    setCalcState({ total: 0, op: null })
  }

  const switchTarget = (key) => {
    if (key === target) return
    finalizePendingCalc()
    setTarget(key)
  }

  const pickOption = (optionId) => {
    finalizePendingCalc()
    setCompany(optionId)
    setTarget(optionId === '3' ? 'closed' : 'actual')
  }

  const pressDigit = (ch) => {
    setFormError('')
    setAmounts((a) => {
      const cur = a[target]
      const [intPart = '', decPart] = cur.split(',')
      if (decPart !== undefined) {
        if (decPart.length >= 3) return a
        return { ...a, [target]: `${intPart},${decPart}${ch}` }
      }
      const nextInt = (intPart + ch).replace(/^0+(?=\d)/, '')
      if (nextInt.length > MAX_DIGITS) return a
      return { ...a, [target]: nextInt }
    })
  }
  const pressComma = () => {
    setFormError('')
    setAmounts((a) => {
      const cur = a[target]
      if (cur.includes(',')) return a
      return { ...a, [target]: `${cur === '' ? '0' : cur},` }
    })
  }
  const backspaceKey = () => {
    setFormError('')
    if (amounts[target] === '' && calcState.op) {
      setAmounts((a) => ({ ...a, [target]: formatResultForEntry(calcState.total) }))
      setCalcState({ total: 0, op: null })
      return
    }
    setAmounts((a) => ({ ...a, [target]: a[target].slice(0, -1) }))
  }
  const clearKey = () => {
    setFormError('')
    setCalcState({ total: 0, op: null })
    setAmounts((a) => ({ ...a, [target]: '' }))
  }
  const pressOperator = (op) => {
    setFormError('')
    const currentVal = parseAmount(amounts[target])
    const newTotal = calcState.op ? applyOp(calcState.total, calcState.op, currentVal) : currentVal
    setCalcState({ total: newTotal, op })
    setAmounts((a) => ({ ...a, [target]: '' }))
  }
  const pressEquals = () => {
    if (!calcState.op) return
    setFormError('')
    const currentVal = parseAmount(amounts[target])
    const result = applyOp(calcState.total, calcState.op, currentVal)
    setCalcState({ total: 0, op: null })
    setAmounts((a) => ({ ...a, [target]: formatResultForEntry(result) }))
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
    if (calcState.op) {
      finalizePendingCalc()
      return
    }
    if (amounts.actual === '') {
      setFormError(t('pos.error_fill_fields'))
      error(t('pos.error_fill_fields'))
      return
    }
    if (company === '3' && closedNum > counted) {
      setFormError(t('close_shift.error_kept_exceeds_actual'))
      error(t('close_shift.error_kept_exceeds_actual'))
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
      } else if (e.key === '+') {
        e.preventDefault()
        pressOperator('+')
      } else if (e.key === '-') {
        e.preventDefault()
        pressOperator('-')
      } else if (e.key === '=') {
        e.preventDefault()
        pressEquals()
      } else if (e.key === ',' || e.key === '.') {
        e.preventDefault()
        pressComma()
      } else if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        pressDigit(e.key)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, confirmOpen, closing, target, amounts, company, calcState])

  const pad2 = (n) => String(n).padStart(2, '0')
  const cashierName = `${get(userData, 'first_name', '')} ${get(userData, 'last_name', '')}`.trim()

  const fieldFontSize = (s) => (s.length > 9 ? 12.5 : 15)

  const renderField = (value, active) => {
    const display = formatAmountDisplay(value)
    const long = display.length > 9
    return (
      <Box className={`${classes.field} ${active ? classes.fieldActive : ''}`}>
        <span className={`${classes.fieldText} ${value === '' ? classes.fieldTextEmpty : ''}`} style={{ fontSize: fieldFontSize(display) }}>
          {display}
        </span>
        {!long && <span className={classes.fieldSuffix}>UZS</span>}
      </Box>
    )
  }

  const renderDiffPill = (f) => {
    if (f.empty) return <span className={`${classes.pill} ${classes.pillNeutral}`}>—</span>
    if (f.diff === 0)
      return (
        <span className={`${classes.pill} ${classes.pillOk}`}>
          <Check size={12} strokeWidth={3.2} /> 0
        </span>
      )
    return (
      <span className={`${classes.pill} ${f.diff > 0 ? classes.pillOver : classes.pillShort}`}>
        <AlertCircle size={12} />
        {f.diff > 0 ? '+' : '−'}
        {fmt(f.diff)}
      </span>
    )
  }

  const keys = [
    { t: 'digit', v: '1' },
    { t: 'digit', v: '2' },
    { t: 'digit', v: '3' },
    { t: 'back' },
    { t: 'digit', v: '4' },
    { t: 'digit', v: '5' },
    { t: 'digit', v: '6' },
    { t: 'op', v: '+' },
    { t: 'digit', v: '7' },
    { t: 'digit', v: '8' },
    { t: 'digit', v: '9' },
    { t: 'op', v: '-' },
    { t: 'comma' },
    { t: 'digit', v: '0' },
    { t: 'clear' },
    { t: 'eq' },
  ]

  return (
    <Box className={classes.screen}>
      <Box component='header' className={classes.header}>
        <Box className={classes.headerLeft}>
          <Box component='button' type='button' className={classes.backBtn} onClick={goBack} aria-label={t('close_shift.back_aria')}>
            <ArrowLeft size={16} strokeWidth={2.2} />
          </Box>
          <span className={classes.headerTitle}>{t('close_shift.title')}</span>
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
            <Typography className={classes.successTitle}>{t('close_shift.register_closed_title')}</Typography>
            <Typography className={classes.successSub}>
              {printError ? t('close_shift.returning_to_login') : t('close_shift.zreport_sent_returning')}
            </Typography>
          </Box>
        </Box>
      ) : (
        <LoadingContainer readyState={!operationDetailLoading}>
          <Box className={classes.body}>
            {/* LEFT: reconciliation ledger */}
            <Box className={classes.ledger}>
              <Box className={classes.thead}>
                <span>{t('close_shift.payment_method')}</span>
                <span style={{ textAlign: 'right' }}>{t('close_shift.expected')}</span>
                <span style={{ textAlign: 'right', paddingRight: 4 }}>{t('close_shift.fact')}</span>
                <span style={{ textAlign: 'right' }}>{t('close_shift.difference')}</span>
              </Box>
              <Box className={classes.ledgerRows}>
                {moneyFields.map((f) => {
                  const active = target === f.key
                  return (
                    <Box key={f.key} className={`${classes.row} ${active ? classes.rowActive : ''}`} onClick={() => switchTarget(f.key)}>
                      <span className={classes.cellLabel}>
                        <span className={`${classes.glyphWrap} ${active ? classes.glyphWrapActive : ''}`}>
                          {f.img ? <img src={f.img} alt='' className={classes.brandLogo} /> : <CashGlyph />}
                        </span>
                        {f.label}
                      </span>
                      <span className={classes.cellExpected}>{fmt(f.expected)}</span>
                      <span className={classes.cellRight}>{renderField(amounts[f.key], active)}</span>
                      <span className={classes.cellRight}>{renderDiffPill(f)}</span>
                    </Box>
                  )
                })}
                {autoRows.map((o) => (
                  <Box key={o.key} className={`${classes.row} ${classes.rowAuto}`}>
                    <span className={`${classes.cellLabel} ${classes.cellLabelAuto}`}>
                      <span className={classes.glyphWrap}>{o.img ? <img src={o.img} alt='' className={classes.brandLogo} /> : <CashlessGlyph />}</span>
                      {o.label}
                    </span>
                    <span className={`${classes.cellExpected} ${classes.cellExpectedAuto}`}>{fmt(o.amount)}</span>
                    <span className={classes.cellRight}>
                      <span className={classes.autoChip}>
                        <span className={classes.autoChipLabel}>
                          <Lock size={11} strokeWidth={2.4} color='#B6BAC4' /> {t('close_shift.auto_label')}
                        </span>
                        <span className={classes.autoChipVal}>{fmt(o.amount)}</span>
                      </span>
                    </span>
                    <span className={classes.cellRight}>
                      <span className={`${classes.pill} ${classes.pillNeutral}`}>—</span>
                    </span>
                  </Box>
                ))}
              </Box>
              <Box className={classes.tfoot}>
                <span className={classes.tfootLabel}>{t('close_shift.total')}</span>
                <span className={classes.tfootNum}>
                  {fmt(totalExpected)} <span className={classes.tfootUnit}>UZS</span>
                </span>
                <span className={classes.tfootNum} style={{ paddingRight: 11 }}>
                  {fmt(totalEntered)} <span className={classes.tfootUnit}>UZS</span>
                </span>
                <span className={classes.cellRight}>
                  {!anyEntered ? (
                    <span className={`${classes.pill} ${classes.tfootPillOk}`} style={{ color: '#9CA3AF' }}>
                      —
                    </span>
                  ) : totalDiff === 0 ? (
                    <span className={`${classes.pill} ${classes.tfootPillOk}`}>
                      <Check size={12} strokeWidth={3.2} /> 0
                    </span>
                  ) : (
                    <span className={`${classes.pill} ${classes.tfootPillBad}`}>
                      <AlertCircle size={12} />
                      {totalDiff > 0 ? '+' : '−'}
                      {fmt(totalDiff)}
                    </span>
                  )}
                </span>
              </Box>
            </Box>

            {/* RIGHT: numpad + cash destination + submit */}
            <Box className={classes.rightCol}>
              <Box className={classes.numpadCard}>
                {/* <Typography className={classes.numpadExpr}>{calcState.op ? `${fmt(calcState.total)} ${calcState.op}` : ' '}</Typography> */}
                <Box className={classes.keypadGrid}>
                  {keys.map((k) => {
                    if (k.t === 'digit') {
                      return (
                        <button
                          key={`d-${k.v}`}
                          type='button'
                          className={classes.keypadBtn}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pressDigit(k.v)}
                          disabled={closing}
                        >
                          {k.v}
                        </button>
                      )
                    }
                    if (k.t === 'back') {
                      return (
                        <button
                          key='back'
                          type='button'
                          className={`${classes.keypadBtn} ${classes.keypadBtnBack}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={backspaceKey}
                          aria-label={t('close_shift.delete_aria')}
                          disabled={closing}
                        >
                          <Delete size={20} />
                        </button>
                      )
                    }
                    if (k.t === 'op') {
                      const active = calcState.op === k.v
                      return (
                        <button
                          key={`op-${k.v}`}
                          type='button'
                          className={`${classes.keypadBtn} ${classes.keypadBtnOp} ${active ? classes.keypadBtnOpActive : ''}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pressOperator(k.v)}
                          aria-label={k.v === '+' ? t('close_shift.plus_aria') : t('close_shift.minus_aria')}
                          disabled={closing}
                        >
                          {k.v === '+' ? <Plus size={20} strokeWidth={2.6} /> : <Minus size={20} strokeWidth={2.6} />}
                        </button>
                      )
                    }
                    if (k.t === 'comma') {
                      return (
                        <button
                          key='comma'
                          type='button'
                          className={`${classes.keypadBtn} ${classes.keypadBtnComma}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={pressComma}
                          aria-label={t('close_shift.comma_aria')}
                          disabled={closing}
                        >
                          ,
                        </button>
                      )
                    }
                    if (k.t === 'clear') {
                      return (
                        <button
                          key='clear'
                          type='button'
                          className={`${classes.keypadBtn} ${classes.keypadBtnClear}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={clearKey}
                          aria-label={t('close_shift.clear_aria')}
                          disabled={closing}
                        >
                          C
                        </button>
                      )
                    }
                    return (
                      <button
                        key='eq'
                        type='button'
                        className={`${classes.keypadBtn} ${classes.keypadBtnEq}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={pressEquals}
                        aria-label={t('close_shift.equals_aria')}
                        disabled={closing || !calcState.op}
                      >
                        <Equal size={20} strokeWidth={2.6} />
                      </button>
                    )
                  })}
                </Box>
              </Box>

              <Typography className={classes.sectionLabel}>{t('close_shift.cash_destination_label')}</Typography>
              {options.map((o) => {
                const selected = company === o.id
                return (
                  <Box
                    key={o.id}
                    component='button'
                    type='button'
                    className={`${classes.optionRow} ${selected ? classes.optionRowSelected : ''}`}
                    onClick={() => pickOption(o.id)}
                  >
                    {selected ? (
                      <span className={classes.optionCheck}>
                        <Check size={11} strokeWidth={3.4} />
                      </span>
                    ) : (
                      <span className={classes.optionUncheck} />
                    )}
                    <Box className={classes.optionInfo}>
                      <span className={classes.optionTitle}>{o.title}</span>
                      <span className={classes.optionSub}>{o.sub}</span>
                    </Box>
                  </Box>
                )
              })}
              {company === '3' && (
                <Box className={`${classes.splitRow} ${target === 'closed' ? classes.splitRowActive : ''}`} onClick={() => switchTarget('closed')}>
                  <Box className={classes.optionInfo}>
                    <span className={classes.optionTitle}>{t('close_shift.split_keep_label')}</span>
                    <span className={classes.optionSub}>{t('close_shift.split_to_company_amount', { amount: fmt(toCompany) })}</span>
                  </Box>
                  {renderField(amounts.closed, target === 'closed')}
                </Box>
              )}

              <Box className={classes.spacer} />

              {checkdata && printError ? (
                <Box className={classes.retryCard}>
                  <Typography className={classes.errorText}>{printError}</Typography>
                  <Box display='flex' gap='10px'>
                    <button type='button' className={classes.retryBtn} onClick={() => handleAgentZReportPrint(checkdata)}>
                      {t('close_shift.retry_print')}
                    </button>
                    <button type='button' className={classes.skipPrintBtn} onClick={submitRegister} disabled={iscloseCashBoxRegister}>
                      {t('close_shift.finish_without_print')}
                    </button>
                  </Box>
                </Box>
              ) : (
                <>
                  {formError && <Typography className={classes.errorText}>{formError}</Typography>}
                  {mismatches.length > 0 && anyEntered && (
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#FDECEC',
                        border: '1px solid #F6C9C6',
                        borderRadius: 11,
                        padding: '10px 13px',
                      }}
                    >
                      <AlertCircle size={14} color={DANGER} />
                      <span style={{ flex: 1, fontSize: 11.5, fontWeight: 600, color: '#B02A24', lineHeight: 1.35 }}>
                        {mismatches[0].label}: {mismatches[0].text}
                      </span>
                    </Box>
                  )}
                  <button
                    type='button'
                    className={`${classes.submitBtn} ${!canSubmit || closing ? classes.submitBtnDisabled : ''}`}
                    onClick={handleSubmit}
                    disabled={closing}
                  >
                    {closing ? (
                      <>
                        {t('close_shift.closing_progress')} <CircularProgress size={18} sx={{ color: '#fff' }} />
                      </>
                    ) : (
                      <>
                        {t('close_shift.close_register_btn')} <ArrowRight size={18} strokeWidth={2.2} />
                      </>
                    )}
                  </button>
                </>
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
            <Typography className={classes.confirmTitle}>{t('close_shift.discrepancy_title')}</Typography>
            <Typography className={classes.confirmText}>{t('close_shift.discrepancy_desc')}</Typography>
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
                {t('close_shift.recheck_btn')}
              </button>
              <button type='button' className={classes.confirmGo} onClick={confirmClose}>
                {t('close_shift.close_anyway_btn')}
              </button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CloseShiftPage
