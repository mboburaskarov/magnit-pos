export const calculatePercentage = (oldNumber, newNumber) => {
  if (newNumber === 0) {
    return 0 // Handle division by zero
  }
  const percent = Math.round(((newNumber - oldNumber) / oldNumber) * 100)
  return Math.max(-100, Math.min(100, percent))
}
