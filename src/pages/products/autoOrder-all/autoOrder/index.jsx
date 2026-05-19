import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '@components/CheckAccess'
import ConfirmDialog from '@components/ConfirmDialog'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import StyledTooltip from '@components/StyledTooltip'
import { requests } from '@utils/requests'
import CategoryIcon from '@icons/CategoryIcon'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { LoadingButton } from '@mui/lab'
import { error, success } from '@utils/toast'
import BigTickIcon from '@icons/BigTickIcon'
import BigWarningIcon from '@icons/BigWarningIcon'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/autoOrderTableColumns'
import CreateAutoOrder from './createAutoOrder'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import MgPageHeader from '@components/MgPageHeader'

export default function AutoOrderPage() {
  const theme = useTheme()
  const methods = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.autoOrderTableColumns)
  const { values } = useQueryParams()
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [controlleroffset, setControllerOffset] = useState(0)
  const [offsetCount, setOffsetCount] = useState(0)
  const [filterMenu, setFilterMenu] = useState(false)
  const [orderModel, setOrderModel] = useState(false)

  const { mutate: deleteAutoOrder, isLoading: isdeleteAutoOrder } = useMutation(requests.deleteAutoOrder, {
    onSuccess: () => {
      refetch()
      success('Авто заказ успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении Авто заказ!')
      setOpenConfirmDialog(null)
      console.error('err', err)
    },
  })

  const tableColumns = tableHeaderSelector({
    autoOrderColumns: columns,
    t,
    setOpenConfirmDialog,
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

  const autoOrderListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: controlleroffset || 0,
      search: values?.search,
      store_id: values?.store_id,
      start_date: values?.start_date,
      end_date: values?.end_date,
      status: values?.status,
      import_date: values?.import_date,
      received_amount_to: values?.received_amount_to,
      received_amount_from: values?.received_amount_from,
    }
  }, [
    controlleroffset,
    values?.limit,
    values?.end_date,
    values?.start_date,
    values?.search,
    values?.status,
    values?.store_id,
    values?.received_amount_to,
    values?.received_amount_from,
  ])
  const {
    data: autoOrderList,
    isLoading: autoOrderListLoading,
    isFetching: isFetchingautoOrderList,
    refetch,
  } = useQuery(['autoOrderList', autoOrderListFilter], () => requests.getAutoOrderList(autoOrderListFilter))

  useEffect(() => {
    refetch()
  }, [autoOrderListFilter])

  useEffect(() => {
    const count = autoOrderList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [autoOrderList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <FormProvider {...methods}>
        <Box display='flex' flexDirection='column' position='relative' px={'24px'} pb={'20px'}>
          <MgPageHeader
            title='Авто заказ'
            subtitle={`Всего: ${new Intl.NumberFormat('ru-UZ').format(autoOrderList?.data?.data?._meta?.total_count || 0)}`}
            showCreate
            onCreate={() => setOrderModel(true)}
            createLabel='Создать'
            createPermissionId='create-auto-order'
          />

          <div className='mg-table-card' style={{ marginTop: '12px' }}>
            {/* Toolbar block matching table-toolbar exactly */}
            <div
              className='mg-table-toolbar'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid var(--mg-border)',
              }}
            >
              <div className='mg-table-toolbar-left' style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                {/* Search field Box */}
                <Box
                  width='100%'
                  maxWidth={400}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '40px',
                      border: '1px solid #ECEDF2',
                      borderRadius: '12px',
                      bgcolor: '#fff',
                      px: '12px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                      background: 'transparent',
                      width: '100%',
                      height: '40px',
                    },
                  }}
                >
                  <InputSearch id='producrs-search' name='search' placeholder={'Номер автозаказа, Магазин'} uncontrolled />
                </Box>
              </div>

              <div className='mg-table-toolbar-right' style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <StyledTooltip title={'Создать мин-макс'}>
                  <button
                    type='button'
                    onClick={() => navigate('/products/min-max-create')}
                    style={{
                      height: '40px',
                      width: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #ECEDF2',
                      borderRadius: '12px',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <CategoryIcon color='#111217' />
                  </button>
                </StyledTooltip>

                {/* Filter button */}
                <button
                  type='button'
                  className={`mg-btn mg-btn-secondary ${filterMenu ? 'active' : ''}`}
                  onClick={() => setFilterMenu((prev) => !prev)}
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #ECEDF2',
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#111217',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <FilterMenuIcon color='#111217' />
                  <span style={{ fontSize: '14px' }}>{t('filter_dialog.label')}</span>
                </button>

                <ColumnsFilterButtonForAll
                  title={t('ag_grid.table_setting.label')}
                  columns={tableColumns}
                  isCatalog={false}
                  resetTableHeader={resetTableHeader}
                  changeColumnSequence={changeColumnSequence}
                />
              </div>
            </div>

            <Box style={{ padding: 0 }}>
              <AgGridTable
                id='auto-order-main-table'
                tableSettings
                columns={tableColumns}
                data={autoOrderList?.data?.data?.data || []}
                totalCount={autoOrderList?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingautoOrderList || autoOrderListLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                emptyTableText={{
                  title: 'Авто заказ недоступен',
                  description: '...',
                }}
                fullInfoAboutCurrentPage
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                isRefreshing={loading || isFetchingautoOrderList || autoOrderListLoading}
              />
            </Box>
          </div>
        </Box>
      </FormProvider>
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить aвто заказ?'}
          desc={'хотите удалить авто заказ?'}
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
              <LoadingButton variant='contained' type='button' loading={isdeleteAutoOrder} onClick={() => deleteAutoOrder(openConfirmDialog.id)}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
