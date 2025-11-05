import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 200,
    flex: 1,
    resizable: true,
  },
  {
    field: 'material_code',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'export_date',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'serial_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'stock_count',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'expected_count',
    hide: false,
    minWidth: 70,
    width: 200,
  },
]

const returnToWarehouseSentWithCheckingTableColumns = createUniversalSlice('returnToWarehouseSentWithCheckingTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  returnToWarehouseSentWithCheckingTableColumns.actions
export const returnToWarehouseSentWithCheckingTableColumnsSlice = returnToWarehouseSentWithCheckingTableColumns.reducer
