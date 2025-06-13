import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CrreatePaymentAssetBody from './CrreatePaymentAssetBody'

export default function CrreatePaymentAsset({ isOpen, onClose, categoriesRefetch }) {
  const methods = useForm()

  const { mutate: createPaymentAsset, isLoading: createPaymentAssetLoading } = useMutation(requests.createPaymentAsset, {
    onSuccess: () => {
      categoriesRefetch()
      success('Действие успешно создано!')
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании действии!')
      console.log('err', err)
    },
  })

  const { mutate: editPaymentAsset, isLoading: editPaymentAssetLoading } = useMutation(requests.editPaymentAsset, {
    onSuccess: () => {
      categoriesRefetch()
      success('Действие успешно создано!')
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании действии!')
      console.log('err', err)
    },
  })
  const capitalizeFirstLetter = (str) => str?.charAt(0)?.toUpperCase() + str?.slice(1)

  const onSubmit = (data) => {
    if (get(isOpen, 'mode') == 'edit') {
      const requestBody = {
        merchant_id: Number(get(data, 'merchant_id')),
        store_id: get(data, 'store_id.value'),
        payment_type_id: get(data, 'payment_type_id.value'),
        ...(get(data, 'type_action') !== 'payme' && { secret_key: get(data, 'metchant_key') }),
        ...(get(data, 'type_action') === 'click' && {
          service_id: get(data, 'service_id'),
          secret_key: get(data, 'secret_key'),
          merchant_user_id: get(data, 'merchant_user_id'),
        }),

        type: get(data, 'type_action') || 'payme',
        name: capitalizeFirstLetter(get(data, 'type_action')) || 'Payme',
      }
      editPaymentAsset({ id: get(isOpen, 'id'), data: requestBody })
    } else {
      createPaymentAsset({
        store_id: get(data, 'store_id.value'),
        payment_type_id: get(data, 'payment_type_id.value'),

        merchant_id: get(data, 'merchant_id'),
        ...(get(data, 'type_action') !== 'payme' && { secret_key: get(data, 'metchant_key') }),
        ...(get(data, 'type_action') === 'click' && {
          service_id: get(data, 'service_id'),
          secret_key: get(data, 'secret_key'),
          merchant_user_id: get(data, 'merchant_user_id'),
        }),

        type: get(data, 'type_action') || 'payme',
        name: capitalizeFirstLetter(get(data, 'type_action')) || 'Payme',
      })
    }
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }

  return (
    <CardDrawer
      closeDrawer={onClose}
      title={
        <Box display='inline-flex'>
          <Typography fontSize={32} variant='h2'>
            {get(isOpen, 'mode') == 'edit' ? 'Редактирование' : 'Создать'} ключ
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <LoadingButton onClick={methods.handleSubmit(onSubmit, onError)} loading={createPaymentAssetLoading} variant='contained' fullWidth>
            {get(isOpen, 'mode') == 'edit' ? 'Редактирование' : 'Создать'}
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <CrreatePaymentAssetBody isOpen={isOpen} />
      </FormProvider>
    </CardDrawer>
  )
}
