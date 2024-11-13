import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import { formatPhoneNumber } from '../../../../../utils/formatPhoneNumber'
import ImageCell from '../../../../../components/AgGridTable/Cells/ImageCell'
import TimeCell from '../../../../../components/AgGridTable/Cells/TimeCell'
import thousandDivider from '../../../../../utils/thousandDivider'
const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`client-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}
export default function tableHeaderSelector({ userColumns }) {
  const columns = userColumns?.map((el) => {
    if (el.field === 'photo') {
      return {
        ...el,
        headerName: 'Фото',
        colId: el.field,
        cellRenderer: memo(({ data }) => {
          return <ImageCell imageArr={[data?.avatar]} />
        }),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Имя',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box>
            <Typography sx={{ whiteSpace: 'pre-line' }} color='green.500'>
              {data?.fullName || data?.name}
            </Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'phone_number') {
      return {
        ...el,
        headerName: 'Номер телефона',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`shop-${type}-${rowIndex}`}>
            {formatPhoneNumber('+' + data?.phone)}
          </Typography>
        )),
      }
    }

    if (el.field === 'last_order_date') {
      return {
        ...el,
        headerName: 'Дата последнего заказа',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='lastOrderTime' format='DD.MM.YYYY HH:mm' />),
      }
    }
    if (el.field === 'average_cheque') {
      return {
        ...el,
        headerName: 'Средний чек',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='averageCheque' />),
      }
    }
    if (el.field === 'orders_count') {
      return {
        ...el,
        headerName: 'Кол-во заказов',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='шт' withDevider {...p} type='ordersCount' />),
      }
    }
  })
  return columns
}
