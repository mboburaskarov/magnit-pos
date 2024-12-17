import { Box, Button, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useQueryParams } from '../../hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import SelectSimple from '../../../components/Select/SelectSimple'
import * as qs from 'qs'
import AssigneMeButton from './AssigneMeButton'
import { useSelector } from 'react-redux'
import LazySelect from '../../../components/Select/LazySelect'
import { formatPhoneNumber } from '../../../utils/formatPhoneNumber'
import HeadPhonesIcon from '../../assets/icons/HeadPhonesIcon'

export default function FilterMenu({ open, setRegions, setOpen, operatorsList }) {
  const navigate = useNavigate()
  const { values } = useQueryParams()
  const methods = useForm()
  const { formState, reset, setValue, control, getValues } = methods
  const userData = useSelector((state) => state.user)
  const { data: shopList } = useQuery('shopList', () => requests.getAllShops({ limit: 20, offset: 0 }))

  const onSubmit = (data) => {
    const requestBody = {
      shop: data?.shop?._id,
      operator: data?.operator?._id,
      client: data?.client?._id,
      source: data?.source?.value,
    }
    setRegions(data?.regions)
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    setOpen(false)
    navigate(`/orders/all${requestParams}`)
  }

  const onError = (err) => {
    console.log('err', err)
  }

  useEffect(() => {
    reset(
      {
        shop: values?.shop_id,
        operator: values?.operator_id,
        client: values?.client_id,
      },
      { keepDirty: true }
    )
  }, [values?.shop_id, values.operator_id, values.client_id])

  const resetFilter = () => {
    reset()
    navigate(`/orders/all?offset=0&limit=${values?.limit || 5}`)
  }

  return (
    <Box
      sx={{
        width: '100%',
        padding: open ? 4 : 0,
        border: `1px solid`,
        borderColor: 'gray.200',
        borderRadius: 4,
        height: open ? 'auto' : 0,
        opacity: open ? 1 : 0,
        transition: open ? 'padding 0.3s ease-out' : 'padding 0.1s ease-in',
        marginTop: open ? 4 : 0,
      }}
    >
      <FormProvider {...methods}>
        <Box rowGap={3} flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <Box width={'100%'} columnGap={3} display='inline-flex'>
            <Box width={'100%'} position='relative' minWidth={280}>
              <SelectSimple
                id='operator'
                name='operator'
                minWidth='auto'
                fullWidth
                placeholder={
                  <Typography ml={4} color='#bdbdbd'>
                    Выберите оператора
                  </Typography>
                }
                options={operatorsList?.data?.admins}
                getOptionLabel={(option) => (
                  <Typography maxHeight={48} display='inline-flex' color='gray.600'>
                    <Box px={0.5} width={32}>
                      <HeadPhonesIcon size={18} />
                    </Box>
                    {option.fullName}
                  </Typography>
                )}
                filterOption={(candidate, input) => {
                  const formatText = (text) => {
                    const newText = String(text)?.toLowerCase()?.replaceAll(' ', '')
                    return newText
                  }
                  const inputFrmttd = formatText(input)
                  return formatText(candidate?.data?.fullName)?.includes(inputFrmttd) || formatText(candidate?.data?.phone)?.includes(inputFrmttd)
                }}
              />
              <AssigneMeButton isSelected={userData?.id === values?.operator_id} onClick={() => setValue('operator', userData)} />
            </Box>
            <Box width={'100%'} minWidth={240}>
              <SelectSimple fullWidth id='shop' name='shop' minWidth='auto' placeholder={'Выберите магазин'} options={shopList?.data.shops} />
            </Box>
            <Box minWidth={240} width={'100%'}>
              <LazySelect
                slug='users'
                id='client'
                name='client'
                placeholder={'Выберите клиент'}
                minWidth='auto'
                request={requests.getAllClients}
                filters={{ limit: 100 }}
                control={control}
                getOptionLabel={(option) => (
                  <Typography color='gray.600'>
                    {option.fullName} <br />{' '}
                    <Typography fontSize={14} color='gray.400'>
                      {formatPhoneNumber('+' + option.phone)}
                    </Typography>
                  </Typography>
                )}
                filterOption={() => true}
              />
            </Box>
            <Box minWidth={240} width={'100%'}>
              <SelectSimple
                id='source'
                name='source'
                minWidth='auto'
                fullWidth
                placeholder={'Выберите источник'}
                options={[
                  { label: 'WEB', value: 'WEB' },
                  { label: 'MOBILE', value: 'MOBILE' },
                ]}
                getOptionLabel={(option) => (
                  <Typography maxHeight={48} display='inline-flex' color='gray.600'>
                    {option.label}
                  </Typography>
                )}
              />
            </Box>
          </Box>
          <Box minWidth={240} width={'100%'}>
            <LazySelect
              slug='regions'
              id='regions'
              name='regions'
              placeholder={'Выберите регион'}
              minWidth='auto'
              isMulti
              filterOption={(e) => {
                const regions = Array.isArray(getValues('regions')) ? getValues('regions') : []
                const isSelected = regions?.find((item) => item?._id === e?.data?._id)
                if (!isSelected) {
                  return e
                }
              }}
              request={requests.getAllRegions}
              filters={{ limit: 100 }}
              control={control}
              getOptionLabel={(option) => option?.nameRu || option?.nameUz || option?.nameEn || ''}
            />
          </Box>
          <Box columnGap={2} display='flex' width='100%' mt={4}>
            <Button fullWidth color='secondary' variant='contained' disabled={!formState.isDirty} onClick={resetFilter}>
              Сбросить фильтры
            </Button>
            <Button fullWidth variant='contained' type='submit'>
              Применить фильтры
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  )
}
