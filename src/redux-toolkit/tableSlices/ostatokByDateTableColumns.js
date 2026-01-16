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
    minWidth: 370,
    flex: 1,
  },

  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 150,
  },

  {
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 290,
  },

  {
    field: 'supply_price',
    hide: false,
    minWidth: 70,
    width: 176,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 176,
  },
]

const ostatokByDateTableColumns = createUniversalSlice('ostatokByDateTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  ostatokByDateTableColumns.actions
export const ostatokByDateTableColumnsSlice = ostatokByDateTableColumns.reducer
