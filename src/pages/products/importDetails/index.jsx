import { Box, Button, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import * as qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import ButtonWithPopup from '../../../../components/Buttons/ButtonWithPopup'
import Header from '../../../../components/Header'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { downloadExcel } from '../../../../utils/downloadEXCEL'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import ImportIcon from '../../../assets/icons/ImportIcon'
import ImportWithIcon from '../../../assets/icons/ImportWithIcon'
import ImportWithoutIcon from '../../../assets/icons/ImportWithoutIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/importDetailTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function ImportDetailsPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const user_data = useSelector((state) => state.user)
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.importDetailsColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
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
      ;('retail_price_vat')
      ;('retail_price_vat')
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID)
        ?.map((el) => ({
          ...el,
          label: el.headerName,
          desc: el.desc,
          hide: !routeString.includes(`import-detail-${el?.colId}`),
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
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      received_amount_to: values?.received_amount_to,
      received_amount_from: values?.received_amount_from,
      no_barcode: values?.no_barcode == '1' ? true : false,
    }
  }, [values?.received_amount_to, values?.no_barcode, values?.received_amount_from, values?.offset, values?.limit, values?.search])
  const {
    data: importWithCheckingDetails,
    isLoading: importWithCheckingDetailsLoading,
    isFetching: isFetchingimportWithCheckingDetails,
    refetch,
  } = useQuery(['importWithCheckingDetails', importWithCheckingDetailsFilter], () => requests.getImportDetails(importWithCheckingDetailsFilter))

  useEffect(() => {
    refetch()
  }, [importWithCheckingDetailsFilter])

  useEffect(() => {
    const count = importWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [importWithCheckingDetails?.data, values?.limit])
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
  const { mutate: importDetailsExcelReport, isLoading: isimportDetailsExcelReport } = useMutation(requests.getImportDetailsExcelReport, {
    onSuccess: ({ data }) => {
      downloadExcel(data, 'Детали_импорта')
    },
    onError: (err) => {
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={!isLoadWithoutChecking}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} pb={'20px'}>
        <Header
          isLoading={false}
          buttonText='Детали импорта'
          backIcon
          noActions
          backHref={
            get(values, 'tab') === 'details'
              ? '/products/all'
              : `/products/import?${qs.stringify({
                  limit: values?.previusLimit,
                  offset: values?.previusOffset,
                })}`
          }
          text={'Детали импорта'}
          checkAccessId={'product-create'}
        />
        <Container>
          <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} width='100%'>
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
              {get(importWithCheckingDetails, 'data.data.data[0].import.status') === 'new' && (
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
              downloadByFilter={() => importDetailsExcelReport(importWithCheckingDetailsFilter)}
              fullDownload={() => importDetailsExcelReport({ ...importWithCheckingDetailsFilter, limit: 1000000 })}
              isDownloading={isimportDetailsExcelReport}
              data={importWithCheckingDetails?.data?.data?.data || []}
              totalCount={importWithCheckingDetails?.data?.data?._meta?.total_count || 0}
              isDataLoading={isFetchingimportWithCheckingDetails || importWithCheckingDetailsLoading}
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
              isRefreshing={loading || isFetchingimportWithCheckingDetails || importWithCheckingDetailsLoading}
            />
          </Box>
        </Container>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
    </LoadingContainer>
  )
}
