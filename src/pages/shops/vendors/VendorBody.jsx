import { Box } from '@mui/material'
import TextField from '../../../../components/Inputs/TextField'
import PhoneNumber from '../../../../components/Inputs/PhoneNumber'
import { useEffect, useState } from 'react'
import { countries } from '../../../assets/data/countries'
import SelectSimple from '../../../../components/Select/SelectSimple'
import InputPassword from '../../../../components/Inputs/InputPassword'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { vendor_types } from '../../../assets/data/vendor-statuses'
import { useFormContext } from 'react-hook-form'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'

export default function VendorBody({ vendorData }) {
  const { setValue } = useFormContext()
  const [country, setCountry] = useState(countries[0])

  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 1000, offset: 0 }))

  useEffect(() => {
    if (vendorData) {
      setValue('full_name', vendorData?.fullName)
      setValue('phone_number', formatPhoneNumber('+' + vendorData?.phone)?.replace('+998 ', ''))
      setValue(
        'type',
        vendor_types?.find((el) => el?.id === vendorData?.type)
      )
    }
  }, [vendorData])
  useEffect(() => {
    if (vendorData && shopList?.data) {
      setValue(
        'shop',
        shopList?.data?.shops?.find((el) => el?._id === vendorData?.dbId)
      )
    }
  }, [shopList, vendorData])
  return (
    <>
      <Box display='flex' columnGap={3} width='100%'>
        <TextField required fullWidth name='full_name' label='Ф И О' placeholder='Например: Shavkat Miromonovich Mirziyoyev' />
      </Box>
      <Box mt={2} display='flex' columnGap={3} width='100%'>
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
        <InputPassword id='password' name='password' label='Пароль' placeholder='Введите пароль' autoCompleteOff required fullWidth minLength={8} secondary />
      </Box>
      <Box mt={2} display='flex' columnGap={3} width='100%'>
        <SelectSimple required fullWidth name='shop' label='Mагазин' placeholder='Выберите магазин' options={shopList?.data.shops} />
        <SelectSimple required fullWidth name='type' label='Тип вендора' placeholder='Выберите тип вендора' options={vendor_types} />
      </Box>
    </>
  )
}
