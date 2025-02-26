import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
    pinned: 'left',
  },
  {
    field: 'name',
    hide: false,
    minWidth: 70,
    width: 200,
    resizable: true,
    pinned: 'left',
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
    width: 170,
  },
  {
    field: 'supply_price_vat',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'retail_price_vat',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  // {
  //   field: 'created_by',
  //   hide: false,
  //   minWidth: 70,
  //   width: 170,
  // },
  // {
  //   field: 'accepted_by',
  //   hide: false,
  //   minWidth: 70,
  //   width: 170,
  // },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 180,
  },

  {
    field: 'count',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'amount',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'amount_vat',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  // {
  //   field: 'sender',
  //   hide: false,
  //   minWidth: 70,
  //   width: 170,
  // },
  // {
  //   field: 'recivers',
  //   hide: false,
  //   minWidth: 70,
  //   width: 170,
  // },
  // {
  //   field: 'stores',
  //   hide: false,
  //   minWidth: 70,
  //   width: 170,
  // },
]

const importDetailsTableColumns = createSlice({
  name: 'importDetailsTableColumns',
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
  importDetailsTableColumns.actions
export const importDetailsTableColumnsSlice = importDetailsTableColumns.reducer
