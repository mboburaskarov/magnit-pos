import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/storeTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
// import ProductDrawer from './ProductDrawer'
import { useTheme } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '../../../../components/CheckAccess'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import PlusIcon from '../../../assets/icons/PlusIcon'
import CreateLocationDrawer from './createLocationDrawer'
const SELECTION_ID = 'checkboxSelectionField'

export default function ProductsPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.storeTableColumns)
  const { values } = useQueryParams()
  const [status, setStatus] = useState('ALL')
  const [regions, setRegions] = useState([])
  const [appType, setAppType] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [rejectComment, setRejectComment] = useState(null)
  const [filterMenu, setFilterMenu] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [openCreateLocationDrawer, setopenCreateLocationDrawer] = useState(false)

  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    setopenCreateLocationDrawer,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    setIsDrawerOpen,
  })

  /// filter table columns with permission
  useEffect(() => {
    console.log(columns)

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

  const storesListFilter = useMemo(() => {
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
    data: storesList,
    isLoading: storesListLoading,
    isFetching: isFetchingstoresList,
    refetch,
  } = useQuery(['storesList', storesListFilter], () => requests.getAllStores(storesListFilter))

  const { mutate: deleteStore, isLoading: isDeletingProduct } = useMutation(requests.deleteStore, {
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
  }, [storesListFilter])

  useEffect(() => {
    const count =
      // status === 'ACTIVE'
      //   ? storesList?.data?.active
      //   : status === 'INACTIVE'
      //   ? storesList?.data?.inactive
      //   : status === 'INACTIVE_BY_VENDOR'
      //   ? storesList?.data?.inactiveByVendor
      //   : status === 'BLOCKED'
      //   ? storesList?.data?.blocked
      // : storesList?.data.totalCount
      storesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [storesList?.data, values?.limit, status])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Магазины
        </Typography>

        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'}>
            <Box
              width='100%'
              sx={{
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '400px',
                  height: 48,
                },
              }}
            >
              <InputSearch id='producrs-search' name='search' placeholder={'Поиск по таблице'} uncontrolled />
            </Box>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                changeColumnSequence={changeColumnSequence}
                resetTableHeader={resetTableHeader}
              />
            </Box>
            <CheckAccess id={'product-create'}>
              <Box minWidth={156}>
                <Button
                  sx={{ height: '48px' }}
                  onClick={() => setopenCreateLocationDrawer({ mode: 'create' })}
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
        <Box>
          <AgGridTable
            id='products-main-table'
            tableSettings
            columns={tableColumns}
            data={storesList?.data?.data?.data || []}
            isDataLoading={isFetchingstoresList || storesListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            status={status}
            isRefreshing={loading || isFetchingstoresList || storesListLoading}
          />
        </Box>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={
            openConfirmDialog?.type === 'activate'
              ? 'Активировать магазин?'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Деактивировать магазин?'
              : 'Удалить магазин?'
          }
          desc={
            openConfirmDialog?.type === 'activate'
              ? 'Вы действительно хотите активировать магазин, вы не можете вернуть этот прогресс после активации.'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Вы действительно хотите деактивировать магазин, вы не можете вернуть этот прогресс после деактивации.'
              : 'хотите удалить свой магазин?'
          }
          supDesc={openConfirmDialog.name}
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
                    ? deActivateProduct({ id: openConfirmDialog.id, status: 'INACTIVE' })
                    : deleteStore(openConfirmDialog.id)
                }
              >
                Да, удалить
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
      <CreateLocationDrawer
        refetchVendorList={refetch}
        setCustomerId={'setCustomerId'}
        quickCreateClientName={'quickCreateClientName'}
        openDrawer={openCreateLocationDrawer}
        closeDrawer={() => setopenCreateLocationDrawer(false)}
        clientData={'clientDetails'}
      />
    </LoadingContainer>
  )
}
