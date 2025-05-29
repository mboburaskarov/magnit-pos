import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UploadFile } from '@mui/icons-material'
import { Box, Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
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
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import BarcodeIcon from '../../../assets/icons/BarcodeIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/inventoryWithCheckingTableColumns'
import ChangeQuantityModal from './changeQuantityModal'
import InventoryDetailModal from './inventoryDetailModal'
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
  const [selectedCellRowId, setSelectedCellRowId] = useState(null)
  const [lastSelectedCellRowId, setLastSelectedCellRowId] = useState(null)
  const [quantityModalOpen, setQuantityModalOpen] = useState(false)
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [status, setStatus] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [debouncedSearchBarcode] = useDebounce(barcode, 200)

  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryNumber, {
    onSuccess: ({ data }) => {
      refetch()
      successScanAudio.play()
    },
    onError: (err) => {
      refetch()
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })

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
    if (classList.contains('ag-cell')) {
      if (barcode && inventoryWithCheckingDetails?.data?.data?.data.length == 1) {
        setQuantityModalOpen({ id: firstrowid, data: inventoryWithCheckingDetails?.data?.data?.data[0] })
        return
      } else if (lastSelectedCellRowId) {
        setQuantityModalOpen({ id: firstrowid, data: inventoryWithCheckingDetails?.data?.data?.data.find((item) => item?.id == lastSelectedCellRowId) })
        return
      }
    }

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
    editable: false,
    setOrderStoring,
    orderStoring,
    id,
    setScanedNumber,
  })
  const inventoryWithCheckingDetailsFilter = useMemo(() => {
    return {
      inventory_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
      order: orderStoring.position == 1 ? `+${orderStoring.colId}` : orderStoring.position == 2 ? `-${orderStoring.colId}` : undefined,
      type: status,
    }
  }, [values?.offset, orderStoring, status, values?.limit, id, debouncedSearchBarcode])

  const {
    data: inventoryWithCheckingDetails,
    isLoading: inventoryWithCheckingDetailsLoading,
    isFetching: isFetchinginventoryWithCheckingDetails,
    refetch,
  } = useQuery(['inventoryWithCheckingDetails', inventoryWithCheckingDetailsFilter], () => requests.getInventoryDetails(inventoryWithCheckingDetailsFilter))

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

    if (colDef?.field === 'fact_quantity' && newValue !== oldValue) {
      const fact_quantity = newValue
      if (fact_quantity < 0) {
        errorScanAudio.play()
        refetch()

        error('Количество не может быть меньше 0!')
        return
      }
      setScanedNumber({
        id,
        product_id: get(data, 'id'),
        type: 'MANUAL',
        fact_unit: get(data, 'fact_unit'),
        fact_quantity: Number(fact_quantity),
      })
    }
    if (colDef?.field === 'fact_unit' && newValue !== oldValue) {
      const fact_unit = newValue

      if (fact_unit > get(data, 'unit_per_pack')) {
        errorScanAudio.play()
        refetch()
        error(`Количество не может быть больше количества в упаковке! (max:${get(data, 'unit_per_pack')})`)
        return
      }
      if (fact_unit < 0) {
        errorScanAudio.play()
        refetch()

        error('Количество не может быть меньше 0!')
        return
      }
      setScanedNumber({
        id,
        product_id: get(data, 'id'),
        type: 'MANUAL',
        fact_quantity: get(data, 'fact_quantity'),
        fact_unit: Number(fact_unit),
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
    '*',
    (event) => {
      if (selectedCellRowId) return
      const key = event.key.toLowerCase()
      if (/^[a-zа-яё0-9]$/i.test(key)) {
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
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  useHotkeys(
    '*',
    (event) => {
      if (selectedCellRowId) return
      const activeEl = document.activeElement
      const tag = activeEl?.tagName?.toLowerCase()
      const classList = activeEl?.classList || []

      const isAGGridInput =
        tag === 'input' &&
        (classList.contains('ag-cell-edit-input') ||
          classList.contains('ag-input-field-input') ||
          classList.contains('ag-text-field-input') ||
          classList.contains('ag-cell-editor'))

      if (event.code === 'NumpadSubtract' || event.code === 'NumpadAdd') {
        handleFocusUnit()
      }
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (document.activeElement?.tagName === 'INPUT') return
        handleFocus()
      }
    },
    {
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  useEffect(() => {
    if (!quantityModalOpen) {
      handleFocus()
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
                      onChange={({ target }) => setBarcode(get(target, 'value'))}
                      id='producrs-search'
                      name='search'
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
                totalData={[
                  {
                    id: 'ag-grid-footer',
                    name: 'Итого',
                    pinned: true,
                    fact_sum: get(inventoryWithCheckingDetails, 'data.data.total_data.total_fact_sum'),
                    current_sum: get(inventoryWithCheckingDetails, 'data.data.total_data.total_current_sum'),
                    difference_sum: get(inventoryWithCheckingDetails, 'data.data.total_data.total_difference_sum'),
                  },
                ]}
                canCellClick={true}
                onChangeSelectedCellRowId={(id) => {
                  setLastSelectedCellRowId(id)
                }}
                onCellValueChanged={onCellValueChanged}
                columns={tableColumns}
                data={rowData || []}
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
      <InventoryDetailModal refetch={refetch} open={selectedCellRowId} setOpen={setSelectedCellRowId} />
      <ChangeQuantityModal setBarcode={setBarcode} refetch={refetch} open={quantityModalOpen} setOpen={setQuantityModalOpen} />

      <UploadCV open={openUpload} setHasChange={setHasChange} refetch={refetch} setOpen={setOpenUpload} />
    </LoadingContainer>
  )
}
