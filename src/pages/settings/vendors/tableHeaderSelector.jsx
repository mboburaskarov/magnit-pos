import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import CustomImg from '../../../../components/CustomImg'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import thousandDivider from '../../../../utils/thousandDivider'
import { vendor_statuses } from '../../../assets/data/vendor-statuses'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import EditIcon from '../../../assets/icons/EditIcon'
import LockIcon from '../../../assets/icons/LockIcon'
import UnLockIcon from '../../../assets/icons/UnLock'

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

export default function tableHeaderSelector({ setopenCreateVendorDrawer, values, vendorsColumns, t, setOpenConfirmDialog, selectVendors }) {
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
    if (el.field === 'fish') {
      return {
        ...el,
        headerName: t('fish'),
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{get(p, 'data.[first_name]') + ' ' + get(p, 'data.[last_name]')}</Typography>),
      }
    }
    if (el.field === 'store') {
      return {
        ...el,
        headerName: t('branch'),
        colId: el.field,
        cellRenderer: memo((p) => <Typography>{get(p, 'data.[store].name')}</Typography>),
      }
    }
    if (el.field === 'phone') {
      return {
        ...el,
        headerName: t('phone'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.type}-${p.rowIndex}`}>
            {formatPhoneNumber(p.data.phone)}
          </Typography>
        )),
      }
    }
    if (el.field === 'role') {
      return {
        ...el,
        headerName: t('role'),
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography whiteSpace={'pre-line'}>
            {get(p, 'data.roles', [])
              .map((e) => e?.name)
              .join(',')}
          </Typography>
        )),
      }
    }

    if (el.field === 'status') {
      return {
        ...el,
        headerName: t('status'),
        colId: el.field,
        cellRenderer: memo(({ data, rowIndex }) => (
          <StatusCell
            id={`products-status-${rowIndex}`}
            color={vendor_statuses.find((el) => el.id === data.status)?.color}
            bgcolor={vendor_statuses.find((el) => el.id === data.status)?.bgcolor}
            title={vendor_statuses.find((el) => el.id === data.status)?.name}
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
          // <CheckAccess id={'product-edit product-delete product-active product-deactive'}>
          <Box display='inline-flex' columnGap={'8px'}>
            {data.status === 'active' ? (
              // <CheckAccess id={'product-deactive'}>
              <>
                <IconButton
                  sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
                  onClick={() => setOpenConfirmDialog({ type: 'deactivate', id: data.id, name: get(data, '[first_name]') + ' ' + get(data, '[last_name]') })}
                >
                  <LockIcon color='#111217' />
                </IconButton>
              </>
            ) : (
              // </CheckAccess>
              // <CheckAccess id={'product-active'}>
              <>
                <IconButton
                  sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
                  onClick={() => setOpenConfirmDialog({ type: 'activate', id: data.id, name: get(data, '[first_name]') + ' ' + get(data, '[last_name]') })}
                >
                  <UnLockIcon color='#111217' />
                </IconButton>
              </>
              // </CheckAccess>
            )}
            {/* <CheckAccess id={'product-edit'}> */}
            <IconButton onClick={() => setopenCreateVendorDrawer({ mode: 'edit', id: data.id })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
              <EditIcon />
            </IconButton>
            {/* </CheckAccess> */}
            {/* <CheckAccess id={'product-delete'}> */}
            <IconButton
              onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: get(data, '[first_name]') + ' ' + get(data, '[last_name]') })}
              sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
            >
              <DeleteIcon />
            </IconButton>
            {/* </CheckAccess> */}
          </Box>
          // </CheckAccess>
        )),
      }
    }
  })

  return columns
}
