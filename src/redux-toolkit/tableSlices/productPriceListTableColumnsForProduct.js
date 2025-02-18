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
    minWidth: 70,
    width: 194,
  },
  {
    field: 'supply_price',
    hide: false,
    minWidth: 70,
    width: 220,
  },

  {
    field: 'markup',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'vat',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 220,
  },
  {
    field: 'bonus_percent',
    hide: false,
    minWidth: 70,
    width: 150,
  },
]

const productPriceListTableColumnsForProduct = createSlice({
  name: 'productPriceListTableColumnsForProduct',
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
  productPriceListTableColumnsForProduct.actions
export const productPriceListTableColumnsForProductSlice = productPriceListTableColumnsForProduct.reducer
