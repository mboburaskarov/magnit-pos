import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { Box, IconButton, Typography } from '@mui/material'
import Highlighter from 'react-highlight-words'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/styles'
import { get, head } from 'lodash'
import { memo } from 'react'
import dayjs from 'dayjs'

import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import { products_statuses } from '../../../assets/data/products-statuses'
import StyledTooltip from '../../../../components/StyledTooltip'
import thousandDivider from '../../../../utils/thousandDivider'
import CheckAccess from '../../../../components/CheckAccess'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import CustomImg from '../../../../components/CustomImg'
import EditIcon from '../../../assets/icons/EditIcon'
import { t } from 'i18next'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'

export default function tableHeaderSelector({ orderColumns: productsColumns }) {
  const columns = productsColumns?.map((el) => {
    if (el.field === 'sale_number') {
      return {
        ...el,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='sale_number' />),
      }
    }
    //     // Online sale status
    //  SaleOnlineStageDefault   = 0
    //  SaleOnlineStageNew       = 1
    //  SaleOnlineStagePending   = 2
    //  SaleOnlineStageCanceled  = -1
    //  SaleOnlineStageCompleted = 3
    //  SaleOnlineStageWaiting   = 4
    if (el.field === 'online_status') {
      return {
        ...el,
        headerName: 'Статус',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText
            {...p}
            customText={
              p.data.online_status == '1'
                ? 'Новый'
                : p.data.online_status == '2'
                ? 'Ожидает оплаты'
                : p.data.online_status == '3'
                ? 'Оплачен'
                : p.data.online_status == '4'
                ? 'В ожидании'
                : p.data.online_status == '-1'
                ? 'Отменен'
                : ''
            }
            type='online_status'
          />
        )),
      }
    }
    if (el.field === 'payment_type') {
      return {
        ...el,
        headerName: 'Тип оплаты',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='payment_type' />),
      }
    }
    if (el.field === 'total_amount') {
      return {
        ...el,
        headerName: 'Сумма оплаты',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'сум'} type='total_amount' />),
      }
    }
    if (el.field === 'total_discount') {
      return {
        ...el,
        headerName: 'Сумма скидки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} withDevider currency={'сум'} type='total_discount' />),
      }
    }
    if (el.field === 'customer') {
      return {
        ...el,
        headerName: 'Клиент',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} customText={p?.data?.customer?.full_name} type='customer' />),
      }
    }
    if (el.field === 'store') {
      return {
        ...el,
        headerName: 'Аптека',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} customText={p.data.store.name} type='store' />),
      }
    }
    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Дата создания',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} customText={dayjs(p.data.created_at).format('DD.MM.YYYY HH:mm')} type='created_at' />),
      }
    }
    if (el.field === 'completed_at') {
      return {
        ...el,
        headerName: 'Дата оплаты',
        colId: el.field,
        cellRenderer: memo((p) => (
          <SimpleText {...p} customText={p.data.completed_at ? dayjs(p.data.completed_at).format('DD.MM.YYYY HH:mm') : 'Не оплачено'} type='completed_at' />
        )),
      }
    }
    if (el.field === 'is_paid') {
      return {
        ...el,
        headerName: 'Оплачено',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} customText={p.data.is_paid ? 'Оплаченный' : 'Не оплачено'} type='is_paid' />),
      }
    }
  })

  return columns
}
