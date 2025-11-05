import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '@components/CheckAccess'
import HeaderWithDashboardWrapper from '@components/HeaderWithDashboard'
import ImageGallery from '@components/ImageGallery'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { requests } from '@utils/requests'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/changePriceTableColumns'
import ChangePriceDashboard from './changePriceDashboard'
import CreateRevaluation from './createRevaluation'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'

export default function ChangePricePage() {
  const theme = useTheme()
  const methods = useForm()

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.revaluationTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [orderModel, setOrderModel] = useState(false)
  const [controlleroffset, setControllerOffset] = useState(0)

  const tableColumns = tableHeaderSelector({
    revaluationColumns: columns,
    t,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  useEffect(() => {
    setControllerOffset(values?.offset)
  }, [values?.offset])

  useEffect(() => {
    setControllerOffset(0)
  }, [values?.search])

  const revaluationListFilter = useMemo(() => {
    return {
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
    data: revaluationList,
    isLoading: revaluationListLoading,
    isFetching: isFetchingrevaluationList,
    refetch,
  } = useQuery(['revaluationList', revaluationListFilter], () => requests.getRevaluationList(revaluationListFilter))

  useEffect(() => {
    refetch()
  }, [revaluationListFilter])

  useEffect(() => {
    const count = revaluationList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [revaluationList?.data, values?.limit])

  const { data: statusCountList, refetch: fetchStatusCountList } = useQuery(['revaluationStatusCountList', values?.search, revaluationListFilter], () =>
    requests.getChnagePriceCount(revaluationListFilter)
  )
  return (
    <LoadingContainer readyState={true}>
      <FormProvider {...methods}>
        <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
          <HeaderWithDashboardWrapper title={'Переоценка'} component={<ChangePriceDashboard data={get(statusCountList, 'data.data', 0)} />} />

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
                <InputSearch id='producrs-search' name='search' placeholder={'Номер автозаказа, Аптека'} uncontrolled />
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
              <CheckAccess id={'create-revaluation'}>
                <Box minWidth={156}>
                  <Button sx={{ height: '48px' }} type='submit' onClick={() => setOrderModel(true)} fullWidth variant='contained' color='primary'>
                    Новая переоценка
                  </Button>
                </Box>
              </CheckAccess>
            </Box>
          </Box>
          <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
          <CreateRevaluation refetch={refetch} open={orderModel} setOpen={setOrderModel} />
          <Box>
            <AgGridTable
              id='revaluation-main-table'
              tableSettings
              columns={tableColumns}
              data={revaluationList?.data?.data?.data || []}
              totalCount={revaluationList?.data?.data?._meta?.total_count || 0}
              isDataLoading={isFetchingrevaluationList || revaluationListLoading}
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
              isRefreshing={loading || isFetchingrevaluationList || revaluationListLoading}
            />
          </Box>
        </Box>

        <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      </FormProvider>
    </LoadingContainer>
  )
}
