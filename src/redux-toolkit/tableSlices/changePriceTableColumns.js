import { createSlice } from '@reduxjs/toolkit'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'checkbox',
    hide: false,
    minWidth: 45,
    width: 60,
  },
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 45,
    width: 240,
  },

  {
    field: 'store_name',
    hide: false,
    minWidth: 70,
    width: 250,
  },

  {
    field: 'quantity',
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
    minWidth: 45,
    width: 200,
  },
  {
    field: 'updated_by',
    hide: false,
    minWidth: 45,
    width: 200,
  },
  {
    field: 'updated_at',
    hide: false,
    minWidth: 45,
    width: 200,
  },
]

const revaluationTableColumns = createUniversalSlice('revaluationTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  revaluationTableColumns.actions
export const revaluationTableColumnsSlice = revaluationTableColumns.reducer
