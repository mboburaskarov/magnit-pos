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
    field: 'stock_count',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'scanned_count',
    hide: false,
    minWidth: 70,
    width: 200,
  },
]

const inventoryDetailsTableColumns = createUniversalSlice('inventoryDetailsTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  inventoryDetailsTableColumns.actions
export const inventoryDetailsTableColumnsSlice = inventoryDetailsTableColumns.reducer
