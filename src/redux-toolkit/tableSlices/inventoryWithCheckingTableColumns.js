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
    minWidth: 100,
    width: 450,
    resizable: true,
  },
  {
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 120,
  },
  {
    field: 'expired_date',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'unit_per_pack',
    hide: false,
    minWidth: 90,
    width: 90,
    resizable: true,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  //
  {
    field: 'current_quantity',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  {
    field: 'current_quantity_pattern',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  {
    field: 'current_sum',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  //
  {
    field: 'fact_quantity',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  {
    field: 'fact_unit',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  {
    field: 'fact_quantity_pattern',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  {
    field: 'fact_sum',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  //
  //
  {
    field: 'difference_quantity',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  {
    field: 'difference_quantity_pattern',
    hide: false,
    minWidth: 70,
    width: 150,
    resizable: true,
  },
  {
    field: 'difference_sum',
    hide: false,
    minWidth: 70,
    width: 150,
    sort: 'desc',
    resizable: true,
  },
]

const inventoryWithCheckingTableColumns = createUniversalSlice('inventoryWithCheckingTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  inventoryWithCheckingTableColumns.actions
export const inventoryWithCheckingTableColumnsSlice = inventoryWithCheckingTableColumns.reducer
