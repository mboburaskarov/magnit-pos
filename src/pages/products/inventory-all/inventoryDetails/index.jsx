import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ButtonWithPopup from '../../../../../components/Buttons/ButtonWithPopup'
import ImageGallery from '../../../../../components/ImageGallery'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../../components/LoadingContainer'
import { downloadLinkExcel } from '../../../../../utils/downloadLinkEXCEL'
import { requests } from '../../../../../utils/requests'
import { error, success } from '../../../../../utils/toast'
import FilterMenuIcon from '../../../../assets/icons/FilterMenuIcon'
import ImportIcon from '../../../../assets/icons/ImportIcon'
import ImportWithIcon from '../../../../assets/icons/ImportWithIcon'
import ImportWithoutIcon from '../../../../assets/icons/ImportWithoutIcon'
import { useQueryParams } from '../../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../../redux-toolkit/tableSlices/inventoryDetailTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function InventoryDetailPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const methods = useForm()

  const user_data = useSelector((state) => state.user)
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.inventoryDetailsColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [orderModel, setOrderModel] = useState(false)

  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
  })
  const routeString = []

  user_data?.role_actions?.forEach((item) => {
    if (item.type == 'TABLE') {
      routeString.push(item.route)
    }
  })
  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID)
        ?.map((el) => ({
          ...el,
          label: el.headerName,
          desc: el.desc,
          // hide: !routeString.includes(`import-detail-${el?.colId}`),
          name: el.colId,
          always_active: el?.always_active ?? el?.always_active,
        }))
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const inventoryDetailsFilter = useMemo(() => {
    return {
      inventory_id: id,
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      // received_amount_to: values?.received_amount_to,
      // received_amount_from: values?.received_amount_from,
      // no_barcode: values?.no_barcode == '1' ? true : false,
    }
  }, [values?.received_amount_to, values?.no_barcode, values?.received_amount_from, values?.offset, values?.limit, values?.search])
  const {
    data: inventoryDetails,
    isLoading: inventoryDetailsLoading,
    isFetching: isFetchinginventoryDetails,
    refetch,
  } = useQuery(['inventoryDetails', inventoryDetailsFilter], () => requests.getInventoryDetails(inventoryDetailsFilter))

  useEffect(() => {
    refetch()
  }, [inventoryDetailsFilter])

  useEffect(() => {
    const count = inventoryDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [inventoryDetails?.data, values?.limit])
  const { mutate: loadWithoutCheckingFetch, isLoading: isLoadWithoutChecking } = useMutation(requests.loadWithoutChecking, {
    onSuccess: () => {
      navigate('/products/import')
      success('Весь импорт принят!')
    },
    onError: (err) => {
      error('Ошибка при весь импорт принят!')

      console.error('err', err)
    },
  })
  const loadWithoutChecking = () => {
    loadWithoutCheckingFetch(id)
  }
  const { mutate: importDetailsExcelReport, isLoading: isimportDetailsExcelReport } = useMutation(requests.getImportDetailsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={true}>
      <FormProvider {...methods}>
        <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
          <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
            {'Инвентаризация'}
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
                <InputSearch id='producrs-search' name='search' placeholder={'Название, штрих-код'} uncontrolled />
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
              {get(inventoryDetails, 'data.data.data[0].import.status') === 'new' && (
                <ButtonWithPopup
                  id={'ff'}
                  sx={{
                    height: '48px',
                  }}
                  noArrow
                  ml={'16px'}
                  noMarginSvg
                  boxStyles={{
                    height: '48px',
                  }}
                  placement='bottom-end'
                  buttonLabel={
                    <Box
                      className='cash_register_icon_wrapper'
                      sx={{ '&:hover': { bgcolor: 'transparent !important' } }}
                      padding={'12px'}
                      width={'48px'}
                      height={'44px'}
                      borderRadius={'50%'}
                    >
                      <ImportIcon />
                    </Box>
                  }
                  popperData={[
                    // { title: 'Импорт без проверки', icon: <ImportWithoutIcon />, clickHandler: () => {}, soon: true },
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
          <FilterMenu id={id} open={filterMenu} setOpen={setFilterMenu} />

          <Box>
            <AgGridTable
              id='imports-main-table'
              tableSettings
              columns={tableColumns}
              downloadByFilter={() => importDetailsExcelReport(inventoryDetailsFilter)}
              fullDownload={() => importDetailsExcelReport({ ...inventoryDetailsFilter, offset: 0, limit: 1000000 })}
              isDownloading={isimportDetailsExcelReport}
              data={inventoryDetails?.data?.data?.data || []}
              totalCount={inventoryDetails?.data?.data?._meta?.total_count || 0}
              isDataLoading={isFetchinginventoryDetails || inventoryDetailsLoading}
              offsetCount={offsetCount}
              updaterAction={(newData) => {
                if (newData) dispatch(updateTableHeader(newData))
              }}
              emptyTableText={{
                title: 'Инвентаризация недоступен',
                description: 'Если вы не можете найти искомый Инвентаризация, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
              }}
              fullInfoAboutCurrentPage
              resetTable={() => dispatch(resetTableHeader({ refetch }))}
              isRefreshing={loading || isFetchinginventoryDetails || inventoryDetailsLoading}
            />
          </Box>
        </Box>

        <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      </FormProvider>
    </LoadingContainer>
  )
}
