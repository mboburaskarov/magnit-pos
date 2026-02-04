import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Container, Typography } from '@mui/material'
import dayjs from 'dayjs'

import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/changePriceDetailTableColumns'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '@components/ConfirmDialog'
import Header from '@components/Header'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { useQueryParams } from '@hooks/useQueryParams'
import ArrowDown from '@icons/ArrowDown'
import ArrowUp from '@icons/ArrowUp'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import { requests } from '@utils/requests'
import { error } from '@utils/toast'
import { get } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ChangePriceDashboard from './dashboard'
import tableHeaderSelector from './tableHeaderSelector'

export default function ChangePriceDetailPage() {
  const methods = useForm()
  const { id } = useParams()
  const childRef = useRef()

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.changePriceTableDetailColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [selectedCellRowId, setSelectedCellRowId] = useState(false)
  const [lastSelectedCellRowId, setLastSelectedCellRowId] = useState(false)
  const [repricingModalOpen, setrepricingModalOpen] = useState(false)
  const [openFinishConfirmDialog, setOpenFinishConfirmDialog] = useState(false)
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)

  const tableColumns = tableHeaderSelector({
    revaluationColumns: columns,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const revaluationDetailListFilter = useMemo(() => {
    return {
      id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: values?.search,
    }
  }, [values?.limit, id, values?.search, values?.offset])

  const {
    data: revaluationDetailList,
    isLoading: revaluationDetailListLoading,
    isFetching: isFetchingrevaluationDetailList,
    refetch,
  } = useQuery(['revaluationDetailList', revaluationDetailListFilter], () => requests.getRevaluationDetailList({ id, ...revaluationDetailListFilter }))

  const { data: revaluationById } = useQuery(['revaluationById', revaluationDetailListFilter], () => requests.getRevaluation(id))

  useEffect(() => {
    refetch()
  }, [revaluationDetailListFilter])

  const { mutate: finishRevaluation } = useMutation(requests.finishRevaluation, {
    onSuccess: ({ data }) => {
      navigate('/products/revaluation')
    },
    onError: (err) => {
      error('Ошибка при завершение импорта!')
    },
  })
  useEffect(() => {
    const count = revaluationDetailList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [revaluationDetailList?.data, values?.limit])

  const handleFocus = () => {
    const firstrowid = revaluationDetailList?.data?.data?.data?.[0]?.id
    const activeEl = document.activeElement
    const classList = activeEl?.classList || []

    if (classList.contains('ag-cell')) {
      if (revaluationDetailList?.data?.data?.data.length == 1) {
        setrepricingModalOpen({ id: firstrowid, data: revaluationDetailList?.data?.data?.data?.[0] })
        return
      } else if (lastSelectedCellRowId) {
        setrepricingModalOpen({ id: firstrowid, data: revaluationDetailList?.data?.data?.data.find((item) => item?.id == lastSelectedCellRowId) })
        return
      }
    }
    if (lastSelectedCellRowId != null && revaluationDetailList?.data?.data?.data?.some((el) => el?.id === lastSelectedCellRowId)) {
      childRef.current?.focusCellByRowId(lastSelectedCellRowId, 'barcode')
    } else {
      setLastSelectedCellRowId(firstrowid)
      childRef.current?.focusCellByRowId(firstrowid, 'barcode')
    }
  }

  useEffect(() => {
    if (selectedCellRowId) {
      setLastSelectedCellRowId(selectedCellRowId)
    }
  }, [selectedCellRowId])

  useHotkeys(
    '*',
    (event) => {
      if (selectedCellRowId) return
      let isexeption = document.activeElement.tagName == 'INPUT'

      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (document.activeElement?.tagName === 'INPUT' || isexeption) return

        handleFocus()
      }
    },
    {
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    },
  )

  useEffect(() => {
    if (repricingModalOpen == false && typeof repricingModalOpen == 'boolean') {
      handleFocus()
    }
  }, [repricingModalOpen])

  const { mutate: revaluationExcelReport, isLoading: isrevaluationExcelReport } = useMutation(requests.getREvaluationExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)
      error('Ошибка при скачать excel!')
    },
  })
  const { data: getRevaluationDashBoard } = useQuery(['getRevaluationDashBoard', id], () => requests.getRevaluationDashBoard(id))

  return (
    <LoadingContainer readyState={!revaluationDetailListLoading}>
      <FormProvider {...methods}>
        <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
          <Header
            isLoading={false}
            backIcon
            noActions
            backHref='/products/revaluation'
            text={'Переоценка'}
            subText={`${revaluationById?.data?.data?.store?.name} - ${dayjs(revaluationById?.data?.data?.created_at).format('DD.MM.YYYY - HH:mm')}`}
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
            {isOpenStatDashboard && <ChangePriceDashboard data={get(getRevaluationDashBoard, 'data.data')} />}

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
                  <InputSearch id='producrs-search' name='search' placeholder={'Наименование'} uncontrolled />
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
            <Box>
              <AgGridTable
                downloadByFilter={() => revaluationExcelReport(revaluationDetailListFilter)}
                fullDownload={() => revaluationExcelReport({ ...revaluationDetailListFilter, offset: 0, limit: 1000000 })}
                isDownloading={isrevaluationExcelReport}
                id='revaluation-main-table'
                tableSettings
                gettingId='id'
                realTimeSelectedCellRowId={({ id, rowId }) => {
                  setLastSelectedCellRowId(rowId)
                }}
                onChangeSelectedCellRowId={(id) => {
                  setLastSelectedCellRowId(id)
                }}
                childRef={childRef}
                defaultOffsetIndex={Number(values?.offset / values?.limit + 1 || 1)}
                selectedCellRowId={setSelectedCellRowId}
                columns={tableColumns}
                data={revaluationDetailList?.data?.data?.data || []}
                totalCount={revaluationDetailList?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingrevaluationDetailList || revaluationDetailListLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                emptyTableText={{
                  title: 'Переоценка недоступен',
                  description: 'Если вы не можете найти искомый Переоценка, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
                }}
                fullInfoAboutCurrentPage
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                isRefreshing={loading || isFetchingrevaluationDetailList || revaluationDetailListLoading}
              />
            </Box>
          </Container>
        </Box>

        <ConfirmDialog
          open={openFinishConfirmDialog}
          setOpen={() => setOpenFinishConfirmDialog(false)}
          icon={<FontAwesomeIcon icon={faExclamationTriangle} sx={{ fontSize: 41, color: 'yellow.400' }} />}
          title={'Завершить переоценка'}
          desc={
            <>
              <Typography fontWeight={'600'} fontSize={'20px'}>
                Вы уверены что хотите завершить переоценка?
              </Typography>
              <Typography fontWeight={'600'} sx={{ color: 'red.500' }}>
                Не сканированные товары будут списаны
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
                  finishRevaluation(id)
                }}
                isLoading={false}
              >
                {t('buttons.yes_complete')}
              </Button>
            </>
          }
        />
      </FormProvider>
    </LoadingContainer>
  )
}
