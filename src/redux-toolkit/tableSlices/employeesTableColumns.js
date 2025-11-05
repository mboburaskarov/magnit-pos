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
    flex: 1,
  },
  {
    field: 'public_id',
    hide: false,
    minWidth: 60,
    width: 120,
  },
  {
    field: 'fish',
    hide: false,
    minWidth: 70,
    width: 250,
  },
  {
    field: 'store',
    hide: false,
    minWidth: 70,
    width: 260,
  },
  {
    field: 'phone',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'role',
    hide: false,
    minWidth: 120,
    width: 150,
  },
  {
    field: 'status',
    hide: false,
    minWidth: 70,
    width: 140,
  },

  {
    field: 'actions',
    hide: false,
    minWidth: 136,
    width: 136,
    pinned: 'right',
  },
]

const employeesTableColumns = createUniversalSlice('employeesTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  employeesTableColumns.actions
export const employeesTableColumnsSlice = employeesTableColumns.reducer
