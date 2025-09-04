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
    field: 'email',
    hide: false,
    minWidth: 70,
    width: 194,
  },
  {
    field: 'phone',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'country',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'city',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'postal_code',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'legal_name',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'legal_address',
    hide: false,
    minWidth: 70,
    width: 280,
  },
  {
    field: 'company_inn',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'company_mfo',
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

const companiesTableColumns = createSlice({
  name: 'companiesTableColumns',
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
  companiesTableColumns.actions
export const companiesTableColumnsSlice = companiesTableColumns.reducer
