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
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import Header from '../../../../components/Header'
import InputSearch from '../../../../components/Inputs/InputSearch'
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
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/writeOffWithCheckingTableColumns'
import tableHeaderSelector from './tableHeaderSelector'
import WriteOffDashboard from './writeOffDashboard'
const SELECTION_ID = 'checkboxSelectionField'

export default function ReturnToWarehouseCompletedPage() {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const overplusScanAudio = new Audio(overplusAudio)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.writeOffWithCheckingColumns)
  const { values } = useQueryParams()
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)
  const [barcode, setBarcode] = useState('')
  const methods = useForm()
  const [hasTableChange, setHasTableChange] = useState(false)
  const [appType, setAppType] = useState('ALL')
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [status, setStatus] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [manualNumber, setManualNumber] = useState(1)
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedWriteOffNumber, {
    onSuccess: ({ data }) => {
      // refetch()
      refetchgetWriteOffDashBoard()
      setBarcode('')
    },
    onError: (err) => {
      refetch()

      error('Ошибка при сканирование!')
    },
  })

  const { mutate: finishWriteOffChecking, isLoading: isfinishWriteOffChecking } = useMutation(requests.finishWriteOffChecking, {
    onSuccess: ({ data }) => {
      navigate('/products/writeoff')
    },
    onError: (err) => {
      error('Ошибка при завершение импорта!')
    },
  })
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,

    id,
    setScanedNumber,
  })
  const WriteOffWithCheckingDetailsFilter = useMemo(() => {
    return {
      writeoff_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
      type: status,
    }
  }, [id])

  const {
    data: getWriteOffDashBoard,
    isLoading: getWriteOffDashBoardLoading,
    isFetching: isFetchinggetWriteOffDashBoard,
    refetch: refetchgetWriteOffDashBoard,
  } = useQuery(['getWriteOffDashBoard', id], () => requests.getWriteOffDashBoard(id))

  const {
    data: WriteOffWithCheckingDetails,
    isLoading: WriteOffWithCheckingDetailsLoading,
    isFetching: isFetchingWriteOffWithCheckingDetails,
    refetch,
  } = useQuery(['WriteOffWithCheckingDetails', WriteOffWithCheckingDetailsFilter], () => requests.getWriteOffDetails(WriteOffWithCheckingDetailsFilter))

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
  }, [WriteOffWithCheckingDetailsFilter])

  useEffect(() => {
    const count = WriteOffWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(WriteOffWithCheckingDetails, 'data.data.data', []).map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
    })
  }, [WriteOffWithCheckingDetails?.data, values?.limit])

  const sendScannedImport = () => {
    if (barcode === '') return
    setScanedNumber({
      id,
      barcode: barcode,
      type: 'SCAN',
      scanned_count: Number(manualNumber),
    })
  }

  return (
    <LoadingContainer readyState={!isfinishWriteOffChecking}>
      <FormProvider {...methods}>
        <Header isLoading={false} backIcon noActions backHref='/products/write-off' text={'Возврат с проверкой'} checkAccessId={'product-create'} />

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
          {isOpenStatDashboard && <WriteOffDashboard data={get(getWriteOffDashBoard, 'data.data')} />}

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
                    onKeyDown={({ code }) => code === 'Enter' && sendScannedImport()}
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
                data={WriteOffWithCheckingDetails?.data?.data?.data || []}
                totalCount={WriteOffWithCheckingDetails?.data?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingWriteOffWithCheckingDetails || WriteOffWithCheckingDetailsLoading}
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
                isRefreshing={loading || hasTableChange || isFetchingWriteOffWithCheckingDetails || WriteOffWithCheckingDetailsLoading}
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
        title={t('alerts.finish_writeoff')}
        desc={
          <>
            <Typography fontWeight={'600'} fontSize={'20px'}>
              {t('alerts.finish_writeoff_desc')}
            </Typography>
            <Typography fontWeight={'600'} sx={{ color: 'red.500' }}>
              {t('alerts.finish_writeoff_warning')}
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
                finishWriteOffChecking(id)
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
