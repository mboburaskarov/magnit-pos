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
    .replace(/oʻ/g, "o'").replace(/Oʻ/g, "O'")
    .replace(/o‘/g, "o'").replace(/O‘/g, "O'")
    .replace(/o`/g, "o'").replace(/O`/g, "O'")
    .replace(/gʻ/g, "g'").replace(/Gʻ/g, "G'")
    .replace(/g‘/g, "g'").replace(/G‘/g, "G'")
    .replace(/g`/g, "g'").replace(/G`/g, "G'")
    .replace(/ʻ/g, "'").replace(/‘/g, "'").replace(/`/g, "'")
    .replace(/ў/g, "у").replace(/Ў/g, "У")
    .replace(/қ/g, "к").replace(/Қ/g, "К")
    .replace(/ғ/g, "г").replace(/Ғ/g, "Г")
    .replace(/ҳ/g, "х").replace(/Ҳ/g, "Х")
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
    str.split('\n').forEach(l => lines.push(l))
  }
  
  const lineSeparator = '='.repeat(WIDTH)
  const dashSeparator = '-'.repeat(WIDTH)
  
  const storeName = storeInfo.name || "***MAGNIT PREMIUM***"
  const storeAddress = storeInfo.address || "Shayxontohur\nOlmazor MFY, O'qchi ko'chasi 4, 4A-UY"
  const stir = storeInfo.stir || req.fiscalStir || "305445201"
  
  add('[BOLD_START]')
  add(centerText(storeName))
  add('[BOLD_END]')
  storeAddress.split('\n').forEach(line => add(centerText(line)))
  add('*'.repeat(WIDTH))

  add(leftRight(`PM №1`, `Sotuvchi: ${req.cashier || "Kassir"}`))
  const dateObj = req.date ? dayjs(req.date) : dayjs()
  add(leftRight(`PRODAJA №${req.saleId}`, `Smena №${req.shiftNumber || "1"}`))
  add(leftRight(`Дата: ${dateObj.format("DD.MM.YY")}`, `Время: ${dateObj.format("HH:mm:ss")}`))
  add(lineSeparator)

  req.items?.forEach((item, index) => {
    const nameLines = wrapText(`${index + 1}. ${item.name || item.barcode || 'Tovar'}`)
    nameLines.forEach(l => add(l))
    
    if (item.mxik) {
      add(leftRight("  MXIK", item.mxik, WIDTH, '.'))
    }
    
    const qtyStr = Number(item.qty).toLocaleString('ru-RU', { minimumFractionDigits: 3 }).replace(/,/g, '.')
    const priceStr = formatMoneyWithoutSuffix(item.price)
    const leftPart = `  ${qtyStr}*${priceStr}`
    const rightPart = formatMoneyWithoutSuffix(item.total)
    add(leftRight(leftPart, rightPart, WIDTH, '.'))
    
    if (item.vatPercent) {
      add(leftRight(`  sh.j. QQS ${item.vatPercent}%`, formatMoneyWithoutSuffix(item.vatAmount || 0), WIDTH, '.'))
    }
  })
  
  add(lineSeparator)
  const totalItemsQty = req.items?.length || 0
  add(leftRight(`Позиций: ${totalItemsQty}`, `Покупок: ${totalItemsQty}`))
  add(dashSeparator)

  add('[BOLD_START]')
  add(leftRight("JAMI tolovga:", formatMoney(req.totalAmount), WIDTH, '.'))
  add('[BOLD_END]')
  
  if (req.vatAmount > 0) {
    add('[BOLD_START]')
    add(leftRight("sh.j. QQS", formatMoney(req.vatAmount), WIDTH, '.'))
    add('[BOLD_END]')
  }
  
  if (req.discount > 0) {
    add(leftRight("Chegirma", formatMoney(req.discount), WIDTH, '.'))
  }
  
  add("Tolov")
  const payTypeLabel = (req.paymentType === 'card' || req.paymentType === 'cardless') ? "  Karta" : (req.paymentType === 'cash' ? "  Наличные" : "  Aralash")
  add(leftRight(payTypeLabel, "=" + formatMoney(req.paidAmount), WIDTH, '.'))
  
  if (req.changeAmount > 0) {
    add(leftRight("  Qaytim", formatMoney(req.changeAmount), WIDTH, '.'))
  }
  
  add(dashSeparator)
  add(centerText("======Fiskal Ma'lumotlar======"))
  add(leftRight("STIR", stir, WIDTH, '.'))
  if (req.fiscalNumber) {
    add(leftRight("FM raqami", req.fiscalNumber, WIDTH, '.'))
  }
  if (req.fiscalSign) {
    add(leftRight("Fiskal belgi", req.fiscalSign, WIDTH, '.'))
  }
  if (req.fiscalDate) {
    add(leftRight("Fiskal sana", req.fiscalDate, WIDTH, '.'))
  }
  add(leftRight("Check raqami", req.saleId, WIDTH, '.'))
  
  if (req.qrData) {
    add(`[QR:${req.qrData}]`)
  }

  add(lineSeparator)
  add(centerText("***** Xaridingiz uchun raxmat !!! *****"))
  add('[CUT]')

  return lines
}
