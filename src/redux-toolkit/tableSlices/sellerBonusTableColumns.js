import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 120,
  },
  {
    field: 'fish',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'bonus_amount',
    hide: false,
    minWidth: 150,
    width: 150,
  },
  {
    field: 'sales_count',
    hide: false,
    minWidth: 200,
    width: 200,
  },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'store',
    hide: false,
    minWidth: 70,
    width: 260,
  },
  {
    field: 'phone',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'role',
    hide: false,
    minWidth: 200,
    width: 200,
  },
]

const sellerBonusTableColumns = createSlice({
  name: 'sellerBonusTableColumns',
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

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  sellerBonusTableColumns.actions
export const sellerBonusTableColumnsSlice = sellerBonusTableColumns.reducer
