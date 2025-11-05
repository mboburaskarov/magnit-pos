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
    field: 'product_name',
    hide: false,
    minWidth: 230,
    flex: 1,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 230,
    flex: 1,
  },
  {
    field: 'created_by',
    hide: false,
    minWidth: 230,
    flex: 1,
  },

  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const bannedProductTableColumns = createUniversalSlice('bannedProductTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  bannedProductTableColumns.actions
export const bannedProductTableColumnsSlice = bannedProductTableColumns.reducer
