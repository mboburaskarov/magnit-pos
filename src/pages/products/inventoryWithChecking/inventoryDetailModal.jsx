import { Box } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import errorAudio from '../../../assets/audio/error.mp3'
import CloseIcon from '../../../assets/icons/CloseIcon'

import { useQueryParams } from '../../../hooks/useQueryParams'
import { resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/inventoryWithCheckingTableColumns'
import ChangeTransitionQuantityModal from './changeTransitionQuantityModal'
import tableHeaderSelector from './tableHeaderSelector'

export default function InventoryDetailModal({ open, refetch, barcode, setBarcode, setOpen }) {
  const methods = useForm()
  const errorScanAudio = new Audio(errorAudio)

  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const dispatch = useDispatch()
  const childRef = useRef()
  const [quantityTransitionModalOpen, setQuantityTransitionModalOpen] = useState(false)

  const [lastSelectedCellRowId, setLastSelectedCellRowId] = useState(null)
  const [realTimeSelectedCellRowId, setRealTimeSelectedCellRowId] = useState(null)
  const [endDate, setEndDate] = useState(0)
  const [offsetCount, setOffsetCount] = useState(0)
  const { mutate: createBonusProduct, isLoading: iscreateBonusProduct } = useMutation(requests.createBonusProduct, {
    onSuccess: () => {
      setOpen(false)
      success('Создать автозаказ')
      refetch()
    },
    onError: (err) => {
      error('Ошибка Создать автозаказ!')
      console.log('err', err)
    },
  })
  const { t } = useTranslation()
  const { values } = useQueryParams()
  const { id } = useParams()

  const { columns, loading } = useSelector((state) => state.inventoryWithCheckingColumns)
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    level: 2,

    editable: true,

    id,
    setScanedNumber: () => {},
  })
  const onSubmit = (data) => {
    const requestBody = {
      product_id: data.product.value,
      bonus_amount: data.bonus_amount,
      start_date: startDate != 0 ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
      end_date: endDate != 0 ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
    }
    createBonusProduct(requestBody)
  }
  const inventoryDetailFlowFilter = useMemo(() => {
    return {
      inventory_id: id,
      flowLimit: values?.flowLimit || 10,
      flowOffset: values?.flowOffset || 0,
      product_id: open || undefined,
    }
  }, [values?.flowOffset, open, values?.flowLimit, id])

  const {
    data: inventoryDetailFlow,
    isLoading: inventoryDetailFlowLoading,
    isFetching: isFetchinginventoryDetailFlow,
    refetch: refetchInventoryDetailFlow,
  } = useQuery(['getInventoryDetailFlow', inventoryDetailFlowFilter], () => requests.getInventoryDetailFlow(inventoryDetailFlowFilter), { enabled: !!open })

  useEffect(() => {
    const count = inventoryDetailFlow?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(inventoryDetailFlow, 'data.data.data', [])?.map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
    })
  }, [inventoryDetailFlow?.data, values?.limit])
  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.log('err', err)
  }
  useEffect(() => {
    if (!quantityTransitionModalOpen) {
      handleFocus()
    }
  }, [quantityTransitionModalOpen])
  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryFlowNumber, {
    onSuccess: ({ data }) => {
      refetch()
      refetchInventoryDetailFlow()
      // fetchStatusCountList()
      // setBarcode('')
    },
    onError: (err) => {
      refetch()

      error('Ошибка при сканирование!')
    },
  })
  const handleFocus = () => {
    const firstrowid = inventoryDetailFlow?.data?.data?.data[0]?.id
    const activeEl = document.activeElement
    console.log(activeEl)

    const classList = activeEl?.classList || []
    console.log(lastSelectedCellRowId)

    if (classList.contains('ag-cell')) {
      if (inventoryDetailFlow?.data?.data?.data.length == 1) {
        setQuantityTransitionModalOpen({ id: firstrowid, data: inventoryDetailFlow?.data?.data?.data[0] })
        return
      } else if (lastSelectedCellRowId) {
        setQuantityTransitionModalOpen({
          id: firstrowid,
          data: inventoryDetailFlow?.data?.data?.data.find((item) => item?.id == lastSelectedCellRowId),
        })
        return
      }
    }
    // Call the exposed method: focus row with id 'b2' on column 'qty'
    if (lastSelectedCellRowId != null && inventoryDetailFlow?.data?.data?.data?.some((el) => el?.id === lastSelectedCellRowId)) {
      childRef.current?.focusCellByRowId(lastSelectedCellRowId, 'fact_quantity')
    } else {
      setLastSelectedCellRowId(firstrowid)
      childRef.current?.focusCellByRowId(firstrowid, 'fact_quantity')
    }
  }
  const handleFocusUnit = () => {
    setLastSelectedCellRowId(lastSelectedCellRowId)

    childRef.current?.focusCellByRowId(lastSelectedCellRowId, 'fact_unit')
  }
  useEffect(() => {
    if (!open) return
    const focustimeout = () =>
      setTimeout(() => {
        handleFocus()
      }, 100)
    focustimeout()
    setLastSelectedCellRowId(inventoryDetailFlow?.data?.data?.data?.[0]?.id)
    return clearTimeout(focustimeout)
  }, [inventoryDetailFlowLoading, open])

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
      // if (selectedCellRowId) return

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
        }}
      >
        <Box sx={{ '& .MuiTextField-root': { bgcolor: 'transparent !important' } }}>
          <AgGridTable
            id='imports-main-table'
            tableSettings
            childRef={childRef}
            gettingId='id'
            limitQuery='flowLimit'
            offsetQuery='flowOffset'
            enableFillHandle={true}
            realTimeSelectedCellRowId={({ id, rowId }) => {
              setLastSelectedCellRowId(rowId)
            }}
            onChangeSelectedCellRowId={(id) => {
              console.log('fff', rowId)

              if (id == 'flow') setLastSelectedCellRowId(id)
            }}
            custonName='flow'
            canCellClick={true}
            onCellValueChanged={onCellValueChanged}
            columns={tableColumns}
            data={inventoryDetailFlow?.data?.data?.data || []}
            totalCount={inventoryDetailFlow?.data?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchinginventoryDetailFlow || inventoryDetailFlowLoading}
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
            // status={appType}
            isRefreshing={loading || isFetchinginventoryDetailFlow || inventoryDetailFlowLoading}
          />
        </Box>
      </Box>
      <ChangeTransitionQuantityModal
        setBarcode={setBarcode}
        refetch={() => {
          refetch(), refetchInventoryDetailFlow()
        }}
        open={quantityTransitionModalOpen}
        setOpen={setQuantityTransitionModalOpen}
      />
    </StyledEmptyDialog>
  )
}
