import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import ActionCreateBody from './ActionCreateBody'

export default function RolesCreateDrawer({ isOpen, onClose, categoriesRefetch }) {
  const methods = useForm()
  console.log(isOpen)

  const { mutate: createPermission, isLoading: createPermissionLoading } = useMutation(requests.createPermission, {
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

  const { mutate: editPermission, isLoading: editPermissionLoading } = useMutation(requests.editPermission, {
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
  const onSubmit = (data) => {
    if (get(isOpen, 'mode') == 'edit') {
      const requestBody = {
        description: get(data, 'description'),
        name: get(data, 'name'),
        method: get(data, 'method', 'GET').map((item) => get(item, 'value')),
        ...(get(data, 'type_page') !== 'PARENT' && { parent_id: get(data, 'parent_id.value') }),
        ...(get(data, 'type_action') === 'MODULE' ? { key: get(data, 'key') } : { route: get(data, 'route') }),

        type: get(data, 'type_action'),
      }
      editPermission({ id: get(isOpen, 'id'), data: requestBody })
    } else {
      createPermission({
        description: get(data, 'description'),
        name: get(data, 'name'),
        method: get(data, 'method', 'GET').map((item) => get(item, 'value')),
        ...(get(data, 'type_page') !== 'PARENT' && { parent_id: get(data, 'parent_id.value') }),
        ...(get(data, 'type_action') === 'MODULE' ? { key: get(data, 'key') } : { route: get(data, 'route') }),

        type: get(data, 'type_action'),
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
            {get(isOpen, 'mode') == 'edit' ? 'Редактирование' : 'Создать'} Действие
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <LoadingButton onClick={methods.handleSubmit(onSubmit, onError)} loading={createPermissionLoading} variant='contained' fullWidth>
            {get(isOpen, 'mode') == 'edit' ? 'Редактирование' : 'Создать'}
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <ActionCreateBody isOpen={isOpen} />
      </FormProvider>
    </CardDrawer>
  )
}
