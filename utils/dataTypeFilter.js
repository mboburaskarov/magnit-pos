export default function dataTypeFilter(detalization) {
  const val = typeof detalization === 'string' ? detalization : detalization?.value;
  const types = ['MONTHLY', 'WEEKLY', 'DAILY']
  if (val === '30min') return 'HALF_HOURLY'
  if (val === 'hour') return 'HOURLY'
  if (val === 'day') return 'DAILY'
  if (val === 'week') return 'WEEKLY'
  if (val === 'month') return 'MONTHLY'
  return types[2]
}
