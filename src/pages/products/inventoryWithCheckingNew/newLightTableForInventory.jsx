import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useRef } from 'react'
import thousandDivider from '../../../../utils/thousandDivider'

function NewLightTableForInventory({
  inventoryWithCheckingDetails,
  setLastSelectedCellRowId,
  data: allRows,
  inventoryStat,
  lastRowRef,
  setSelectedIndex,
  selectedIndex,
  rowRefs,
  setOrderStoring,
  orderStoring,
  isFetchingNextPage,
}) {
  const tableRef = useRef(null)

  const columns = [
    { id: 'index', name: '№', width: '50px' },
    { id: 'name', name: 'Название', width: '200px' },
    { id: 'barcode', name: 'Штрих-код', width: '120px' },
    { id: 'expire', name: 'Срок', width: '100px' },
    { id: 'producer', name: 'Производител', width: '100px' },
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
  const ids = allRows.map((row) => row.id)
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicates.length > 0) {
    console.warn('Duplicate IDs found:', duplicates)
  }
  const position = orderStoring?.position || 0
  const ordercolId = orderStoring?.colId || 0
  const onClick = (id) => {
    let newOrder = { position: 0, colId: '' }
    if (orderStoring) {
      if (position == 2 && ordercolId == id) {
        newOrder = {
          position: 0,
          colId: 't',
        }
      } else {
        if (ordercolId != id && ordercolId != '') {
          newOrder = {
            position: 1,
            colId: id,
          }
        } else {
          newOrder = {
            position: position + 1,
            colId: id,
          }
        }
      }
    }
    setOrderStoring(newOrder)
  }
  return (
    <div className='table-container' ref={tableRef}>
      <table className='custom-table'>
        <thead>
          <tr>
            {columns.map((col, colIndex) => (
              <th
                key={col.id}
                style={{
                  width: col.width,

                  position: 'relative',
                }}
                onClick={() => onClick(col.id)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {col.name}
                  <Box ml={2}>
                    {orderStoring.position == 1 && orderStoring.colId == col.id && <ArrowUpward color='#ccc' />}
                    {orderStoring.position == 2 && orderStoring.colId == col.id && <ArrowDownward color='#ccc' />}
                  </Box>
                </Box>
              </th>
            ))}
          </tr>
        </thead>

        <tfoot>
          {/* <tr>
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
          </tr> */}

          <tr>
            <th colSpan={1}>{get(inventoryWithCheckingDetails, 'pages.[0].total_count')}</th>
            <th colSpan={2}>Общий</th>
            <th colSpan={5}></th>
            <th colSpan={3}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{thousandDivider(get(inventoryStat, 'data.data.current_sum'), '')}</Typography>
            </th>
            <th colSpan={2}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{thousandDivider(get(inventoryStat, 'data.data.fact_sum'), '')}</Typography>
            </th>
            <th>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{thousandDivider(get(inventoryStat, 'data.data.difference_sum'), '')}</Typography>
            </th>
          </tr>
        </tfoot>

        <tbody>
          {/* {allRows.length > 0 ? ( */}
          {
            allRows.map((row, index) => {
              const isLast = index === allRows.length - 1
              const uniqueKey = `${row.id}-${index}`
              return (
                <tr
                  key={uniqueKey}
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
            })
            // ) : (
            //   <tr>
            //     <td colSpan={columns.length} style={{ textAlign: 'center' }}>
            //       No data available
            //     </td>
            //   </tr>
            // )
          }
        </tbody>
      </table>

      {isFetchingNextPage && <div className='loader'>Загрузка ещё...</div>}
    </div>
  )
}

export default NewLightTableForInventory
