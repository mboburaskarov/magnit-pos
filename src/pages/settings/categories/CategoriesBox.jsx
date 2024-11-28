import { Box, IconButton, Typography } from '@mui/material'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import getImageUrl from '../../../../utils/getImageUrl'
import dayjs from 'dayjs'
import { useState } from 'react'
import CategoriesSubBox from './CategoriesSubBox'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import ReviewUserIcon from '../../../assets/icons/ReviewUserIcon'
import ReviewOrderIcon from '../../../assets/icons/ReviewOrderIcon'
import DateIcon from '../../../assets/icons/DateIcon'
import EditIcon from '../../../assets/icons/EditIcon'
import CheckAccess from '../../../../components/CheckAccess'

const category_types = [
  { id: 'BUCHET', name: 'Buchet', color: 'green.500' },
  { id: 'MARKET', name: 'Market', color: 'yellow.500' },
]

export default function CategoriesBox({ ind, data, setOpenConfirmDialog, setIsDrawerOpen }) {
  const [isOpen, setIsOpen] = useState(false)

  const { data: categoriesSubsList } = useQuery(`categoriesListSubs-${data._id}`, () => requests.getAllCategories({ subId: data._id }), { enabled: isOpen })

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
        backgroundColor={isOpen ? 'gray.100' : ind % 2 === 0 ? 'gray.50' : 'background.default'}
        onClick={() => setIsOpen(!isOpen)}
        sx={{ cursor: 'pointer', transition: 'ease all 0.2s', '&:hover': { bgcolor: 'gray.100' } }}
      >
        <Box columnGap={2} display='inline-flex'>
          <Box sx={{ img: { width: 96, height: 96, borderRadius: '16px', objectFit: 'cover' } }}>
            <img src={getImageUrl(data?.icon)} alt='image of category' />
          </Box>
          <Box display='flex' flexDirection='column' justifyContent='center'>
            <Typography fontWeight={600} variant='h1'>
              {data?.nameRu}
            </Typography>
            <Box mt={1} display='inline-flex'>
              <Box alignItems='center' display='inline-flex'>
                <DateIcon />
                <Typography ml={0.7} color='gray.500' fontSize={18} lineHeight='24px'>
                  {dayjs(data?.createdAt).format('DD.MM.YYYY HH:mm') || '-'}
                </Typography>
              </Box>
              <Box alignItems='center' ml={2} display='inline-flex'>
                <ReviewUserIcon />
                <Typography ml={0.7} color='gray.500' fontSize={18} lineHeight='24px'>
                  {data?.user?.fullName || 'Отсутствует'}
                </Typography>
              </Box>
              <Box alignItems='center' ml={2} display='inline-flex'>
                <ReviewOrderIcon />
                <Typography ml={0.7} color='gray.500' fontSize={18} lineHeight='24px'>
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
      {isOpen && (
        <Box width='100%' display='flex' flexDirection='column'>
          {categoriesSubsList?.data?.length > 0 ? (
            categoriesSubsList?.data.map((subsData, subsInd) => (
              <CategoriesSubBox key={subsInd} setIsDrawerOpen={setIsDrawerOpen} ind={subsInd} data={subsData} setOpenConfirmDialog={setOpenConfirmDialog} />
            ))
          ) : (
            <Box px={4} py={3} ml={4}>
              <Typography color='gray.500' fontWeight={500} variant='h2'>
                Подкатегории не найдены
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
