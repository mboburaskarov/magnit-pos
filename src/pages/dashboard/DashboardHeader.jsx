import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import DateRangeInput from '@components/Inputs/DateRangeInput/DateRangeInput'
import MultiOptionSelectNew from '@components/Select/MultiOptionSelectNewV2'
import { requests } from '@utils/requests'
import CheckAccess from '@components/CheckAccess'

export default function DashboardHeader({ selectedShops, setSelectedShops, setSelectedAllB2B }) {
  const { t } = useTranslation()

  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: '0px',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <Box>
        <Typography
          variant='h1'
          sx={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#111827',
            mb: '8px',
            letterSpacing: '-0.02em',
            fontFamily: 'Euclid Circular B, sans-serif',
          }}
        >
          Дашборд
        </Typography>
        <Typography sx={{ color: '#71717A', fontFamily: 'Euclid Circular B, sans-serif' }}>Обзор бизнес-показателей и операций</Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          flex: 1,
          justifyContent: 'flex-end',
          minWidth: { xs: '100%', sm: 'auto' },
        }}
      >
        <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
        <CheckAccess id={'can-filter-store-in-dashboard'}>
          <Box
            sx={{
              width: { xs: '100%', sm: 300 },
              maxWidth: 300,
              flexShrink: 1,
              '.selection': {
                borderRadius: '8px',
                border: '1px solid #E5E7EB !important',
                backgroundColor: '#ffffff !important',
                height: '40px',
              },
            }}
          >
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
              onChangeAllB2B={(val) => setSelectedAllB2B(val)}
              onChange={(val) => setSelectedShops(val)}
              request={requests.getAllStores}
            />
          </Box>
        </CheckAccess>
      </Box>
    </Box>
  )
}
