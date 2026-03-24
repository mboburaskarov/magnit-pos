import { createSlice } from '@reduxjs/toolkit'

export const createUniversalSlice = (name, columns, reducers = {}) =>
  createSlice({
    name: name,
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
      ...(reducers || {}),
    },
  })
