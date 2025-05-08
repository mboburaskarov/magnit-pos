import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import DateRangeInput from '../../../components/Inputs/DateRangeInput/DateRangeInput'
import MultiOptionSelectNew from '../../../components/Select/MultiOptionSelectNew'
import { requests } from '../../../utils/requests'
export default function DashboardHeader({ selectedShops, setSelectedShops }) {
  const { t } = useTranslation()
  const userData = useSelector((state) => state.user)
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  return (
    <Box p={'24px 20px 13px 20px'} bgcolor='background.default' top={0} display='inline-flex' justifyContent='space-between'>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h1' fontWeight={600} mb={'5px'} fontSize={'40px'} lineHeight={'50px'} color={'dark.500'}>
          {t('greeting')}, {get(userData, 'first_name')}!
        </Typography>
        <Typography variant='h1' fontWeight={300} fontSize={'16px'} lineHeight={'24px'} color={'gray.500'}>
          Добро пожаловать в магазин. Управляйте своим магазином с помощью магазина
        </Typography>
      </Box>
      <Box display='inline-flex' padding={'11px 0'} columnGap={3}>
        <DateRangeInput
          minHeight={'56px'}
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
            '.selection': {
              height: '56px',
            },
          }}
        >
          <MultiOptionSelectNew
            zIndex={999}
            placeholder={t('placeholders.select_shops')}
            // fullWidth
            multiple
            defaultSelectedAll
            // minWidth='auto'
            beforeContent={t('placeholders.select_shops')}
            value={selectedShops}
            allOptions={get(shopList, 'data.data.ids', [])}
            selectAllLabel={t('Все филиалы')}
            options={get(shopList, 'data.data.data', [])}
            isLoading={false}
            onChange={(val) => {
              setSelectedShops(val)
            }}
            request={requests.getAllStores}
          />
          {/* <PopUpSelect selectedStore={selectedStore} setselectedStore={setselectedStore} id='1' name='f' /> */}
          {/* <LazySelect
            slug='users'
            boxStyle={{ minWidth: '200px', width: '100%' }}
            id='store'
            minHeight={'56px'}
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
                    id: 'all',
                    name: 'Все',
                  }
            }
            uncontrolled
            getOptionLabel={(option) => {
              return <Typography color='grey.600'>{option.name}</Typography>
            }}
            filterOption={() => true}
          /> */}
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
