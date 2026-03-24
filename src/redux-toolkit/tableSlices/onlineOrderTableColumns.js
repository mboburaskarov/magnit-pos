import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'sale_number',
    hide: false,
    width: 150,
    maxWidth: 250,
  },

  {
    field: 'online_status',
    hide: false,
    width: 250,
    maxWidth: 250,
  },
  {
    field: 'payment_type',
    hide: false,
    width: 150,
    maxWidth: 250,
  },
  {
    field: 'total_amount',
    hide: false,
    width: 150,
    maxWidth: 250,
  },
  {
    field: 'total_discount',
    hide: false,
    width: 150,
    maxWidth: 250,
  },
  {
    field: 'customer',
    hide: false,
    width: 250,
    maxWidth: 250,
  },
  {
    field: 'store',
    hide: false,
    width: 250,
    maxWidth: 250,
  },
  {
    field: 'created_at',
    hide: false,
    width: 250,
    maxWidth: 250,
  },
  {
    field: 'completed_at',
    hide: false,
    width: 250,
    maxWidth: 250,
  },
  {
    field: 'is_paid',
    hide: false,
    width: 150,
    maxWidth: 250,
  },
]

const onlineOrdersTableColumns = createUniversalSlice('onlineOrdersTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  onlineOrdersTableColumns.actions
export const onlineOrdersTableColumnsSlice = onlineOrdersTableColumns.reducer
