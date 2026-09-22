import { get } from 'lodash'

export const EPOS_STATUS_PAYLOAD = {
  token: 'DXJFX32CN1296678504F2',
  method: 'checkStatus',
}

export const EPOS_TERMINAL_PAYLOAD = {
  token: 'DXJFX32CN1296678504F2',
  method: 'getStatus',
}

export const getEposTerminalId = (data) => {
  const isValid = (v) => {
  if (!v) return false;

  if (typeof v === 'string') {
    return v.trim() !== '';
  }

  if (typeof v === 'object') {
    return Object.keys(v).length > 0;
  }

  return false;
};

const zReportFilesSent = [
  get(data, 'message.Sender.ZReportFilesSent'),
  get(data, 'message.Sender.FullReceiptFilesSent'),
  get(data, 'message.Sender.TotalFilesSent')
].find(isValid);
  if (!zReportFilesSent || typeof zReportFilesSent !== 'object') {
    return null
  }

  const [terminalId] = Object.keys(zReportFilesSent)

  return terminalId || null
}

export const isAllowedTerminal = (terminalId, terminalIds = []) => {
  if (!terminalId) {
    return true
  }

  return terminalIds.includes(terminalId) || terminalIds.includes(Number(terminalId))
}

// EPOS rejects an `openZreport` call when the report is already open, but the
// wording of that rejection is not stable: older builds answered with the bare
// code `ERROR_ZREPORT_IS_ALREADY_OPEN`, current ones answer with a localized
// text ("... Ru: Z-отчёт уже открыт. Отобразите предупреждение либо
// игнорируйте.") that EPOS itself labels as a warning to show or ignore. In
// every variant the report IS open, so opening a shift / finishing a sale must
// go through instead of failing.
const ZREPORT_ALREADY_OPEN_PATTERNS = [
  /ZREPORT_IS_ALREADY_OPEN/i,
  /zreport[^.]*already\s*open/i,
  /z-?отч[её]т[^.]*уже\s+откр/i,
  /уже\s+откр[а-я]*[^.]*z-?отч/i,
  /zreport[^.]*allaqachon\s+ochi/i,
]

export const isZReportAlreadyOpen = (message) =>
  typeof message === 'string' && ZREPORT_ALREADY_OPEN_PATTERNS.some((pattern) => pattern.test(message))

// True when EPOS considers the Z-report open: it either just opened it, or it
// refused because the report was open all along.
export const isZReportOpenOk = (data) => get(data, 'error', true) == false || isZReportAlreadyOpen(get(data, 'message', ''))
