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
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '@components/ConfirmDialog'
import Header from '@components/Header'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { requests } from '@utils/requests'
import { error } from '@utils/toast'
import ArrowDown from '@icons/ArrowDown'
import ArrowUp from '@icons/ArrowUp'
import BarcodeIcon from '@icons/BarcodeIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/returnToWarehouseRecheckWithCheckingTableColumns'
import tableHeaderSelector from './tableHeaderSelector'
import WriteOffDashboard from './writeOffDashboard'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'

export default function ReturnToWarehouseGetScanWithCheckingPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.returnToWarehouseRecheckWithCheckingColumns)
  const { values } = useQueryParams()
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)
  const [barcode, setBarcode] = useState('')
  const methods = useForm()
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [offsetCount, setOffsetCount] = useState(0)

  const { mutate: finishWriteOffChecking, isLoading: isfinishWriteOffChecking } = useMutation(requests.finishReturnToWarehouseChecking, {
    onSuccess: ({ data }) => {
      navigate('/products/return-to-warehouse')
    },
    onError: (err) => {
      error('Ошибка при завершение импорта!')
    },
  })
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    values,
  })
  const returnToWarehouseWithCheckingDetailsFilter = useMemo(() => {
    return {
      return_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
    }
  }, [id, barcode, values?.limit, values?.offset])

  const { data: getReturnToWarehouseDashBoard } = useQuery(['getReturnToWarehouseDashBoard', id], () => requests.getReturnToWarehouseDashBoard(id))

  const {
    data: returnToWarehouseWithCheckingDetails,
    isLoading: returnToWarehouseWithCheckingDetailsLoading,
    isFetching: isFetchingreturnToWarehouseWithCheckingDetails,
    refetch,
  } = useQuery(['returnToWarehouseWithCheckingDetails', returnToWarehouseWithCheckingDetailsFilter], () =>
    requests.getReturnToWarehouseDetails(returnToWarehouseWithCheckingDetailsFilter)
  )

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [returnToWarehouseWithCheckingDetailsFilter])

  useEffect(() => {
    const count = returnToWarehouseWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(returnToWarehouseWithCheckingDetails, 'data.data.data', []).map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
    })
  }, [returnToWarehouseWithCheckingDetails?.data, values?.limit])

  const { mutate: getReturnToWarehouseDetailsExcelReport } = useMutation(requests.getReturnToWarehouseDetailsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })

  const { mutate: send1c } = useMutation(requests.resend1cReturnTOwarehouse, {
    onSuccess: ({ data }) => {
      success('Повторно отправлено в 1с')
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при Повторно отправлено в 1с!')
    },
  })
  return (
    <LoadingContainer readyState={!isfinishWriteOffChecking}>
      <FormProvider {...methods}>
        <Header
          onSubmit={() => send1c(id)}
          buttonText='Повторно отправлено в 1с'
          isLoading={false}
          backIcon
          backHref='/products/return-to-warehouse'
          text={'Возврат'}
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
                fullDownload={() => getReturnToWarehouseDetailsExcelReport({ ...returnToWarehouseWithCheckingDetailsFilter, offset: 0, limit: 1000000 })}
                downloadByFilter={() => getReturnToWarehouseDetailsExcelReport(returnToWarehouseWithCheckingDetailsFilter)}
                data={returnToWarehouseWithCheckingDetails?.data?.data?.data || []}
                totalCount={returnToWarehouseWithCheckingDetails?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingreturnToWarehouseWithCheckingDetails || returnToWarehouseWithCheckingDetailsLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                emptyTableText={{
                  title: 'Возврат недоступен',
                  description: 'Если вы не можете найти искомый Возврат, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
                }}
                fullInfoAboutCurrentPage
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                status={'ALL'}
                isRefreshing={loading || isFetchingreturnToWarehouseWithCheckingDetails || returnToWarehouseWithCheckingDetailsLoading}
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
