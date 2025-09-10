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
    field: 'final_pack_quantity',
    hide: false,
    minWidth: 220,
    flex: 1,
  },
  {
    field: 'final_unit_quantity',
    hide: false,
    minWidth: 70,
    width: 220,
  },
  {
    field: 'pack_qty',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'unit_qty',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'import_pack_change',
    hide: false,
    minWidth: 70,
    width: 158,
  },

  {
    field: 'import_unit_change',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'sales_pack_change',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'sales_unit_change',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'return_pack_change',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'return_unit_change',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'transfer_pack_change',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'transfer_unit_change',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'inventory_pack_change',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'inventory_unit_change',
    hide: false,
    minWidth: 70,
    width: 180,
  },
]

const productQuantityByDateReportTableColumns = createSlice({
  name: 'productQuantityByDateReportTableColumns',
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
  productQuantityByDateReportTableColumns.actions
export const productQuantityByDateReportTableColumnsSlice = productQuantityByDateReportTableColumns.reducer
