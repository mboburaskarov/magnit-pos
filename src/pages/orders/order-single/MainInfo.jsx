import { Box, IconButton, Link } from '@mui/material'
import TextField from '../../../../components/Inputs/TextField'
import thousandDivider from '../../../../utils/thousandDivider'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import { success } from '../../../../utils/toast'
import dayjs from 'dayjs'
import { order_statuses } from '../../../assets/data/order-statuses'
import CopyIcon from '../../../assets/icons/CopyIcon'
import PhoneIcon from '../../../assets/icons/PhoneIcon'
import OrderImageBox from '../OrderImageBox'
import Label from '../../../../components/Label'

export default function MainInfo({ orderData, setOpenCompareGallery, deliveryInfo }) {
  return (
    <>
      <Box width='100%' columnGap={3} display='inline-flex'>
        <Box flexDirection='column' display='flex' width='100%'>
          <TextField
            id='order_name'
            label='Название заказа'
            name='order_name'
            value={`Заказ #${orderData?.data?.orderNumber} • ${dayjs(orderData?.data?.createdAt).format('DD.MM.YYYY HH:mm')}`}
            fullWidth
            disabled
            uncontrolled
          />
          <Box sx={{ mt: 3 }} columnGap={3} width='100%' alignItems='flex-end' display='inline-flex'>
            <TextField
              id='total_amount'
              label='Общая сумма'
              name='total_amount'
              value={thousandDivider(orderData?.data?.totalSum) + ' сум'}
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
                bgcolor={order_statuses.find((el) => el.id === orderData?.data?.status)?.color}
                color='white'
              >
                {order_statuses.find((el) => el.id === orderData?.data?.status)?.name}
              </Box>
            </Box>
          </Box>
        </Box>
        <OrderImageBox setOpenCompareGallery={setOpenCompareGallery} count={orderData?.data?.orderPicture.length} url={orderData?.data?.orderPicture?.[0]} />
      </Box>
      <Box mt={4} alignItems='flex-end' width='100%' display='inline-flex' columnGap={3}>
        <TextField id='client_name' label='Имя клиента' name='client_name' value={orderData?.data?.client?.fullName} fullWidth disabled uncontrolled />

        <TextField
          id='client_phone'
          label='Телефон клиента'
          name='client_phone'
          value={formatPhoneNumber('+' + orderData?.data?.client?.phone)}
          fullWidth
          disabled
          uncontrolled
        />
        <Box display='inline-flex' columnGap={2}>
          <a href={`tel:${'+' + orderData?.data?.client?.phone}`}>
            <IconButton sx={{ borderRadius: 4, height: 56, width: 56 }}>
              <PhoneIcon />
            </IconButton>
          </a>

          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(orderData?.data?.client?._id)
              success(`ID скопирован ${orderData?.data?.client?._id}`)
            }}
            sx={{ borderRadius: 4, height: 56, width: 56 }}
          >
            <CopyIcon />
          </IconButton>
        </Box>
      </Box>
      <Box mt={4} alignItems='flex-end' width='100%' display='inline-flex' columnGap={3}>
        <TextField id='receiver_name' label='Имя получателя' name='receiver_name' value={orderData?.data?.receiver?.fullName} fullWidth disabled uncontrolled />

        <TextField
          id='receiver_phone'
          label='Телефон получателя'
          name='receiver_phone'
          value={formatPhoneNumber('+' + orderData?.data?.receiver?.phoneNumber)}
          fullWidth
          disabled
          uncontrolled
        />

        <Box display='inline-flex' columnGap={2}>
          <a href={`tel:${'+' + orderData?.data?.receiver?.phoneNumber}`}>
            <IconButton sx={{ borderRadius: 4, height: 56, width: 56 }}>
              <PhoneIcon />
            </IconButton>
          </a>
          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(orderData?.data?.receiver?._id)
              success(`ID скопирован ${orderData?.data?.receiver?._id}`)
            }}
            sx={{ borderRadius: 4, height: 56, width: 56 }}
          >
            <CopyIcon />
          </IconButton>
        </Box>
      </Box>
      <Box mt={4} alignItems='flex-end' width='100%' display='inline-flex' columnGap={3}>
        <TextField
          id='created_at'
          label='Дата создания'
          name='created_at'
          value={dayjs(orderData?.data?.createdAt).format('DD.MM.YYYY HH:mm')}
          fullWidth
          disabled
          uncontrolled
        />
        <TextField
          id='updated_at'
          label='Дата обновления'
          name='updated_at'
          value={dayjs(orderData?.data?.updatedAt).format('DD.MM.YYYY HH:mm')}
          fullWidth
          disabled
          uncontrolled
        />
        <TextField
          id='pickup_time'
          label='Время забирания'
          name='pickup_time'
          value={dayjs(orderData?.data?.deliveryTime).subtract(deliveryInfo?.data?.eta, 'minute').format('DD.MM.YYYY HH:mm')}
          fullWidth
          disabled
          uncontrolled
        />
        <TextField
          id='delivery_time'
          label='Срок доставки'
          name='delivery_time'
          value={dayjs(orderData?.data?.deliveryTime).format('DD.MM.YYYY HH:mm')}
          fullWidth
          disabled
          uncontrolled
        />
        <TextField
          id='done_at'
          label='Время выполнения'
          name='done_at'
          value={orderData?.data?.doneAt ? dayjs(orderData?.data?.doneAt).format('DD.MM.YYYY HH:mm') : 'Заказ не завершен'}
          fullWidth
          disabled
          uncontrolled
        />
      </Box>
    </>
  )
}
