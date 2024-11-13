import { Box, IconButton, Typography, TextField as MuiTextField } from '@mui/material'
import TextField from '../../../../components/Inputs/TextField'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import { success } from '../../../../utils/toast'
import CopyIcon from '../../../assets/icons/CopyIcon'
import PhoneIcon from '../../../assets/icons/PhoneIcon'
import { shop_statuses } from '../../../assets/data/shop-statuses'
import getImageUrl from '../../../../utils/getImageUrl'
import Label from '../../../../components/Label'

const ShopImagePlaceholder = () => {
  return (
    <svg width='128' height='168' viewBox='0 0 128 168' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect width='128' height='168' rx='18' fill='#F5F5F5' />
      <path
        d='M42.0745 61.7464C41.5917 62.7088 41.3543 63.896 40.8794 66.2704L39.285 74.2426C38.2754 79.2905 42.1364 84.0002 47.2842 84.0002C51.4752 84.0002 54.9844 80.8244 55.4014 76.6542L55.5854 74.8139C55.1505 79.7436 59.0362 84.0002 63.9995 84.0002C68.9967 84.0002 72.9014 79.6855 72.4042 74.7131L72.5988 76.6542C73.0158 80.8244 76.525 84.0002 80.716 84.0002C85.8639 84.0002 89.7248 79.2905 88.7152 74.2426L87.1208 66.2704C86.6459 63.896 86.4085 62.7088 85.9257 61.7464C84.9084 59.7185 83.078 58.218 80.8901 57.6182C79.8517 57.3335 78.641 57.3335 76.2196 57.3335H70.6662H51.7806C49.3592 57.3335 48.1485 57.3335 47.1102 57.6182C44.9222 58.218 43.0918 59.7185 42.0745 61.7464Z'
        fill='#119676'
      />
      <path
        d='M80.7159 87.9999C82.895 87.9999 84.9193 87.4337 86.6666 86.4505V89.3333C86.6666 99.3899 86.6666 104.418 83.5424 107.542C81.0275 110.057 77.2788 110.548 70.6666 110.643V101.333C70.6666 98.841 70.6666 97.5949 70.1307 96.6667C69.7796 96.0586 69.2747 95.5536 68.6666 95.2026C67.7384 94.6667 66.4922 94.6667 63.9999 94.6667C61.5076 94.6667 60.2615 94.6667 59.3333 95.2026C58.7252 95.5536 58.2202 96.0586 57.8692 96.6667C57.3333 97.5949 57.3333 98.841 57.3333 101.333V110.643C50.7211 110.548 46.9723 110.057 44.4574 107.542C41.3333 104.418 41.3333 99.3899 41.3333 89.3333V86.4504C43.0805 87.4336 45.105 87.9999 47.2841 87.9999C50.4763 87.9999 53.403 86.7637 55.5848 84.7252C57.7911 86.7522 60.7372 87.9999 63.9994 87.9999C67.2618 87.9999 70.2082 86.7519 72.4146 84.7246C74.5964 86.7634 77.5234 87.9999 80.7159 87.9999Z'
        fill='#119676'
      />
    </svg>
  )
}
export default function ShopInfo({ orderData }) {
  return (
    <>
      <Box width='100%' columnGap={3} alignItems='flex-end' display='inline-flex'>
        <Box flexDirection='column' rowGap={2} display='flex' width='100%'>
          <TextField label='Название магазина' name='shop_name' value={orderData?.data?.shop?.name} fullWidth disabled uncontrolled />
          <TextField label='Адрес магазина' name='shop_adress' value={orderData?.data?.shop?.location?.name} fullWidth disabled uncontrolled />
        </Box>

        <Box mb={-1} width={128}>
          {orderData?.data?.shop?.mainPicture ? (
            <img style={{ borderRadius: 16 }} src={getImageUrl(orderData?.data?.shop?.mainPicture)} alt={`image of order`} width={128} height={168} />
          ) : (
            <ShopImagePlaceholder />
          )}
        </Box>
      </Box>
      <Box mt={4} alignItems='flex-end' width='100%' display='inline-flex' columnGap={3}>
        <TextField
          label='Номер телефона магазина'
          name='shop_phone'
          value={formatPhoneNumber('+' + orderData?.data?.shop?.phones?.[0])}
          fullWidth
          disabled
          uncontrolled
        />
        <Box width='100%'>
          <Label mb={1}>Cтатус</Label>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            borderRadius={4}
            height={56}
            width='100%'
            fontWeight={600}
            fontSize={18}
            bgcolor={shop_statuses.find((el) => el.id === orderData?.data?.shop?.status)?.color}
            color='white'
          >
            {shop_statuses.find((el) => el.id === orderData?.data?.shop?.status)?.name}
          </Box>
        </Box>
        <Box display='inline-flex' columnGap={2}>
          <a href={`tel:${'+' + orderData?.data?.shop?.phones?.[0]}`}>
            <IconButton sx={{ borderRadius: 4, height: 56, width: 56 }}>
              <PhoneIcon />
            </IconButton>
          </a>
          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(orderData?.data?.shop?._id)
              success(`ID скопирован ${orderData?.data?.shop?._id}`)
            }}
            sx={{ borderRadius: 4, height: 56, width: 56 }}
          >
            <CopyIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}
