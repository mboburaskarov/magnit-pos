import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TruncatedText from '../../../../components/TruncatedText'
import Highlighter from 'react-highlight-words'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../../utils/thousandDivider'
import StyledTooltip from '../../../../components/StyledTooltip'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import CheckAccess from '../../../../components/CheckAccess'
import Reload from '../../../assets/icons/Reload'
import { transaction_activity_types } from '../../../assets/data/transaction-statuses'

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
    <Typography style={{ whiteSpace: 'pre-line', width: '100%', display: 'flex', alignItems: 'center' }} id={`product-${type}-${rowIndex}`}>
      {data?.isPaid && type === 'cardNumber'
        ? data?.[type]?.replace(/(.{4})/g, '$1 ')
        : !data?.isPaid && type === 'cardNumber'
        ? 'Неоплаченный '
        : withDevider
        ? `${thousandDivider(data?.[type])} / ${thousandDivider(data?.[type] - data?.[type] * (data?.shopMargin / 100), endText)} `
        : type === 'shop'
        ? data.shop.name || ''
        : data?.[type]}
      {!withDevider || (
        <div
          style={{
            fontSize: '16px',
            padding: 0,
            marginLeft: '10px',
            fontWeight: 'bold',
            backgroundColor: '#3CA98F',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            alignItems: 'center',
            color: '#fff',
            justifyContent: 'center',
            display: 'flex',
          }}
        >{`${data?.shopMargin}%`}</div>
      )}
    </Typography>
  )
}

export default function tableHeaderSelector({ orderColumns, searchTerm, setOpenConfirmDialog, setIsDrawerOpen }) {
  const columns = orderColumns?.map((el) => {
    if (el.field === 'id') {
      return {
        ...el,
        headerName: 'Заказ ID',
        colId: el.field,
        cellRenderer: memo((p) => <DefaultCell searchTerm={searchTerm} {...p} type='orderNumber' />),
      }
    }
    if (el.field === 'created_date') {
      return {
        ...el,
        headerName: 'Время оплаты',
        colId: el.field,
        cellRenderer: memo((p) => (
          // <Box
          //   onClick={() => {
          //     setIsDrawerOpen(p?.data?._id)
          //   }}
          //   sx={{ cursor: 'pointer' }}
          // >
          <TimeCell {...p} type='confirmTime' nullText={'Неоплаченный '} format='DD.MM.YYYY HH:mm' />
          // </Box>
        )),
      }
    }
    if (el.field === 'done_at') {
      return {
        ...el,
        headerName: 'Дата заказа',
        colId: el.field,
        cellRenderer: memo((p) => (
          // <Box
          //   onClick={() => {
          //     setIsDrawerOpen(p?.data?._id)
          //   }}
          //   sx={{ cursor: 'pointer' }}
          // >
          <TimeCell {...p} type='doneAt' format='DD.MM.YYYY HH:mm' />
          // </Box>
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

    if (el.field === 'status') {
      return {
        ...el,
        headerName: 'Статус',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell id={`order-status-${rowIndex}`} bgcolor={data?.isPaid ? '#119676' : '#f87171'} title={data?.isPaid ? 'Оплаченный' : 'Неоплаченный'} />
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
    if (el.field === 're_pay') {
      return {
        ...el,
        headerName: 'Повтор',
        colId: el.field,
        cellRenderer: ({ data }) => (
          <CheckAccess id={'re_pay_transaction'}>
            <Box display='inline-flex' columnGap={2}>
              {data?.isPaid ? (
                // <CheckAccess id={'shop-active'}>
                <StyledTooltip
                  title={'Деньги переведены'}
                  // hide={data.status !== 'REJECTED'}
                  hide={false}
                >
                  <IconButton
                    sx={{
                      borderRadius: 3,
                      p: '14px',
                      opacity: 0.4,
                      width: '60px',
                      height: '60px',
                      '& > svg > path': {
                        fill: `none !important`,
                      },
                      '& > svg  ': {
                        width: '60px',
                        height: '60px',
                      },
                    }}
                  >
                    <Reload />
                  </IconButton>
                </StyledTooltip>
              ) : (
                // </CheckAccess>
                <CheckAccess id={'re_pay_transaction'}>
                  <IconButton
                    onClick={() =>
                      setOpenConfirmDialog({
                        type: 're-pay',
                        shopMargin: data.shopMargin,
                        originalAmount: data.orgTotalSum,
                        shopId: data.shop._id,
                        orderNumber: data.orderNumber,
                        id: data._id,
                      })
                    }
                    sx={{
                      borderRadius: 3,
                      p: '14px',
                      width: '60px',
                      height: '60px',
                      '& > svg > path': {
                        fill: `none !important`,
                      },
                      '& > svg  ': {
                        width: '60px',
                        height: '60px',
                      },
                    }}
                  >
                    <Reload />
                  </IconButton>
                </CheckAccess>
              )}
            </Box>
          </CheckAccess>
        ),
      }
    }
    if (el.field === 'activity_type') {
      return {
        ...el,
        headerName: 'Тип деятельности',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`shop-status-${rowIndex}`}
            bgcolor={transaction_activity_types.find((el) => el.id === (data?.contract?.activityType || data?.activityType))?.color}
            title={transaction_activity_types.find((el) => el.id === (data?.contract?.activityType || data?.activityType))?.name}
          />
        )),
      }
    }
    if (el.field === 'card_number') {
      return {
        ...el,
        headerName: 'Номер карты',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='cardNumber' endText='сум' />),
      }
    }
  })

  return columns
}
