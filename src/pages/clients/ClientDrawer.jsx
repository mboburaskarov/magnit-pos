import { Box, Button, Typography } from '@mui/material'
import CardDrawer from '../../../components/Drawers/CardDrawer'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import SectionTitle from '../../../components/SectionTitle'
import DrawerInfoBox from '../../../components/Drawers/DrawerInfoBox'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
import getImageUrl from '../../../utils/getImageUrl'
import ImagePlaceholder from '../../assets/icons/ImagePlaceholder'
import { shop_statuses } from '../../assets/data/shop-statuses'
import LockOpenIcon from '../../assets/icons/LockOpenIcon'
import LockIcon from '../../assets/icons/LockIcon'
import dayjs from 'dayjs'
import ClientOrders from './ClientOrders'
import CheckAccess from '../../../components/CheckAccess'

const Image = ({ data }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '72px',
        height: '72px',
        borderRadius: 3,
      }}
    >
      {data?.avatar ? (
        <img src={getImageUrl(data?.avatar)} alt={data?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
      ) : (
        <ImagePlaceholder small />
      )}
    </Box>
  )
}

export default function UserDrawer({ isOpen: id, onClose, setOpenConfirmDialog }) {
  const {
    data: userData,
    isLoading: userDataLoading,
    isFetching: isFetchingUserData,
  } = useQuery(['userData', id], () => requests.getSingleUser(id), { enabled: !!id })

  return (
    <CardDrawer
      closeDrawer={onClose}
      title={
        <Box display='inline-flex'>
          <Image data={userData?.data} />
          <Typography mt={1} ml={2} fontSize={28} variant='h2'>
            {userData?.data?.fullName}
            <Typography display='flex' alignItems='center' color='grey.400' mt={1} variant='body1'>
              {shop_statuses.find((el) => el.id === userData?.data?.status)?.name} • {dayjs(userData?.data?.createdAt).format('DD.MM.YYYY')}
            </Typography>
          </Typography>
        </Box>
      }
      isOpen={!!id}
      isLoading={userDataLoading && isFetchingUserData}
      actions={
        <CheckAccess id={userData?.data?.status !== 'ACTIVE' ? 'client-active' : 'client-deactive'}>
          <Box width='100%' display='inline-flex'>
            <Button
              color='secondary'
              onClick={() => setOpenConfirmDialog({ type: userData?.data.status === 'ACTIVE' ? 'blocked' : 'activate', id })}
              startIcon={userData?.data?.status !== 'ACTIVE' ? <LockOpenIcon /> : <LockIcon />}
              fullWidth
            >
              {userData?.data?.status !== 'ACTIVE' ? 'Активировать' : 'Блокировать'}
            </Button>
          </Box>
        </CheckAccess>
      }
    >
      <ClientOrders id={id} />
      <SectionTitle mt={6} grey>
        Информация
      </SectionTitle>
      <DrawerInfoBox
        mb={4}
        infoData={[
          { title: 'Номер телефона', info: formatPhoneNumber('+' + userData?.data?.phone) },
          { title: 'Время регистрации', info: dayjs(userData?.data?.createdAt).format('DD.MM.YYYY hh:mm') },
        ]}
      />
    </CardDrawer>
  )
}
