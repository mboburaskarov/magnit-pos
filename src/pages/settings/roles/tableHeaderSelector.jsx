import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import TimeCell from '../../../../components/AgGridTable/Cells/TimeCell'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import thousandDivider from '../../../../utils/thousandDivider'
import { products_statuses } from '../../../assets/data/products-statuses'
import EditIcon from '../../../assets/icons/EditIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import CheckAccess from '../../../../components/CheckAccess'
import { get } from 'lodash'
import StyledTooltip from '../../../../components/StyledTooltip'

const SimpleText = ({ data, width = 'auto', rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ maxWidth: width, textOverflow: 'ellipsis', overflow: 'hidden', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
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
      <img
        id={`product-image-${rowIndex}`}
        src={data?.main_photo || '/default-img.avif'}
        alt={data?.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
      />

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

export default function tableHeaderSelector({ productsColumns, values, setImages, t, selectVendors, setOpenConfirmDialog, setIsDrawerOpen }) {
  // const { values } = useQueryParams()

  const columns = productsColumns?.map((el) => {
    if (el.field === 'checkbox') {
      return {
        ...el,
        headerName: '',
        colId: el.field,
        cellRenderer: memo((p) => (
          <input onChange={(e) => selectVendors(e.target.checked, p.data.id)} name='checkbox_zero' className='customCheckbox' type='checkbox' />
        )),
      }
    }
    if (el.field === 'public_id') {
      return {
        ...el,
        headerName: 'ID',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='public_id' />),
      }
    }
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('name'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'permission_count') {
      return {
        ...el,
        headerName: t('permissions'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='permission_count' />),
      }
    }
    if (el.field === 'description') {
      return {
        ...el,
        headerName: t('description'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <StyledTooltip title={p.data.description}>
            <SimpleText width={el.width} {...p} type='description' />
          </StyledTooltip>
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
            <Box display='inline-flex' columnGap={'8px'}>
              <CheckAccess id={'product-edit'}>
                <IconButton onClick={() => setopenCreateVendorDrawer({ mode: 'edit', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'product-delete'}>
                <IconButton
                  onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: get(data, '[first_name]') + ' ' + get(data, '[last_name]') })}
                  sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
                >
                  <DeleteIcon />
                </IconButton>
              </CheckAccess>
            </Box>
          </CheckAccess>
        )),
      }
    }
  })

  return columns
}
