import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UploadFile } from '@mui/icons-material'
import { Box, Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get, head, size } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'

import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import Header from '../../../../components/Header'
import InputSearch from '../../../../components/Inputs/InputSearch'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { downloadLinkExcel } from '../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../utils/requests'
import thousandDivider from '../../../../utils/thousandDivider'
import { error } from '../../../../utils/toast'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import BarcodeIcon from '../../../assets/icons/BarcodeIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader } from '../../../redux-toolkit/tableSlices/inventoryWithCheckingTableColumns'
import ChangeQuantityModal from './changeQuantityModal'
import InventoryDetailModal from './inventoryDetailModal'
import TableComponent from './lightTable'
import tableHeaderSelector from './tableHeaderSelector'
import UploadCV from './uploadCV'
const SELECTION_ID = 'checkboxSelectionField'

export default function InventoryWithCheckingPage() {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const [openUpload, setOpenUpload] = useState(false)
  const [hasChange, setHasChange] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const childRef = useRef()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.inventoryWithCheckingColumns)
  const { values } = useQueryParams()
  const [barcode, setBarcode] = useState('')
  const [rowData, setRowData] = useState([])

  const methods = useForm()
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })
  const [selectedCellRowId, setSelectedCellRowId] = useState(false)
  const [lastSelectedCellRowId, setLastSelectedCellRowId] = useState(false)
  const [quantityModalOpen, setQuantityModalOpen] = useState(false)
  const [shouldICleanSearchQuery, setshouldICleanSearchQuery] = useState(false)
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [status, setStatus] = useState('ALL')
  const [tableType, setTableType] = useState('MODERN')
  const [offsetCount, setOffsetCount] = useState(0)
  const [debouncedSearchBarcode] = useDebounce(barcode, 200)

  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryNumber, {
    onSuccess: ({ data }) => {
      refetch()
      const firstrowid = inventoryWithCheckingDetails?.data?.data?.data[0]?.id
      setshouldICleanSearchQuery(true)

      childRef.current?.focusCellByRowId(firstrowid, 'fact_quantity')
      successScanAudio.play()
    },
    onError: (err) => {
      refetch()
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })
  console.log(shouldICleanSearchQuery)

  const { mutate: finishInventoryChecking, isLoading: isfinishInventoryChecking } = useMutation(requests.finishInventoryChecking, {
    onSuccess: ({ data }) => {
      navigate('/products/inventory')
    },
    onError: (err) => {
      error('Ошибка при завершение импорта!')
    },
  })
  const handleFocus = () => {
    const firstrowid = inventoryWithCheckingDetails?.data?.data?.data[0]?.id
    const activeEl = document.activeElement
    const classList = activeEl?.classList || []

    // if (barcode.length > 0) {
    // } else {
    if (classList.contains('ag-cell')) {
      if (barcode && inventoryWithCheckingDetails?.data?.data?.data.length == 1) {
        setQuantityModalOpen({ id: firstrowid, data: inventoryWithCheckingDetails?.data?.data?.data[0] })
        return
      } else if (lastSelectedCellRowId) {
        setQuantityModalOpen({ id: firstrowid, data: inventoryWithCheckingDetails?.data?.data?.data.find((item) => item?.id == lastSelectedCellRowId) })
        return
      }
    }
    // }

    // Call the exposed method: focus row with id 'b2' on column 'qty'
    if (lastSelectedCellRowId != null && inventoryWithCheckingDetails?.data?.data?.data?.some((el) => el?.id === lastSelectedCellRowId)) {
      childRef.current?.focusCellByRowId(lastSelectedCellRowId, 'fact_quantity')
    } else {
      setLastSelectedCellRowId(firstrowid)
      childRef.current?.focusCellByRowId(firstrowid, 'fact_quantity')
    }
  }
  const handleFocusUnit = () => {
    const firstrowid = inventoryWithCheckingDetails?.data?.data?.data[0]?.id

    // Call the exposed method: focus row with id 'b2' on column 'qty'
    if (lastSelectedCellRowId != null && inventoryWithCheckingDetails?.data?.data?.data?.some((el) => el?.id === lastSelectedCellRowId)) {
      childRef.current?.focusCellByRowId(lastSelectedCellRowId, 'fact_unit')
    } else {
      setLastSelectedCellRowId(firstrowid)
      childRef.current?.focusCellByRowId(firstrowid, 'fact_unit')
    }
  }
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    editable: true,
    level: 1,
    setOrderStoring,
    orderStoring,
    id,
    setScanedNumber,
  })
  const inventoryWithCheckingDetailsFilter = useMemo(() => {
    return {
      inventory_id: id,
      limit: values?.limit || 10,
      // limit: status == 'checking' ? 6000 : values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
      type: status != 'checking' ? status : 'all',
    }
  }, [values?.offset, orderStoring, status, values?.limit, id, debouncedSearchBarcode])
  useEffect(() => {
    if (status == 'checking') {
      setTableType('LIGHT')
    } else {
      setTableType('MODERN')
    }
  }, [status])
  const {
    data: inventoryWithCheckingDetails,
    isLoading: inventoryWithCheckingDetailsLoading,
    isFetching: isFetchinginventoryWithCheckingDetails,
    refetch,
  } = useQuery(['inventoryWithCheckingDetails', inventoryWithCheckingDetailsFilter], () => requests.getInventoryDetails(inventoryWithCheckingDetailsFilter), {
    onSuccess: ({ data }) => {
      if (size(get(data, 'data.data', [])) == 1 && !shouldICleanSearchQuery) {
        setshouldICleanSearchQuery(true)
        setQuantityModalOpen({ id: get(head(get(data, 'data.data', [])), 'id'), data: head(get(data, 'data.data', [])) })
      } else {
        setQuantityModalOpen(false)
      }
    },

    onError: (error) => {
      console.error('Query failed:', error)
    },
  })
  const { mutate: inventoryExcelReport, isLoading: isinventoryExcelReport } = useMutation(requests.getInventoryExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })
  useEffect(() => {
    if (selectedCellRowId) {
      setLastSelectedCellRowId(selectedCellRowId)
    }
  }, [selectedCellRowId])

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
  }, [inventoryWithCheckingDetailsFilter])

  useEffect(() => {
    const count = inventoryWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(inventoryWithCheckingDetails, 'data.data.data', [])?.map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
    })
  }, [inventoryWithCheckingDetails?.data, values?.limit])

  const { data: inventoryStat } = useQuery('inventoryStat', () => requests.getInventoryStat(id))
  const onCellValueChanged = (params) => {
    const { data, colDef, newValue, oldValue } = params
    if (colDef?.field === 'expired_date' && newValue !== oldValue) {
      const expire_date = newValue
      if (expire_date < 0) {
        errorScanAudio.play()
        refetch()

        error('xato')
        return
      }
      setScanedNumber({
        id,
        product_id: get(data, 'id'),
        type: 'MANUAL',
        expire_date: dayjs(expire_date).format('YYYY-MM-DD'),
      })
    }
    if (colDef?.field === 'barcode' && newValue !== oldValue) {
      const barcode = newValue
      if (!barcode) {
        errorScanAudio.play()
        refetch()
        error('Штрих-код не может быть пустым!')
        return
      }
      setScanedNumber({
        id,
        product_id: get(data, 'id'),
        type: 'MANUAL',
        barcode: barcode,
      })
    }
    if (colDef?.field === 'retail_price' && newValue !== oldValue) {
      const retail_price = newValue
      if (retail_price < 0) {
        errorScanAudio.play()
        refetch()

        error('Розничная цена не может быть меньше 0!')
        return
      }
      setScanedNumber({
        id,
        product_id: get(data, 'id'),
        type: 'MANUAL',
        retail_price: Number(retail_price),
      })
    }
  }
  useHotkeys(
    ['ctrl+Backspace', 'ctrl+delete'],
    (e) => {
      const activeEl = document.activeElement
      const classList = activeEl?.classList || []

      if (classList.contains('ag-cell')) {
        setScanedNumber({
          id,
          product_id: lastSelectedCellRowId,
          type: 'MANUAL',
          fact_unit: 0,
          fact_quantity: 0,
        })
      }
    },
    {
      // enableOnTags: ['INPUT', 'TEXTAREA'],
      enableOnFormTags: true,
      // preventDefault: true,
    }
  )
  useHotkeys(
    '*',
    (event) => {
      let isexeption = document.activeElement.tagName == 'INPUT'
      if (selectedCellRowId || isexeption) return
      const key = event.key.toLowerCase()
      // console.log(key, barcode, shouldICleanSearchQuery)

      if (/^[a-zа-яё0-9]$/i.test(key)) {
        if (shouldICleanSearchQuery) {
          setBarcode('')
          setBarcode((prev) => prev + key)

          setshouldICleanSearchQuery(false)
          return
        }
        setBarcode((prev) => prev + key)
      }
      if (event.code === 'Backspace') {
        setBarcode((prev) => prev.slice(0, -1))
      }

      if (event.code === 'Escape') {
        setBarcode('')
      }
      if (event.code === 'Space') {
        setBarcode((p) => p + ' ')
      }
    },
    {
      // enableOnFormTags: true,
      // preventDefault: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  useHotkeys(
    '*',
    (event) => {
      if (selectedCellRowId) return

      // if (event.code === 'NumpadSubtract' || event.code === 'NumpadAdd') {
      //   handleFocusUnit()
      // }
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        let exeption_ids = ['expired_date', 'barcode', 'retail_price']

        let isexeption = exeption_ids.includes(document.activeElement.getAttribute('col-id'))
        if (document.activeElement?.tagName === 'INPUT' || isexeption) return

        handleFocus()
      }
    },
    {
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  useHotkeys(
    '*',
    (event) => {
      console.log(event)
    },
    { enableOnFormTags: true, enableOnTags: ['INPUT', 'TEXTAREA'], preventDefault: false }
  )
  useEffect(() => {
    if (quantityModalOpen == false && typeof quantityModalOpen == 'boolean') {
      handleFocus()
      // setBarcode('')
    }
  }, [quantityModalOpen])
  useEffect(() => {
    if (inventoryWithCheckingDetails?.data?.data?.data) {
      setRowData([...inventoryWithCheckingDetails?.data?.data?.data])
      get(inventoryWithCheckingDetails, 'data.data.data', []).map((importData) => {
        methods.setValue(`net_amount_${get(importData, 'id')}`, get(importData, 'net_amount'))
      })
    }
  }, [inventoryWithCheckingDetails])
  return (
    <LoadingContainer readyState={!isfinishInventoryChecking && !hasChange}>
      <FormProvider {...methods}>
        <Header
          onSubmit={() => setOpenFinishConfirmDialog(true)}
          isLoading={false}
          buttonText='Завершить'
          backIcon
          backHref='/products/inventory'
          text={'Инвентаризация с проверкой'}
          subText={`${inventoryStat?.data?.data?.store?.name} - ${dayjs(inventoryStat?.data?.data?.created_at).format('DD.MM.YYYY - HH:mm')}`}
          checkAccessId={'product-create'}
        />
        <Container>
          <Box display='flex' flexDirection='column' position='relative' pb={'20px'}>
            <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
              <Box display={'flex'}>
                <Box
                  width='100%'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                    '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                      background: 'transparent',
                      width: '400px',
                      height: 48,
                    },
                  }}
                >
                  <Box display={'flex'}>
                    <InputSearch
                      icon={<BarcodeIcon />}
                      onKeyDown={({ code }) => code === 'Enter' && handleFocus()}
                      onChange={({ target }) => {
                        if (shouldICleanSearchQuery) {
                          setBarcode('')
                          setshouldICleanSearchQuery(false)
                        }
                        setBarcode(get(target, 'value'))
                      }}
                      id='producrs-search'
                      name='search'
                      // disabled={status == 'checking'}
                      value={barcode}
                      setSearchTerm={setBarcode}
                      placeholder={t('input.search.product.multi')}
                    />
                    <Box width={'20px'} />
                    <InputSwitch
                      uncontrolled
                      id='status'
                      noMarginTop
                      name='status'
                      value={status}
                      defaultValue='ALL'
                      onChange={(e) => setStatus(e)}
                      options={[
                        { title: t('switch.title.all'), value: 'ALL', count: get(inventoryWithCheckingDetails, 'data.data.stats_count.all', 0) },
                        {
                          title: t('switch.title.scanned_count'),
                          value: 'scanned',
                          count: get(inventoryWithCheckingDetails, 'data.data.stats_count.scanned', 0),
                        },
                        {
                          title: t('switch.title.shortage_count'),
                          value: 'shortage',
                          count: get(inventoryWithCheckingDetails, 'data.data.stats_count.shortage', 0),
                        },
                        {
                          title: t('switch.title.surplus_count'),
                          value: 'surplus',
                          count: get(inventoryWithCheckingDetails, 'data.data.stats_count.surplus', 0),
                        },
                        {
                          title: t('switch.title.zero_price'),
                          value: 'zero_price',
                          count: get(inventoryWithCheckingDetails, 'data.data.stats_count.zero_price', 0),
                        },
                        {
                          title: 'Проверка',
                          value: 'checking',
                          count: get(inventoryWithCheckingDetails, 'data.data.stats_count.zero_price', 0),
                        },
                      ]}
                    />
                  </Box>
                </Box>
              </Box>
              <Box display={'flex'} alignItems={'center'}>
                <Button color='secondary' sx={{ height: '48px', mr: '10px' }} onClick={() => setOpenUpload(true)}>
                  <UploadFile />
                </Button>
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
            {tableType == 'MODERN' ? (
              <Box sx={{ '& .MuiTextField-root': { bgcolor: 'transparent !important' }, mb: '100px' }}>
                <AgGridTable
                  selectedCellRowId={setSelectedCellRowId}
                  id='imports-main-table'
                  tableSettings
                  gettingId='id'
                  realTimeSelectedCellRowId={({ id, rowId }) => {
                    if (id == 'main') setLastSelectedCellRowId(rowId)
                  }}
                  childRef={childRef}
                  enableFillHandle={true}
                  custonName='main'
                  // totalData={[
                  //   {
                  //     id: 'ag-grid-footer',
                  //     name: 'Итого',
                  //     pinned: true,
                  //     fact_sum: get(inventoryWithCheckingDetails, 'data.data.total_data.total_fact_sum'),
                  //     current_sum: get(inventoryWithCheckingDetails, 'data.data.total_data.total_current_sum'),
                  //     difference_sum: get(inventoryWithCheckingDetails, 'data.data.total_data.total_difference_sum'),
                  //   },
                  // ]}
                  canCellClick={true}
                  onChangeSelectedCellRowId={(id) => {
                    setLastSelectedCellRowId(id)
                  }}
                  onCellValueChanged={onCellValueChanged}
                  columns={tableColumns}
                  data={rowData || []}
                  fullDownload={() => inventoryExcelReport({ ...inventoryWithCheckingDetailsFilter, limit: 1000000 })}
                  downloadByFilter={() => inventoryExcelReport(inventoryWithCheckingDetailsFilter)}
                  isDownloading={isinventoryExcelReport}
                  totalCount={inventoryWithCheckingDetails?.data?.data?.data?._meta?.total_count || 0}
                  isDataLoading={isFetchinginventoryWithCheckingDetails || inventoryWithCheckingDetailsLoading}
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
                  isRefreshing={loading || isFetchinginventoryWithCheckingDetails || inventoryWithCheckingDetailsLoading}
                />
              </Box>
            ) : (
              <TableComponent
                onSelectRow={(rowData) => {
                  setQuantityModalOpen({ id: rowData?.id, data: rowData })
                }}
                setHasChange={setHasChange}
                hasChange={hasChange}
                barcode={barcode}
                id={id}
                orderStoring={orderStoring}
                data={rowData}
              />
            )}
          </Box>
        </Container>
      </FormProvider>
      <ConfirmDialog
        open={openFinishConfirmDialog}
        setOpen={() => setOpenFinishConfirmDialog(false)}
        icon={<FontAwesomeIcon icon={faExclamationTriangle} sx={{ fontSize: 41, color: 'yellow.400' }} />}
        title={t('alerts.finish_inventory')}
        desc={
          <>
            <Typography fontWeight={'600'} fontSize={'20px'}>
              {t('alerts.finish_inventory_desc')}
            </Typography>
            <Typography fontWeight={'600'} sx={{ color: 'red.500' }}>
              {t('alerts.finish_inventory_warning')}
            </Typography>
          </>
        }
        actions={
          <>
            <Button secondary onClick={() => setOpenFinishConfirmDialog(false)}>
              {t('buttons.go_back')}
            </Button>
            <Button
              size='medium'
              variant='contained'
              onClick={() => {
                setOpenFinishConfirmDialog(false)
                finishInventoryChecking(id)
              }}
              isLoading={false}
            >
              {t('buttons.yes_complete')}
            </Button>
          </>
        }
      />
      <InventoryDetailModal setBarcode={setBarcode} refetch={refetch} open={selectedCellRowId} setOpen={setSelectedCellRowId} />
      <ChangeQuantityModal
        setshouldICleanSearchQuery={setshouldICleanSearchQuery}
        setBarcode={setBarcode}
        refetch={refetch}
        setHasChange={setHasChange}
        open={quantityModalOpen}
        setOpen={setQuantityModalOpen}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          display: 'flex',
          justifyContent: 'end',
          width: '100%',
          backgroundColor: '#fff',
          zIndex: 9999,
          padding: '20px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: '20px' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Програм Cумма</Typography>
          <Typography sx={{ fontSize: '20px', fontWeight: '400' }}>
            {thousandDivider(get(inventoryWithCheckingDetails, 'data.data.total_data.total_current_sum'), 'сум')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: '20px' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Факт Cумма</Typography>
          <Typography sx={{ fontSize: '20px', fontWeight: '400' }}>
            {thousandDivider(get(inventoryWithCheckingDetails, 'data.data.total_data.total_fact_sum'), 'сум')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: '20px' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Разница сумма</Typography>
          <Typography sx={{ fontSize: '20px', fontWeight: '400' }}>
            {thousandDivider(get(inventoryWithCheckingDetails, 'data.data.total_data.total_difference_sum'), 'сум')}
          </Typography>
        </Box>
      </Box>
      <UploadCV open={openUpload} setHasChange={setHasChange} refetch={refetch} setOpen={setOpenUpload} />
    </LoadingContainer>
  )
}
