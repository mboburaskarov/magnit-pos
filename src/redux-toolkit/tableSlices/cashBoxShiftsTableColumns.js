import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'operation_id',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'cashbox_name',
    hide: false,
    minWidth: 250,
    flex: 1,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 300,
  },

  {
    field: 'is_open',
    hide: false,
    minWidth: 70,
    width: 250,
  },

  {
    field: 'opened_amount',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'current_amount',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const cashBoxShiftsTableColumns = createUniversalSlice('cashBoxShiftsTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  cashBoxShiftsTableColumns.actions
export const cashBoxShiftsTableColumnsSlice = cashBoxShiftsTableColumns.reducer
