// Receipt rows for a cart that carries N+X promotion lines (Акция N+X).
//
// A line with a give-away is split in two: what the customer paid full price for
// keeps the line's number («1.»), and the free packs become a sub-row under the
// line that earned them («1.1»), priced at what they actually cost — 0.00 when the
// gift is 100% off. Every row then adds up on its own, so the paper agrees with
// the «JAMI tolovga» line instead of showing the full price beside a discount
// that only appears in the footer.

const toNumber = (value) => Number(value) || 0
const round2 = (value) => Math.round(value * 100) / 100

const cartQty = (line) => (line.unit_per_pack === 1000
  ? ((line.quantity || 0) * 1000 + (line.unit_quantity || 0)) / 1000
  : Number(line.quantity || 1))

const baseRow = (line, qty, price, total) => ({
  name: line.name,
  mxik: line.mxik || line.code || '',
  qty,
  price,
  total,
  vatPercent: line.vat_percent,
  vatAmount: line.vat_amount || 0,
})

// Packs of this line that were given away. nx_free_quantity is what the backend
// reports; the money is the fallback for a read that predates the field, assuming
// the common 100% gift (a partial-percent gift without the field would round to
// the wrong pack count, which is why the field is preferred).
const freePacks = (line, qty) => {
  const nx = toNumber(line.nx_discount_amount)
  if (nx <= 0) return 0
  const reported = toNumber(line.nx_free_quantity)
  if (reported > 0) return Math.min(reported, qty)
  const unit = toNumber(line.unit_price)
  return unit > 0 ? Math.min(qty, Math.max(1, Math.round(nx / unit))) : 0
}

// Within one promotion the lines that earn the gift come first and the gift
// lines after them, whatever order the cashier scanned in. The sort is stable, so
// lines of the same kind keep their screen order.
const roleRank = (line) => (line.nx_role === 'gift' ? 1 : 0)

function orderPromoGroups(lines) {
  const first = new Map()
  lines.forEach((line, index) => {
    if (line.nx_promo_id && !first.has(line.nx_promo_id)) first.set(line.nx_promo_id, index)
  })
  return lines
    .map((line, index) => ({ line, index }))
    .sort((a, b) => {
      const ga = a.line.nx_promo_id ? first.get(a.line.nx_promo_id) : a.index
      const gb = b.line.nx_promo_id ? first.get(b.line.nx_promo_id) : b.index
      if (ga !== gb) return ga - gb
      if (a.line.nx_promo_id && a.line.nx_promo_id === b.line.nx_promo_id) {
        return roleRank(a.line) - roleRank(b.line) || a.index - b.index
      }
      return a.index - b.index
    })
    .map(({ line }) => line)
}

/**
 * @param {object[]} cartLines cart lines already in screen order
 * @returns {object[]} receipt rows; `label` is the printed number («1», «1.1»)
 */
export function buildReceiptItems(cartLines) {
  const rows = []
  let position = 0
  // number of the row the next gift attaches to, per promotion
  const anchor = new Map()
  const subCount = new Map()

  orderPromoGroups(cartLines).forEach((line) => {
    const qty = cartQty(line)
    const unit = toNumber(line.unit_price)
    const free = freePacks(line, qty)

    if (free <= 0) {
      position += 1
      rows.push({ ...baseRow(line, qty, unit, toNumber(line.total_price)), label: String(position) })
      if (line.nx_promo_id && line.nx_role !== 'gift') anchor.set(line.nx_promo_id, position)
      return
    }

    const paidQty = qty - free
    const giftUnit = round2(unit - toNumber(line.nx_discount_amount) / free)
    const giftTotal = round2(free * giftUnit)

    // the number the free packs hang under: the line that earned them
    let parent = anchor.get(line.nx_promo_id)
    if (paidQty > 0) {
      position += 1
      rows.push({ ...baseRow(line, paidQty, unit, round2(paidQty * unit)), label: String(position) })
      if (line.nx_role !== 'gift') {
        // a line that earns its own gift hangs it under its own paid row
        anchor.set(line.nx_promo_id, position)
        parent = position
      } else if (parent === undefined) {
        parent = position
      }
    } else if (parent === undefined) {
      // a gift with no earning line on the receipt: it still needs a number of its own
      position += 1
      parent = position
    }

    const key = `${line.nx_promo_id}|${parent}`
    const sub = (subCount.get(key) || 0) + 1
    subCount.set(key, sub)
    rows.push({ ...baseRow(line, free, giftUnit, giftTotal), label: `${parent}.${sub}` })
  })

  return rows
}
