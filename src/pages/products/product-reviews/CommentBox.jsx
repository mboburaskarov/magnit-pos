import { Box, IconButton, Typography } from '@mui/material'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import { shop_statuses } from '../../../assets/data/shop-statuses'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import LockOpenIcon from '../../../assets/icons/LockOpenIcon'
import LockIcon from '../../../assets/icons/LockIcon'
import ReviewOrderIcon from '../../../assets/icons/ReviewOrderIcon'
import ReviewUserIcon from '../../../assets/icons/ReviewUserIcon'
import ReviewShopIcon from '../../../assets/icons/ReviewShopIcon'
import ReviewFillIcon from '../../../assets/icons/ReviewFillIcon'
import ReviewIcon from '../../../assets/icons/ReviewBigIcon'
import CheckAccess from '../../../../components/CheckAccess'
export default function CommentBox({ ind, data, setOpenConfirmDialog }) {
  return (
    <Box
      key={ind}
      borderRadius={4}
      px={4}
      py={3}
      display='inline-flex'
      width='100%'
      justifyContent='space-between'
      backgroundColor={ind % 2 === 0 ? 'gray.50' : 'background.default'}
    >
      <Box>
        <Typography mb={0.5} color='gray.600' fontSize={18} lineHeight='24px'>
          Наименование товара:{' '}
          <Typography sx={{ cursor: 'pointer', '&:hover': { color: 'green.600' } }} variant='span'>
            {data?.product?.name || '-'}
          </Typography>
        </Typography>
        <Typography fontWeight={600} variant='h1'>
          {data?.text}
        </Typography>
        <Box display='flex' mt={1}>
          {[1, 2, 3, 4, 5].map((el) => (
            <Box key={el}>{data.rating >= el ? <ReviewFillIcon /> : <ReviewIcon />}</Box>
          ))}
        </Box>
        <Box mt={1} display='inline-flex'>
          <Box alignItems='center' display='inline-flex'>
            <ReviewShopIcon />
            <Typography ml={0.7} color='gray.500' fontSize={18} lineHeight='24px'>
              {data?.shop?.name || '-'}
            </Typography>
          </Box>
          <Box alignItems='center' ml={2} display='inline-flex'>
            <ReviewUserIcon />
            <Typography ml={0.7} color='gray.500' fontSize={18} lineHeight='24px'>
              {data?.user?.fullName || '-'}
            </Typography>
          </Box>
          <Box alignItems='center' ml={2} display='inline-flex'>
            <ReviewOrderIcon />
            <Typography ml={0.7} color='gray.500' fontSize={18} lineHeight='24px'>
              {data?.order?.orderNumber || '-'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box alignItems='center' columnGap={2} display='inline-flex'>
        <StatusCell
          id={`comment-status-${1}`}
          bgcolor={shop_statuses.find((el) => el.id === data.status)?.color}
          title={shop_statuses.find((el) => el.id === data.status)?.name}
        />
        <CheckAccess id={'product-reviews-delete'}>
          <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: data?._id })} sx={{ borderRadius: 3, p: '14px' }}>
            <DeleteIcon />
          </IconButton>
        </CheckAccess>
        {data.status === 'ACTIVE' ? (
          <CheckAccess id={'product-reviews-deactive'}>
            <IconButton onClick={() => setOpenConfirmDialog({ type: 'deactivate', id: data?._id })} sx={{ borderRadius: 3, p: '14px' }}>
              <LockIcon />
            </IconButton>
          </CheckAccess>
        ) : (
          <CheckAccess id={'product-reviews-active'}>
            <IconButton onClick={() => setOpenConfirmDialog({ type: 'activate', id: data?._id })} sx={{ borderRadius: 3, p: '14px' }}>
              <LockOpenIcon />
            </IconButton>
          </CheckAccess>
        )}
      </Box>
    </Box>
  )
}
