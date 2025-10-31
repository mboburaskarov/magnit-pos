import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { downloadLinkExcel } from '../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import LockIcon from '../../../assets/icons/LockIcon'
import PlusIcon from '../../../assets/icons/PlusIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/vendorsTableColumns'
import CreateVendorDrawer from './createVendorDrawer'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function VendorsPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.vendorsTableColumns)
  const { values } = useQueryParams()
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

  const vendorsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: values?.store_id,
      category_id: values?.category_id,
      producer: values?.producer,
      supply_price_to: values?.supply_price_to,
      retail_price_to: values?.retail_price_to,
      region: values?.region_id,
      supply_price_from: values?.supply_price_from,
      retail_price_from: values?.retail_price_from,
    }
  }, [
    values?.offset,
    values?.limit,
    values?.search,
    values?.producer,
    values?.category_id,
    values?.store_id,
    values?.supply_price_to,
    values?.retail_price_to,
    values?.supply_price_from,
    values?.retail_price_from,
  ])
  const {
    data: vendorsList,
    isLoading: vendorsListLoading,
    isFetching: isFetchingvendorsList,
    refetch,
  } = useQuery(['vendorsList', vendorsListFilter], () => requests.getAllVendors(vendorsListFilter))

  const { mutate: deleteVendor, isLoading: isDeletingProduct } = useMutation(requests.deleteVendor, {
    onSuccess: () => {
      refetch()
      success('Продавец удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении продавец!')
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })

  const { mutate: activateVendor, isLoading: isActivatingProduct } = useMutation(requests.activateVendor, {
    onSuccess: () => {
      success('продавец успешно активирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при активации продавеца!')
      refetch()
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })
  const { mutate: deActivateVendor, isLoading: isDeActivatingProduct } = useMutation(requests.deActivateVendor, {
    onSuccess: () => {
      success('продавец успешно деактивирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при деактивации продавеца!')
      refetch()
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [vendorsListFilter])

  useEffect(() => {
    const count = vendorsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [vendorsList?.data, values?.limit])
  const { mutate: vendorsExcelReport, isLoading: isvendorsExcelReport } = useMutation(requests.getVendorsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {t('vendors')}
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
          </Box>
        </Box>
        <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
        <Box>
          <AgGridTable
            id='products-main-table'
            tableSettings
            columns={tableColumns}
            downloadByFilter={() => vendorsExcelReport(vendorsListFilter)}
            fullDownload={() => vendorsExcelReport({ ...vendorsListFilter, offset: 0, limit: 1000000 })}
            isDownloading={isvendorsExcelReport}
            data={vendorsList?.data?.data?.data || []}
            totalCount={vendorsList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingvendorsList || vendorsListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Сотрудники недоступен',
              description: 'Если вы не можете найти искомый Сотрудники, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingvendorsList || vendorsListLoading}
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

      <CreateVendorDrawer
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
