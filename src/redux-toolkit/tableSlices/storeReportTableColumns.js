import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

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
    width: 400,
  },
  {
    field: 'total_amount',
    hide: false,
    minWidth: 220,
    flex: 1,
  },

  {
    field: 'sale_date',
    hide: false,
    minWidth: 60,
    width: 200,
  },
  {
    field: 'cash',
    hide: false,
    minWidth: 70,
    width: 220,
  },
  {
    field: 'humo',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'uzcard',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'click',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'payme',
    hide: false,
    minWidth: 70,
    width: 158,
  },

  {
    field: 'alif',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'uzum',
    hide: false,
    minWidth: 70,
    width: 158,
  },

  {
    field: 'return_amount',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'discount_amount',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'cheque_count',
    hide: false,
    minWidth: 220,
    flex: 1,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 60,
    width: 100,
  },
]

const storeReportTableColumns = createUniversalSlice('storeReportTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  storeReportTableColumns.actions
export const storeReportTableColumnsSlice = storeReportTableColumns.reducer
