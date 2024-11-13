export const getDateFromDateTime = (datetime) => {
  if (datetime !== 0 && datetime !== 'auto') {
    return datetime?.split(' ')?.[0]?.split('-')?.reverse()?.slice(0, 2)?.join('.')
  }
  return 0
}
export const getTimeFromDateTime = (datetime) => {
  if (datetime !== 0 && datetime !== 'auto') {
    return datetime?.split(' ')?.[1]?.split(':')?.slice(0, 2)?.join(':')
  }
  return 0
}
