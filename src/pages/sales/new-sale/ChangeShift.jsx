import StyledEmptyDialog from '@components/Dialogs/StyledeEmptyDialog';
import InputPassword from '@components/Inputs/InputPasswordNew';
import SelectSimple from '@components/Select/SelectSimple';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { error, success } from '@utils/toast';
import { Box, Button } from '@mui/material';
import { requests } from '@utils/requests';
import { useSelector } from 'react-redux';
import CloseIcon from '@icons/CloseIcon';
import { useTheme } from '@mui/styles';
import { useEffect } from 'react';
import { get } from 'lodash';


export default function ChangeShift({ open, setOpen }) {
  const userData = useSelector((state) => state.user)
  const methods = useForm()
  const theme = useTheme()
  const { reset } = methods

  const { data: employees } = useQuery('employees', () => requests.getAllVendors({ store_id: get(userData, 'store.id'), limit: 20, offset: 0 }), {
    enabled: open,
  })

  useEffect(() => {
    reset({ password: '' })
  }, [open])

  const { mutate: createShift, isLoading: iscreateShift } = useMutation(requests.createShift, {
    onSuccess: ({ data }) => {
      localStorage.setItem('access_token', get(data, 'data.access_token'))
      location.reload()
      setOpen(false)

      success('Cмена изменена')
    },
    onError: (err) => {
      error('Ошибка при смене смены')
      console.error('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      from_employee_id: userData?.id || undefined,
      to_employee_id: data.employee_id?.id || undefined,
      password: data?.password || undefined,
    }
    createShift(requestBody)
  }

  const onError = (err) => {
    console.error('err', err)
  }

  return (
    <StyledEmptyDialog
      onClose={() => setOpen(false)}
      open={open}
      title={'Передать смену'}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box
        sx={{
          width: '100%',
          padding: '24px',
          '& .MuiInputBase-root': {
            border: `2px solid`,
            borderColor: 'bunker.100',
            height: '48px',
          },
          '& svg': {
            fill: '#868FAA',
          },
          '& .MuiInputBase-root.MuiOutlinedInput-root': {
            borderRadius: '40px !important',
          },
        }}
      >
        <FormProvider {...methods}>
          <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <SelectSimple
              fullWidth
              id='sto'
              borderNone
              solidBorder
              name='employee_id'
              required
              white
              isClearable={false}
              minWidth='auto'
              label={'Сотрудник'}
              placeholder={'Выберите сотрудника'}
              getOptionLabel={(el) => el.first_name + ' ' + el.last_name}
              options={employees?.data?.data?.data}
            />

            <InputPassword
              boxStyle={{ borderRadius: '40px' }}
              id='password'
              name='password'
              label={'Password'}
              autoCompleteoff='new-password'
              required
              defaultState={true}
              fullWidth
              minLength={8}
              secondary
            />
            <Box columnGap={2} display='flex' width='100%' mt={'24ppx'}>
              <Button fullWidth variant='contained' type='submit'>
                Изменить
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    </StyledEmptyDialog>
  )
}
