import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import CheckAccess from '../../../../components/CheckAccess'
import EditIcon from '../../../assets/icons/EditIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
// import CheckAccess from '../../../components/CheckAccess'

export default function tableHeaderSelector({ userColumns, setIsDrawerOpen, setOpenConfirmDialog }) {
  const columns = userColumns?.map((el) => {
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Имя',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box>
            <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='green.500'>
              {data?.fullName}
            </Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'phone_number') {
      return {
        ...el,
        headerName: 'Номер телефона',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography style={{ whiteSpace: 'pre-line' }}>{formatPhoneNumber('+' + data?.phone)}</Typography>),
      }
    }
    if (el.field === 'type') {
      return {
        ...el,
        headerName: 'Роль',
        colId: el.field,
        cellRenderer: memo(({ data }) => <Typography style={{ whiteSpace: 'pre-line' }}>{data?.type}</Typography>),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: 'Действия',
        coldId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'user-edit user-delete'}>
            <Box display='inline-flex' columnGap={2}>
              <CheckAccess id={'user-edit'}>
                <IconButton onClick={() => setIsDrawerOpen({ type: 'edit', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'user-delete'}>
                <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
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
