import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'type',
    hide: false,
    minWidth: 60,
    width: 180,
  },
  {
    field: 'amount',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'expense_amount',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'net_amount',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'difference_amount',
    hide: false,
    minWidth: 70,
    width: 180,
  },
]

const cardShiftTableColumns = createSlice({
  name: 'cardShiftTableColumns',
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
  cardShiftTableColumns.actions
export const cardShiftTableColumnsSlice = cardShiftTableColumns.reducer
