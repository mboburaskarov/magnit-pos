import { Box, Container } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import Header from '../../../../components/Header'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { requests } from '../../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { error, success } from '../../../../utils/toast'
import ShopBody from '../ShopBody'
import { useEffect, useState } from 'react'

const WeekData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function ShopEditPage() {
  const { id } = useParams()
  const methods = useForm()
  const navigate = useNavigate()
  const [shopPhoneNumbers, setShopPhoneNumbers] = useState([{}])
  const { data: shopData, isLoading: shopDataLoading } = useQuery(['shopData', id], () => requests.getSingleShop(id), { enabled: !!id })
  const { mutate: updateShop, isLoading: isUpdatingShop } = useMutation(requests.updateShop, {
    onSuccess: () => {
      navigate('/shops')
      success('Магазин успешно обновлен!')
    },
    onError: (err) => {
      error('Ошибка при обновлении магазина!')
      console.log('err', err)
    },
  })

  useEffect(() => {
    if (shopData) {
      setShopPhoneNumbers(shopData?.data?.phones)
    }
  }, [shopData])
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

    updateShop({ id: id, data: requestBody })
  }
  const onError = (err) => {
    console.log('err', err)
    error('Пожалуйста, заполните все поля!')
  }
  return (
    <LoadingContainer readyState={!shopDataLoading}>
      <Box pb={10}>
        <Header
          isLoading={isUpdatingShop}
          buttonText='Редактировать'
          backIcon
          backHref='/shops'
          text='Редактировать магазин'
          onSubmit={methods.handleSubmit(onSubmit, onError)}
          checkAccessId={'shop-edit'}
        />
        <Container>
          <FormProvider {...methods}>
            <Box flexWrap='wrap' display='flex' component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
              <ShopBody setShopPhoneNumbers={setShopPhoneNumbers} shopPhoneNumbers={shopPhoneNumbers} shopData={shopData?.data} />
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </LoadingContainer>
  )
}
