import { numberToPrice } from './numberToPrice'

export const calculateCashbackAmount = (loyalty_balance_income, loyalty_balance_outcome) => {
  const total = loyalty_balance_income - loyalty_balance_outcome
  return `${total === 0 ? '' : total > 0 ? '+' : '-'} ${numberToPrice(Math.abs(total))}`
}
