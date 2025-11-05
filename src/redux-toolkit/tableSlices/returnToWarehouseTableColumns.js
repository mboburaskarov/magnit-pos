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
    width: 170,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'supply_price',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 170,
  },

  {
    field: 'created_by',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'updated_by',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'accepted_by',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 350,
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

const returnToWarehouseTableColumns = createUniversalSlice('returnToWarehouseTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  returnToWarehouseTableColumns.actions
export const returnToWarehouseTableColumnsSlice = returnToWarehouseTableColumns.reducer
