import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'checkbox',
    hide: false,
    minWidth: 45,
    width: 60,
  },
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 45,
    width: 240,
  },

  {
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 250,
  },

  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'created_by',
    hide: false,
    minWidth: 45,
    width: 200,
  },
  {
    field: 'updated_by',
    hide: false,
    minWidth: 45,
    width: 200,
  },
  {
    field: 'updated_at',
    hide: false,
    minWidth: 45,
    width: 200,
  },
]

const revaluationTableColumns = createSlice({
  name: 'revaluationTableColumns',
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
  revaluationTableColumns.actions
export const revaluationTableColumnsSlice = revaluationTableColumns.reducer
