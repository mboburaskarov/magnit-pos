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
    minWidth: 300,
    flex: 1,
  },
  {
    field: 'sale_amount',
    hide: false,
    minWidth: 180,
    width: 270,
  },
  {
    field: 'import_amount',
    hide: false,
    minWidth: 70,
    width: 270,
  },
  {
    field: 'stock_amount',
    hide: false,
    minWidth: 70,
    width: 270,
  },
  {
    field: 'discount_amount',
    hide: false,
    minWidth: 70,
    width: 270,
  },

  {
    field: 'total',
    hide: false,
    minWidth: 70,
    width: 270,
  },
]

const storeSummaryTableColumns = createUniversalSlice('storeSummaryTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  storeSummaryTableColumns.actions
export const storeSummaryTableColumnsSlice = storeSummaryTableColumns.reducer
