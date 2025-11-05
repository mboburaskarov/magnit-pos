import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'checkbox',
    hide: false,
    minWidth: 45,
    width: 45,
  },
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 120,
  },
  {
    field: 'fish',
    hide: false,
    minWidth: 180,
    flex: 1,
  },
  {
    field: 'phone_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'loyalty_card_barcode',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'tags',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'sale_amount',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'sale_date',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'birthday',
    hide: false,
    minWidth: 70,
    width: 198,
  },
  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'store',
    hide: false,
    minWidth: 70,
    width: 198,
  },
  {
    field: 'balance',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'debt_amount',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'spending_from_balance',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'action',
    hide: false,
    minWidth: 90,
    width: 90,
  },
]

const clientTableColumns = createUniversalSlice('clientTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = clientTableColumns.actions
export const clientTableColumnsSlice = clientTableColumns.reducer
