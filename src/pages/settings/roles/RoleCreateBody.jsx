import { Box, Switch, Typography, useTheme } from '@mui/material'
import TextField from '@components/Inputs/TextField'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { requests } from '@utils/requests'

export default function RoleCreateBody({ setPermission, permissionList, roleData, roleActions }) {
  const { setValue } = useFormContext()
  const { data: actionList } = useQuery('actionList', () => requests.getAllActions())
  useEffect(() => {
    if (roleData) {
      setValue('name', roleData?.name)
      setValue('description', roleData?.description || roleData?.name)
      setPermission(
        actionList?.data?.actions?.map((action) => ({
          ...action,
          isAvailable: !!roleActions?.actions?.find((item) => item?._id == action?._id),
          children: action.children.map((child) => ({
            ...child,
            isAvailable: !!roleActions?.actions?.find((item) => item?._id == child?._id),
          })),
        }))
      )
    }
    if (!permissionList?.length && !roleData) {
      setPermission(
        actionList?.data?.actions?.map((action) => ({
          ...action,
          isAvailable: false,
          children: action.children.map((child) => ({
            ...child,
            isAvailable: false,
          })),
        }))
      )
    }
  }, [actionList, roleData, roleActions])
  const handleChange = (id, isChild) => {
    if (!permissionList?.length) return
    if (!isChild) {
      setPermission((permissions) =>
        permissions?.map((permission) => {
          if (permission._id === id) {
            if (!permission.isAvailable == false) {
              return {
                ...permission,
                isAvailable: false,
                children: permission?.children?.map((child) => ({
                  ...child,
                  isAvailable: false,
                })),
              }
            }
            return {
              ...permission,
              isAvailable: !permission.isAvailable,
              children: permission?.children?.map((child) => ({
                ...child,
              })),
            }
          }
          return permission
        })
      )
      return
    }
    setPermission((permissions) =>
      permissions?.map((permission) => {
        if (permission._id === id) {
          return {
            ...permission,
            children: permission?.children?.map((child) => {
              if (child?._id === isChild) {
                return {
                  ...child,
                  isAvailable: !child.isAvailable,
                }
              }
              return {
                ...child,
              }
            }),
          }
        }
        return permission
      })
    )
  }

  return (
    <Box>
      <Box gap={3} display={'flex'} flexDirection={'column'}>
        <Box pb={3} borderBottom={'2px solid'} sx={(theme) => ({ borderColor: theme.palette.type === 'dark' ? 'gray' : '#EAEAEA' })}>
          <TextField required fullWidth name='name' label='Название' placeholder='Введите название' sx={{ mb: 2 }} />
          <TextField required multiline fullWidth name='description' label='Описание' placeholder='Введите описание' />
        </Box>
        <Box>
          {actionList?.data?.actions?.map((data) => (
            <Box>
              {data?.children?.length > 0 ? (
                <Box mb={2}>
                  <Box
                    mb={1}
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    sx={(theme) => ({ bgcolor: theme.palette.type === 'dark' ? '#4D4D4D' : '#EAEAEA' })}
                    borderRadius={4}
                    padding={2}
                  >
                    <Typography sx={{ whiteSpace: 'pre-line' }} fontSize={'17px'}>
                      {data?.name[0].toUpperCase()}
                      {data?.name?.slice(1).toLowerCase()}
                    </Typography>
                    <Switch checked={permissionList?.find((item) => item?._id === data?._id)?.isAvailable} onChange={() => handleChange(data?._id)} />
                  </Box>
                  {permissionList?.find((permission) => permission?._id === data?._id)?.isAvailable && (
                    <Box
                      sx={(theme) => ({ borderColor: theme.palette.type === 'dark' ? 'gray' : '#EAEAEA' })}
                      borderLeft={'2px solid'}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                      flexDirection={'column'}
                      gap={1}
                    >
                      {data?.children?.map((child) => (
                        <Box
                          display={'flex'}
                          ml={4}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          sx={(theme) => ({ bgcolor: theme.palette.type === 'dark' ? '#4D4D4D' : '#EAEAEA' })}
                          borderRadius={4}
                          padding={2}
                          width={'95%'}
                        >
                          <Typography sx={{ whiteSpace: 'pre-line' }} fontSize={'13px'}>
                            {child?.name[0].toUpperCase()}
                            {child?.name?.slice(1).toLowerCase()}
                          </Typography>
                          <Switch
                            checked={
                              permissionList?.find((item) => item?._id === data?._id)?.children?.find((permissionChild) => permissionChild?._id === child?._id)
                                ?.isAvailable
                            }
                            size='small'
                            onChange={() => handleChange(data?._id, child?._id)}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  mb={2}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={(theme) => ({ bgcolor: theme.palette.type === 'dark' ? '#4D4D4D' : '#EAEAEA' })}
                  borderRadius={4}
                  padding={2}
                >
                  <Typography sx={{ whiteSpace: 'pre-line' }} fontSize={'17px'}>
                    {data?.name[0].toUpperCase()}
                    {data?.name?.slice(1).toLowerCase()}
                  </Typography>
                  <Switch checked={permissionList?.find((item) => item?._id === data?._id)?.isAvailable} onChange={() => handleChange(data?._id)} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
