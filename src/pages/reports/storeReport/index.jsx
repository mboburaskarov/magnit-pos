import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import * as qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import ImageGallery from '../../../../components/ImageGallery'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import LazySelect from '../../../../components/Select/LazySelect'
import { downloadExcel } from '../../../../utils/downloadEXCEL'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/storeReportTableColumns'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function StoreReportPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [selectedShops, setSelectedShops] = useState('all')
  const methods = useForm()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.storeReportTableColumns)
  const { values } = useQueryParams()
  const [regions, setRegions] = useState([])

  const [selectClients, setselectClients] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [rejectComment, setRejectComment] = useState(null)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const selectClientsFunc = (isChecked, id) => {
    if (isChecked) {
      setselectClients((p) => [...p, id])
    } else {
      setselectClients((p) => p.filter((ids) => ids !== id))
    }
  }
  const tableColumns = tableHeaderSelector({
    clientsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    selectClientsFunc,
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

  const storeReportListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: values?.store_id || undefined,
      start_date: values?.start_date || dayjs(new Date()).format('YYYY-MM-DD'),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
    }
  }, [values?.offset, values?.limit, values?.store_id, selectedShops, values?.search, values?.start_date, values?.end_date])
  const {
    data: storeReportList,
    isLoading: storeReportListLoading,
    isFetching: isFetchingstoreReportList,
    refetch,
  } = useQuery(['storeReportList', storeReportListFilter], () => requests.getStoreReport(storeReportListFilter))

  const { mutate: deleteClient, isLoading: isDeletingProduct } = useMutation(requests.deleteClient, {
    onSuccess: () => {
      refetch()
      success('Kлиент успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении клиент!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  useEffect(() => {
    refetch()
  }, [storeReportListFilter])

  useEffect(() => {
    const count = storeReportList?.data?.data?._meta?.total_count
    setselectClients([])
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [storeReportList?.data, values?.limit])
  const { mutate: getPorductReportExcelReport, isLoading: isgetPorductReportExcelReport } = useMutation(requests.getPorductReportExcelReport, {
    onSuccess: ({ data }) => {
      downloadExcel(data, `${values?.store_name || 'Все филиалы'} Продажа развернутый`)
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })
  useEffect(() => {
    const store_id = methods.getValues('store_id')
    const requestBody = {
      store_id: store_id?.id || undefined,
      store_name: store_id?.name || undefined,
    }
    const requestParams = qs.stringify({ ...values, ...requestBody, offset: 0 }, { addQueryPrefix: true })

    navigate(`/reports/store-report${requestParams}`)
  }, [methods.watch('store_id')])
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Отчет филиала
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
              <InputSearch id='producrs-search' name='search' placeholder={'Филиал'} uncontrolled />
            </Box>

            {/* <Box minWidth={113} ml={'16px'} mr={'10px'}>
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
                startIcon={<FilterMenuIcon color={theme.palette.black} />}
                variant='contained'
                color='secondary'
                onClick={() => setFilterMenu((prev) => !prev)}
              >
                <Typography fontWeight={600} fontSize={'16px'} lineHeight={'25px'}>
                  {t('filter_dialog.label')}
                </Typography>
              </Button>
            </Box> */}
            {selectClients.length > 0 && (
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
                    onClick={() => deleteClient({ data: selectClients })}
                  >
                    <DeleteIcon width='24px' />
                  </Button>
                </Box>
              </>
            )}
            <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
            <Box
              sx={{
                minWidth: '400px',
                width: '400px',
                ml: '25px',
              }}
            >
              <LazySelect
                slug='users'
                boxStyle={{ width: '100%' }}
                id='store'
                name='store_id'
                isMulti={false}
                placeholder={t('Выберите Магазин')}
                minWidth='auto'
                isClearable={true}
                label={''}
                request={requests.getAllStores}
                filters={{ limit: 100 }}
                control={methods.control}
                // value='823f9458-2e67-4ed7-b001-ca8271b1269c'
                // uncontrolled
                getOptionLabel={(option) => {
                  return option.name
                }}
                filterOption={() => true}
              />
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
          </Box>
        </Box>
        {/* <FilterMenu selectedShops={selectedShops} setSelectedShops={setSelectedShops} setRegions={setRegions} open={filterMenu} setOpen={setFilterMenu} /> */}
        <Box>
          <AgGridTable
            id='clients-main-table'
            uniqId='uid'
            tableSettings
            fullDownload={() => getPorductReportExcelReport({ ...storeReportListFilter, limit: 1000000 })}
            downloadByFilter={() => getPorductReportExcelReport(storeReportListFilter)}
            isDownloading={isgetPorductReportExcelReport}
            columns={tableColumns}
            totalCount={storeReportList?.data?.data?._meta?.total_count || 0}
            data={storeReportList?.data?.data?.data || []}
            isDataLoading={isFetchingstoreReportList || storeReportListLoading}
            offsetCount={offsetCount}
            emptyTableText={{
              title: 'Клиент не существует',
              description: 'Если вы не нашли искомого Клиента, нажмите кнопку «Добавить нового» и введите необходимую информацию.',
            }}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingstoreReportList || storeReportListLoading}
          />
        </Box>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={'Удалить клиента?'}
          desc={'Хотите ли вы удалить клиента?'}
          supDesc={'“Azitromitsin 250 mg”'}
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
              <LoadingButton variant='contained' type='button' loading={isDeletingProduct} onClick={() => deleteClient({ data: [openConfirmDialog.id] })}>
                Да, удалить
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
