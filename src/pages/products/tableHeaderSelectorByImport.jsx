import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get, head } from 'lodash'
import { memo } from 'react'
import Highlighter from 'react-highlight-words'
import { useNavigate } from 'react-router-dom'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import CheckAccess from '../../../components/CheckAccess'
import thousandDivider from '../../../utils/thousandDivider'
import { products_statuses } from '../../assets/data/products-statuses'
import DeleteIcon from '../../assets/icons/DeleteIcon'
import EditIcon from '../../assets/icons/EditIcon'

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
        img: {
          width: '40px',
        },
        '.has-img': {
          width: '25px',
        },
      }}
    >
      {get(data, 'photos')?.length > 0 ? (
        <img className='has-img' src={import.meta.env.VITE_FILE_API_URL + '/v1/upload/' + head(get(data, 'photos'))} />
      ) : (
        <img src='/no-img.png' />
      )}
    </Box>
  )
}
const CustomHeader = (props) => {
  const lastStort = props.column.colDef.orderStoring
  const currentColId = props.column.colId
  const orderPosition = lastStort?.position || 0
  const ordercolId = lastStort?.colId || 0
  const onClick = () => {
    let newOrder = { position: 0, colId: '' }
    if (lastStort) {
      if (orderPosition == 2 && ordercolId == props.column.colId) {
        newOrder = {
          position: 0,
          colId: '',
        }
      } else {
        if (ordercolId != props.column.colId && ordercolId != '') {
          newOrder = {
            position: 1,
            colId: props.column.colId,
          }
        } else {
          newOrder = {
            position: orderPosition + 1,
            colId: props.column.colId,
          }
        }
      }
    }

    // Toggle sort direction manually
    props.column.colDef.setOrderStoring(newOrder)
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        padding: '12px',
        alignItems: 'center',
        textOverflow: 'ellipsis',
        alignSelf: 'stretch',
      }}
    >
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#111217',
          fontSize: '16px',
          fontWeight: ' 600',
          lineHeight: '24px',
        }}
      >
        {props.displayName}
        <Box height={'18px'} ml='10px'>
          {orderPosition == 1 && currentColId == ordercolId && <ArrowUpward color='#ccc' />}
          {orderPosition == 2 && currentColId == ordercolId && <ArrowDownward color='#ccc' />}
        </Box>
      </Typography>
    </Box>
  )
}
export default function tableHeaderSelector({
  productsColumns,
  values,
  setImages,
  editable = false,
  t,
  setOrderStoring,
  orderStoring,
  setMarkingRequired,
  setOpenConfirmDialog,
  setOpenProductDrawer,
  changeBarcode,
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const getDateColor = (date) => {
    if (date >= 90) return { color: theme.palette.green[700] }
    if (date > 60 && date < 90) return { color: theme.palette.orange[400] }
    if (date > 30 && date < 60) return { color: theme.palette.red[400] }
    if (date < 30) return { color: theme.palette.bunker[950] }
  }
  const columns = productsColumns?.map((el) => {
    if (el.field === 'main_photo') {
      return {
        ...el,
        headerName: t('table_columns.photo'),
        colId: el.field,
        suppressCellFlash: true,
        cellRenderer: memo((p) => <Image {...p} setImages={setImages} />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerComponent: CustomHeader,
        orderStoring,
        setOrderStoring,
        headerName: t('table_columns.name'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box
            sx={{ '& span': { color: 'orange.500', whiteSpace: 'pre-line' }, '& .highlighter': { color: 'orange.500' }, cursor: 'pointer' }}
            onClick={() => setOpenProductDrawer(p.data.id)}
          >
            <Highlighter highlightClassName='highlighter' searchWords={[values?.search]} autoEscape textToHighlight={`${p.data?.name}`} />
          </Box>
        )),
      }
    }
    if (el.field === 'sum') {
      return {
        ...el,
        headerName: t('table_columns.price'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='sum' />),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: t('table_columns.store'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' {...p} type='store_name' />),
      }
    }
    if (el.field === 'retail_price') {
      return {
        ...el,
        headerName: t('table_columns.retail_price'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='retail_price' />),
      }
    }
    if (el.field === 'vat') {
      return {
        ...el,
        headerName: t('table_columns.vat'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='%' withDevider {...p} type='vat' />),
      }
    }
    if (el.field === 'import_number') {
      return {
        ...el,
        headerName: 'Номер Импорта',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type='import_number' />),
      }
    }
    if (el.field === 'serial_number') {
      return {
        ...el,
        headerName: 'Серия',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' withDevider {...p} type='serial_number' />),
      }
    }
    if (el.field === 'markup') {
      return {
        ...el,
        headerName: 'Наценка',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='%' withDevider {...p} type='markup' />),
      }
    }
    if (el.field === 'markup_price') {
      return {
        ...el,
        headerName: 'Цена наценка',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='markup_price' />),
      }
    }
    if (el.field === 'vat_price') {
      return {
        ...el,
        headerName: t('table_columns.vat_price'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='vat_price' />),
      }
    }
    if (el.field === 'supply_price') {
      return {
        ...el,
        headerName: t('table_columns.supply_price'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='сум' withDevider {...p} type='supply_price' />),
      }
    }
    if (el.field === 'status') {
      return {
        ...el,
        headerName: t('table_columns.status'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`products-status-${rowIndex}`}
            bgcolor={products_statuses.find((el) => el.id === data.status)?.color}
            title={products_statuses.find((el) => el.id === data.status)?.name}
          />
        )),
      }
    }

    if (el.field === 'manufacturer') {
      return {
        ...el,
        headerName: t('table_columns.manufacturer'),
        colId: el.field,

        cellRenderer: memo((p) => <SimpleText type={'producer_name'} {...p} />),
      }
    }

    if (el.field === 'number') {
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

    if (el.field === 'barcode') {
      return {
        ...el,
        editable: editable,

        headerName: t('table_columns.barcode'),
        colId: el.field,
        cellRenderer: memo((p) => {
          return <SimpleText currency='' {...p} type='barcode' />
        }),
      }
    }
    if (el.field === 'mxik') {
      return {
        ...el,
        editable: editable,

        headerName: 'MXIK',
        colId: el.field,
        cellRenderer: memo((p) => {
          return <SimpleText currency='' {...p} type='mxik' />
        }),
      }
    }
    if (el.field === 'unit_code') {
      return {
        ...el,
        headerName: 'Код упаковки',
        colId: el.field,
        editable: editable,

        cellRenderer: memo((p) => {
          return <SimpleText currency='' {...p} type='unit_code' />
        }),
      }
    }
    if (el.field === 'unit_label') {
      return {
        ...el,
        headerName: 'Н.упак',
        colId: el.field,
        editable: editable,

        cellRenderer: memo((p) => {
          return <SimpleText currency='' {...p} type='unit_label' />
        }),
      }
    }
    if (el.field === 'material_code') {
      return {
        ...el,
        headerName: 'Код продукта',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='' {...p} type='material_code' />),
      }
    }
    if (el.field === 'product_variability') {
      return {
        ...el,
        headerName: 'Ishlab chiqaruvchi',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText currency='sum' withDevider {...p} type='product_variability' />),
      }
    }

    if (el.field === 'quantity') {
      return {
        ...el,
        headerName: t('table_columns.quantity'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography fontWeight={'600'} fontSize={'16px'} lineHeight={'24px'}>
            {p?.data?.unit_per_pack > 0 && p?.data?.unit_quantity > 0
              ? `${p.data.quantity} (${p.data.unit_quantity}/${p.data.unit_per_pack})`
              : `${thousandDivider(p?.data?.quantity)}`}
          </Typography>
        )),
      }
    }
    if (el.field === 'expire_date') {
      return {
        ...el,
        headerName: t('table_columns.expire_date'),
        colId: el.field,
        editable: editable,
        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            {p.data?.['expire_date'] ? (
              <>
                <Typography>{dayjs(p.data?.['expire_date']).format('DD.MM.YYYY')}</Typography>
                <Typography color={getDateColor(p.data['expire_day'])}>{p.data['expire_day']} kun</Typography>
              </>
            ) : (
              <Typography>Выберите филиал</Typography>
            )}
          </Box>
        )),
      }
    }
    if (el.field === 'created_at') {
      return {
        ...el,
        headerName: 'Дата импорта',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'created_at'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            {p.data?.['created_at'] ? (
              <>
                <Typography>{dayjs(p.data?.['created_at']).format('DD.MM.YYYY')}</Typography>
              </>
            ) : (
              <Typography>Выберите филиал</Typography>
            )}
          </Box>
        )),
      }
    }
    if (el.field === 'required_marking') {
      return {
        ...el,
        headerName: 'Маркировка',
        colId: el.field,

        cellRenderer: memo((p) => (
          <Box sx={{ pt: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <input
              onChange={(e) => setMarkingRequired({ is_marking: e.target.checked, product_id: p.data.product_id, id: p.data.id })}
              defaultChecked={get(p, 'data.is_marking', false)}
              name='checkbox_zero'
              className='customCheckbox'
              type='checkbox'
            />
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
          <Box display='inline-flex' columnGap={'8px'}>
            <CheckAccess id={'edit-product'}>
              <IconButton onClick={() => navigate(`/products/edit/${data.id}`)} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <EditIcon />
              </IconButton>
            </CheckAccess>
            <CheckAccess id={'delete-product'}>
              <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <DeleteIcon />
              </IconButton>
            </CheckAccess>
          </Box>
        )),
      }
    }
  })

  return columns
}
