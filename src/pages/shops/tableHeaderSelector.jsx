import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TruncatedText from '../../../components/TruncatedText'
import Highlighter from 'react-highlight-words'
import TimeCell from '../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../utils/thousandDivider'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
import EditIcon from '../../assets/icons/EditIcon'
import DeleteIcon from '../../assets/icons/DeleteIcon'
import { shop_statuses } from '../../assets/data/shop-statuses'
import StyledTooltip from '../../../components/StyledTooltip'
import ImageCell from '../../../components/AgGridTable/Cells/ImageCell'
import LockIcon from '../../assets/icons/LockIcon'
import LockOpenIcon from '../../assets/icons/LockOpenIcon'
import { user_activity_types } from '../../assets/data/user-statuses'
import CheckAccess from '../../../components/CheckAccess'
import Process from '../../assets/icons/Process'
import Done from '../../assets/icons/Done'

// eslint-disable-next-line no-unused-vars
const DefaultCell = ({ data, rowIndex, type, st: searchTerm }) => {
  return (
    <TruncatedText>
      {data?.[type]}
      <Highlighter
        highlightClassName='highlighter'
        id={`shop-${type}-${rowIndex}`}
        searchWords={searchTerm ? searchTerm.split(' ') : []}
        autoEscape
        textToHighlight={data?.[type] || '-'}
        style={{ whiteSpace: 'pre-line' }}
        className='highlighter-preline'
      />
    </TruncatedText>
  )
}

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'grey.400' }} id={`shop-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type]}
    </Typography>
  )
}

export default function tableHeaderSelector({
  shopsColumns,
  setImages,
  navigate,
  setOpenConfirmDialog,
  setIsDrawerOpen,
  setOpenBillzDialog,
  isOpenBillzDialog,
}) {
  const socketData = JSON.parse(localStorage.getItem('socketData'))

  const handleBillzAction = (data) => {
    setOpenBillzDialog((prev) => {
      if (prev?.id !== data?._id) {
        localStorage.removeItem('socketData')
        return { id: data?._id, isOpen: true, [data?._id]: true }
      } else {
        return { id: data?._id, isOpen: true, [data?._id]: false }
      }
    })
  }
  const columns = shopsColumns?.map((el) => {
    if (el.field === 'photo') {
      return {
        ...el,
        headerName: 'Фото',
        colId: el.field,
        cellRenderer: memo(({ data }) => <ImageCell imageArr={[data?.mainPicture]} setImages={setImages} />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Наименования',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box onClick={() => setIsDrawerOpen(data._id)}>
            <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='green.500'>
              {data?.name}
            </Typography>
          </Box>
        )),
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
            bgcolor={user_activity_types.find((el) => el.id === (data?.contract?.activityType || data?.activityType))?.color}
            title={user_activity_types.find((el) => el.id === (data?.contract?.activityType || data?.activityType))?.name}
          />
        )),
      }
    }
    if (el.field === 'margin') {
      return {
        ...el,
        headerName: 'Маржа',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`shop-${type}-${rowIndex}`}>
            {data?.margin} %
          </Typography>
        )),
      }
    }
    if (el.field === 'phone_number') {
      return {
        ...el,
        headerName: 'Номер телефона',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) =>
          data?.phones?.map((phone, ind) => (
            <Typography key={ind} style={{ whiteSpace: 'pre-line' }} id={`shop-${type}-${rowIndex}`}>
              {formatPhoneNumber('+' + phone)}
            </Typography>
          ))
        ),
      }
    }
    if (el.field === 'created_date') {
      return {
        ...el,
        headerName: 'Дата создания',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => <TimeCell data={data} rowIndex={rowIndex} type='createdAt' format='DD.MM.YYYY HH:mm' />),
      }
    }

    if (el.field === 'status') {
      return {
        ...el,
        headerName: 'Статус',
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`shop-status-${rowIndex}`}
            bgcolor={shop_statuses.find((el) => el.id === data.status)?.color}
            title={shop_statuses.find((el) => el.id === data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'location') {
      return {
        ...el,
        headerName: 'Адрес магазина',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`shop-${type}-${rowIndex}`}>
            {data?.location?.name}
          </Typography>
        )),
      }
    }
    if (el.field === 'tin_or_pinfl') {
      return {
        ...el,
        headerName: 'ИНН/ПИНФЛ',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`shop-${type}-${rowIndex}`}>
            {data?.contract?.pin || data?.contract?.tin || data?.tin || data?.pin}
          </Typography>
        )),
      }
    }
    if (el.field === 'shop_card') {
      return {
        ...el,
        headerName: 'Номер карты магазина',
        colId: el.field,

        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`shop-${type}-${rowIndex}`}>
            {data?.shopCard?.replace(/(.{4})/g, '$1 ') ||
              data?.contract?.cardNumber?.replace(/(.{4})/g, '$1 ') ||
              data?.contract?.billNumber?.replace(/(.{4})/g, '$1 ')}
          </Typography>
        )),
      }
    }
    if (el.field === 'description') {
      return {
        ...el,
        headerName: 'Описание',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <StyledTooltip title={data?.description}>
            <Typography
              style={{ textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', width: 200, textOverflow: 'ellipsis' }}
              id={`shop-${type}-${rowIndex}`}
            >
              {data?.description}
            </Typography>
          </StyledTooltip>
        )),
      }
    }
    if (el.field === 'product_count') {
      return {
        ...el,
        headerName: 'Кол-во продуктов',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='productCount' />),
      }
    }
    if (el.field === 'is_closed') {
      return {
        ...el,
        headerName: 'Состояние',
        colId: el.field,
        cellRenderer: memo(({ type, rowIndex, data }) => (
          <Typography style={{ whiteSpace: 'pre-line' }} id={`shop-${type}-${rowIndex}`}>
            {data?.isClosed ? 'Закрыто' : 'Открыто'}
          </Typography>
        )),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: 'Действия',
        colId: el.field,
        cellRenderer: memo(({ data }) => {
          return (
            <CheckAccess id={'shop-edit shop-delete shop-active shop-deactive'}>
              <Box display='inline-flex' columnGap={2}>
                <CheckAccess id={'shop-edit'}>
                  <IconButton onClick={() => navigate(`/shops/edit/${data._id}`)} sx={{ borderRadius: 3, p: '14px' }}>
                    <EditIcon />
                  </IconButton>
                </CheckAccess>
                <CheckAccess id={'shop-delete'}>
                  <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                    <DeleteIcon />
                  </IconButton>
                </CheckAccess>
                {data?.status === 'ACTIVE' ? (
                  <CheckAccess id={'shop-deactive'}>
                    <IconButton onClick={() => setOpenConfirmDialog({ type: 'blocked', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                      <LockIcon color='grey' />
                    </IconButton>
                  </CheckAccess>
                ) : (
                  <CheckAccess id={'shop-active'}>
                    <IconButton onClick={() => setOpenConfirmDialog({ type: 'activate', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                      <LockOpenIcon />
                    </IconButton>
                  </CheckAccess>
                )}
                {data?.billzToken && (
                  <IconButton onClick={() => handleBillzAction(data)} sx={{ borderRadius: 3, p: '14px' }}>
                    {isOpenBillzDialog?.id === data?._id && Array.isArray(socketData) ? (
                      <Done />
                    ) : isOpenBillzDialog && isOpenBillzDialog[data?._id] && isOpenBillzDialog[data?._id] ? (
                      <Process />
                    ) : (
                      <Typography variant='h6'>Billz</Typography>
                    )}
                  </IconButton>
                )}
              </Box>
            </CheckAccess>
          )
        }),
      }
    }
  })

  return columns
}
