import { Box, Grid } from '@mui/material'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import InputSwitchNew from '../../../../components/Inputs/InputSwitch'

import { get } from 'lodash'
import { useQuery } from 'react-query'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'
import LazySelect from '../../../../components/Select/LazySelect'
import { requests } from '../../../../utils/requests'
import PaymentTypeRow from './paymentTypeRow'

export default function MainDetails({ clientData, paymentTypes, setPaymentTypes, openDrawer }) {
  const mode = openDrawer?.mode

  const { data: employeeInfo } = useQuery(['employeeInfo', openDrawer], () => requests.getSingleCashBox(mode == 'edit' && get(openDrawer, 'id', null)), {
    enabled: mode == 'edit',
  })

  const { data: paymentTypeList } = useQuery(
    ['paymentTypeList', openDrawer],
    () => requests.getPaymentTypesList({ cash_box_id: get(openDrawer, 'id', null) }),
    {
      enabled: Boolean(openDrawer),
    }
  )

  const { control, errors, reset, setValue } = useFormContext()

  const { t } = useTranslation()

  useEffect(() => {
    if (mode === 'edit') {
      setValue('name', get(employeeInfo, 'data.data.name'))
      setValue('is_enable', get(employeeInfo, 'data.data.is_enable') ? 'active' : 'inactive')
      setValue('store_id', {
        id: get(employeeInfo, 'data.data.store.id'),
        name: get(employeeInfo, 'data.data.store.name'),
      })
    } else {
      reset()
      setValue('is_enable', 'inactive')
    }
  }, [employeeInfo])
  useEffect(() => {
    setPaymentTypes(get(paymentTypeList, 'data.data'))
  }, [paymentTypeList?.data])

  return (
    <Box mt={'24px'}>
      <Label mb='4px'>{t('name')}</Label>

      <TextField
        id='client-name'
        name='name'
        control={control}
        fullWidth
        error={errors?.name}
        placeholder={t('name.placeholder')}
        required
        defaultValue={clientData?.name || ''}
        asteriks
      />

      <Box mb={4} />

      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Label mb='4px'>{t('branch')}</Label>
          <LazySelect
            slug='users'
            id='store'
            name='store_id'
            isMulti={false}
            placeholder={t('Выберите Аптека')}
            minWidth='auto'
            isClearable={true}
            request={requests.getAllStores}
            filters={{ limit: 10 }}
            control={control}
            getOptionLabel={(option) => {
              return option.name
            }}
            filterOption={() => true}
          />
        </Grid>
        <Grid item xs={6}>
          <Label mb='4px'>{t('status')}</Label>

          <InputSwitchNew
            id='client-gender'
            noMarginTop
            required
            name='is_enable'
            control={control}
            error={errors?.is_enable}
            options={[
              {
                title: 'Активный',
                value: 'active',
              },
              {
                title: 'Неактивный',
                value: 'inactive',
              },
            ]}
          />
        </Grid>
      </Grid>
      <Box pt={'32px'}>
        <Label>Типы оплат</Label>
        {paymentTypes?.map((type) => (
          <PaymentTypeRow key={type?.id} setPaymentTypes={setPaymentTypes} type={type} />
        ))}
      </Box>
    </Box>
  )
}
