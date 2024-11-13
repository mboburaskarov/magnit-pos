import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../../utils/thousandDivider'
import { user_activity_types } from '../../../assets/data/user-statuses'
import { checkForManual } from '../../../../utils/checkForRuchnoy'

export default function tableHeaderSelector() {
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
      width: 160,
      minWidth: 160,
      headerName: 'Номер контракта',
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
      colId: 'contractDate',
      cellRenderer: memo(({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='contractDate' format='DD.MM.YYYY HH:mm' />),
    },
    {
      width: 170,
      minWidth: 170,
      headerName: 'Общая сумма',
      colId: 'totalSum',
      cellRenderer: memo(({ data, rowIndex, type }) => (
        <Typography style={{ whiteSpace: 'pre-line' }} id={`report-accounting-${type}-${rowIndex}`}>
          {thousandDivider(data?.totalSum, 'сум')}
        </Typography>
      )),
    },

    {
      width: 200,
      minWidth: 200,
      headerName: 'ПИН',
      colId: 'pin',
      cellRenderer: memo(({ type, rowIndex, data }) => (
        <Typography sx={{ whiteSpace: 'pre-line', color: !data?.pin && 'grey.400' }} id={`report-accounting-${type}-${rowIndex}`}>
          {data?.pin || 'Неопределенный'}
        </Typography>
      )),
    },
    {
      width: 200,
      minWidth: 200,
      headerName: 'Способ оплаты',
      colId: 'paymentType',
      cellRenderer: memo(({ data }) => (
        <Box
          position='relative'
          sx={{
            position: 'relative',
            height: 56,
            maxHeight: 56,
            width: 160,

            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 'inherit',
            },
          }}
        >
          <img
            style={{ borderRadius: 16 }}
            src={
              data?.paymentType === 'OCTO'
                ? '/octo-img.jpg'
                : data?.paymentType === 'PAYME'
                ? '/payme-img.jpg'
                : data?.paymentType === 'CLICK'
                ? '/click-img.jpg'
                : data?.paymentType === 'RECEIPT'
                ? '/receipt-img.jpg'
                : data?.paymentType === 'PAYNET'
                ? '/paynet-img.jpg'
                : data?.paymentType === 'CASH'
                ? '/cash-img.jpg'
                : !data?.paymentType && !checkForManual(data?.status)
                ? '/ruchnoy-img.jpg'
                : '/none-img.jpg'
            }
            alt='image of order'
          />
        </Box>
      )),
    },
    {
      width: 205,
      minWidth: 205,
      headerName: 'Сделано в',
      colId: 'doneAt',
      cellRenderer: memo(({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='doneAt' format='DD.MM.YYYY HH:mm' />),
    },
  ]

  return columns
}
