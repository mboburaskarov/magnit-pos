import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '@components/ConfirmDialog'
import ImageGallery from '@components/ImageGallery'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import BigTickIcon from '@icons/BigTickIcon'
import BigWarningIcon from '@icons/BigWarningIcon'
import DeleteIcon from '@icons/DeleteIcon'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import LockIcon from '@icons/LockIcon'
import PlusIcon from '@icons/PlusIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/employeesTableColumns'
import CreateEmployeeDrawer from './CreateEmployeeDrawer'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import CheckAccess from '@components/CheckAccess'

export default function EmployeesPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.employeesTableColumns)
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
      const formattedData = makeFormattedData({ tableColumns })

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const employeesListFilter = useMemo(() => {
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
    data: employeesList,
    isLoading: employeesListLoading,
    isFetching: isFetchingemployeesList,
    refetch,
  } = useQuery(['employeesList', employeesListFilter], () => requests.getAllVendors(employeesListFilter))

  const { mutate: deleteEmployee, isLoading: isDeletingEmployee } = useMutation(requests.deleteVendor, {
    onSuccess: () => {
      refetch()
      success('Сотрудники удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении Сотрудники!')
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })

  const { mutate: activateEmployee, isLoading: isActivatingEmployee } = useMutation(requests.activateVendor, {
    onSuccess: () => {
      success('Сотрудники успешно активирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при активации Сотрудники!')
      refetch()
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })
  const { mutate: deActivateEmployee, isLoading: isDeActivatingEmployee } = useMutation(requests.deActivateVendor, {
    onSuccess: () => {
      success('Сотрудники успешно деактивирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при деактивации Сотрудники!')
      refetch()
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [employeesListFilter])

  useEffect(() => {
    const count = employeesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [employeesList?.data, values?.limit])
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
                    onClick={() => deleteEmployee({ data: slectedVendors })}
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
            <CheckAccess id={'employee:create'}>
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
            </CheckAccess>
          </Box>
        </Box>
        <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
        <Box>
          <AgGridTable
            id='employee-table'
            tableSettings
            columns={tableColumns}
            downloadByFilter={() => vendorsExcelReport(employeesListFilter)}
            fullDownload={() => vendorsExcelReport({ ...employeesListFilter, offset: 0, limit: 1000000 })}
            isDownloading={isvendorsExcelReport}
            data={employeesList?.data?.data?.data || []}
            totalCount={employeesList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingemployeesList || employeesListLoading}
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
            isRefreshing={loading || isFetchingemployeesList || employeesListLoading}
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
                loading={isDeletingEmployee || isActivatingEmployee || isDeActivatingEmployee}
                onClick={() =>
                  openConfirmDialog?.type === 'activate'
                    ? activateEmployee([openConfirmDialog.id])
                    : openConfirmDialog?.type === 'deactivate'
                    ? deActivateEmployee([openConfirmDialog.id])
                    : deleteEmployee({ data: [openConfirmDialog.id] })
                }
              >
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}

      <CreateEmployeeDrawer
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
