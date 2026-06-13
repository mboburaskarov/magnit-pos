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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const { mutate: skipToAutoOrder, isLoading: isSkipToAutoOrder } = useMutation(requests.skipToAutoOrder, {
    onSuccess: ({ data }) => {
      refresh()
      success(t('skip_auto_order_success'))
    },
    onError: (err) => {
      error(t('skip_auto_order_error'))
      console.error('err', err)
    },
  })
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
            {thousandDivider(get(item, 'unit_price'))} {t('pos.currency_short')}
          </Typography>
        </Typography>
      </Box>

      {item.status === 'REJECTED' && (
        <>
          <SectionTitle grey mt={6}>
            {t('reason_rejected')}
          </SectionTitle>
          <Box mt={2} overflow={'hidden'} bgcolor={'grey.100'} borderRadius={3} p={4}>
            <Typography sx={{ width: '100%', wordBreak: 'break-word' }}>{item.rejectedComment || t('no')}</Typography>
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
        <Typography>{t('exclude_from_auto_order')}</Typography>
      </Box>
      <Box px={'40px'} my={'20px'} mb={'80px'}>
        <SectionTitle grey>{t('additional_info')}</SectionTitle>
        <DrawerInfoBox
          infoData={[
            { title: t('product_name'), info: item.name, fullWidth: true },
            { title: t('table_columns.barcode'), info: thousandDivider(item.barcode, '') },
            { title: t('price'), info: thousandDivider(item.unit_price, t('pos.currency_short')) },
            { title: t('table_columns.manufacturer'), info: get(item, 'producer.name', '-') },
            { title: t('bonus_amount'), info: thousandDivider(item.bonus_amount, t('pos.currency_short')) },
            { title: t('bonus_percent'), info: thousandDivider(item.bonus_percent, '%') },
            { title: t('preparation_time'), info: dayjs(item.expire_date).format('DD.MM.YYYY') },
            { title: t('units_of_measurement'), info: item?.unit_name },

            { title: t('table_columns.type'), info: item.type === 'BUCHET' ? 'Buchet' : 'Market' },
            { title: t('description'), info: item.description, fullWidth: true },
            { title: t('table_columns.category'), info: item?.categories?.map((item) => item.name).join('<br>'), fullWidth: true },
          ]}
        />
      </Box>
    </Drawer>
  )
}
