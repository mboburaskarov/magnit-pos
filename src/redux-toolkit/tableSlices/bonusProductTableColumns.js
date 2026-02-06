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
    field: 'bonus_amount',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'start_date',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'end_date',
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

const bonusProductTableColumns = createUniversalSlice('bonusProductTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  bonusProductTableColumns.actions
export const bonusProductTableColumnsSlice = bonusProductTableColumns.reducer
