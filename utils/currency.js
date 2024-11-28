const commonCurrency = {
  uz: "so'm",
  ru: 'сум',
  en: 'sum',
  default: "so'm",
}
const languages = ['ru', 'uz', 'en']
function currency(args = {}) {
  const { supply_price = false } = args
  // const store = initializeStore()
  // const storeState = store.getState()
  const defaultCurrency = 'uz'
  const supplyCurrency = 'uz'
  const retailCurrency = 'uz'
  const lang = languages.includes('ru')
  return supply_price
    ? supplyCurrency?.iso_code === commonCurrency.default
      ? commonCurrency?.[lang]
      : supplyCurrency?.iso_code || defaultCurrency?.iso_code
    : retailCurrency?.iso_code || defaultCurrency?.iso_code
}
export default currency
