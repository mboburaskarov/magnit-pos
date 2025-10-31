import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import InputPassword from '../../../../components/Inputs/InputPasswordNew'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'

export default function ChangeShift({ open, setOpen }) {
  const userData = useSelector((state) => state.user)

  const methods = useForm()
  const { formState, reset, control } = methods
  const { data: cashBoxList } = useQuery(
    'cashBoxList',
    () => requests.getOpenCashBoxList({ store_id: get(userData, 'store.id'), id: get(userData, 'store.id'), limit: 20, offset: 0 }),
    {
      enabled: open,
    }
  )
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

  const theme = useTheme()

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
              autoCompleteoff='new-password' // Prevent autofill
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
