import { memo, useEffect, useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import StyledTooltip from '../../../components/StyledTooltip'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
import PayIcon from '../../assets/icons/PayIcon'
import ImageCell from '../../../components/AgGridTable/Cells/ImageCell'
import EditIcon from '../../assets/icons/EditIcon'

const ImageRenderer = memo(({ data }) => {
  const [isValidImage, setIsValidImage] = useState(true)

  useEffect(() => {
    if (data?.profilePhoto) {
      const img = new Image()
      img.src = data.profilePhoto

      img.onload = () => setIsValidImage(true)
      img.onerror = () => setIsValidImage(false)
    } else {
      setIsValidImage(false)
    }
  }, [data?.profilePhoto])

  return <ImageCell imageArr={[isValidImage ? data?.profilePhoto : '2023/06/01/1685621823743-avatar (17).svg']} />
})

export default function tableHeaderSelector({ couriersColumns, setSelectedCourier, setState }) {
  const columns = couriersColumns?.map((el) => {
    if (el.field === 'id') {
      return {
        ...el,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography>{data?.courierId || '0'}</Typography>),
      }
    }
    if (el.field === 'photo') {
      return {
        ...el,
        headerName: 'Фото',
        colId: el.field,
        cellRenderer: memo(({ data }) => <ImageRenderer data={data} />),
      }
    }
    if (el.field === 'full_name') {
      return {
        ...el,
        headerName: 'Имя',
        colId: el.field,
        cellRenderer: memo(({ data }) => {
          const name = `${data?.firstName} ${data?.lastName}`

          return (
            <StyledTooltip title={'Call: ' + formatPhoneNumber(data?.phone)}>
              <a href={`tel:${data?.phone}`}>
                <Typography sx={{ cursor: 'pointer' }} color='green.500'>
                  {name}
                </Typography>
                <Typography sx={{ cursor: 'pointer', mt: 1 }}>{data?.phone}</Typography>
              </a>
            </StyledTooltip>
          )
        }),
      }
    }
    if (el.field === 'balance') {
      return {
        ...el,
        headerName: 'Баланс',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography>{data?.balance}</Typography>),
      }
    }
    if (el.field === 'orders_count') {
      return {
        ...el,
        headerName: 'Заказы',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography>{data?.ordersCount}</Typography>),
      }
    }
    if (el.field === 'paid_orders_count') {
      return {
        ...el,
        headerName: 'Оплаченные заказы',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography>{data?.paidOrdersCount}</Typography>),
      }
    }
    if (el.field === 'card_number') {
      return {
        ...el,
        headerName: 'Номер карты',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography>{data?.cardNumber}</Typography>),
      }
    }
    if (el.field === 'pinfl') {
      return {
        ...el,
        headerName: 'PINFL',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography>{data?.pinfl}</Typography>),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: 'Действия',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title='Оплатить' placement='top'>
              <IconButton
                onClick={() => {
                  setState({ isCouriersDrawerOpen: true })
                  setSelectedCourier(data)
                }}
              >
                <PayIcon />
              </IconButton>
            </Tooltip>{' '}
            <Tooltip title='Изменить' placement='top'>
              <IconButton
                onClick={() => {
                  setState({ isEditDrawerOpen: true })
                  setSelectedCourier(data)
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )),
      }
    }
  })

  return columns
}
