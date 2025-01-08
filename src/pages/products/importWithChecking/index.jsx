import { LoadingButton } from '@mui/lab'
import { Box, Button, Container } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import overplusAudio from '../../../assets/audio/overplus.mp3'
import BarcodeIcon from '../../../assets/icons/BarcodeIcon'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/importWithCheckingTableColumns'
import FilterMenu from './FilterMenu'
import { get } from 'lodash'
import Header from '../../../../components/Header'
import InputQuantity from '../../../../components/Inputs/InputQuantity'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import tableHeaderSelector from './tableHeaderSelector'
import { FormProvider, useForm } from 'react-hook-form'
const SELECTION_ID = 'checkboxSelectionField'

export default function ImportWithCheckingPage() {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const overplusScanAudio = new Audio(overplusAudio)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()

  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.importWithCheckingColumns)
  const { values } = useQueryParams()
  const [regions, setRegions] = useState([])
  const [imports, setImports] = useState([])
  const [barcode, setBarcode] = useState('')
  const methods = useForm()

  const [appType, setAppType] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [manualNumber, setManualNumber] = useState(1)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const { mutate: setScanedNumber, isLoading: isSetScannedNumber } = useMutation(requests.sendScannedImportNumber, {
    onSuccess: ({ data }) => {
      refetch()
    },
    onError: (err) => {
      error('Ошибка при сканирование!')
    },
  })
  const { mutate: addScan, isLoading: isAddScan } = useMutation(requests.sendScannedImport, {
    onSuccess: ({ data }) => {
      refetch()
      if (get(data, 'data.surplus')) {
        overplusScanAudio.play()
      } else {
        successScanAudio.play()
      }
    },
    onError: (err) => {
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImports,
    id,
    setScanedNumber,
  })

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

  const importWithCheckingDetailsFilter = useMemo(() => {
    return {
      import_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
    }
  }, [values?.offset, values?.limit, id])

  const {
    data: importWithCheckingDetails,
    isLoading: importWithCheckingDetailsLoading,
    isFetching: isFetchingimportWithCheckingDetails,
    refetch,
  } = useQuery(['importWithCheckingDetails', importWithCheckingDetailsFilter], () => requests.getImportDetails(importWithCheckingDetailsFilter))

  const { mutate: finishImportChecking, isLoading: isFinishImportChecking } = useMutation(requests.finishImportChecking, {
    onSuccess: () => {
      success('Импорт завершен!')
      navigate('/products/import')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при импорт завершен!')
      setOpenConfirmDialog(null)
    },
  })

  useEffect(() => {
    refetch()
  }, [importWithCheckingDetailsFilter])

  useEffect(() => {
    const count = importWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(importWithCheckingDetails, 'data.data.data', []).map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'accepted_count'))
    })
  }, [importWithCheckingDetails?.data, values?.limit])

  useEffect(() => {
    // setManualNumber(0)
  }, [appType])
  const sendScannedImport = () => {
    addScan({ barcode, count: Number(manualNumber), import_id: id })
  }
  return (
    <LoadingContainer readyState={true}>
      <FormProvider {...methods}>
        <Header
          isLoading={false}
          buttonText='Завершить'
          backIcon
          backHref='/products/import'
          text={'Импорт с проверкой'}
          checkAccessId={'product-create'}
          onSubmit={() => setOpenConfirmDialog(true)}
        />
        <Container>
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
                    placeholder={t('input.search.product.multi')}
                  />
                </Box>
                {appType === 'manual' && (
                  <Box sx={{ ml: '16px' }}>
                    <InputQuantity uncontrolled defaultValue={1} onChange={({ target }) => setManualNumber(target.value)} />
                  </Box>
                )}
                <Box sx={{ ml: '16px' }}>
                  <InputSwitch
                    noMarginTop
                    uncontrolled
                    id='app-type'
                    name='app-type'
                    value={appType}
                    defaultValue='auto'
                    onChange={(e) => setAppType(e)}
                    options={[
                      { title: 'Руководство', value: 'manual' },
                      { title: 'Сканирование', value: 'auto' },
                    ]}
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
            <FilterMenu setRegions={setRegions} open={filterMenu} setOpen={setFilterMenu} />

            <Box>
              <AgGridTable
                id='imports-main-table'
                tableSettings
                columns={tableColumns}
                data={importWithCheckingDetails?.data?.data?.data || []}
                isDataLoading={isFetchingimportWithCheckingDetails || importWithCheckingDetailsLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                fullInfoAboutCurrentPage
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                status={appType}
                isRefreshing={loading || isFetchingimportWithCheckingDetails || importWithCheckingDetailsLoading}
              />
            </Box>
          </Box>
        </Container>

        {openConfirmDialog && (
          <ConfirmDialog
            open={!!openConfirmDialog}
            setOpen={setOpenConfirmDialog}
            icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
            title={'Завершить'}
            desc={'Вы действительно хотите завершить импорт?'}
            supDesc={''}
            actions={
              <>
                <Button
                  sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                  fullWidth
                  color='secondary'
                  variant='contained'
                  onClick={() => setOpenConfirmDialog(null)}
                >
                  Нет
                </Button>
                <LoadingButton variant='contained' loading={isFinishImportChecking} type='button' onClick={() => finishImportChecking(id)}>
                  Да, завершить
                </LoadingButton>
              </>
            }
          />
        )}
      </FormProvider>
    </LoadingContainer>
  )
}
