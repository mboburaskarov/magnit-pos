import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UploadFile } from '@mui/icons-material'
import { Box, Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
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
import overplusAudio from '../../../assets/audio/overplus.mp3'
import ArrowDown from '../../../assets/icons/ArrowDown'
import ArrowUp from '../../../assets/icons/ArrowUp'
import BarcodeIcon from '../../../assets/icons/BarcodeIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/inventoryWithCheckingTableColumns'
import InventoryDashboard from './inventoryDashboard'
import InventoryDetailModal from './inventoryDetailModal'
import tableHeaderSelector from './tableHeaderSelector'
import UploadCV from './uploadCV'
const SELECTION_ID = 'checkboxSelectionField'

export default function InventoryWithCheckingPage() {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const overplusScanAudio = new Audio(overplusAudio)
  const [openUpload, setOpenUpload] = useState(false)
  const [hasChange, setHasChange] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const childRef = useRef()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.inventoryWithCheckingColumns)
  const { values } = useQueryParams()
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)
  const [barcode, setBarcode] = useState('')
  const methods = useForm()
  const [selectedCellRowId, setSelectedCellRowId] = useState(null)
  const [hasTableChange, setHasTableChange] = useState(false)
  const [appType, setAppType] = useState('ALL')
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [status, setStatus] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [manualNumber, setManualNumber] = useState(1)
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedInventoryNumber, {
    onSuccess: ({ data }) => {
      // refetch()
      // fetchStatusCountList()
      setBarcode('')
    },
    onError: (err) => {
      refetch()

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
    // Call the exposed method: focus row with id 'b2' on column 'qty'
    childRef.current?.focusCellByRowId(firstrowid, 'fact_quantity')
  }
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    editable: true,

    id,
    setScanedNumber,
  })
  const inventoryWithCheckingDetailsFilter = useMemo(() => {
    return {
      inventory_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
      type: status,
    }
  }, [values?.offset, status, values?.limit, id, barcode])

  // const {
  //   data: inventoryDetails,
  //   isLoading: inventoryDetailsLoading,
  //   isFetching: isFetchinginventoryDetails,
  //   refetch,
  // } = useQuery(['inventoryDetails', inventoryWithCheckingDetailsFilter], () => requests.getInventoryDetails(inventoryWithCheckingDetailsFilter))

  const {
    data: inventoryWithCheckingDetails,
    isLoading: inventoryWithCheckingDetailsLoading,
    isFetching: isFetchinginventoryWithCheckingDetails,
    refetch,
  } = useQuery(['inventoryWithCheckingDetails', inventoryWithCheckingDetailsFilter], () => requests.getInventoryDetails(inventoryWithCheckingDetailsFilter))
  useEffect(() => {
    console.log(selectedCellRowId)

    if (selectedCellRowId) return
    const focustimeout = () =>
      setTimeout(() => {
        handleFocus()
      }, 100)
    focustimeout()
    return clearTimeout(focustimeout)
  }, [inventoryWithCheckingDetailsLoading, selectedCellRowId])
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
    console.log(colDef?.field, newValue, oldValue)

    if (colDef?.field === 'fact_quantity' && newValue !== oldValue) {
      const fact_quantity = newValue
      setScanedNumber({
        id,
        product_id: get(data, 'id'),
        type: 'MANUAL',
        fact_quantity: Number(fact_quantity),
      })
    }
    if (colDef?.field === 'fact_unit' && newValue !== oldValue) {
      const fact_unit = newValue
      setScanedNumber({
        id,
        product_id: get(data, 'id'),
        type: 'MANUAL',
        fact_unit: Number(fact_unit),
      })
    }
  }
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
          <Box
            onClick={() => {
              handleFocus()
            }}
          >
            fdf
          </Box>
          <Box
            sx={{
              m: ' 0 0 20px',
              userSelect: 'none !important',
              cursor: 'pointer',
              '& > p': {
                cursor: 'pointer',
                userSelect: 'none !important',
              },
            }}
            display={'flex'}
            onClick={() => setIsOpenStatDashboard((p) => !p)}
          >
            {isOpenStatDashboard ? <ArrowUp color='#111217' /> : <ArrowDown />}
            <Typography sx={{ fontWeight: '600', whiteSpace: 'pre' }}>{isOpenStatDashboard ? 'Скрыть статистику' : 'Показать статистику'}</Typography>
          </Box>
          {isOpenStatDashboard && <InventoryDashboard setHasChange={setHasChange} data={get(inventoryStat, 'data.data')} />}
          <Box display={'flex'} minWidth={320}>
            <InputSwitch
              uncontrolled
              id='status'
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
                    // onKeyDown={({ code }) => code === 'Enter' && sendScannedImport()}
                    onChange={({ target }) => setBarcode(get(target, 'value'))}
                    id='producrs-search'
                    name='search'
                    value={barcode}
                    setSearchTerm={setBarcode}
                    placeholder={t('input.search.product.multi')}
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

            <Box sx={{ '& .MuiTextField-root': { bgcolor: 'transparent !important' } }}>
              <AgGridTable
                selectedCellRowId={setSelectedCellRowId}
                id='imports-main-table'
                tableSettings
                childRef={childRef}
                enableFillHandle={true}
                canCellClick={true}
                onCellValueChanged={onCellValueChanged}
                columns={tableColumns}
                data={inventoryWithCheckingDetails?.data?.data?.data || []}
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
                status={appType}
                isRefreshing={loading || hasTableChange || isFetchinginventoryWithCheckingDetails || inventoryWithCheckingDetailsLoading}
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

      <UploadCV open={openUpload} setHasChange={setHasChange} refetch={refetch} setOpen={setOpenUpload} />
    </LoadingContainer>
  )
}
