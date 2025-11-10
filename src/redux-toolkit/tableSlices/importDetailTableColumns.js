import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

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
    minWidth: 200,
    flex: 1,
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

  {
    field: 'status',
    hide: false,
    minWidth: 140,
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
]

const importDetailsTableColumns = createUniversalSlice('importDetailsTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  importDetailsTableColumns.actions
export const importDetailsTableColumnsSlice = importDetailsTableColumns.reducer
