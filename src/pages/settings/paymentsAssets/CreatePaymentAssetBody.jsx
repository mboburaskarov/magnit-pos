import { Box } from '@mui/material'
import { get } from 'lodash'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import InputSwitch from '@components/Inputs/InputSwitch'
import TextField from '@components/Inputs/TextField'
import LazySelect from '@components/Select/LazySelect'
import SelectSimple from '@components/Select/SelectSimple'
import { requests } from '@utils/requests'

export default function CreatePaymentAssetBody({ isOpen }) {
  const { setValue, watch } = useFormContext()
  const type_action = watch('type_action')

  const { data: actions } = useQuery('actions', () => requests.getAllActions())
  const { data: onePermission } = useQuery(['onePermission', isOpen], () => requests.getPaymentAsset(get(isOpen, 'id')), {
    enabled: Boolean(get(isOpen, 'id')),
  })
  useEffect(() => {
    setTimeout(() => {
      setValue('type_action', get(onePermission, 'data.data.type'))
      setValue(
        'parent_id',
        actions?.data?.data?.filter((e) => e.id == get(onePermission, 'data.data.parent_id')).flatMap((item) => ({ name: item?.name, value: item?.id }))[0]
      )
      if (get(onePermission, 'data.data.type') == 'payme') {
        setValue('payment_type_id', { name: get(onePermission, 'data.data.name'), value: get(onePermission, 'data.data.payment_type_id') })
        setValue('store_id', { name: get(onePermission, 'data.data.store.name'), value: get(onePermission, 'data.data.store.id') })
        setValue('merchant_id', get(onePermission, 'data.data.cashbox_id'))
        setValue('merchant_key', get(onePermission, 'data.data.secret_key'))
      } else if (get(onePermission, 'data.data.type') == 'alif') {
        setValue('payment_type_id', { name: get(onePermission, 'data.data.name'), value: get(onePermission, 'data.data.payment_type_id') })
        setValue('store_id', { name: get(onePermission, 'data.data.store.name'), value: get(onePermission, 'data.data.store.id') })
        setValue('merchant_id', get(onePermission, 'data.data.cashbox_id'))
        setValue('merchant_key', get(onePermission, 'data.data.secret_key'))
      } else {
        setValue('merchant_id', get(onePermission, 'data.data.merchant_id'))
        setValue('merchant_user_id', get(onePermission, 'data.data.merchant_user_id'))
        setValue('service_id', get(onePermission, 'data.data.service_id'))
        setValue('secret_key', get(onePermission, 'data.data.secret_key'))
        setValue('payment_type_id', { name: get(onePermission, 'data.data.name'), value: get(onePermission, 'data.data.payment_type_id') })
        setValue('store_id', { name: get(onePermission, 'data.data.store.name'), value: get(onePermission, 'data.data.store.id') })
        setValue('service_id', get(onePermission, 'data.data.service_id'))
      }
    }, 20)
  }, [onePermission?.data])

  const { data: paymentTypeList } = useQuery(['paymentTypeList', isOpen], () => requests.getPaymentTypesList({ type: 'app' }), {
    enabled: Boolean(isOpen),
  })
  const { t } = useTranslation()

  return (
    <Box>
      <Box gap={3} display={'flex'} flexDirection={'column'}>
        <Box>
          <InputSwitch
            id='type_action'
            name='type_action'
            defaultValue={'payme'}
            onChange={(e) => setValue('type_action', e)}
            options={[
              { title: 'Payme', value: 'payme' },
              { title: 'Click', value: 'click' },
              { title: 'Alif', value: 'alif' },
            ]}
          />
        </Box>
        <LazySelect
          slug='users'
          boxStyle={{ width: '100%' }}
          id='store'
          name='store_id'
          isMulti={false}
          placeholder={t('Выберите Аптека')}
          minWidth='auto'
          isClearable={true}
          label={t('input.store.label')}
          request={requests.getAllStores}
          filters={{ limit: 10 }}
          getOptionLabel={(option) => {
            return option.name
          }}
          filterOption={() => true}
        />
        <SelectSimple
          id={'payment_type_id'}
          options={paymentTypeList?.data?.data?.flatMap((item) => ({ name: item?.name, value: item?.id }))}
          required
          menuPlacement='bottom'
          fullWidth
          label={'Оплата'}
          name='payment_type_id'
          getOptionLabel={(option) => option.name}
          placeholder='Выберите оплата'
        />
        <Box>
          {type_action === 'click' ? (
            <>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <TextField required fullWidth name='merchant_id' label='Metchant ID' placeholder='Введите ID' />
                <TextField required fullWidth name='service_id' label='Service ID' placeholder='Введите ID' />
                <TextField required fullWidth name='secret_key' label='Secret Key' placeholder='Введите ID' />
                <TextField required fullWidth name='merchant_user_id' label='Merchant User ID' placeholder='Введите ID' />
              </Box>
              <Box height={'20px'} />
            </>
          ) : type_action === 'alif' ? (
            <>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <TextField required fullWidth name='merchant_id' label='Тoken' placeholder='Введите token' />
                <TextField required fullWidth name='merchant_key' label='Secret Key' placeholder='Введите key' />
              </Box>
              <Box height={'20px'} />
            </>
          ) : (
            <>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <TextField required fullWidth name='merchant_id' label='Metchant ID' placeholder='Введите ID' />
                <TextField required fullWidth name='merchant_key' label='Metchant Key' placeholder='Введите ID' />
              </Box>
              <Box height={'20px'} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}
