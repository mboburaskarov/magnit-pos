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

export default function CategoriesSubBox({ setIsDrawerOpen, ind, data, setOpenConfirmDialog }) {
  const DateIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none'>
      <path d='M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' fill='#119676' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z'
        fill='white'
      />
    </svg>
  )
  const ReviewUserIcon = () => (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM15.6 8.4C15.6 10.3882 13.9882 12 12 12C10.0118 12 8.4 10.3882 8.4 8.4C8.4 6.41178 10.0118 4.8 12 4.8C13.9882 4.8 15.6 6.41178 15.6 8.4ZM12 22.2C14.1408 22.2 16.1277 21.5404 17.7683 20.4134C18.4929 19.9157 18.8026 18.9675 18.3813 18.1959C17.5079 16.5963 15.7083 15.6 11.9999 15.6C8.29163 15.6 6.49196 16.5963 5.61857 18.1958C5.19726 18.9674 5.50692 19.9156 6.23155 20.4134C7.87222 21.5404 9.85908 22.2 12 22.2Z'
        fill='#119676'
      />
    </svg>
  )
  const ReviewOrderIcon = () => (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M14.5104 10.5L13.6104 13.5H9.48963L10.3896 10.5H14.5104Z' fill='#119676' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM11.0586 5.13797C11.5347 5.2808 11.8049 5.78254 11.662 6.25863L10.9296 8.70002H15.0504L15.938 5.7414C16.0808 5.26531 16.5825 4.99515 17.0586 5.13797C17.5347 5.2808 17.8049 5.78254 17.662 6.25863L16.9296 8.70002H19.2C19.6971 8.70002 20.1 9.10296 20.1 9.60002C20.1 10.0971 19.6971 10.5 19.2 10.5H16.3896L15.4896 13.5H18C18.4971 13.5 18.9 13.903 18.9 14.4C18.9 14.8971 18.4971 15.3 18 15.3H14.9496L14.062 18.2586C13.9192 18.7347 13.4175 19.0049 12.9414 18.8621C12.4653 18.7192 12.1951 18.2175 12.338 17.7414L13.0704 15.3H8.94963L8.06204 18.2586C7.91922 18.7347 7.41748 19.0049 6.94139 18.8621C6.46529 18.7192 6.19513 18.2175 6.33796 17.7414L7.07037 15.3H4.8C4.30294 15.3 3.9 14.8971 3.9 14.4C3.9 13.903 4.30294 13.5 4.8 13.5H7.61037L8.51037 10.5H6C5.50294 10.5 5.1 10.0971 5.1 9.60002C5.1 9.10296 5.50294 8.70002 6 8.70002H9.05037L9.93796 5.7414C10.0808 5.26531 10.5825 4.99515 11.0586 5.13797Z'
        fill='#119676'
      />
    </svg>
  )

  return (
    <Box key={ind} borderRadius={4} px={4} py={3} display='inline-flex' width='100%' justifyContent='space-between' backgroundColor={'background.default'}>
      <Box columnGap={2} display='inline-flex'>
        <Box ml={4} sx={{ img: { width: 80, height: 80, borderRadius: '12px', objectFit: 'cover' } }}>
          <img src={getImageUrl(data?.icon)} alt='image of category' />
        </Box>
        <Box display='flex' flexDirection='column' justifyContent='center'>
          <Typography fontSize={28} lineHeight='28px' fontWeight={600} variant='h1'>
            {data?.nameRu}
          </Typography>
          <Box mt={1} display='inline-flex'>
            <Box alignItems='center' display='inline-flex'>
              <DateIcon />
              <Typography ml={0.7} color='gray.500' fontSize={16} lineHeight='24px'>
                {dayjs(data?.createdAt).format('DD.MM.YYYY HH:mm') || '-'}
              </Typography>
            </Box>
            <Box alignItems='center' ml={2} display='inline-flex'>
              <ReviewUserIcon />
              <Typography ml={0.7} color='gray.500' fontSize={16} lineHeight='24px'>
                {data?.user?.fullName || 'Отсутствует'}
              </Typography>
            </Box>
            <Box alignItems='center' ml={2} display='inline-flex'>
              <ReviewOrderIcon />
              <Typography ml={0.7} color='gray.500' fontSize={16} lineHeight='24px'>
                {data?.productCount || '0'} продукты
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box alignItems='center' columnGap={2} display='inline-flex'>
        <StatusCell
          id={`category-status-${1}`}
          bgcolor={category_types.find((el) => el.id === data.type)?.color}
          title={category_types.find((el) => el.id === data.type)?.name}
        />
        <CheckAccess id={'category-edit'}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              setIsDrawerOpen({ type: 'edit', id: data?._id })
            }}
            sx={{ borderRadius: 3, p: '14px' }}
          >
            <EditIcon />
          </IconButton>
        </CheckAccess>
        <CheckAccess id={'category-delete'}>
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
  )
}
