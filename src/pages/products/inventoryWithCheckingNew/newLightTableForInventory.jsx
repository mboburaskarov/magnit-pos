import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import thousandDivider from '../../../../utils/thousandDivider'

function NewLightTableForInventory({ inventoryWithCheckingDetails, data: allRows, lastRowRef, setSelectedIndex, selectedIndex, rowRefs, isFetchingNextPage }) {
  return (
    <div className='table-container'>
      <table className='custom-table'>
        <thead>
          <tr>
            <th>№</th>
            <th class='limited-width'>Название</th>
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
            <th></th>
            <th>Общий</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                {thousandDivider(get(inventoryWithCheckingDetails, 'data.data.total_data.total_current_sum'), '')}
              </Typography>
            </th>
            <th></th>
            <th></th>
            <th>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                {thousandDivider(get(inventoryWithCheckingDetails, 'data.data.total_data.total_fact_sum'), '')}
              </Typography>
            </th>
            <th></th>
            <th>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                {thousandDivider(get(inventoryWithCheckingDetails, 'data.data.total_data.total_difference_sum'), '')}
              </Typography>
            </th>
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
                <td class='limited-width'>{row.name}</td>
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

export default NewLightTableForInventory
