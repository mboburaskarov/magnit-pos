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
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useDrawerHistory } from '@hooks/useDrawerHistory'
import AddNewBarcodeToProduct from './addNewBarcodeToProduct'
import MgPageHeader from '@components/MgPageHeader'
import MgTabs from '@components/MgTabs'

const SELECTION_ID = 'checkboxSelectionField'
const LoadingChangeBarcode = ({ status }) => {
  if (!status) return null
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        bgcolor: '#fff',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '400px',
        gap: '12px',
        border: `1px solid ${status === 'error' ? '#FF4842' : status === 'success' ? '#00AB55' : '#ECEDF2'}`,
      }}
    >
      {status === 'loading' && <CircularProgress size={24} sx={{ color: 'orange.500' }} />}
      {status === 'success' && <BigTickIcon />}
      {status === 'error' && <BigWarningIcon />}
      <Box>
        <Typography fontWeight={600} fontSize={'14px'} color={status === 'error' ? 'error.main' : status === 'success' ? 'success.main' : 'text.primary'}>
          {status === 'loading' && 'Обновление...'}
          {status === 'success' && 'Успешно обновлено'}
          {status === 'error' && 'Ошибка обновления'}
        </Typography>
        {status === 'loading' && (
          <Typography fontSize={'12px'} color='text.secondary'>
            Пожалуйста, подождите
          </Typography>
        )}
      </Box>
    </Box>
  )
}

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
  const [openAddBarcode, setOpenAddBarcode] = useState(false)
  const [openErrorReason, setOpenErrorReason] = useState(false)
  const [openProductDrawer, setOpenProductDrawer] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)

  // Close product drawer on browser back button press
  const handleCloseDrawer = useCallback((val) => setOpenProductDrawer(val), [])
  useDrawerHistory(openProductDrawer, handleCloseDrawer)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const [loadingModalStatus, setLoadingModalStatus] = useState(null)

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
    onMutate: () => {
      setLoadingModalStatus('loading')
    },
    onSuccess: ({ data }) => {
      refetch()
      fetchStatusCountList()
      setLoadingModalStatus('success')
      setTimeout(() => setLoadingModalStatus(null), 2000)
    },
    onError: (err) => {
      error('Ошибка при сканирование!')
      setLoadingModalStatus('error')
      setTimeout(() => setLoadingModalStatus(null), 2000)
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
    setOpenAddBarcode,
    setOpenConfirmDialog,
    setOrderStoring,
    orderStoring,
    setOpenErrorReason,
    setCurrentSaleId,
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
      is_return: values?.is_return,
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
      <LoadingChangeBarcode status={loadingModalStatus} />
      <FormProvider {...methods}>
        {isproductsExcelReport && <LoadingBlock zIndex={99} top={0} position={'fixed'} width={'100%'} left='0' />}

        <Box display='flex' flexDirection='column' position='relative' px={'24px'} pt={0}>
          {/* page-header wrapper using reusable MgPageHeader */}
          <MgPageHeader
            title={t('page.catalog.title')}
            subtitle={`${t('catalog.total', 'Всего:')} ${new Intl.NumberFormat('ru-UZ').format(productsList?.data?.data?._meta?.total_count || 0)}`}
            onTitleClick={() => navigate('/products/all-by-import')}
            showStatsToggle
            isOpenStats={isOpenStatDashboard}
            onStatsToggle={() => setIsOpenStatDashboard((p) => !p)}
            showExport
            onExport={() => productsExcelReport(productsListFilter)}
            exportLoading={isproductsExcelReport}
            showCreate
            onCreate={() => navigate('/products/create')}
            createLabel={t('button.add_new.text') || 'Добавить продукт'}
            createPermissionId="product-create"
          />

          {isOpenStatDashboard && <ProductDashboard data={get(statusCountList, 'data.data', 0)} />}

          {/* Table Card wrapper */}
          <div className='mg-table-card' style={{ marginTop: '12px' }}>
            {/* Tabs container using reusable MgTabs component */}
            <MgTabs
              activeTab={appType}
              onChange={setAppType}
              tabs={[
                {
                  value: 'ALL',
                  title: t('switch.title.all', 'Все'),
                  count: get(statusCountList, 'data.data.total_count', 0)
                },
                {
                  value: 'active',
                  title: t('switch.title.active', 'Активные'),
                  count: get(statusCountList, 'data.data.active_count', 0)
                },
                {
                  value: 'low-stock',
                  title: t('switch.title.less_amount', 'Мало на складе'),
                  count: get(statusCountList, 'data.data.low_stock_count', 0),
                  tooltip: 'В аптеке осталось менее 10 лекарств'
                },
                {
                  value: 'zero-stock',
                  title: t('switch.title.empty', 'Нет в наличии'),
                  count: get(statusCountList, 'data.data.zero_stock_count', 0),
                  tooltip: 'Лекарства, которые не остались в аптеке'
                },
                {
                  value: 'imminent',
                  title: t('switch.title.less_date', 'Истекающие'),
                  count: get(statusCountList, 'data.data.imminent_count', 0),
                  tooltip: 'Товары со сроком годности менее 3 месяцев'
                },
                {
                  value: 'expired',
                  title: t('switch.title.outofdate', 'Просроченные'),
                  count: get(statusCountList, 'data.data.expired_count', 0)
                }
              ]}
            />

            {/* Toolbar block matching table-toolbar exactly */}
            <div className='mg-table-toolbar'>
              <div className='mg-table-toolbar-left' style={{ width: '100%' }}>
                {/* Search field */}
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box
                    width='100%'
                    maxWidth={400}
                    sx={{
                      '& .MuiFormControl-root': {
                        backgroundColor: '#ffffff !important',
                        background: '#ffffff !important',
                        height: '40px !important',
                        borderRadius: '8px !important',
                      },
                      '& .MuiInputBase-root': {
                        height: '40px !important',
                        borderColor: '#E5E7EB !important',
                        border: '1px solid #E5E7EB !important',
                        borderRadius: '8px !important',
                        fontSize: '14px !important',
                        fontWeight: '500 !important',
                        color: '#111111 !important',
                        boxSizing: 'border-box !important',
                        backgroundColor: '#ffffff !important',
                        background: '#ffffff !important',
                      },
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff !important',
                        background: '#ffffff !important',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important',
                        backgroundColor: 'transparent !important',
                        background: 'transparent !important',
                      },
                      '& input': {
                        fontSize: '14px !important',
                        fontWeight: '500 !important',
                        color: '#111111 !important',
                        backgroundColor: '#ffffff !important',
                        background: '#ffffff !important',
                      },
                    }}
                  >
                    <InputSearch white fullWidth id='producrs-search' name='search' placeholder={t('input.search.product.multi')} uncontrolled />
                  </Box>
                </div>
              </div>

              {/* Table Toolbar Right */}
              <div
                className='mg-table-toolbar-right'
                style={{ color: 'var(--mg-text-secondary)', fontSize: '13.5px', gap: '16px', display: 'flex', alignItems: 'center' }}
              >
                {/* Filter button */}
                <button
                  type='button'
                  className='mg-btn mg-btn-secondary mg-btn-sm'
                  onClick={() => setFilterMenu((prev) => !prev)}
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#ffffff',
                    color: '#111111',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <FilterMenuIcon color='#111111' />
                  <span style={{ fontWeight: 500, fontSize: '14px', color: '#111111' }}>{t('filter_dialog.label')}</span>
                </button>

                <CheckAccess id={'products-all-table'}>
                  <StyledTooltip title={'Настройки таблица'}>
                    <Box style={{ cursor: 'pointer' }}>
                      <ColumnsFilterButtonForAll
                        title={t('ag_grid.table_setting.label')}
                        columns={tableColumns}
                        isCatalog={false}
                        routeString={routeString}
                        resetTableHeader={resetTableHeader}
                        changeColumnSequence={changeColumnSequence}
                      />
                    </Box>
                  </StyledTooltip>
                </CheckAccess>
              </div>
            </div>

            {/* Ag Grid wrapper */}
            <div style={{ padding: '0px' }}>
              <AgGridTable
                id='products-main-table'
                alwaysShowHorizontalScroll={true}
                tableSettings
                rowHeight={64}
                canCellClick={true}
                hasAADownload={productsListFilter?.store_id}
                enableFillHandle={true}
                onCellValueChanged={onCellValueChanged}
                downloadForAA={() => productsExcelReportForAA({ ...productsListFilter, offset: 0, limit: 6000000 })}
                fullDownload={() => productsExcelReport({ ...productsListFilter, offset: 0, limit: 6000000 })}
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
            </div>
          </div>
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
        <FilterMenu refetch={refetch} open={filterMenu} setOpen={setFilterMenu} setRegions={setRegions} />
        <AddNewBarcodeToProduct open={openAddBarcode} refetch={refetch} setOpen={setOpenAddBarcode} />
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
