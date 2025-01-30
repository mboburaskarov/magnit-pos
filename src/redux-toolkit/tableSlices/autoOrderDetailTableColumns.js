import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'store_name',
    hide: false,
    minWidth: 60,
    width: 280,
  },

  {
    field: 'product_name',
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
]

const autoOrderDetail = createSlice({
  name: 'autoOrderDetail',
  initialState: {
    columns,
    loading: false,
  },
  reducers: {
    changeColumnSequence(state, payload) {
      state.columns = payload.payload
    },
    resetColumnsWidth(state, payload) {
      const newColumns = state.columns.map((el) => ({
        ...el,
        width: payload?.find((col) => col.field === el.field)?.width || el?.width,
      }))
      state.columns = newColumns
    },
    setTableColumns(state, payload) {
      const columns = [...state.columns]
      const accessors = state?.columns?.map((column) => column?.field)
      payload?.forEach((item) => {
        if (!accessors.includes(item?.field)) {
          columns?.push(item)
        }
      })
      state.columns = columns
    },
    removeCustomColumn(state, payload) {
      const filteredColumns = [...state.columns].filter((column) => column?.colId !== payload)
      state.columns = filteredColumns
    },
    updateTableHeader(state, action) {
      state.columns = action.payload
    },
    resetTableHeader(state, action) {
      state.columns = columns
    },
  },
})

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = autoOrderDetail.actions
export const autoOrderDetailSlice = autoOrderDetail.reducer
