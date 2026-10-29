// The built-in receipt layouts — GET v1/receipt-template/defaults, as the CRM
// serves them (magnitgo-crm, 2026-10-29). A till prints these only when it has
// never been able to fetch its store's templates: a fresh install that starts
// offline. They reproduce the receipt the POS printed before templates existed,
// so the fiscal content is the same either way.

const DUPLICATE_HEADER = [
  { id: 'duplicate_title', type: 'text', enabled: true, bold: true, align: 'center', show_if: 'duplicate', text: 'QAYTA CHIQARILGAN CHECK' },
  { id: 'duplicate_separator', type: 'separator', enabled: true, show_if: 'duplicate', char: '-' },
]

const STORE_HEADER = [
  { id: 'logo', type: 'logo', enabled: true, bold: true, align: 'center', text: '{{store_name}}', width: 400 },
  { id: 'store_address', type: 'text', enabled: true, align: 'center', text: '{{store_address}}' },
  { id: 'header_blank', type: 'blank', enabled: true },
]

const saleBody = ({ numberLabel, totalLabel, paymentTitle }) => [
  { id: 'cashier', type: 'text', enabled: true, align: 'left', text: 'Kassir: {{cashier}}' },
  { id: 'check_number', type: 'pair', enabled: true, left: `${numberLabel} №{{sale_number}}`, right: 'Kassa №{{kassa}}', fill: ' ' },
  { id: 'date_time', type: 'pair', enabled: true, left: 'Sana: {{date}}', right: 'Vaqt: {{time}}', fill: ' ' },
  { id: 'shift', type: 'text', enabled: true, align: 'left', text: 'Smena №{{shift}}' },
  { id: 'header_separator', type: 'separator', enabled: true, char: '-' },
  {
    id: 'items',
    type: 'items',
    enabled: true,
    fill: '.',
    labels: { default_name: 'Tovar', mxik: '  MXIK', vat: '  sh.j. QQS 12%' },
    options: { show_index: true, show_mxik: true, show_vat: true },
  },
  { id: 'items_separator', type: 'separator', enabled: true, char: '-' },
  { id: 'positions', type: 'pair', enabled: true, left: 'Pozitsiyalar: {{positions}}', right: 'Xaridlar: {{positions}}', fill: ' ' },
  { id: 'positions_separator', type: 'separator', enabled: true, char: '-' },
  { id: 'total', type: 'pair', enabled: true, bold: true, left: totalLabel, right: '{{total}}', fill: '.' },
  { id: 'vat_total', type: 'pair', enabled: true, bold: true, show_if: 'vat_total', left: 'sh.j. QQS', right: '{{vat_total}}', fill: '.' },
  { id: 'discount', type: 'pair', enabled: true, show_if: 'discount', left: 'Chegirma', right: '{{discount}}', fill: '.' },
  {
    id: 'payment',
    type: 'payment',
    enabled: true,
    fill: '.',
    title: paymentTitle,
    labels: { card: 'Karta', cash: 'Naqd', click: 'Click', mixed: 'Aralash', payme: 'Payme', uzum: 'Uzum' },
    options: { show_card_scheme: true },
  },
  { id: 'corporate_card', type: 'pair', enabled: true, show_if: 'corporate_card', left: '  Karta turi', right: 'korporativ', fill: '.' },
  { id: 'change', type: 'pair', enabled: true, show_if: 'change', left: '  Qaytim', right: '{{change}}', fill: '.' },
  { id: 'payment_separator', type: 'separator', enabled: true, char: '-' },
  {
    id: 'fiscal',
    type: 'fiscal',
    enabled: true,
    fill: '.',
    title: "====== Fiskal Ma'lumotlar ======",
    labels: { check_number: 'Check raqami', fiscal_date: 'Fiskal sana', fiscal_number: 'FM raqami', fiscal_sign: 'Fiskal belgi', stir: 'STIR' },
  },
  { id: 'fiscal_separator', type: 'separator', enabled: true, char: '-' },
  { id: 'thanks', type: 'text', enabled: true, bold: true, align: 'center', text: 'Xaridingiz uchun rahmat!' },
  { id: 'qr', type: 'qr', enabled: true },
]

export const DEFAULT_LAYOUTS = {
  sale: {
    blocks: [...DUPLICATE_HEADER, ...STORE_HEADER, ...saleBody({ numberLabel: 'Savdo cheki', totalLabel: 'JAMI tolovga:', paymentTitle: 'Tolov' })],
  },
  return: {
    blocks: [
      ...DUPLICATE_HEADER,
      { id: 'return_title', type: 'text', enabled: true, bold: true, align: 'center', text: 'MAHSULOT QAYTARISH' },
      { id: 'return_separator', type: 'separator', enabled: true, char: '-' },
      ...STORE_HEADER,
      ...saleBody({ numberLabel: 'Qaytarish cheki', totalLabel: 'JAMI qaytarildi:', paymentTitle: 'Qaytarish turi' }),
    ],
  },
  z_report: {
    blocks: [
      ...STORE_HEADER,
      { id: 'title', type: 'text', enabled: true, bold: true, align: 'center', text: 'SMENA YOPILISH HISOBOTI' },
      { id: 'title_separator', type: 'separator', enabled: true, char: '-' },
      { id: 'kassa', type: 'pair', enabled: true, show_if: 'kassa', left: 'Kassa', right: '{{kassa}}', fill: '.' },
      { id: 'store', type: 'pair', enabled: true, left: "Do'kon", right: '{{store_name}}', fill: '.' },
      { id: 'cashier', type: 'pair', enabled: true, show_if: 'cashier', left: 'Kassir', right: '{{cashier}}', fill: '.' },
      { id: 'date', type: 'pair', enabled: true, left: 'Sana', right: '{{date}}', fill: '.' },
      { id: 'open_time', type: 'pair', enabled: true, left: 'Ochilgan', right: '{{open_time}}', fill: '.' },
      { id: 'close_time', type: 'pair', enabled: true, left: 'Yopilgan', right: '{{close_time}}', fill: '.' },
      { id: 'header_separator', type: 'separator', enabled: true, char: '-' },
      { id: 'payments_title', type: 'text', enabled: true, bold: true, align: 'center', text: "TO'LOV TURLARI BO'YICHA HISOBOT" },
      { id: 'payments_title_separator', type: 'separator', enabled: true, char: '-' },
      {
        id: 'payments',
        type: 'z_payments',
        enabled: true,
        fill: '.',
        char: '-',
        labels: { auto_suffix: ' (avto)', diff: '  Farq', diff_shortage: '  Farq (kamomad)', diff_surplus: '  Farq (ortiqcha)', fact: '  Fakt' },
      },
      { id: 'payments_separator', type: 'separator', enabled: true, char: '=' },
      { id: 'total_expected', type: 'pair', enabled: true, bold: true, left: 'JAMI (kutilgan)', right: '{{total_expected}}', fill: '.' },
      { id: 'total_entered', type: 'pair', enabled: true, left: 'JAMI (fakt)', right: '{{total_entered}}', fill: '.' },
      { id: 'total_diff', type: 'pair', enabled: true, bold: true, left: 'Umumiy farq', right: '{{total_diff}}', fill: '.' },
      { id: 'totals_separator', type: 'separator', enabled: true, char: '-' },
      { id: 'cash_title', type: 'text', enabled: true, bold: true, align: 'center', text: 'NAQD PULNING TAQSIMOTI' },
      { id: 'kept_in_register', type: 'pair', enabled: true, left: 'Kassada qoldi', right: '{{kept_in_register}}', fill: '.' },
      { id: 'given_to_company', type: 'pair', enabled: true, left: 'Kompaniyaga berildi', right: '{{given_to_company}}', fill: '.' },
      { id: 'cash_separator', type: 'separator', enabled: true, char: '-' },
      {
        id: 'fiscal',
        type: 'z_fiscal',
        enabled: true,
        fill: '.',
        title: "Fiskal Ma'lumotlar",
        labels: {
          fiscal_total: 'Fiskal summa (jami)',
          refund_card: '  qaytarish karta',
          refund_cash: '  qaytarish naqd',
          refund_count: 'Qaytarishlar soni',
          refund_vat: '  qaytarish QQS',
          sale_card: '  shu j. karta',
          sale_cash: '  shu j. naqd',
          sale_count: 'Cheklar soni',
          sale_vat: '  shu j. QQS',
          terminal_id: 'ID terminali',
        },
      },
      { id: 'fiscal_separator', type: 'separator', enabled: true, char: '-' },
      { id: 'footer', type: 'text', enabled: true, align: 'center', text: 'Smena yopilish otchyoti, kompyuter vaqti' },
      { id: 'footer_time', type: 'text', enabled: true, align: 'center', text: '{{now}}' },
    ],
  },
}
