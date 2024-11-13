import { createSlice } from '@reduxjs/toolkit'
import arrayMove from '../../../utils/arrayMove'

const columns = [
  {
    field: 'photo',
    hide: false,
    minWidth: 70,
    width: 80,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 70,
    width: 310,
  },
  {
    field: 'cost',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'discount_cost',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'shop_name',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'preparation_time',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'rating_score',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'comments_count',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'product_lifetime',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 160,
    width: 220,
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
      const newColumns = arrayMove(payload?.tableColumns || state.columns, payload.oldIndex, payload.newIndex, 'sequence_number')
      state.columns = newColumns
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
      if (typeof action.payload?.refetch === 'function') action.payload?.refetch()
      state.loading = true

      const existingColumns = state.columns
      const newColumns = columns
      const existingColumnsMap = new Map(existingColumns.map((col) => [col.field, col]))
      newColumns.forEach((newCol) => {
        const existingCol = existingColumnsMap.get(newCol.field)

        if (existingCol) {
          existingCol.width = newCol.width
          existingCol.hide = newCol.hide
          existingColumnsMap.delete(newCol.field)
        } else {
          state.columns.push(newCol)
        }
      })
      state.columns = state.columns.filter((col) => !existingColumnsMap.has(col.field))
      state.loading = false
    },
  },
})

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  productsTableColumns.actions
export const productsTableColumnsSlice = productsTableColumns.reducer
