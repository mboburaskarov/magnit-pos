export const zeroToOne = (value) => {
  if (value === undefined || value === null) {
    return 0
  }
  if (value == 0) {
    return 1
  }
  if (value > 0) {
    return value
  }
  return 0
}
