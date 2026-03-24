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
    minWidth: 200,
    width: 300,
  },

  {
    field: 'kvant',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'current_stock',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'min_stock',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'max_stock',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'monthly_quantity',
    hide: false,
    minWidth: 70,
    width: 150,
  },

  {
    field: 'weekly_quantity',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'order_growth',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'order_lead_time',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'suggested_order',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'adjusted_order',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'response_order_quantity',
    hide: false,
    minWidth: 70,
    width: 200,
  },
]

const autoOrderDetail = createUniversalSlice('autoOrderDetail', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = autoOrderDetail.actions
export const autoOrderDetailSlice = autoOrderDetail.reducer
