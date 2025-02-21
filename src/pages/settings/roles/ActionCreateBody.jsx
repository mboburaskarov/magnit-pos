import { Box } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useQuery } from 'react-query'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import TextField from '../../../../components/Inputs/TextField'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import { useEffect } from 'react'
import { get } from 'lodash'
const METHOD_OPETIONS = [
  { name: 'Чтение', value: 'GET' },
  { name: 'Запись', value: 'POST' },
  { name: 'Частичное обновление', value: 'PATCH' },
  { name: 'Полное обновление', value: 'PUT' },
  { name: 'Удаление', value: 'DELETE' },
]
export default function ActionCreateBody({ isOpen }) {
  const { setValue, watch } = useFormContext()
  const type_action = watch('type_action')
  const type_page = watch('type_page')
  const { data: actions } = useQuery('actions', () => requests.getAllActions())
  const {
    data: onePermission,
    refetch: onePermissionRefetch,
    isLoading: onePermissionLoading,
    isFetching: onePermissionFetching,
  } = useQuery(['onePermission', isOpen], () => requests.getPermissionById(get(isOpen, 'id')), { enabled: Boolean(get(isOpen, 'id')) })
  useEffect(() => {
    setTimeout(() => {
      setValue('type_action', get(onePermission, 'data.data.type'))
      setValue('type_page', get(onePermission, 'data.data.parent_id')?.length > 1 ? 'CHILD' : 'PARENT')
      setValue(
        'parent_id',
        actions?.data?.data?.filter((e) => e.id == get(onePermission, 'data.data.parent_id')).flatMap((item) => ({ name: item?.name, value: item?.id }))[0]
      )
      setValue('name', get(onePermission, 'data.data.name'))
      setValue('route', get(onePermission, 'data.data.route'))
      setValue('description', get(onePermission, 'data.data.description'))
      setValue(
        'method',
        METHOD_OPETIONS.filter((e) => get(onePermission, 'data.data.method').includes(e.value))
      )
    }, 200)
  }, [onePermission?.data])
  return (
    <Box>
      <Box gap={3} display={'flex'} flexDirection={'column'}>
        <Box>
          <InputSwitch
            id='type_action'
            name='type_action'
            defaultValue={'PAGE'}
            onChange={(e) => setValue('type_action', e)}
            options={[
              { title: 'Модуль', value: 'MODULE' },
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
              </Box>
              <Box height={'20px'} />
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
          ) : type_action === 'MODULE' ? (
            <>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <TextField required fullWidth name='name' label='Название' placeholder='Введите название' />
                <TextField required fullWidth name='key' label='Ключ' placeholder='Введите ключ' />
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
            options={METHOD_OPETIONS}
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
              options={actions?.data?.data?.flatMap((item) => ({ name: item?.name, value: item?.id }))}
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
