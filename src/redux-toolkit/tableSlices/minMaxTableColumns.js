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
    field: 'store_name',
    hide: false,
    minWidth: 230,
    flex: 1,
  },
  {
    field: 'code',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'product_name',
    hide: false,
    minWidth: 230,
    flex: 1,
  },

  {
    field: 'kvant',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'min_quantity',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'max_quantity',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'is_active',
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

const minMaxTableColumns = createUniversalSlice('minMaxTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = minMaxTableColumns.actions
export const minMaxTableColumnsSlice = minMaxTableColumns.reducer
