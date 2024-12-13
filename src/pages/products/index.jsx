import { Box, Button, TextField, Typography } from '@mui/material'
import TabContainer from '../../../components/Tab/TabContainer'
import LoadingContainer from '../../../components/LoadingContainer'
import { useEffect, useMemo, useState } from 'react'
import { products_statuses } from '../../assets/data/products-statuses'
import { useQueryParams } from '../../hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import { useDispatch, useSelector } from 'react-redux'
import tableHeaderSelector from './tableHeaderSelector'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../redux-toolkit/tableSlices/productsTableColumns'
import InputSearch from '../../../components/Inputs/InputSearch'
import ImageGallery from '../../../components/ImageGallery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownWideShort, faArrowUpWideShort, faPlus } from '@fortawesome/free-solid-svg-icons'
import FilterMenu from './FilterMenu'
import { useNavigate } from 'react-router-dom'
import { error, success } from '../../../utils/toast'
import ConfirmDialog from '../../../components/ConfirmDialog'
import BigWarningIcon from '../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import BigTickIcon from '../../assets/icons/BigTickIcon'
import ProductDrawer from './ProductDrawer'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import CheckAccess from '../../../components/CheckAccess'
import StyledDialog from '../../../components/Dialogs/StyledDialog'
import FilterMenuIcon from '../../assets/icons/FilterMenuIcon'
import PlusIcon from '../../assets/icons/PlusIcon'
import EditorIcon from '../../assets/icons/EditorIcon'
import FilterTableRowsMenu from './FilterTableRowsMenu'
import ColumnsFilterButton from '../../../components/AgGridTable/ColumnsFilterButton'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/styles'
const SELECTION_ID = 'checkboxSelectionField'

export default function ProductsPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.productsTableColumns)
  const { values } = useQueryParams()
  const [status, setStatus] = useState('ALL')
  const [regions, setRegions] = useState([])
  const [appType, setAppType] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [rejectComment, setRejectComment] = useState(null)
  const [filterMenu, setFilterMenu] = useState(false)
  const [filterTableRowsMenu, setFilterTableRowsMenu] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    setIsDrawerOpen,
  })

  /// filter table columns with permission
  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID && el.field !== 'category')
        ?.map((el) => ({
          ...el,
          label: el.headerName,
          desc: el.desc,
          name: el.colId,
          always_active: el?.always_active ?? el?.always_active,
        }))

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const productsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: values?.search,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      store_id: values?.store_id,
      category_id: values?.category_id,
      producer: values?.producer,
      supply_price_to: values?.supply_price_to,
      retail_price_to: values?.retail_price_to,
      region: values?.region_id,
      supply_price_from: values?.supply_price_from,
      retail_price_from: values?.retail_price_from,
      isExpress: values?.isExpress,
      ...(status !== 'ALL' && { status }),
      ...(appType !== 'ALL' && { type: appType }),
    }
  }, [
    status,
    appType,
    values?.offset,
    values?.limit,
    values?.search,
    values?.producer,
    values?.category_id,
    values?.shop_id,
    values?.supply_price_to,
    values?.retail_price_to,
    values?.supply_price_from,
    values?.retail_price_from,
    values?.region_id,
    values?.isExpress,
    regions,
  ])
  const {
    data: productsList,
    isLoading: productsListLoading,
    isFetching: isFetchingproductsList,
    refetch,
  } = useQuery(['productsList', productsListFilter], () => requests.getAllProducts(productsListFilter))

  const { mutate: deleteProduct, isLoading: isDeletingProduct } = useMutation(requests.deleteProduct, {
    onSuccess: () => {
      refetch()
      success('Продукт успешно удален!')
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении товара!')
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })

  const { mutate: rejectProduct } = useMutation(requests.rejectProduct, {
    onSuccess: () => {
      refetch()
      success('Продукт успешно отклонен!')
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
      setRejectComment(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении отклонен!')
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })
  const { mutate: activateProduct, isLoading: isActivatingProduct } = useMutation(requests.activateProduct, {
    onSuccess: () => {
      success('Продукт успешно активирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при активации продукта!')
      refetch()
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })
  const { mutate: deActivateProduct, isLoading: isDeActivatingProduct } = useMutation(requests.changeProductStatus, {
    onSuccess: () => {
      success('Продукт успешно деактивирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при деактивации продукта!')
      refetch()
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [productsListFilter])

  useEffect(() => {
    const count =
      // status === 'ACTIVE'
      //   ? productsList?.data?.active
      //   : status === 'INACTIVE'
      //   ? productsList?.data?.inactive
      //   : status === 'INACTIVE_BY_VENDOR'
      //   ? productsList?.data?.inactiveByVendor
      //   : status === 'BLOCKED'
      //   ? productsList?.data?.blocked
      // : productsList?.data.totalCount
      productsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [productsList?.data, values?.limit, status])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {t('page.catalog.title')}
        </Typography>
        {/* <Box display='flex' mb={3} mt={4}>
          <TabContainer
            customTooltip
            tabs={products_statuses?.map((el) => ({ label: el.name, id: el.id }))}
            counts={[
              productsList?.data?.totalCount,
              productsList?.data?.active,
              productsList?.data?.inactive,
              productsList?.data?.inactiveByVendor,
              productsList?.data?.blocked,
              productsList?.data?.rejected,
            ]}
            selected={status}
            setSelected={setStatus}
          />
        </Box> */}
        <Box minWidth={320}>
          <InputSwitch
            uncontrolled
            id='app-type'
            name='app-type'
            value={appType}
            defaultValue='ALL'
            onChange={(e) => setAppType(e)}
            options={[
              { title: t('switch.title.all'), value: 'ALL' },
              { title: t('switch.title.medicine'), value: 'medicine' },
              { title: t('switch.title.vitamin'), value: 'vitamin' },
              { title: t('switch.title.self_care'), value: 'self_care' },
              { title: t('switch.title.baby_care'), value: 'baby_care' },
              { title: t('switch.title.diagnostic'), value: 'diagnostic' },
              { title: t('switch.title.medical_supplies'), value: 'medical_supplies' },
            ]}
          />
        </Box>
        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'}>
            <Box
              width='100%'
              sx={{
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  // border: '2px solid transparent',

                  width: '400px',
                  height: 48,
                },
              }}
            >
              <InputSearch id='producrs-search' name='search' placeholder={t('input.search.product.multi')} uncontrolled />
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
            <Box
            // onClick={() => setFilterTableRowsMenu(true)}
            >
              {/* <EditorIcon /> */}
              <ColumnsFilterButton title={t('ag_grid.table_setting.label')} columns={tableColumns} isCatalog={false} />
            </Box>
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
        <FilterMenu setRegions={setRegions} open={filterMenu} setOpen={setFilterMenu} />
        <FilterTableRowsMenu tableColumns={tableColumns} open={filterTableRowsMenu} setOpen={setFilterTableRowsMenu} />
        <Box>
          <AgGridTable
            id='products-main-table'
            tableSettings
            columns={tableColumns}
            data={productsList?.data?.data?.data || []}
            isDataLoading={isFetchingproductsList || productsListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            status={status}
            isRefreshing={loading || isFetchingproductsList || productsListLoading}
          />
        </Box>
      </Box>
      <ProductDrawer
        setOpenConfirmDialog={setOpenConfirmDialog}
        setImages={setOpenImageGallery}
        refetch={refetch}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(null)}
        setRejectComment={setRejectComment}
      />
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
              : 'mahsulotini o’chirmoqchimisiz?'
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
                Yo'q
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isDeletingProduct || isActivatingProduct || isDeActivatingProduct}
                onClick={() =>
                  openConfirmDialog?.type === 'activate'
                    ? activateProduct(openConfirmDialog.id)
                    : openConfirmDialog?.type === 'deactivate'
                    ? deActivateProduct({ id: openConfirmDialog.id, status: 'INACTIVE' })
                    : deleteProduct(openConfirmDialog.id)
                }
              >
                Ha, o'chirish
              </LoadingButton>
            </>
          }
        />
      )}
      <StyledDialog
        open={!!rejectComment?.id}
        title={'Причину отклонения'}
        buttonLabel={'Сохранить'}
        customOnSubmit={() => {
          if (rejectComment.comment && rejectComment.id) {
            rejectProduct({
              id: rejectComment.id,
              rejectedComment: rejectComment.comment,
            })
          }
        }}
        onClose={() => setRejectComment(null)}
      >
        {rejectComment && (
          <Box p={7} pt={5}>
            <TextField
              multiline
              onChange={(e) => setRejectComment((p) => ({ ...p, comment: e.target.value }))}
              fullWidth
              placeholder='Введите причину отклонения'
            />
          </Box>
        )}
      </StyledDialog>
    </LoadingContainer>
  )
}
