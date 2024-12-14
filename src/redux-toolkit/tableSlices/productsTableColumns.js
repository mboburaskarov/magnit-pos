import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'main_photo',
    hide: false,
    minWidth: 70,
    width: 90,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 70,
    width: 370,
  },
  {
    field: 'category',
    hide: false,
    minWidth: 70,
    width: 170,
  },

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
  // {
  //   field: 'status',
  //   hide: false,
  //   minWidth: 70,
  //   width: 158,
  // },
  {
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 250,
  },

  {
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 176,
  },

  // {
  //   field: 'product_variability',
  //   hide: false,
  //   minWidth: 70,
  //   width: 200,
  // },
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
      // if (typeof action.payload?.refetch === 'function') action.payload?.refetch()
      // state.loading = true

      // const existingColumns = state.columns
      // const newColumns = columns
      // const existingColumnsMap = new Map(existingColumns.map((col) => [col.field, col]))
      // newColumns.forEach((newCol) => {
      //   const existingCol = existingColumnsMap.get(newCol.field)

      //   if (existingCol) {
      //     existingCol.width = newCol.width
      //     existingCol.hide = newCol.hide
      //     existingColumnsMap.delete(newCol.field)
      //   } else {
      //     state.columns.push(newCol)
      //   }
      // })
      // state.columns = state.columns.filter((col) => !existingColumnsMap.has(col.field))
      // state.loading = false
      state.columns = columns
    },
  },
})

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  productsTableColumns.actions
export const productsTableColumnsSlice = productsTableColumns.reducer
