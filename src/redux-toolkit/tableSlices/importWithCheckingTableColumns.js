import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'name',
    hide: false,
    minWidth: 400,
    flex: 1,
  },

  {
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'declared',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'scanned',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'series_number',
    hide: false,
    minWidth: 70,
    width: 210,
  },
  {
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 210,
  },
  {
    field: 'producer_name',
    hide: false,
    minWidth: 70,
    width: 210,
  },
]

const importWithCheckingTableColumns = createUniversalSlice('importWithCheckingTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  importWithCheckingTableColumns.actions
export const importWithCheckingTableColumnsSlice = importWithCheckingTableColumns.reducer
