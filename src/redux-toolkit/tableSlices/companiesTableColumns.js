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
    field: 'name',
    hide: false,
    minWidth: 380,
    flex: 1,
  },
  {
    field: 'email',
    hide: false,
    minWidth: 70,
    width: 194,
  },
  {
    field: 'phone',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'country',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'city',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'postal_code',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'legal_name',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'legal_address',
    hide: false,
    minWidth: 70,
    width: 280,
  },
  {
    field: 'company_inn',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'company_mfo',
    hide: false,
    minWidth: 70,
    width: 192,
  },
  {
    field: 'actions',
    hide: false,
    minWidth: 96,
    width: 96,
    pinned: 'right',
  },
]

const companiesTableColumns = createUniversalSlice('companiesTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  companiesTableColumns.actions
export const companiesTableColumnsSlice = companiesTableColumns.reducer
