import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/ostatokByDateTableColumns'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import AgGridTable from '@components/AgGridTable/AgGridTableSelectable'
import ProductDrawer from '@components/Drawers/ProductDrawer'
import LoadingContainer from '@components/LoadingContainer'
import InputSwitch from '@components/Inputs/InputSwitch'
import InputSearch from '@components/Inputs/InputSearch'
import { FormProvider, useForm } from 'react-hook-form'
import { Box, Button, Typography } from '@mui/material'
import { useQueryParams } from '@hooks/useQueryParams'
import { useDispatch, useSelector } from 'react-redux'
import StyledTooltip from '@components/StyledTooltip'
import ConfirmDialog from '@components/ConfirmDialog'
import { useEffect, useMemo, useState } from 'react'
import ImageGallery from '@components/ImageGallery'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import BigWarningIcon from '@icons/BigWarningIcon'
import CheckAccess from '@components/CheckAccess'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LeftArrowIcon from '@icons/LeftArrow'
import BigTickIcon from '@icons/BigTickIcon'
import { requests } from '@utils/requests'
import ArrowDown from '@icons/ArrowDown'
import { LoadingButton } from '@mui/lab'
import { useTheme } from '@mui/styles'
import { useQuery } from 'react-query'
import ArrowUp from '@icons/ArrowUp'
import { get } from 'lodash'
import dayjs from 'dayjs'

import ProductDashboard from '../../../products/productDashboard'
import tableHeaderSelector from './tableHeaderSelector'
import FilterMenu from './FilterMenu'

export default function ProductsPage() {
  const theme = useTheme()
  const methods = useForm()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.ostatokByDateTableColumns)
  const { values } = useQueryParams()
  const user_data = useSelector((state) => state.user)
  const [regions, setRegions] = useState([])
  const [appType, setAppType] = useState('ALL')
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(false)
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const [offsetCount, setOffsetCount] = useState(0)
  const [controlleroffset, setControllerOffset] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [openProductDrawer, setOpenProductDrawer] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    setOpenProductDrawer,
    editable: true,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    setOrderStoring,
    orderStoring,
  })
  const routeString = []

  user_data?.role_actions?.forEach((item) => {
    if (item.type == 'TABLE') {
      routeString.push(item.route)
    }
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])

  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])
  const { data: shopList, isFetched: isShopListFetched } = useQuery('shopList', () => requests.getAllStores({ limit: 100, offset: 0 }))

  const productsListFilter = useMemo(() => {
    return {
      date: values?.date || dayjs(new Date()).format('YYYY-MM-DD'),
      limit: values?.limit || 10,
      search: values?.search,
      offset: controlleroffset || 0,
      store_id: values?.store_id || get(shopList, 'data.data.data.0.id'),
    }
  }, [shopList, controlleroffset, orderStoring, values?.limit, values?.search, values?.store_id, values?.date])
  const {
    data: productsList,
    isLoading: productsListLoading,
    isFetching: isFetchingproductsList,
    refetch,
  } = useQuery(['productsList', productsListFilter], () => requests.getOstatokByDateReport(productsListFilter))

  const { data: statusCountList, refetch: fetchStatusCountList } = useQuery(
    ['statusCountList', values?.search, productsListFilter],
    () => requests.getAllProductsStatusCount(productsListFilter),
    { enabled: isShopListFetched }
  )

  useEffect(() => {
    refetch()
  }, [productsListFilter])

  useEffect(() => {
    const count = productsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [productsList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <FormProvider {...methods}>
        <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => navigate(`/reports/product`)}
            >
              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  padding: '0',
                  display: 'flex',
                  mr: '20px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: 'bunker.100',
                  '&:hover': {
                    backgroundColor: 'gray.10',
                  },
                }}
              >
                <LeftArrowIcon />
              </Box>
              <Typography
                onClick={() => navigate('/products/all-by-import')}
                variant='h1'
                fontWeight={700}
                fontSize={'28px'}
                lineHeight={'40px'}
                color={'balck'}
              >
                Остаток на дату по аптекам
              </Typography>
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
                <InputSearch fullWidth id='producrs-search' name='search' placeholder={'Наименование продукта'} uncontrolled />
              </Box>
              <Box width={'20px'} />

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
            </Box>
          </Box>
          <FilterMenu refetch={refetch} setRegions={setRegions} open={filterMenu} setOpen={setFilterMenu} />
          <Box>
            <AgGridTable
              id='products-main-table'
              alwaysShowHorizontalScroll={true}
              tableSettings
              canCellClick={true}
              uniqId='product_id'
              enableFillHandle={true}
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
