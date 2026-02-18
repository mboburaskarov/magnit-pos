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
    minWidth: 200,
    width: 350,
  },

  {
    field: 'serial_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'barcode',
    hide: false,
    minWidth: 70,
    width: 200,
  },

  {
    field: 'new_retail_price',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'old_supply_price',
    hide: false,
    minWidth: 70,
    width: 300,
  },
  {
    field: 'percent',
    hide: false,
    minWidth: 70,
    width: 170,
  },
  {
    field: 'scanned_count',
    hide: false,
    minWidth: 100,
    flex: 1,
  },
]

const changePriceDetail = createUniversalSlice('changePriceDetail', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } = changePriceDetail.actions
export const changePriceDetailSlice = changePriceDetail.reducer
