import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import { get } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'

import InputPhone from '../../../../components/Inputs/PhoneNumber'
import TextField from '../../../../components/Inputs/TextField'
import Label from '../../../../components/Label'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import i18n from '../../../i18n'

// Constants for options
const COUNTRY_OPTIONS = [{ name: 'Uzbekistan', value: 'Uzbekistan' }]
const CITY_OPTIONS = [{ name: 'Tashkent', value: 'Tashkent' }]

// Helper function to get initial value for SelectSimple based on the current value
const getSelectDefaultValue = (options, value) => {
  return options.find((option) => option.value === value) || options[0]
}

const CompanyPage = () => {
  const methods = useForm()
  const { data: companyInfo } = useQuery('companyInfo', () => requests.getComanyInfo())

  const { mutate: changeComanyInfo } = useMutation(requests.changeComanyInfo, {
    onSuccess: ({ data }) => {
      success('Информация о пользователе изменена!')
    },
    onError: () => {
      error('Ошибка при изменении пользовательских данных!')
    },
  })
  useEffect(() => {
    methods.setValue('name', get(companyInfo, 'data.data.name'))
    // methods.setValue('country', get(companyInfo, 'data.data.country'))
    methods.setValue('email', get(companyInfo, 'data.data.email'))
    methods.setValue('phone', get(companyInfo, 'data.data.phone')?.replace('998', ''))
    methods.setValue('legal_name', get(companyInfo, 'data.data.legal_name'))
    methods.setValue('legal_address', get(companyInfo, 'data.data.legal_address'))
    methods.setValue('postal_code', get(companyInfo, 'data.data.postal_code'))
    // methods.setValue('city', get(companyInfo, 'data.data.city'))
    methods.setValue('company_mfo', get(companyInfo, 'data.data.company_mfo'))
    methods.setValue('company_inn', get(companyInfo, 'data.data.company_inn'))
  }, [companyInfo])
  const handleFormSubmit = (data) => {
    const requestBody = {
      name: get(data, 'name'),
      country: get(data, 'country.value'),
      email: get(data, 'email'),
      phone: '998' + data?.phone?.replace(/[()\s]/g, ''),
      legal_name: get(data, 'legal_name'),
      legal_address: get(data, 'legal_address'),
      postal_code: get(data, 'postal_code'),
      city: get(data, 'city.value'),
      company_mfo: get(data, 'company_mfo'),
      company_inn: get(data, 'company_inn'),
    }

    changeComanyInfo({ id: get(companyInfo, 'data.data.id'), data: requestBody })
  }

  const handleFormError = () => {
    error('Пожалуйста, заполните все поля!')
  }

  const countryDefaultValue = useMemo(() => getSelectDefaultValue(COUNTRY_OPTIONS, i18n.language), [i18n.language])
  const cityDefaultValue = useMemo(() => getSelectDefaultValue(CITY_OPTIONS, i18n.language), [i18n.language])

  return (
    <FormProvider {...methods}>
      <Box display='flex' alignItems='center' justifyContent='center'>
        <Box width='calc(100% - 360px)'>
          <Box height={'24px'} />

          <Typography variant='h4' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} mb={'10px'}>
            Компания
          </Typography>

          <Box display='flex' gap={3} mt={3} mb={7}>
            <Box flex={1}>
              <Label>Название</Label>
              <TextField required fullWidth name='name' placeholder='Название' />
            </Box>
          </Box>

          <Box display='flex' gap={3} mt={3} mb={7}>
            <Box flex={1}>
              <Label>Электронная почта</Label>
              <TextField required fullWidth name='email' placeholder='Электронная почта' />
            </Box>
            <Box flex={1}>
              <Label>Номер телефона</Label>
              <InputPhone
                login={false}
                id='phone'
                disabled
                name='phone'
                fullWidth
                boxStyle={{ marginBottom: '0', marginTop: 'auto' }}
                required
                setCountry={({ dial_code }) => setValue('dial_code', dial_code)}
              />
            </Box>
          </Box>
          <Typography variant='h5' fontWeight={700} mt={7} mb={3}>
            Город
          </Typography>

          <Box display='flex' gap={3} mt={3} mb={7}>
            <Box flex={1}>
              <Label>Город</Label>
              <SelectSimple disabled={false} white isClearable={false} defaultValue={countryDefaultValue} options={COUNTRY_OPTIONS} name='country' />
            </Box>
          </Box>
          <Typography variant='h5' fontWeight={700} mt={7} mb={3}>
            Реквизиты
          </Typography>
          <Box display='flex' gap={3} mt={3} mb={7}>
            <Box flex={1}>
              <Label>Юридическое название компании</Label>
              <TextField required fullWidth name='legal_name' placeholder='Юридическое название компании' />
            </Box>
          </Box>
          <Box display='flex' gap={3} mt={3} mb={7}>
            <Box flex={1}>
              <Label>Страна</Label>
              <SelectSimple disabled={false} white isClearable={false} defaultValue={cityDefaultValue} options={CITY_OPTIONS} name='city' />
            </Box>

            <Box flex={1}>
              <Label>Почтовый индекс</Label>
              <TextField required fullWidth name='postal_code' placeholder='Почтовый индекс' />
            </Box>
          </Box>
          <Box display='flex' gap={3} mt={3} mb={7}>
            <Box flex={1}>
              <Label>Юридический адрес</Label>
              <TextField required fullWidth name='legal_address' placeholder='Юридический адрес' />
            </Box>
          </Box>

          <Box display='flex' gap={3} mt={3} mb={7}>
            <Box flex={1}>
              <Label>ИНН</Label>
              <TextField required fullWidth name='company_inn' placeholder='ИНН' />
            </Box>

            <Box flex={1}>
              <Label>МФО</Label>
              <TextField required fullWidth name='company_mfo' placeholder='МФО' />
            </Box>
          </Box>

          {
            <LoadingButton sx={{ ml: 'auto', width: '200px' }} variant='contained' fullWidth onClick={methods.handleSubmit(handleFormSubmit, handleFormError)}>
              Сохранить
            </LoadingButton>
          }
        </Box>
      </Box>
    </FormProvider>
  )
}

export default CompanyPage
