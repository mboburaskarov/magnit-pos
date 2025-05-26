import { Box, Container } from '@mui/material'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import Header from '../../../../components/Header'
import InputQuantity from '../../../../components/Inputs/InputQuantity'
import InputSearch from '../../../../components/Inputs/InputSearch'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import overplusAudio from '../../../assets/audio/overplus.mp3'
import BarcodeIcon from '../../../assets/icons/BarcodeIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/importWithCheckingTableColumns'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function ImportWithCheckingPage() {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const overplusScanAudio = new Audio(overplusAudio)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.importWithCheckingColumns)
  const { values } = useQueryParams()
  const [imports, setImports] = useState([])
  const [barcode, setBarcode] = useState('')
  const methods = useForm()
  const [hasTableChange, setHasTableChange] = useState(false)
  const [appType, setAppType] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [manualNumber, setManualNumber] = useState(1)
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedImportNumber, {
    onSuccess: ({ data }) => {
      refetch()
      fetchStatusCountList()
    },
    onError: (err) => {
      error('Ошибка при сканирование!')
    },
  })

  const { mutate: finishImportChecking, isLoading: isfinishImportChecking } = useMutation(requests.finishImportChecking, {
    onSuccess: ({ data }) => {
      navigate('/products/import')
    },
    onError: (err) => {
      error('Ошибка при завершение импорта!')
    },
  })
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImports,
    id,
    setScanedNumber,
  })
  const importWithCheckingDetailsFilter = useMemo(() => {
    return {
      import_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
      type: status,
    }
  }, [values?.offset, status, values?.limit, id, barcode])

  const {
    data: importWithCheckingDetails,
    isLoading: importWithCheckingDetailsLoading,
    isFetching: isFetchingimportWithCheckingDetails,
    refetch,
  } = useQuery(['importWithCheckingDetails', importWithCheckingDetailsFilter], () => requests.getImportScanDetails(importWithCheckingDetailsFilter))
  const {
    data: statusCountList,
    isLoading: statusCountListLoading,
    isFetching: isFetchingstatusCountList,
    refetch: fetchStatusCountList,
  } = useQuery(['statusCountList', values?.search], () => requests.getAllImportsDetailStatusCount({ id: id, filter: { search: values?.search } }))
  /// filter table columns with permission
  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID)
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

  useEffect(() => {
    refetch()
  }, [importWithCheckingDetailsFilter])

  useEffect(() => {
    const count = importWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(importWithCheckingDetails, 'data.data.data', [])?.map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
    })
  }, [importWithCheckingDetails?.data, values?.limit])

  const sendScannedImport = () => {
    if (barcode === '') return
    // addScan({ barcode, count: Number(manualNumber), import_id: id })
  }

  return (
    <LoadingContainer readyState={!isfinishImportChecking}>
      <FormProvider {...methods}>
        <Header
          onSubmit={() => finishImportChecking(id)}
          isLoading={false}
          buttonText='Завершить'
          backIcon
          backHref='/products/import'
          text={'Импорт с проверкой'}
          checkAccessId={'product-create'}
        />
        <Container>
          <Box minWidth={320}>
            <InputSwitch
              uncontrolled
              id='status'
              name='status'
              value={status}
              defaultValue='ALL'
              onChange={(e) => setStatus(e)}
              options={[
                { title: t('switch.title.all'), value: 'ALL', count: get(statusCountList, 'data.data.total_count', 0) },
                { title: t('switch.title.scanned_count'), value: 'scanned', count: get(statusCountList, 'data.data.scanned_count', 0) },
                { title: t('switch.title.shortage_count'), value: 'shortage', count: get(statusCountList, 'data.data.shortage_count', 0) },
                { title: t('switch.title.surplus_count'), value: 'surplus', count: get(statusCountList, 'data.data.surplus_count', 0) },
              ]}
            />
          </Box>
          <Box display='flex' flexDirection='column' position='relative' pt={'24px'} pb={'20px'}>
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
                  <InputSearch
                    icon={<BarcodeIcon />}
                    onKeyDown={({ code }) => code === 'Enter' && sendScannedImport()}
                    onChange={({ target }) => setBarcode(get(target, 'value'))}
                    id='producrs-search'
                    name='search'
                    value={barcode}
                    setSearchTerm={setBarcode}
                    placeholder={t('input.search.product.multi')}
                  />
                </Box>
                {appType === 'manual' && (
                  <Box sx={{ ml: '16px' }}>
                    <InputQuantity placeholder={'0'} uncontrolled defaultValue={1} onChange={({ target }) => setManualNumber(target.value)} />
                  </Box>
                )}
                <Box sx={{ ml: '16px' }}>
                  <InputSwitch
                    noMarginTop
                    uncontrolled
                    id='app-type'
                    name='app-type'
                    value={appType}
                    defaultValue='auto'
                    onChange={(e) => setAppType(e)}
                    options={[
                      { title: 'Руководство', value: 'manual' },
                      { title: 'Сканирование', value: 'auto' },
                    ]}
                  />
                </Box>
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                <Box>
                  <ColumnsFilterButtonForAll
                    title={t('ag_grid.table_setting.label')}
                    columns={tableColumns}
                    isCatalog={false}
                    resetTableHeader={resetTableHeader}
                    changeColumnSequence={changeColumnSequence}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ '& .MuiTextField-root': { bgcolor: 'transparent !important' } }}>
              <AgGridTable
                id='imports-main-table'
                tableSettings
                columns={tableColumns}
                data={importWithCheckingDetails?.data?.data?.data || []}
                totalCount={importWithCheckingDetails?.data?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingimportWithCheckingDetails || importWithCheckingDetailsLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                emptyTableText={{
                  title: 'Импорт недоступен',
                  description: 'Если вы не можете найти искомый Импорт, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
                }}
                fullInfoAboutCurrentPage
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                status={appType}
                isRefreshing={loading || hasTableChange || isFetchingimportWithCheckingDetails || importWithCheckingDetailsLoading}
              />
            </Box>
          </Box>
        </Container>
        {/* <ConflictDialog
          refetch={refetch}
          setBarcode={setBarcode}
          manualNumber={manualNumber}
          conflictList={conflictList}
          open={conflictOpen}
          setOpen={() => {
            setConflictOpen(false), setConflictList([])
          }}
        /> */}
      </FormProvider>
    </LoadingContainer>
  )
}
