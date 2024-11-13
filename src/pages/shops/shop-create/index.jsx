import { Box, Container } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import Header from '../../../../components/Header'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { requests } from '../../../../utils/requests'
import { useMutation } from 'react-query'
import { error, success } from '../../../../utils/toast'
import ShopBody from '../ShopBody'

const WeekData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function ShopCreatePage() {
  const methods = useForm()
  const navigate = useNavigate()
  const [shopPhoneNumbers, setShopPhoneNumbers] = useState([{}])

  useEffect(() => {
    methods.register('categories')
    return
  }, [])

  const { mutate: createShop, isLoading: isCreatingShop } = useMutation(requests.createShop, {
    onSuccess: () => {
      navigate('/shops')
      success('Магазин успешно создан!')
    },
    onError: (err) => {
      error('Ошибка при создании магазина!')
      console.log('err', err)
    },
  })

  const onSubmit = (data) => {
    const requestBody = {
      type: data?.app_type,
      name: data?.shop_name,
      address: '',
      region: data?.region?._id,
      mainPicture: data?.main_image?.[0]?.key,
      internalPicture: data?.internal_image?.map((el) => el?.key) || [],
      description: data?.description,
      schedule:
        data?.working_hours === '24_7'
          ? ['00:00-23:59', '00:00-23:59', '00:00-23:59', '00:00-23:59', '00:00-23:59', '00:00-23:59', '00:00-23:59']
          : WeekData.map((weekday) => `${data?.[weekday + '_time_start']}-${data?.[weekday + '_time_end']}`),
      margin: Number(data?.percent),
      phones: shopPhoneNumbers.map((el, ind) => '+998' + methods.watch(`phone_number_${ind}`)?.replace(/[X() ]/g, '')),
      socialNetwork: {
        website: data?.website || undefined,
        telegram: data?.telegram || undefined,
        instagram: data?.instagram || undefined,
        facebook: data?.facebook || undefined,
      },
      location: {
        name: data?.address?.name,
        long: data?.address?.points[1],
        lat: data?.address?.points[0],
      },
      isFastDelivery: Boolean(data?.fast_delivery),
      status: 'ACTIVE',
      contract: {
        activityType: data?.activity_type,
        [data?.activity_type === 'LEGAL_ENTITY' ? 'tin' : 'pin']: data?.pinfl_or_tin,
        contractFile: data?.contract_file?.key,
        contractNumber: data?.contract_number,
        contractDate: data?.contract_date || null,
        [data?.activity_type === 'NATURAL_PERSON' ? 'cardNumber' : 'billNumber']: data?.card_or_bill_number?.replaceAll(' ', ''),
        mfo: data?.mfo,
        companyCertificate: data?.certificate?.key,
        directorPassport: data?.passport?.key,
      },
      categories: data?.categories?.map((item) => item.id),
    }

    createShop(requestBody)
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  return (
    <LoadingContainer readyState={true}>
      <Box pb={10}>
        <Header
          isLoading={isCreatingShop}
          buttonText='Создать'
          backIcon
          backHref='/shops'
          text='Новый магазин'
          checkAccessId={'shop-create'}
          onSubmit={methods.handleSubmit(onSubmit, onError)}
        />
        <Container>
          <FormProvider {...methods}>
            <Box flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <ShopBody shopPhoneNumbers={shopPhoneNumbers} setShopPhoneNumbers={setShopPhoneNumbers} />
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </LoadingContainer>
  )
}
