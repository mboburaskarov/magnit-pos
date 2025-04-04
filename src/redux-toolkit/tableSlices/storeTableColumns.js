import { createSlice } from '@reduxjs/toolkit'
const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },

  {
    field: 'name',
    hide: false,
    minWidth: 380,
    flex: 1,
  },
  {
    field: 'detailed_name',
    hide: false,
    minWidth: 70,
    width: 194,
  },
  {
    field: 'work_hours',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'address',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'phone',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'employee_count',
    hide: false,
    minWidth: 70,
    width: 94,
  },
  {
    field: 'cash_box_count',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'store_code',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'location',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const storeTableColumns = createSlice({
  name: 'storeTableColumns',
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

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = storeTableColumns.actions
export const storeTableColumnsSlice = storeTableColumns.reducer
