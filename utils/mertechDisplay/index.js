import axios from 'axios'

/**
 * Customer-facing Mertech SBP QR display.
 *
 * The POS mirrors whatever QR is on the cashier's screen onto the customer's
 * display, shows a tick when the payment lands, and blanks it again. That is
 * the whole contract — there is nothing to configure.
 *
 * Transport is the local magnit-device-agent, which owns the display's serial
 * port the same way it owns the receipt printer:
 *
 *   POST /qr-display/show   { text }   — render a QR
 *   POST /qr-display/paid              — render the payment-accepted tick
 *   POST /qr-display/clear             — blank the display
 *   GET  /qr-display/info              — which serial port was detected
 *
 * The agent auto-detects the display by USB vendor id, so a cashbox with the
 * hardware plugged in needs no setup and one without it simply never answers.
 * (This used to talk to Mertech's own driver on localhost:1234, which had to be
 * installed per machine and only exists for Windows and Linux.)
 *
 * ── Every call here is best effort ──
 * These functions never throw, never reject and are never awaited by the sale
 * flow. A missing, unplugged or broken display must not slow down or interrupt
 * a payment, so failures are swallowed on purpose and only logged in dev.
 */

// Same pair the POS already probes for the printer agent (see PosApp.jsx).
const AGENT_URLS = ['http://localhost:7788', 'http://127.0.0.1:7777']
const TIMEOUT_MS = 2500

// Remembers which listener answered last, so the common case is one request
// instead of a failed 7788 followed by a 7777 retry on every command.
let preferredUrl = null

function orderedUrls() {
  if (!preferredUrl) return AGENT_URLS
  return [preferredUrl, ...AGENT_URLS.filter((u) => u !== preferredUrl)]
}

function logFailure(what, e) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[qr-display] ${what} failed (ignored):`, e?.message || e)
  }
}

/** Try each agent URL in turn. Resolves with the response, or throws if none answered. */
async function post(path, body) {
  let lastError
  for (const base of orderedUrls()) {
    try {
      const res = await axios.post(`${base}${path}`, body ?? {}, { timeout: TIMEOUT_MS })
      preferredUrl = base
      return res.data
    } catch (e) {
      lastError = e
    }
  }
  throw lastError
}

/**
 * Dispatch a display command and forget about it.
 *
 * The try/catch is not redundant with the .catch(): post() is async so it
 * rejects rather than throws, but the argument expressions around it are
 * evaluated synchronously, and these run inside a React effect on the payment
 * path. Anything that escaped here would break the payment modal, so nothing
 * is allowed to escape.
 */
function fireAndForget(path, body, what) {
  try {
    post(path, body).catch((e) => logFailure(what, e))
  } catch (e) {
    logFailure(what, e)
  }
}

/**
 * Mirror a QR onto the customer display. Fire-and-forget by design: returns
 * immediately and swallows every failure.
 */
export function mertechShowQrOnDevice(qr) {
  if (!qr) return
  fireAndForget('/qr-display/show', { text: String(qr) }, 'show')
}

/** Blank the customer display. Fire-and-forget, same as above. */
export function mertechClearScreen() {
  fireAndForget('/qr-display/clear', {}, 'clear')
}

/**
 * Show the payment-accepted tick on the customer display. Fire-and-forget: the
 * customer has already paid by the time this runs, so a display that cannot be
 * reached changes nothing about the sale.
 *
 * The device holds the tick until something else is sent, so the caller decides
 * how long it stays up.
 */
export function mertechShowPaid() {
  fireAndForget('/qr-display/paid', {}, 'paid')
}

/**
 * Diagnostics for the devices settings screen — the one place that *does* want
 * to see the outcome. Resolves to the agent's report, or null if unreachable.
 */
export async function mertechDisplayInfo() {
  for (const base of orderedUrls()) {
    try {
      const { data } = await axios.get(`${base}/qr-display/info`, { timeout: TIMEOUT_MS })
      preferredUrl = base
      return data
    } catch (e) {
      logFailure('info', e)
    }
  }
  return null
}

/**
 * Settings-screen test button. Unlike the mirroring calls this one is awaited
 * and reports its outcome, so the technician setting a cashbox up can see
 * whether the display actually answered.
 */
export async function mertechTestQr(text) {
  try {
    const data = await post('/qr-display/show', { text: String(text) })
    return { ok: Boolean(data?.ok), message: data?.message || '' }
  } catch (e) {
    return { ok: false, message: e?.message || 'agent unreachable' }
  }
}

/** Settings-screen clear button — awaited counterpart of mertechClearScreen. */
export async function mertechTestClear() {
  try {
    const data = await post('/qr-display/clear', {})
    return { ok: Boolean(data?.ok), message: data?.message || '' }
  } catch (e) {
    return { ok: false, message: e?.message || 'agent unreachable' }
  }
}
