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
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 200,
  },

  {
    field: 'document_number',
    hide: false,
    minWidth: 280,
    flex: 1,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 250,
  },

  {
    field: 'received_count',
    hide: false,
    minWidth: 70,
    width: 230,
  },

  {
    field: 'accepted_amount',
    hide: false,
    minWidth: 70,
    width: 230,
  },

  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 230,
  },
  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 380,
  },
  {
    field: 'import_date',
    hide: false,
    minWidth: 70,
    width: 370,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 120,
    width: 120,
  },
]

const inventoryTableColumns = createUniversalSlice('inventoryTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  inventoryTableColumns.actions
export const inventoryTableColumnsSlice = inventoryTableColumns.reducer
