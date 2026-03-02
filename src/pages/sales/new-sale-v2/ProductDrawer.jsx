import DrawerInfoBox from '@components/Drawers/DrawerInfoBox'
import { Box, Checkbox, Drawer, Typography } from '@mui/material'
import thousandDivider from '@utils/thousandDivider'
import SectionTitle from '@components/SectionTitle'
import DefaultImgIcon from '@icons/defaultImgIcon'
import CustomImg from '@components/CustomImg'
import getImageUrl from '@utils/getImageUrl'
import { get } from 'lodash'
import dayjs from 'dayjs'
import { error, success } from '@utils/toast'
import { useMutation } from 'react-query'
import { requests } from '@utils/requests'

const Image = ({ data, setImages, refresh }) => {
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
        '& svg': {
          width: '72px',
          height: '72px',
        },
      }}
    >
      {data?.photos?.[0] ? (
        <CustomImg
          onClick={() => setImages({ data: data?.photos })}
          src={getImageUrl(data?.photos?.[0])}
          alt={data?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
        />
      ) : (
        <DefaultImgIcon />
      )}
      {data?.files?.[0] && (
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
          onClick={() => setImages({ data: data?.files })}
        />
      )}
    </Box>
  )
}

export default function ProductDrawer({ open: item, onClose, setImages, refresh }) {
  const { mutate: skipToAutoOrder, isLoading: isSkipToAutoOrder } = useMutation(requests.skipToAutoOrder, {
    onSuccess: ({ data }) => {
      refresh()
      success('Товар успешно исключен из автозаказа')
    },
    onError: (err) => {
      error('Ошибка при исключении товара из автозаказа')
      console.error('err', err)
    },
  })
  console.log(item)
  return (
    <Drawer
      anchor='right'
      sx={{
        '& .MuiDrawer-paper': {
          width: '660px',
          borderRadius: '24px 0 0 24px',
        },
      }}
      onClose={() => onClose(false)}
      open={!!item}
    >
      <Box display='inline-flex' pt={'40px'} pb={'20px'} px={'40px'}>
        <Image setImages={setImages} data={item?.photos?.[0]} />
        <Typography mt={0.5} ml={2} fontSize={24} color={'bunker.950'} lineHeight={'32px'} fontWeight={'700'}>
          {item.name}
          <Typography display='flex' alignItems='center' color='orange.500' mt={1} fontWeight={'500'}>
            {thousandDivider(get(item, 'unit_price'))} сум
          </Typography>
        </Typography>
      </Box>

      {item.status === 'REJECTED' && (
        <>
          <SectionTitle grey mt={6}>
            Причина отклона
          </SectionTitle>
          <Box mt={2} overflow={'hidden'} bgcolor={'grey.100'} borderRadius={3} p={4}>
            <Typography sx={{ width: '100%', wordBreak: 'break-word' }}>{item.rejectedComment || 'Нет'}</Typography>
          </Box>
        </>
      )}
      <Box borderBottom={'1px solid'} borderColor={'bunker.100'} height={'10px'} />
      {/* add sklip this item to auto order */}
      <Box display='flex' alignItems='center' px={'40px'} my={'20px'} gap={1}>
        <Checkbox
          checked={item.skip_to_auto_order}
          onChange={(e) => {
            skipToAutoOrder({ id: item.id, data: { is_auto_order: e.target.checked } })
          }}
        />
        <Typography>Исключить из автозаказа</Typography>
      </Box>
      <Box px={'40px'} my={'20px'} mb={'80px'}>
        <SectionTitle grey>Доп. информация</SectionTitle>
        <DrawerInfoBox
          infoData={[
            { title: 'Наименование товара', info: item.name, fullWidth: true },
            { title: 'Баркод', info: thousandDivider(item.barcode, '') },
            { title: 'Цена', info: thousandDivider(item.unit_price, 'сум') },
            { title: 'Производитель', info: get(item, 'producer.name', '-') },
            { title: 'Сумма бонуса', info: thousandDivider(item.bonus_amount, 'сум') },
            { title: 'Бонусный процент', info: thousandDivider(item.bonus_percent, '%') },
            { title: 'Время подготовки', info: dayjs(item.expire_date).format('DD.MM.YYYY') },
            { title: 'Единицы измерения', info: item?.unit_name },

            { title: 'Тип', info: item.type === 'BUCHET' ? 'Buchet' : 'Market' },
            { title: 'Описание', info: item.description, fullWidth: true },
            { title: 'Категории', info: item?.categories?.map((item) => item.name).join('<br>'), fullWidth: true },
          ]}
        />
      </Box>
    </Drawer>
  )
}
