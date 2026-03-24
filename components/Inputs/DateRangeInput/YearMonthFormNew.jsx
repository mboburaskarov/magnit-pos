import dayjs from 'dayjs'
import { useMemo } from 'react'

const monthMap = {
  Январь: 0,
  Февраль: 1,
  Март: 2,
  Апрель: 3,
  Май: 4,
  Июнь: 5,
  Июль: 6,
  Август: 7,
  Сентябрь: 8,
  Октябрь: 9,
  Ноябрь: 10,
  Декабрь: 11,
}

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

  const currentMonth = date.getMonth()
  const currentYearValue = date.getFullYear()

  const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value)
    const newDate = new Date(currentYearValue, selectedMonth, 1)

    // Check if the new date is valid (not in the future)
    if (newDate < tomorrow) {
      onChange(newDate)
    }
  }

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value)
    const newDate = new Date(selectedYear, currentMonth, 1)

    // Check if the new date is valid (not in the future)
    if (newDate < tomorrow) {
      onChange(newDate)
    }
  }

  // Filter available months based on selected year
  const getAvailableMonths = (year) => {
    if (year === currentYear) {
      // For current year, only show months up to current month
      return newMonths.slice(0, today.getMonth() + 1)
    } else if (year < currentYear) {
      // For past years, show all months
      return newMonths
    } else {
      // For future years, show no months (shouldn't happen with current logic)
      return []
    }
  }

  const availableMonths = getAvailableMonths(currentYearValue)

  return (
    <form style={{ background: 'white !important' }} className='DayPicker-Caption'>
      {/* <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}> */}
      <select style={{ background: 'white !important', marginRight: '4px' }} name='month' onChange={handleMonthChange} value={currentMonth}>
        {availableMonths.map((month, index) => (
          <option key={month} value={index}>
            {month}
          </option>
        ))}
      </select>

      <select style={{ background: 'white !important' }} name='year' onChange={handleYearChange} value={currentYearValue}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {/* </div> */}
    </form>
  )
}
