import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'id',
    hide: false,
    minWidth: 70,
    width: 100,
  },
  {
    field: 'photo',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'full_name',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'balance',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'orders_count',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'paid_orders_count',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'card_number',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'pinfl',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 70,
    width: 200,
  },
]

const courierstableColumns = createSlice({
  name: 'courierstableColumns',
  initialState: {
    columns,
  },
  reducers: {
    updateTableHeader(state, action) {
      state.columns = action.payload
    },
    resetTableHeader(state) {
      state.columns = columns
    },
  },
})

export const { resetTableHeader, updateTableHeader } = courierstableColumns.actions
export const couriersColumns = courierstableColumns.reducer
