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
    field: 'start_time',
    hide: false,
    minWidth: 70,
    width: 500,
  },
  {
    field: 'end_time',
    hide: false,
    minWidth: 70,
    width: 500,
  },

  {
    field: 'total_expense_amount',
    hide: false,
    minWidth: 70,
    width: 200,
  },
]

const cashBoxShiftHistoryTableColumns = createUniversalSlice('cashBoxShiftHistoryTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  cashBoxShiftHistoryTableColumns.actions
export const cashBoxShiftHistoryTableColumnsSlice = cashBoxShiftHistoryTableColumns.reducer
