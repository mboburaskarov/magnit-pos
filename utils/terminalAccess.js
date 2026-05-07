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

