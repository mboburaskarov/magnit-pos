import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import TruncatedText from '../../../../components/TruncatedText'
import Highlighter from 'react-highlight-words'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../../utils/thousandDivider'
import StyledTooltip from '../../../../components/StyledTooltip'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import { order_statuses } from '../../../assets/data/order-statuses'
import { checkForManual } from '../../../../utils/checkForRuchnoy'

const DefaultCell = ({ data, rowIndex, type, st: searchTerm }) => {
  return (
    <TruncatedText>
      {data?.[type]}
      <Highlighter
        highlightClassName='highlighter'
        id={`product-${type}-${rowIndex}`}
        searchWords={searchTerm ? searchTerm.split(' ') : []}
        autoEscape
        textToHighlight={data?.[type] || '-'}
        style={{ whiteSpace: 'pre-line' }}
        className='highlighter-preline'
      />
    </TruncatedText>
  )
}

const SimpleText = ({ data, rowIndex, type, withDevider, endText }) => {
  return (
    <Typography style={{ whiteSpace: 'pre-line' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], endText) : type === 'shop' ? data.shop.name || '' : data?.[type]}
    </Typography>
  )
}

export default function tableHeaderSelector({ orderColumns, searchTerm, setIsDrawerOpen }) {
  const columns = orderColumns?.map((el) => {
    if (el.field === 'id') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo((p) => <DefaultCell searchTerm={searchTerm} {...p} type='orderNumber' />),
      }
    }
    if (el.field === 'created_date') {
      return {
        ...el,
        headerName: 'Дата создания',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box
            onClick={() => {
              setIsDrawerOpen(p?.data?._id)
            }}
            sx={{ cursor: 'pointer' }}
          >
            <TimeCell {...p} type='createdAt' color={'green.500'} format='DD.MM.YYYY HH:mm' />
          </Box>
        )),
      }
    }
    if (el.field === 'shop_name') {
      return {
        ...el,
        headerName: 'Магазин',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <StyledTooltip title={'Call: ' + formatPhoneNumber('+' + data.shop?.phones?.[0])}>
            <a href={`tel:${'+' + data.shop?.phones?.[0]}`}>
              <Typography id={data.client?._id} style={{ whiteSpace: 'pre-line' }}>
                {data.shop?.name}
              </Typography>
            </a>
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'client') {
      return {
        ...el,
        headerName: 'Клиент',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <StyledTooltip title={'Call: ' + formatPhoneNumber('+' + data?.client?.phone)}>
            <a href={`tel:${'+' + data.client?.phone}`}>
              <Typography id={data.client?._id} style={{ whiteSpace: 'pre-line' }}>
                {data.client?.fullName}
              </Typography>
            </a>
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'status') {
      return {
        ...el,
        headerName: 'Статус',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StyledTooltip title={data?.rejectedComment || 'Комментарий не определен'} hide={data.status !== 'REJECTED'}>
            <StatusCell
              id={`order-status-${rowIndex}`}
              bgcolor={order_statuses.find((el) => el.id === data.status)?.color}
              title={order_statuses.find((el) => el.id === data.status)?.name}
            />
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'total_amount') {
      return {
        ...el,
        headerName: 'Сумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='totalSum' endText='сум' />),
      }
    }
    if (el.field === 'payment_method') {
      return {
        ...el,
        headerName: 'Способ оплаты',
        colId: el.field,
        cellRenderer: memo(({ data }) => {
          return (
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
              key={el._id}
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
          )
        }),
      }
    }
    if (el.field === 'moderator_name') {
      return {
        ...el,
        headerName: 'Модератор',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Typography sx={{ color: !data.moderator && 'grey.400' }} id={`${data._id}-moderator`} style={{ whiteSpace: 'pre-line' }}>
            {data.moderator?.fullName || 'Отсутствует'} <br /> {data.moderator?.phone && `+${data.moderator?.phone}`}
          </Typography>
        )),
      }
    }
  })

  return columns
}
