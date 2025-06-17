import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useRef, useState } from 'react'
import thousandDivider from '../../../../utils/thousandDivider'

// function NewLightTableForInventory({
//   inventoryWithCheckingDetails,
//   setLastSelectedCellRowId,
//   data: allRows,
//   lastRowRef,
//   setSelectedIndex,
//   selectedIndex,
//   rowRefs,
//   isFetchingNextPage,
// }) {
//   console.log(inventoryWithCheckingDetails)

//   return (
//     <div className='table-container'>
//       <table className='custom-table'>
//         <thead>
//           <tr>
//             <th>№</th>
//             <th class='limited-width'>Название</th>
//             <th>Штрих-код</th>
//             <th>Срок</th>
//             <th>УП</th>
//             <th>Цена</th>
//             <th>Програм кол-во</th>
//             <th>Програм Cумма</th>
//             <th>Факт УП</th>
//             <th>Факт кол-во</th>
//             <th>Факт Cумма</th>
//             <th>Разница кол-во</th>
//             <th>Разница сумма</th>
//           </tr>
//         </thead>
//         <tfoot>
//           <tr>
//             <th colSpan={2}>Общий</th>
//             <th colSpan={5}></th>

//             <th colSpan={3}>
//               <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
//                 {thousandDivider(get(inventoryWithCheckingDetails, 'pages.[0].total_data.total_current_sum'), '')}
//               </Typography>
//             </th>

//             <th colSpan={2}>
//               <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
//                 {thousandDivider(get(inventoryWithCheckingDetails, 'pages.[0].total_data.total_fact_sum'), '')}
//               </Typography>
//             </th>
//             <th>
//               <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
//                 {thousandDivider(get(inventoryWithCheckingDetails, 'pages.[0].total_data.total_difference_sum'), '')}
//               </Typography>
//             </th>
//           </tr>
//         </tfoot>
//         <tbody>
//           {allRows.length == 0 && (
//             <td colSpan={13}>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   width: '100%',
//                   height: '80vh',
//                   fontSize: '20px',
//                   fontWeight: '600',
//                 }}
//               >
//                 Товары не найдены
//               </Box>
//             </td>
//           )}
//           {allRows.map((row, index) => {
//             const isLast = index === allRows.length - 1
//             return (
//               <tr
//                 key={row.id}
//                 ref={(el) => {
//                   rowRefs.current[index] = el
//                   if (isLast) lastRowRef(el)
//                 }}
//                 className={index === selectedIndex ? 'selected' : ''}
//                 onClick={() => {
//                   setSelectedIndex(index)
//                   setLastSelectedCellRowId(row.id)
//                 }}
//               >
//                 <td>{index + 1}</td>
//                 <td class='limited-width'>{row.name}</td>
//                 <td>{row.barcode}</td>
//                 <td>{dayjs(row.expire_date).format('DD.MM.YYYY')}</td>
//                 <td>{row.unit_per_pack}</td>
//                 <td>{row.retail_price}</td>
//                 <td>{row?.current_unit > 0 ? `${Math.floor(row?.current_quantity)}(${row?.current_unit}/${row?.unit_per_pack})` : row?.current_quantity}</td>
//                 <td>{row.current_sum}</td>
//                 <td>{row.fact_quantity}</td>
//                 <td>{row?.fact_unit > 0 ? `${Math.floor(row?.fact_quantity)}(${row?.fact_unit}/${row?.unit_per_pack})` : row?.fact_quantity}</td>
//                 <td>{row.fact_sum}</td>
//                 <td>
//                   {row?.difference_unit > 0
//                     ? `${Math.floor(row?.difference_quantity)}(${row?.difference_unit}/${row?.unit_per_pack})`
//                     : row?.difference_quantity}
//                 </td>
//                 <td>{row.difference_sum}</td>
//               </tr>
//             )
//           })}
//         </tbody>
//       </table>

//       {isFetchingNextPage && <div className='loader'>Загрузка ещё...</div>}
//     </div>
//   )
// }

// export default NewLightTableForInventory

function NewLightTableForInventory({
  inventoryWithCheckingDetails,
  setLastSelectedCellRowId,
  data: allRows,
  lastRowRef,
  setSelectedIndex,
  selectedIndex,
  rowRefs,
  isFetchingNextPage,
}) {
  const [columnWidths, setColumnWidths] = useState({})
  const tableRef = useRef(null)
  const [isResizing, setIsResizing] = useState(false)
  const [activeResizer, setActiveResizer] = useState(null)

  const handleResizeStart = (e, columnIndex) => {
    e.preventDefault()
    setIsResizing(true)
    setActiveResizer(columnIndex)

    const startX = e.clientX
    const th = e.target.parentElement
    const startWidth = th.offsetWidth

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX)
      th.style.width = `${newWidth}px`
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      setIsResizing(false)
      setActiveResizer(null)

      // Save the new width
      setColumnWidths((prev) => ({
        ...prev,
        [columnIndex]: th.style.width,
      }))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const columns = [
    { id: 'index', name: '№', width: '50px' },
    { id: 'name', name: 'Название', width: '200px' },
    { id: 'barcode', name: 'Штрих-код', width: '120px' },
    { id: 'expire', name: 'Срок', width: '100px' },
    { id: 'expire', name: 'Производител', width: '100px' },
    { id: 'unit', name: 'УП', width: '50px' },
    { id: 'price', name: 'Цена', width: '80px' },
    { id: 'prog_qty', name: 'Програм кол-во', width: '120px' },
    { id: 'prog_sum', name: 'Програм Cумма', width: '120px' },
    { id: 'fact_unit', name: 'Факт УП', width: '80px' },
    { id: 'fact_qty', name: 'Факт кол-во', width: '120px' },
    { id: 'fact_sum', name: 'Факт Cумма', width: '120px' },
    { id: 'diff_qty', name: 'Разница кол-во', width: '120px' },
    { id: 'diff_sum', name: 'Разница сумма', width: '120px' },
  ]

  return (
    <div className='table-container' ref={tableRef}>
      <table className='custom-table'>
        <thead>
          <tr>
            {columns.map((col, colIndex) => (
              <th
                key={col.id}
                style={{
                  width: columnWidths[colIndex] || col.width,
                  position: 'relative',
                }}
              >
                {col.name}
                {/* <div className={`resizer ${activeResizer === colIndex ? 'resizing' : ''}`} onMouseDown={(e) => handleResizeStart(e, colIndex)} /> */}
              </th>
            ))}
          </tr>
        </thead>

        {/* Rest of your table code remains the same */}
        <tfoot>
          <tr>
            <th colSpan={2}>Общий</th>
            <th colSpan={6}></th>

            <th colSpan={3}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                {thousandDivider(get(inventoryWithCheckingDetails, 'pages.[0].total_data.total_current_sum'), '')}
              </Typography>
            </th>

            <th colSpan={2}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                {thousandDivider(get(inventoryWithCheckingDetails, 'pages.[0].total_data.total_fact_sum'), '')}
              </Typography>
            </th>
            <th>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                {thousandDivider(get(inventoryWithCheckingDetails, 'pages.[0].total_data.total_difference_sum'), '')}
              </Typography>
            </th>
          </tr>
        </tfoot>

        <tbody>
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
                onClick={() => {
                  setSelectedIndex(index)
                  setLastSelectedCellRowId(row.id)
                }}
              >
                <td>{index + 1}</td>
                <td className='limited-width'>{row.name}</td>
                <td>{row.barcode}</td>
                <td>{dayjs(row.expire_date).format('DD.MM.YYYY')}</td>
                <td>{row.producer_name}</td>
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

      {isFetchingNextPage && <div className='loader'>Загрузка ещё...</div>}
    </div>
  )
}

export default NewLightTableForInventory
