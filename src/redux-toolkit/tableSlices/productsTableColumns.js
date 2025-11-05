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
    minWidth: 370,
    flex: 1,
    pinned: 'left',
  },
  {
    field: 'main_photo',
    hide: false,
    minWidth: 70,
    width: 90,
  },

  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 150,
  },

  {
    field: 'manufacturer',
    hide: false,
    minWidth: 70,
    width: 290,
  },

  {
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 290,
  },

  {
    field: 'material_code',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'is_marking',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'is_checking',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'barcode',
    hide: false,
    minWidth: 260,
    flex: 1,
  },
  {
    field: 'mxik',
    hide: false,
    minWidth: 260,
    flex: 1,
  },
  {
    field: 'unit_code',
    hide: false,
    minWidth: 200,
  },
  {
    field: 'unit_label',
    hide: false,
    minWidth: 200,
  },
  {
    field: 'category',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 144,
    width: 144,
    pinned: 'right',
  },
]

const productsTableColumns = createUniversalSlice('productsTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  productsTableColumns.actions
export const productsTableColumnsSlice = productsTableColumns.reducer
