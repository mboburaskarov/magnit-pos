export const getDetaling = (dateDifference) => {
  if (dateDifference >= 365) {
    return 'year'
  }
  if (dateDifference >= 30) {
    return 'month'
  }
  if (dateDifference >= 7) {
    return 'week'
  }
  if (dateDifference == 1 || dateDifference == 0) {
    return 'today'
  }
  if (dateDifference > 1) {
    return 'days'
  }
}
