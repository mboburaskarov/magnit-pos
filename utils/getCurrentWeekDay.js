export const getCurrentWeekDay = () => {
  const date = new Date()
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  switch (weekday) {
    case 'Mon':
      return 0
    case 'Tue':
      return 1
    case 'Wed':
      return 2
    case 'Thu':
      return 3
    case 'Fri':
      return 4
    case 'Sat':
      return 5
    case 'Sun':
      return 6
    default:
      return ''
  }
}
