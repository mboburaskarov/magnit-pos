import { Box, Button, Container, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '../../../../components/CheckAccess'
import Header from '../../../../components/Header'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/minMaxTableColumns'
import CreateBonusProduct from './createBonusProduct'
import EditBonusProduct from './editBonusProduct'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
const SELECTION_ID = 'checkboxSelectionField'

export default function CreateMinMaxPage() {
  const methods = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.minMaxTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)

  const [openCreateMinMaxModal, setOpenCreateMinMaxModal] = useState(false)
  const [openEditMinMaxModal, setOpenEditMinMaxModal] = useState(false)
  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenEditMinMaxModal: setOpenEditMinMaxModal,
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

  const minMaxProductListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: values?.store_id,
    }
  }, [values?.offset, values?.limit, values?.search, values?.store_id])
  const {
    data: minMaxProductList,
    isLoading: minMaxProductListLoading,
    isFetching: isFetchingminMaxProductList,
    refetch,
  } = useQuery(['minMaxProductList', minMaxProductListFilter], () => requests.getProductMinMaxList(minMaxProductListFilter))

  useEffect(() => {
    refetch()
  }, [minMaxProductListFilter])

  useEffect(() => {
    const count = minMaxProductList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [minMaxProductList?.data, values?.limit])
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pb={'20px'}>
        <Header
          isLoading={false}
          buttonText='Мин-Макс'
          backIcon
          noActions
          backButtonClick={() => navigate('/products/auto-order')}
          text={'Мин-Макс'}
          checkAccessId={'product-create'}
        />
        <Container>
          <FormProvider {...methods}>
            <Box display='flex' flexDirection='column' position='relative' px={'20px'} pb={'20px'}>
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
                    <InputSearch id='producrs-search' name='search' placeholder={t('table_columns.name')} uncontrolled />
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
                      startIcon={<FilterMenuIcon />}
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
                  <CheckAccess id={'create-auto-order'}>
                    <Box minWidth={156}>
                      <Button
                        sx={{ height: '48px' }}
                        type='submit'
                        onClick={() => setOpenCreateMinMaxModal(true)}
                        fullWidth
                        variant='contained'
                        color='primary'
                      >
                        Создать
                      </Button>
                    </Box>
                  </CheckAccess>
                </Box>
              </Box>
              <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
              <CreateBonusProduct refetch={refetch} open={openCreateMinMaxModal} setOpen={setOpenCreateMinMaxModal} />
              <EditBonusProduct refetch={refetch} open={openEditMinMaxModal} setOpen={setOpenEditMinMaxModal} />
              <Box>
                <AgGridTable
                  id='auto-order-main-table'
                  tableSettings
                  columns={tableColumns}
                  data={[...(minMaxProductList?.data?.data?.data || [])]}
                  totalCount={minMaxProductList?.data?.data?._meta?.total_count || 0}
                  isDataLoading={isFetchingminMaxProductList || minMaxProductListLoading}
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
                  isRefreshing={isFetchingminMaxProductList || minMaxProductListLoading}
                />
              </Box>
            </Box>

            <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
          </FormProvider>
        </Container>
      </Box>
    </LoadingContainer>
  )
}
