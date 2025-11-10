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
    minWidth: 60,
    flex: 1,
  },
  {
    field: 'count',
    hide: false,
    minWidth: 180,
    width: 300,
  },
  {
    field: 'total_amount',
    hide: false,
    minWidth: 70,
    width: 300,
  },
]

const topReportTableColumns = createUniversalSlice('topReportTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  topReportTableColumns.actions
export const topReportTableColumnsSlice = topReportTableColumns.reducer
