import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UploadFile } from '@mui/icons-material'
import { Box, Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get, head, size } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import { useQueryParams } from '../../../hooks/useQueryParams'
import './table.css'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import Header from '../../../../components/Header'
import InputSearch from '../../../../components/Inputs/InputSearch'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import LoadingBlock from '../../../../components/LoadingBlock'
import { downloadLinkExcel } from '../../../../utils/downloadLinkEXCEL'
import { error } from '../../../../utils/toast'
import BarcodeIcon from '../../../assets/icons/BarcodeIcon'
import { changeColumnSequence, resetTableHeader } from '../../../redux-toolkit/tableSlices/inventoryWithCheckingTableColumns'
import ChangeQuantityModal from './changeQuantityModal'
import InventoryDetailModal from './inventoryDetailModal'
import tableHeaderSelector from './tableHeaderSelector'
import UploadCV from './uploadCV'

const SELECTION_ID = 'checkboxSelectionField'
const LIMIT = 50

const InventoryWithCheckingPageNew = ({ onSelectRow = () => {} }) => {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const [openUpload, setOpenUpload] = useState(false)
  const [hasChange, setHasChange] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const childRef = useRef()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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

  // Navigation state
  const [selectedIndex, setSelectedIndex] = useState(0)
  const rowRefs = useRef([])
  const observerRef = useRef()
  const { id } = useParams()

  // Current view filter
  const currentViewFilter = useMemo(
    () => ({
      inventory_id: id,
      limit: LIMIT,
      offset: 0, // Always get first page for current view
      search: barcode,
      order: orderStoring.position === 1 ? `+${orderStoring.colId}` : orderStoring.position === 2 ? `-${orderStoring.colId}` : undefined,
      type: status !== 'checking' ? status : 'all',
    }),
    [id, debouncedSearchBarcode, orderStoring, status]
  )

  // Infinite scroll filter
  const infiniteScrollFilter = useMemo(
    () => ({
      inventory_id: id,
      search: barcode,
      order: orderStoring.position === 1 ? `+${orderStoring.colId}` : orderStoring.position === 2 ? `-${orderStoring.colId}` : undefined,
      type: status !== 'checking' ? status : 'all',
    }),
    [id, barcode, orderStoring, status]
  )

  // 🔄 Current view query (for immediate updates)
  const {
    data: currentViewData,
    refetch: refetchCurrentView,
    isLoading: isCurrentViewLoading,
  } = useQuery(['inventoryCurrentView', currentViewFilter], () => requests.getInventoryDetails(currentViewFilter), {
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess: ({ data }) => {
      if (size(get(data, 'data.data', [])) === 1 && !shouldICleanSearchQuery) {
        setshouldICleanSearchQuery(true)
        setQuantityModalOpen({
          id: get(head(get(data, 'data.data', [])), 'id'),
          data: head(get(data, 'data.data', [])),
        })
      } else {
        setQuantityModalOpen(false)
      }
    },
  })

  // 🔄 Infinite scroll query (for pagination)
  const fetchPage = async ({ pageParam = 0 }) => {
    const filter = {
      ...infiniteScrollFilter,
      limit: LIMIT,
      offset: pageParam,
    }
    const res = await requests.getInventoryDetails(filter)
    return { rows: res.data?.data?.data || [], nextOffset: pageParam + LIMIT }
  }

  const {
    data: infiniteData,
    fetchNextPage,
    refetch: refetchInfinite,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
  } = useInfiniteQuery(['inventoryInfiniteScroll', infiniteScrollFilter, hasChange], fetchPage, {
    getNextPageParam: (lastPage) => (lastPage.rows.length < LIMIT ? undefined : lastPage.nextOffset),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  })

  // 🔁 Determine which data to display
  const allRows = infiniteData?.pages?.flatMap((page) => page.rows) || []
  const currentRows = currentViewData?.data?.data?.data || []

  // Use current view for searches and updates, infinite data for normal scrolling
  const displayData = barcode || hasChange ? currentRows : allRows
  const rowCount = displayData.length

  // 🔼⬇️ Keyboard navigation
  useHotkeys('up', () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1))
  })

  useHotkeys('down', () => {
    setSelectedIndex((prev) => Math.min(rowCount - 1, prev + 1))
  })

  useHotkeys('enter', () => {
    const selectedRow = displayData[selectedIndex]
    if (selectedRow) {
      console.log('Selected Row ID:', selectedRow.id, selectedRow.name)
      onSelectRow(selectedRow)
      setQuantityModalOpen({ id: selectedRow.id, data: selectedRow })
    }
  })

  // 🎯 Scroll to selected row
  useEffect(() => {
    if (rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedIndex])

  // 📦 Infinite scroll observer
  const lastRowRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !barcode) {
          fetchNextPage()
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage, barcode]
  )

  // 🔧 Smart refetch hook
  const useSmartRefetch = () => {
    return {
      refetchCurrentData: async () => {
        // Refetch current view
        await refetchCurrentView()

        // Update the first page of infinite query with fresh data
        const freshData = await queryClient.fetchQuery(['inventoryCurrentView', currentViewFilter], () => requests.getInventoryDetails(currentViewFilter))

        queryClient.setQueryData(['inventoryInfiniteScroll', infiniteScrollFilter, hasChange], (oldData) => {
          if (!oldData || !freshData?.data?.data?.data) return oldData

          // Update only the first page with fresh data
          const newPages = [...oldData.pages]
          if (newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              rows: freshData.data.data.data,
            }
          }

          return {
            ...oldData,
            pages: newPages,
          }
        })
      },

      refetchAll: () => {
        refetchCurrentView()
        refetchInfinite()
      },
    }
  }

  const { refetchCurrentData, refetchAll } = useSmartRefetch()

  // 🔄 Mutations
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryNumber, {
    onSuccess: ({ data }) => {
      refetchCurrentData() // Only refetch current view

      const firstrowid = currentRows[0]?.id
      setshouldICleanSearchQuery(true)
      childRef.current?.focusCellByRowId(firstrowid, 'fact_quantity')
      successScanAudio.play()
    },
    onError: (err) => {
      refetchCurrentData() // Only refetch current view
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

  // 🎯 Focus handlers
  const handleFocus = () => {
    const firstrowid = currentRows[0]?.id
    const activeEl = document.activeElement
    const classList = activeEl?.classList || []

    if (classList.contains('ag-cell')) {
      if (barcode && currentRows.length === 1) {
        setQuantityModalOpen({ id: firstrowid, data: currentRows[0] })
        return
      } else if (lastSelectedCellRowId) {
        setQuantityModalOpen({
          id: firstrowid,
          data: currentRows.find((item) => item?.id === lastSelectedCellRowId),
        })
        return
      }
    }

    if (lastSelectedCellRowId != null && currentRows?.some((el) => el?.id === lastSelectedCellRowId)) {
      childRef.current?.focusCellByRowId(lastSelectedCellRowId, 'fact_quantity')
    } else {
      setLastSelectedCellRowId(firstrowid)
      childRef.current?.focusCellByRowId(firstrowid, 'fact_quantity')
    }
  }

  const handleFocusUnit = () => {
    const firstrowid = currentRows[0]?.id

    if (lastSelectedCellRowId != null && currentRows?.some((el) => el?.id === lastSelectedCellRowId)) {
      childRef.current?.focusCellByRowId(lastSelectedCellRowId, 'fact_unit')
    } else {
      setLastSelectedCellRowId(firstrowid)
      childRef.current?.focusCellByRowId(firstrowid, 'fact_unit')
    }
  }

  // 📊 Table configuration
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

  // 📈 Excel export
  const { mutate: inventoryExcelReport, isLoading: isinventoryExcelReport } = useMutation(requests.getInventoryExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.log(err)
      error('Ошибка при скачать excel!')
    },
  })

  // 📊 Statistics
  const { data: inventoryStat } = useQuery('inventoryStat', () => requests.getInventoryStat(id))

  // 🔄 Cell value changes
  const onCellValueChanged = (params) => {
    const { data, colDef, newValue, oldValue } = params

    if (colDef?.field === 'expired_date' && newValue !== oldValue) {
      const expire_date = newValue
      if (expire_date < 0) {
        errorScanAudio.play()
        refetchCurrentData()
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
        refetchCurrentData()
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
        refetchCurrentData()
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

  // ⌨️ Hotkeys
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
      enableOnFormTags: true,
    }
  )

  useHotkeys(
    '*',
    (event) => {
      let isexeption = document.activeElement.tagName === 'INPUT'
      if (selectedCellRowId || isexeption) return
      const key = event.key.toLowerCase()

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
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )

  useHotkeys(
    '*',
    (event) => {
      if (selectedCellRowId) return

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

  // 🔄 Effects
  useEffect(() => {
    if (selectedCellRowId) {
      setLastSelectedCellRowId(selectedCellRowId)
    }
  }, [selectedCellRowId])

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
    if (status === 'checking') {
      setTableType('LIGHT')
    } else {
      setTableType('MODERN')
    }
  }, [status])

  useEffect(() => {
    const count = currentViewData?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    currentRows?.map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
      methods.setValue(`net_amount_${get(importData, 'id')}`, get(importData, 'net_amount'))
    })
  }, [currentViewData?.data, values?.limit, currentRows])

  useEffect(() => {
    if (quantityModalOpen === false && typeof quantityModalOpen === 'boolean') {
      handleFocus()
    }
  }, [quantityModalOpen])

  useEffect(() => {
    if (displayData) {
      setRowData([...displayData])
    }
  }, [displayData])

  // Determine loading state
  const isLoading = isCurrentViewLoading || isInfiniteLoading

  return (
    <LoadingContainer readyState={!isfinishInventoryChecking && !hasChange}>
      {isLoading && <LoadingBlock zIndex={99} top={0} position={'absolute'} width={'100%'} left='0' />}
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
            {/* <NewLightTableForInventory
              setSelectedIndex={setSelectedIndex}
              selectedIndex={selectedIndex}
              rowRefs={rowRefs}
              lastRowRef={lastRowRef}
              isFetchingNextPage={isFetchingNextPage}
              data={displayData}
              inventoryWithCheckingDetails={currentViewData || { data: { data: { data: displayData } } }}
            /> */}
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

      <InventoryDetailModal setBarcode={setBarcode} refetch={refetchCurrentData} open={selectedCellRowId} setOpen={setSelectedCellRowId} />

      <ChangeQuantityModal
        setshouldICleanSearchQuery={setshouldICleanSearchQuery}
        setBarcode={setBarcode}
        refetch={refetchCurrentData}
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
          padding: '10px 20px',
        }}
      >
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
              onKeyDown={({ code }) => {
                console.log(code)
                code === 'Enter' && handleFocus()
              }}
              onChange={({ target }) => {
                if (shouldICleanSearchQuery) {
                  setBarcode(target.value.split('')?.at(-1))
                  setshouldICleanSearchQuery(false)
                  return
                }
                setBarcode(get(target, 'value'))
              }}
              id='producrs-search'
              name='search'
              disabled={status === 'checking'}
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
                { title: t('switch.title.all'), value: 'ALL', count: get(currentViewData, 'data.data.stats_count.all', 0) },
                {
                  title: t('switch.title.scanned_count'),
                  value: 'scanned',
                  count: get(currentViewData, 'data.data.stats_count.scanned', 0),
                },
                {
                  title: t('switch.title.shortage_count'),
                  value: 'shortage',
                  count: get(currentViewData, 'data.data.stats_count.shortage', 0),
                },
                {
                  title: t('switch.title.surplus_count'),
                  value: 'surplus',
                  count: get(currentViewData, 'data.data.stats_count.surplus', 0),
                },
                {
                  title: t('switch.title.zero_price'),
                  value: 'zero_price',
                  count: get(currentViewData, 'data.data.stats_count.zero_price', 0),
                },
                {
                  title: 'Проверка',
                  value: 'checking',
                  count: get(currentViewData, 'data.data.stats_count.zero_price', 0),
                },
              ]}
            />
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

      <UploadCV open={openUpload} setHasChange={setHasChange} refetch={refetchCurrentData} setOpen={setOpenUpload} />
    </LoadingContainer>
  )
}

export default InventoryWithCheckingPageNew
