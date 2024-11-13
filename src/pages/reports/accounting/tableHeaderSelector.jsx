import { memo } from 'react'
import { IconButton, Typography } from '@mui/material'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../../utils/thousandDivider'
import { user_activity_types } from '../../../assets/data/user-statuses'
import TickIcon from '../../../assets/icons/TickIcon'

export default function tableHeaderSelector({ setOpenConfirmDialog, isNonPaid }) {
  const columns = [
    {
      width: 100,
      minWidth: 100,
      headerName: 'ID',
      colId: 'id',
      cellRenderer: memo(({ data }) => <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }}>{data?.orderNumber || 'Неопределенный'}</Typography>),
    },
    {
      width: 200,
      minWidth: 200,
      headerName: 'Название магазина',
      colId: 'shop_name',
      cellRenderer: memo(({ data }) => (
        <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line', color: !data?.shopName && 'grey.400' }}>{data?.shopName || 'Неопределенный'}</Typography>
      )),
    },
    {
      width: 240,
      minWidth: 240,
      headerName: 'Имя',
      colId: 'name',
      cellRenderer: memo(({ data }) => (
        <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line', color: !data?.fullName && 'grey.400' }}>{data?.fullName || 'Неопределенный'}</Typography>
      )),
    },

    {
      width: 190,
      minWidth: 190,
      colId: 'activity_type',
      headerName: 'Тип деятельности',
      cellRenderer: memo(({ data, rowIndex }) => (
        <StatusCell
          id={`report-accounting-status-${rowIndex}`}
          bgcolor={user_activity_types.find((el) => el.id === (data?.activityType || data?.contract?.activityType))?.color}
          title={user_activity_types.find((el) => el.id === (data?.activityType || data?.contract?.activityType))?.name}
        />
      )),
    },
    {
      width: 100,
      minWidth: 100,
      headerName: 'Маржа',
      colId: 'margin',
      cellRenderer: memo(({ type, rowIndex, data }) => (
        <Typography style={{ whiteSpace: 'pre-line' }} id={`report-accounting-${type}-${rowIndex}`}>
          {data?.percentage} %
        </Typography>
      )),
    },
    {
      width: 160,
      minWidth: 160,
      headerName: 'Контакт номер',
      colId: 'contractNumber',
      cellRenderer: memo(({ type, rowIndex, data }) => (
        <Typography style={{ whiteSpace: 'pre-line' }} id={`report-accounting-${type}-${rowIndex}`}>
          {data?.contractNumber}
        </Typography>
      )),
    },
    {
      width: 205,
      minWidth: 205,
      headerName: 'Дата контракта',
      colId: 'contract_date',
      cellRenderer: memo(({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='contractDate' format='DD.MM.YYYY HH:mm' />),
    },
    {
      width: 170,
      minWidth: 170,
      headerName: 'Общая сумма',
      colId: 'total_amount',
      cellRenderer: memo(({ data, rowIndex, type }) => (
        <Typography style={{ whiteSpace: 'pre-line' }} id={`report-accounting-${type}-${rowIndex}`}>
          {thousandDivider(data?.totalAmount, 'сум')}
        </Typography>
      )),
    },

    {
      width: 200,
      minWidth: 200,
      headerName: 'ИНН/ПИНФЛ',
      colId: 'inn_or_pinfl',
      cellRenderer: memo(({ type, rowIndex, data }) => (
        <Typography style={{ whiteSpace: 'pre-line' }} id={`report-accounting-${type}-${rowIndex}`}>
          {data?.contract?.pin || data?.contract?.tin || data?.tin || data?.pin}
        </Typography>
      )),
    },
    {
      width: 120,
      minWidth: 120,
      headerName: 'Оплатить',
      colId: 'action',
      cellRenderer: memo(({ data }) =>
        isNonPaid ? (
          <IconButton onClick={() => setOpenConfirmDialog(data._id)} sx={{ borderRadius: 3, p: '14px', ml: 1 }}>
            <TickIcon />
          </IconButton>
        ) : (
          ''
        )
      ),
    },
  ]

  return columns
}
