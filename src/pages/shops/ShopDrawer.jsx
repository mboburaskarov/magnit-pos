import { Box, Button, Typography } from '@mui/material'
import CardDrawer from '../../../components/Drawers/CardDrawer'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import SectionTitle from '../../../components/SectionTitle'
import DrawerInfoBox from '../../../components/Drawers/DrawerInfoBox'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
import getImageUrl from '../../../utils/getImageUrl'
import ImagePlaceholder from '../../assets/icons/ImagePlaceholder'
import ShopHistory from './ShopHistory'
import { shop_statuses } from '../../assets/data/shop-statuses'
import ShopProducts from './ShopProducts'
import MapSelect from '../../../components/MapSelect'
import LockOpenIcon from '../../assets/icons/LockOpenIcon'
import LockIcon from '../../assets/icons/LockIcon'
import dayjs from 'dayjs'
import CheckAccess from '../../../components/CheckAccess'
import ShopWarnings from './ShopWarnings'

const Image = ({ data, setImages }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '72px',
        height: '72px',
        borderRadius: 3,
        '&:hover': {
          '#overlay_image': {
            opacity: 0.5,
          },
        },
      }}
    >
      {data?.mainPicture ? (
        <img src={getImageUrl(data?.mainPicture)} alt={data?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
      ) : (
        <ImagePlaceholder small />
      )}
      {data?.mainPicture && (
        <Box
          sx={{
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            opacity: 0,
            borderRadius: 3,
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            bgcolor: 'green.600',
            position: 'absolute',
            zIndex: 2,
          }}
          id='overlay_image'
          onClick={() => setImages({ data: data?.internalPicture ? [data?.mainPicture, ...data.internalPicture] : [data?.mainPicture] })}
        />
      )}
    </Box>
  )
}

export default function ShopDrawer({ isOpen: id, onClose, setImages, setOpenConfirmDialog }) {
  const navigate = useNavigate()

  const {
    data: shopData,
    isLoading: shopDataLoading,
    isFetching: isFetchingShopData,
  } = useQuery(['shopData', id], () => requests.getSingleShop(id), { enabled: !!id })

  return (
    <CardDrawer
      closeDrawer={onClose}
      title={
        <Box display='inline-flex'>
          <Image setImages={setImages} data={shopData?.data} />
          <Typography mt={0.5} ml={2} fontSize={28} variant='h2'>
            {shopData?.data?.name}
            <Typography display='flex' alignItems='center' color='grey.400' mt={1} variant='body1'>
              {shopData?.data?.isClosed ? 'Закрыто' : 'Открыто'} • {shop_statuses.find((el) => el.id === shopData?.data?.status)?.name}
            </Typography>
          </Typography>
        </Box>
      }
      isOpen={!!id}
      isLoading={shopDataLoading && isFetchingShopData}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <CheckAccess id={'shop-edit'}>
            <Button onClick={() => navigate(`/shops/edit/${shopData?.data._id}`)} startIcon={<FontAwesomeIcon width={15} icon={faPen} />} fullWidth>
              Редактировать
            </Button>
          </CheckAccess>
          <CheckAccess id={shopData?.data?.status === 'ACTIVE' ? 'shop-deactive' : 'shop-active'}>
            <Button
              color={shopData?.data?.status === 'ACTIVE' ? 'red' : 'secondary'}
              onClick={() => setOpenConfirmDialog({ type: shopData?.data.status === 'ACTIVE' ? 'blocked' : 'activate', id })}
              startIcon={shopData?.data?.status !== 'ACTIVE' ? <LockOpenIcon /> : <LockIcon color='white' />}
              fullWidth
            >
              {shopData?.data?.status !== 'ACTIVE' ? 'Активировать' : 'Блокировать'}
            </Button>
          </CheckAccess>
        </Box>
      }
    >
      <SectionTitle grey>История магазина</SectionTitle>
      <ShopHistory id={id} />
      <ShopProducts setImages={setImages} id={id} />
      <ShopWarnings id={id} />
      <SectionTitle mt={6} grey>
        Доп. информация
      </SectionTitle>
      <DrawerInfoBox
        mb={1}
        infoData={[
          { title: 'Номер телефона', info: formatPhoneNumber('+' + shopData?.data?.phones[0]) },
          { title: 'Номер карты/счета', info: shopData?.data?.contract?.billNumber },
          { title: 'Дата контракта', info: dayjs(shopData?.data?.contract?.contractDate).format('DD.MM.YYYY') },
          { title: 'Файл контракта', info: shopData?.data?.contract?.contractFile ? 'Ссылка на файл' : '-', fileLink: shopData?.data?.contract?.contractFile },
          {
            title: 'Паспорт директора',
            info: shopData?.data?.contract?.directorPassport ? 'Ссылка на файл' : '-',
            fileLink: shopData?.data?.contract?.directorPassport,
          },
          {
            title: 'Сертификат компании',
            info: shopData?.data?.contract?.companyCertificate ? 'Ссылка на файл' : '-',
            fileLink: shopData?.data?.contract?.companyCertificate,
          },
          { title: 'Комментария', info: shopData?.data?.description || '-', fullWidth: true },
        ]}
      />
      <Box mb={6}>
        <MapSelect defaultValue={[shopData?.data?.location?.lat, shopData?.data?.location?.long]} onlyShow height={320} />
      </Box>
    </CardDrawer>
  )
}
