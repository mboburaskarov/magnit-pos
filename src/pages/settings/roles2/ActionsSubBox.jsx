import { Box, IconButton, Typography } from '@mui/material'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import EditIcon from '../../../assets/icons/EditIcon'
import getImageUrl from '../../../../utils/getImageUrl'
import dayjs from 'dayjs'
import CheckAccess from '../../../../components/CheckAccess'

const category_types = [
  { id: 'BUCHET', name: 'Buchet', color: 'green.500' },
  { id: 'MARKET', name: 'Market', color: 'yellow.500' },
]

export default function ActionsSubBox({ setIsDrawerOpen, ind, data, setOpenConfirmDialog }) {
  return (
    <Box
      key={ind}
      borderRadius={'0px 16px 16px 0px'}
      px={4}
      py={3}
      display='inline-flex'
      width='100%'
      justifyContent='space-between'
      backgroundColor={'background.default'}
      ml={2}
      // sx={{ scale: '0.9' }}
    >
      <Box display='flex' alignItems={'center'}>
        <Box sx={{ bgcolor: 'transparent', py: 1, px: 1.5, borderRadius: 3 }} columnGap={0.5} display='inline-flex' alignItems='center'>
          <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='green.500'>
            {data?.name}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: 'transparent', py: 1, px: 1.5, borderRadius: 3 }}>
          <Typography sx={{ cursor: 'pointer', whiteSpace: 'pre-line' }} color='gray.500'>
            {data?.description || data?.name}
          </Typography>
        </Box>
      </Box>
      <CheckAccess id={'action-edit action-delete'}>
        <Box alignItems='center' columnGap={2} display='inline-flex'>
          <CheckAccess id={'action-edit'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                setIsDrawerOpen({ type: 'role_edit', id: data?._id })
              }}
              sx={{ borderRadius: 3, p: '14px' }}
            >
              <EditIcon />
            </IconButton>
          </CheckAccess>
          <CheckAccess id={'action-delete'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()

                setOpenConfirmDialog({ type: 'action_delete', id: data._id })
              }}
              sx={{ borderRadius: 3, p: '14px' }}
            >
              <DeleteIcon />
            </IconButton>
          </CheckAccess>
        </Box>
      </CheckAccess>
    </Box>
  )
}
