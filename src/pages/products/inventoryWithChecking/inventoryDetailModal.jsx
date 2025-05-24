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
import tableHeaderSelector from './tableHeaderSelector'

export default function InventoryDetailModal({ open, refetch, setOpen }) {
  const methods = useForm()
  const errorScanAudio = new Audio(errorAudio)

  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const dispatch = useDispatch()
  const childRef = useRef()
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
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryFlowNumber, {
    onSuccess: ({ data }) => {
      refetch()
      // fetchStatusCountList()
      // setBarcode('')
    },
    onError: (err) => {
      refetch()

      error('Ошибка при сканирование!')
    },
  })
  const handleFocus = () => {
    const firstrowid = inventoryDetailFlow?.data?.data?.data?.[0]?.id
    // Call the exposed method: focus row with id 'b2' on column 'qty'
    childRef.current?.focusCellByRowId(firstrowid, 'fact_quantity')
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

    if (colDef?.field === 'fact_quantity' && newValue !== oldValue) {
      const fact_quantity = newValue
      if (fact_quantity < 0) {
        errorScanAudio.play()
        refetchInventoryDetailFlow()

        error('Количество не может быть меньше 0!')
        return
      }
      setScanedNumber({
        id,
        product_id: get(data, 'product_id'),
        type: 'MANUAL',
        fact_unit: get(data, 'fact_unit'),
        fact_quantity: Number(fact_quantity),
      })
    }
    if (colDef?.field === 'fact_unit' && newValue !== oldValue) {
      const fact_unit = newValue
      if (fact_unit > get(data, 'unit_per_pack')) {
        errorScanAudio.play()
        refetchInventoryDetailFlow()
        error(`Количество не может быть больше количества в упаковке! (max:${get(data, 'unit_per_pack')})`)
        return
      }
      if (fact_unit < 0) {
        errorScanAudio.play()
        refetchInventoryDetailFlow()

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
  }
  useHotkeys(
    '*',
    (event) => {
      // if (selectedCellRowId) return

      if (event.code === 'NumpadSubtract' || event.code === 'NumpadAdd') {
        handleFocusUnit()
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
    </StyledEmptyDialog>
  )
}
