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
    minWidth: 194,
    flex: 1,
  },
  {
    field: 'supply_price',
    hide: false,
    minWidth: 70,
    width: 220,
  },

  {
    field: 'markup',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'vat',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 220,
  },
  {
    field: 'bonus_percent',
    hide: false,
    minWidth: 70,
    width: 150,
  },
]

const productPriceListTableColumnsForProduct = createUniversalSlice('productPriceListTableColumnsForProduct', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  productPriceListTableColumnsForProduct.actions
export const productPriceListTableColumnsForProductSlice = productPriceListTableColumnsForProduct.reducer
