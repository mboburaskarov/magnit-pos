import { Box, Container } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { error, success } from '../../../../utils/toast'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useNavigate } from 'react-router-dom'
import LoadingContainer from '../../../../components/LoadingContainer'
import RoleBody from './RoleBody'
import Header from '../../../../components/Header'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
export default function RoleCreatePage() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState([])
  const [disabled, setDisabled] = useState([])
  const methods = useForm()
  const navigate = useNavigate()

  useEffect(() => {
    methods.register('categories')
    return
  }, [])

  const { mutate: createRole, isLoading: createRoleLoading } = useMutation(requests.createRole, {
    onSuccess: async ({ data }) => {
      success('Роль создана')
      navigate('/settings/roles')
    },
    onError: (err) => {
      error('Ошибка создания роли')
      console.log('err', err)
    },
  })
  const { data: rolesAndPermissionList, refetch: refetchrolesAndPermissionList } = useQuery('rolesAndPermissionList', () =>
    requests.getAllRolesWithPermissions({ limit: 20, offset: 0, type: appType })
  )
  const onSubmit = (data) => {
    const permissions = []
    get(rolesAndPermissionList, 'data.data', [])
      ?.filter((section) => section.permissions?.length && !disabled.includes(section.key))
      ?.forEach((section) => {
        section?.permissions?.forEach((permission) => {
          permissions.push({
            parent_id: permission?.id || '',
            children_ids: selected?.includes(permission?.id)
              ? [...new Set(permission.children.map((el) => el.id))]
              : [...new Set(selected.filter((el) => permission.children.find((child) => child.id === el)))] || [],
            is_active: !!selected?.includes(permission?.id),
          })
        })
      })
    console.log(data)

    const requestBody = {
      // id,
      name: get(data, 'name'),
      description: get(data, 'description'),
      // data: {
      permissions,
      // },
    }
    createRole(requestBody)
    // update(requestBody)
  }
  const onError = (err) => {
    console.log(err)
  }

  return (
    <LoadingContainer readyState={true}>
      <Box pb={10}>
        <Header
          isLoading={createRoleLoading}
          buttonText='Создать'
          backIcon
          // noActions
          backHref='/settings/roles'
          text={'Создать роль'}
          checkAccessId={'product-create'}
          onSubmit={methods.handleSubmit(onSubmit, onError)}
        />
        <Container>
          <FormProvider {...methods}>
            <Box flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <RoleBody selected={selected} setSelected={setSelected} disabled={disabled} setDisabled={setDisabled} />
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </LoadingContainer>
  )
}
