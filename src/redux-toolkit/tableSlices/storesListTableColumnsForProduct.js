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
    field: 'amount',
    hide: false,
    minWidth: 70,
    width: 220,
  },

  {
    field: 'min_amount',
    hide: false,
    minWidth: 70,
    width: 220,
  },
]

const storesListTableColumnsForProduct = createSlice({
  name: 'storesListTableColumnsForProduct',
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
  storesListTableColumnsForProduct.actions
export const storesListTableColumnsForProductSlice = storesListTableColumnsForProduct.reducer
