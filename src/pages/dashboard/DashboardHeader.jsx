import { Box, Typography } from '@mui/material'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import DateRangeInput from '../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

export default function DashboardHeader({ setSortBy }) {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const { type } = useSelector((state) => state.user)
  const check = type === 'SUPER_ADMIN' || type === 'ACCOUNTANT'
  return (
    <Box
      p={4}
      mt={2}
      zIndex={isOpen ? 20 : 3}
      bgcolor='background.default'
      top={0}
      position='sticky'
      display='inline-flex'
      justifyContent='space-between'
      boxShadow='0px 12px 24px 0px rgba(0, 0, 0, 0.02)'
    >
      <Typography variant='h1'>Дашбоард</Typography>
      <Box display='inline-flex' columnGap={3}>
        <Box width={180}>
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
        </Box>
        <DateRangeInput
          defaultFilterData={{ label: 'Эта неделя', start_date: dayjs().tz().startOf('week'), end_date: dayjs().tz() }}
          id='accounting-report-date-range'
        />
      </Box>
    </Box>
  )
}
