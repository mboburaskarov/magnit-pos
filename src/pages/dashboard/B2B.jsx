import { Box, Grid } from '@mui/material'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { useMemo, useState } from 'react'

import CheckAccess from '@components/CheckAccess'
import LoadingContainer from '@components/LoadingContainer'

import { useQueryParams } from '@hooks/useQueryParams'

import Dashboard_B2B from './Dashboard_B2B'
import DashboardInfoBox from './DashboardInfoBox'

import { dashboardBoxData } from '.'
export default function DashboarB2BPage() {
  dayjs.extend(isoWeek)
  const { values } = useQueryParams()
  const [selectedComapanies, setSelectedComapanies] = useState('all')

  const dashboard_company_filter = useMemo(() => {
    const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
    const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)

    return {
      limit: values?.limit || 15,
      search: values?.search,
      is_franchise: selectedComapanies == 'all' ? true : undefined,
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
      company_ids: selectedComapanies.length <= 63 && selectedComapanies != 'all' ? [...selectedComapanies?.map((a) => a.id)] : null || null,
      offset: values?.search ? 0 : values?.offset || 0,
    }
  }, [values?.offset, selectedComapanies, values?.start_date, values?.end_date, values?.from_time, values?.to_time, values?.limit, values?.search])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={0} px={'20px'} pb={3} width={'100%'}>
        <Grid width={'100%'} container>
          <Grid width={'100%'} item>
            <Dashboard_B2B setSelectedShops={setSelectedComapanies} selectedShops={selectedComapanies} />
            <Grid container mt={0} spacing={2}>
              {dashboardBoxData
                .filter((p) => p?.id != 'bonus_amount')
                .map((el, ind) => (
                  <CheckAccess id={`dashboard-box-${el.id}`}>
                    <Grid item xs={12} xl={4} sm={12} md={6} lg={4} gap={0} pb={'0px'} pt={'20px !important'} spacing={2}>
                      <DashboardInfoBox dashboard_filter={dashboard_company_filter} key={ind} {...el} />
                    </Grid>
                  </CheckAccess>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LoadingContainer>
  )
}
