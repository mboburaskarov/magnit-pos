import { Box, Button, Typography } from '@mui/material'
import { get, method } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
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
import MeasurementValueDialog from './MeasurementValueDialog'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import LazySelect from '../../../components/Select/LazySelect'
import NumberFormatInput from '../../../components/Inputs/OutLineTextFieldThousand'
import getOptionsFromUrlParam from '../../../utils/getOptionsFromUrlParam'
import getOptionsSchema from '../../../utils/getOptionsSchema'
import dayjs from 'dayjs'
export default function ProductBody({ productData = null }) {
  const { setValue, watch, register, getValues, reset } = useFormContext()
  const [productCategories, setProductCategories] = useState([{}])
  const [uniType, setUniType] = useState('piece')
  const [openChangeQuantity, setOpenChangeQuantity] = useState(false)

  const { columns, loading } = useSelector((state) => state.storesListTableColumnsForProduct)
  const { values } = useQueryParams()
  const [storeSearchText, setStoreSearchText, debouncedValue] = useDebouncedValue(values?.search || '', 200)
  const [offsetCount, setOffsetCount] = useState(0)

  const { t } = useTranslation()
  const [images, setImages] = useState([])

  const applyAllFunc = (id, type) => {
    if (type === 'pack_quantity') {
      const quantity = getValues(`store_product.${id}.pack_quantity`)
      get(storeList, 'data.data.ids', []).map((id) => {
        setValue(`store_product.${id}.pack_quantity`, quantity)
      })
    } else {
      const quantity = getValues(`store_product.${id}.small_quantity`)
      get(storeList, 'data.data.ids', []).map((id) => {
        setValue(`store_product.${id}.small_quantity`, quantity)
      })
    }
  }
  const tableColumns = productStoresTableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    productData: productData,
    register,
    setOpenChangeQuantity,
    register,
    setValues: setValue,
    getValues: getValues,
    applyAllFunc: applyAllFunc,
  })
  const storeHistoryFilter = useMemo(() => {
    return {
      product_id: get(productData, 'id'),
      limit: values?.limitStore || 10,
      offset: values?.offsetStore || 0,
      search: storeSearchText || '',
    }
  }, [values?.limitStore, storeSearchText, values?.offset, values?.offsetStore])

  const { data: storeList, refetch: refetchShopList } = useQuery(['shopList', storeHistoryFilter], () => requests.getAllStores(storeHistoryFilter))
  const { data: producerValue, refetch: refetchproducerValue } = useQuery(['producerValue'], () => requests.getProducer({ id: productData?.manufacturer }), {
    enabled: Boolean(get(productData, 'manufacturer', false)),
  })
  const { data: shelfValue, refetch: refetchshelfValue } = useQuery(['shelfValue'], () => requests.getShelf({ id: productData?.shelf_id }), {
    enabled: Boolean(get(productData, 'shelf_id', false)),
  })
  const { mutate: generateBarcode, isLoading: isgenerateBarcode } = useMutation(requests.generateBarcode, {
    onSuccess: ({ data }) => {
      setValue('barcode', get(data, 'data.barcode'))
    },
    onError: (err) => {
      error('Ошибка при генерировать штрих-код!')
    },
  })

  const changeAmount = (inputName, value) => {
    const supply_price = Number(getValues('supply_price'))

    const vat = Number(getValues('vat'))
    const markup = Number(getValues('markup'))
    const retail_price = Number(getValues('retail_price'))
    const bonus_percent = Number(getValues('bonus_percent'))
    const bonus_amount = Number(getValues('bonus_amount'))
    const vat_price = Number(getValues('vat_price'))
    if (inputName === 'supply_price' || inputName === 'vat') {
      if (supply_price >= 0 && vat >= 0) {
        setValue('retail_price', (supply_price / 100) * (vat + markup) + supply_price)
        setValue('vat_price', (supply_price / 100) * vat)
      }
    }
    if (inputName === 'vat_price') {
      if (supply_price >= 0 && vat_price >= 0) {
        setValue('vat', (vat_price * 100) / supply_price)
      }
    }
    if (inputName === 'markup') {
      if (supply_price >= 0 && vat >= 0) {
        setValue('retail_price', (supply_price / 100) * (vat + markup) + supply_price)
      }
    }
    if (inputName === 'retail_price' || inputName === 'bonus_percent') {
      if (supply_price >= 0 && vat >= 0) {
        setValue('markup', ((retail_price - supply_price) * 100) / supply_price - vat)
      }

      if (retail_price >= 0) {
        setValue('bonus_amount', (retail_price * bonus_percent) / 100)
      }
    }

    if (inputName === 'bonus_amount') {
      if (retail_price >= 0) {
        setValue('bonus_percent', (bonus_amount * 100) / retail_price)
      }
    }
  }
  useEffect(() => {
    refetchShopList().then(({ data }) => {
      get(data, 'data.data.data', []).map((store) => {
        setValue(`store_product.${get(store, 'id')}.pack_quantity`, get(store, 'pack_quantity', 0))
        setValue(`store_product.${get(store, 'id')}.small_quantity`, get(store, 'small_quantity', 0))
      })
    })
  }, [values.limitStore, values.offsetStore])

  useEffect(() => {
    setUniType(get(getValues('product_unit'), 'value', 'piece'))
  }, [watch('product_unit')])

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
      setValue('markup', productData?.markup || 0)
      setValue('bonus_percent', productData?.bonus_percent || 0)
      setValue('description', productData?.description || '')
      setValue('manufacturer', getOptionsSchema(get(productData, 'producer', []), Object))
      setValue('shelf_id', getOptionsSchema(get(productData, 'shelf', []), Object))
      setValue('box_grain_count', productData?.unit_per_pack || 0)
      setValue('product_unit', { value: productData?.unit_type?.codename, name: productData?.unit_type?.unit_name, id: productData?.unit_type?.id } || 0)
      setValue('expire_date', get(productData, 'expire_date', false) ? new Date(get(productData, 'expire_date', new Date())) : null)
      setValue('barcode', productData?.barcode || 0)
      setProductCategories(productData?.categories?.map((el, ind) => ({ ...el, name: el.nameRu, quantity: productData?.quantityOfCategories?.[ind] })))
    } else {
      setValue('vat', 12)
    }
  }, [productData, producerValue, shelfValue])
  useEffect(() => {
    get(storeList, 'data.data.ids', []).map((id) => {
      setValue(`store_product.${id}.store_id`, id)
    })
  }, [storeList])

  useEffect(() => {
    if (productCategories?.length > 0) setValue('categories', productCategories)
  }, [productCategories])
  useEffect(() => {
    refetchShopList()
    const offsetsCount = Math.ceil(get(storeList, 'data.data._meta.total_count') / Number(values?.limitStore))
    setOffsetCount(offsetsCount || 0)
  }, [storeList?.data?.data, values.limitStore])

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
          {t('create_new_product.features.label')}
        </SectionTitle>

        <Box height={'24px'} />
        <Box display={'flex'} width={'100%'} mt={'24px'}>
          {/* <TextField
            required
            fullWidth
            borderRadius={'40px'}
            name='manufacturer'
            label={t('create_new_product.features.manufacturer')}
            placeholder={t('create_new_product.features.manufacturer.placeholder')}
            sx={{ mb: 3 }}
          /> */}
          <LazySelect
            isCreatable={true}
            slug='manufacturer'
            boxStyle={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end' }}
            id='manufacturer'
            name='manufacturer'
            isMulti={false}
            label={t('create_new_product.features.manufacturer')}
            placeholder={t('create_new_product.features.manufacturer.placeholder')}
            minWidth='auto'
            isClearable={true}
            request={requests.getProducer}
            filters={{ limit: 10 }}
            // control={control}
            // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
            // request={requests.brand.getAll}
            createOptionRequest={requests.createProducer}
            getOptionLabel={(option) => {
              return <Typography color='grey.600'>{option.name}</Typography>
            }}
            // filterOption={() => true}
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
                  onFocus={({ target }) => {
                    if (Number(get(target, 'value')) == 0) {
                      setValue(`box_grain_count`, '')
                      return
                    }
                  }}
                  onBlur={(e) => {
                    if (Number(get(e, 'target.value')) == '') {
                      setValue(`box_grain_count`, '0')
                      return
                    }
                  }}
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
              label={'Единица измерения'}
              placeholder='Выберите единицу измерения'
              name={'product_unit'}
              options={get(unitsList, 'data.data', []).map((el) => ({ value: el.codename, name: el.unit_name, id: el.id }))}
            />
          </Box>
        </Box>
        <Box display={'flex'} width={'100%'} mt={'24px'}>
          <InputDatePicker defaultValue={new Date()} name='expire_date' required id='expire_date' label='Дата срока' placeholder='Дата срока' />
          <Box width={'20px'} />
          {/* <Box maxWidth={'200px'}> */}
          <LazySelect
            isCreatable={true}
            slug='shelf_id'
            boxStyle={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end' }}
            id='shelf_id'
            name='shelf_id'
            isMulti={false}
            label={'Полка'}
            placeholder={'A4'}
            minWidth='auto'
            isClearable={true}
            request={requests.getShelf}
            filters={{ limit: 10 }}
            // control={control}
            // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
            // request={requests.brand.getAll}
            createOptionRequest={requests.createShelf}
            getOptionLabel={(option) => {
              return <Typography color='grey.600'>{option.name}</Typography>
            }}
            // filterOption={() => true}
          />
          {/* <TextField required fullWidth borderRadius={'40px'} name='shelf' label={'Полка'} placeholder={'А4'} sx={{ mb: 3 }} /> */}
          {/* </Box> */}
          <Box width={'20px'} />

          <TextField
            required
            InputProps={{
              endAdornment: (
                <Button
                  sx={{
                    background: 'red',
                    'margin-right': '4px',
                    height: '35px',
                    backgroundColor: 'orange.500',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'orange.400',
                    },
                  }}
                  onClick={() => generateBarcode()}
                  id={'buttonId'}
                  variant='text'
                >
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
        <Box height={'56px'} />
        <SectionTitle noWrap withLine>
          {t('create_new_product.create_packages.price')}
        </SectionTitle>
        <Box alignItems='flex-end' width='100%' columnGap={3} flexDirection={'column'} display='inline-flex' my={3}>
          <Box display={'flex'} width={'100%'}>
            <NumberFormatInput
              adornment={'UZS'}
              adornmentPosition='end'
              required
              type='number'
              onBlur={(e) => changeAmount('supply_price', e)}
              fullWidth
              borderRadius={'40px'}
              InputProps={{
                onwheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              name='supply_price'
              label={t('create_new_product.supply_price')}
              placeholder={t('create_new_product.supply_price.placeholder')}
            />
            {/* <OutLineTextField
              endAdornmentText={'UZS'}
              required
              type='number'
              onBlur={(e) => changeAmount('supply_price', e)}
              fullWidth
              borderRadius={'40px'}
              InputProps={{
                onwheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              name='supply_price'
              label={t('create_new_product.supply_price')}
              placeholder={t('create_new_product.supply_price.placeholder')}
            /> */}
            <Box width={'20px'} />
            <NumberFormatInput
              endAdornmentText={'%'}
              required
              onBlur={(e) => changeAmount('markup', e)}
              type='number'
              fullWidth
              InputProps={{
                onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              borderRadius={'40px'}
              name='markup'
              label={'Наценка'}
              placeholder={'Наценка'}
            />
            <Box width={'20px'} />
            <NumberFormatInput
              endAdornmentText={'UZS'}
              required
              type='number'
              onBlur={(e) => changeAmount('retail_price', e)}
              InputProps={{
                onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              fullWidth
              borderRadius={'40px'}
              name='retail_price'
              label={t('create_new_product.retail_price') + ' с НДС'}
              placeholder={t('create_new_product.retail_price.placeholder')}
            />
          </Box>
          <Box mt={'24px'} display={'flex'} width={'100%'}>
            <NumberFormatInput
              endAdornmentText={'%'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              onBlur={(e) => changeAmount('vat', e)}
              InputProps={{
                onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              name='vat'
              defaultValue={12}
              label={t('create_new_product.vat')}
              placeholder={t('create_new_product.vat.placeholder')}
            />
            <Box width={'20px'} />

            <NumberFormatInput
              endAdornmentText={'UZS'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              onBlur={(e) => changeAmount('vat_price', e)}
              InputProps={{
                onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              name='vat_price'
              label={t('create_new_product.vat_price')}
              placeholder={t('create_new_product.vat_price.placeholder')}
            />
          </Box>
          <Box mt={'24px'} display={'flex'} width={'100%'}>
            <NumberFormatInput
              endAdornmentText={'%'}
              required
              type='number'
              fullWidth
              borderRadius={'40px'}
              InputProps={{
                onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              onBlur={(e) => changeAmount('bonus_percent', e)}
              name='bonus_percent'
              label={'Бонусный процент'}
              placeholder={'Введите бонусный процент'}
            />
            <Box width={'20px'} />

            <NumberFormatInput
              endAdornmentText={'UZS'}
              required
              type='number'
              fullWidth
              onBlur={(e) => changeAmount('bonus_amount', e)}
              borderRadius={'40px'}
              InputProps={{
                onWheel: (e) => e.currentTarget.blur(), // Disable scrolling
              }}
              name='bonus_amount'
              label={'Цена бонуса'}
              placeholder={'Введите бонусный цена'}
            />
          </Box>
        </Box>
        <Box height={'56px'} />
        <MeasurementValueDialog setValue={setValue} open={openChangeQuantity} setOpen={setOpenChangeQuantity} />
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
            placeholder={'Поиск филиала'}
          />
        </Box>
        <Box mt={'24px'}>
          <AgGridTable
            id='products-main-feftables'
            tableSettings
            columns={tableColumns}
            data={get(storeList, 'data.data.data')}
            totalCount={storeList?.data?.data?._meta?.total_count || 0}
            pagination
            offsetQuery='offsetStore'
            limitQuery='limitStore'
            isDataLoading={false}
            offsetCount={offsetCount}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={false}
          />
        </Box>
        <Box height={'56px'} />
        <SectionTitle noWrap withLine>
          {t('create_new_product.additional_information.category')}
        </SectionTitle>
        <CategoriesTree />
        <Box height={'24px'} />
        <TextField borderRadius={'20px'} required multiline fullWidth name='description' label='Описание' placeholder='Введите описание' />
      </Box>
    </Box>
  )
}
