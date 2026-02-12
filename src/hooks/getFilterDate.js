import dayjs from 'dayjs'
import React from 'react'

export const getFilterStartDate = (values, initialNull = false) => {
  const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
  return values?.start_date && values?.from_time ? ready_start_date.format() : initialNull ? undefined : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00')
}

export const getFilterEndDate = (values) => {
  const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
  const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)

  return values?.end_date && values?.to_time
    ? ready_start_date?.isSame(ready_end_date)
      ? dayjs(`${values?.start_date} 23:59:59`).format()
      : ready_end_date.format()
    : null
}
