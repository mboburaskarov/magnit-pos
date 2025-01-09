import { Box, Typography } from '@mui/material'
import CardDrawer from '../../../../components/Drawers/CardDrawer'
import { FormProvider, useForm } from 'react-hook-form'
import { error, success } from '../../../../utils/toast'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { LoadingButton } from '@mui/lab'
import RoleCreateBody from './RoleCreateBody'
import { useState } from 'react'
import ActionCreateBody from './ActionCreateBody'
import { get } from 'lodash'

export default function RolesCreateDrawer({ isOpen, onClose }) {
  const methods = useForm()
  const [childrens, setChildrens] = useState([])

  const { mutate: createPermission, isLoading: createPermissionLoading } = useMutation(requests.createPermission, {
    onSuccess: () => {
      success('Действие успешно создано!')
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании действии!')
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    createPermission({
      description: get(data, 'description'),
      entity_name: get(data, 'name'),
      method: get(data, 'method', 'GET').map((item) => get(item, 'value')),
      ...(get(data, 'type_page') !== 'PARENT' && { parent_id: get(data, 'parent_id.value') }),
      ...(get(data, 'type_action') !== 'MODULE' ? { key: get(data, 'key') } : { route: get(data, 'route') }),

      type: get(data, 'type_action'),
    })
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
            Создать Действие
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <LoadingButton onClick={methods.handleSubmit(onSubmit, onError)} loading={createPermissionLoading} variant='contained' fullWidth>
            Создать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        <ActionCreateBody />
      </FormProvider>
    </CardDrawer>
  )
}
