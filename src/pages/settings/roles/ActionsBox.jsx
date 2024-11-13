import { Box, IconButton, Typography } from '@mui/material'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import { useState } from 'react'
import EditIcon from '../../../assets/icons/EditIcon'
import ActionsSubBox from './ActionsSubBox'
import CheckAccess from '../../../../components/CheckAccess'
import BackArrowIcon from '../../../assets/icons/BackArrow'
import ForwardArrow from '../../../assets/icons/ForwardArrow'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'

export default function ActionsBox({ ind, data, setOpenConfirmDialog, setIsDrawerOpen }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box display='flex' flexDirection='column'>
      <Box
        key={ind}
        borderRadius={4}
        px={4}
        py={3}
        display='inline-flex'
        width='100%'
        justifyContent='space-between'
        backgroundColor={isOpen ? 'grey.100' : ind % 2 === 0 ? 'grey.50' : 'background.default'}
        onClick={() => setIsOpen(!isOpen)}
        sx={{ cursor: data?.type === 'PAGE' ? 'pointer' : 'default', transition: 'ease all 0.2s', '&:hover': { bgcolor: 'grey.100' } }}
      >
        <Box display='flex' alignItems={'center'}>
          <Box sx={{ bgcolor: 'transparent', py: 1, px: 1.5, borderRadius: 3 }} columnGap={2} display='inline-flex' alignItems='center'>
            {!isOpen
              ? data?.type === 'PAGE' && <ForwardArrow style={{ marginTop: '4px' }} fill={'#3BA98F'} />
              : data?.type === 'PAGE' && <BackArrowIcon style={{ marginTop: '4px' }} fill={'#3BA98F'} type={'down'} />}
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
        <Box display={'flex'} columnGap={2} alignItems={'center'}>
          <StatusCell id={`action-status-${1}`} bgcolor={'green.500'} title={data.type} />
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
      </Box>
      {isOpen && data?.type === 'PAGE' && (
        <Box width='100%' display='flex' flexDirection='column'>
          {data?.children?.length > 0 ? (
            data?.children.map((subsData, subsInd) => (
              <ActionsSubBox setIsDrawerOpen={setIsDrawerOpen} ind={subsInd} data={subsData} setOpenConfirmDialog={setOpenConfirmDialog} />
            ))
          ) : (
            <Box px={4} py={3} ml={4}>
              <Typography color='grey.500' fontWeight={500} variant='h2'>
                Подкатегории не найдены
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
