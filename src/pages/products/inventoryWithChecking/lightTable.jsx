import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'
import './table.css'

const rows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}))

const TableComponent = ({ data, orderStoring, id }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const rowRefs = useRef([])
  const { values } = useQueryParams()

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
  const inventoryWithCheckingDetailsFilter = useMemo(() => {
    return {
      inventory_id: id,
      limit: 5000,
      offset: values?.offset || 0,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
      type: 'all',
    }
  }, [values?.offset, orderStoring, values?.limit, id])
  const {
    data: inventoryWithCheckingDetails,
    isLoading: inventoryWithCheckingDetailsLoading,
    isFetching: isFetchinginventoryWithCheckingDetails,
    refetch,
  } = useQuery(['inventoryWithCheckingDetails', inventoryWithCheckingDetailsFilter], () => requests.getInventoryDetails(inventoryWithCheckingDetailsFilter), {
    onSuccess: ({ data }) => {},

    onError: (error) => {
      console.error('Query failed:', error)
    },
  })
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
          {inventoryWithCheckingDetails?.data?.data?.data?.map((row, index) => (
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
              {/* <td>{row.current_quantity}</td> */}
              <td>{row?.current_unit > 0 ? `${Math.floor(row?.current_quantity)}(${row?.current_unit}/${row?.unit_per_pack})` : row?.current_quantity}</td>
              <td>{row.current_sum}</td>
              <td>{row.fact_quantity}</td>
              <td>{row?.fact_unit > 0 ? `${Math.floor(row?.fact_quantity)}(${row?.fact_unit}/${row?.unit_per_pack})` : row?.fact_quantity}</td>
              <td>{row.fact_sum}</td>
              {/* <td>{row.difference_quantity}</td> */}
              <td>
                {row?.difference_unit > 0 ? `${Math.floor(row?.difference_quantity)}(${row?.difference_unit}/${row?.unit_per_pack})` : row?.difference_quantity}
              </td>
              <td>{row.difference_sum}</td>
            </tr>
          ))}
        </tbody>
        {/* <tfoot>
          <tr>
            <td colSpan={12}>
              <strong>Итого</strong>
            </td>
            <td>
              <strong>{23232} сум</strong>
            </td>
          </tr>
        </tfoot> */}
      </table>
    </div>
  )
}

export default TableComponent
