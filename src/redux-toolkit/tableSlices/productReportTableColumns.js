import { createSlice } from '@reduxjs/toolkit'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'material_code',
    hide: false,
    minWidth: 80,
    width: 80,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 60,
    width: 200,
  },
  {
    field: 'product_name',
    hide: false,
    minWidth: 220,
    flex: 1,
  },
  {
    field: 'producer_name',
    hide: false,
    minWidth: 70,
    width: 220,
  },
  {
    field: 'serial_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 158,
  },

  {
    field: 'supply_price',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'supply_price_sum',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'retail_price_sum',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'markup_sum',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'vat_sum',
    hide: false,
    minWidth: 70,
    width: 158,
  },

  {
    field: 'completed_at',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'full_name',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'sale_number',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'marking_count',
    hide: false,
    minWidth: 120,
    width: 130,
  },
]

const productReportTableColumns = createSlice({
  name: 'productReportTableColumns',
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
  productReportTableColumns.actions
export const productReportTableColumnsSlice = productReportTableColumns.reducer
