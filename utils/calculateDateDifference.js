export const calculateDateDifference = (date1, date2) => {
  const one_day = 1000 * 60 * 60 * 24
  const difference = date1 - date2
  return difference ? difference / one_day : 0
}
