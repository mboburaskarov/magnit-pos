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
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/importDetailTableColumns'
import FilterMenu from './FilterMenu'
// import ProductDrawer from './ProductDrawer'
import ButtonWithPopup from '../../../../components/Buttons/ButtonWithPopup'
import ImportIcon from '../../../assets/icons/ImportIcon'
import ImportWithIcon from '../../../assets/icons/ImportWithIcon'
import ImportWithoutIcon from '../../../assets/icons/ImportWithoutIcon'
import tableHeaderSelector from './tableHeaderSelector'
import { get } from 'lodash'
const SELECTION_ID = 'checkboxSelectionField'

export default function ImportDetailsPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()

  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.importDetailsColumns)
  const { values } = useQueryParams()
  const [status, setStatus] = useState('ALL')
  const [regions, setRegions] = useState([])
  const [appType, setAppType] = useState('ALL')
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [rejectComment, setRejectComment] = useState(null)
  const [filterMenu, setFilterMenu] = useState(false)
  const [filterTableRowsMenu, setFilterTableRowsMenu] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenConfirmDialog,
    setIsDrawerOpen,
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
      ...(appType !== 'ALL' && { status: appType }),
    }
  }, [
    appType,
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
  }, [importWithCheckingDetails?.data, values?.limit, appType])
  const { mutate: loadWithoutCheckingFetch, isLoading: isLoadWithoutChecking } = useMutation(requests.loadWithoutChecking, {
    onSuccess: () => {
      navigate('/products/import')
      success('Весь импорт принят!')
    },
    onError: (err) => {
      error('Ошибка при весь импорт принят!')

      console.log('err', err)
    },
  })
  const loadWithoutChecking = () => {
    loadWithoutCheckingFetch(id)
  }
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {'Детали импорта'}
        </Typography>

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
              <InputSearch id='producrs-search' name='search' placeholder={t('input.search.product.multi')} uncontrolled />
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
            {get(importWithCheckingDetails, 'data.data.data[0].import.status') === 'new' && (
              <ButtonWithPopup
                id={'ff'}
                noArrow
                ml={'16px'}
                // endIcon={<ArrowDown />
                noMarginSvg
                placement='bottom-end'
                buttonLabel={
                  <Box className='cash_register_icon_wrapper' bgcolor={'#F8F8F9'} padding={'12px'} width={'48px'} height={'48px'} borderRadius={'50%'}>
                    <ImportIcon />
                  </Box>
                }
                popperData={[
                  { title: 'Импорт без проверки', icon: <ImportWithoutIcon />, clickHandler: () => loadWithoutChecking() },
                  { title: 'Импорт с проверкой', icon: <ImportWithIcon />, clickHandler: () => navigate(`/products/import-with-checking/${id}`) },
                ]}
              />
            )}
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

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={openConfirmDialog?.type === 'activate' ? <BigTickIcon /> : <BigWarningIcon />}
          title={
            openConfirmDialog?.type === 'activate'
              ? 'Активировать продукт?'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Деактивировать продукт?'
              : 'Удалить продукт?'
          }
          desc={
            openConfirmDialog?.type === 'activate'
              ? 'Вы действительно хотите активировать продукт, вы не можете вернуть этот прогресс после активации.'
              : openConfirmDialog?.type === 'deactivate'
              ? 'Вы действительно хотите деактивировать продукт, вы не можете вернуть этот прогресс после деактивации.'
              : 'Вы хотите удалить продукт?'
          }
          supDesc={'“Azitromitsin 250 mg”'}
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
                onClick={() =>
                  openConfirmDialog?.type === 'activate'
                    ? activateProduct(openConfirmDialog.id)
                    : openConfirmDialog?.type === 'deactivate'
                    ? deActivateProduct({ id: openConfirmDialog.id, appType: 'INACTIVE' })
                    : deleteProduct(openConfirmDialog.id)
                }
              >
                Да, удалить
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
