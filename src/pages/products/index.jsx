import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '../../../components/CheckAccess'
import ConfirmDialog from '../../../components/ConfirmDialog'
import ImageGallery from '../../../components/ImageGallery'
import InputSearch from '../../../components/Inputs/InputSearch'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import LoadingContainer from '../../../components/LoadingContainer'
import StyledTooltip from '../../../components/StyledTooltip'
import { downloadExcel } from '../../../utils/downloadEXCEL'
import { requests } from '../../../utils/requests'
import { error, success } from '../../../utils/toast'
import BarcodeIcon from '../../assets/icons/BarcodeIcon'
import BigTickIcon from '../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../assets/icons/BigWarningIcon'
import CategoryIcon from '../../assets/icons/CategoryIcon'
import FilterMenuIcon from '../../assets/icons/FilterMenuIcon'
import PlusIcon from '../../assets/icons/PlusIcon'
import PrizeBoxIcon from '../../assets/icons/PrizeBoxIcon'
import { useQueryParams } from '../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../redux-toolkit/tableSlices/productsTableColumns'
import FilterMenu from './FilterMenu'
import ProductDrawer from './product-edit/ProductDrawer'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'
export default function ProductsPage() {
  const theme = useTheme()
  const methods = useForm()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.productsTableColumns)
  const { values } = useQueryParams()
  const user_data = useSelector((state) => state.user)
  const [regions, setRegions] = useState([])
  const [appType, setAppType] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [controlleroffset, setControllerOffset] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [canChangebarcode, setCanChangebarcode] = useState(false)
  const [openProductDrawer, setOpenProductDrawer] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const { mutate: setMarkingRequired, isLoading: isSetMarkingRequired } = useMutation(requests.setMarkingRequired, {
    onSuccess: ({ data }) => {
      success('Статус обязательности Маркировка был изменен')
    },
    onError: (err) => {
      refetch()

      error('Ошибка при Маркировка был изменен!')
    },
  })
  const { mutate: changeBarcode, isLoading: isChangeBarcode } = useMutation(requests.changeBarcode, {
    onSuccess: ({ data }) => {
      refetch()
      fetchStatusCountList()
    },
    onError: (err) => {
      error('Ошибка при сканирование!')
    },
  })
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    setOpenProductDrawer,
    setMarkingRequired,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    changeBarcode,
    canChangebarcode,
  })
  const routeString = []

  user_data?.role_actions?.forEach((item) => {
    if (item.type == 'TABLE') {
      routeString.push(item.route)
    }
  })
  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID)
        ?.map((el) => ({
          ...el,
          label: el.headerName,
          desc: el.desc,
          name: el.colId,
          hide: !routeString.includes(el?.colId),
          always_active: el?.always_active ?? el?.always_active,
        }))

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])
  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])
  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])
  const productsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      search: values?.search,
      offset: controlleroffset || 0,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      store_id: values?.store_id,
      category_id: values?.category_id,
      producer_id: values?.producer_id,
      supply_price_to: values?.supply_price_to,
      retail_price_to: values?.retail_price_to,
      region: values?.region_id,
      supply_price_from: values?.supply_price_from,
      retail_price_from: values?.retail_price_from,
      no_barcode: values?.no_barcode == '1' ? true : false,
      isExpress: values?.isExpress,
      start_date: values?.start_date || dayjs(new Date()).format('YYYY-MM-DD'),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
      ...(appType !== 'ALL' && { status: appType }),
    }
  }, [
    appType,
    controlleroffset,
    values?.limit,
    values?.search,
    values?.producer_id,
    values?.category_id,
    values?.store_id,
    values?.no_barcode,
    values?.supply_price_to,
    values?.retail_price_to,
    values?.supply_price_from,
    values?.retail_price_from,
    values?.region_id,
    values?.isExpress,
    values?.start_date,
    values?.end_date,
    regions,
  ])
  const {
    data: productsList,
    isLoading: productsListLoading,
    isFetching: isFetchingproductsList,
    refetch,
  } = useQuery(['productsList', productsListFilter], () => requests.getAllProducts(productsListFilter))

  const {
    data: statusCountList,
    isLoading: statusCountListLoading,
    isFetching: isFetchingstatusCountList,
    refetch: fetchStatusCountList,
  } = useQuery(['statusCountList', values?.search, productsListFilter], () => requests.getAllProductsStatusCount(productsListFilter))

  const { mutate: deleteProduct, isLoading: isDeletingProduct } = useMutation(requests.deleteProduct, {
    onSuccess: () => {
      refetch()
      success('Продукт успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении товара!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  const { mutate: activateProduct, isLoading: isActivatingProduct } = useMutation(requests.activateProduct, {
    onSuccess: () => {
      success('Продукт успешно активирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при активации продукта!')
      refetch()
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })
  const { mutate: deActivateProduct, isLoading: isDeActivatingProduct } = useMutation(requests.changeProductStatus, {
    onSuccess: () => {
      success('Продукт успешно деактивирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при деактивации продукта!')
      refetch()
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [productsListFilter])

  useEffect(() => {
    const count = productsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(productsList, 'data.data.data', []).map((productData) => {
      methods.setValue(`editable_barcode_${get(productData, 'id')}`, get(productData, 'barcode'))
    })
  }, [productsList?.data, values?.limit, appType])
  const { mutate: productsExcelReport, isLoading: isproductsExcelReport } = useMutation(requests.getProductsExcelReport, {
    onSuccess: ({ data }) => {
      downloadExcel(data, `${values?.store_name || 'Все филиалы'} | ${dayjs().format('YYYY-MM-DD HH:mm')}`)
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={true}>
      <FormProvider {...methods}>
        <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
              {t('page.catalog.title')}
            </Typography>
          </Box>
          <Box minWidth={320} sx={{ display: 'flex' }}>
            <InputSwitch
              uncontrolled
              id='app-type'
              name='app-type'
              value={appType}
              defaultValue='ALL'
              onChange={(e) => setAppType(e)}
              options={[
                { title: t('switch.title.all'), value: 'ALL', count: get(statusCountList, 'data.data.total_count', 0) },
                { title: t('switch.title.active'), value: 'active', count: get(statusCountList, 'data.data.active_count', 0) },
                { title: t('switch.title.inactive'), value: 'inactive', count: get(statusCountList, 'data.data.inactive_count', 0) },
                { title: t('switch.title.less_amount'), value: 'low-stock', count: get(statusCountList, 'data.data.low_stock_count', 0) },
                { title: t('switch.title.empty'), value: 'zero-stock', count: get(statusCountList, 'data.data.zero_stock_count', 0) },
                { title: t('switch.title.less_date'), value: 'imminent', count: get(statusCountList, 'data.data.imminent_count', 0) },
                { title: t('switch.title.outofdate'), value: 'expired', count: get(statusCountList, 'data.data.expired_count', 0) },
              ]}
            />
            <Box display={'flex'}>
              <StyledTooltip title={'Управление каталогом'}>
                <Box
                  onClick={() => navigate('/products/categories')}
                  sx={{
                    backgroundColor: 'bg.10',
                    padding: '10px',
                    borderRadius: '10px',
                    mr: '10px',
                    display: 'flex',
                    width: '38px',
                    height: '38px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CategoryIcon />
                </Box>
              </StyledTooltip>
              <StyledTooltip title={'Бонусный продукт'}>
                <Box
                  onClick={() => navigate('/products/bonus-product')}
                  sx={{
                    backgroundColor: 'bg.10',
                    padding: '10px',
                    borderRadius: '10px',
                    display: 'flex',
                    width: '38px',
                    height: '38px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                      width: '18px',
                      height: '18px',
                    },
                  }}
                >
                  <PrizeBoxIcon color='#fe5000' />
                </Box>
              </StyledTooltip>
            </Box>
          </Box>
          <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
            <Box width='100%' display={'flex'}>
              <Box
                width='100%'
                sx={{
                  '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                  '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                    background: 'transparent',
                    height: 48,
                  },
                }}
              >
                <InputSearch fullWidth id='producrs-search' name='search' placeholder={t('input.search.product.multi')} uncontrolled />
              </Box>
              <Box minWidth={113} ml={'16px'}>
                <Button
                  sx={{
                    height: '48px',
                    padding: 0,
                    bgcolor: '#fff',
                    border: '1px solid #ECEDF2',
                    color: 'dark.500',
                    fontWeight: '500',
                    fontSize: '16px',
                    lineHeight: '24px',
                    '& span': {
                      mr: '12px',
                    },
                  }}
                  fullWidth
                  startIcon={<FilterMenuIcon color={theme.palette.black} />}
                  variant='contained'
                  color='secondary'
                  onClick={() => setFilterMenu((prev) => !prev)}
                >
                  <Typography fontWeight={600} fontSize={'16px'} lineHeight={'25px'}>
                    {t('filter_dialog.label')}
                  </Typography>
                </Button>
              </Box>
            </Box>
            <StyledTooltip title={'Включить изменение штрих-кода'}>
              <Box>
                <CheckAccess id={'can-change-barcode'}>
                  <Button
                    sx={{
                      height: '48px',
                      width: '48px',
                      padding: 0,
                      bgcolor: '#fff',
                      border: '1px solid #ECEDF2',
                      color: 'dark.500',
                      fontWeight: '500',
                      fontSize: '16px',
                      lineHeight: '24px',
                      '& span': {
                        mr: '12px',
                      },
                    }}
                    fullWidth
                    // startIcon={<BarcodeIcon color={theme.palette.black} />}
                    variant='contained'
                    color='secondary'
                    onClick={() => setCanChangebarcode((prev) => !prev)}
                  >
                    {canChangebarcode ? (
                      <Typography fontSize='24px' fontWeight={'500'} mt={'6px'}>
                        T
                      </Typography>
                    ) : (
                      <BarcodeIcon />
                    )}
                  </Button>
                </CheckAccess>
              </Box>
            </StyledTooltip>
            <Box display={'flex'} alignItems={'center'}>
              <CheckAccess id={'products-all-table'}>
                <Box>
                  <StyledTooltip title={'Настройки таблица'}>
                    <ColumnsFilterButtonForAll
                      title={t('ag_grid.table_setting.label')}
                      columns={tableColumns}
                      isCatalog={false}
                      routeString={routeString}
                      resetTableHeader={resetTableHeader}
                      changeColumnSequence={changeColumnSequence}
                    />
                  </StyledTooltip>
                </Box>
              </CheckAccess>
              <CheckAccess id={'product-create'}>
                <Box minWidth={156}>
                  <Button
                    sx={{ height: '48px' }}
                    onClick={() => navigate('/products/create')}
                    fullWidth
                    startIcon={<PlusIcon color='#fff' />}
                    variant='contained'
                    color='primary'
                  >
                    {t('button.add_new.text')}
                  </Button>
                </Box>
              </CheckAccess>
            </Box>
          </Box>
          <FilterMenu refetch={refetch} setRegions={setRegions} open={filterMenu} setOpen={setFilterMenu} />
          <Box>
            <AgGridTable
              id='products-main-table'
              alwaysShowHorizontalScroll={true}
              tableSettings
              fullDownload={() => productsExcelReport({ ...productsListFilter, limit: 1000000 })}
              downloadByFilter={() => productsExcelReport(productsListFilter)}
              isDownloading={isproductsExcelReport}
              columns={tableColumns}
              data={productsList?.data?.data?.data || []}
              totalCount={productsList?.data?.data?._meta?.total_count || 0}
              isDataLoading={isFetchingproductsList || productsListLoading}
              offsetCount={offsetCount}
              updaterAction={(newData) => {
                if (newData) dispatch(updateTableHeader(newData))
              }}
              fullInfoAboutCurrentPage
              resetTable={() => dispatch(resetTableHeader({ refetch }))}
              status={appType}
              isRefreshing={loading || canChangebarcode || isFetchingproductsList || productsListLoading}
            />
          </Box>
        </Box>
        <ProductDrawer open={openProductDrawer} setImages={setOpenImageGallery} onClose={setOpenProductDrawer} />

        <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
        {openConfirmDialog && (
          <ConfirmDialog
            open={!!openConfirmDialog}
            setOpen={setOpenConfirmDialog}
            icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
            title={
              openConfirmDialog?.type === 'activate'
                ? 'Активировать продукт?'
                : openConfirmDialog?.type === 'deactivate'
                ? 'Деактивировать продукт?'
                : 'Удалить продукт?'
            }
            desc={
              openConfirmDialog?.type === 'activate'
                ? 'Вы действительно хотите активировать продукт, вы не можете вернуть этот прогресс после активации.'
                : openConfirmDialog?.type === 'deactivate'
                ? 'Вы действительно хотите деактивировать продукт, вы не можете вернуть этот прогресс после деактивации.'
                : 'Вы хотите удалить продукт?'
            }
            supDesc={'“Azitromitsin 250 mg”'}
            actions={
              <>
                <Button
                  sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                  fullWidth
                  color='secondary'
                  variant='contained'
                  onClick={() => setOpenConfirmDialog(null)}
                >
                  Нет
                </Button>
                <LoadingButton
                  variant='contained'
                  type='button'
                  loading={isDeletingProduct || isActivatingProduct || isDeActivatingProduct}
                  onClick={() =>
                    openConfirmDialog?.type === 'activate'
                      ? activateProduct(openConfirmDialog.id)
                      : openConfirmDialog?.type === 'deactivate'
                      ? deActivateProduct({ id: openConfirmDialog.id, appType: 'INACTIVE' })
                      : deleteProduct({ data: [openConfirmDialog.id] })
                  }
                >
                  Да, удалить
                </LoadingButton>
              </>
            }
          />
        )}
      </FormProvider>
    </LoadingContainer>
  )
}
