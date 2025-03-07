import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'operation_id',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'cashbox_name',
    hide: false,
    minWidth: 250,
    flex: 1,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'start_time',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'end_time',
    hide: false,
    minWidth: 70,
    width: 300,
  },

  {
    field: 'total_expense_amount',
    hide: false,
    minWidth: 70,
    width: 200,
  },
]

const cashBoxShiftHistoryTableColumns = createSlice({
  name: 'cashBoxShiftHistoryTableColumns',
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
  cashBoxShiftHistoryTableColumns.actions
export const cashBoxShiftHistoryTableColumnsSlice = cashBoxShiftHistoryTableColumns.reducer
