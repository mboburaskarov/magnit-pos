import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/transferSentWithCheckingTableColumns'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '@components/ConfirmDialog'
import Header from '@components/Header'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueryParams } from '@hooks/useQueryParams'
import ArrowDown from '@icons/ArrowDown'
import ArrowUp from '@icons/ArrowUp'
import BarcodeIcon from '@icons/BarcodeIcon'
import { Box, Button, Container, Typography } from '@mui/material'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import { requests } from '@utils/requests'
import { error } from '@utils/toast'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import tableHeaderSelector from './tableHeaderSelector'
import WriteOffDashboard from './writeOffDashboard'
import NumberFormatInput from '@components/Inputs/OutLineTextFieldThousand'
import InputSwitch from '@components/Inputs/InputSwitch'
import DublicateProductBarcode from './dublicateBarcode'

export default function TransferSentScanWithCheckingPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.transferSentWithCheckingColumns)
  const { values } = useQueryParams()
  const [openDublicateBarcodeModal, setopenDublicateBarcodeModal] = useState(false)

  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)
  const [barcode, setBarcode] = useState('')
  const [scanCount, setScanCount] = useState(1)
  const [inputType, setInputType] = useState('scanner')

  const methods = useForm()
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [offsetCount, setOffsetCount] = useState(0)
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedTransferNumber, {
    onSuccess: ({ data }) => {
      refetchgetReturnToWarehouseDashBoard()
      setBarcode('')
      refetch()
    },
    onError: (err) => {
      refetch()
      if (get(err, 'response.data.data').includes('expected_count')) {
        error('Вы добавили больше, чем в астатке.')
        return
      }

      error('Ошибка при сканирование!')
    },
  })

  const { mutate: finishWriteOffChecking, isLoading: isfinishWriteOffChecking } = useMutation(requests.SentTransferChecking, {
    onSuccess: ({ data }) => {
      navigate('/products/transfer')
    },
    onError: (err) => {
      if (err.response.data.code == 409) {
        error(`
          Осталось ${get(err, 'response.data.data.available_quantity')} остатков лекарств в "${get(err, 'response.data.data.name')}"
          `)
        return
      }
      error('Ошибка при завершение Перемещение!')
    },
  })
  const tableColumns = tableHeaderSelector({
    transferColumsn: columns,
    values,
    methods,
    setScanedNumber,
  })

  const transferWithCheckingDetailsFilter = useMemo(() => {
    return {
      transfer_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
    }
  }, [id, values?.limit, values?.offset, inputType == 'search' ? barcode : null])

  const { data: getReturnToWarehouseDashBoard, refetch: refetchgetReturnToWarehouseDashBoard } = useQuery(['getReturnToWarehouseDashBoard', id], () =>
    requests.getTransferDashBoard(id)
  )

  const {
    data: transferWithCheckingDetails,
    isLoading: transferWithCheckingDetailsLoading,
    isFetching: isFetchingtransferWithCheckingDetails,
    refetch,
  } = useQuery(['transferWithSentCheckingDetails', transferWithCheckingDetailsFilter], () => requests.getTransferDetails(transferWithCheckingDetailsFilter))

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })

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

  const { mutate: getTransferDetailsExcelReport, isLoading: isgetTransferDetailsExcelReport } = useMutation(requests.getTransferDetailsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  const { mutate: updateTransferByBarcode } = useMutation(requests.updateTransferByBarcode, {
    onSuccess: ({ data, ...other }) => {
      refetch()
      if (get(other, 'status') == 207) {
        setopenDublicateBarcodeModal({ ...data, count: scanCount || 1 })
      } else {
        refetchgetReturnToWarehouseDashBoard()
        setBarcode('')
      }
    },
    onError: (err) => {
      refetch()

      error('Ошибка при сканирование!')
    },
  })
  return (
    <LoadingContainer readyState={!isfinishWriteOffChecking}>
      <FormProvider {...methods}>
        <Header
          onSubmit={() => setOpenFinishConfirmDialog(true)}
          isLoading={false}
          buttonText='Создать'
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
                width='50%'
                sx={{
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
                  onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                      if (inputType == 'search') return
                      updateTransferByBarcode({ transferId: id, barcode: get(e, 'target.value'), type: 'MANUAL', status: 'send', count: scanCount || 1 })
                    }
                  }}
                  name='search'
                  value={barcode}
                  setSearchTerm={setBarcode}
                  placeholder={t('input.search.product.multi')}
                />
              </Box>
              <Box
                sx={{
                  ml: '20px',
                  '& .MuiInputBase-root': {
                    backgroundColor: 'bg.10',
                  },
                }}
              >
                <NumberFormatInput
                  setValue={(e) => setScanCount(e)}
                  value={scanCount}
                  type={'number'}
                  fullWidth
                  name='scan-count'
                  label={''}
                  uncontrolled
                  placeholder='кол-во'
                />
              </Box>
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
                defaultOffsetIndex={Number(values?.offset / values?.limit + 1 || 1)}
                fullDownload={() => getTransferDetailsExcelReport({ ...transferWithCheckingDetailsFilter, offset: 0, limit: 1000000 })}
                downloadByFilter={() => getTransferDetailsExcelReport(transferWithCheckingDetailsFilter)}
                data={transferWithCheckingDetails?.data?.data?.data || []}
                totalCount={transferWithCheckingDetails?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingtransferWithCheckingDetails || transferWithCheckingDetailsLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                emptyTableText={{
                  title: 'Перемещение недоступен',
                  description: 'Если вы не можете найти искомый Перемещение, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
                }}
                fullInfoAboutCurrentPage
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                status={'ALL'}
                isRefreshing={loading || isSetScannedNumber || isFetchingtransferWithCheckingDetails || transferWithCheckingDetailsLoading}
              />
            </Box>
          </Box>
        </Container>
      </FormProvider>
      <ConfirmDialog
        open={openFinishConfirmDialog}
        setOpen={() => setOpenFinishConfirmDialog(false)}
        icon={<FontAwesomeIcon icon={faExclamationTriangle} sx={{ fontSize: 41, color: 'yellow.400' }} />}
        title={'Создать перемещение?'}
        desc={
          <>
            <Typography fontWeight={'600'} fontSize={'20px'}>
              {'Вы уверены что хотите создать перемещение?'}
            </Typography>
            <Typography fontWeight={'600'} sx={{ color: 'red.500' }}>
              {'Не сканированные товары будут списаны'}
            </Typography>
          </>
        }
        actions={
          <>
            <Button
              sx={{
                borderRadius: '50px',
                mr: '4px',
                p: '9px 16px',
                height: '40px',
                backgroundColor: 'white !important',
                color: 'orange.500',
                borderColor: 'orange.500',
                '& svg': {
                  flexShrink: 0,
                },
              }}
              color='secondary'
              onClick={() => setOpenFinishConfirmDialog(false)}
            >
              Нет
            </Button>
            <Button
              size='medium'
              variant='contained'
              onClick={() => {
                setOpenFinishConfirmDialog(false)
                finishWriteOffChecking(id)
              }}
              isLoading={transferWithCheckingDetailsLoading}
            >
              Да, создать
            </Button>
          </>
        }
      />
    </LoadingContainer>
  )
}
