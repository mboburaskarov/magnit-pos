import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'id',
    hide: false,
    minWidth: 70,
    initialWidth: 120,
  },
  {
    field: 'created_date',
    hide: false,
    minWidth: 70,
    width: 190,
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
    width: 200,
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
    width: 150,
  },
  {
    field: 'payment_method',
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
]

const qrSaleTableColumns = createSlice({
  name: 'qrSaleTableColumns',
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

export const { resetTableHeader, updateTableHeader } = qrSaleTableColumns.actions
export const qrSaleTableColumnsSlice = qrSaleTableColumns.reducer
