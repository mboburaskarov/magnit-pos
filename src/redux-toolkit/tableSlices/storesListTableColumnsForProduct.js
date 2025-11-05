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
    minWidth: 180,
    flex: 1,
  },

  {
    field: 'amount',
    hide: false,
    minWidth: 70,
    width: 220,
  },

  {
    field: 'min_amount',
    hide: false,
    minWidth: 70,
    width: 220,
  },
  {
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 220,
  },
]

const storesListTableColumnsForProduct = createUniversalSlice('storesListTableColumnsForProduct', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  storesListTableColumnsForProduct.actions
export const storesListTableColumnsForProductSlice = storesListTableColumnsForProduct.reducer
