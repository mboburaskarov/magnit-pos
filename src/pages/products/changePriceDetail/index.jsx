import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import dayjs from 'dayjs'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTableSelectable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import Header from '../../../../components/Header'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/changePriceDetailTableColumns'
import ChangePriceModal from './changePriceModal'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function ChangePriceDetailPage() {
  const theme = useTheme()
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

  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [gridApi, setGridApi] = useState(null) // Add this state
  const [filterMenu, setFilterMenu] = useState(false)
  const { mutate: autoOrderChangeQuantity, isLoading: isautoOrderChangeQuantity } = useMutation(requests.autoOrderChangeQuantity, {
    onSuccess: () => {},
    onError: (err) => {
      error('Ошибка изменить количество!')
      console.log('err', err)
    },
  })
  const { mutate: finalAutoOrder, isLoading: isfinalAutoOrder } = useMutation(requests.finalAutoOrder, {
    onSuccess: () => {
      navigate('/products/revaluation?limit=10&offset=0')
      success('Авто заказ подтвержден')
    },
    onError: (err) => {
      error('Ошибка изменить количество!')
      console.log('err', err)
    },
  })
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    getValue: methods.getValues,
    setValue: methods.setValue,
    setImages: setOpenImageGallery,
    autoOrderChangeQuantity,
  })

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
  const [controlleroffset, setControllerOffset] = useState(0)
  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])
  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])
  const revaluationDetailListFilter = useMemo(() => {
    return {
      auto_order_id: id,
      limit: values?.limit || 10,
      offset: controlleroffset || 0,
      search: values?.search,
      store_id: values?.store_id,
      start_date: values?.start_date,
      end_date: values?.end_date,
      status: values?.status,
      import_date: values?.import_date,
      received_amount_to: values?.received_amount_to,
      received_amount_from: values?.received_amount_from,
    }
  }, [
    controlleroffset,
    values?.limit,
    values?.end_date,
    values?.start_date,
    values?.search,
    values?.status,
    values?.store_id,
    values?.received_amount_to,
    values?.received_amount_from,
  ])
  const {
    data: revaluationDetailList,
    isLoading: revaluationDetailListLoading,
    isFetching: isFetchingrevaluationDetailList,
    refetch,
  } = useQuery(['revaluationDetailList', revaluationDetailListFilter], () => requests.getRevaluationDetailList(id))

  useEffect(() => {
    refetch()
  }, [revaluationDetailListFilter])

  const { mutate: finishRevaluation, isLoading: isfinishRevaluation } = useMutation(requests.finishRevaluation, {
    onSuccess: ({ data }) => {
      navigate('/products/inventory')
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

    // if (barcode.length > 0) {
    // } else {
    if (classList.contains('ag-cell')) {
      if (revaluationDetailList?.data?.data?.data.length == 1) {
        setrepricingModalOpen({ id: firstrowid, data: revaluationDetailList?.data?.data?.data?.[0] })
        return
      } else if (lastSelectedCellRowId) {
        setrepricingModalOpen({ id: firstrowid, data: revaluationDetailList?.data?.data?.data.find((item) => item?.id == lastSelectedCellRowId) })
        return
      }
    }
    // }
    // Call the exposed method: focus row with id 'b2' on column 'qty'
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
    }
  )
  useEffect(() => {
    if (repricingModalOpen == false && typeof repricingModalOpen == 'boolean') {
      handleFocus()

      // setBarcode('')
    }
  }, [repricingModalOpen])
  return (
    <LoadingContainer readyState={!isfinalAutoOrder}>
      <FormProvider {...methods}>
        <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
          <Header
            onSubmit={() => setOpenFinishConfirmDialog(true)}
            isLoading={false}
            buttonText='Завершить'
            backIcon
            backHref='/products/revaluation'
            text={'Переоценка'}
            subText={`${revaluationDetailList?.data?.data?.store?.name} - ${dayjs(revaluationDetailList?.data?.data?.created_at).format('DD.MM.YYYY - HH:mm')}`}
            checkAccessId={'product-create'}
          />
          <Container>
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

                <Box minWidth={113} ml={'16px'}>
                  <Button
                    sx={{
                      height: '48px',
                      padding: 0,
                      bgcolor: '#fff',
                      border: '1px solid #ECEDF2',
                      color: 'dark.500',
                      fontWeight: '500',
                      fontSize: '16px',
                      lineHeight: '24px',
                      '& span': {
                        mr: '12px',
                      },
                    }}
                    fullWidth
                    startIcon={<FilterMenuIcon color={theme.palette.black} />}
                    variant='contained'
                    color='secondary'
                    onClick={() => setFilterMenu((prev) => !prev)}
                  >
                    <Typography fontWeight={600} fontSize={'16px'} lineHeight={'25px'}>
                      {t('filter_dialog.label')}
                    </Typography>
                  </Button>
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
            <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
            <Box>
              <AgGridTable
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
                selectedCellRowId={setSelectedCellRowId}
                columns={tableColumns}
                data={revaluationDetailList?.data?.data?.data || []}
                totalCount={revaluationDetailList?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingrevaluationDetailList || revaluationDetailListLoading || isautoOrderChangeQuantity}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                emptyTableText={{
                  title: 'Заказ недоступен',
                  description: 'Если вы не можете найти искомый Заказ, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
                }}
                fullInfoAboutCurrentPage
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                isRefreshing={loading || isFetchingrevaluationDetailList || revaluationDetailListLoading || isautoOrderChangeQuantity}
                onGridReady={(params) => setGridApi(params.api)} // Add this prop
              />
            </Box>
          </Container>
        </Box>
        <ChangePriceModal
          // setshouldICleanSearchQuery={false}
          // setBarcode={setBarcode}
          refetch={refetch}
          open={repricingModalOpen}
          setOpen={setrepricingModalOpen}
          gridApi={gridApi}
        />
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
        <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      </FormProvider>
    </LoadingContainer>
  )
}
