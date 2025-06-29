import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'material_code',
    hide: false,
    minWidth: 80,
    width: 80,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 60,
    width: 400,
  },
  {
    field: 'total_amount',
    hide: false,
    minWidth: 220,
    flex: 1,
  },

  {
    field: 'sale_date',
    hide: false,
    minWidth: 60,
    width: 200,
  },
  {
    field: 'cash',
    hide: false,
    minWidth: 70,
    width: 220,
  },
  {
    field: 'humo',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'uzcard',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'click',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'return_amount',
    hide: false,
    minWidth: 70,
    width: 158,
  },

  {
    field: 'cheque_count',
    hide: false,
    minWidth: 220,
    flex: 1,
  },
]

const storeReportTableColumns = createSlice({
  name: 'storeReportTableColumns',
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
  storeReportTableColumns.actions
export const storeReportTableColumnsSlice = storeReportTableColumns.reducer
