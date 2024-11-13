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

export default function RolesCreateDrawer({ isOpen, onClose, refetch, status }) {
  const methods = useForm()
  const [permissionList, setPermission] = useState([])
  const [childrens, setChildrens] = useState([])
  const { mutate: mutateRoleAction, isLoading: createRoleActionLoading } = useMutation(requests.createRoleActionInsertMany, {
    onSuccess: () => {
      success('Роль успешно создана!')

      setPermission([])
      methods.setValue('name', '')
      methods.setValue('description', '')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании роли!')
      console.log('err', err)
      onClose()
    },
  })
  const { mutate, isLoading: createRolesLoading } = useMutation(requests.createRole, {
    onSuccess: (data) => {
      const extractIds = (permissions) => {
        return permissions.flatMap((permission) => {
          const ids = [permission?._id]
          if (permission?.children) {
            ids.push(...extractIds(permission.children?.filter((children) => children?.isAvailable === true)))
          }
          return ids
        })
      }
      const roleId = data?.data?._id
      const actionIds = extractIds(permissionList?.filter((permission) => permission?.isAvailable === true))
      mutateRoleAction({
        roleId,
        actionIds,
      })
    },
    onError: (err) => {
      error('Ошибка при создании роли!')
      console.log('err', err)
    },
  })
  const { mutate: createAction, isLoading: createActionLoading } = useMutation(requests.createActionInsertMany, {
    onSuccess: () => {
      childrens.map((item) => {
        methods.setValue(`child_route_${item._id}`, '')
        methods.setValue(`child_name_${item._id}`, '')
        methods.setValue(`child_permissions_${item._id}`, [])
      })
      setChildrens([])
      success('Действие успешно создано!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании действии!')
      refetch()
      console.log('err', err)
    },
  })
  const { mutate: createChildAction, isLoading: createChildActionLoading } = useMutation(requests.createAction, {
    onSuccess: () => {
      childrens.map((item) => {
        methods.setValue(`child_route_${item._id}`, '')
        methods.setValue(`child_name_${item._id}`, '')
        methods.setValue(`child_permissions_${item._id}`, [])
      })
      setChildrens([])
      success('Действие успешно создано!')
      refetch()
      onClose()
    },
    onError: (err) => {
      error('Ошибка при создании действии!')
      refetch()
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    if (status === 'ROLES') {
      mutate({
        name: data?.name,
        code: data?.name,
        description: data?.description,
      })
    } else {
      if (data?.type_action == 'PAGE') {
        if (data?.type_page == 'CHILD') {
          createChildAction({
            name: data?.name,
            type: data?.type_action,
            route: data?.route,
            permissions: data?.permissions?.join(','),
            parentId: data?.parent_id?.value,
          })
        } else {
          createAction({
            name: data?.name,
            type: data?.type_action,
            route: data?.route,
            permissions: data?.permissions?.join(','),
            children: childrens.flatMap((child) => {
              return {
                name: data[`child_name_${child?._id}`],
                route: data[`child_route_${child?._id}`],
                permissions: data[`child_permissions_${child?._id}`].join(','),
                type: data?.type_action,
              }
            }),
          })
        }
      } else {
        createAction({
          name: data?.name,
          type: data?.type_action,
          route: data?.route,
          permissions: data?.permissions?.join(','),
        })
      }
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
            Создать {status === 'ROLES' ? 'Роль' : 'Действие'}
          </Typography>
        </Box>
      }
      isOpen={!!isOpen}
      actions={
        <Box columnGap={2} width='100%' display='inline-flex'>
          <LoadingButton
            onClick={methods.handleSubmit(onSubmit, onError)}
            loading={status === 'ROLES' ? createRolesLoading && createRoleActionLoading : createActionLoading && createChildActionLoading}
            variant='contained'
            fullWidth
          >
            Создать
          </LoadingButton>
        </Box>
      }
    >
      <FormProvider {...methods}>
        {status === 'ROLES' ? (
          <RoleCreateBody permissionList={permissionList} setPermission={setPermission} />
        ) : (
          <ActionCreateBody childrens={childrens} setChildrens={setChildrens} />
        )}
      </FormProvider>
    </CardDrawer>
  )
}
