import { memo } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import EditIcon from '../../../assets/icons/EditIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import CheckAccess from '../../../../components/CheckAccess'

export default function tableHeaderSelector({ rolesColumns, setOpenConfirmDialog, setIsDrawerOpen }) {
  const columns = rolesColumns?.map((el) => {
    if (el.field === 'name') {
      return {
        ...el,
        headerName: 'Наименования',
        colId: el.field,
        cellRenderer: memo(({ data }) => {
          return (
            <Box sx={{ bgcolor: 'transparent', py: 1, px: 1.5, borderRadius: 3 }} columnGap={0.5} display='inline-flex' alignItems='center'>
              <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='green.500'>
                {data?.name}
              </Typography>
            </Box>
          )
        }),
      }
    }

    if (el.field === 'description') {
      return {
        ...el,
        headerName: 'Описание',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <Box sx={{ bgcolor: 'transparent', py: 1, px: 1.5, borderRadius: 3 }} columnGap={0.5} display='inline-flex' alignItems='center'>
            <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='gray.500'>
              {data?.description || data?.name}
            </Typography>
          </Box>
        )),
      }
    }
    if (el.field === 'actions') {
      return {
        ...el,
        headerName: 'Действия',
        colId: el.field,
        cellRenderer: memo(({ data }) => (
          <CheckAccess id={'role-edit role-delete'}>
            <Box display='inline-flex' columnGap={2}>
              <CheckAccess id={'role-edit'}>
                <IconButton onClick={() => setIsDrawerOpen({ type: 'role_edit', id: data._id })} sx={{ borderRadius: 3, p: '14px' }}>
                  <EditIcon />
                </IconButton>
              </CheckAccess>
              <CheckAccess id={'role-delete'}>
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
