// import { Box, Button } from '@mui/material'
// import { useEffect, useMemo, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import { useMutation, useQuery } from 'react-query'
// import { useDispatch } from 'react-redux'
// import ConfirmDialog from '../../../../../components/ConfirmDialog'
// import InputSearch from '../../../../../components/Inputs/InputSearch'
// import { requests } from '../../../../../utils/requests'
// import { error, success } from '../../../../../utils/toast'
// import BigWarningCircleIcon from '../../../../assets/icons/BigWarningCircleIcon'
// import PlusIcon from '../../../../assets/icons/PlusIcon'
// import useDebouncedValue from '../../../../hooks/useDebouncedValue'
// import { useQueryParams } from '../../../../hooks/useQueryParams'
import CrreatePaymentAssetDrawer from '../CrreatePaymentAssetDrawer'
// import tableHeadersActions from './tableHeadersActions'

// export default function PaymentsAssetsList() {
//   const queryParams = useQueryParams()
//   const { t } = useTranslation()
//   const { values } = useQueryParams()
//   const dispatch = useDispatch()
//   const [type, setType] = useState('categories')
//   const [status, setStatus] = useState('')
//   const [categoryDrawer, setCategoryDrawer] = useState(false)
//   const [createEdit, setCreateEdit] = useState(null)
//   const [openConfirm, setOpenConfirm] = useState(null)
//   const [searchTerm, setSearchTerm, debouncedSearchTerm] = useDebouncedValue('', 300)
//   const [confirmToDelete, setConfirmToDelete] = useState(false)
//   const [offsetCount, setOffsetCount] = useState(0)
//   const [openCreatePermission, setOpenCreatePermission] = useState(false)
//   const categoryFilter = useMemo(() => {
//     return {
//       limit: values?.limit || 10,
//       search: values?.search,
//       search: searchTerm,
//       offset: values?.search ? 0 : values?.offset || 0,
//     }
//   }, [values?.offset, searchTerm, values?.limit, values?.search])
//   const {
//     data: categories,
//     refetch: categoriesRefetch,
//     isLoading: categoriesLoading,
//     isFetching: categoriesFetching,
//   } = useQuery(['categories', categoryFilter], () => requests.getAllRolesWithPermissionsLikeCategorySchema(categoryFilter))

//   const { mutate: deleteCategory, isLoading: isdeleteCategory } = useMutation(requests.deletePermission, {
//     onSuccess: () => {
//       categoriesRefetch()
//       success('Категори успешно создан!')
//     },
//     onError: (err) => {
//       error('Ошибка при создании Категори!')
//       console.log('err', err)
//     },
//   })

//   useEffect(() => {
//     const count = categories?.data?.data?._meta?.total_count

//     const offsetsCount = Math.ceil(count / Number(values?.limit))
//     setOffsetCount(offsetsCount || 0)

//     // refetchAll()
//   }, [categories?.data, queryParams?.values?.search, queryParams?.values?.limit, queryParams?.values?.page])

//   const columnsCategories = tableHeadersActions(searchTerm, setCategoryDrawer, setOpenCreatePermission, status, type, setOpenConfirm, t, setConfirmToDelete)

//   const columns = columnsCategories

//   function renameSubRows(obj) {
//     if (obj.children || obj.children === 'null') {
//       obj.subRows = obj.children
//       delete obj.children

//       obj.subRows.forEach(renameSubRows) // Recurse through sub_category if exists
//     }
//     return obj
//   }

//   const tableData = categories?.data?.map((e) => renameSubRows(e))

//   const tableLoading = categoriesLoading || categoriesFetching

//   return (
//     <>
//       <Box pt={6} px={4} pb={3}>
//         <Box display='flex' width='100%' mb={3} mt={4}>
//           <Box flex='1 0 30%' mr={1}>
//             <InputSearch
//               name='search'
//               placeholder={t('input.search.product')}
//               fullWidth
//               onChange={(e) => setSearchTerm(e.target.value)}
//               value={searchTerm}
//               setSearchTerm={setSearchTerm}
//             />
//           </Box>
//           <Box flex='0 0 10%' minWidth={256}>
//             <Button
//               id='create'
//               adornmentStart={<PlusIcon fill='#fff' />}
//               primary
//               onClick={() => setOpenCreatePermission(true)}
//               style={{ minWidth: 256, height: '48px' }}
//             >
//               Новая ключ
//             </Button>
//           </Box>
//         </Box>
//         {/* <PaginationTable
//           isExpendable
//           customTablePadding='8px 14px'
//           defaultPageSize={10}
//           columns={columns}
//           isDataLoading={tableLoading}
//           data={tableData}
//           pageCount={offsetCount}
//           navigateUrl='/settings/actions'
//           noDataTitle={t('titles.data_not_found')}
//           withHover
//         /> */}
//       </Box>
//       {/* <CreateEditCategories
//         withoutNavigate
//         refetch={categoriesRefetch}
//         open={!!createEdit}
//         editId={createEdit?.parentId}
//         focusId={createEdit?.id}
//         closeDrawer={() => setCreateEdit(false)}
//       /> */}

//       <CrreatePaymentAssetDrawer categoriesRefetch={categoriesRefetch} isOpen={openCreatePermission} onClose={() => setOpenCreatePermission(null)} />

//       <ConfirmDialog
//         open={!!confirmToDelete}
//         setOpen={setConfirmToDelete}
//         icon={<BigWarningCircleIcon />}
//         title={t('menu.finance.categories.delete_subcattegory.title')}
//         desc={t('menu.finance.categories.delete_subcattegory.desc')}
//         actions={
//           <>
//             <Button variant='contained' id='stop' onClick={() => setConfirmToDelete(false)}>
//               {t('buttons.cancel')}
//             </Button>
//             <Button
//               onClick={() => {
//                 setConfirmToDelete(false)
//                 deleteCategory({ data: [confirmToDelete] })
//               }}
//               size='medium'
//               variant='contained'
//             >
//               {t('buttons.delete')}
//             </Button>
//           </>
//         }
//       />
//     </>
//   )
// }
import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../../components/ConfirmDialog'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../../components/LoadingContainer'
import { requests } from '../../../../../utils/requests'
import { error, success } from '../../../../../utils/toast'
import BigTickIcon from '../../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../../assets/icons/DeleteIcon'
import FilterMenuIcon from '../../../../assets/icons/FilterMenuIcon'
import PlusIcon from '../../../../assets/icons/PlusIcon'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../../redux-toolkit/tableSlices/paymentAssetsTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function PaymentsAssetsList() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.paymentAssetsTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openCreateVendorDrawer, setopenCreateVendorDrawer] = useState(false)
  const [openCreatePermission, setOpenCreatePermission] = useState(false)
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
    setOpenConfirmDialog,
    selectVendors,
    setOpenCreatePermission,
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

  const getPaymentAssetsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      search: values?.search,
      offset: values?.search ? 0 : values?.offset || 0,
      store_id: values?.store_id,
    }
  }, [values?.offset, values?.limit, values?.search, values?.store_id])
  const {
    data: getPaymentAssetsList,
    isLoading: getPaymentAssetsListLoading,
    isFetching: isFetchinggetPaymentAssetsList,
    refetch,
  } = useQuery(['getPaymentAssetsList', getPaymentAssetsListFilter], () => requests.getPaymentAssetsList(getPaymentAssetsListFilter))

  const { mutate: deleteCashBox, isLoading: isDeletingCashBox } = useMutation(requests.deleteCashBox, {
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

  useEffect(() => {
    refetch()
  }, [getPaymentAssetsListFilter])

  useEffect(() => {
    const count = getPaymentAssetsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [getPaymentAssetsList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Ключи
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
            <Box minWidth={156}>
              <Button
                id='create'
                adornmentStart={<PlusIcon fill='#fff' />}
                primary
                onClick={() => setOpenCreatePermission(true)}
                style={{ minWidth: 256, height: '48px' }}
              >
                Новая ключ
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
            data={getPaymentAssetsList?.data?.data?.data || []}
            totalCount={getPaymentAssetsList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchinggetPaymentAssetsList || getPaymentAssetsListLoading}
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
            isRefreshing={loading || isFetchinggetPaymentAssetsList || getPaymentAssetsListLoading}
          />
        </Box>
      </Box>

      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить кассы?'}
          desc={'вы хотите удалить?'}
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
              <LoadingButton variant='contained' type='button' loading={isDeletingCashBox} onClick={() => deleteCashBox({ data: [openConfirmDialog.id] })}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
      {/* <CreateEditCategories
        withoutNavigate
        refetch={categoriesRefetch}
        open={!!createEdit}
        editId={createEdit?.parentId}
        focusId={createEdit?.id}
        closeDrawer={() => setCreateEdit(false)}
      /> */}

      <CrreatePaymentAssetDrawer categoriesRefetch={() => refetch()} isOpen={openCreatePermission} onClose={() => setOpenCreatePermission(null)} />

      {/* <CreateCashBoxDrawer
        refetchVendorList={refetch}
        setCustomerId={'setCustomerId'}
        quickCreateClientName={'quickCreateClientName'}
        openDrawer={openCreateVendorDrawer}
        closeDrawer={() => setopenCreateVendorDrawer(false)}
        clientData={'clientDetails'}
      /> */}
    </LoadingContainer>
  )
}
