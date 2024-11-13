import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import StatusCell from '../../../components/AgGridTable/Cells/StatusCell'
import { products_statuses } from '../../assets/data/products-statuses'

const ShopWarningIcon = () => (
  <svg width='22' height='22' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM15.6 8.4C15.6 10.3882 13.9882 12 12 12C10.0118 12 8.4 10.3882 8.4 8.4C8.4 6.41178 10.0118 4.8 12 4.8C13.9882 4.8 15.6 6.41178 15.6 8.4ZM12 22.2C14.1408 22.2 16.1277 21.5404 17.7683 20.4134C18.4929 19.9157 18.8026 18.9675 18.3813 18.1959C17.5079 16.5963 15.7083 15.6 11.9999 15.6C8.29163 15.6 6.49196 16.5963 5.61857 18.1958C5.19726 18.9674 5.50692 19.9156 6.23155 20.4134C7.87222 21.5404 9.85908 22.2 12 22.2Z'
      fill='#119676'
    />
  </svg>
)

const ShopWarningDate = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
    <path d='M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' fill='#119676' />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z'
      fill='white'
    />
  </svg>
)

export default function ShopWarning({ data }) {
  return (
    <Box
      key={data?._id}
      borderRadius={4}
      px={4}
      py={3}
      border={'2px dashed #eee'}
      display='inline-flex'
      alignItems={'center'}
      width='100%'
      justifyContent='space-between'
    >
      <Box>
        <Typography style={{ whiteSpace: 'pre-line' }} fontWeight={600} variant='h3'>
          {data?.reason || '-'}
        </Typography>

        <Box mt={1}>
          <Box alignItems='center' display='inline-flex'>
            <ShopWarningDate />
            <Typography ml={0.7} color='green.600' fontSize={18} lineHeight='24px'>
              {dayjs(data?.createdAt).format('DD.MM.YYYY HH:mm') || '-'}
            </Typography>
          </Box>
          {data?.moderator && (
            <Box alignItems='center' ml={2} display='inline-flex'>
              <ShopWarningIcon />
              <Typography ml={0.7} color='green.600' fontSize={18} lineHeight='24px'>
                {data?.moderator?.fullName || '-'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        <StatusCell
          bgcolor={products_statuses.find((el) => el.id === data.status)?.color}
          title={products_statuses.find((el) => el.id === data.status)?.name}
        />
      </Box>
    </Box>
  )
}
