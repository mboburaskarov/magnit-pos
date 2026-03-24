import { Box, Container } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { error, success } from '@utils/toast'
import { useMutation, useQuery } from 'react-query'
import { requests } from '@utils/requests'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingContainer from '@components/LoadingContainer'
import RoleBody from './RoleBody'
import Header from '@components/Header'
import { get, size } from 'lodash'
export default function RoleEditPage() {
  const { id } = useParams()

  const [selected, setSelected] = useState([])
  const [disabled, setDisabled] = useState([])
  const methods = useForm()
  const navigate = useNavigate()

  useEffect(() => {
    methods.register('categories')
    return
  }, [])

  const { mutate: createRole, isLoading: createRoleLoading } = useMutation(requests.editRole, {
    onSuccess: async ({ data }) => {
      success('Роль создана')
      navigate('/settings/roles')
    },
    onError: (err) => {
      error('Ошибка создания роли')
      console.error('err', err)
    },
  })
  const { data: singleRoleData } = useQuery('singleRoleData', () => requests.getSingleRole(id))
  const { data: rolesAndPermissionList } = useQuery(['rolesAndPermissionListForEdit', id], () =>
    requests.getAllRolesWithPermissions({ role_id: id, limit: 20, offset: 0 })
  )
  function getSelectedChildrenRecursive(permission, selected) {
    let selectedChildren = []

    if (!permission.children) return selectedChildren

    for (const child of permission.children) {
      if (selected.includes(child.id)) {
        selectedChildren.push(child.id)
      }

      selectedChildren = selectedChildren.concat(getSelectedChildrenRecursive(child, selected))
    }

    return selectedChildren
  }
  const onSubmit = (data) => {
    const permissions = []
    get(rolesAndPermissionList, 'data.data', [])
      .filter((section) => section.permissions?.length && !disabled.includes(section.key))
      .forEach((section) => {
        section?.permissions?.forEach((permission) => {
          !selected?.includes(permission?.id) && size(selected.filter((el) => permission.children.find((child) => child.id === el))) == 0
            ? {}
            : permissions.push({
                parent_id: permission?.id || '',
                children_ids: getSelectedChildrenRecursive(permission, selected),
                is_active: !!selected?.includes(permission?.id) || getSelectedChildrenRecursive(permission, selected).length > 0,
              })
        })
      })

    const requestBody = {
      name: get(data, 'name'),
      description: get(data, 'description'),
      permissions: permissions,
    }
    createRole({ id, data: requestBody })
  }
  const onError = (err) => {
    console.error(err)
  }

  return (
    <LoadingContainer readyState={true}>
      <Box pb={10}>
        <Header
          isLoading={createRoleLoading}
          buttonText='Редактировать'
          backIcon
          backHref='/settings/roles'
          text={'Редактировать роль'}
          checkAccessId={'product-create'}
          onSubmit={methods.handleSubmit(onSubmit, onError)}
        />
        <Container>
          <FormProvider {...methods}>
            <Box flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <RoleBody
                rolesAndPermissionList={rolesAndPermissionList}
                selected={selected}
                setSelected={setSelected}
                disabled={disabled}
                roleData={get(singleRoleData, 'data.data', [])}
                setDisabled={setDisabled}
              />
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </LoadingContainer>
  )
}
