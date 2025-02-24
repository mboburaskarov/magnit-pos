import { Box, Button, Typography } from '@mui/material'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import DateRangeInput from '../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import CheckAccess from '../../../components/CheckAccess'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'

export default function DashboardHeader({ setSortBy }) {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const { type } = useSelector((state) => state.user)
  const check = type === 'SUPERADMIN' || type === 'ACCOUNTANT'
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)

  return (
    <Box p={'30px 30px 50px 30px'} bgcolor='background.default' top={0} display='inline-flex' justifyContent='space-between'>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h1' fontWeight={600} mb={'5px'} fontSize={'40px'} lineHeight={'50px'} color={'dark.500'}>
          {t('greeting')}, {get(userData, 'first_name')}!
        </Typography>
        <Typography variant='h1' fontWeight={300} fontSize={'16px'} lineHeight={'24px'} color={'gray.500'}>
          Добро пожаловать в магазин. Управляйте своим магазином с помощью магазина
        </Typography>
      </Box>
      <Box display='inline-flex' columnGap={3}>
        <DateRangeInput
          defaultFilterData={{ label: 'Это час', start_date: dayjs().tz().startOf('week'), end_date: dayjs().tz() }}
          id='accounting-report-date-range'
        />
        {/* <CheckAccess id='shop-create'> */}
        <Box>
          <Button onClick={() => navigate('/shops/create')} fullWidth variant='contained' color='primary'>
            {t('all_reports')}
          </Button>
        </Box>
        {/* </CheckAccess> */}
      </Box>
    </Box>
  )
}
