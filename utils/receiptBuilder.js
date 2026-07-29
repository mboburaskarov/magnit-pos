import dayjs from 'dayjs'

const WIDTH = 48

export function formatMoneyWithoutSuffix(val) {
  const num = Number(val || 0)
  return num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '.')
}

export function formatMoney(val) {
  return formatMoneyWithoutSuffix(val)
}

function normalizeUzbek(s) {
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

function centerText(text, width = WIDTH) {
  const norm = normalizeUzbek(text)
  if (norm.length >= width) return norm.substring(0, width)
  const left = Math.floor((width - norm.length) / 2)
  const right = width - norm.length - left
  return ' '.repeat(left) + norm + ' '.repeat(right)
}

function leftRight(left, right, width = WIDTH, fillChar = ' ') {
  const nLeft = normalizeUzbek(left)
  const nRight = normalizeUzbek(right)
  const total = nLeft.length + nRight.length
  if (total <= width) {
    return nLeft + fillChar.repeat(width - total) + nRight
  } else {
    const spaces = Math.max(0, width - nRight.length)
    return nLeft + '\n' + fillChar.repeat(spaces) + nRight
  }
}

function wrapText(text, width = WIDTH) {
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

export function buildReceiptLayout(req, storeInfo = {}) {
  const lines = []

  const add = (str) => {
    str.split('\n').forEach((l) => lines.push(l))
  }

  const lineSeparator = '-'.repeat(WIDTH)
  const dashSeparator = '-'.repeat(WIDTH)

  if (req.isDuplicate) {
    add('[BOLD_START]')
    add(centerText('QAYTA CHIQARILGAN CHECK'))
    add('[BOLD_END]')
    add(lineSeparator)
  }

  const storeName = storeInfo.name || 'MAGNIT PREMIUM'
  const storeAddress = storeInfo.address || "Shayxontohur\nOlmazor MFY, O'qchi ko'chasi 4, 4A-UY"
  const stir = storeInfo.stir || req.fiscalStir || '305445201'

  if (storeInfo.logoHex) {
    add(storeInfo.logoHex)
  } else {
    add('[BOLD_START]')
    add(centerText(storeName))
    add('[BOLD_END]')
  }
  storeAddress.split('\n').forEach((line) => add(centerText(line)))
  add('')

  const dateObj = req.date ? dayjs(req.date) : dayjs()
  add(`Kassir: ${req.cashier || 'Kassir'}`)
  add(leftRight(`Savdo cheki №${req.saleId}`, `Kassa №${req.kassaNumber || '-'}`))
  add(leftRight(`Sana: ${dateObj.format('DD.MM.YY')}`, `Vaqt: ${dateObj.format('HH:mm:ss')}`))
  add(`Smena №${req.shiftNumber || '1'}`)
  add(lineSeparator)

  let calculatedVatTotal = 0

  req.items?.forEach((item, index) => {
    const nameLines = wrapText(`${index + 1}. ${item.name || item.barcode || 'Tovar'}`)
    nameLines.forEach((l) => add(l))

    if (item.mxik) {
      add(leftRight('  MXIK', item.mxik, WIDTH, '.'))
    }

    const qtyStr = Number(item.qty).toLocaleString('ru-RU', { minimumFractionDigits: 3 }).replace(/,/g, '.')
    const priceStr = formatMoneyWithoutSuffix(item.price)
    const leftPart = `  ${qtyStr}*${priceStr}`
    const rightPart = formatMoneyWithoutSuffix(item.total)
    add(leftRight(leftPart, rightPart, WIDTH, '.'))

    // Calculate item VAT: itemVat = itemTotal * 12 / 112, where itemTotal = qty * price
    const itemQty = Number(item.qty || 0)
    const itemPrice = Number(item.price || 0)
    const itemTotal = itemQty * itemPrice
    const itemVat = (itemTotal * 12) / 112
    calculatedVatTotal += itemVat

    add(leftRight(`  sh.j. QQS 12%`, formatMoneyWithoutSuffix(itemVat), WIDTH, '.'))
  })

  add(lineSeparator)
  const totalItemsQty = req.items?.length || 0
  add(leftRight(`Pozitsiyalar: ${totalItemsQty}`, `Xaridlar: ${totalItemsQty}`))
  add(dashSeparator)

  add('[BOLD_START]')
  add(leftRight('JAMI tolovga:', formatMoney(req.totalAmount), WIDTH, '.'))
  add('[BOLD_END]')

  if (calculatedVatTotal > 0) {
    add('[BOLD_START]')
    add(leftRight('sh.j. QQS', formatMoney(calculatedVatTotal), WIDTH, '.'))
    add('[BOLD_END]')
  }

  if (req.discount > 0) {
    add(leftRight('Chegirma', formatMoney(req.discount), WIDTH, '.'))
  }

  add('Tolov')
  let payTypeLabel = '  Aralash'
  if (req.paymentType === 'card' || req.paymentType === 'cardless') {
    payTypeLabel = req.isCorporateCard ? '  Korporativ karta' : '  Karta'
  } else if (req.paymentType === 'cash') {
    payTypeLabel = '  Naqd'
  } else if (req.paymentType === 'click') {
    payTypeLabel = '  Click'
  } else if (req.paymentType === 'payme') {
    payTypeLabel = '  Payme'
  } else if (req.paymentType === 'uzum') {
    payTypeLabel = '  Uzum'
  }
  add(leftRight(payTypeLabel, '=' + formatMoney(req.paidAmount), WIDTH, '.'))

  if (req.changeAmount > 0) {
    add(leftRight('  Qaytim', formatMoney(req.changeAmount), WIDTH, '.'))
  }

  add(dashSeparator)
  add(centerText("====== Fiskal Ma'lumotlar ======"))
  add(leftRight('STIR', stir, WIDTH, '.'))
  if (req.fiscalNumber) {
    add(leftRight('FM raqami', req.fiscalNumber, WIDTH, '.'))
  }
  if (req.fiscalSign) {
    add(leftRight('Fiskal belgi', req.fiscalSign, WIDTH, '.'))
  }
  if (req.fiscalDate) {
    add(leftRight('Fiskal sana', req.fiscalDate, WIDTH, '.'))
  }
  add(leftRight('Check raqami', req.saleId, WIDTH, '.'))

  add(lineSeparator)
  add('[BOLD_START]')
  add(centerText('Xaridingiz uchun rahmat!'))
  add('[BOLD_END]')

  if (req.qrData) {
    add(`[QR:${req.qrData}]`)
  }

  add('[CUT]')

  return lines
}

export function buildZReportReceiptLayout(zrepo, storeInfo = {}) {
  const lines = []

  const add = (str) => {
    str.split('\n').forEach((l) => lines.push(l))
  }

  const lineSeparator = '-'.repeat(WIDTH)

  if (storeInfo?.logoHex) {
    add(storeInfo.logoHex)
  } else {
    add('[BOLD_START]')
    add(centerText(storeInfo?.name || 'MAGNIT PREMIUM'))
    add('[BOLD_END]')
  }

  const storeAddress = storeInfo?.address || "Shayxontohur\nOlmazor MFY, O'qchi ko'chasi 4, 4A-UY"
  storeAddress.split('\n').forEach((line) => add(centerText(line)))
  add('*'.repeat(WIDTH))

  const formatVal = (val, divide = true) => {
    if (val === undefined || val === null || val === '-') return '-'
    const num = Number(val)
    if (isNaN(num)) return String(val)
    const finalNum = divide ? num / 100 : num
    return finalNum.toFixed(2)
  }

  if (storeInfo?.cashier) {
    add(leftRight(`KASSIR:`, storeInfo.cashier, WIDTH, '.'))
  }
  add(leftRight(`ID TERMINALI:`, `#${zrepo?.terminalID || ''}`, WIDTH, '.'))
  add(leftRight(`OCHILISH VAQTI:`, `${zrepo?.openTime || ''}`, WIDTH, '.'))
  add(leftRight(`YOPILISH VAQTI:`, `${zrepo?.closeTime || ''}`, WIDTH, '.'))
  add(leftRight(`RAQAM:`, `+${zrepo?.number || '-'}`, WIDTH, '.'))
  add(leftRight(`SONI:`, `${zrepo?.count || ''}`, WIDTH, '.'))
  add(leftRight(`JAMI CHEKLAR:`, `${zrepo?.totalSaleCount || ''}`, WIDTH, '.'))
  const totalSumLabel = 'JAMI SUMMA:'

  const totalSaleCash = Number(zrepo?.totalSaleCash || 0)
  const totalSaleCard = Number(zrepo?.totalSaleCard || 0)
  const totalRefundCash = Number(zrepo?.totalRefundCash || 0)
  const totalRefundCard = Number(zrepo?.totalRefundCard || 0)

  const totalSales = totalSaleCash + totalSaleCard
  const totalReturns = totalRefundCash + totalRefundCard
  const netTotal = totalSales - totalReturns

  add(leftRight(totalSumLabel, `${formatVal(netTotal)}`, WIDTH, '.'))
  add(leftRight(`JAMI KARTA:`, `${formatVal(zrepo?.totalSaleCard)}`, WIDTH, '.'))
  add(leftRight(`JAMI NAQD:`, `${formatVal(zrepo?.totalSaleCash)}`, WIDTH, '.'))
  add(leftRight(`JAMI QQS:`, `${formatVal(zrepo?.totalSaleVAT)}`, WIDTH, '.'))
  add(leftRight(`JAMI QAYTARISHLAR:`, `${formatVal(zrepo?.totalRefundCount)}`, WIDTH, '.'))
  add(leftRight(`QAYTARISH NAQD:`, `${formatVal(zrepo?.totalRefundCash)}`, WIDTH, '.'))
  add(leftRight(`QAYTARISH KARTA:`, `${formatVal(zrepo?.totalRefundCard)}`, WIDTH, '.'))
  add(leftRight(`QAYTARISH QQS:`, `${formatVal(zrepo?.totalRefundVAT)}`, WIDTH, '.'))
  add(leftRight(`LastReceiptsed:`, `${zrepo?.lastReceiptSeq || '-'}`, WIDTH, '.'))
  add(leftRight(`FirstReceiptSeq:`, `${zrepo?.firstReceiptSeq || '-'}`, WIDTH, '.'))
  add(leftRight(`AppletVersion:`, `${zrepo?.appletVersion || '-'}`, WIDTH, '.'))

  add(lineSeparator)
  add(centerText("Smena yopilish otchyoti, kompyuter vaqti"))
  add(centerText(dayjs().format('DD.MM.YYYY HH:mm:ss')))
  add('[CUT]')

  return lines
}
