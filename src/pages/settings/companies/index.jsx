import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '../../../../components/CheckAccess'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import StyledTooltip from '../../../../components/StyledTooltip'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import CategoryIcon from '../../../assets/icons/CategoryIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/companiesTableColumns'
import CreateLocationDrawer from './createLocationDrawer'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'
export default function CompaniesPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.companiesTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openCreateLocationDrawer, setopenCreateLocationDrawer] = useState(false)
  const navigate = useNavigate()
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    setopenCreateLocationDrawer,
    values,
    setOpenConfirmDialog,
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

  const companiesListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
    }
  }, [values?.offset, values?.limit, values?.search])
  const {
    data: companiesList,
    isLoading: companiesListLoading,
    isFetching: isFetchingcompaniesList,
    refetch,
  } = useQuery(['companiesList', companiesListFilter], () => requests.getAllCompanies(companiesListFilter))

  const { mutate: deleteStore, isLoading: isDeletingProduct } = useMutation(requests.deleteStore, {
    onSuccess: () => {
      refetch()
      success('Аптека успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении Аптека!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [companiesListFilter])

  useEffect(() => {
    const count = companiesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [companiesList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Компании
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
            <CheckAccess id={'can-add-payment-service'}>
              <StyledTooltip title={'Управление Ключи'}>
                <Box
                  onClick={() => navigate('/settings/payments-assets')}
                  sx={{
                    backgroundColor: 'bg.10',
                    padding: '10px',
                    borderRadius: '10px',
                    mr: '10px',
                    display: 'flex',
                    width: '38px',
                    height: '38px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CategoryIcon />
                </Box>
              </StyledTooltip>
            </CheckAccess>

            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                changeColumnSequence={changeColumnSequence}
                resetTableHeader={resetTableHeader}
              />
            </Box>
            {/* <Box minWidth={156}>
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
            </Box> */}
          </Box>
        </Box>
        <Box>
          <AgGridTable
            id='products-main-table'
            tableSettings
            columns={tableColumns}
            emptyTableText={{
              title: 'Аптеки недоступен',
              description: 'Если вы не можете найти искомый Аптеки, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            data={companiesList?.data?.data?.data || []}
            totalCount={companiesList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingcompaniesList || companiesListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingcompaniesList || companiesListLoading}
          />
        </Box>
      </Box>

      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить Аптека?'}
          desc={'хотите удалить свой Аптека?'}
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
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteStore(openConfirmDialog.id)}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}

      <CreateLocationDrawer
        refetchVendorList={refetch}
        setCustomerId={'setCustomerId'}
        quickCreateClientName={'quickCreateClientName'}
        openDrawer={openCreateLocationDrawer}
        closeDrawer={() => setopenCreateLocationDrawer(false)}
        clientData={companiesList?.data?.data?.data?.find((el) => el.id == get(openCreateLocationDrawer, 'data.id'))}
      />
    </LoadingContainer>
  )
}
