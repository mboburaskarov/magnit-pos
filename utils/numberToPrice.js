import currency from './currency'

export const numberToPrice = (number, supply_price, selectedCurrency) => {
  const defaultCurrency = currency({ supply_price })

  const decPlaces = (selectedCurrency || defaultCurrency) === 'USD' ? 6 : 2 // hardcode, will be removed after round module

  let numberSplit = parseFloat(Number(number)?.toFixed(decPlaces)).toString().split('.')

  numberSplit[0] = numberSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const modifiedNumber = numberSplit.join('.')

  return number ? `${modifiedNumber} ${defaultCurrency}` : `0 ${defaultCurrency}`
}
