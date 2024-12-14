import { createSlice } from '@reduxjs/toolkit'

const columns = [
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
    field: 'fish',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'store',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'phone',
    hide: false,
    minWidth: 70,
    width: 160,
  },

  {
    field: 'role',
    hide: false,
    minWidth: 70,
    width: 120,
  },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 140,
  },

  {
    field: 'actions',
    hide: false,
    minWidth: 136,
    width: 136,
    pinned: 'right',
  },
]

const vendorsTableColumns = createSlice({
  name: 'vendorsTableColumns',
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

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = vendorsTableColumns.actions
export const vendorsTableColumnsSlice = vendorsTableColumns.reducer
