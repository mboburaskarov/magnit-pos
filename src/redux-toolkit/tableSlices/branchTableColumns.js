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
    minWidth: 380,
    flex: 1,
  },
  {
    field: 'detailed_name',
    hide: false,
    minWidth: 70,
    width: 194,
  },
  {
    field: 'target_amount',
    hide: false,
    minWidth: 70,
    width: 194,
  },
  {
    field: 'average_target_sales',
    hide: false,
    minWidth: 100,
    width: 220,
  },
  {
    field: 'work_hours',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'address',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'phone',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'employee_count',
    hide: false,
    minWidth: 70,
    width: 94,
  },
  {
    field: 'cash_box_count',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'store_code',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'location',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 140,
    width: 140,
    pinned: 'right',
  },
]

const branchTableColumns = createUniversalSlice('branchTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = branchTableColumns.actions
export const branchTableColumnsSlice = branchTableColumns.reducer
