import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '../../../../../components/AgGridTable/Cells/StatusCell'
import CheckAccess from '../../../../../components/CheckAccess'
import CustomImg from '../../../../../components/CustomImg'
import thousandDivider from '../../../../../utils/thousandDivider'
import DeleteIcon from '../../../../assets/icons/DeleteIcon'
import EditIcon from '../../../../assets/icons/EditIcon'

const SimpleText = ({ data, rowIndex, type, withDevider, currency }) => {
  return (
    <Typography sx={{ whiteSpace: 'pre-line', color: !data?.[type] && 'gray.400' }} id={`product-${type}-${rowIndex}`}>
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
      <CustomImg
        id={`product-image-${rowIndex}`}
        src={data?.main_photo || 'default-img.avif'}
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

export default function tableHeaderSelector({ setOpenCreatePermission, values, vendorsColumns, t, setOpenConfirmDialog, selectVendors }) {
  const columns = vendorsColumns?.map((el) => {
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

    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Тип',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'store_name') {
      return {
        ...el,
        headerName: 'APTEKA',
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{get(p, 'data.store.name')}</Typography>),
      }
    }

    if (el.field === 'is_enable') {
      return {
        ...el,
        headerName: t('status'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`products-status-${rowIndex}`}
            color={get(data, 'is_active', false) === true ? 'green.700' : 'red.700'}
            bgcolor={get(data, 'is_active', false) === true ? 'green.10' : 'red.10'}
            title={get(data, 'is_active', false) === true ? 'Активный' : 'Неактивный'}
          />
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
                <IconButton onClick={() => setOpenCreatePermission({ mode: 'edit', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
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
