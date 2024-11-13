const status = ['PENDING', 'INACTIVE', 'CANCELED']
export const checkForManual = (stat) => {
  return status.includes(stat)
}
