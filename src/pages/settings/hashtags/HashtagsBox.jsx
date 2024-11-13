import { Box, IconButton, Typography } from '@mui/material'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import getImageUrl from '../../../../utils/getImageUrl'
import dayjs from 'dayjs'
import { useState } from 'react'
import ReviewUserIcon from '../../../assets/icons/ReviewUserIcon'
import ReviewOrderIcon from '../../../assets/icons/ReviewOrderIcon'
import DateIcon from '../../../assets/icons/DateIcon'
import CheckAccess from '../../../../components/CheckAccess'

const category_types = [{ id: 'ALL', name: 'ВСЕ', color: 'green.500' }]

export default function HashtagsBox({ ind, data, setOpenConfirmDialog }) {
  return (
    <Box display='flex' flexDirection='column'>
      <Box
        key={ind}
        borderRadius={4}
        px={3}
        py={3}
        display='inline-flex'
        width='100%'
        justifyContent='space-between'
        backgroundColor={ind % 2 === 0 ? 'grey.50' : 'background.default'}
      >
        <Box columnGap={2} display='inline-flex'>
          <Box sx={{ img: { width: 96, height: 96, borderRadius: '16px', objectFit: 'cover' } }}>
            <img src={getImageUrl(data?.image)} alt='image of hashtag' />
          </Box>
          <Box display='flex' flexDirection='column' justifyContent='center'>
            <Typography fontWeight={600} variant='h1'>
              {data?.nameRu}
            </Typography>
            <Box mt={1} display='inline-flex'>
              <Box alignItems='center' display='inline-flex'>
                <DateIcon />
                <Typography ml={0.7} color='grey.500' fontSize={18} lineHeight='24px'>
                  {dayjs(data?.createdAt).format('DD.MM.YYYY HH:mm') || '-'}
                </Typography>
              </Box>
              <Box alignItems='center' ml={2} display='inline-flex'>
                <ReviewUserIcon />
                <Typography ml={0.7} color='grey.500' fontSize={18} lineHeight='24px'>
                  {data?.user?.fullName || 'Отсутствует'}
                </Typography>
              </Box>
              <Box alignItems='center' ml={2} display='inline-flex'>
                <ReviewOrderIcon />
                <Typography ml={0.7} color='grey.500' fontSize={18} lineHeight='24px'>
                  {data?.productCount || '0'} продуктов
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box alignItems='center' columnGap={2} display='inline-flex'>
          <StatusCell
            id={`category-status-${1}`}
            // bgcolor={category_types.find((el) => el.id === data?.type)?.color}
            // title={category_types.find((el) => el.id === data?.type)?.name}
            bgcolor={category_types.find((el) => el.id === 'ALL')?.color}
            title={category_types.find((el) => el.id === 'ALL')?.name}
          />
          <CheckAccess id={'hashtag-delete'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()

                setOpenConfirmDialog({ type: 'delete', id: data?._id })
              }}
              sx={{ borderRadius: 3, p: '14px' }}
            >
              <DeleteIcon />
            </IconButton>
          </CheckAccess>
        </Box>
      </Box>
    </Box>
  )
}
