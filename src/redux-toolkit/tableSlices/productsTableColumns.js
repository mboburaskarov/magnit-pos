import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
    pinned: 'left',
  },

  {
    field: 'name',
    hide: false,
    minWidth: 370,
    flex: 1,
    pinned: 'left',
  },
  {
    field: 'main_photo',
    hide: false,
    minWidth: 70,
    width: 90,
  },

  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 150,
  },

  {
    field: 'manufacturer',
    hide: false,
    minWidth: 70,
    width: 290,
  },

  {
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 290,
  },

  {
    field: 'material_code',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'is_marking',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'is_checking',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'barcode',
    hide: false,
    minWidth: 260,
    flex: 1,
  },
  {
    field: 'mxik',
    hide: false,
    minWidth: 260,
    flex: 1,
  },
  {
    field: 'unit_code',
    hide: false,
    minWidth: 200,
  },
  {
    field: 'unit_label',
    hide: false,
    minWidth: 200,
  },
  {
    field: 'category',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 144,
    width: 144,
    pinned: 'right',
  },
]

const productsTableColumns = createSlice({
  name: 'productsTableColumns',
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
  productsTableColumns.actions
export const productsTableColumnsSlice = productsTableColumns.reducer
