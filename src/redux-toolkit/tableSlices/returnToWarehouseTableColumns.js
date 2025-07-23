import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 200,
  },

  {
    field: 'document_number',
    hide: false,
    minWidth: 280,
    flex: 1,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 250,
  },

  {
    field: 'received_count',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'retail_price',
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
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'created_by',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'updated_by',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'accepted_by',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 350,
  },
  {
    field: 'import_date',
    hide: false,
    minWidth: 70,
    width: 370,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 120,
    width: 120,
  },
]

const returnToWarehouseTableColumns = createSlice({
  name: 'returnToWarehouseTableColumns',
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
  returnToWarehouseTableColumns.actions
export const returnToWarehouseTableColumnsSlice = returnToWarehouseTableColumns.reducer
