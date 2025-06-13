import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import './Table.css'

const rows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}))

const TableComponent = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const rowRefs = useRef([])

  useHotkeys('up', () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1))
  })

  useHotkeys('down', () => {
    setSelectedIndex((prev) => Math.min(rows.length - 1, prev + 1))
  })

  useHotkeys('enter', () => {
    console.log('Selected Row ID:', rows[selectedIndex].id)
  })

  useEffect(() => {
    if (rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedIndex])

  return (
    <div className='table-container'>
      <table className='custom-table'>
        <thead>
          <tr>
            <th>№</th>
            <th>Название</th>
            <th>Штрих-код</th>
            <th>Срок</th>
            <th>УП</th>
            <th>Цена</th>
            <th>Програм кол-во</th>
            <th>Програм Cумма</th>
            <th>Факт УП</th>
            <th>Факт кол-во</th>
            <th>Факт Cумма</th>
            <th>Разница кол-во</th>
            <th>Разница сумма</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              ref={(el) => (rowRefs.current[index] = el)}
              className={index === selectedIndex ? 'selected' : ''}
              onClick={() => setSelectedIndex(index)}
            >
              <td>{index + 1}</td>
              <td>{row.name}</td>
              <td>{row.barcode}</td>
              <td>{dayjs(row.expire_date).format('DD.MM.YYYY')}</td>
              <td>{row.unit_per_pack}</td>
              <td>{row.retail_price}</td>
              <td>{row.current_quantity}</td>
              <td>{row.current_unit}</td>
              <td>{row.current_sum}</td>
              <td>{row.fact_quantity}</td>
              <td>{row.fact_unit}</td>
              <td>{row.fact_sum}</td>
              <td>{row.difference_quantity}</td>
              <td>{row.difference_unit}</td>
              <td>{row.difference_sum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableComponent
