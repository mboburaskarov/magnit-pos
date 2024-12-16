/* eslint-disable no-extra-boolean-cast */
import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TruncatedText from '../../../components/TruncatedText'
import Highlighter from 'react-highlight-words'
import TimeCell from '../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../utils/thousandDivider'
import StyledTooltip from '../../../components/StyledTooltip'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
import { order_statuses } from '../../assets/data/order-statuses'
import ReOrderCourierIcon from '../../assets/icons/ReOrderCourierIcon'
import CancelCourierIcon from '../../assets/icons/CancelCourierIcon'
import OrderNoteIcon from '../../assets/icons/OrderNoteIcon'
import TimeCountdown from '../../../components/TimeCountdown'
import SelectSimple from '../../../components/Select/SelectSimple'
import HeadPhonesIcon from '../../assets/icons/HeadPhonesIcon'
import AssigneMeButton from './AssigneMeButton'
import dayjs from 'dayjs'
import CheckAccess from '../../../components/CheckAccess'
import CancelOrderIcon from '../../assets/icons/CancelOrderIcon'
import WarningIcon from '../../assets/icons/WarningIcon'
import { requests } from '../../../utils/requests'
import { checkForManual } from '../../../utils/checkForRuchnoy'

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

export default function tableHeaderSelector({
  orderColumns,
  searchTerm,
  setIsDrawerOpen,
  setIsOrderCreateNote,
  setOrderIdForNote,
  setOpenAllNotes,
  refetchNotes,
  setOpenConfirmDialog,
  operatorsList,
  assigneOperator,
  userData,
  setIsShopWarning,
  setTrackingWebview,
}) {
  const columns = orderColumns?.map((el) => {
    if (el.field === 'id') {
      return {
        ...el,
        headerName: 'Заказ ID',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box display={'flex'} gap={1} alignItems={'center'}>
            {p?.data?.deliveryService === 'NOOR' && (
              <Box
                bgcolor={'#FF6D00'}
                p={1}
                pb={0.5}
                borderRadius={7}
                sx={{ cursor: 'pointer' }}
                onClick={async () => {
                  const data = await requests.getYandexTracking({ claimId: p?.data?.claimId, service: 'NOOR' })
                  setTrackingWebview(data?.data?.route_points?.[1]?.sharing_link)
                }}
              >
                <svg width='48' height='18' viewBox='0 0 98 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M30.3124 0.117954C16.3007 1.55149 3.58289 13.3133 0.499529 27.6895C-0.119637 30.576 -0.172311 35.5759 0.392463 37.8344C1.55125 42.4674 4.66406 45.7739 9.16247 47.15C11.2762 47.7965 14.6432 48.1257 17.4034 47.9556C23.2728 47.594 28.5232 45.7668 33.8687 42.2255C36.8102 40.2769 41.4543 35.5744 43.5137 32.4597C46.1647 28.4504 47.8492 24.4699 48.8388 19.8777C49.384 17.3469 49.3872 11.9687 48.8446 9.99343C47.414 4.78577 43.9329 1.55235 38.5759 0.455699C36.4701 0.0244331 32.7224 -0.128638 30.3124 0.117954ZM78.8997 0.093658C67.5948 1.19096 57.1147 8.66997 51.665 19.5301C50.3078 22.2344 49.0346 26.0412 48.5715 28.7791C48.0341 31.9568 48.2224 36.5814 48.9845 38.9261C50.4159 43.3288 53.6921 46.2508 58.5369 47.4448C61.0606 48.067 66.5162 48.1055 69.5477 47.5226C81.4307 45.2382 92.0469 35.8101 95.9708 24.0562C97.5241 19.4035 98.0016 14.0819 97.1935 10.4327C96.022 5.14287 92.3119 1.58632 86.764 0.43377C84.9157 0.0498015 81.0661 -0.1166 78.8997 0.093658ZM33.1833 11.0866C34.6149 11.8019 35.2887 12.5314 36.0568 14.1975C36.4913 15.1398 36.5451 15.5784 36.5296 18.0555C36.5105 21.1083 36.0652 23.077 34.7254 26.0318C32.7417 30.4066 28.8113 34.4741 24.7958 36.3076C22.7347 37.2488 21.3087 37.5661 19.1835 37.5569C17.6457 37.5502 17.2873 37.4672 16.0501 36.8319C15.0102 36.2979 14.471 35.8488 13.9402 35.0746C12.9263 33.5955 12.682 32.5779 12.6928 29.8798C12.7044 27.0194 13.2387 24.79 14.6053 21.8988C17.1478 16.5207 21.1143 12.733 25.9767 11.0404C27.4292 10.5348 28.0887 10.4286 29.7942 10.4262C31.6707 10.4236 31.9755 10.483 33.1833 11.0866ZM80.8299 10.7775C82.2961 11.2771 83.7681 12.7762 84.3873 14.4007C84.7901 15.4578 84.877 16.098 84.8682 17.948C84.825 27.0656 77.3131 36.3723 69.1044 37.4782C63.3687 38.251 60.1394 34.6036 60.9686 28.2889C62.0154 20.315 67.9484 12.8343 74.8149 10.8304C76.5135 10.3348 79.4546 10.3088 80.8299 10.7775Z'
                    fill='white'
                  />
                </svg>
              </Box>
            )}
            <DefaultCell searchTerm={searchTerm} {...p} type='orderNumber' />
          </Box>
        )),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Наименования',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => {
          const isInActive = data.status === 'INACTIVE' || data.status === 'PENDING' || data.status === 'CANCELED'
          const finished = data.status === 'DONE' || data.status === 'DELIVERED'
          const isExpress = data?.isExpress
          const untilPickup = data.status === 'PAID' || data.status === 'CHECKING' || data.status === 'IN_PROGRESS'
          const untilDelivery = data.status === 'APPROVED' || data.status === 'IN_DELIVERY'
          return (
            <Box
              sx={{ bgcolor: isExpress ? '#F7900920' : 'transparent', py: 1, px: 1.5, borderRadius: 3 }}
              columnGap={1}
              alignItems='center'
              display='inline-flex'
              onClick={() => setIsDrawerOpen(data)}
            >
              <StyledTooltip
                title={
                  finished || !!data?.firstNoteTime
                    ? 'Разница реальности и ожиданий'
                    : isInActive
                    ? 'Осталось время до звонка клиенту'
                    : untilPickup
                    ? 'Осталось времени до получения заказа'
                    : untilDelivery
                    ? 'Осталось времени до доставки'
                    : 'Осталось времени до завершения заказа'
                }
              >
                {isInActive ? (
                  <TimeCountdown doneAt={data?.firstNoteTime} onlyShow={!!data?.firstNoteTime} endTime={dayjs(data?.createdAt).add(15, 'minutes')} />
                ) : finished ? (
                  <TimeCountdown doneAt={data?.deliveredAt || data?.doneAt} onlyShow endTime={data?.deliveryTime} />
                ) : untilPickup ? (
                  <TimeCountdown endTime={data?.pickupTime} />
                ) : untilDelivery ? (
                  <TimeCountdown endTime={data?.deliveryTime} />
                ) : (
                  <TimeCountdown endTime={data?.deliveryTime} />
                )}
              </StyledTooltip>
              <Typography sx={{ cursor: 'pointer' }} color='green.500'>
                Заказ
                <br /> <TimeCell color='green.500' data={data} rowIndex={rowIndex} type='createdAt' format='DD.MM.YYYY HH:mm' />
              </Typography>
            </Box>
          )
        }),
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
    if (el.field === 'deliveryService') {
      return {
        ...el,
        headerName: 'Тип доставки',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <StyledTooltip title={data?.deliveryService}>
            <Typography style={{ whiteSpace: 'pre-line' }}>{data?.deliveryService || 'Нет'}</Typography>
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'client') {
      return {
        ...el,
        headerName: 'Имя клиента',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <StyledTooltip title={'Call: ' + formatPhoneNumber('+' + data?.client?.phone)}>
            <Box display={'flex'} alignItems={'center'}>
              <img
                style={{ width: '36px', borderRadius: '50%', height: '36px', marginRight: '10px' }}
                src='https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg'
              />
              <a href={`tel:${'+' + data.client?.phone}`}>
                <Typography id={data.client?._id} style={{ whiteSpace: 'pre-line', fontSize: '20px', lineHeight: '28px', fontWeight: 500 }}>
                  {data.client?.fullName}
                </Typography>
              </a>
            </Box>
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'receiver') {
      return {
        ...el,
        headerName: 'Продавец',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <StyledTooltip title={'Call: ' + formatPhoneNumber('+' + data.receiver.phoneNumber)}>
            <a href={`tel:${'+' + data.receiver.phoneNumber}`}>
              <Typography id={data._id} style={{ whiteSpace: 'pre-line' }}>
                {data.receiver.fullName}
              </Typography>
            </a>
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'created_date') {
      return {
        ...el,
        headerName: 'Дата создания',
        colId: el.field,
        cellRenderer: memo((p) => <TimeCell {...p} type='createdAt' format='DD.MM.YYYY HH:mm' />),
      }
    }
    if (el.field === 'pickup_date') {
      return {
        ...el,
        headerName: 'Время забирания',
        colId: el.field,
        cellRenderer: memo((p) => <TimeCell {...p} type='pickupTime' format='DD.MM.YYYY HH:mm' />),
      }
    }
    if (el.field === 'status') {
      return {
        ...el,
        headerName: 'Status',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StyledTooltip title={data?.rejectedComment || 'Комментарий не определен'} hide={data.status !== 'REJECTED'}>
            <StatusCell
              id={`order-status-${rowIndex}`}
              bgcolor={order_statuses.find((el) => el.id === data.status)?.bgColor}
              color={order_statuses.find((el) => el.id === data.status)?.color}
              title={order_statuses.find((el) => el.id === data.status)?.name}
            />
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'delivery_date') {
      return {
        ...el,
        headerName: 'Дата доставки',
        colId: el.field,
        cellRenderer: memo((p) => <TimeCell {...p} type='deliveryTime' format='DD.MM.YYYY HH:mm' />),
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
    if (el.field === 'delivery_price') {
      return {
        ...el,
        headerName: 'Сумма доставки',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} type='deliveryPrice' endText='сум' />),
      }
    }
    if (el.field === 'products_count') {
      return {
        ...el,
        headerName: 'Колво продуктов',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText withDevider {...p} endText='шт' type='quantity' />),
      }
    }
    if (el.field === 'payment_method') {
      return {
        ...el,
        headerName: 'Способ оплаты',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box
            position='relative'
            sx={{
              position: 'relative',
              height: 56,
              maxHeight: 56,
              width: 160,

              '& img': {
                // borderRadius: 16,
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
        )),
      }
    }
    if (el.field === 'source') {
      return {
        ...el,
        headerName: 'Источник',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box
            position='relative'
            sx={{
              position: 'relative',
              height: 56,
              maxHeight: 56,
              width: 160,

              '& img': {
                // borderRadius: 16,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 'inherit',
              },
            }}
            key={el._id}
          >
            {data?.source}
          </Box>
        )),
      }
    }
    if (el.field === 'operator_name') {
      return {
        ...el,
        headerName: 'Оператор',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'order-operator'}>
            <Box ml={-3} sx={{ transform: 'scale(0.8)' }} position='relative' minWidth={280}>
              <SelectSimple
                isClearable={false}
                id='operator'
                name='operator'
                minWidth='auto'
                placeholder={
                  <Typography ml={4} color='#bdbdbd'>
                    Назначить оператора
                  </Typography>
                }
                uncontrolled
                options={operatorsList}
                value={data.moderator}
                onChange={(operator) =>
                  assigneOperator({
                    orderId: data._id,
                    moderatorId: operator._id,
                  })
                }
                getOptionLabel={(option) => (
                  <Typography fontSize={14} maxHeight={32} display='inline-flex' color='gray.600'>
                    <Box px={0.1} width={32}>
                      <HeadPhonesIcon size={14} />
                    </Box>
                    {option.fullName}
                  </Typography>
                )}
                filterOption={(candidate, input) => {
                  const formatText = (text) => {
                    const newText = String(text)?.toLowerCase()?.replaceAll(' ', '')
                    return newText
                  }
                  const inputFrmttd = formatText(input)
                  return formatText(candidate?.data?.fullName)?.includes(inputFrmttd) || formatText(candidate?.data?.phone)?.includes(inputFrmttd)
                }}
              />
              <AssigneMeButton
                title='Назначить себя'
                isSelected={false}
                onClick={() =>
                  assigneOperator({
                    orderId: data._id,
                    moderatorId: userData.id,
                  })
                }
              />
            </Box>
          </CheckAccess>
        )),
      }
    }
    if (el.field === 'moderator_name') {
      return {
        ...el,
        headerName: 'Модератор',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Typography sx={{ color: !data.moderator && 'gray.400' }} id={`${data._id}-moderator`} style={{ whiteSpace: 'pre-line' }}>
            {data.moderator?.fullName || 'Отсутствует'} <br /> {data.moderator?.phone && `+${data.moderator?.phone}`}
          </Typography>
        )),
      }
    }
    if (el.field === 'create_order_note') {
      return {
        ...el,
        headerName: 'Действия',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box display='flex' columnGap={1.5}>
            <CheckAccess id={'order-note'}>
              <StyledTooltip title='Добавить заметку'>
                <IconButton
                  sx={{ borderRadius: 3, padding: '14px' }}
                  onClick={() => {
                    setIsOrderCreateNote(true)
                    setOrderIdForNote(data._id)
                  }}
                >
                  <OrderNoteIcon />
                </IconButton>
              </StyledTooltip>
            </CheckAccess>
            <CheckAccess id={'order-re-order'}>
              <StyledTooltip title='Заказать курьера повторно'>
                <IconButton
                  sx={{ borderRadius: 3, padding: '14px' }}
                  onClick={() => {
                    setOpenConfirmDialog({ type: 're-order', id: data._id, orderNumber: data.orderNumber })
                  }}
                >
                  <ReOrderCourierIcon />
                </IconButton>
              </StyledTooltip>
            </CheckAccess>
            <CheckAccess id={'order-cancel-kuryer'}>
              <StyledTooltip title={!!data.claimId ? 'Отменить курьера' : 'В этом заказе нет курьера'}>
                <IconButton
                  sx={{ borderRadius: 3, padding: '14px', opacity: !data?.claimId && 0.5 }}
                  onClick={() => {
                    !!data?.claimId && setOpenConfirmDialog({ type: 'cancel', id: data?.claimId, orderNumber: data.orderNumber })
                  }}
                >
                  <CancelCourierIcon />
                </IconButton>
              </StyledTooltip>
            </CheckAccess>
            {data.status !== 'INACTIVE' && data.status !== 'PENDING' && data.status !== 'CANCELED' && data.status !== 'DONE' && (
              <CheckAccess id={'order-cancel'}>
                <StyledTooltip title={'Отменить заказ'}>
                  <IconButton
                    sx={{ borderRadius: 3, padding: '14px', opacity: !data?.claimId && 0.5 }}
                    onClick={() => {
                      setOpenConfirmDialog({ type: 'cancel-order', id: data?._id, orderNumber: data?.orderNumber })
                    }}
                  >
                    <CancelOrderIcon />
                  </IconButton>
                </StyledTooltip>
              </CheckAccess>
            )}
            <CheckAccess id={'shop-problem'}>
              <StyledTooltip title={'Дать предупреждение магазину'}>
                <IconButton
                  sx={{ borderRadius: 3, padding: '14px' }}
                  onClick={() =>
                    setIsShopWarning(() => ({
                      orderId: data?._id,
                      orderNumber: data?.orderNumber,
                      shopId: data?.shop?._id,
                    }))
                  }
                >
                  <WarningIcon />
                </IconButton>
              </StyledTooltip>
            </CheckAccess>
          </Box>
        )),
      }
    }
    if (el.field === 'last_order_note') {
      return {
        ...el,
        headerName: 'Последняя заметка',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box width={200}>
            <Typography
              color={data.lastNote ? 'green.500' : 'gray.400'}
              style={{ whiteSpace: 'nowrap', cursor: data?.lastNote ? 'pointer' : 'revert', textOverflow: 'ellipsis', overflow: 'hidden' }}
              onClick={() => {
                if (data?.lastNote) {
                  setOrderIdForNote(data._id)
                  setOpenAllNotes(true)
                  setTimeout(() => refetchNotes(), 150)
                }
              }}
            >
              {data?.lastNote ? data?.lastNote : 'Отсутствует'}
            </Typography>
          </Box>
        )),
      }
    }
  })

  return columns
}
