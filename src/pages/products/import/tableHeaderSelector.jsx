import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../../utils/thousandDivider'
import { products_statuses } from '../../../assets/data/products-statuses'
import DefaultImgIcon from '../../../assets/icons/defaultImgIcon'
import { imports_list_statuses } from '../../../assets/data/imports-list-statuses'

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

export default function tableHeaderSelector({ importsColumns, values, setImages, t, setOpenConfirmDialog, setIsDrawerOpen }) {
  const theme = useTheme()
  const getDateColor = (date) => {
    if (date > 25) return { color: theme.palette.green[700] }
    if (date > 3 && date < 25) return { color: theme.palette.orange[400] }
    if (date < 3) return { color: theme.palette.red[400] }
  }
  // const { values } = useQueryParams()
  const columns = importsColumns?.map((el) => {
    if (el.field === 'public_id') {
      return {
        ...el,
        headerName: '№',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type='public_id' />),
      }
    }
    if (el.field === 'document_number') {
      return {
        ...el,
        headerName: 'Номер импорта',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Link to={`/products/imports/${p.data.id}`}>
            <Typography fontWeight={'600'} color={'orange.500'} fontSize={'16px'} lineHeight={'24px'}>
              {p.data.document_number}
            </Typography>
          </Link>
        )),
      }
    }
    if (el.field === 'status') {
      return {
        ...el,
        headerName: t('table_columns.status'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <StatusCell
            id={`products-status-${p.rowIndex}`}
            color={imports_list_statuses.find((el) => el.id === p.data.status)?.color}
            bgcolor={imports_list_statuses.find((el) => el.id === p.data.status)?.bgcolor}
            title={imports_list_statuses.find((el) => el.id === p.data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'import_date') {
      return {
        ...el,
        headerName: 'Дата импорта',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['import_date']).format('DD.MM.YYYY HH.mm.ss')}</Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'accepted_amount') {
      return {
        ...el,
        headerName: 'Принятая сумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='accepted_amount' />),
      }
    }
    if (el.field === 'received_amount') {
      return {
        ...el,
        headerName: 'Полученная сумма',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='received_amount' />),
      }
    }
    if (el.field === 'received_count') {
      return {
        ...el,
        headerName: 'Количество принятых',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type='received_count' />),
      }
    }
    if (el.field === 'accepted_count') {
      return {
        ...el,
        headerName: 'Принятый счет',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type='accepted_count' />),
      }
    }
    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Дата создания',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'import_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['created_at']).format('DD.MM.YYYY HH.mm.ss')}</Typography>
          </Box>
        )),
      }
    }
  })

  return columns
}
