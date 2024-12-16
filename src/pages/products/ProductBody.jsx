import { Box, Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import TextField from '../../../components/Inputs/TextField'
import TickIcon from '../../assets/icons/TickIcon'
import SectionTitle from '../../../components/SectionTitle'
import ImageUpload from '../../../components/ImageUpload'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import SelectSimple from '../../../components/Select/SelectSimple'
import CategoriesTree from '../../../components/CategoriesTree'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import { useFormContext } from 'react-hook-form'
import UploadImage from '../../../components/UploadImage'
import OutLineTextField from '../../../components/Inputs/OutLineTextField'
import InputDatePicker from '../../../components/Inputs/InputDatePicker'
import { useTranslation } from 'react-i18next'
import InputWithButton from '../../../components/Inputs/InputWithButton'
import Label from '../../../components/Label'
import productStoresTableHeaderSelector from './productStoresTableHeaderSelector'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import { useSelector } from 'react-redux'
import { useQueryParams } from '../../hooks/useQueryParams'

const filterTwoArrays = (array1, array2) => {
  const arr = array1?.filter((item) => {
    const onlyIds = array2?.map((el) => el._id)

    return !onlyIds?.includes(item._id)
  })
  return arr
}

export default function ProductBody({ productData = null }) {
  const { setValue, watch } = useFormContext()
  const [productCategories, setProductCategories] = useState([{}])
  const [hasDiscontPrice, setHasDiscontPrice] = useState(false)
  const { columns, loading } = useSelector((state) => state.storesListTableColumnsForProduct)
  const { values } = useQueryParams()

  const [parentCategory, setParentCategory] = useState(null)
  const { t } = useTranslation()
  const [images, setImages] = useState([])
  const appType = watch('app_type') || 'BUCHET'
  const tableColumns = productStoresTableHeaderSelector({
    productsColumns: columns,
    t,
    values,
  })
  const { data: shopList, refetch: refetchShopList } = useQuery('shopList', () => requests.getAllShops({ limit: 1000, offset: 0, type: appType }))
  const { data: parentCategories } = useQuery('parentCategories', () => requests.getAllCategories())
  // const { data: subCategories, refetch: refetchCategories } = useQuery(
  //   ['subCategories', parentCategory, appType],
  //   () => requests.getAllCategories({ type: appType, subId: parentCategory.id }),
  //   { enabled: !!appType && !!productData?.categories?.length > 0 }
  // )
  // const { data: hashtags } = useQuery('hashtags', () => requests.getAllHashtags({ limit: 1000, offset: 0 }))

  useEffect(() => {
    if (productData) {
      setValue('product_name', productData?.name)
      setValue('app_type', productData?.type || 'BUCHET')
      setValue('product_price', productData?.cost)
      setValue('product_price_with_discount', productData?.discountCost)
      setValue('description', productData?.description)
      setValue('shop', productData?.shop)
      setValue(
        'hashtag',
        productData?.hashtag?.map((el) => ({ value: el.nameRu, name: el.nameRu, id: el._id }))
      )
      setValue('preparation_time', {
        name: `${productData?.preparationTime} ${productData?.preparationTime === 0 ? 'express' : 'минут'}`,
        time: productData?.preparationTime,
      })
      setProductCategories(productData?.categories?.map((el, ind) => ({ ...el, name: el.nameRu, quantity: productData?.quantityOfCategories?.[ind] })))
      setHasDiscontPrice(productData?.isDiscount)
    }
  }, [productData])

  useEffect(() => {
    if (!!parentCategories?.data && !!productData) {
      const parentCategory = parentCategories?.data?.find((el) => el._id === productData?.categories?.[0]?.parentId)
      setParentCategory({ ...parentCategory, name: parentCategory.nameRu })
    }
  }, [parentCategories, productData])

  useEffect(() => {
    if (productCategories.length > 0) setValue('categories', productCategories)
  }, [productCategories])
  useEffect(() => {
    refetchShopList()
    // refetchCategories()
  }, [appType])
  useEffect(() => {
    if (!productData) {
      setValue('app_type', 'BUCHET')
    }
  }, [])
  const addCategoryButton = productCategories?.length > 0 ? !!productCategories?.at(-1)?.name : true
  const { refetch } = useQuery('barcode', () => requests.generateBarcode(), { enabled: false })

  const generateBarcode = () => {
    refetch().then(({ data }) => {
      clearErrors('barcode')
      setValue('barcode', data?.data?.barcode)
    })
  }
  return (
    <Box
      pb={10}
      width='690px'
      sx={{
        margin: 'auto',
        '& .MuiInputBase-root': {
          border: '2px solid',
          borderColor: 'bunker.100',
        },
      }}
    >
      <SectionTitle noWrap withLine>
        {t('create_new_product.main_section.label')}
      </SectionTitle>
      <Box mt={'24px'}>
        <TextField
          required
          fullWidth
          borderRadius={'40px'}
          name='product_name'
          label={t('create_new_product.product_name')}
          placeholder={t('create_new_product.product_name.placeholder')}
          sx={{ mb: 3 }}
        />
        {/* <ImageUpload
          id='images'
          name='images'
          images={productData?.files?.map((el, ind) => ({ key: el, name: el, sequence_number: ind }))}
          onChange={(imagesArr) => setValue('images', imagesArr)}
        /> */}
        <uox mt={'24px'}>
          <Label>{t('create_new_product.products_set_section.image')}</Label>
          <UploadImage
            id='images'
            name='images'
            // register={register}
            images={images}
            onChange={(imagesArr) => {
              setImages(imagesArr)
              // setValue('images', imagesArr)
            }}
          />
        </uox>
        <Box height={'56px'} />

        <SectionTitle noWrap withLine>
          {t('create_new_product.additional_information.category')}
        </SectionTitle>
        <CategoriesTree />
        <Box height={'56px'} />
        <SectionTitle noWrap withLine>
          {t('create_new_product.create_packages.price')}
        </SectionTitle>
        <Box alignItems='flex-end' width='100%' columnGap={3} flexDirection={'column'} display='inline-flex' my={3}>
          <Box display={'flex'} width={'100%'}>
            <OutLineTextField
              endAdornmentText={'UZS'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              name='product_price'
              label={t('create_new_product.supply_price')}
              placeholder={t('create_new_product.supply_price.placeholder')}
            />
            <Box width={'20px'} />
            <OutLineTextField
              endAdornmentText={'%'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              name='product_price'
              label={t('create_new_product.vat')}
              placeholder={t('create_new_product.vat.placeholder')}
            />
          </Box>
          <Box mt={'24px'} display={'flex'} width={'100%'}>
            <OutLineTextField
              endAdornmentText={'UZS'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              name='product_price'
              label={t('create_new_product.retail_price')}
              placeholder={t('create_new_product.retail_price.placeholder')}
            />
            <Box width={'20px'} />

            <OutLineTextField
              endAdornmentText={'UZS'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              name='product_price'
              label={t('create_new_product.vat_price')}
              placeholder={t('create_new_product.vat_price.placeholder')}
            />
          </Box>
        </Box>
        <Box height={'56px'} />

        <SectionTitle noWrap withLine>
          {t('create_new_product.amount_section.label')}
        </SectionTitle>
        <Box mt={'24px'}>
          <AgGridTable
            id='products-main-tables'
            tableSettings
            columns={tableColumns}
            data={[
              { name: 'Sergili', amount: 2, min_amount: 4 },
              { name: 'Oqtepa', amount: 1, min_amount: 5 },
            ]}
            isDataLoading={false}
            offsetCount={1}
            // updaterAction={(newData) => {
            //   if (newData) dispatch(updateTableHeader(newData))
            // }}
            // fullInfoAboutCurrentPage
            // resetTable={() => dispatch(resetTableHeader({ refetch }))}
            // status={status}
            isRefreshing={false}
          />
        </Box>
        <Box height={'56px'} />

        <SectionTitle noWrap withLine>
          {t('create_new_product.features.label')}
        </SectionTitle>
        <Box height={'24px'} />

        <TextField
          required
          fullWidth
          borderRadius={'40px'}
          name='product_name'
          label={t('create_new_product.features.manufacturer')}
          placeholder={t('create_new_product.features.manufacturer.placeholder')}
          sx={{ mb: 3 }}
        />
        <Box display={'flex'} width={'100%'} mt={'24px'}>
          <InputDatePicker
            // withTime
            defaultValue={new Date()}
            name='expired_date'
            // minDate={new Date()}
            // minTime={new Date()}
            // minT
            required
            id='expired_date'
            label='Дата закрытия'
            placeholder='Дата закрытия'
          />
          {/* <TextField required type='number' fullWidth borderRadius={'40px'} name='product_price' label='Muddati' placeholder='Muddatini kiriting' /> */}
          <Box width={'20px'} />
          <InputWithButton
            name='barcode'
            label={t('create_new_product.main_section.barcode')}
            // control={control}
            uncontrolled
            placeholder={t('create_new_product.main_section.enter_barcode')}
            text={t('create_new_product.main_section.generate')}
            handleClick={generateBarcode}
            // error={errors?.barcode}
            asteriks
            required
            // disabled={code}
            buttonId='generateBarcode'
            fullWidth
          />
          {/* <TextField required type='number' fullWidth borderRadius={'40px'} name='product_price' label='Shtix-kod' placeholder='Shtix-kodni kiriting' /> */}
        </Box>
        {/* <Box alignItems='flex-end' width='100%' columnGap={3} display='inline-flex' my={3}>
          <TextField required type='number' fullWidth borderRadius={'40px'} name='product_price' label='Цена' placeholder='Введите цену' />
          <Box width={500}>
            <Button
              onClick={() => setHasDiscontPrice(!hasDiscontPrice)}
              startIcon={
                <Box
                  sx={{
                    borderRadius: 2,
                    borderColor: 'green.600',
                    border: '2px solid',
                    height: 24,
                    width: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'common.white',
                  }}
                >
                  {hasDiscontPrice && <TickIcon width={12} />}
                </Box>
              }
              fullWidth
              color={hasDiscontPrice ? 'primary' : 'secondary'}
            >
              Скидочная цена
            </Button>
          </Box>
          <TextField
            onBoxClick={() => !hasDiscontPrice && setHasDiscontPrice(true)}
            type='number'
            disabled={!hasDiscontPrice}
            required={hasDiscontPrice}
            fullWidth
            name='product_price_with_discount'
            label='Цена со скидкой'
            placeholder='Введите цену со скидкой'
          />
        </Box> */}
        {/* <TextField required multiline fullWidth name='description' label='Описание' placeholder='Введите описание' /> */}
      </Box>
      {/* <SectionTitle mt={4} noWrap withLine>
        Характеристики
      </SectionTitle> */}
      {/* <Box mt={1}>
        <Box>
          <InputSwitch
            id='app_type'
            name='app_type'
            label='Выберите тип приложения'
            defaultValue={'BUCHET'}
            options={[
              { title: 'Buchet', value: 'BUCHET' },
              { title: 'Market', value: 'MARKET' },
            ]}
          />
        </Box>
      </Box> */}
      {/* <Grid container columnGap={3} rowGap={3} mt={3}>
        <Grid item xs={5.9}> */}
      {/* <SelectSimple required fullWidth id='shop' name='shop' label='Mагазин' placeholder='Выберите магазин' options={shopList?.data.shops} /> */}
      {/* </Grid>
        {appType === 'BUCHET' && (
          <Grid item xs={5.8}>
            <SelectSimple
              isMulti
              fullWidth
              id='hashtag'
              name='hashtag'
              label='Хэштеги'
              placeholder='Выберите хэштег'
              // options={hashtags?.data?.map((el) => ({ value: el.nameRu, name: el.nameRu, id: el._id }))}
            />
          </Grid>
        )}
        <Grid item xs={appType !== 'BUCHET' ? 5.8 : 5.9}>
          <SelectSimple
            id='preparation_time'
            name='preparation_time'
            label='Время подготовки'
            placeholder='Выберите время подготовки'
            options={[
              { name: '0 express', time: 0 },
              { name: '10 минут', time: 10 },
              { name: '15 минут', time: 15 },
              { name: '40 минут', time: 40 },
              { name: '60 минут', time: 60 },
              { name: '90 минут', time: 90 },
              { name: '3 часа', time: 180 },
              { name: '1 День', time: 1440 },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <SelectSimple
            fullWidth
            id='size_name'
            name='size_name'
            label='Название размера'
            placeholder='Выберите Название размера'
            options={[
              { value: 'S', name: 'S' },
              { value: 'M', name: 'M' },
              { value: 'L', name: 'L' },
            ]}
          />
        </Grid>
        <Grid item xs={5.8}>
          <TextField fullWidth name='height' label='Высота' placeholder='Введите высоту' />
        </Grid>
        <Grid item xs={5.8}>
          <TextField fullWidth name='width' label='Ширина' placeholder='Введите ширину' />
        </Grid>
      </Grid> */}
      {/* <SectionTitle mt={4} noWrap withLine>
        Категории
      </SectionTitle> */}
      {/* <Box>
        <SelectSimple
          fullWidth
          name={'parent-category-name'}
          minWidth='auto'
          placeholder='Выберите родительскую категорию'
          // options={parentCategories?.data?.map((elm2) => ({ ...elm2, name: elm2.nameRu }))}
          uncontrolled
          value={parentCategory}
          onChange={(val) => setParentCategory(val)}
          required
          // disabled={appType === 'BUCHET'}
        />
      </Box> */}
      {/* <Box>
        {productCategories.map((el, ind) => (
          <Box key={ind} mt={2} columnGap={3} width='100%' display='inline-flex'>
            <SelectSimple
              fullWidth
              name={el?.name ? el?.name + '-name' : 'category-name'}
              minWidth='auto'
              disabled={!parentCategory?._id}
              placeholder='Выберите категория'
              // options={filterTwoArrays(subCategories?.data, productCategories)?.map((elm2) => ({ ...elm2, name: elm2.nameRu }))}
              uncontrolled
              value={el?.name && el}
              onChange={(val) =>
                setProductCategories((prev) => {
                  return prev.map((el, index) => {
                    if (index === ind) return { ...val }
                    return el
                  })
                })
              }
              required
            />
            <TextField
              type='number'
              required={!!el?.name}
              value={el?.quantity || ''}
              setValue={(val) =>
                setProductCategories((prev) => {
                  return prev.map((el, index) => {
                    if (index === ind) return { ...el, quantity: val }
                    return el
                  })
                })
              }
              disabled={!el?.name}
              uncontrolled
              fullWidth
              name={el?.quantity ? el.quantity + '-quantity' : 'category-quantity'}
              placeholder='Введите количество'
            />
          </Box>
        ))}
        {addCategoryButton && (
          <Box mt={2} columnGap={4} width='100%' display='inline-flex'>
            <Button color='secondary' onClick={() => setProductCategories((prev) => [...prev, {}])} fullWidth>
              Добавить категории
            </Button>
            <Box width='100%' />
          </Box>
        )}
      </Box> */}
    </Box>
  )
}
