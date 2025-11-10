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
    field: 'checkbox',
    hide: false,
    minWidth: 45,
    width: 45,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 280,
    flex: 1,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 280,
  },
  {
    field: 'is_active',
    hide: false,
    minWidth: 70,
    width: 100,
  },

  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const cashboxTableColumns = createUniversalSlice('cashboxTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = cashboxTableColumns.actions
export const cashboxTableColumnsSlice = cashboxTableColumns.reducer
