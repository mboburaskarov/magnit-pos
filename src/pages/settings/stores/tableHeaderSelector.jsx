import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import CheckAccess from '../../../../components/CheckAccess'
import thousandDivider from '../../../../utils/thousandDivider'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import EditIcon from '../../../assets/icons/EditIcon'

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

export default function tableHeaderSelector({ productsColumns, values, setImages, t, setOpenConfirmDialog, setIsDrawerOpen, setopenCreateLocationDrawer }) {
  const columns = productsColumns?.map((el) => {
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('table_columns.name'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'location') {
      return {
        ...el,
        headerName: 'Локация',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='location' />),
      }
    }
    if (el.field === 'address') {
      return {
        ...el,
        headerName: 'Адрес',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='address' />),
      }
    }
    if (el.field === 'employee_count') {
      return {
        ...el,
        headerName: 'Количество сотрудников',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='employee_count' />),
      }
    }
    if (el.field === 'cash_box_count') {
      return {
        ...el,
        headerName: 'Количество касса',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='cash_box_count' />),
      }
    }
    if (el.field === 'store_code') {
      return {
        ...el,
        headerName: 'В магазине код',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='store_code' />),
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

    if (el.field === 'actions') {
      return {
        ...el,
        headerName: t('table_columns.actions'),
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'product-edit product-delete product-active product-deactive'}>
            <Box display='inline-flex' columnGap={'8px'}>
              <CheckAccess id={'product-edit'}>
                <IconButton onClick={() => setopenCreateLocationDrawer({ mode: 'edit', data })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'product-delete'}>
                <IconButton
                  onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: data.name })}
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
