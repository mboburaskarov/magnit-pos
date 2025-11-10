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
    field: 'full_name',
    hide: false,
    minWidth: 230,
    width: 200,

    flex: 1,
  },

  {
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'percent',
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

const discountCardTableColumns = createUniversalSlice('discountCardTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  discountCardTableColumns.actions
export const discountCardTableColumnsSlice = discountCardTableColumns.reducer
