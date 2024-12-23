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
import { get } from 'lodash'
import InputQuantity from '../../../components/Inputs/InputQuantity'

const filterTwoArrays = (array1, array2) => {
  const arr = array1?.filter((item) => {
    const onlyIds = array2?.map((el) => el._id)

    return !onlyIds?.includes(item._id)
  })
  return arr
}

export default function ProductBody({ productData = null }) {
  const { setValue, watch, register, getValues } = useFormContext()
  const [productCategories, setProductCategories] = useState([{}])
  const [hasDiscontPrice, setHasDiscontPrice] = useState(false)
  const { columns, loading } = useSelector((state) => state.storesListTableColumnsForProduct)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)

  const [parentCategory, setParentCategory] = useState(null)
  const { t } = useTranslation()
  const [images, setImages] = useState([])
  const appType = watch('app_type') || 'BUCHET'
  const applyAllFunc = (id, type) => {
    if (type === 'quantity') {
      const quantity = getValues(`store_product.${id}.quantity`)
      get(storeList, 'data.data.data', []).map((el) => {
        setValue(`store_product.${el.id}.quantity`, quantity)
      })
    } else {
      const quantity = getValues(`store_product.${id}.small_quantity`)
      get(storeList, 'data.data.data', []).map((el) => {
        setValue(`store_product.${el.id}.small_quantity`, quantity)
      })
    }
  }
  const tableColumns = productStoresTableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    register,
    setValues: setValue,
    getValues: getValues,
    applyAllFunc: applyAllFunc,
  })
  const { data: storeList, refetch: refetchShopList } = useQuery('shopList', () =>
    requests.getAllStores({
      limit: values?.limit || 5,
      offset: values?.offset || 0,
    })
  )
  useEffect(() => {
    refetchShopList()
  }, [values.limit, values.offset])
  const { data: unitsList, refetch: refetchUnitList } = useQuery('unitsList', () => requests.getAllUnits({ limit: 20, offset: 0, type: appType }))
  const { data: parentCategories } = useQuery('parentCategories', () => requests.getAllCategories())

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
    get(storeList, 'data.data.data', []).map((el) => {
      // setValue(`store_product.${el.id}.quantity`, 0)
      // setValue(`store_product.${el.id}.small_quantity`, 0)
      setValue(`store_product.${el.id}.store_id`, el.id)
    })
  }, [storeList])
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
    const offsetsCount = Math.ceil(get(storeList, 'data.data._meta.total_count') / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [appType, values.limit])
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
      width='100%'
      sx={{
        margin: 'auto',
        '& .MuiInputBase-root': {
          border: '2px solid',
          borderColor: 'bunker.100',
        },
        '& h5': {
          mb: 0,
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
          name='name'
          label={t('create_new_product.product_name')}
          placeholder={t('create_new_product.product_name.placeholder')}
          sx={{ mb: 3 }}
        />

        <Box mt={'24px'}>
          <Label>{t('create_new_product.products_set_section.image')}</Label>
          <UploadImage
            id='images'
            name='images'
            images={images}
            onChange={(imagesArr) => {
              setImages(imagesArr)
            }}
          />
        </Box>
        <Box height={'56px'} />

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
              name='supply_price'
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
              name='vat'
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
              name='retail_price'
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
              name='vat_price'
              label={t('create_new_product.vat_price')}
              placeholder={t('create_new_product.vat_price.placeholder')}
            />
          </Box>
          <Box mt={'24px'} display={'flex'} width={'100%'}>
            <OutLineTextField
              endAdornmentText={'UZS'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              name='bonus_amount'
              label={'Bonus narxi'}
              placeholder={t('create_new_product.retail_price.placeholder')}
            />
            <Box width={'20px'} />

            <OutLineTextField
              endAdornmentText={'UZS'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              name='bonus_percent'
              label={'Bonus Foizi'}
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
            id='products-main-feftables'
            tableSettings
            columns={tableColumns}
            data={get(storeList, 'data.data.data')}
            pagination
            isDataLoading={false}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            // status={status}
            isRefreshing={false}
          />
        </Box>
        <Box height={'56px'} />

        <SectionTitle noWrap withLine>
          {t('create_new_product.features.label')}
        </SectionTitle>
        <Box height={'24px'} />
        <Box display={'flex'} width={'100%'} mt={'24px'}>
          <TextField
            required
            fullWidth
            borderRadius={'40px'}
            type={'number'}
            name='manufacturer'
            label={t('create_new_product.features.manufacturer')}
            placeholder={t('create_new_product.features.manufacturer.placeholder')}
            sx={{ mb: 3 }}
          />
          <Box width={'20px'} />
          <Box
            sx={{
              '& .MuiFormControl-root': {
                marginTop: '4px !important',
              },
            }}
          >
            <InputQuantity
              label={'Box grain count'}
              id={`box_grain_count`}
              name={`box_grain_count`}
              fullWidth
              required
              type='number'
              defaultValue={0}
              disabled={false}
            />
          </Box>
          <Box width={'20px'} />
          <Box
            sx={{
              '& .select': {
                marginTop: '4px !important',
              },
            }}
          >
            <SelectSimple
              isMulti
              required
              white
              label={'Unit'}
              placeholder='Unitni tanlang'
              name={'product_unit'}
              options={get(unitsList, 'data.data', []).map((el) => ({ value: el.codename, name: el.unit_name, id: el.id }))}
            />
          </Box>
        </Box>
        <Box display={'flex'} width={'100%'} mt={'24px'}>
          <InputDatePicker defaultValue={new Date()} name='expire_date' required id='expire_date' label='Дата закрытия' placeholder='Дата закрытия' />
          <Box width={'20px'} />
          <TextField
            required
            InputProps={{
              endAdornment: (
                <Button id={'buttonId'} variant='text'>
                  {'Yaratish'}
                </Button>
              ),
            }}
            fullWidth
            borderRadius={'40px'}
            name='barcode'
            label={t('create_new_product.main_section.barcode')}
            placeholder={t('create_new_product.main_section.enter_barcode')}
            sx={{ mb: 3 }}
          />
        </Box>
      </Box>
    </Box>
  )
}
