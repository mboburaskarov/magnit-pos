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
    minWidth: 100,
    width: 450,
    resizable: true,
  },
  {
    field: 'package_count',
    hide: false,
    minWidth: 90,
    width: 90,
    resizable: true,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 90,
    width: 150,
    resizable: true,
  },
  //
  {
    field: 'current_quantity',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  {
    field: 'current_quantity_pattern',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  {
    field: 'current_price',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  //
  {
    field: 'fact_quantity',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  {
    field: 'fact_unit',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  {
    field: 'fact_quantity_pattern',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  {
    field: 'fact_price',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  //
  //
  {
    field: 'difference_quantity',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  {
    field: 'difference_quantity_pattern',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  {
    field: 'difference_price',
    hide: false,
    minWidth: 200,
    width: 150,
    resizable: true,
  },
  //
  // {
  //   field: 'retail_price',
  //   hide: false,
  //   minWidth: 200,
  //   flex: 1,
  //   resizable: true,
  // },
  // {
  //   field: 'stock_count',
  //   hide: false,
  //   minWidth: 70,
  //   width: 170,
  // },
  // {
  //   field: 'scanned_count',
  //   hide: false,
  //   minWidth: 70,
  //   width: 200,
  // },
  // {
  //   field: 'difference_count',
  //   hide: false,
  //   minWidth: 200,
  //   flex: 1,
  //   resizable: true,
  // },

  // {
  //   field: 'received_sum',
  //   hide: false,
  //   minWidth: 200,
  //   flex: 1,
  //   resizable: true,
  // },
  // {
  //   field: 'scanned_sum',
  //   hide: false,
  //   minWidth: 200,
  //   flex: 1,
  //   resizable: true,
  // },
  // {
  //   field: 'difference_sum',
  //   hide: false,
  //   minWidth: 200,
  //   flex: 1,
  //   resizable: true,
  // },
  // {
  //   field: 'expire_date',
  //   hide: false,
  //   minWidth: 200,
  //   flex: 1,
  //   resizable: true,
  // },
  // {
  //   field: 'serial_number',
  //   hide: false,
  //   minWidth: 200,
  //   flex: 1,
  //   resizable: true,
  // },
  // {
  //   field: 'material_code',
  //   hide: false,
  //   minWidth: 70,
  //   width: 158,
  // },
  // {
  //   field: 'barcode',
  //   hide: false,
  //   minWidth: 70,
  //   width: 200,
  // },
]

const inventoryWithCheckingTableColumns = createSlice({
  name: 'inventoryWithCheckingTableColumns',
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
  inventoryWithCheckingTableColumns.actions
export const inventoryWithCheckingTableColumnsSlice = inventoryWithCheckingTableColumns.reducer
