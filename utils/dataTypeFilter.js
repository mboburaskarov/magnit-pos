export default function dataTypeFilter(detalization) {
  const types = ['MONTHLY', 'WEEKLY', 'DAILY']
  if (detalization?.value === '30min') return 'HALF_HOURLY'
  if (detalization?.value === 'hour') return 'HOURLY'
  if (detalization?.value === 'day') return 'DAILY'
  if (detalization?.value === 'week') return 'WEEKLY'
  if (detalization?.value === 'month') return 'MONTHLY'
  return types[2]
}
