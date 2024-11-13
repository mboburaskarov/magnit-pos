import dayjs from 'dayjs'
import { useMemo } from 'react'

export default function YearMonthFormNew({ date, onChange }) {
  const today = new Date()
  const currentYear = new Date().getFullYear()
  const fromMonth = new Date(currentYear - 10, 11)
  const toMonth = new Date(currentYear, 0)
  const tomorrow = new Date(today)

  const localeData = useMemo(() => dayjs().localeData(), [])

  const newMonths = localeData.months().map((item) => item[0].toUpperCase() + item.slice(1))

  const years = []
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i)
  }

  const handleChange = function handleChange(e) {
    const { yearmonth } = e.target.form

    onChange(new Date(yearmonth.value))
  }

  const dateName = newMonths[date.getMonth()] + ' ' + date.getFullYear()

  return (
    <form style={{ background: 'white !important' }} className='DayPicker-Caption'>
      <select style={{ background: 'white !important' }} name='yearmonth' onChange={handleChange} value={dateName}>
        {years.map((year) =>
          newMonths.map((month) => {
            const date = month + ' ' + year

            return (
              new Date(date) < tomorrow && (
                <option key={date} value={date}>
                  {date}
                </option>
              )
            )
          })
        )}
      </select>
    </form>
  )
}
