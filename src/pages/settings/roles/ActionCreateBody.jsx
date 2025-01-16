import { Box } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useQuery } from 'react-query'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import TextField from '../../../../components/Inputs/TextField'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'

export default function ActionCreateBody() {
  const { setValue, watch } = useFormContext()
  const type_action = watch('type_action')
  const type_page = watch('type_page')
  const { data: actions } = useQuery('actions', () => requests.getAllActions())

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
