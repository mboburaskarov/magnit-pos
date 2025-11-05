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
    field: 'material_code',
    hide: false,
    minWidth: 80,
    width: 80,
  },
  {
    field: 'store_name',
    hide: false,
    minWidth: 60,
    width: 200,
  },
  {
    field: 'product_name',
    hide: false,
    minWidth: 220,
    flex: 1,
  },
  {
    field: 'producer_name',
    hide: false,
    minWidth: 70,
    width: 220,
  },
  {
    field: 'serial_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'expire_date',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'quantity',
    hide: false,
    minWidth: 70,
    width: 158,
  },

  {
    field: 'supply_price',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'retail_price',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'supply_price_sum',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'retail_price_sum',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'markup_sum',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'vat_sum',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'total_discount',
    hide: false,
    minWidth: 70,
    width: 158,
  },
  {
    field: 'completed_at',
    hide: false,
    minWidth: 70,
    width: 190,
  },
  {
    field: 'full_name',
    hide: false,
    minWidth: 70,
    width: 180,
  },
  {
    field: 'sale_number',
    hide: false,
    minWidth: 70,
    width: 150,
  },
  {
    field: 'marking_count',
    hide: false,
    minWidth: 120,
    width: 130,
  },
]

const productReportTableColumns = createUniversalSlice('productReportTableColumns', columns)

export const { resetTableHeader, updateTableHeader, removeCustomColumn, setTableColumns, resetColumnsWidth, changeColumnSequence } =
  productReportTableColumns.actions
export const productReportTableColumnsSlice = productReportTableColumns.reducer
