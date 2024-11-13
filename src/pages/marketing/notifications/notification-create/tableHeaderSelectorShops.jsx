import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import { formatPhoneNumber } from '../../../../../utils/formatPhoneNumber'
import ImageCell from '../../../../../components/AgGridTable/Cells/ImageCell'
import StyledTooltip from '../../../../../components/StyledTooltip'
const userColumns = [
  {
    field: 'photo',
    hide: false,
    minWidth: 70,
    width: 80,
  },
  {
    field: 'name',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'phone_number',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'location',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'description',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'product_count',
    hide: false,
    minWidth: 70,
    width: 200,
  },
  {
    field: 'is_closed',
    hide: false,
    minWidth: 70,
    width: 150,
  },
]
const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`client-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}
export default function tableHeaderSelectorShops() {
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
            {data?.phones?.map((el) => (
              <Box>{formatPhoneNumber('+' + el)}</Box>
            ))}
          </Typography>
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
  })
  return columns
}
