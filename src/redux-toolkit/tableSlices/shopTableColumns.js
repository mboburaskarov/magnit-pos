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
    width: 200,
  },
  {
    field: 'activity_type',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'margin',
    hide: false,
    minWidth: 70,
    width: 94,
  },
  {
    field: 'phone_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'created_date',
    hide: false,
    minWidth: 70,
    width: 198,
  },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'location',
    hide: false,
    minWidth: 70,
    width: 280,
  },
  {
    field: 'tin_or_pinfl',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'shop_card',
    hide: false,
    minWidth: 70,
    width: 260,
  },
  {
    field: 'description',
    hide: false,
    minWidth: 70,
    width: 240,
  },
  {
    field: 'product_count',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'is_closed',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 70,
    width: 220,
  },
]

const shopTableColumns = createSlice({
  name: 'shopTableColumns',
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

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = shopTableColumns.actions
export const shopTableColumnsSlice = shopTableColumns.reducer
