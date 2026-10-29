// Renders a receipt template (an ordered list of blocks, edited in the admin
// panel at /settings/receipts and stored by the CRM in receipt_templates) into
// the print agent's text/tag protocol: [BOLD_START]/[BOLD_END], [QR:data],
// [HEX:...] and [CUT].
//
// This file is kept byte-identical in three places so the admin's preview is
// exactly what a till prints — change all three together:
//   magnit-management  src/pages/settings/receipts/receiptRender.js
//   magnit-pos         utils/receiptTemplate/render.js
//   magnit-pos-desktop utils/receiptTemplate/render.js
// Block types and their fields are documented in the CRM's
// docs/summaries/receipts.md.
//
// Pictures: every enabled `logo` block prints a raster. One without `image`
// prints the built-in Magnit logo (ctx.logoHex); one with `image` prints that
// picture, rasterised by the caller and passed in ctx.images[block.id]. The CRM
// only accepts `image` on logo blocks, so promo pictures are logo blocks too.

import dayjs from 'dayjs'

export const RECEIPT_WIDTH = 40

const DEFAULT_STORE_NAME = 'MAGNIT PREMIUM'
const DEFAULT_STORE_ADDRESS = "Shayxontohur\nOlmazor MFY, O'qchi ko'chasi 4, 4A-UY"
const DEFAULT_STIR = '305445201'

export function formatMoney(val) {
  const num = Number(val || 0)
  return num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '.')
}

export function normalizeUzbek(s) {
  return (s || '')
    .replace(/oʻ/g, "o'")
    .replace(/Oʻ/g, "O'")
    .replace(/o‘/g, "o'")
    .replace(/O‘/g, "O'")
    .replace(/o`/g, "o'")
    .replace(/O`/g, "O'")
    .replace(/gʻ/g, "g'")
    .replace(/Gʻ/g, "G'")
    .replace(/g‘/g, "g'")
    .replace(/G‘/g, "G'")
    .replace(/g`/g, "g'")
    .replace(/G`/g, "G'")
    .replace(/ʻ/g, "'")
    .replace(/‘/g, "'")
    .replace(/`/g, "'")
    .replace(/ў/g, 'у')
    .replace(/Ў/g, 'У')
    .replace(/қ/g, 'к')
    .replace(/Қ/g, 'К')
    .replace(/ғ/g, 'г')
    .replace(/Ғ/g, 'Г')
    .replace(/ҳ/g, 'х')
    .replace(/Ҳ/g, 'Х')
}

function centerText(text, width = RECEIPT_WIDTH) {
  const norm = normalizeUzbek(text)
  if (norm.length >= width) return norm.substring(0, width)
  const left = Math.floor((width - norm.length) / 2)
  const right = width - norm.length - left
  return ' '.repeat(left) + norm + ' '.repeat(right)
}

function rightText(text, width = RECEIPT_WIDTH) {
  const norm = normalizeUzbek(text)
  if (norm.length >= width) return norm.substring(0, width)
  return ' '.repeat(width - norm.length) + norm
}

function leftRight(left, right, width = RECEIPT_WIDTH, fillChar = ' ') {
  const nLeft = normalizeUzbek(left)
  const nRight = normalizeUzbek(right)
  const total = nLeft.length + nRight.length
  if (total <= width) {
    return nLeft + fillChar.repeat(width - total) + nRight
  }
  const spaces = Math.max(0, width - nRight.length)
  return nLeft + '\n' + fillChar.repeat(spaces) + nRight
}

function wrapText(text, width = RECEIPT_WIDTH) {
  const norm = normalizeUzbek(text)
  const words = norm.split(/\s+/)
  if (words.length === 0) return ['']

  const lines = []
  let currentLine = words[0]
  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    if (currentLine.length + 1 + word.length <= width) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

// {{name}} → values[name]; an unknown name prints as written so a typo shows
// up in the preview instead of silently vanishing.
export function fillPlaceholders(text, values) {
  return String(text ?? '').replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (match, name) =>
    values[name] === undefined || values[name] === null ? match : String(values[name])
  )
}

const label = (block, key, fallback = '') => block.labels?.[key] ?? fallback
const option = (block, key, fallback = false) => block.options?.[key] ?? fallback
const fillOf = (block, fallback = '.') => (block.fill === undefined || block.fill === '' ? fallback : block.fill)

// Sale / return receipt data, from the payload the POS already assembles
// (see PosApp handleLocalPrint).
export function buildSaleContext(req = {}, storeInfo = {}) {
  const dateObj = req.date ? dayjs(req.date) : dayjs()
  const items = req.items || []
  // Item VAT is 12/112 of qty*price — what the receipt has always printed.
  const vatTotal = items.reduce((acc, item) => acc + (Number(item.qty || 0) * Number(item.price || 0) * 12) / 112, 0)
  const isCardPayment = req.paymentType === 'card' || req.paymentType === 'cardless'

  return {
    req,
    items,
    logoHex: storeInfo.logoHex || null,
    images: storeInfo.images || {},
    values: {
      store_name: storeInfo.name || DEFAULT_STORE_NAME,
      store_address: storeInfo.address || DEFAULT_STORE_ADDRESS,
      stir: storeInfo.stir || req.fiscalStir || DEFAULT_STIR,
      cashier: req.cashier || 'Kassir',
      sale_number: req.saleId ?? '',
      kassa: req.kassaNumber || '-',
      date: dateObj.format('DD.MM.YY'),
      time: dateObj.format('HH:mm:ss'),
      shift: req.shiftNumber || '1',
      positions: items.length,
      total: formatMoney(req.totalAmount),
      vat_total: formatMoney(vatTotal),
      discount: formatMoney(req.discount),
      paid: formatMoney(req.paidAmount),
      change: formatMoney(req.changeAmount),
      customer: req.customer || '',
      fiscal_number: req.fiscalNumber || '',
      fiscal_sign: req.fiscalSign || '',
      fiscal_date: req.fiscalDate || '',
    },
    conditions: {
      duplicate: !!req.isDuplicate,
      discount: req.discount > 0,
      vat_total: vatTotal > 0,
      change: req.changeAmount > 0,
      corporate_card: isCardPayment && !!req.isCorporateCard,
      customer: !!req.customer,
    },
  }
}

// Z-report data, from the enriched zrepo card-shift-details assembles.
export function buildZReportContext(zrepo = {}, storeInfo = {}) {
  const totalDiff = Number(zrepo?.totalDiff || 0)
  const sign = totalDiff > 0 ? '+' : totalDiff < 0 ? '-' : ''
  const now = dayjs()
  return {
    zrepo: zrepo || {},
    logoHex: storeInfo?.logoHex || null,
    images: storeInfo?.images || {},
    values: {
      store_name: storeInfo?.name || DEFAULT_STORE_NAME,
      store_address: storeInfo?.address || DEFAULT_STORE_ADDRESS,
      kassa: storeInfo?.kassaNumber ? String(storeInfo.kassaNumber) : '',
      cashier: storeInfo?.cashier || '',
      date: now.format('DD.MM.YYYY'),
      open_time: `${zrepo?.openTime || '-'}`,
      close_time: `${zrepo?.closeTime || '-'}`,
      total_expected: formatMoney(zrepo?.totalExpected),
      total_entered: formatMoney(zrepo?.totalEntered),
      total_diff: `${sign}${formatMoney(Math.abs(totalDiff))}`,
      kept_in_register: formatMoney(zrepo?.keptInRegister),
      given_to_company: formatMoney(zrepo?.givenToCompany),
      now: now.format('DD.MM.YYYY HH:mm:ss'),
    },
    conditions: {
      kassa: !!storeInfo?.kassaNumber,
      cashier: !!storeInfo?.cashier,
    },
  }
}

const PAYMENT_KEYS = ['cash', 'click', 'payme', 'uzum']

function renderItems(block, ctx, add) {
  const fill = fillOf(block)
  ctx.items.forEach((item, index) => {
    const name = item.name || item.barcode || label(block, 'default_name', 'Tovar')
    wrapText(option(block, 'show_index', true) ? `${index + 1}. ${name}` : name).forEach((l) => add(l))

    if (option(block, 'show_mxik', true) && item.mxik) {
      add(leftRight(label(block, 'mxik', '  MXIK'), item.mxik, RECEIPT_WIDTH, fill))
    }

    const qtyStr = Number(item.qty).toLocaleString('ru-RU', { minimumFractionDigits: 3 }).replace(/,/g, '.')
    add(leftRight(`  ${qtyStr}*${formatMoney(item.price)}`, formatMoney(item.total), RECEIPT_WIDTH, fill))

    if (option(block, 'show_vat', true)) {
      const itemVat = (Number(item.qty || 0) * Number(item.price || 0) * 12) / 112
      add(leftRight(label(block, 'vat', '  sh.j. QQS 12%'), formatMoney(itemVat), RECEIPT_WIDTH, fill))
    }
  })
}

function renderPayment(block, ctx, add) {
  const { req } = ctx
  add(normalizeUzbek(block.title ?? 'Tolov'))
  let payLabel = label(block, 'mixed', 'Aralash')
  if (req.paymentType === 'card' || req.paymentType === 'cardless') {
    payLabel = label(block, 'card', 'Karta')
    const scheme = req.cardScheme === 'humo' ? 'Humo' : req.cardScheme === 'uzcard' ? 'UzCard' : ''
    if (scheme && option(block, 'show_card_scheme', true)) payLabel += ` (${scheme})`
  } else if (PAYMENT_KEYS.includes(req.paymentType)) {
    payLabel = label(block, req.paymentType, req.paymentType)
  }
  add(leftRight(`  ${payLabel}`, '=' + ctx.values.paid, RECEIPT_WIDTH, fillOf(block)))
}

function renderFiscal(block, ctx, add) {
  const fill = fillOf(block)
  const v = ctx.values
  add(centerText(block.title ?? "====== Fiskal Ma'lumotlar ======"))
  add(leftRight(label(block, 'stir', 'STIR'), v.stir, RECEIPT_WIDTH, fill))
  if (v.fiscal_number) add(leftRight(label(block, 'fiscal_number', 'FM raqami'), v.fiscal_number, RECEIPT_WIDTH, fill))
  if (v.fiscal_sign) add(leftRight(label(block, 'fiscal_sign', 'Fiskal belgi'), v.fiscal_sign, RECEIPT_WIDTH, fill))
  if (v.fiscal_date) add(leftRight(label(block, 'fiscal_date', 'Fiskal sana'), v.fiscal_date, RECEIPT_WIDTH, fill))
  add(leftRight(label(block, 'check_number', 'Check raqami'), String(v.sale_number), RECEIPT_WIDTH, fill))
}

function renderZPayments(block, ctx, add) {
  const fill = fillOf(block)
  const separator = (block.char || '-').repeat(RECEIPT_WIDTH)
  ;(ctx.zrepo.moneyRows || []).forEach((row) => {
    add(leftRight(row.label, formatMoney(row.expected), RECEIPT_WIDTH, fill))
    add(leftRight(label(block, 'fact', '  Fakt'), formatMoney(row.fact), RECEIPT_WIDTH, fill))
    const sign = row.diff > 0 ? '+' : row.diff < 0 ? '-' : ''
    const diffLabel =
      row.diff > 0
        ? label(block, 'diff_surplus', '  Farq (ortiqcha)')
        : row.diff < 0
          ? label(block, 'diff_shortage', '  Farq (kamomad)')
          : label(block, 'diff', '  Farq')
    add(leftRight(diffLabel, `${sign}${formatMoney(Math.abs(row.diff))}`, RECEIPT_WIDTH, fill))
    add(separator)
  })
  ;(ctx.zrepo.autoRows || []).forEach((row) => {
    add(leftRight(`${row.label}${label(block, 'auto_suffix', ' (avto)')}`, formatMoney(row.amount), RECEIPT_WIDTH, fill))
  })
}

// The fiscal module reports amounts in tiyin, hence /100.
function zFiscalValue(val, divide = true) {
  if (val === undefined || val === null || val === '-') return '-'
  const num = Number(val)
  if (isNaN(num)) return String(val)
  return (divide ? num / 100 : num).toFixed(2)
}

function renderZFiscal(block, ctx, add) {
  const fill = fillOf(block)
  const z = ctx.zrepo
  const row = (key, fallback, value) => add(leftRight(label(block, key, fallback), value, RECEIPT_WIDTH, fill))
  const sales = Number(z.totalSaleCash || 0) + Number(z.totalSaleCard || 0)
  const returns = Number(z.totalRefundCash || 0) + Number(z.totalRefundCard || 0)

  add(centerText(block.title ?? "Fiskal Ma'lumotlar"))
  row('terminal_id', 'ID terminali', `#${z.terminalID || ''}`)
  row('sale_count', 'Cheklar soni', `${z.totalSaleCount || ''}`)
  row('fiscal_total', 'Fiskal summa (jami)', zFiscalValue(sales - returns))
  row('sale_card', '  shu j. karta', zFiscalValue(z.totalSaleCard))
  row('sale_cash', '  shu j. naqd', zFiscalValue(z.totalSaleCash))
  row('sale_vat', '  shu j. QQS', zFiscalValue(z.totalSaleVAT))
  row('refund_count', 'Qaytarishlar soni', zFiscalValue(z.totalRefundCount))
  row('refund_cash', '  qaytarish naqd', zFiscalValue(z.totalRefundCash))
  row('refund_card', '  qaytarish karta', zFiscalValue(z.totalRefundCard))
  row('refund_vat', '  qaytarish QQS', zFiscalValue(z.totalRefundVAT))
}

function alignLine(line, align) {
  if (align === 'center') return centerText(line)
  if (align === 'right') return rightText(line)
  return normalizeUzbek(line)
}

function renderBlock(block, ctx, add) {
  const fill = (text) => fillPlaceholders(text, ctx.values)

  // The logo's fallback text carries its own bold; everything else wraps here.
  const bold = block.bold && block.type !== 'logo'
  if (bold) add('[BOLD_START]')

  switch (block.type) {
    case 'text':
      fill(block.text).split('\n').forEach((l) => add(alignLine(l, block.align)))
      break
    case 'pair':
      add(leftRight(fill(block.left), fill(block.right), RECEIPT_WIDTH, fillOf(block, ' ')))
      break
    case 'separator':
      add((block.char || '-').repeat(RECEIPT_WIDTH))
      break
    case 'blank':
      add('')
      break
    case 'logo': {
      const raster = block.image ? ctx.images?.[block.id] : ctx.logoHex
      if (raster) {
        add(raster)
        break
      }
      // No picture to print: the fallback text, if the block has any. A promo
      // picture usually has none, and then prints nothing rather than a blank.
      const text = fill(block.text ?? '{{store_name}}')
      if (!text.trim()) break
      if (block.bold) add('[BOLD_START]')
      text.split('\n').forEach((l) => add(alignLine(l, block.align || 'center')))
      if (block.bold) add('[BOLD_END]')
      break
    }
    case 'items':
      renderItems(block, ctx, add)
      break
    case 'payment':
      renderPayment(block, ctx, add)
      break
    case 'fiscal':
      renderFiscal(block, ctx, add)
      break
    case 'qr':
      if (ctx.req?.qrData) add(`[QR:${ctx.req.qrData}]`)
      break
    case 'z_payments':
      renderZPayments(block, ctx, add)
      break
    case 'z_fiscal':
      renderZFiscal(block, ctx, add)
      break
    default:
      break
  }

  if (bold) add('[BOLD_END]')
}

/**
 * The printed lines grouped by the block that produced them, skipping blocks
 * that are off or whose condition does not hold. The editor maps a printed
 * line back to its block with this; renderReceipt is just its flat form.
 *
 * @returns {{id: string, lines: string[]}[]}
 */
export function renderReceiptBlocks(layout, ctx) {
  const segments = []
  for (const block of layout?.blocks || []) {
    if (!block.enabled) continue
    if (block.show_if && !ctx.conditions[block.show_if]) continue
    const lines = []
    renderBlock(block, ctx, (str) => String(str).split('\n').forEach((l) => lines.push(l)))
    segments.push({ id: block.id, lines })
  }
  return segments
}

/**
 * @param {{blocks: object[]}} layout  a template layout
 * @param {object} ctx                 buildSaleContext() / buildZReportContext()
 * @returns {string[]}                 lines for the print agent's /print/raw-template
 */
export function renderReceipt(layout, ctx) {
  const lines = []
  renderReceiptBlocks(layout, ctx).forEach((segment) => lines.push(...segment.lines))
  lines.push('[CUT]')
  return lines
}

// The enabled logo blocks of a layout — the built-in logo and every uploaded
// picture — in print order.
export function findImageBlocks(layout) {
  return (layout?.blocks || []).filter((b) => b.type === 'logo' && b.enabled)
}
