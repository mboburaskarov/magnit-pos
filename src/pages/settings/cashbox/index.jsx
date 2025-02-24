import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '../../../../components/CheckAccess'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import LockIcon from '../../../assets/icons/LockIcon'
import PlusIcon from '../../../assets/icons/PlusIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/cashboxTableColumns'
import CreateCashBoxDrawer from './CreateCashBoxDrawer'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function CashBoxsPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.cashboxTableColumns)
  const { values } = useQueryParams()
  const [regions, setRegions] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [openCreateVendorDrawer, setopenCreateVendorDrawer] = useState(false)

  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [slectedVendors, setSelectedVendors] = useState([])
  const selectVendors = (isChecked, id) => {
    if (isChecked) {
      setSelectedVendors((p) => [...p, id])
    } else {
      setSelectedVendors((p) => p.filter((ids) => ids !== id))
    }
  }

  const tableColumns = tableHeaderSelector({
    vendorsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    selectVendors,
    setopenCreateVendorDrawer,
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

  const cashboxListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      search: values?.search,
      offset: values?.search ? 0 : values?.offset || 0,
      store_id: values?.store_id,
    }
  }, [values?.offset, values?.limit, values?.search, values?.store_id])
  const {
    data: cashboxList,
    isLoading: cashboxListLoading,
    isFetching: isFetchingcashboxList,
    refetch,
  } = useQuery(['cashboxList', cashboxListFilter], () => requests.getAllCashBoxList(cashboxListFilter))

  const { mutate: deleteCashBox, isLoading: isDeletingProduct } = useMutation(requests.deleteCashBox, {
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

  const { mutate: activateProduct, isLoading: isActivatingProduct } = useMutation(requests.activateVendor, {
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
  const { mutate: deActivateProduct, isLoading: isDeActivatingProduct } = useMutation(requests.deActivateVendor, {
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
  }, [cashboxListFilter])

  useEffect(() => {
    const count = cashboxList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [cashboxList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Кассы
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
              <InputSearch id='producrs-search' name='search' placeholder={'ID, имя, телефон'} uncontrolled />
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
                startIcon={<FilterMenuIcon />}
                variant='contained'
                color='secondary'
                onClick={() => setFilterMenu((prev) => !prev)}
              >
                <Typography fontWeight={600} fontSize={'16px'} lineHeight={'25px'}>
                  {t('filter_dialog.label')}
                </Typography>
              </Button>
            </Box>
            {slectedVendors.length > 0 && (
              <>
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
                    onClick={() => deleteCashBox({ data: slectedVendors })}
                  >
                    <DeleteIcon width='24px' />
                  </Button>
                </Box>
              </>
            )}
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
            {/* <CheckAccess id={'product-create'}> */}
            <Box minWidth={156}>
              <Button
                sx={{ height: '48px' }}
                onClick={() => setopenCreateVendorDrawer({ mode: 'add' })}
                fullWidth
                startIcon={<PlusIcon color='#fff' />}
                variant='contained'
                color='primary'
              >
                {t('button.add_new.text')}
              </Button>
            </Box>
            {/* </CheckAccess> */}
          </Box>
        </Box>
        <FilterMenu setRegions={setRegions} open={filterMenu} setOpen={setFilterMenu} />
        <Box>
          <AgGridTable
            id='products-main-table'
            tableSettings
            columns={tableColumns}
            data={cashboxList?.data?.data?.data || []}
            totalCount={cashboxList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingcashboxList || cashboxListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            emptyTableText={{
              title: 'Касса недоступен',
              description: 'Если вы не можете найти искомый Касса, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingcashboxList || cashboxListLoading}
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
                    ? activateProduct([openConfirmDialog.id])
                    : openConfirmDialog?.type === 'deactivate'
                    ? deActivateProduct([openConfirmDialog.id])
                    : deleteCashBox({ data: [openConfirmDialog.id] })
                }
              >
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}

      <CreateCashBoxDrawer
        refetchVendorList={refetch}
        setCustomerId={'setCustomerId'}
        quickCreateClientName={'quickCreateClientName'}
        openDrawer={openCreateVendorDrawer}
        closeDrawer={() => setopenCreateVendorDrawer(false)}
        clientData={'clientDetails'}
      />
    </LoadingContainer>
  )
}
