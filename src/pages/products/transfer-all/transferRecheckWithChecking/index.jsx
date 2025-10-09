import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Container, Typography } from '@mui/material'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../../components/ConfirmDialog'
import Header from '../../../../../components/Header'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import InputSwitch from '../../../../../components/Inputs/InputSwitch'
import LoadingContainer from '../../../../../components/LoadingContainer'
import { downloadLinkExcel } from '../../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../../utils/requests'
import { error } from '../../../../../utils/toast'
import ArrowDown from '../../../../assets/icons/ArrowDown'
import ArrowUp from '../../../../assets/icons/ArrowUp'
import BarcodeIcon from '../../../../assets/icons/BarcodeIcon'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../../redux-toolkit/tableSlices/transferRecheckWithCheckingTableColumns'
import DublicateProductBarcode from './dublicateBarcode'
import tableHeaderSelector from './tableHeaderSelector'
import WriteOffDashboard from './writeOffDashboard'
const SELECTION_ID = 'checkboxSelectionField'

export default function TransferRecheckScanWithCheckingPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.transferRecheckWithCheckingColumns)
  const { values } = useQueryParams()
  const [inputType, setInputType] = useState('scanner')
  const [openDublicateBarcodeModal, setopenDublicateBarcodeModal] = useState(false)

  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)
  const [barcode, setBarcode] = useState('')
  const methods = useForm()
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [offsetCount, setOffsetCount] = useState(0)
  const { mutate: setScanedNumber } = useMutation(requests.sendScannedTransferNumber, {
    onSuccess: ({ data }) => {
      refetchgetReturnToWarehouseDashBoard()
      setBarcode('')
    },
    onError: (err) => {
      refetch()

      error('Ошибка при сканирование!')
    },
  })

  const { mutate: finishTransferChecking, isLoading: isfinishTransferChecking } = useMutation(requests.finishTransferChecking, {
    onSuccess: ({ data }) => {
      navigate('/products/transfer')
    },
    onError: (err) => {
      error('Ошибка при завершение импорта!')
    },
  })
  const { mutate: updateByBarcode } = useMutation(requests.updateTransferByBarcode, {
    onSuccess: ({ data, ...other }) => {
      if (get(other, 'status') == 207) {
        setopenDublicateBarcodeModal(data)
      } else {
        refetchgetReturnToWarehouseDashBoard()
        setBarcode('')
        refetch()
      }
    },
    onError: (err) => {
      refetch()

      error('Ошибка при сканирование!')
    },
  })

  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,

    id,
    updateByBarcode,
    setScanedNumber,
  })
  const transferWithCheckingDetailsFilter = useMemo(() => {
    return {
      transfer_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
    }
  }, [id, inputType == 'search' ? barcode : null, values?.limit, values?.offset])

  const { data: getReturnToWarehouseDashBoard, refetch: refetchgetReturnToWarehouseDashBoard } = useQuery(['getReturnToWarehouseDashBoard', id], () =>
    requests.getTransferDashBoard(id)
  )

  const {
    data: transferWithCheckingDetails,
    isLoading: transferWithCheckingDetailsLoading,
    isFetching: isFetchingtransferWithCheckingDetails,
    refetch,
  } = useQuery(['transferWithRecheckCheckingDetails', transferWithCheckingDetailsFilter], () => requests.getTransferDetails(transferWithCheckingDetailsFilter))

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
  }, [transferWithCheckingDetailsFilter])

  useEffect(() => {
    const count = transferWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(transferWithCheckingDetails, 'data.data.data', []).map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
    })
  }, [transferWithCheckingDetails?.data, values?.limit])
  const { mutate: getReturnToWarehouseDetailsExcelReport, isLoading: isgetReturnToWarehouseDetailsExcelReport } = useMutation(
    requests.getTransferDetailsExcelReport,
    {
      onSuccess: ({ data }) => {
        downloadLinkExcel(get(data, 'data.file_name'))
      },
      onError: (err) => {
        console.log(err)

        error('Ошибка при скачать excel!')
      },
    }
  )
  return (
    <LoadingContainer readyState={!isfinishTransferChecking}>
      <FormProvider {...methods}>
        <Header
          onSubmit={() => setOpenFinishConfirmDialog(true)}
          isLoading={false}
          buttonText='Завершить'
          backIcon
          backHref='/products/transfer'
          text={'Перемещение с проверкой'}
          checkAccessId={'product-create'}
        />

        <Container>
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
          {isOpenStatDashboard && <WriteOffDashboard data={get(getReturnToWarehouseDashBoard, 'data.data')} />}
          <DublicateProductBarcode refetch={refetch} open={openDublicateBarcodeModal} setOpen={setopenDublicateBarcodeModal} />

          <Box display='flex' flexDirection='column' position='relative' pt={'24px'} pb={'20px'}>
            <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
              <Box
                width='80%'
                sx={{
                  display: 'flex',

                  '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                  '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                    background: 'transparent',
                    width: '100%',
                    height: 48,
                  },
                }}
              >
                <InputSearch
                  icon={<BarcodeIcon />}
                  onChange={({ target }) => setBarcode(get(target, 'value'))}
                  id='producrs-search'
                  name='search'
                  onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                      updateByBarcode({ transferId: id, barcode: get(e, 'target.value'), status: 'checking', type: 'transfer' })
                    }
                  }}
                  value={barcode}
                  setSearchTerm={setBarcode}
                  placeholder={t('input.search.product.multi')}
                />
                <Box mr={'20px'} />
                <InputSwitch
                  id='client-scanner'
                  noMarginTop
                  uncontrolled
                  required
                  name='scanner'
                  onChange={(e) => setInputType(e)}
                  defaultValue='scanner'
                  options={[
                    {
                      title: 'Сканер',
                      value: 'scanner',
                    },
                    {
                      title: 'Поиск',
                      value: 'search',
                    },
                  ]}
                />
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
                fullDownload={() => getReturnToWarehouseDetailsExcelReport({ ...transferWithCheckingDetailsFilter, offset: 0, limit: 1000000 })}
                downloadByFilter={() => getReturnToWarehouseDetailsExcelReport(transferWithCheckingDetailsFilter)}
                data={transferWithCheckingDetails?.data?.data?.data || []}
                totalCount={transferWithCheckingDetails?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingtransferWithCheckingDetails || transferWithCheckingDetailsLoading}
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
                status={'ALL'}
                isRefreshing={loading || isFetchingtransferWithCheckingDetails || transferWithCheckingDetailsLoading}
              />
            </Box>
          </Box>
        </Container>
      </FormProvider>
      <ConfirmDialog
        open={openFinishConfirmDialog}
        setOpen={() => setOpenFinishConfirmDialog(false)}
        icon={<FontAwesomeIcon icon={faExclamationTriangle} sx={{ fontSize: 41, color: 'yellow.400' }} />}
        title={t('alerts.finish_return')}
        desc={
          <>
            <Typography fontWeight={'600'} fontSize={'20px'}>
              {t('alerts.finish_return_desc')}
            </Typography>
            <Typography fontWeight={'600'} sx={{ color: 'red.500' }}>
              {t('alerts.finish_return_warning')}
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
                finishTransferChecking(id)
              }}
              isLoading={false}
            >
              {t('buttons.yes_complete')}
            </Button>
          </>
        }
      />
    </LoadingContainer>
  )
}
