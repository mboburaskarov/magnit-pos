import { Box, IconButton, Typography } from '@mui/material'
import { get } from 'lodash'
import { memo } from 'react'
import { formatPhoneNumber } from '@utils/formatPhoneNumber'
import DeleteIcon from '@icons/DeleteIcon'
import EditIcon from '@icons/EditIcon'
import { SimpleText } from '@components/AgGridTable/Cells/SimpleText'
import CheckAccess from '@components/CheckAccess'

export default function tableHeaderSelector({ productsColumns, values, t, setOpenConfirmDialog, setOpenBranchDrawer }) {
  const columns = productsColumns?.map((el) => {
    if (el.field === 'name') {
      return {
        ...el,
        headerName: t('table_columns.name'),
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='name' />),
      }
    }
    if (el.field === 'detailed_name') {
      return {
        ...el,
        headerName: 'Наименование полное',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='detailed_name' />),
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
    if (el.field === 'work_hours') {
      return {
        ...el,
        headerName: 'Режим работа ',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='work_hours' />),
      }
    }
    if (el.field === 'phone') {
      return {
        ...el,
        headerName: 'Телефон',
        colId: el.field,
        cellRenderer: memo((p) => <SimpleText {...p} type='cash_box_count' customText={p.data.phone?.length > 1 ? formatPhoneNumber(p.data.phone) : '-'} />),
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
        headerName: 'В Аптекае код',
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
          <Box display='inline-flex' columnGap={'8px'}>
            <CheckAccess id={'branch:edit'}>
              <IconButton onClick={() => setOpenBranchDrawer({ mode: 'edit', data })} sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}>
                <EditIcon />
              </IconButton>
            </CheckAccess>
            <CheckAccess id={'branch:delete'}>
              <IconButton
                onClick={() => setOpenConfirmDialog({ type: 'delete', id: data.id, name: data.name })}
                sx={{ width: 32, height: 32, borderRadius: 3, p: '8px' }}
              >
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
