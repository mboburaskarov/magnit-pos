import { createSlice } from '@reduxjs/toolkit'
import arrayMove from '../../../utils/arrayMove'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'checkbox',
    hide: false,
    minWidth: 45,
    width: 45,
  },
  {
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 120,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 250,
    flex: 1,
  },
  {
    field: 'permission_count',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'description',
    hide: false,
    minWidth: 70,
    width: 160,
  },

  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const rolesTableColumns = createSlice({
  name: 'rolesTableColumns',
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

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = rolesTableColumns.actions
export const rolesTableColumnsSlice = rolesTableColumns.reducer
