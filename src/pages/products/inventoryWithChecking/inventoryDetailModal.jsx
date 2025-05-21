import { Box } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import StyledEmptyDialog from '../../../../components/Dialogs/StyledeEmptyDialog'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/inventoryWithCheckingTableColumns'
import tableHeaderSelector from './tableHeaderSelector'

export default function InventoryDetailModal({ open, refetch, setOpen }) {
  const methods = useForm()
  const { reset, control } = methods
  const [startDate, setStartDate] = useState(0)
  const dispatch = useDispatch()

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
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      product_id: open || undefined,
    }
  }, [values?.offset, open, values?.limit, id])

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

    // get(inventoryDetailFlow, 'data.data.data', []).map((importData) => {
    //   methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
    // })
  }, [inventoryDetailFlow?.data, values?.limit])
  const onError = (err) => {
    error('Пожалуйста, заполните все поля!')
    console.log('err', err)
  }

  useEffect(() => {
    reset({}, { keepDirty: true })
  }, [open])
  const theme = useTheme()
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryNumber, {
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

  const onCellValueChanged = (params) => {
    const { data, colDef, newValue, oldValue } = params
    console.log(colDef?.field, data, newValue, oldValue)

    if (colDef?.field === 'fact_quantity' && newValue !== oldValue) {
      const fact_quantity = newValue
      setScanedNumber({
        id,
        product_id: get(data, 'product_id'),
        type: 'MANUAL',
        fact_quantity: Number(fact_quantity),
      })
    }
    if (colDef?.field === 'fact_unit' && newValue !== oldValue) {
      const fact_unit = newValue
      setScanedNumber({
        id,
        product_id: get(data, 'product_id'),
        type: 'MANUAL',
        fact_unit: Number(fact_unit),
      })
    }
  }
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
            enableFillHandle={true}
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
