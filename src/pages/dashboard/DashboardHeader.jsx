import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import MultiOptionSelectNew from '@components/Select/MultiOptionSelectNewV2'
import GroupMultiSelect from '@components/Select/GroupMultiSelect'
import { requests } from '@utils/requests'

export default function DashboardHeader({ selectedShops, setSelectedShops, setSelectedAllB2B }) {
  const { t } = useTranslation()
  console.log(selectedShops)

  const userData = useSelector((state) => state.user)
  const { data: shopList } = useQuery('shopList', () => requests.getAllComapniesWithStores({ limit: 20, offset: 0 }))
  return (
    <Box p={'24px 20px 13px 20px'} bgcolor='background.default' top={0} display='inline-flex' justifyContent='space-between'>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h1' fontWeight={700} mb={'5px'} fontSize={'28px'} lineHeight={'40px'} color={'dark.500'}>
          {t('greeting')}, {get(userData, 'first_name')}!
        </Typography>
        <Typography variant='h1' fontWeight={500} fontSize={'14px'} lineHeight={'20px'} color={'bunker.500'}>
          Добро пожаловать! Управляйте своими аптеками с помощью PharmaCosmos CRM.
        </Typography>
      </Box>
      <Box display='inline-flex' padding={'11px 0'} columnGap={3}>
        <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />

        <Box
          sx={{
            width: 400,
            '.selection': {
              height: '48px',
            },
          }}
        >
          {/* <GroupMultiSelect label='Select Pharmacies' apiData={shopList?.data} value={[]} onChange={setSelectedShops} /> */}
          <MultiOptionSelectNew
            zIndex={9}
            placeholder={t('placeholders.select_shops')}
            multiple
            defaultSelectedAll
            beforeContent={t('placeholders.select_shops')}
            value={selectedShops}
            allOptions={get(shopList, 'data.data.ids', [])}
            selectAllLabel={t('Все филиалы')}
            options={get(shopList, 'data.data.data', [])}
            isLoading={false}
            onChangeAllB2B={(val) => {
              setSelectedAllB2B(val)
            }}
            onChange={(val) => {
              setSelectedShops(val)
            }}
            request={requests.getAllStores}
          />
        </Box>
      </Box>
    </Box>
  )
}
