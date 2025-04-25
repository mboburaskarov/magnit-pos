import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { memo } from 'react'
import Highlighter from 'react-highlight-words'
import { useNavigate } from 'react-router-dom'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import CheckAccess from '../../../components/CheckAccess'
import NumberFormatInput from '../../../components/Inputs/OutLineTextFieldThousand'
import TextField from '../../../components/Inputs/TextField'
import thousandDivider from '../../../utils/thousandDivider'
import { products_statuses } from '../../assets/data/products-statuses'
import DefaultImgIcon from '../../assets/icons/defaultImgIcon'
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
      }}
    >
      {data?.photos?.[0] ? (
        <img
          onClick={() => setImages({ data: data?.photos })}
          id={`product-image-${rowIndex}`}
          src={data?.photos[0] || '/default-img.avif'}
          alt={data?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      ) : (
        <DefaultImgIcon />
      )}
    </Box>
  )
}

export default function tableHeaderSelector({
  productsColumns,
  values,
  setImages,
  canChangebarcode,
  t,
  setMarkingRequired,
  setOpenConfirmDialog,
  setOpenProductDrawer,
  changeBarcode,
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const getDateColor = (date) => {
    if (date > 25) return { color: theme.palette.green[700] }
    if (date > 3 && date < 25) return { color: theme.palette.orange[400] }
    if (date < 3) return { color: theme.palette.red[400] }
  }
  const columns = productsColumns?.map((el) => {
    if (el.field === 'main_photo') {
      return {
        ...el,
        headerName: t('table_columns.photo'),
        colId: el.field,
        cellRenderer: memo((p) => <Image {...p} setImages={setImages} />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('table_columns.name'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box
            sx={{ '& span': { color: 'orange.500', whiteSpace: 'pre-line' }, '& .highlighter': { color: 'orange.500' }, cursor: 'pointer' }}
            onClick={() => setOpenProductDrawer(p.data.id)}
          >
            <Highlighter highlightClassName='highlighter' searchWords={[values?.search]} autoEscape textToHighlight={`${p.data.name}`} />
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
    if (el.field === 'category') {
      return {
        ...el,
        headerName: t('table_columns.category'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.data.category_name}-${p.rowIndex}`}>
            {get(p, 'data.category_name', '')}
          </Typography>
        )),
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
        cellRenderer: memo((p) => <SimpleText type={'manufacturer'} {...p} />),
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
        headerName: t('table_columns.barcode'),
        colId: el.field,
        cellRenderer: memo((p) => {
          if (!canChangebarcode) {
            return <SimpleText currency='' {...p} type='barcode' />
          } else {
            return (
              <TextField
                onBlur={({ target }) => {
                  if (p?.data?.barcode == get(target, 'value')) return

                  changeBarcode({ id: get(p, 'data.id'), barcode: get(target, 'value') })
                }}
                placeholder={'0'}
                thousandSeparator={''}
                defaultValue={p?.data?.barcode}
                id={`editable_barcode_${p?.data?.id}`}
                name={`editable_barcode_${p?.data?.id}`}
                type='number'
                fullWidth
              />
            )
          }
        }),
      }
    }
    if (el.field === 'mxik_code') {
      return {
        ...el,
        headerName: 'MXIK',
        colId: el.field,
        cellRenderer: memo((p) => {
          if (!canChangebarcode) {
            return <SimpleText currency='' {...p} type='mxik' />
          } else {
            return (
              <NumberFormatInput
                onBlur={({ target }) => {
                  if (p?.data?.barcode == get(target, 'value')) return

                  changeBarcode({ id: get(p, 'data.id'), mxik: get(target, 'value') })
                }}
                placeholder={'0'}
                thousandSeparator={''}
                defaultValue={p?.data?.mxik}
                id={`editable_mxik_${p?.data?.id}`}
                name={`editable_mxik_${p?.data?.id}`}
                type='number'
                fullWidth
              />
            )
          }
        }),
      }
    }
    if (el.field === 'unit_code') {
      return {
        ...el,
        headerName: 'Унит код',
        colId: el.field,
        cellRenderer: memo((p) => {
          if (!canChangebarcode) {
            return <SimpleText currency='' {...p} type='unit_code' />
          } else {
            return (
              <NumberFormatInput
                onBlur={({ target }) => {
                  if (p?.data?.barcode == get(target, 'value')) return

                  changeBarcode({ id: get(p, 'data.id'), unit_code: get(target, 'value') })
                }}
                placeholder={'0'}
                thousandSeparator={''}
                defaultValue={p?.data?.unit_code}
                id={`editable_unit_code_${p?.data?.id}`}
                name={`editable_unit_code_${p?.data?.id}`}
                type='number'
                fullWidth
              />
            )
          }
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
              : `${thousandDivider(p?.data?.quantity)} ${p?.data?.short_name}`}
          </Typography>
        )),
        // <SimpleText withDevider {...p} type='quantity' />),
      }
    }
    if (el.field === 'expire_date') {
      return {
        ...el,
        headerName: t('table_columns.expire_date'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Box id={`${'expire_date'}-${p.rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{dayjs(p.data?.['expire_date']).format('DD.MM.YYYY')}</Typography>
            <Typography color={getDateColor(p.data['expire_day'])}>{p.data['expire_day']} kun</Typography>
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
              onChange={(e) => setMarkingRequired({ is_marking: e.target.checked, product_id: p.data.id })}
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
