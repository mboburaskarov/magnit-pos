import { Box, IconButton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import StyledTooltip from '../../../../components/StyledTooltip'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import getImageUrl from '../../../../utils/getImageUrl'
import thousandDivider from '../../../../utils/thousandDivider'
import DefaultUserImgIcon from '../../../assets/icons/defaultUserImgIcon'
import StyledSwitch from '../../../../components/Switch/StyledSwitch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CheckAccess from '../../../../components/CheckAccess'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import EditIcon from '../../../assets/icons/EditIcon'
import palette from '../../../assets/theme/mui.config'
import { faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons'
import LockIcon from '../../../assets/icons/LockIcon'
import MoneyOutlineIcon from '../../../assets/icons/MoneyOutline'
import CartOutlineIcon from '../../../assets/icons/CartOutline'
const IconWrapper = ({ children, color }) => {
  return (
    <Box
      sx={(theme) => ({
        bgcolor: color,
        height: '22px',
        borderRadius: '5px',
        padding: '3px',
        '& svg': {
          width: '15px',
          height: '15px',
        },
      })}
    >
      {children}
    </Box>
  )
}
const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

export default function tableHeaderSelector({ productsColumns, t, setOpenSaleDrawer, values }) {
  const columns = productsColumns?.map((el) => {
    if (el.field === 'operation_id') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo(({ rowIndex, api, ...p }) => {
          const absoluteIndex = Number(get(values, 'offset', 0)) + 1 + rowIndex

          return (
            <Typography fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
              {absoluteIndex}
            </Typography>
          )
        }),
      }
    }

    if (el.field === 'cashbox_name') {
      return {
        ...el,
        headerName: '	Касса',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box sx={{ '& p': { color: 'orange.500' }, cursor: 'pointer' }} onClick={() => setOpenSaleDrawer({ id: p.data.id })}>
            <SimpleText {...p} type='cashbox_name' />
          </Box>
        )),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'Магазин',
        colId: el.field,

        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' />),
      }
    }

    if (el.field === 'is_open') {
      return {
        ...el,
        headerName: 'Состояние',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box>
            {get(p, 'data.is_open', false) ? (
              <Box>
                <Typography sx={(theme) => ({ fontWeight: '600', color: theme.palette.green[500] })}>Открыта с</Typography>
                <Typography>{dayjs(get(p, 'data.start_time')).format('DD.MM.YYYY HH:MM:ss')}</Typography>
              </Box>
            ) : (
              <Box>
                <Typography sx={(theme) => ({ fontWeight: '600', color: theme.palette.red[500] })}>Закрыта с</Typography>
                <Typography>{dayjs(get(p, 'data.end_time')).format('DD.MM.YYYY HH:MM:ss')}</Typography>
              </Box>
            )}
          </Box>
        )),
      }
    }
    if (el.field === 'opened_amount') {
      return {
        ...el,
        headerName: 'Сумма открытия',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box width='100%'>
            <Box display={'flex'} justifyContent={'start'} alignItems={'start'}>
              <IconWrapper color={'#2558FF'}>
                <MoneyOutlineIcon />
              </IconWrapper>
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.opened_amount, 'сум')}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'start'}>
              <IconWrapper color={'#8b5cf6'}>
                <CartOutlineIcon />
              </IconWrapper>
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.opened_cashless_amount, 'сум')}
              </Typography>
            </Box>
          </Box>
        )),
      }
    }
    if (el.field === 'current_amount') {
      return {
        ...el,
        headerName: 'Текущая касса',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box width='100%'>
            <Box display={'flex'} justifyContent={'start'} alignItems={'start'}>
              <IconWrapper color={'#2558FF'}>
                <MoneyOutlineIcon />
              </IconWrapper>
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.cash_amount, 'сум')}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'start'} alignItems={'start'}>
              <IconWrapper color={'#8b5cf6'}>
                <CartOutlineIcon />
              </IconWrapper>
              <Typography ml={'4px'} color={'bunker.500'}>
                {thousandDivider(p.data?.cashless_amount, 'сум')}
              </Typography>
            </Box>
          </Box>
        )),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'product-edit product-delete product-active product-deactive'}>
            <Box width={'76px'} justifyContent={'center'} display='inline-flex' columnGap={'8px'}>
              <CheckAccess id={'edit-product'}>
                <IconButton onClick={() => navigate(`/products/edit/${data.id}`)} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <LockIcon color='#111217' />
                </IconButton>
              </CheckAccess>
              {/* <CheckAccess id={'delete-product'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <DeleteIcon />
                </IconButton>
              </CheckAccess> */}
            </Box>
          </CheckAccess>
        )),
      }
    }
  })

  return columns
}
