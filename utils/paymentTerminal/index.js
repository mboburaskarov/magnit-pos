import axios from 'axios'

/**
 * Bank payment terminal — the "Rahmat POS" app on a Sunmi P3, Multicard
 * acquiring, plugged into the till over USB.
 *
 * Until now a card sale was two disconnected acts: the cashier charged the card
 * on a standalone terminal and then typed the tender in here by hand. The sale
 * recorded an amount and nothing else — no RRN, no masked PAN, and no way to
 * refund the card on a return. This client drives the terminal instead, so one
 * amount is charged once and the result lands on the sale.
 *
 * Transport is the local magnit-device-agent, the only process on the till that
 * can open a COM port:
 *
 *   POST /payment-terminal/pay            { order_id, amount }  — charge a card
 *   POST /payment-terminal/refund         { order_id }          — refund an earlier payment
 *   POST /payment-terminal/reconciliation                       — «Сверка итогов»
 *   POST /payment-terminal/cancel                               — reject what is running
 *   GET  /payment-terminal/operation                            — poll the outcome
 *   GET  /payment-terminal/info                                 — which port was detected
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
}

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

/** Convert a sum to the tiyin the terminal protocol speaks (сум × 100). */
export function toTiyin(sum) {
  return Math.round(Number(sum || 0) * 100)
}

/** Convert the terminal's tiyin back to sums. */
export function fromTiyin(tiyin) {
  return Number(tiyin || 0) / 100
}

/**
 * Start a card payment. Resolves with the pending operation; the caller polls.
 * Rejects when the terminal could not even be handed the request.
 */
export async function terminalPay({ orderId, amount }) {
  const data = await request('post', '/payment-terminal/pay', {
    order_id: orderId,
    amount: toTiyin(amount),
  })
  return data?.operation || null
}

/**
 * Start a refund of an earlier payment. orderId is the ORIGINAL payment's id —
 * it is the only thing that tells the acquirer which transaction to reverse —
 * and the customer has to present the same card at the terminal.
 */
export async function terminalRefund({ orderId }) {
  const data = await request('post', '/payment-terminal/refund', { order_id: orderId })
  return data?.operation || null
}

/** Start the end-of-day settlement. Polled like everything else. */
export async function terminalReconciliation() {
  const data = await request('post', '/payment-terminal/reconciliation', {})
  return data?.operation || null
}

/**
 * Ask the terminal to abandon what it is doing.
 *
 * This does not decide the outcome: the terminal answers the cancelled
 * operation itself, and that answer is the payment's result. So the caller
 * keeps polling after calling this.
 */
export async function terminalCancel() {
  try {
    await request('post', '/payment-terminal/cancel', {})
    return { ok: true, message: '' }
  } catch (e) {
    return { ok: false, message: agentMessage(e) }
  }
}

/** The running operation, or the last finished one. */
export async function terminalOperation() {
  const data = await request('get', '/payment-terminal/operation', null)
  return data?.operation || null
}

/**
 * Whether this till has a terminal at all.
 *
 * Resolves to the agent's report, or null when the agent itself is
 * unreachable. Both mean the same thing to the payment screen: carry on
 * exactly as before this feature existed, with the cashier charging the card
 * on a standalone terminal and typing the tender in.
 */
export async function terminalInfo({ probe = false } = {}) {
  try {
    return await request('get', `/payment-terminal/info${probe ? '?probe=1' : ''}`, null)
  } catch {
    return null
  }
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
export async function waitForTerminalOperation({ operationId, onTick, shouldStop } = {}) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (shouldStop?.()) return null

    let operation = null
    try {
      operation = await terminalOperation()
    } catch (e) {
      // A momentary hiccup talking to the agent is not an outcome. Keep
      // polling: the terminal is still working, and giving up here would lose
      // a payment that is about to be approved.
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[payment-terminal] poll failed, retrying:', agentMessage(e))
      }
    }

    if (operation) {
      // A result for a DIFFERENT operation is not ours — it is the previous
      // sale's, still sitting in the agent's single slot.
      const isOurs = !operationId || operation.operation_id === operationId
      if (isOurs) {
        onTick?.(operation)
        if (operation.state && operation.state !== TERMINAL_STATE.PENDING) return operation
      }
    }

    await new Promise((resolve) => setTimeout(resolve, TERMINAL_POLL_INTERVAL_MS))
  }
}

/**
 * Shape an operation into the `terminal_payment` block the ERP stores against
 * the sale. Amounts go back to sums here, so nothing downstream has to
 * remember which unit a number is in.
 */
export function terminalPaymentPayload(operation, { parentOrderId } = {}) {
  if (!operation) return null
  return {
    order_id: operation.order_id,
    parent_order_id: parentOrderId || '',
    status: operation.state,
    amount: fromTiyin(operation.amount),
    rrn: operation.rrn || '',
    card_pan: operation.card_pan || '',
    ps: operation.ps || '',
    desc_ru: operation.desc_ru || '',
    desc_uz: operation.desc_uz || '',
    transport: operation.transport || '',
    response: operation.response ?? null,
  }
}
