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
    field: 'public_id',
    hide: false,
    minWidth: 130,
    width: 100,
  },

  {
    field: 'store_name',
    hide: false,
    minWidth: 250,
    flex: 1,
  },
  {
    field: 'import_date',
    hide: false,
    minWidth: 70,
    width: 370,
  },

  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const autoOrderTableColumns = createUniversalSlice('autoOrderTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  autoOrderTableColumns.actions
export const autoOrderTableColumnsSlice = autoOrderTableColumns.reducer
