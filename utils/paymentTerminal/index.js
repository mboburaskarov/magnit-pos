import axios from 'axios'

/**
 * Bank payment terminals, driven from the till.
 *
 * A till has TWO pinpads side by side and each card scheme is charged on its
 * own one:
 *
 *   uzcard → arcus   a PAX pinpad on SmartVista, reached through the ARCUS 2
 *                    module installed on the till.
 *   humo   → rahmat  the "Rahmat POS" app on a Sunmi P3, Multicard acquiring,
 *                    reached over USB or the local network.
 *
 * Nothing about that reaches the cashier: they press Uzcard or Humo exactly as
 * they always did, and that press is what decides which box wakes up. The
 * mapping lives in PROVIDER_BY_SCHEME below and nowhere else, and every request
 * carries the resolved `provider` so the agent knows which driver to hand it
 * to. An agent that runs only one terminal can ignore the field and behave as
 * it did before — which is what makes a half-rolled-out estate work.
 *
 * The second difference is a REFUND. On Rahmat a reversal is addressed by the
 * original payment's order_id; on ARCUS it is addressed by the receipt number
 * the terminal printed, optionally with the authorisation code, which together
 * let the terminal find the operation in its own journal without the
 * customer's card. So a refund sends all of them and the agent's driver uses
 * what it needs.
 *
 * Until now a card sale was two disconnected acts: the cashier charged the card
 * on a standalone terminal and then typed the tender in here by hand. The sale
 * recorded an amount and nothing else — no RRN, no masked PAN, and no way to
 * refund the card on a return. This client drives the terminal instead, so one
 * amount is charged once and the result lands on the sale.
 *
 * Transport is the local magnit-device-agent, the only process on the till that
 * can open a COM port. Every call names the terminal it is for:
 *
 *   POST /payment-terminal/pay            { order_id, amount, scheme, provider }
 *   POST /payment-terminal/refund         { order_id, receipt_no, auth_code, amount, scheme, provider }
 *   POST /payment-terminal/reconciliation { scheme, provider }    — «Сверка итогов»
 *   POST /payment-terminal/cancel         { provider }            — reject what is running
 *   GET  /payment-terminal/operation?provider=…                   — poll the outcome
 *   GET  /payment-terminal/info?provider=…                        — is this one attached
 *
 * ── Two things that make this unlike utils/mertechDisplay ──
 *
 * 1. **Nothing here is fire-and-forget.** The QR display is a courtesy and its
 *    failures are swallowed; this is money, and a failure has to stop the sale
 *    because it means nobody knows whether the card was charged.
 *
 * 2. **Start, then poll.** A payment waits on a human finding their card and
 *    typing a PIN. Every call below returns in milliseconds and the caller
 *    polls `operation`, so the desktop shell's 15-second agent timeout is never
 *    in play and a reloaded POS can recover a charge it never saw the result of.
 */

// The same pair the POS already probes for the printer agent (see PosApp.jsx).
const AGENT_URLS = ['http://localhost:7788', 'http://127.0.0.1:7777']

// Every request here is a short one — starting an operation or asking after it,
// never waiting for the customer.
const TIMEOUT_MS = 5000

/** Poll interval while an operation is running. */
export const TERMINAL_POLL_INTERVAL_MS = 1000

/** The two drivers the agent can be asked for. */
export const TERMINAL_PROVIDER = {
  ARCUS: 'arcus',
  RAHMAT: 'rahmat',
}

export const TERMINAL_PROVIDERS = [TERMINAL_PROVIDER.ARCUS, TERMINAL_PROVIDER.RAHMAT]

/**
 * Which pinpad charges which scheme. The one place the arrangement is written
 * down: change it here and the payment screen, the returns flow, the shift
 * close and the settings panel all follow.
 */
export const PROVIDER_BY_SCHEME = {
  uzcard: TERMINAL_PROVIDER.ARCUS,
  humo: TERMINAL_PROVIDER.RAHMAT,
}

/** The tender button that a given pinpad serves — for labelling, not routing. */
export const SCHEME_BY_PROVIDER = {
  [TERMINAL_PROVIDER.ARCUS]: 'uzcard',
  [TERMINAL_PROVIDER.RAHMAT]: 'humo',
}

/** 'uzcard' | 'humo' → 'arcus' | 'rahmat'. Empty for anything else. */
export function providerForScheme(scheme) {
  return PROVIDER_BY_SCHEME[String(scheme || '').toLowerCase()] || ''
}

/**
 * Outcomes, as the agent reports them.
 *
 * DECLINED and FAILED are not the same thing and must never be collapsed.
 * Declined means the terminal answered and said no, so nothing was charged and
 * the cashier can simply try again. Failed means it never answered: the card
 * may well have been charged, and that needs a human, not a retry.
 */
export const TERMINAL_STATE = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
  FAILED: 'failed',
  // Not a state the agent reports: the till lost track of the operation it
  // started. See waitForTerminalOperation.
  LOST: 'lost',
}

// How many consecutive polls may fail to find OUR operation before the till
// stops waiting for it.
//
// Polling is otherwise unbounded on purpose — a payment waits on a person, and
// a minute of silence is a customer looking for their card, not a fault. What
// must be bounded is the case where the ANSWER stops making sense: the agent
// restarted and lost its slot, or it is reporting someone else's operation. The
// cashier would otherwise sit in front of a modal that can never resolve, with
// its cancel button disabled, and that happened on a real till.
const LOST_POLL_LIMIT = 20

// Remembers which listener answered last, so the common case is one request
// instead of a failed 7788 followed by a 7777 retry every time.
let preferredUrl = null

function orderedUrls() {
  if (!preferredUrl) return AGENT_URLS
  return [preferredUrl, ...AGENT_URLS.filter((u) => u !== preferredUrl)]
}

/**
 * The agent's own message, which is usually the terminal's own wording in
 * Russian, and is far more useful to a cashier than anything we could invent.
 */
function agentMessage(e) {
  return e?.response?.data?.message || e?.message || ''
}

async function request(method, path, body) {
  let lastError
  for (const base of orderedUrls()) {
    try {
      const { data } =
        method === 'get'
          ? await axios.get(`${base}${path}`, { timeout: TIMEOUT_MS })
          : await axios.post(`${base}${path}`, body ?? {}, { timeout: TIMEOUT_MS })
      preferredUrl = base
      return data
    } catch (e) {
      // A reply from the agent is an answer, not a transport failure: 409
      // (busy), 502 (no terminal) and 503 (switched off) all mean we found the
      // agent and it said no. Only keep probing when nobody answered at all.
      if (e?.response) throw e
      lastError = e
    }
  }
  throw lastError
}

/** Build a query string from the flags that are actually set. */
function query(params) {
  const pairs = Object.entries(params)
    .filter(([, v]) => v !== '' && v !== false && v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v === true ? 1 : v)}`)
  return pairs.length ? `?${pairs.join('&')}` : ''
}

/** Convert a sum to the tiyin the terminal protocol speaks (сум × 100). */
export function toTiyin(sum) {
  return Math.round(Number(sum || 0) * 100)
}

/** Convert the terminal's tiyin back to sums. */
export function fromTiyin(tiyin) {
  return Number(tiyin || 0) / 100
}

/**
 * Which driver an agent report describes.
 *
 * A dual-terminal agent names itself in `provider`. One from before the split
 * does not, and has to be recognised: ARCUS announces its transport, and the
 * only other thing that ever shipped is the serial Rahmat driver.
 */
export function providerOf(info) {
  if (!info) return ''
  if (info.provider) return String(info.provider).toLowerCase()
  if (info.transport === TERMINAL_PROVIDER.ARCUS) return TERMINAL_PROVIDER.ARCUS
  return info.detected ? TERMINAL_PROVIDER.RAHMAT : ''
}

/**
 * Start a card payment on the pinpad that serves this scheme. Resolves with
 * the pending operation; the caller polls. Rejects when the terminal could not
 * even be handed the request.
 */
export async function terminalPay({ orderId, amount, scheme = '', provider = '' }) {
  const data = await request('post', '/payment-terminal/pay', {
    order_id: orderId,
    amount: toTiyin(amount),
    // Which tender button the cashier pressed, 'uzcard' or 'humo'. ARCUS needs
    // it even once `provider` has picked the device, because the acquirer maps
    // the two schemes onto different ops.ini and cashreg.ini files and
    // therefore different installations.
    scheme,
    // Which of the two pinpads to charge on. Derived from `scheme` and sent
    // explicitly so the agent routes rather than guesses.
    provider: provider || providerForScheme(scheme),
  })
  return data?.operation || null
}

/**
 * Start a refund of an earlier payment.
 *
 * `provider` here is the one that took the ORIGINAL payment, not whatever the
 * cashier pressed on the return screen: a Humo charge can only be reversed on
 * the Rahmat box that took it, and a Uzcard one only on ARCUS.
 *
 * All four addressing fields are sent and the agent's driver takes what it
 * needs, because there is no single answer to "what identifies the operation
 * being reversed":
 *
 *   orderId    the ORIGINAL payment's id — what `refund_terminal` carries on
 *              the Rahmat protocol, which has no id of its own for a reversal.
 *   receiptNo  the receipt number the ARCUS terminal printed. «Отмена по
 *              номеру чека» is addressed by it, and it is the normal path.
 *   authCode   with the amount and the last four digits of the PAN, this lets
 *              the terminal find the operation in its journal and reverse it
 *              WITHOUT the customer's card — including on a later day, after
 *              the batch has been closed.
 *   amount     the sum to return. A «Возврат» performs a new operation for it.
 *
 * All of them come off the ERP's record of the original payment, which is why
 * the sale has to be loaded before it can be refunded.
 */
export async function terminalRefund({
  orderId,
  receiptNo = '',
  authCode = '',
  amount = 0,
  scheme = '',
  provider = '',
}) {
  const data = await request('post', '/payment-terminal/refund', {
    order_id: orderId,
    receipt_no: receiptNo,
    auth_code: authCode,
    amount: amount ? toTiyin(amount) : 0,
    scheme,
    provider: provider || providerForScheme(scheme),
  })
  return data?.operation || null
}

/**
 * Start the end-of-day settlement on one terminal. Polled like everything else.
 *
 * Both pinpads take money, so both have to be settled — the caller runs this
 * once per attached provider rather than once per shift. `scheme` narrows it
 * further on an ARCUS till configured with more than one acquirer profile; an
 * empty one settles that driver's default.
 */
export async function terminalReconciliation({ scheme = '', provider = '' } = {}) {
  const data = await request('post', '/payment-terminal/reconciliation', {
    scheme,
    provider: provider || providerForScheme(scheme),
  })
  return data?.operation || null
}

/**
 * Ask a terminal to abandon what it is doing.
 *
 * This does not decide the outcome: the terminal answers the cancelled
 * operation itself, and that answer is the payment's result. So the caller
 * keeps polling after calling this.
 */
export async function terminalCancel({ provider = '' } = {}) {
  try {
    await request('post', '/payment-terminal/cancel', { provider })
    return { ok: true, message: '' }
  } catch (e) {
    return { ok: false, message: agentMessage(e) }
  }
}

/** The running operation on one terminal, or the last finished one. */
export async function terminalOperation({ provider = '' } = {}) {
  const data = await request('get', `/payment-terminal/operation${query({ provider })}`, null)
  return data?.operation || null
}

/**
 * Whether this till has a given terminal at all.
 *
 * Resolves to the agent's report, or null when the agent itself is
 * unreachable. Both mean the same thing to the payment screen: for that
 * scheme, carry on exactly as before this feature existed, with the cashier
 * charging the card on a standalone terminal and typing the tender in.
 */
export async function terminalInfo({ probe = false, ping = false, provider = '' } = {}) {
  try {
    return await request('get', `/payment-terminal/info${query({ probe, ping, provider })}`, null)
  } catch {
    return null
  }
}

/**
 * Ask after ONE pinpad, and only believe an answer that is about it.
 *
 * An agent from before the split ignores ?provider= and answers with its
 * single driver's report whichever one is asked for. Taking that at face value
 * would invent a second pinpad and send Uzcard sales to a box that is not
 * there, so a detected terminal only counts for the provider it says it is.
 * A "nothing here" report is kept either way — its message and port list are
 * the diagnosis the settings panel shows.
 */
export async function terminalProviderInfo({ provider, probe = false, ping = false } = {}) {
  const info = await terminalInfo({ provider, probe, ping })
  if (info?.detected && providerOf(info) !== provider) return null
  return info
}

/**
 * Ask after both pinpads at once.
 *
 * Returns { arcus, rahmat }, each the agent's report or null. A till with only
 * one of them — which is every till until the second box is delivered — simply
 * has a null on the other side, and the scheme it serves keeps the old manual
 * flow while the other one goes through the terminal.
 */
export async function terminalProviders() {
  const reports = await Promise.all(
    TERMINAL_PROVIDERS.map((provider) => terminalProviderInfo({ provider })),
  )
  return Object.fromEntries(TERMINAL_PROVIDERS.map((provider, i) => [provider, reports[i]]))
}

/**
 * Poll until the operation finishes.
 *
 * `onTick` sees every intermediate state so the screen can show progress, and
 * `shouldStop` lets the caller abandon the wait (an unmounting modal) without
 * leaving a timer behind. Abandoning the WAIT does not abandon the payment —
 * the agent keeps the result, which is what makes recovery after a reload
 * possible.
 */
export async function waitForTerminalOperation({ operationId, provider = '', onTick, shouldStop } = {}) {
  let lost = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (shouldStop?.()) return null

    let operation = null
    try {
      operation = await terminalOperation({ provider })
    } catch (e) {
      // A momentary hiccup talking to the agent is not an outcome. Keep
      // polling: the terminal is still working, and giving up here would lose
      // a payment that is about to be approved.
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[payment-terminal] poll failed, retrying:', agentMessage(e))
      }
    }

    // A result for a DIFFERENT operation is not ours — it is the previous
    // sale's, still sitting in the agent's slot for this terminal.
    const isOurs = operation && (!operationId || operation.operation_id === operationId)
    if (isOurs) {
      lost = 0
      onTick?.(operation)
      if (operation.state && operation.state !== TERMINAL_STATE.PENDING) return operation
    } else if (++lost >= LOST_POLL_LIMIT) {
      // The agent cannot tell us what happened to an operation we started. The
      // card may well have been charged, so this is reported as an unknown
      // outcome and never as a decline — but it IS reported, because a modal
      // that waits for ever is how a till stops being a till.
      return { operation_id: operationId, state: TERMINAL_STATE.LOST }
    }

    await new Promise((resolve) => setTimeout(resolve, TERMINAL_POLL_INTERVAL_MS))
  }
}

/**
 * Shape an operation into the `terminal_payment` block the ERP stores against
 * the sale. Amounts go back to sums here, so nothing downstream has to
 * remember which unit a number is in.
 *
 * `scheme` and `provider` are passed in rather than read off the operation,
 * because they are what we ASKED for and the record of them is what lets a
 * later return reverse the charge on the same box. An agent that echoes them
 * back wins: its answer is the device's own word for what it did.
 */
export function terminalPaymentPayload(operation, { parentOrderId, scheme = '', provider = '' } = {}) {
  if (!operation) return null
  return {
    order_id: operation.order_id,
    parent_order_id: parentOrderId || '',
    // Which integration charged the card. An agent from before the second
    // driver sends nothing and was asked for nothing, and the ERP reads an
    // empty provider as rahmat — which is what such a till is.
    provider: operation.provider || provider || '',
    // The tender button this was charged under, kept so a return knows which
    // pinpad and which acquirer profile to reverse it on.
    scheme: operation.scheme || scheme || '',
    status: operation.state,
    amount: fromTiyin(operation.amount),
    rrn: operation.rrn || '',
    card_pan: operation.card_pan || '',
    // "The payment system as the terminal named the card": Rahmat answers in
    // `ps` (its QR methods only), ARCUS in card_type / application_label.
    ps: operation.ps || operation.card_type || '',
    desc_ru: operation.desc_ru || '',
    desc_uz: operation.desc_uz || '',
    transport: operation.transport || '',
    // ARCUS only, and not diagnostics: receipt_no is what a reversal is
    // addressed by and auth_code is what finds the operation when the customer
    // comes back without the card. The terminal printed them and this is the
    // only copy that reaches the ERP.
    response_code: operation.response_code || '',
    auth_code: operation.auth_code || '',
    receipt_no: operation.receipt_no || '',
    terminal_id: operation.terminal_id || '',
    response: operation.response ?? null,
  }
}
