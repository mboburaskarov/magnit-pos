import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'id',
    hide: false,
    minWidth: 70,
    initialWidth: 120,
  },
  {
    field: 'activity_type',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'created_date',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'done_at',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'card_number',
    hide: false,
    minWidth: 70,
    width: 260,
  },
  {
    field: 'shop_name',
    hide: false,
    minWidth: 70,
    width: 158,
  },

  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'total_amount',
    hide: false,
    minWidth: 70,
    width: 350,
  },

  {
    field: 're_pay',
    hide: false,
    minWidth: 70,
    width: 100,
  },
]

const transactionsTableColumns = createSlice({
  name: 'transactionsTableColumns',
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

export const { resetTableHeader, updateTableHeader } = transactionsTableColumns.actions
export const transactionsTableColumnsSlice = transactionsTableColumns.reducer
