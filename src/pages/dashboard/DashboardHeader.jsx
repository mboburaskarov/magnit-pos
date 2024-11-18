import { Box, Button, Typography } from '@mui/material'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import DateRangeInput from '../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import CheckAccess from '../../../components/CheckAccess'

export default function DashboardHeader({ setSortBy }) {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const { type } = useSelector((state) => state.user)
  const check = type === 'SUPER_ADMIN' || type === 'ACCOUNTANT'
  return (
    <Box
      p={'30px 30px 50px 30px'}
      // zIndex={isOpen ? 12 : 3}
      bgcolor='background.default'
      top={0}
      // position='sticky'
      display='inline-flex'
      justifyContent='space-between'
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h1' fontWeight={600} mb={'5px'} fontSize={'40px'} lineHeight={'50px'} color={'dark.500'}>
          Hayrli kun, Mr. Oybek!
        </Typography>
        <Typography variant='h1' fontWeight={300} fontSize={'16px'} lineHeight={'24px'} color={'grey.500'}>
          Welcome to Store, Manage your shop with store
        </Typography>
      </Box>
      <Box display='inline-flex' columnGap={3}>
        {/* <Box width={180}>
          {check && (
            <InputSwitch
              uncontrolled
              noMarginTop
              name='activity_type'
              required={true}
              defaultValue='SUM'
              onChange={(val) => setSortBy(val)}
              options={[
                { title: 'сум', value: 'SUM' },
                { title: 'шт', value: 'COUNT' },
              ]}
            />
          )}
        </Box> */}
        <DateRangeInput
          defaultFilterData={{ label: 'Shu hafta', start_date: dayjs().tz().startOf('week'), end_date: dayjs().tz() }}
          id='accounting-report-date-range'
        />
        <CheckAccess id='shop-create'>
          <Box>
            <Button
              onClick={() => navigate('/shops/create')}
              fullWidth
              // startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
              variant='contained'
              color='primary'
            >
              Barcha hisobotlar
            </Button>
          </Box>
        </CheckAccess>
      </Box>
    </Box>
  )
}
