import axios from 'axios'

/**
 * Mertech SBP QR display driver client.
 *
 * The Mertech driver (https://docs.mertech.ru/sbp/protocol/REST_API.html) runs
 * on the cashbox machine as a service, talks to the customer-facing QR display
 * over Serial/BLE and exposes a local REST API (default http://localhost:1234).
 *
 * The POS only mirrors the Munis payment QR onto that display:
 *   POST /showInfoQR      { infoQR }   — render an arbitrary QR string
 *   POST /displayStatus   { status }   — show a transaction status screen
 *   POST /clearScreen                  — clear the display
 *   GET  /version                      — health check
 *
 * All display commands are best effort: a sale must never depend on the
 * device being reachable.
 */

const SETTINGS_KEY = 'mertech_display_settings'

export const MERTECH_DEFAULT_SETTINGS = {
  enabled: false, // master switch: mirror Munis QR to the customer display
  baseUrl: 'http://localhost:1234',
  timeoutMs: 3000,
  showStatusOnDevice: true, // show the "paid" status screen after payment
  // /displayStatus codes are not enumerated in the driver docs; 3 matches the
  // documented example, so it is kept configurable per driver version.
  paidStatusCode: 3,
  clearAfterPaidMs: 3000, // how long the "paid" status stays before clearing
  corsFallback: true, // resend as opaque (no-cors) if the driver has no CORS headers
}

export function getMertechSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null')
    return { ...MERTECH_DEFAULT_SETTINGS, ...(saved || {}) }
  } catch {
    return { ...MERTECH_DEFAULT_SETTINGS }
  }
}

export function saveMertechSettings(patch) {
  const merged = { ...getMertechSettings(), ...(patch || {}) }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
  return merged
}

function commandUrl(settings, path) {
  const base = String(settings.baseUrl || MERTECH_DEFAULT_SETTINGS.baseUrl).replace(/\/+$/, '')
  return `${base}${path}`
}

async function postCommand(settings, path, body) {
  const url = commandUrl(settings, path)
  try {
    const res = await axios.post(url, body ?? {}, { timeout: settings.timeoutMs })
    return res.data
  } catch (e) {
    // No e.response = the browser never got a readable answer. A driver without
    // CORS headers is indistinguishable from a dead one here, and display
    // commands don't need a readable response — resend opaque (text/plain body
    // avoids the preflight the driver can't answer).
    if (settings.corsFallback && !e.response) {
      await fetch(url, { method: 'POST', mode: 'no-cors', body: JSON.stringify(body ?? {}) })
      return null
    }
    throw e
  }
}

/** Send a raw driver command with the saved settings (optionally overridden, e.g. an unsaved settings form). Throws on failure. */
export function mertechCommand(path, body, overrides) {
  const settings = { ...getMertechSettings(), ...(overrides || {}) }
  return postCommand(settings, path, body)
}

/** @returns {ok, version, opaque?, error?} — opaque means the driver responded but CORS hides the body. */
export async function mertechTestConnection(overrides) {
  const settings = { ...getMertechSettings(), ...(overrides || {}) }
  const url = commandUrl(settings, '/version')
  try {
    const res = await axios.get(url, { timeout: settings.timeoutMs })
    return { ok: true, version: res?.data?.version || '' }
  } catch (e) {
    if (settings.corsFallback && !e.response) {
      try {
        await fetch(url, { mode: 'no-cors' })
        return { ok: true, version: '', opaque: true }
      } catch {
        // fall through to the failure result
      }
    }
    return { ok: false, error: e?.message || 'unreachable' }
  }
}

/** Mirror the Munis payment QR onto the customer display. @returns whether a command was dispatched. */
export function mertechShowQrOnDevice(qr) {
  const settings = getMertechSettings()
  if (!qr || !settings.enabled) return false
  postCommand(settings, '/showInfoQR', { infoQR: String(qr) }).catch(() => {})
  return true
}

/** Payment landed: show the "paid" status screen, then clear after the configured delay. */
export function mertechShowPaymentResult() {
  const settings = getMertechSettings()
  if (!settings.enabled) return false
  const clear = () => postCommand(settings, '/clearScreen', {}).catch(() => {})
  if (!settings.showStatusOnDevice) {
    clear()
    return true
  }
  postCommand(settings, '/displayStatus', { status: Number(settings.paidStatusCode) })
    .catch(() => {})
    .finally(() => setTimeout(clear, Math.max(0, Number(settings.clearAfterPaidMs) || 0)))
  return true
}

/** Clear the customer display (payment cancelled / modal closed). */
export function mertechClearScreen() {
  const settings = getMertechSettings()
  if (!settings.enabled) return false
  postCommand(settings, '/clearScreen', {}).catch(() => {})
  return true
}
