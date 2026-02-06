import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/productsTableColumns'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import AgGridTable from '@components/AgGridTable/AgGridTableSelectable'
import ProductDrawer from '@components/Drawers/ProductDrawer'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import LoadingContainer from '@components/LoadingContainer'
import { Block, Download, Info, Report } from '@mui/icons-material'
import InputSwitch from '@components/Inputs/InputSwitch'
import InputSearch from '@components/Inputs/InputSearch'
import { checkPermission } from '@utils/checkPermission'
import { FormProvider, useForm } from 'react-hook-form'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useQueryParams } from '@hooks/useQueryParams'
import { useDispatch, useSelector } from 'react-redux'
import StyledTooltip from '@components/StyledTooltip'
import ConfirmDialog from '@components/ConfirmDialog'
import thousandDivider from '@utils/thousandDivider'
import { useEffect, useMemo, useState } from 'react'
import LoadingBlock from '@components/LoadingBlock'
import ImageGallery from '@components/ImageGallery'
import { useMutation, useQuery } from 'react-query'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import BigWarningIcon from '@icons/BigWarningIcon'
import CheckAccess from '@components/CheckAccess'
import PrizeBoxIcon from '@icons/PrizeBoxIcon'
import CategoryIcon from '@icons/CategoryIcon'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { error, success } from '@utils/toast'
import BigTickIcon from '@icons/BigTickIcon'
import { requests } from '@utils/requests'
import ArrowDown from '@icons/ArrowDown'
import { LoadingButton } from '@mui/lab'
import PlusIcon from '@icons/PlusIcon'
import { useTheme } from '@mui/styles'
import ArrowUp from '@icons/ArrowUp'
import { get } from 'lodash'

import SendToErrorWithReason from './productError/sendToErrorWithReason'
import tableHeaderSelector from './tableHeaderSelector'
import ChangeUnitPerPack from './changeUnitPerPack'
import ProductDashboard from './productDashboard'
import FilterMenu from './FilterMenu'

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
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(false)
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })
  const location = useLocation()
  const [offsetCount, setOffsetCount] = useState(0)
  const [controlleroffset, setControllerOffset] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [openPerPack, setOpenPerPack] = useState(false)
  const [openErrorReason, setOpenErrorReason] = useState(false)
  const [openProductDrawer, setOpenProductDrawer] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const [gridApi, setGridApi] = useState(null)
  const [currentSaleId, setCurrentSaleId] = useState(get(values, 'sale_id', ''))
  const [currentIndex, setCurrentIndex] = useState(0)
  const { mutate: setMarkingRequired, isLoading: isSetMarkingRequired } = useMutation(requests.setMarkingRequired, {
    onSuccess: ({ data }) => {
      refetch()
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
    setOpenPerPack,
    values,
    setOpenProductDrawer,
    setMarkingRequired,
    editable: true,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    setOrderStoring,
    orderStoring,
    setOpenErrorReason,
  })
  const routeString = []

  user_data?.role_actions?.forEach((item) => {
    if (item.type == 'TABLE') {
      routeString.push(item.route)
    }
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns, hide: (el) => !routeString.includes(el?.colId) })

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
      offset: values?.search ? 0 : controlleroffset || 0,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      store_id: values?.store_id,
      company_id: values?.company_id,
      category_id: values?.category_id,
      producer_id: values?.producer_id,
      supply_price_to: values?.supply_price_to,
      retail_price_to: values?.retail_price_to,
      region: values?.region_id,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,

      supply_price_from: values?.supply_price_from,
      retail_price_from: values?.retail_price_from,
      no_barcode: values?.no_barcode == '1' ? true : false,
      isExpress: values?.isExpress,
      ...(appType !== 'ALL' && { status: appType }),
    }
  }, [appType, controlleroffset, orderStoring, values, regions])
  const {
    data: productsList,
    isLoading: productsListLoading,
    isFetching: isFetchingproductsList,
    refetch,
  } = useQuery(['productsList', productsListFilter], () => requests.getAllProducts(productsListFilter))

  const { data: statusCountList, refetch: fetchStatusCountList } = useQuery(
    ['statusCountList', values?.search, { ...productsListFilter, status: undefined }],
    () => requests.getAllProductsStatusCount(productsListFilter),
  )

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
      console.error('err', err)
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
      console.error('err', err)
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
      console.error('err', err)
    },
  })

  useEffect(() => {
    const count = productsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(productsList, 'data.data.data', [])?.map((productData) => {
      methods.setValue(`editable_barcode_${get(productData, 'id')}`, get(productData, 'barcode'))
    })
    get(productsList, 'data.data.data', [])?.map((productData) => {
      methods.setValue(`editable_mxik_${get(productData, 'id')}`, get(productData, 'mxik'))
    })
    get(productsList, 'data.data.data', [])?.map((productData) => {
      methods.setValue(`editable_unit_code_${get(productData, 'id')}`, get(productData, 'unit_code'))
    })
  }, [productsList?.data, values?.limit, appType])
  const { mutate: productsExcelReport, isLoading: isproductsExcelReport } = useMutation(requests.getProductsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  const { mutate: productsExcelReportForAA, isLoading: isproductsExcelReportForAA } = useMutation(requests.getProductsExcelReportForAA, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })

  const onCellValueChanged = (params) => {
    const { data, colDef, newValue, oldValue } = params
    if (!checkPermission('can-change-product-data-katalog', user_data)) return

    if (colDef?.field === 'barcode' && newValue !== oldValue) {
      const id = data?.id
      const barcode = newValue
      changeBarcode({ id, barcode })
    }
    if (colDef?.field === 'mxik' && newValue !== oldValue) {
      const id = data?.id
      const mxik = newValue
      changeBarcode({ id, mxik })
    }
    if (colDef?.field === 'unit_code' && newValue !== oldValue) {
      const id = data?.id
      const unit_code = newValue
      changeBarcode({ id, unit_code })
    }
    if (colDef?.field === 'unit_label' && newValue !== oldValue) {
      const id = data?.id
      const unit_label = newValue
      changeBarcode({ id, unit_label })
    }
  }
  const { mutate: getProductMovementDashboardExcel, isLoading: isGetProductMovementDashboardExcel } = useMutation(requests.getProductMovementDashboardExcel, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })

  useEffect(() => {
    // Auto-focus row when currentSaleId changes
    if (gridApi && currentSaleId) {
      // Give grid time to render rows
      setTimeout(() => {
        const rowNode = gridApi.getRowNode(currentSaleId) // Remove String() conversion

        if (rowNode && rowNode.rowIndex !== undefined) {
          // Scroll to row
          gridApi.ensureNodeVisible(rowNode, 'middle')

          if (rowNode) {
            // Get the row element and scroll to it
            const rowElement = document.querySelector(`[row-id="${currentSaleId}"]`)

            if (rowElement) {
              rowElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }
          }
          // Focus the cell - pass column key as string
          gridApi.setFocusedCell(rowNode, 'id', null)
          gridApi.deselectAll()
          // Select the row
          rowNode.setSelected(true)
          gridApi.refreshCells({
            rowNodes: [rowNode],
            force: true,
          })
          // Optional: flash the row for visual feedback
          // gridApi.flashCells({ rowNodes: [rowNode] })
        } else {
          console.warn('Row not found for ID:', currentSaleId)
        }
      }, 0)
    }
  }, [gridApi, currentSaleId])
  return (
    <LoadingContainer readyState={true}>
      <FormProvider {...methods}>
        {isproductsExcelReport && <LoadingBlock zIndex={99} top={0} position={'absolute'} width={'100%'} left='0' />}

        <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
          <Box display={'flex'} mb={'10px'} justifyContent={'space-between'}>
            <Typography onClick={() => navigate('/products/all-by-import')} variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
              {t('page.catalog.title')}
            </Typography>
            <Box
              sx={{
                m: 'auto 0',
                userSelect: 'none !important',
                cursor: 'pointer',
                '& > p': {
                  cursor: 'pointer',
                  userSelect: 'none !important',
                },
              }}
              display={'flex'}
              onClick={() => setIsOpenStatDashboard((p) => !p)}
            >
              {isOpenStatDashboard ? <ArrowUp color='#111217' /> : <ArrowDown />}
              <Typography sx={{ fontWeight: '600', whiteSpace: 'pre' }}>{isOpenStatDashboard ? 'Скрыть статистику' : 'Показать статистику'}</Typography>
            </Box>
          </Box>
          {isOpenStatDashboard && <ProductDashboard data={get(statusCountList, 'data.data', 0)} />}

          <Box minWidth={320} mt={'10px'} sx={{ display: 'flex' }}>
            <InputSwitch
              uncontrolled
              id='app-type'
              name='app-type'
              value={appType}
              defaultValue='ALL'
              onChange={(e) => setAppType(e)}
              options={[
                { title: t('switch.title.all'), value: 'ALL', count: thousandDivider(get(statusCountList, 'data.data.total_count', 0)) },
                { title: t('switch.title.active'), value: 'active', count: thousandDivider(get(statusCountList, 'data.data.active_count', 0)) },
                {
                  title: t('switch.title.less_amount'),
                  value: 'low-stock',
                  count: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Box />({thousandDivider(get(statusCountList, 'data.data.low_stock_count', 0))})
                      <StyledTooltip title={'В аптеке осталось менее 10 лекарств'}>
                        <Info sx={{ color: 'bunker.300' }} />
                      </StyledTooltip>
                    </Box>
                  ),
                },
                {
                  title: t('switch.title.empty'),
                  value: 'zero-stock',
                  count: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Box />({thousandDivider(get(statusCountList, 'data.data.zero_stock_count', 0))})
                      <StyledTooltip title={'Лекарства, которые не остались в аптеке'}>
                        <Info sx={{ color: 'bunker.300' }} />
                      </StyledTooltip>
                    </Box>
                  ),
                },
                {
                  title: t('switch.title.less_date'),
                  value: 'imminent',
                  count: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Box />({thousandDivider(get(statusCountList, 'data.data.imminent_count', 0))})
                      <StyledTooltip title={'Товары со сроком годности менее 3 месяцев'}>
                        <Info sx={{ color: 'bunker.300' }} />
                      </StyledTooltip>
                    </Box>
                  ),
                },

                { title: t('switch.title.outofdate'), value: 'expired', count: thousandDivider(get(statusCountList, 'data.data.expired_count', 0)) },
              ]}
            />
            <Box
              display={'flex'}
              sx={{
                bgcolor: 'bg.10',
                height: '48px',
                borderRadius: '24px',
                mt: '14px',
                padding: '4px 10px',
              }}
            >
              <CheckAccess id={'banned-product'}>
                <StyledTooltip title={'Запрещенный продукт'}>
                  <Box
                    onClick={() => navigate('/products/banned-product')}
                    sx={{
                      backgroundColor: 'bg.10',
                      padding: '10px',
                      borderRadius: '50%',
                      mr: '10px',
                      display: 'flex',
                      width: '38px',
                      height: '38px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                    }}
                  >
                    <Block
                      sx={(theme) => ({
                        fill: theme.palette.orange[500],
                        fontSize: 23,
                      })}
                    />
                  </Box>
                </StyledTooltip>
              </CheckAccess>
              <CheckAccess id={'products-categories'}>
                <StyledTooltip title={'Управление каталогом'}>
                  <Box
                    onClick={() => navigate('/products/categories')}
                    sx={{
                      backgroundColor: 'bg.10',
                      padding: '10px',
                      borderRadius: '50%',

                      mr: '10px',
                      display: 'flex',
                      width: '38px',
                      height: '38px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                    }}
                  >
                    <CategoryIcon />
                  </Box>
                </StyledTooltip>
              </CheckAccess>
              <CheckAccess id={'products-bonus-product'}>
                <StyledTooltip title={'Бонусный продукт'}>
                  <Box
                    onClick={() => navigate('/products/bonus-product')}
                    sx={{
                      backgroundColor: 'bg.10',
                      padding: '10px',
                      borderRadius: '50%',

                      display: 'flex',
                      width: '38px',
                      height: '38px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& svg': {
                        width: '18px',
                        height: '18px',
                      },
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                    }}
                  >
                    <PrizeBoxIcon color='#FF6018' />
                  </Box>
                </StyledTooltip>
              </CheckAccess>
              <CheckAccess id={'products-errors'}>
                <StyledTooltip title={'Ошибки'}>
                  <Box
                    onClick={() => navigate('/products/errors')}
                    sx={{
                      ml: '10px',
                      backgroundColor: 'bg.10',
                      padding: '10px',
                      borderRadius: '50%',
                      display: 'flex',
                      width: '38px',
                      cursor: 'pointer',
                      height: '38px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& svg': {
                        width: '18px',
                        height: '18px',
                      },
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                    }}
                  >
                    <Report color='#FF6018' />
                  </Box>
                </StyledTooltip>
              </CheckAccess>
              <CheckAccess id={'can-get-product-movement-dashboard'}>
                <StyledTooltip title={'Общий график действий продуктов'}>
                  <Box
                    sx={{
                      ml: '10px',
                      backgroundColor: 'bg.10',
                      padding: '10px',
                      borderRadius: '50%',
                      display: 'flex',
                      width: '38px',
                      cursor: 'pointer',
                      height: '38px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& svg': {
                        width: '18px',
                        height: '18px',
                      },
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                    }}
                    onClick={() => {
                      getProductMovementDashboardExcel({ store_id: get(values, 'store_id'), limit: 10000, offset: 0 })
                    }}
                  >
                    {isGetProductMovementDashboardExcel ? <CircularProgress size={18} thickness={5} /> : <Download sx={{ color: '#FF6018' }} />}
                  </Box>
                </StyledTooltip>
              </CheckAccess>
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
          <Box
            sx={{
              '& .ag-root-wrapper': {
                // height: 'calc(100vh - 400px) !important',
                overflowY: 'auto',
              },
            }}
          >
            <AgGridTable
              id='products-main-table'
              alwaysShowHorizontalScroll={true}
              tableSettings
              canCellClick={true}
              hasAADownload={productsListFilter?.store_id}
              enableFillHandle={true}
              onCellValueChanged={onCellValueChanged}
              downloadForAA={() => productsExcelReportForAA({ ...productsListFilter, offset: 0, limit: 1000000 })}
              fullDownload={() => productsExcelReport({ ...productsListFilter, offset: 0, limit: 1000000 })}
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
              isRefreshing={loading || isFetchingproductsList || productsListLoading}
              onGridApiReady={setGridApi}
            />
          </Box>
        </Box>
        <ProductDrawer
          ids={(productsList?.data?.data?.data || []).map(({ id }) => id)}
          currentIndex={currentIndex}
          currentSaleId={currentSaleId}
          setCurrentIndex={setCurrentIndex}
          setCurrentSaleId={setCurrentSaleId}
          open={openProductDrawer}
          setImages={setOpenImageGallery}
          onClose={setOpenProductDrawer}
        />
        <ChangeUnitPerPack refetch={refetch} open={openPerPack} setOpen={setOpenPerPack} />
        <SendToErrorWithReason open={openErrorReason} setOpen={setOpenErrorReason} />
        <ImageGallery canAlert={setOpenErrorReason} open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
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
