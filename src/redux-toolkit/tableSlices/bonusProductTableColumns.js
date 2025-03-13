import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'product_name',
    hide: false,
    minWidth: 230,
    flex: 1,
  },

  {
    field: 'bonus',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'start_date',
    hide: false,
    minWidth: 70,
    width: 270,
  },

  {
    field: 'end_data',
    hide: false,
    minWidth: 70,
    width: 270,
  },

  // {
  //   field: 'status',
  //   hide: false,
  //   minWidth: 70,
  //   width: 170,
  // },
]

const bonusProductTableColumns = createSlice({
  name: 'bonusProductTableColumns',
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
  bonusProductTableColumns.actions
export const bonusProductTableColumnsSlice = bonusProductTableColumns.reducer
