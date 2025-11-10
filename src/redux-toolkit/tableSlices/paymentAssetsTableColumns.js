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
    minWidth: 70,
    width: 330,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 280,
    width: 100,
  },
  {
    field: 'is_enable',
    hide: false,
    minWidth: 70,
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

const paymentAssetsTableColumns = createUniversalSlice('paymentAssetsTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  paymentAssetsTableColumns.actions
export const paymentAssetsTableColumnsSlice = paymentAssetsTableColumns.reducer
