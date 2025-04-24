import { Box, Button } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import InputPassword from '../../../../components/Inputs/InputPasswordNew'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'

export default function ChangeShift({ open, setOpen }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
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
      console.log('err', err)
    },
  })
  const onSubmit = (data) => {
    const requestBody = {
      // cash_box_id: data.cash_box_id?.id || undefined,
      from_employee_id: userData?.id || undefined,
      to_employee_id: data.employee_id?.id || undefined,
      password: data?.password || undefined,
    }
    createShift(requestBody)
  }

  const onError = (err) => {
    console.log('err', err)
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
            // stroke: '#868FAA',
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
            {/* <LazySelect
              slug='cash_box_id'
              boxStyle={{ width: '100%' }}
              id='cash_box_id'
              name='cash_box_id'
              isMulti={false}
              placeholder={'Выбрать кассу'}
              minWidth='auto'
              isClearable={true}
              label={'Касса'}
              request={requests.getOpenCashBoxList}
              filters={{ limit: 10 }}
              control={control}
              // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
              // uncontrolled
              getOptionLabel={(option) => {
                return <Typography color='grey.600'>{option.name}</Typography>
              }}
              filterOption={() => true}
            /> */}
            {/* <SelectSimple
              fullWidth
              id='categ'
              white
              borderNone
              solidBorder
              name='cash_box_id'
              required
              isClearable={false}
              minWidth='auto'
              label={'Касса'}
              placeholder={'Выбрать кассу'}
              getOptionLabel={(el) => el.name}
              options={cashBoxList?.data?.data}
            /> */}
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
