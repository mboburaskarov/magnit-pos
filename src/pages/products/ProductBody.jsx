import { Box, Button } from '@mui/material'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import CategoriesTree from '../../../components/CategoriesTree'
import InputDatePicker from '../../../components/Inputs/InputDatePicker'
import InputQuantity from '../../../components/Inputs/InputQuantity'
import OutLineTextField from '../../../components/Inputs/OutLineTextField'
import TextField from '../../../components/Inputs/TextField'
import Label from '../../../components/Label'
import SectionTitle from '../../../components/SectionTitle'
import SelectSimple from '../../../components/Select/SelectSimple'
import UploadImage from '../../../components/UploadImage'
import { requests } from '../../../utils/requests'
import { useQueryParams } from '../../hooks/useQueryParams'
import productStoresTableHeaderSelector from './productStoresTableHeaderSelector'
import InputSearch from '../../../components/Inputs/InputSearch'
import { error } from '../../../utils/toast'

export default function ProductBody({ productData = null }) {
  const { setValue, watch, register, getValues } = useFormContext()
  const [productCategories, setProductCategories] = useState([{}])
  const [uniType, setUniType] = useState('piece')
  const [storeSearchText, setStoreSearchText] = useState('')
  const { columns, loading } = useSelector((state) => state.storesListTableColumnsForProduct)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)

  const { t } = useTranslation()
  const [images, setImages] = useState([])
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
    register,
    setValues: setValue,
    getValues: getValues,
    applyAllFunc: applyAllFunc,
  })
  const { data: storeList, refetch: refetchShopList } = useQuery(['shopList', storeSearchText], () =>
    requests.getAllStores({
      product_id: get(productData, 'id'),
      limit: values?.limit || 5,
      offset: values?.offset || 0,
      search: storeSearchText || '',
    })
  )
  const { mutate: generateBarcode, isLoading: isgenerateBarcode } = useMutation(requests.generateBarcode, {
    onSuccess: ({ data }) => {
      console.log(data)
      setValue('barcode', get(data, 'data.barcode'))
    },
    onError: (err) => {
      error('Ошибка при генерировать штрих-код!')
    },
  })
  useEffect(() => {
    refetchShopList()
  }, [values.limit, values.offset])

  useEffect(() => {
    const supply_price = Number(getValues('supply_price'))
    const vat = Number(getValues('vat'))
    if (supply_price >= 0 && vat >= 0) {
      setValue('retail_price', (supply_price / 100) * vat + supply_price)
      setValue('vat_price', (supply_price / 100) * vat)
    }
  }, [watch('supply_price'), watch('vat')])
  useEffect(() => {
    const supply_price = Number(getValues('supply_price'))
    const bonus_amount = Number(getValues('bonus_amount'))
    if (supply_price >= 0) {
      setValue('bonus_percent', (bonus_amount * 100) / supply_price)
    }
  }, [watch('bonus_amount')])

  useEffect(() => {
    const supply_price = Number(getValues('supply_price'))
    const bonus_percent = Number(getValues('bonus_percent'))
    if (supply_price >= 0) {
      setValue('bonus_amount', (supply_price / 100) * bonus_percent)
    }
  }, [watch('bonus_percent')])

  const { data: unitsList, refetch: refetchUnitList } = useQuery('unitsList', () => requests.getAllUnits({ limit: 20, offset: 0 }))

  useEffect(() => {
    if (productData) {
      setValue('name', productData?.name)
      setImages(productData?.photos?.map((item) => ({ file_name: item, file_url: item })))
      setValue('supply_price', productData?.supply_price || 0)
      setValue('retail_price', productData?.retail_price || 0)
      setValue('vat', productData?.vat || 0)
      setValue('vat_price', productData?.vat_price || 0)
      setValue('bonus_amount', productData?.bonus_amount || 0)
      setValue('bonus_percent', productData?.bonus_percent || 0)
      setValue('manufacturer', productData?.manufacturer || 0)
      setValue('box_grain_count', productData?.box_grain_count || 0)
      setValue('product_unit', { value: productData?.unit_type?.codename, name: productData?.unit_type?.unit_name, id: productData?.unit_type?.id } || 0)
      setValue('expire_date', new Date(productData?.expire_date) || new Date())
      setValue('barcode', productData?.barcode || 0)
      setProductCategories(productData?.categories?.map((el, ind) => ({ ...el, name: el.nameRu, quantity: productData?.quantityOfCategories?.[ind] })))
    }
    console.log(productData)
  }, [productData])
  useEffect(() => {
    get(storeList, 'data.data.data', []).map((el) => {
      setValue(`store_product.${el.id}.store_id`, el.id)
    })
  }, [storeList])

  useEffect(() => {
    if (productCategories?.length > 0) setValue('categories', productCategories)
  }, [productCategories])
  useEffect(() => {
    refetchShopList()
    const offsetsCount = Math.ceil(get(storeList, 'data.data._meta.total_count') / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [storeList?.data, values.limit])
  useEffect(() => {
    setUniType(get(getValues('product_unit'), 'value', 'piece'))
  }, [watch('product_unit')])
  useEffect(() => {
    if (!productData) {
      setValue('app_type', 'BUCHET')
    }
  }, [])

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
          <UploadImage id='images' name='images' images={images} onChange={(imagesArr) => setValue('images', imagesArr)} />
        </Box>
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
              label={'Цена бонуса'}
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
              label={'Бонусный процент'}
              placeholder={t('create_new_product.vat_price.placeholder')}
            />
          </Box>
        </Box>
        <Box height={'56px'} />

        <SectionTitle noWrap withLine>
          {t('create_new_product.amount_section.label')}
        </SectionTitle>
        <Box mt={'24px'}>
          <InputSearch
            // fullWidth

            maxWidth={'500px'}
            uncontrolled={false}
            onChange={({ target }) => setStoreSearchText(get(target, 'value'))}
            id='producrs-search'
            name='search'
            placeholder={t('input.search.product.multi')}
          />
        </Box>
        <Box mt={'24px'}>
          <AgGridTable
            id='products-main-feftables'
            tableSettings
            columns={tableColumns}
            data={get(storeList, 'data.data.data')}
            pagination
            isDataLoading={false}
            offsetCount={offsetCount}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
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
            name='manufacturer'
            label={t('create_new_product.features.manufacturer')}
            placeholder={t('create_new_product.features.manufacturer.placeholder')}
            sx={{ mb: 3 }}
          />
          {uniType === 'pack' && (
            <>
              <Box width={'20px'} />
              <Box
                sx={{
                  '& .MuiFormControl-root': {
                    marginTop: '4px !important',
                  },
                }}
              >
                <InputQuantity
                  label={'Количество зерен'}
                  id={`box_grain_count`}
                  name={`box_grain_count`}
                  fullWidth
                  required
                  type='number'
                  defaultValue={0}
                  disabled={false}
                />
              </Box>
            </>
          )}
          <Box width={'20px'} />
          <Box
            sx={{
              '& .select': {
                marginTop: '4px !important',
              },
            }}
          >
            <SelectSimple
              required
              white
              isClearable={false}
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
                <Button onClick={() => generateBarcode()} id={'buttonId'} variant='text'>
                  {'Создать'}
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
