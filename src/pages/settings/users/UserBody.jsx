import { Box } from '@mui/material'
import TextField from '../../../../components/Inputs/TextField'
import PhoneNumber from '../../../../components/Inputs/PhoneNumber'
import { useEffect, useState } from 'react'
import { countries } from '../../../assets/data/countries'
import SelectSimple from '../../../../components/Select/SelectSimple'
import InputPassword from '../../../../components/Inputs/InputPassword'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useFormContext } from 'react-hook-form'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'

export default function UserBody({ userData }) {
  const { setValue } = useFormContext()
  const [country, setCountry] = useState(countries[0])
  const { data: rolesList } = useQuery('rolesList', () => requests.getAllRoles({ offset: 0, limit: 1000 }))
  useEffect(() => {
    if (userData) {
      setValue('full_name', userData?.fullName)
      setValue('phone_number', formatPhoneNumber('+' + userData?.phone)?.replace('+998 ', ''))
      setValue(
        'type',
        rolesList?.data?.orders?.find((el) => el?.name === userData?.type)
      )
    }
  }, [userData])
  return (
    <>
      <Box display='flex' columnGap={3} width='100%'>
        <TextField required fullWidth name='full_name' label='Ф И О' placeholder='Например: Shavkat Miromonovich Mirziyoyev' />
      </Box>
      <Box mt={2} display={!userData ? 'flex' : 'block'} columnGap={3} width='100%'>
        <Box width='100%'>
          <PhoneNumber
            name='phone_number'
            placeholder='Введите номер телефона'
            label='Номер телефона'
            secondary
            fullWidth
            required
            country={country}
            setCountry={setCountry}
          />
        </Box>
        <Box mt={userData ? 2 : 0} width={'100%'}>
          <InputPassword
            required={false}
            id='password'
            name='password'
            label={'Пароль'}
            placeholder='Введите пароль'
            autoCompleteOff
            fullWidth
            minLength={8}
            secondary
          />
        </Box>
      </Box>
      <Box mt={2} display='flex' columnGap={3} width='100%'>
        <SelectSimple required fullWidth name='type' label='Роль пользователя' placeholder='Выберите роль пользователя' options={rolesList?.data?.orders} />
      </Box>
    </>
  )
}
