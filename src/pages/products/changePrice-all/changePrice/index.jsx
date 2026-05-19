import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/changePriceTableColumns'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import CheckAccess from '@components/CheckAccess'
import HeaderWithDashboardWrapper from '@components/HeaderWithDashboard'
import ImageGallery from '@components/ImageGallery'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { useQueryParams } from '@hooks/useQueryParams'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import { requests } from '@utils/requests'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import ChangePriceDashboard from './changePriceDashboard'
import CreateRevaluation from './createRevaluation'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
import { error } from '@utils/toast'
import MgPageHeader from '@components/MgPageHeader'

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
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(false)

  const { mutate: revaluationListExcelReport, isLoading: isrevaluationListExcelReport } = useMutation(requests.getRevaluationListExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)
      error('Ошибка при скачать excel!')
    },
  })

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
        <Box display='flex' flexDirection='column' position='relative' px={'24px'} pb={'20px'}>
          <MgPageHeader
            title='Переоценка'
            subtitle={`Всего: ${new Intl.NumberFormat('ru-UZ').format(revaluationList?.data?.data?._meta?.total_count || 0)}`}
            showStatsToggle
            isOpenStats={isOpenStatDashboard}
            onStatsToggle={() => setIsOpenStatDashboard((p) => !p)}
            showCreate
            onCreate={() => setOrderModel(true)}
            createLabel='Создать'
            createPermissionId='create-revaluation'
          />

          {isOpenStatDashboard && <ChangePriceDashboard data={get(statusCountList, 'data.data', 0)} />}

          <div className='mg-table-card' style={{ marginTop: '12px' }}>
            {/* Toolbar block matching table-toolbar exactly */}
            <div
              className='mg-table-toolbar'
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--mg-border)' }}
            >
              <div className='mg-table-toolbar-left' style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                {/* Search field Box */}
                <Box
                  width='100%'
                  maxWidth={400}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '40px',
                      border: '1px solid #ECEDF2',
                      borderRadius: '12px',
                      bgcolor: '#fff',
                      px: '12px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                      background: 'transparent',
                      width: '100%',
                      height: '40px',
                    },
                  }}
                >
                  <InputSearch id='producrs-search' name='search' uncontrolled placeholder={'Номер переоценки, аптека'} />
                </Box>
              </div>

              <div className='mg-table-toolbar-right' style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Filter button */}
                <button
                  type='button'
                  className={`mg-btn mg-btn-secondary ${filterMenu ? 'active' : ''}`}
                  onClick={() => setFilterMenu((prev) => !prev)}
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #ECEDF2',
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#111217',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <FilterMenuIcon color='#111217' />
                  <span style={{ fontSize: '14px' }}>{t('filter_dialog.label')}</span>
                </button>

                <ColumnsFilterButtonForAll
                  title={t('ag_grid.table_setting.label')}
                  columns={tableColumns}
                  isCatalog={false}
                  resetTableHeader={resetTableHeader}
                  changeColumnSequence={changeColumnSequence}
                />
              </div>
            </div>

            <Box style={{ padding: 0 }}>
              <AgGridTable
                downloadByFilter={() => revaluationListExcelReport(revaluationListFilter)}
                fullDownload={() => revaluationListExcelReport({ ...revaluationListFilter, offset: 0, limit: 1000000 })}
                isDownloading={isrevaluationListExcelReport}
                id='revaluation-main-table'
                tableSettings
                defaultOffsetIndex={Number(values?.offset / values?.limit + 1 || 1)}
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
          </div>
        </Box>

        <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
      </FormProvider>
    </LoadingContainer>
  )
}
