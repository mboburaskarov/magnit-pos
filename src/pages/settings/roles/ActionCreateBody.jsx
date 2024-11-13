import {
  Box,
  Button,
  IconButton,
  Select,
  Switch,
  Typography,
  MenuItem,
  OutlinedInput,
  Chip,
  useTheme,
  FormControl,
  FormLabel,
  FormHelperText,
  InputLabel,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import TextField from '../../../../components/Inputs/TextField'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import SelectSimple from '../../../../components/Select/SelectSimple'
function getStyles(name, permissionName, theme) {
  return {
    fontWeight: permissionName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  }
}
export default function ActionCreateBody({ setChildrens, childrens, actionData }) {
  const { setValue, watch } = useFormContext()
  const theme = useTheme()
  const type_action = actionData ? actionData?.type : watch('type_action')
  const type_page = watch('type_page')
  const { data: permissionsData } = useQuery('permissionsData', () => requests.getAllPermissions())
  const { data: actions } = useQuery('actions', () => requests.getAllActions())
  useEffect(() => {
    if (actionData) {
      setValue('name', actionData?.name)
      setValue('route', actionData?.route || '')
      setValue('permissions', actionData?.permissions)
    } else {
      setValue('name', '')
      setValue('permissions', [])
      setValue('route', '')
      setValue('type_page', 'PARENT')
      setValue('parent_id', undefined)
    }
  }, [type_action, actionData])
  useEffect(() => {
    if (type_page === 'CHILD') {
      childrens.map((item) => {
        setValue(`child_name_${item?._id}`, '')
        setValue(`child_permissions_${item?._id}`, [])
        setValue(`child_route_${item?._id}`, '')
      })
      setChildrens([])
    }
  }, [type_page])
  return (
    <Box>
      <Box gap={3} display={'flex'} flexDirection={'column'}>
        {!actionData ? (
          <Box pb={3}>
            <InputSwitch
              id='type_action'
              name='type_action'
              defaultValue={'PAGE'}
              uncontrolled
              onChange={(e) => setValue('type_action', e)}
              options={[
                { title: 'Страница', value: 'PAGE' },
                { title: 'Действие', value: 'ACTION' },
              ]}
            />
          </Box>
        ) : null}
        <Box>
          {type_action === 'PAGE' ? (
            <>
              <Box paddingBottom={3}>
                <TextField required fullWidth name='name' label='Название' placeholder='Введите название' sx={{ mb: 2 }} />
                <TextField required fullWidth name='route' label='Id' placeholder='Введите ID' sx={{ mb: 2 }} />
                <Controller
                  name='permissions'
                  rules={{ required: true }}
                  type='text'
                  defaultValue={[]}
                  render={({ field }) => (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id={'permissions'}>Права</InputLabel>
                      <Select fullWidth multiple input={<OutlinedInput label='Права' />} {...field} labelId='permissions' label='Права' defaultValue={[]}>
                        {permissionsData?.data?.map((permission) => (
                          <MenuItem key={permission._id} value={permission.name} style={getStyles(permission.name, field.value, theme)}>
                            {permission.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {!actionData ? (
                  <InputSwitch
                    id='type_page'
                    name='type_page'
                    label='Тип страницы'
                    defaultValue={'PARENT'}
                    onChange={(e) => setValue('type_page', e)}
                    options={[
                      { title: 'Родитель', value: 'PARENT' },
                      { title: 'Ребенок', value: 'CHILD' },
                    ]}
                  />
                ) : null}
              </Box>
              {type_page === 'CHILD' ? (
                <SelectSimple
                  id={'parent_id'}
                  options={actions?.data?.actions?.filter((item) => item.type === 'PAGE')?.flatMap((item) => ({ name: item?.name, value: item?._id }))}
                  required
                  menuPlacement='top'
                  fullWidth
                  name='parent_id'
                  getOptionLabel={(option) => option.name}
                  placeholder='Выберите родителя'
                />
              ) : null}
              {childrens.map((el) => (
                <Box borderLeft={'2px solid'} sx={(theme) => ({ borderColor: theme.palette.type === 'dark' ? 'gray' : '#EAEAEA' })} paddingTop={1}>
                  <Box
                    display={'flex'}
                    ml={4}
                    flexDirection={'column'}
                    alignItems={'center'}
                    sx={(theme) => ({ bgcolor: theme.palette.type === 'dark' ? '#4D4D4D' : '#EAEAEA' })}
                    borderRadius={4}
                    padding={2}
                    width={'95%'}
                  >
                    <Box display={'flex'} width={'100%'} gap={1}>
                      <TextField required fullWidth name={`child_name_${el._id}`} placeholder='Введите название страницы' sx={{ mb: 1 }} />
                      <IconButton
                        onClick={() => {
                          setChildrens((prev) => prev.filter((child) => child._id !== el._id))
                          setValue(`child_name_${el._id}`, '')
                          setValue(`child_route_${el._id}`, '')
                          setValue(`child_permissions_${el._id}`, [])
                        }}
                        sx={{ borderRadius: 3, p: '14px', mt: 0.4 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <TextField required fullWidth name={`child_route_${el._id}`} placeholder='Введите ID страницы' sx={{ mb: 2 }} />
                    <Controller
                      name={`child_permissions_${el._id}`}
                      rules={{ required: true }}
                      type='text'
                      defaultValue={[]}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id={'permissions'}>Права</InputLabel>
                          <Select multiple input={<OutlinedInput label='Права' />} {...field} labelId='permissions' label='Права' defaultValue={[]}>
                            {permissionsData?.data?.map((permission) => (
                              <MenuItem key={permission._id} value={permission.name} style={getStyles(permission.name, field.value, theme)}>
                                {permission.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>
                </Box>
              ))}
              {!actionData && type_page != 'CHILD' ? (
                <Box>
                  <Button
                    sx={{ marginTop: 4.2 }}
                    fullWidth
                    onClick={() => setChildrens((prev) => [...prev, { _id: prev.length + 1 }])}
                    startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                    variant='contained'
                    color='secondary'
                  >
                    Добавить страницу
                  </Button>
                </Box>
              ) : null}
            </>
          ) : (
            <>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <TextField required fullWidth name='name' label='Название' placeholder='Введите название' />
                <TextField required fullWidth name='route' label='Id' placeholder='Введите ID' />
                <Controller
                  name='permissions'
                  rules={{ required: true }}
                  type='text'
                  defaultValue={[]}
                  render={({ field }) => (
                    <FormControl>
                      <InputLabel id={'permissions'}>Права</InputLabel>
                      <Select multiple input={<OutlinedInput label='Права' />} {...field} labelId='permissions' label='Права' defaultValue={[]}>
                        {permissionsData?.data?.map((permission) => (
                          <MenuItem key={permission._id} value={permission.name} style={getStyles(permission.name, field.value, theme)}>
                            {permission.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}
