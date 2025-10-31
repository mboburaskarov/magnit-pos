import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '../../../../../components/AgGridTable/Cells/StatusCell'
import { formatPhoneNumber } from '../../../../../utils/formatPhoneNumber'
import thousandDivider from '../../../../../utils/thousandDivider'
import { seller_bonus_statuses } from '../../../../assets/data/seller-bonus-statuses'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}
const CustomHeader = (props) => {
  const lastStort = props.column.colDef.orderStoring
  const currentColId = props.column.colId
  const orderPosition = lastStort?.position || 0
  const ordercolId = lastStort?.colId || 0
  const onClick = () => {
    let newOrder = { position: 0, colId: '' }
    if (lastStort) {
      if (orderPosition == 2 && ordercolId == props.column.colId) {
        newOrder = {
          position: 0,
          colId: '',
        }
      } else {
        if (ordercolId != props.column.colId && ordercolId != '') {
          newOrder = {
            position: 1,
            colId: props.column.colId,
          }
        } else {
          newOrder = {
            position: orderPosition + 1,
            colId: props.column.colId,
          }
        }
      }
    }

    // Toggle sort direction manually
    props.column.colDef.setOrderStoring(newOrder)
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        padding: '12px',
        alignItems: 'center',
        textOverflow: 'ellipsis',
        alignSelf: 'stretch',
      }}
    >
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111217',
          fontSize: '16px',
          fontWeight: ' 600',
          lineHeight: '24px',
        }}
      >
        {props.displayName}
        <Box height={'18px'} ml='10px'>
          {orderPosition == 1 && currentColId == ordercolId && <ArrowUpward color='#ccc' />}
          {orderPosition == 2 && currentColId == ordercolId && <ArrowDownward color='#ccc' />}
        </Box>
      </Typography>
    </Box>
  )
}
export default function tableHeaderSelector({ vendorsColumns, t, setOrderStoring, orderStoring, setOpenSellerBonusHistoryDrawer }) {
  const columns = vendorsColumns?.map((el) => {
    if (el.field === 'sales_count') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Количество продаж',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          return <SimpleText withDevider {...p} type='count' />
        }),
      }
    }
    if (el.field === 'bonus_amount') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: 'Бонусы',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='amount' />),
      }
    }
    if (el.field === 'public_id') {
      return {
        ...el,

        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='public_id' />),
      }
    }
    if (el.field === 'fish') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: t('fish'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography onClick={() => setOpenSellerBonusHistoryDrawer(p.data)} sx={{ whiteSpace: 'pre-line', color: 'orange.500', cursor: 'pointer' }}>
            {get(p, 'data.[full_name]')}
          </Typography>
        )),
      }
    }
    if (el.field === 'store') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: t('branch'),
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{get(p, 'data.store_name')}</Typography>),
      }
    }
    if (el.field === 'phone') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: t('phone'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.type}-${p.rowIndex}`}>
            {formatPhoneNumber(p.data.phone)}
          </Typography>
        )),
      }
    }
    if (el.field === 'role') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: t('role'),
        colId: el.field,
        cellRenderer: memo((p) => <Typography whiteSpace={'pre-line'}>{p.data.role}</Typography>),
      }
    }

    if (el.field === 'status') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: t('status'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`products-status-${rowIndex}`}
            color={seller_bonus_statuses.find((el) => el.id === data.status)?.color || 'red.700'}
            bgcolor={seller_bonus_statuses.find((el) => el.id === data.status)?.bgcolor || 'red.10'}
            title={seller_bonus_statuses.find((el) => el.id === data.status)?.name || 'Неоплаченный'}
          />
        )),
      }
    }
  })

  return columns
}
