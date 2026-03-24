import { createSlice } from '@reduxjs/toolkit'
import arrayMove from '../../../utils/arrayMove'
import { createUniversalSlice } from '../helper/createUniversalSlice'

const columns = [
  {
    field: 'number',
    hide: false,
    minWidth: 60,
    width: 60,
  },
  {
    field: 'checkbox',
    hide: false,
    minWidth: 45,
    width: 45,
  },
  {
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 120,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 250,
    flex: 1,
  },
  {
    field: 'permission_count',
    hide: false,
    minWidth: 70,
    width: 160,
  },
  {
    field: 'description',
    hide: false,
    minWidth: 70,
    width: 160,
  },

  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const rolesTableColumns = createUniversalSlice('rolesTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = rolesTableColumns.actions
export const rolesTableColumnsSlice = rolesTableColumns.reducer
