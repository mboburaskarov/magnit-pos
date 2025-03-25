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
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='operation_id' />),
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
    if (el.field === 'start_time') {
      return {
        ...el,
        headerName: 'Открыть',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box>
            <Box sx={{ whiteSpace: 'pre-line' }} display={'flex'}>
              <Typography>{dayjs(get(p, 'data.start_time')).format('DD.MM.YYYY HH:MM:ss')}</Typography>
              <Typography sx={(theme) => ({ ml: '10px' })}>({get(p, 'data.opened_by')})</Typography>
            </Box>
          </Box>
        )),
      }
    }
    if (el.field === 'end_time') {
      return {
        ...el,
        headerName: 'Закрывать',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box>
            <Box display={'flex'} sx={{ whiteSpace: 'pre-line' }}>
              <Typography>{dayjs(get(p, 'data.end_time')).format('DD.MM.YYYY HH:MM:ss')}</Typography>
              <Typography sx={{ ml: '10px' }}>({get(p, 'data.closed_by')})</Typography>
            </Box>
          </Box>
        )),
      }
    }
    if (el.field === 'total_expense_amount') {
      return {
        ...el,
        headerName: 'Разница',
        colId: el.field,

        cellRenderer: memo((p) => (
          <Box>
            <Box
              sx={{
                bgcolor: '#E7F3FF',
                minWidth: '115px',
                minHeight: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '24px',
              }}
            >
              <Typography
                sx={{
                  backgrounf: '#E7F3FF',
                  color: '#2558FF',
                  padding: '0 10px',
                  minWidth: '150px',
                  textAlign: 'center',
                }}
              >
                {thousandDivider(get(p, 'data.total_expense_amount'), 'сум')}
              </Typography>
            </Box>
          </Box>
        )),
      }
    }
  })

  return columns
}
