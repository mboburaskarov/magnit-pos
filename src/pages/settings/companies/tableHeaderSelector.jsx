import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import CustomImg from '../../../../components/CustomImg'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import thousandDivider from '../../../../utils/thousandDivider'

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

export default function tableHeaderSelector({ productsColumns, values, t, setOpenConfirmDialog, setopenCreateLocationDrawer }) {
  const columns = productsColumns?.map((el) => {
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('table_columns.name'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'email') {
      return {
        ...el,
        headerName: 'Емайл',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='email' />),
      }
    }
    if (el.field === 'city') {
      return {
        ...el,
        headerName: 'Город',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='city' />),
      }
    }
    if (el.field === 'country') {
      return {
        ...el,
        headerName: 'Страна',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='country' />),
      }
    }
    if (el.field === 'company_mfo') {
      return {
        ...el,
        headerName: 'Компания МФО ',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='company_mfo' />),
      }
    }
    if (el.field === 'phone') {
      return {
        ...el,
        headerName: 'Телефон',
        colId: el.field,
        cellRenderer: memo((p) => (
          <Typography sx={{ whiteSpace: 'pre-line' }} id={`product-${p.type}-${p.rowIndex}`}>
            {p.data.phone?.length > 1 ? formatPhoneNumber(p.data.phone) : '-'}
          </Typography>
        )),
      }
    }
    if (el.field === 'postal_code') {
      return {
        ...el,
        headerName: 'Почтовый индекс',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='postal_code' />),
      }
    }
    if (el.field === 'legal_name') {
      return {
        ...el,
        headerName: 'Юридическое название',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='legal_name' />),
      }
    }
    if (el.field === 'legal_address') {
      return {
        ...el,
        headerName: 'Юридический адрес',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='legal_address' />),
      }
    }

    if (el.field === 'company_inn') {
      return {
        ...el,
        headerName: 'ИНН компании',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='company_inn' />),
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
          <Box display='inline-flex' columnGap={'8px'}>
            {/* <IconButton onClick={() => setopenCreateLocationDrawer({ mode: 'edit', data })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
              <EditIcon />
            </IconButton> */}
            {/* <IconButton
              onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: data.name })}
              sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
            >
              <DeleteIcon />
            </IconButton> */}
          </Box>
        )),
      }
    }
  })

  return columns
}
