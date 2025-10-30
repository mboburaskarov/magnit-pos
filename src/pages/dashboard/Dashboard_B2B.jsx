import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import DateRangeInput from '../../../components/Inputs/DateRangeInput/DateRangeInput'
import MultiOptionSelectNew from '../../../components/Select/MultiOptionSelectNew'
import { requests } from '../../../utils/requests'
import LeftArrowIcon from '../../assets/icons/LeftArrow'
export default function Dashboard_B2B({ selectedShops, setSelectedShops }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  return (
    <Box p={'24px 0px 0px 0px'} bgcolor='background.default' top={0} display='flex' justifyContent='space-between'>
      <Box onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '48px',
            height: '48px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: 'bunker.100',
            '&:hover': {
              backgroundColor: 'gray.10',
            },
          }}
        >
          <LeftArrowIcon />
        </Box>
        <Typography mt={'4px'} fontWeight={600} ml={'20px'} fontSize={'40px'} lineHeight={'50px'} color={'dark.500'}>
          B2B
        </Typography>
      </Box>
      <Box display='inline-flex' padding={'11px 0'} columnGap={3}>
        <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />

        <Box
          sx={{
            maxWidth: 400,
            '.selection': {
              height: '48px',
            },
          }}
        >
          <MultiOptionSelectNew
            zIndex={9}
            placeholder={t('placeholders.select_shops')}
            multiple
            customFilter={{
              is_franchise: true,
            }}
            defaultSelectedAll
            beforeContent={t('placeholders.select_shops')}
            value={selectedShops}
            selectAllLabel={t('Все B2B')}
            isLoading={false}
            onChange={(val) => {
              setSelectedShops(val)
            }}
            request={requests.getAllCompanies}
          />
        </Box>
      </Box>
    </Box>
  )
}
