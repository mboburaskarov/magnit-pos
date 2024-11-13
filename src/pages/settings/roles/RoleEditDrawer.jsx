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

export default function RoleEditDrawer({ isOpen, id, onClose, refetch, status }) {
  const methods = useForm()
  const [permissionList, setPermission] = useState([])
  const [childrens, setChildrens] = useState([])
  const { data: roleData } = useQuery(['roleData', id], () => requests.getSingleRole(id), { enabled: !!id && status === 'ROLES' })
  const { data: actionData } = useQuery(['actionData', id], () => requests.getSingleAction(id), { enabled: !!id && status === 'ACTION' })
  const { data: roleActions } = useQuery(['roleActions', id], () => requests.getSingleRoleActions({ roleId: id }), { enabled: !!id && status === 'ROLES' })
  const { mutate: updateRoleAction, isLoading: isUpdatingRoleAction } = useMutation(requests.updaterRoleActionMany, {
    onSuccess: () => {
      success('Роль успешно редактирован!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при редактирования роли!')
      refetch()
      console.log('err', err)
    },
  })
  const { mutate: updateRole, isLoading: isUpdatingRole } = useMutation(requests.updateRole, {
    onSuccess: () => {
      const flattenPermissions = (permissions) => {
        let flatList = []
        permissions.forEach((permission) => {
          flatList.push(permission)
          if (permission.children) {
            flatList = flatList.concat(flattenPermissions(permission.children))
          }
        })
        return flatList
      }
      const initialAllowedIds = roleActions?.data[0]?.actions.map((action) => action._id) || []
      const flattenedPermissionList = flattenPermissions(permissionList)
      const available = []
      const unavailable = []

      flattenedPermissionList.forEach((permission) => {
        const initiallyAllowed = initialAllowedIds.includes(permission._id)
        if (permission.isAvailable && !initiallyAllowed) {
          available.push(permission._id)
        } else if (!permission.isAvailable && initiallyAllowed) {
          unavailable.push(permission._id)
        }
      })

      updateRoleAction({
        roleId: id,
        available,
        unavailable,
      })
    },
    onError: (err) => {
      error('Ошибка при редактирования роли!')
      refetch()
      console.log('err', err)
    },
  })
  const { mutate: updateAction, isLoading: isUpdatingAction } = useMutation(requests.updateAction, {
    onSuccess: () => {
      success('Действие успешно изменено!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при редоктировании действия!')
      refetch()
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    if (status === 'ROLES') {
      updateRole({
        id,
        data: {
          name: data?.name,
          code: data?.name,
          description: data?.description,
        },
      })
    } else {
      updateAction({
        id,
        data: {
          type: actionData?.data?.type,
          name: data?.name,
          route: data?.route,
          permissions: data?.permissions?.join(','),
        },
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
            Изменить {status === 'ROLES' ? 'роль' : 'действие'}
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box width='100%' display='inline-flex'>
          <LoadingButton
            variant='contained'
            loading={status === 'ROLES' ? isUpdatingRole && isUpdatingRoleAction : isUpdatingAction}
            onClick={methods.handleSubmit(onSubmit, onError)}
            fullWidth
          >
            Редактировать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        {status === 'ROLES' ? (
          <RoleCreateBody roleData={roleData?.data} permissionList={permissionList} setPermission={setPermission} roleActions={roleActions?.data[0]} />
        ) : (
          <ActionCreateBody childrens={childrens} setChildrens={setChildrens} actionData={actionData?.data} />
        )}
      </FormProvider>
    </CardDrawer>
  )
}
