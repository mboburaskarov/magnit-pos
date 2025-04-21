import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import ImageGallery from '../../../../components/ImageGallery'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import MultiOptionSelectNew from '../../../../components/Select/MultiOptionSelectNew'
import SelectSimple from '../../../../components/Select/SelectSimple'
import { downloadExcel } from '../../../../utils/downloadEXCEL'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import LockIcon from '../../../assets/icons/LockIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/sellerBonusTableColumns'
import FilterMenu from '../../clients/FilterMenu'
import SaleDrawer from './saleDrawer'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'
export default function SellerBonus() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))
  const [selectedShops, setSelectedShops] = useState('all')
  const { columns, loading } = useSelector((state) => state.sellerBonusTableColumns)
  const { values } = useQueryParams()
  const [regions, setRegions] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState()
  const [selectedBonusType, setSelectedBonusType] = useState({ id: 'default', name: 'По умолчанию' })
  const [filterMenu, setFilterMenu] = useState(false)
  const [openSaleDrawer, setOpenSaleDrawer] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [slectedVendors, setSelectedVendors] = useState([])
  const sortTypes = [
    { id: 'default', name: 'По умолчанию' },
    { id: 'max_amount', name: 'Топ продажи сум' },
    { id: 'min_amount', name: 'Мин продажи сум' },
    { id: 'max_count', name: 'Больше продаж шт' },
    { id: 'min_count', name: 'Меньше продаж шт' },
  ]
  const tableColumns = tableHeaderSelector({
    vendorsColumns: columns,
    t,
    setOpenSaleDrawer,
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

  const sellerBonnusFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      store_id: values?.store_id,
      order: selectedBonusType == 'default' ? undefined : selectedBonusType?.id,
      start_date: values?.start_date || dayjs().format('YYYY-MM-DD'),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
    }
  }, [values?.offset, selectedBonusType, selectedShops, values?.limit, values?.search, values?.store_id, values?.start_date, values?.end_date])
  const {
    data: sellerBonnus,
    isLoading: sellerBonnusLoading,
    isFetching: isFetchingsellerBonnus,
    refetch,
  } = useQuery(['sellerBonnus', sellerBonnusFilter], () =>
    requests.getSellerBonus(sellerBonnusFilter, selectedShops == 'all' ? get(shopList, 'data.data.ids', []) : selectedShops.map(({ id }) => id))
  )

  useEffect(() => {
    refetch()
  }, [sellerBonnusFilter])

  useEffect(() => {
    const count = sellerBonnus?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [sellerBonnus?.data, values?.limit])
  const { mutate: sellerBonusExcelReport, isLoading: issellerBonusExcelReport } = useMutation(requests.getsellerBonusExcelReport, {
    onSuccess: ({ data }) => {
      downloadExcel(data, 'Бонусах продавца')
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {'Отчет: бонусах продавца '}
        </Typography>

        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'}>
            <Box
              width='100%'
              sx={{
                mr: '10px',
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '450px',
                  height: 48,
                },
              }}
            >
              <InputSearch fullWidth id='producrs-search' name='search' placeholder={'ID, имя, телефон'} uncontrolled />
            </Box>

            {/* <Box mr={'10px'} minWidth={113}>
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
                startIcon={<FilterMenuIcon />}
                variant='contained'
                color='secondary'
                onClick={() => setFilterMenu((prev) => !prev)}
              >
                <Typography fontWeight={600} fontSize={'16px'} lineHeight={'25px'}>
                  {t('filter_dialog.label')}
                </Typography>
              </Button>
            </Box> */}
            {slectedVendors.length > 0 && (
              <>
                <Box ml={'16px'}>
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
                    variant='contained'
                    color='secondary'
                    onClick={() => deActivateVendor(slectedVendors)}
                  >
                    <LockIcon color='#111217' />
                  </Button>
                </Box>
                <Box minWidth={48} ml={'16px'}>
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
                    variant='contained'
                    color='secondary'
                    onClick={() => deleteVendor({ data: slectedVendors })}
                  >
                    <DeleteIcon width='24px' />
                  </Button>
                </Box>
              </>
            )}
          </Box>
          <SelectSimple
            name='customer_id'
            placeholder={t('placeholders.enterSortType')}
            isClearable={false}
            options={sortTypes}
            small
            beforeContent={t('placeholders.SortType')}
            minWidth='185px'
            white
            maxWidth={'255px'}
            isSearchable={false}
            uncontrolled
            value={selectedBonusType}
            onChange={(e) => setSelectedBonusType(e)}
          />
          <Box
            width={956}
            display={'flex'}
            sx={{
              '& .select': {
                width: '175px !important',
              },
            }}
          >
            <DateRangeInput minHeight={'48px'} id='accounting-report-date-range' />
            <Box width={'15px'} />
            <MultiOptionSelectNew
              zIndex={999}
              placeholder={t('placeholders.select_shops')}
              // fullWidth
              multiple
              defaultSelectedAll
              // minWidth='auto'
              beforeContent={t('placeholders.select_shops')}
              value={selectedShops}
              allOptions={get(shopList, 'data.data.ids', [])}
              selectAllLabel={t('Все филиалы')}
              options={get(shopList, 'data.data.data', [])}
              isLoading={false}
              onChange={(val) => {
                setSelectedShops(val)
              }}
              request={requests.getAllStores}
            />
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
          </Box>
        </Box>
        <FilterMenu setRegions={setRegions} open={filterMenu} setOpen={setFilterMenu} />
        <Box>
          <AgGridTable
            id='products-main-table'
            tableSettings
            columns={tableColumns}
            downloadByFilter={() => sellerBonusExcelReport(sellerBonnusFilter)}
            fullDownload={() => sellerBonusExcelReport({ ...sellerBonnusFilter, limit: 1000000 })}
            isDownloading={issellerBonusExcelReport}
            data={sellerBonnus?.data?.data?.data || []}
            totalCount={sellerBonnus?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingsellerBonnus || sellerBonnusLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Бонусах продавца',
              description: 'Если вы не можете найти искомый бонусах продавца, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingsellerBonnus || sellerBonnusLoading}
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
              ? 'Активировать сотрудника?'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Деактивировать сотрудника?'
              : 'Удалить сотрудника?'
          }
          desc={
            openConfirmDialog?.type === 'activate'
              ? 'Вы действительно хотите активировать сотрудника, но после активации вы не сможете отменить процесс.'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Вы уверены, что хотите удалить сотрудника? После удаления вы не сможете отменить процесс.'
              : 'вы хотите удалить?'
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
                    ? activateVendor([openConfirmDialog.id])
                    : openConfirmDialog?.type === 'deactivate'
                    ? deActivateVendor([openConfirmDialog.id])
                    : deleteVendor({ data: [openConfirmDialog.id] })
                }
              >
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
      <SaleDrawer ids={[].map(({ id }) => id)} open={openSaleDrawer} setOpen={setOpenSaleDrawer} />
    </LoadingContainer>
  )
}
