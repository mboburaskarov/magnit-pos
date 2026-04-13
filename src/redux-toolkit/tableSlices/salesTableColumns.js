import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'sale_number',
    hide: false,
    minWidth: 60,
    width: 230,
  },
  {
    field: 'document',
    hide: false,
    minWidth: 250,
    flex: 1,
  },

  {
    field: 'total_amount',
    hide: false,
    minWidth: 70,
    width: 160,
  },

  {
    field: 'cash',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'humo',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'uzcard',
    hide: false,
    minWidth: 70,
    width: 160,
  },

  {
    field: 'payme',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'click',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'alif',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'uzum',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'uzum_tez_kor',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'loyalty_card',
    hide: false,
    minWidth: 70,
    width: 160,
  },

  {
    field: 'total_discount',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'created_at_time',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'store',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'employee',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'customer',
    hide: false,
    minWidth: 70,
    width: 250,
  },
]

const salesTableColumns = createUniversalSlice('salesTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = salesTableColumns.actions
export const salesTableColumnsSlice = salesTableColumns.reducer
