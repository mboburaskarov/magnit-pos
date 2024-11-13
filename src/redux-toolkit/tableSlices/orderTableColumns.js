import { createSlice } from '@reduxjs/toolkit'
import arrayMove from '../../../utils/arrayMove'

const columns = [
  {
    field: 'id',
    hide: false,
    minWidth: 70,
    initialWidth: 120,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 200,
    width: 300,
  },
  {
    field: 'shop_name',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'client',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'receiver',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'created_date',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'pickup_date',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'delivery_date',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'products_count',
    hide: false,
    minWidth: 70,
    width: 100,
  },
  {
    field: 'total_amount',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'deliveryService',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'delivery_price',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'payment_method',
    hide: false,
    minWidth: 70,
    width: 186,
  },
  {
    field: 'source',
    hide: false,
    minWidth: 70,
    width: 186,
  },
  {
    field: 'moderator_name',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'operator_name',
    hide: false,
    minWidth: 70,
    width: 252,
  },
  {
    field: 'last_order_note',
    hide: false,
    minWidth: 70,
    width: 225,
  },
  {
    field: 'create_order_note',
    hide: false,
    minWidth: 320,
    width: 320,
  },
]

const orderTableColumns = createSlice({
  name: 'orderTableColumns',
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

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = orderTableColumns.actions
export const orderTableColumnsSlice = orderTableColumns.reducer
