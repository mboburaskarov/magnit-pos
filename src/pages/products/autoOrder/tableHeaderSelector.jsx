import { Box, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../../utils/thousandDivider'
import { imports_list_statuses } from '../../../assets/data/imports-list-statuses'
import DefaultImgIcon from '../../../assets/icons/defaultImgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleDown, faArrowCircleUp, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import palette from '../../../../src/assets/theme/mui.config'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400', textDecoration: type == 'name' && data['expire_day'] < 0 && 'line-through' }}
      id={`product-${type}-${rowIndex}`}
    >
      {withDevider ? thousandDivider(data?.[type], currency) : data?.[type] || '-'}
    </Typography>
  )
}

const Image = ({ data, rowIndex, setImages }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '40px',
        height: '40px',
        borderRadius: 2,
        '&:hover': {
          '#overlay_image': {
            opacity: 0.5,
          },
        },
      }}
    >
      {data?.main_photo?.[0] ? (
        <img
          id={`product-image-${rowIndex}`}
          src={data?.main_photo || '/default-img.avif'}
          alt={data?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <DefaultImgIcon />
      )}
      {data?.files?.[0] && (
        <Box
          sx={{
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            opacity: 0,
            borderRadius: 2,
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            bgcolor: 'green.600',
            position: 'absolute',
            zIndex: 2,
          }}
          id='overlay_image'
          onClick={() => setImages({ data: data?.files })}
        />
      )}
    </Box>
  )
}

export default function tableHeaderSelector({ importsColumns, t }) {
  const columns = importsColumns?.map((el) => {
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'Филиал',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_name' />),
      }
    }
    if (el.field === 'product_name') {
      return {
        ...el,
        headerName: 'Наименование',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='product_name' />),
      }
    }

    if (el.field === 'current_stock') {
      return {
        ...el,
        headerName: 'Остаток',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='current_stock' />),
      }
    }
    if (el.field === 'monthly_quantity') {
      return {
        ...el,
        headerName: 'Продажа месяц средняя',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='monthly_quantity' />),
      }
    }
    if (el.field === 'weekly_quantity') {
      return {
        ...el,
        headerName: '7 дней продажа',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='weekly_quantity' />),
      }
    }
    if (el.field === 'order_growth') {
      return {
        ...el,
        headerName: 'Заказ 7 дней ( +Прирост 10%)',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='order_growth' />),
      }
    }
    if (el.field === 'order_lead_time') {
      return {
        ...el,
        headerName: 'Плечо заказа. 6 раз / в неделю.',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='order_lead_time' />),
      }
    }

    if (el.field === 'suggested_order') {
      return {
        ...el,
        headerName: 'Заказ итог',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='suggested_order' />),
      }
    }
    if (el.field === 'adjusted_order') {
      return {
        ...el,
        headerName: 'Заказ итог',
        colId: el.field,
        cellRenderer: memo((p) => (
          <TextField
            id={`net_amount_${p?.data?.store_id + p?.data?.product_id}`}
            defaultValue={p?.data?.suggested_order}
            name={`adjusted_order_${p?.data?.id}`}
            type='number'
          />
        )),
      }
    }
  })

  return columns
}
