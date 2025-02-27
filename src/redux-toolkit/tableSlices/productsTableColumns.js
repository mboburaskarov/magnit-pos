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
    minWidth: 70,
    width: 370,
    pinned: 'left',
  },
  {
    field: 'main_photo',
    hide: false,
    minWidth: 70,
    width: 90,
  },
  {
    field: 'category',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  // {
  //   field: 'expire_date',
  //   hide: false,
  //   minWidth: 70,
  //   width: 250,
  // },
  {
    field: 'supply_price',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'vat',
    hide: false,
    minWidth: 70,
    width: 80,
  },
  {
    field: 'markup',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'markup_price',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'vat_price',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'sum',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'manufacturer',
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
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
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
