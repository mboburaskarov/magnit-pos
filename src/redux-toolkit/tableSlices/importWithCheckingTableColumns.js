import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'checkbox',
    hide: false,
    minWidth: 45,
    width: 45,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 150,
    width: 200,
  },

  {
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'declared',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'scanned',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'product_activities',
    hide: false,
    minWidth: 70,
    width: 420,
  },
]

const importWithCheckingTableColumns = createSlice({
  name: 'importWithCheckingTableColumns',
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
  importWithCheckingTableColumns.actions
export const importWithCheckingTableColumnsSlice = importWithCheckingTableColumns.reducer
