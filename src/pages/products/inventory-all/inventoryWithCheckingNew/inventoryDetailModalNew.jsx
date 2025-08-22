import { Box } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useInfiniteQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { requests } from '../../../../../utils/requests'
import errorAudio from '../../../../assets/audio/error.mp3'
import successAudio from '../../../../assets/audio/normal.mp3'

import { useTheme } from '@emotion/react'
import { useMutation } from 'react-query'
import StyledEmptyDialog from '../../../../../components/Dialogs/StyledeEmptyDialog'
import { error } from '../../../../../utils/toast'
import CloseIcon from '../../../../assets/icons/CloseIcon'
import ChangeFlowAdditionalsModal from './changeFlowAdditionalsModal'
import ChangeFlowQuantityModal from './changeFlowQuantityModal'
import NewLightTableForInventory from './newLightTableForInventory'

const LIMIT = 50

const InventoryDetailModalNew = ({ open, barcode, setBarcode, setOpen, onSelectRow = () => {} }) => {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const theme = useTheme()
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const [lastSelectedCellRowId, setLastSelectedCellRowId] = useState(false)
  const [quantityModalOpen, setQuantityModalOpen] = useState(false)
  const [openChangeAdditionalsModel, setOpenChangeAdditionalsModel] = useState(false)

  const [debouncedSearchBarcode] = useDebounce(barcode, 200)

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
      product_id: open || undefined,
      type: 'all',
    }
    const res = await requests.getInventoryDetailFlow(filter).finally((a) => {})
    return { rows: res.data?.data?.data, total_data: res.data?.data?.total_data || [], nextOffset: pageParam + LIMIT }
  }

  // 🔄 useInfiniteQuery
  const {
    data,
    fetchNextPage,
    refetch: refetchFlow,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(['getInventoryDetailFlow', id, debouncedSearchBarcode], fetchPage, {
    enabled: !!open,
    getNextPageParam: (lastPage) => (lastPage.rows.length < LIMIT ? undefined : lastPage.nextOffset),
  })

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
    if (!open) return
    const selectedRow = allRows[selectedIndex]
    if (selectedRow) {
      console.log('Selected Row ID:', selectedRow.id, selectedRow.name)
      onSelectRow(selectedRow)
      setLastSelectedCellRowId(selectedRow.id)
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
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  //

  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryFlowNumber, {
    onSuccess: ({ data }) => {
      refetchFlow()
      successScanAudio.play()
    },
    onError: (err) => {
      refetchFlow()
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })

  useHotkeys(
    ['ctrl+Backspace', 'ctrl+delete'],
    (e) => {
      if (lastSelectedCellRowId && open) {
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

  useEffect(() => {
    if (rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Changed from 'nearest' to 'center'
      })
    }
  }, [selectedIndex])
  useHotkeys(
    'shift',
    () => {
      if (!lastSelectedCellRowId || !open) {
        return
      }

      const selectedRow = allRows[selectedIndex]
      if (selectedRow) {
        console.log('Selected Row ID:', selectedRow.id, selectedRow.name)
        onSelectRow(selectedRow)
        setLastSelectedCellRowId(selectedRow.id)
        setOpenChangeAdditionalsModel({ id: selectedRow.id, data: selectedRow })
      }
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA'],
      preventDefault: true,
    }
  )

  return (
    <StyledEmptyDialog
      overflowVisible
      maxWidth='2000px'
      onClose={() => setOpen(false)}
      open={open}
      title={''}
      customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
    >
      <Box
        sx={{
          width: '100%',
          padding: '24px',
          '& .MuiInputBase-root': {
            border: `2px solid`,
            borderColor: 'bunker.100',
            height: '48px',
          },
          '& svg': {
            fill: '#868FAA',
            stroke: '#868FAA',
          },
          '& .flow-wrapper > .table-container': {
            height: '30vh !important',
            maxHeight: '55vh !important',
          },
        }}
      >
        <Box
          className='flow-wrapper'
          sx={{
            '& .MuiTextField-root': { bgcolor: 'transparent !important' },
          }}
        >
          <NewLightTableForInventory
            setSelectedIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
            rowRefs={rowRefs}
            setLastSelectedCellRowId={setLastSelectedCellRowId}
            lastRowRef={lastRowRef}
            isFetchingNextPage={isFetchingNextPage}
            data={allRows}
            inventoryWithCheckingDetails={data}
            orderStoring={orderStoring}
            setOrderStoring={setOrderStoring}
          />
        </Box>
      </Box>
      <ChangeFlowQuantityModal setBarcode={setBarcode} refetch={refetchFlow} open={quantityModalOpen} setOpen={setQuantityModalOpen} />
      <ChangeFlowAdditionalsModal setBarcode={setBarcode} refetch={refetchFlow} open={openChangeAdditionalsModel} setOpen={setOpenChangeAdditionalsModel} />
    </StyledEmptyDialog>
  )
}

export default InventoryDetailModalNew
