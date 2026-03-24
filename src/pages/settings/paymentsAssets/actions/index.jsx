import CrreatePaymentAssetDrawer from '../CreatePaymentAssetDrawer'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '@components/ConfirmDialog'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { requests } from '@utils/requests'
import { error, success } from '@utils/toast'
import BigTickIcon from '@icons/BigTickIcon'
import BigWarningIcon from '@icons/BigWarningIcon'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import PlusIcon from '@icons/PlusIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/paymentAssetsTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'

export default function PaymentsAssetsList() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.paymentAssetsTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openCreatePermission, setOpenCreatePermission] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const tableColumns = tableHeaderSelector({
    vendorsColumns: columns,
    t,
    values,
    setOpenConfirmDialog,
    setOpenCreatePermission,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
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

  const { mutate: deletePaymentAsset, isLoading: isDeletingCashBox } = useMutation(requests.deletePaymentAsset, {
    onSuccess: () => {
      refetch()
      success('Ключ успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении Ключ!')
      setOpenConfirmDialog(null)
      console.error('err', err)
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
            id='payment-assistent-table'
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
              title: 'ключ недоступен',
              description: 'Если вы не можете найти искомый ключ, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
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
          title={'Удалить ключ?'}
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
              <LoadingButton variant='contained' type='button' loading={isDeletingCashBox} onClick={() => deletePaymentAsset(openConfirmDialog.id)}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}

      <CrreatePaymentAssetDrawer categoriesRefetch={() => refetch()} isOpen={openCreatePermission} onClose={() => setOpenCreatePermission(null)} />
    </LoadingContainer>
  )
}
