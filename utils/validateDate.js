import dayjs from 'dayjs'

export const formatDate = (date, format = 'YYYY-MM-DD', invalidData = '-') => {
  const parsedDate = dayjs(date)
  return parsedDate.isValid() ? parsedDate.format(format) : invalidData
}
