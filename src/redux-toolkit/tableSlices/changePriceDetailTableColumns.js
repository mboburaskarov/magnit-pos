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
    minWidth: 200,
    width: 350,
  },

  {
    field: 'serial_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'supply_price',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'percent',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'scanned_count',
    hide: false,
    minWidth: 100,
    flex: 1,
  },
]

const changePriceDetail = createSlice({
  name: 'changePriceDetail',
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

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = changePriceDetail.actions
export const changePriceDetailSlice = changePriceDetail.reducer
