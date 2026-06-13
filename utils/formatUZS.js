export function roundToOne(value) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 10) / 10
}

export function formatNumberUZS(value) {
  const rounded = roundToOne(value)
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(rounded)
  return formatted.replace(/\u00a0/g, ' ').replace(/\u202f/g, ' ')
}

export function formatUZS(value) {
  return `${formatNumberUZS(value)} UZS`
}
