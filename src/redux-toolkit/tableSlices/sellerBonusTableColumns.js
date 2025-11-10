import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 120,
  },
  {
    field: 'fish',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'bonus_amount',
    hide: false,
    minWidth: 150,
    width: 150,
  },
  {
    field: 'sales_count',
    hide: false,
    minWidth: 200,
    width: 200,
  },

  {
    field: 'store',
    hide: false,
    minWidth: 70,
    width: 260,
  },
  {
    field: 'phone',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'role',
    hide: false,
    minWidth: 200,
    flex: 1,
  },
]

const sellerBonusTableColumns = createUniversalSlice('sellerBonusTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  sellerBonusTableColumns.actions
export const sellerBonusTableColumnsSlice = sellerBonusTableColumns.reducer
