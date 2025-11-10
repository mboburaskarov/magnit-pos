import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'type',
    hide: false,
    minWidth: 60,
    width: 180,
  },
  {
    field: 'amount',
    hide: false,
    minWidth: 180,
    flex: 1,
  },
  {
    field: 'expense_amount',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'net_amount',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'difference_amount',
    hide: false,
    minWidth: 70,
    width: 180,
  },
]

const cardShiftTableColumns = createUniversalSlice('cardShiftTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  cardShiftTableColumns.actions
export const cardShiftTableColumnsSlice = cardShiftTableColumns.reducer
