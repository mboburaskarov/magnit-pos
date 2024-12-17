import { Box } from '@mui/material'
import ImageUpload from '../../../../components/ImageUpload'
import TextField from '../../../../components/Inputs/TextField'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'

export default function BannerCreateBody({}) {
  const { setValue, watch } = useFormContext()
  const { data: shopList, refetch: refetchShopListData } = useQuery(
    ['getAllShops'],
    () => requests.getAllShops({ type: watch('appType')?.id, limit: 20, offset: 0 }),
    { enabled: !!watch('appType')?.id }
  )

  const { data: regionList } = useQuery(['regionList'], () => requests.getAllRegions())

  useEffect(() => {
    refetchShopListData()
  }, [watch('appType')?.id])

  return (
    <Box>
      <Box paddingTop={1} gap={2} display={'flex'} flexDirection={'column'}>
        <ImageUpload
          width={624}
          withoutTextBox
          height={208}
          onChange={(images) => setValue('image_uz', images)}
          name={'image_uz'}
          label={'Фото(UZ)'}
          type={'BANNER'}
        />
        <ImageUpload
          withoutTextBox
          type={'BANNER'}
          width={624}
          height={208}
          onChange={(images) => setValue('image_ru', images)}
          name={'image_ru'}
          label={'Фото(RU)'}
        />
      </Box>
      <Box paddingTop={2}>
        <Box display={'flex'} gap={2}>
          <SelectSimple
            fullWidth
            required
            name={'appType'}
            label={'Тип приложения'}
            placeholder='Выберите тип приложения'
            options={[
              {
                id: 'BUCHET',
                name: 'BUCHET',
              },
              {
                id: 'MARKET',
                name: 'MARKET',
              },
            ]}
          />
          <SelectSimple
            required
            fullWidth
            name={'banner_type'}
            label={'Тип баннера'}
            placeholder='Выберите тип баннера'
            options={[
              {
                id: 'Product',
                name: 'Product',
              },
              {
                id: 'Shop',
                name: 'Shop',
              },
            ]}
          />
        </Box>
        <Box pt={2} pb={2}>
          <SelectSimple
            menuPlacement='top'
            placeholder='Выберите регион'
            label={'Выберите регион'}
            required
            name={'region'}
            id={'region'}
            options={regionList?.data?.regions?.map((region) => ({ id: region?._id, name: region?.nameRu }))}
          />
          {watch('appType')?.id && (
            <Box pt={2}>
              {watch('banner_type')?.id === 'Shop' && (
                <SelectSimple
                  menuPlacement='top'
                  placeholder='Выберите магазин'
                  label={'Выберите магазин'}
                  required
                  name={'shop_value'}
                  options={shopList?.data?.shops?.map((shop) => ({ id: shop?._id, name: shop?.name }))}
                />
              )}
              {watch('banner_type')?.id === 'Product' && (
                <TextField label={'Введите id продукта'} name={'product_value'} placeholder={'Введите id продукта'} required fullWidth />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
