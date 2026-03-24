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
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'main_photo',
    hide: false,
    minWidth: 70,
    width: 90,
  },
  {
    field: 'import_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 150,
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
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 290,
  },

  {
    field: 'serial_number',
    hide: false,
    minWidth: 70,
    width: 290,
  },
  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 290,
  },
  {
    field: 'manufacturer',
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
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const productsTableForChangeByStoreColumns = createUniversalSlice('productsTableForChangeByStoreColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  productsTableForChangeByStoreColumns.actions
export const productsTableForChangeByStoreColumnsSlice = productsTableForChangeByStoreColumns.reducer
