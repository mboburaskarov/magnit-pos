import removeScientificNotation from './removeScientificNotation'

function thousandDivider(x, endText, toFixed2 = false, round = false) {
  let formatted = x ? (x.toString().includes('e') ? removeScientificNotation(x) : x) : x
  formatted = round ? Math.round(formatted) : formatted
  const number = Number(formatted) ? (toFixed2 ? Number(formatted).toFixed(2) : Number(formatted)) : 0
  console.log(x, Number(formatted), number, Number(number).toFixed(2))
  return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${endText ? ` ${endText}` : ''}`
}
export default thousandDivider
