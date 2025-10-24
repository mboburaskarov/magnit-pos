import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'checkbox',
    hide: false,
    minWidth: 45,
    width: 45,
  },
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 120,
  },
  {
    field: 'fish',
    hide: false,
    minWidth: 180,
    flex: 1,
  },
  {
    field: 'phone_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'tags',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'sale_amount',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'sale_date',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'birthday',
    hide: false,
    minWidth: 70,
    width: 198,
  },
  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'store',
    hide: false,
    minWidth: 70,
    width: 198,
  },
  {
    field: 'balance',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'debt_amount',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'action',
    hide: false,
    minWidth: 90,
    width: 90,
  },
]

const clientTableColumns = createSlice({
  name: 'clientTableColumns',
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

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = clientTableColumns.actions
export const clientTableColumnsSlice = clientTableColumns.reducer
