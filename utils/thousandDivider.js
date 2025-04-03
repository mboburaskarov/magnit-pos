import removeScientificNotation from './removeScientificNotation'

function thousandDivider(x, endText) {
  const formatted = x ? (x.toString().includes('e') ? removeScientificNotation(x) : x) : x
  const number = Number(formatted) ? Number(formatted) : 0
  return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${endText ? ` ${endText}` : ''}`
}
export default thousandDivider
