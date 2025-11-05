import { createSlice } from '@reduxjs/toolkit'
import arrayMove from '../../../utils/arrayMove'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'id',
    hide: false,
    minWidth: 70,
    initialWidth: 120,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 200,
    width: 300,
  },
  {
    field: 'shop_name',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'client',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'receiver',
    hide: false,
    minWidth: 70,
    width: 230,
  },
  {
    field: 'created_date',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'pickup_date',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'delivery_date',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'products_count',
    hide: false,
    minWidth: 70,
    width: 100,
  },
  {
    field: 'total_amount',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'deliveryService',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'delivery_price',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'payment_method',
    hide: false,
    minWidth: 70,
    width: 186,
  },
  {
    field: 'source',
    hide: false,
    minWidth: 70,
    width: 186,
  },
  {
    field: 'moderator_name',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'operator_name',
    hide: false,
    minWidth: 70,
    width: 252,
  },
  {
    field: 'last_order_note',
    hide: false,
    minWidth: 70,
    width: 225,
  },
  {
    field: 'create_order_note',
    hide: false,
    minWidth: 320,
    width: 320,
  },
]

const orderTableColumns = createUniversalSlice('orderTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = orderTableColumns.actions
export const orderTableColumnsSlice = orderTableColumns.reducer
