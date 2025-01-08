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
export default function ActionCreateBody() {
  const { setValue, watch } = useFormContext()
  const type_action = watch('type_action')
  const type_page = watch('type_page')
  const { data: actions } = useQuery('actions', () => requests.getAllActions())

  // useEffect(() => {
  //   if (actionData) {
  //     setValue('name', actionData?.name)
  //     setValue('route', actionData?.route || '')
  //     setValue('permissions', actionData?.permissions)
  //   } else {
  //     setValue('name', '')
  //     setValue('permissions', [])
  //     setValue('route', '')
  //     setValue('type_page', 'PARENT')
  //     setValue('parent_id', undefined)
  //   }
  // }, [type_action, actionData])

  return (
    <Box>
      <Box gap={3} display={'flex'} flexDirection={'column'}>
        <Box>
          <InputSwitch
            id='type_action'
            name='type_action'
            defaultValue={'PAGE'}
            uncontrolled
            onChange={(e) => setValue('type_action', e)}
            options={[
              { title: 'Страница', value: 'PAGE' },
              { title: 'Действие', value: 'ACTION' },
              { title: 'Таблица', value: 'TABLE' },
            ]}
          />
        </Box>
        <Box>
          {type_action === 'PAGE' ? (
            <>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <TextField required fullWidth name='name' label='Название' placeholder='Введите название' />
                <TextField required fullWidth name='route' label='URL страницы' placeholder='Введите ID' />
                <TextField required multiline fullWidth name='description' label='Описание' borderRadius={'20px'} placeholder='Введите Описание' />
                {/* <Controller
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
                /> */}
              </Box>
              <Box height={'20px'} />

              {/* {childrens.map((el) => (
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
                    <Box height={'20px'} />

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
              ))} */}
              {/* {!actionData && type_page != 'CHILD' ? (
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
              ) : null} */}
            </>
          ) : type_action === 'ACTION' ? (
            <>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <TextField required fullWidth name='name' label='Название' placeholder='Введите название' />
                <TextField required fullWidth name='route' label='Id' placeholder='Введите ID' />
                <TextField
                  required
                  multiline
                  fullWidth
                  name='description'
                  label='Описание'
                  borderRadius={'20px'}
                  placeholder='Введите Описание'
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box height={'20px'} />
            </>
          ) : (
            <>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <TextField required fullWidth name='name' label='Название' placeholder='Введите название' />

                <TextField required fullWidth name='route' label='Имя строки таблицы' placeholder='Введите ID' />
                <TextField
                  required
                  multiline
                  fullWidth
                  name='description'
                  label='Описание'
                  borderRadius={'20px'}
                  placeholder='Введите Описание'
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box height={'20px'} />
            </>
          )}
          <SelectSimple
            id={'parent_id'}
            isMulti
            options={[
              { name: 'GET', value: 'GET' },
              { name: 'POST', value: 'POST' },
              { name: 'PATCH', value: 'PATCH' },
              { name: 'PUT', value: 'PUT' },
              { name: 'DELETE', value: 'DELETE' },
            ]}
            required
            menuPlacement='top'
            fullWidth
            name='method'
            getOptionLabel={(option) => option.name}
            placeholder='Выберите метод'
          />
          <Box height={'20px'} />

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
          <Box height={'20px'} />
          {type_page === 'CHILD' ? (
            <SelectSimple
              id={'parent_id'}
              options={actions?.data?.data?.flatMap((item) => ({ name: item?.entity_name, value: item?.id }))}
              required
              menuPlacement='top'
              fullWidth
              name='parent_id'
              getOptionLabel={(option) => option.name}
              placeholder='Выберите родителя'
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}
