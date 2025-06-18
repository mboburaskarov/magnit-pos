import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import './table.css'

import { Download } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { useMutation, useQuery } from 'react-query'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import Header from '../../../../components/Header'
import InputSearch from '../../../../components/Inputs/InputSearch'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import LoadingBlock from '../../../../components/LoadingBlock'
import { downloadLinkExcel } from '../../../../utils/downloadLinkEXCEL'
import { error } from '../../../../utils/toast'
import BarcodeIcon from '../../../assets/icons/BarcodeIcon'
import ChangeAdditionalsModal from './changeAdditionalsModal'
import ChangeQuantityModal from './changeQuantityModal'
import InventoryDetailModalNew from './inventoryDetailModalNew'
import NewLightTableForInventory from './newLightTableForInventory'

const LIMIT = 50

const InventoryWithCheckingPageNew = ({ onSelectRow = () => {} }) => {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [barcode, setBarcode] = useState('')
  const methods = useForm()
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })
  const [selectedCellRowId, setSelectedCellRowId] = useState(false)
  const [openChangeAdditionalsModel, setOpenChangeAdditionalsModel] = useState(false)
  const [lastSelectedCellRowId, setLastSelectedCellRowId] = useState(false)
  const [quantityModalOpen, setQuantityModalOpen] = useState(false)
  const [shouldICleanSearchQuery, setshouldICleanSearchQuery] = useState(false)
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [status, setStatus] = useState('ALL')
  const [debouncedSearchBarcode] = useDebounce(barcode, 200)

  const queryClient = useQueryClient()

  //
  const [selectedIndex, setSelectedIndex] = useState(0)
  const rowRefs = useRef([])
  const observerRef = useRef()
  const { id } = useParams()

  // 🔄 API call with limit/offset
  const fetchPage = async ({ pageParam = 0 }) => {
    const filter = {
      inventory_id: id,
      limit: barcode ? 50 : LIMIT,
      offset: pageParam,
      search: barcode,
      order: orderStoring.position === 1 ? `+${orderStoring.colId}` : orderStoring.position === 2 ? `-${orderStoring.colId}` : undefined,
      type: 'all',
    }
    const res = await requests.getInventoryDetails(filter).then((res) => {
      if (get(res, 'data.data.data', []).length === 1) {
        setQuantityModalOpen({ id: get(res, 'data.data.data.[0].id'), data: get(res, 'data.data.data.[0]') })
        setshouldICleanSearchQuery(true)
      }
      return res
      // setHasChange(false)
    })
    return { rows: res.data?.data?.data, total_data: res.data?.data?.total_data || [], nextOffset: pageParam + LIMIT }
  }

  // 🔄 useInfiniteQuery
  const { data, fetchNextPage, refetch, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    ['inventoryWithCheckingDetails', id, debouncedSearchBarcode, orderStoring],
    fetchPage,
    {
      getNextPageParam: (lastPage) => (lastPage.rows.length < LIMIT ? undefined : lastPage.nextOffset),
    }
  )

  // 🔁 Flatten all loaded rows
  const allRows = data?.pages?.flatMap((page) => page.rows) || []
  const rowCount = allRows.length

  // 🔼⬇️ Keyboard nav
  useHotkeys('up', () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1))
    const selectedRow = allRows[selectedIndex - 1]
    if (selectedRow) {
      setLastSelectedCellRowId(selectedRow.id)
    }
  })

  useHotkeys('down', () => {
    setSelectedIndex((prev) => Math.min(rowCount - 1, prev + 1))
    const selectedRow = allRows[selectedIndex + 1]
    if (selectedRow) {
      setLastSelectedCellRowId(selectedRow.id)
    }
  })

  useHotkeys('enter', () => {
    if (selectedCellRowId) return

    const selectedRow = allRows[selectedIndex]
    if (selectedRow) {
      console.log('Selected Row ID:', selectedRow.id, selectedRow.name)
      onSelectRow(selectedRow)
      setLastSelectedCellRowId(selectedRow.id)
      setQuantityModalOpen({ id: selectedRow.id, data: selectedRow })
      setshouldICleanSearchQuery(true)
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
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  //
  let currentOffset = Math.floor(selectedIndex / 50) * 50

  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryNumber, {
    onSuccess: ({ data }) => {
      handleRefetchPage(currentOffset)
      successScanAudio.play()
    },
    onError: (err) => {
      handleRefetchPage(currentOffset)
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

  const { mutate: inventoryExcelReport, isLoading: isinventoryExcelReport } = useMutation(requests.getInventoryExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })

  const { data: inventoryStat } = useQuery('inventoryStat', () => requests.getInventoryStat(id))

  useHotkeys(
    ['ctrl+Backspace', 'ctrl+delete'],
    (e) => {
      if (lastSelectedCellRowId && !selectedCellRowId) {
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
      let isexeption = document.activeElement.tagName == 'INPUT'
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

  useEffect(() => {
    if (rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Changed from 'nearest' to 'center'
      })
    }
  }, [selectedIndex])

  useHotkeys(
    'ctrl+shift',
    () => {
      if (lastSelectedCellRowId) {
        setSelectedCellRowId(lastSelectedCellRowId)
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      preventDefault: true,
    }
  )
  useHotkeys(
    'shift',
    () => {
      if (selectedCellRowId) return

      const selectedRow = allRows[selectedIndex]
      if (selectedRow) {
        console.log('Selected Row ID:', selectedRow.id, selectedRow.name)
        onSelectRow(selectedRow)
        setLastSelectedCellRowId(selectedRow.id)
        setOpenChangeAdditionalsModel({ id: selectedRow.id, data: selectedRow })
        setshouldICleanSearchQuery(true)
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      preventDefault: true,
    }
  )

  // 🔄 Function to refetch a specific page
  const refetchSpecificPage = async (targetOffset) => {
    try {
      // Fetch the specific page
      const pageData = await fetchPage({ pageParam: targetOffset })

      // Update the query cache for the specific page
      queryClient.setQueryData(['inventoryWithCheckingDetails', id, debouncedSearchBarcode, orderStoring], (oldData) => {
        if (!oldData) return { pages: [pageData], pageParams: [targetOffset] }

        // Replace or append the page corresponding to targetOffset
        const updatedPages = oldData.pages.map((page) => (page.nextOffset === targetOffset + LIMIT ? pageData : page))

        // If the page doesn't exist in the cache, append it
        if (!updatedPages.some((page) => page.nextOffset === targetOffset + LIMIT)) {
          updatedPages.push(pageData)
        }

        return {
          ...oldData,
          pages: updatedPages,
          pageParams: oldData.pageParams.map((param, index) => (updatedPages[index]?.nextOffset - LIMIT === targetOffset ? targetOffset : param)),
        }
      })
    } catch (err) {
      console.error('Error refetching page:', err)
      error('Ошибка при обновлении страницы!')
    }
  }

  // Example: Trigger refetch for offset=150
  const handleRefetchPage = (offset = 0) => {
    refetchSpecificPage(offset) // Refetch only the page for offset=150
  }
  return (
    <LoadingContainer readyState={!isfinishInventoryChecking}>
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
            <NewLightTableForInventory
              setSelectedIndex={setSelectedIndex}
              selectedIndex={selectedIndex}
              rowRefs={rowRefs}
              setLastSelectedCellRowId={setLastSelectedCellRowId}
              lastRowRef={lastRowRef}
              isFetchingNextPage={isFetchingNextPage}
              data={allRows}
              inventoryWithCheckingDetails={data}
            />
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
      <InventoryDetailModalNew setBarcode={setBarcode} refetch={refetch} open={selectedCellRowId} setOpen={setSelectedCellRowId} />
      <ChangeQuantityModal
        selectedIndex={selectedIndex}
        setshouldICleanSearchQuery={setshouldICleanSearchQuery}
        setBarcode={setBarcode}
        refetch={handleRefetchPage}
        selectedCellRowId={selectedCellRowId}
        open={quantityModalOpen}
        setOpen={setQuantityModalOpen}
      />
      <ChangeAdditionalsModal
        selectedIndex={selectedIndex}
        setshouldICleanSearchQuery={setshouldICleanSearchQuery}
        setBarcode={setBarcode}
        refetch={handleRefetchPage}
        selectedCellRowId={selectedCellRowId}
        open={openChangeAdditionalsModel}
        setOpen={setOpenChangeAdditionalsModel}
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
                if (code === 'Enter') {
                  document.activeElement.blur()
                }
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
              disabled={status == 'checking'}
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
                { title: t('switch.title.all'), value: 'ALL', count: 0 },
                {
                  title: t('switch.title.scanned_count'),
                  value: 'scanned',
                  count: 0,
                },
                {
                  title: t('switch.title.shortage_count'),
                  value: 'shortage',
                  count: 0,
                },
                {
                  title: t('switch.title.surplus_count'),
                  value: 'surplus',
                  count: 0,
                },
                {
                  title: t('switch.title.zero_price'),
                  value: 'zero_price',
                  count: 0,
                },
                {
                  title: 'Проверка',
                  value: 'checking',
                  count: 0,
                },
              ]}
            />
          </Box>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: 'gray.50',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
          }}
          alignItems={'center'}
        >
          <LoadingButton
            loading={isinventoryExcelReport}
            onClick={() => {
              inventoryExcelReport({ limit: 1000000 })
            }}
          >
            <Download />
          </LoadingButton>
        </Box>
      </Box>
    </LoadingContainer>
  )
}

export default InventoryWithCheckingPageNew
