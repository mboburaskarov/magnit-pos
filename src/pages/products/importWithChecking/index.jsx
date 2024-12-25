import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/importWithCheckingTableColumns'
import FilterMenu from './FilterMenu'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import overplusAudio from '../../../assets/audio/overplus.mp3'
import BarcodeIcon from '../../../assets/icons/BarcodeIcon'
// import ProductDrawer from './ProductDrawer'
import tableHeaderSelector from './tableHeaderSelector'
import { get } from 'lodash'
import InputSwitch from '../../../../components/Inputs/InputSwitch'
import InputQuantity from '../../../../components/Inputs/InputQuantity'
import Header from '../../../../components/Header'
const SELECTION_ID = 'checkboxSelectionField'

export default function ImportWithCheckingPage() {
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const overplusScanAudio = new Audio(overplusAudio)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()

  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.importWithCheckingColumns)
  const { values } = useQueryParams()
  const [regions, setRegions] = useState([])
  const [imports, setImports] = useState([])
  const [barcode, setBarcode] = useState('')

  const [appType, setAppType] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [manualNumber, setManualNumber] = useState(1)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [rejectComment, setRejectComment] = useState(null)
  const [filterMenu, setFilterMenu] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    setIsDrawerOpen,
    setImports: setImports,
  })

  /// filter table columns with permission
  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter(
          (el) => !el?.is_temporary && el?.colId !== SELECTION_ID
          // && el.field !== 'category'
        )
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
      search: values?.search,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      store_id: values?.store_id,
      category_id: values?.category_id,
      producer: values?.producer,
      supply_price_to: values?.supply_price_to,
      retail_price_to: values?.retail_price_to,
      region: values?.region_id,
      supply_price_from: values?.supply_price_from,
      retail_price_from: values?.retail_price_from,
      isExpress: values?.isExpress,
      // ...(appType !== 'ALL' && { status: appType }),
    }
  }, [
    values?.offset,
    values?.limit,
    values?.search,
    values?.producer,
    values?.category_id,
    values?.shop_id,
    values?.supply_price_to,
    values?.retail_price_to,
    values?.supply_price_from,
    values?.retail_price_from,
    values?.region_id,
    values?.isExpress,
    regions,
  ])
  const {
    data: importWithCheckingDetails,
    isLoading: importWithCheckingDetailsLoading,
    isFetching: isFetchingimportWithCheckingDetails,
    refetch,
  } = useQuery(['importWithCheckingDetails', importWithCheckingDetailsFilter], () => requests.getImportDetails(importWithCheckingDetailsFilter))

  const { mutate: deleteProduct, isLoading: isDeletingProduct } = useMutation(requests.deleteProduct, {
    onSuccess: () => {
      refetch()
      success('Продукт успешно удален!')
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении товара!')
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })

  const { mutate: rejectProduct } = useMutation(requests.rejectProduct, {
    onSuccess: () => {
      refetch()
      success('Продукт успешно отклонен!')
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
      setRejectComment(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении отклонен!')
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })
  const { mutate: activateProduct, isLoading: isActivatingProduct } = useMutation(requests.activateProduct, {
    onSuccess: () => {
      success('Продукт успешно активирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при активации продукта!')
      refetch()
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })
  const { mutate: deActivateProduct, isLoading: isDeActivatingProduct } = useMutation(requests.changeimportstatus, {
    onSuccess: () => {
      success('Продукт успешно деактивирован!')
      setTimeout(() => {
        refetch()
      }, 500)
      setIsDrawerOpen(null)
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      error('Ошибка при деактивации продукта!')
      refetch()
      setOpenConfirmDialog(null)
      setIsDrawerOpen(null)
      console.log('err', err)
    },
  })
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
    const count =
      // status === 'ACTIVE'
      //   ? importWithCheckingDetails?.data?.active
      //   : status === 'INACTIVE'
      //   ? importWithCheckingDetails?.data?.inactive
      //   : status === 'INACTIVE_BY_VENDOR'
      //   ? importWithCheckingDetails?.data?.inactiveByVendor
      //   : status === 'BLOCKED'
      //   ? importWithCheckingDetails?.data?.blocked
      // : importWithCheckingDetails?.data.totalCount
      importWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [importWithCheckingDetails?.data, values?.limit])
  const { mutate: addScan, isLoading: isAddScan } = useMutation(requests.sendScannedImport, {
    onSuccess: ({ data }) => {
      if (get(data, 'data.surplus')) {
        overplusScanAudio.play()
      } else {
        successScanAudio.play()
      }
      refetch()
      // success('Продукт успешно деактивирован!')
    },
    onError: (err) => {
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })
  useEffect(() => {
    setManualNumber(0)
  }, [appType])
  const sendScannedImport = () => {
    addScan({ barcode, count: Number(manualNumber), import_id: id })
  }
  return (
    <LoadingContainer readyState={true}>
      <Header
        isLoading={false}
        buttonText='Завершить'
        backIcon
        // noActions
        backHref='/products/import'
        text={'Импорт с проверкой'}
        checkAccessId={'product-create'}
        onSubmit={() => setOpenConfirmDialog(true)}
      />
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        {/* <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {'Импорт с проверкой'}
        </Typography> */}

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
            // status={appType}
            isRefreshing={loading || isFetchingimportWithCheckingDetails || importWithCheckingDetailsLoading}
          />
        </Box>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
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
              <LoadingButton
                variant='contained'
                type='button'
                loading={isDeletingProduct || isActivatingProduct || isDeActivatingProduct}
                onClick={() => finishImportChecking(id)}
              >
                Да, завершить
              </LoadingButton>
            </>
          }
        />
      )}
      <StyledDialog
        open={!!rejectComment?.id}
        title={'Причину отклонения'}
        buttonLabel={'Сохранить'}
        customOnSubmit={() => {
          if (rejectComment.comment && rejectComment.id) {
            rejectProduct({
              id: rejectComment.id,
              rejectedComment: rejectComment.comment,
            })
          }
        }}
        onClose={() => setRejectComment(null)}
      >
        {rejectComment && (
          <Box p={7} pt={5}>
            <TextField
              multiline
              onChange={(e) => setRejectComment((p) => ({ ...p, comment: e.target.value }))}
              fullWidth
              placeholder='Введите причину отклонения'
            />
          </Box>
        )}
      </StyledDialog>
    </LoadingContainer>
  )
}
