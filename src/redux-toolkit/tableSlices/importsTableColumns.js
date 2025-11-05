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
    minWidth: 160,
    flex: 1,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'created_at',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'import_date',
    hide: false,
    minWidth: 70,
    width: 180,
  },

  {
    field: 'accepted_amount_vat',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'received_count',
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
]

const importsTableColumns = createUniversalSlice('importsTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = importsTableColumns.actions
export const importsTableColumnsSlice = importsTableColumns.reducer
