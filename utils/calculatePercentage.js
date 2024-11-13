export const calculatePercentage = (oldNumber, newNumber) => {
  if (newNumber === 0) {
    return 0 // Handle division by zero
  }
  return Math.round(((newNumber - oldNumber) / oldNumber) * 100)
}
