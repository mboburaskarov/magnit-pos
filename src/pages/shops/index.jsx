import { Box, Button, Typography } from '@mui/material'
import TabContainer from '../../../components/Tab/TabContainer'
import LoadingContainer from '../../../components/LoadingContainer'
import { useEffect, useMemo, useState } from 'react'
import { useQueryParams } from '../../hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import AgGridTable from '../../../components/AgGridTable/AgGridTable'
import { useDispatch, useSelector } from 'react-redux'
import tableHeaderSelector from './tableHeaderSelector'
import { resetTableHeader, updateTableHeader } from '../../redux-toolkit/tableSlices/shopTableColumns'
import InputSearch from '../../../components/Inputs/InputSearch'
import ImageGallery from '../../../components/ImageGallery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { error, success } from '../../../utils/toast'
import ConfirmDialog from '../../../components/ConfirmDialog'
import BigWarningIcon from '../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import BigTickIcon from '../../assets/icons/BigTickIcon'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ShopDrawer from './ShopDrawer'
import { shop_statuses } from '../../assets/data/shop-statuses'
import CheckAccess from '../../../components/CheckAccess'
import InputSwitch from '../../../components/Inputs/InputSwitch'
import LazySelect from '../../../components/Select/LazySelect'
import BillzDrawer from './BillzDrawer'

export default function ShopsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.shopTableColumns)
  const { values } = useQueryParams()
  const [status, setStatus] = useState('ALL')
  const [regions, setRegions] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [appType, setAppType] = useState('ALL')
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [isOpenBillzDialog, setOpenBillzDialog] = useState(false)

  // eslint-disable-next-line no-unused-vars

  const tableColumns = tableHeaderSelector({
    shopsColumns: columns,
    setImages: setOpenImageGallery,
    navigate,
    setOpenConfirmDialog,
    setIsDrawerOpen,
    setOpenBillzDialog,
    isOpenBillzDialog,
  })

  const shopListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      searchText: values?.search,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      ...(appType !== 'ALL' && { type: appType }),
      ...(status !== 'ALL' && { status }),
    }
  }, [status, values?.offset, values?.limit, values?.search, appType, regions])

  const {
    data: shopList,
    isLoading: shopListLoading,
    isFetching: isFetchingShopList,
    refetch,
  } = useQuery(['shopList', shopListFilter], () => requests.getAllShops(shopListFilter))

  const { mutate: deleteShop, isLoading: isDeletingShop } = useMutation(requests.deleteShop, {
    onSuccess: () => {
      refetch()
      success('Магазин успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении магазина!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })
  const { mutate: changeShopStatus, isLoading: isChangingShopStatus } = useMutation(requests.changeShopStatus, {
    onSuccess: () => {
      success('Статус магазина успешно изменен!')
      setTimeout(() => {
        refetch()
      }, 500)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при обновлении статуса магазина!')
      refetch()
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [shopListFilter])

  useEffect(() => {
    const count =
      status === 'ACTIVE'
        ? shopList?.data?.active
        : status === 'INACTIVE'
        ? shopList?.data?.inactive
        : status === 'BLOCKED'
        ? shopList?.data?.blocked
        : shopList?.data.totalCount

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [shopList?.data, values?.limit, status])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Typography variant='h1'>Магазины</Typography>
        <Box display='flex' mb={3} mt={4}>
          <TabContainer
            customTooltip
            tabs={shop_statuses?.map((el) => ({ label: el.name, id: el.id }))}
            counts={[shopList?.data?.totalCount, shopList?.data?.active, shopList?.data?.inactive, shopList?.data?.blocked]}
            selected={status}
            setSelected={setStatus}
          />
        </Box>
        <Box columnGap={2} display='inline-flex' width='100%'>
          <Box width='100%'>
            <InputSearch fullWidth id='shop-search' name='shop-search' placeholder='Введите информацию о магазине для поиска' uncontrolled />
          </Box>
          <Box mt={-2} minWidth={320}>
            <InputSwitch
              uncontrolled
              id='app-type'
              name='app-type'
              value={appType}
              defaultValue='ALL'
              onChange={(e) => setAppType(e)}
              options={[
                { title: 'Все', value: 'ALL' },
                { title: 'Букеты', value: 'BUCHET' },
                { title: 'Подарки', value: 'MARKET' },
              ]}
            />
          </Box>
          <Box width={'50%'}>
            <LazySelect
              slug='regions'
              placeholder={'Выберите регион'}
              minWidth='auto'
              isMulti
              value={regions}
              onChange={setRegions}
              filterOption={(e) => {
                const isSelected = regions?.find((item) => item?._id === e?.data?._id)
                console.log(isSelected, 'regions popa')
                if (!isSelected) {
                  return e
                }
              }}
              request={requests.getAllRegions}
              filters={{ limit: 100 }}
              uncontrolled
              getOptionLabel={(option) => option?.nameRu || option?.nameUz || option?.nameEn || ''}
              getOptionValue={(option) => option?._id}
            />
          </Box>
          <CheckAccess id='shop-create'>
            <Box minWidth={156}>
              <Button
                onClick={() => navigate('/shops/create')}
                fullWidth
                startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                variant='contained'
                color='primary'
              >
                Создать
              </Button>
            </Box>
          </CheckAccess>
        </Box>
        <Box>
          <AgGridTable
            id='shop-main-table'
            tableSettings
            columns={tableColumns}
            data={shopList?.data?.shops || []}
            isDataLoading={isFetchingShopList || shopListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            status={status}
            isRefreshing={loading || isFetchingShopList || shopListLoading}
          />
        </Box>
      </Box>
      <ShopDrawer setOpenConfirmDialog={setOpenConfirmDialog} setImages={setOpenImageGallery} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(null)} />
      <BillzDrawer
        setOpenConfirmDialog={setOpenBillzDialog}
        setImages={setOpenImageGallery}
        isOpen={isOpenBillzDialog}
        setOpenBillzDialog={setOpenBillzDialog}
      />
      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={
            openConfirmDialog?.type === 'activate'
              ? 'Активировать магазин?'
              : openConfirmDialog?.type === 'blocked'
              ? 'Блокировать магазина?'
              : 'Удалить магазин?'
          }
          desc={
            openConfirmDialog?.type === 'activate'
              ? 'Вы действительно хотите активировать магазин, вы не можете вернуть этот прогресс после активации.'
              : openConfirmDialog?.type === 'blocked'
              ? 'Вы действительно хотите блокировать магазин, вы не можете вернуть этот прогресс после блокировки.'
              : 'Вы действительно хотите удалить магазин, вы не можете вернуть этот прогресс, после удаления вы не сможете восстановить магазин.'
          }
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isDeletingShop || isChangingShopStatus}
                onClick={() =>
                  openConfirmDialog?.type === 'activate'
                    ? changeShopStatus({ id: openConfirmDialog.id, status: 'ACTIVE' })
                    : openConfirmDialog?.type === 'blocked'
                    ? changeShopStatus({ id: openConfirmDialog.id, status: 'BLOCKED' })
                    : deleteShop(openConfirmDialog.id)
                }
              >
                Да
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
