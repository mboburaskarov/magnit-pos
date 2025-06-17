import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useInfiniteQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import './table.css'

const LIMIT = 100

const TableComponent = ({ onSelectRow = () => {}, hasChange, orderStoring, barcode, id }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const rowRefs = useRef([])
  const observerRef = useRef()

  // 🔄 API call with limit/offset
  const fetchPage = async ({ pageParam = 0 }) => {
    const filter = {
      inventory_id: id,
      limit: barcode ? 50 : LIMIT,
      offset: pageParam,
      search: barcode,
      order: orderStoring.position === 1 ? `+${orderStoring.colId}` : orderStoring.position === 2 ? `-${orderStoring.colId}` : undefined,
      type: 'all',
    }
    const res = await requests.getInventoryDetails(filter).finally((a) => {
      // setHasChange(false)
    })
    return { rows: res.data?.data?.data || [], nextOffset: pageParam + LIMIT }
  }

  // 🔄 useInfiniteQuery
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    ['inventoryWithCheckingDetails', id, barcode, hasChange, orderStoring],
    fetchPage,
    {
      getNextPageParam: (lastPage) => (lastPage.rows.length < LIMIT ? undefined : lastPage.nextOffset),
    }
  )

  // 🔁 Flatten all loaded rows
  const allRows = data?.pages?.flatMap((page) => page.rows) || []
  const rowCount = allRows.length

  // 🔼⬇️ Keyboard nav
  useHotkeys('up', () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1))
  })

  useHotkeys('down', () => {
    setSelectedIndex((prev) => Math.min(rowCount - 1, prev + 1))
  })

  useHotkeys('enter', () => {
    const selectedRow = allRows[selectedIndex]
    if (selectedRow) {
      console.log('Selected Row ID:', selectedRow.id, selectedRow.name)
      onSelectRow(selectedRow)
    }
  })

  // 🎯 Scroll to selected row
  useEffect(() => {
    if (rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedIndex])

  // 📦 Infinite scroll observer
  const lastRowRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

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
        <tfoot>
          <tr>
            <th>Footer Cell</th>
            <th>Footer Cell</th>
            <th>Footer Cell</th>
            <th>Footer Cell</th>
            <th>Footer Cell</th>
          </tr>
        </tfoot>
        <tbody>
          {allRows.length == 0 && (
            <td colSpan={13}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '80vh',
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                Товары не найдены
              </Box>
            </td>
          )}
          {allRows.map((row, index) => {
            const isLast = index === allRows.length - 1
            return (
              <tr
                key={row.id}
                ref={(el) => {
                  rowRefs.current[index] = el
                  if (isLast) lastRowRef(el)
                }}
                className={index === selectedIndex ? 'selected' : ''}
                onClick={() => setSelectedIndex(index)}
              >
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.barcode}</td>
                <td>{dayjs(row.expire_date).format('DD.MM.YYYY')}</td>
                <td>{row.unit_per_pack}</td>
                <td>{row.retail_price}</td>
                <td>{row?.current_unit > 0 ? `${Math.floor(row?.current_quantity)}(${row?.current_unit}/${row?.unit_per_pack})` : row?.current_quantity}</td>
                <td>{row.current_sum}</td>
                <td>{row.fact_quantity}</td>
                <td>{row?.fact_unit > 0 ? `${Math.floor(row?.fact_quantity)}(${row?.fact_unit}/${row?.unit_per_pack})` : row?.fact_quantity}</td>
                <td>{row.fact_sum}</td>
                <td>
                  {row?.difference_unit > 0
                    ? `${Math.floor(row?.difference_quantity)}(${row?.difference_unit}/${row?.unit_per_pack})`
                    : row?.difference_quantity}
                </td>
                <td>{row.difference_sum}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {isFetchingNextPage && <div className='loader'>Loading more...</div>}
    </div>
  )
}

export default TableComponent
