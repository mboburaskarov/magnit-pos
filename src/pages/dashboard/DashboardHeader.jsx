import { Box, Button, Typography } from '@mui/material'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import DateRangeInput from '../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import CheckAccess from '../../../components/CheckAccess'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import SelectSimple from '../../../components/Select/SelectSimple'
import { useMemo } from 'react'
import LazySelect from '../../../components/Select/LazySelect'
import { requests } from '../../../utils/requests'
import * as qs from 'qs'
import { useNavigate } from 'react-router-dom'
import { useQueryParams } from '../../hooks/useQueryParams'
export default function DashboardHeader({ setSortBy }) {
  const { isOpen } = useSelector((state) => state.sidebarSettings)
  const { type } = useSelector((state) => state.user)
  const check = type === 'SUPERADMIN' || type === 'ACCOUNTANT'
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const getSelectDefaultValue = (options, value) => {
    return options.find((option) => option.value === value) || options[0]
  }
  const THEME_OPTIONS = [
    { name: 'Auto', value: 'auto' },
    { name: 'Dark', value: 'dark' },
    { name: 'Light', value: 'light' },
  ]

  const themeDefaultValue = useMemo(() => {}, [])

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
        {/* <Box>
          <Button onClick={() => navigate('/shops/create')} fullWidth variant='contained' color='primary'>
            {t('all_reports')}
          </Button>
        </Box> */}
        <Box
          sx={{
            maxWidth: 200,
          }}
        >
          <LazySelect
            slug='users'
            boxStyle={{ width: '100%' }}
            id='store'
            name='store_id'
            isMulti={false}
            placeholder={t('input.store.placeholder')}
            minWidth='auto'
            isClearable={false}
            // label={t('input.store.label')}
            request={requests.getAllStores}
            filters={{ limit: 10 }}
            // control={control}
            onChange={(e) => {
              navigate(
                `/dashboard${qs.stringify({ ...values, ...{ store_name: get(e, 'name'), store_id: get(e, 'id') }, offset: 0 }, { addQueryPrefix: true })}`
              )
            }}
            value={
              values?.store_id
                ? {
                    id: values?.store_id,
                    name: values?.store_name,
                  }
                : {
                    id: '1f900e8e-5b61-465c-a693-c37ecfec81cf',
                    name: 'Pharma Cosmos С-54 Хокимият',
                  }
            }
            uncontrolled
            getOptionLabel={(option) => {
              return <Typography color='grey.600'>{option.name}</Typography>
            }}
            filterOption={() => true}
          />
          {/* <SelectSimple
            maxWidth={'150px'}
            minWidth={'100px'}
            onChange={() => {}}
            value=''
            uncontrolled
            disabled={false}
            white
            isClearable={false}
            options={THEME_OPTIONS}
            name='thdeme'
          /> */}
        </Box>
        {/* </CheckAccess> */}
      </Box>
    </Box>
  )
}
