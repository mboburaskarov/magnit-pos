import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import ImageGallery from '@components/ImageGallery'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { requests } from '@utils/requests'
import { error } from '@utils/toast'
import FilterMenuIcon from '@icons/FilterMenuIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/importsTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
import CreateImport from './createImport'

import { get } from 'lodash'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import ImportDashboard from './importantDashboard'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import thousandDivider from '@utils/thousandDivider'
import MgPageHeader from '@components/MgPageHeader'
import MgTabs from '@components/MgTabs'

export default function ImportPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.importsTableColumns)
  const { values } = useQueryParams()

  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openCreateImportModal, setOpenCreateImportModal] = useState(false)
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(false)
  const [appType, setAppType] = useState('ALL')

  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const importsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : appType === 'ALL' ? values?.offset || 0 : 0,
      search: values?.search,
      store_id: values?.store_id,
      start_date: values?.start_date ? values?.start_date + 'T00:00:00+05:00' : values?.start_date,
      end_date:
        values?.end_date && values?.end_date == values?.start_date
          ? values?.end_date + 'T23:59:59+05:00'
          : values?.end_date
            ? values?.end_date + 'T23:59:59+05:00'
            : undefined,
      status: appType === 'ALL' ? values?.status : appType,
      import_date: values?.import_date,
      received_amount_to: values?.received_amount_to,
      received_amount_from: values?.received_amount_from,
    }
  }, [
    appType,
    values?.offset,
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
    data: importsList,
    isLoading: importsListLoading,
    isFetching: isFetchingimportsList,
    refetch,
  } = useQuery(['importsList', importsListFilter], () => requests.getAllImports(importsListFilter))

  useEffect(() => {
    const count = importsList?.data?.data?._meta?.total_count
    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [importsList?.data, values?.limit])

  const { mutate: importsExcelReport, isLoading: isimportsExcelReport } = useMutation(requests.getImportsExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)
      error('Ошибка при скачать excel!')
    },
  })

  const { data: getImportStatusCount } = useQuery(['getImportStatusCount', values?.search, importsListFilter], () =>
    requests.getImportStatusCount(importsListFilter),
  )

  const handleTabChange = (type) => {
    setAppType(type)
    navigate(`/products/import?offset=0&limit=${values?.limit || 10}`)
  }

  const totalImportsCount = importsList?.data?.data?._meta?.total_count || 0

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' px={'24px'} pb={'20px'}>
        {/* Redesigned Premium Page Header Block */}
        <MgPageHeader
          title='Импорт'
          subtitle={`Всего: ${totalImportsCount}`}
          showStatsToggle
          isOpenStats={isOpenStatDashboard}
          onStatsToggle={() => setIsOpenStatDashboard((p) => !p)}
          showExport
          onExport={() => importsExcelReport(importsListFilter)}
          exportLoading={isimportsExcelReport}
          showCreate
          onCreate={() => setOpenCreateImportModal(true)}
          createLabel='Создать'
        />

        {/* Dashboard Section */}
        {isOpenStatDashboard && (
          <Box mb='24px' sx={{ animation: 'slideDown 0.3s ease' }}>
            <ImportDashboard data={get(getImportStatusCount, 'data.data', 0)} />
          </Box>
        )}

        {/* Redesigned Table Card wrapper to contain Tabs, Toolbar, and Table */}
        <div className='mg-table-card' style={{ marginTop: '12px' }}>
          {/* Tabs container using reusable MgTabs component */}
          <MgTabs
            activeTab={appType}
            onChange={handleTabChange}
            tabs={[
              {
                value: 'ALL',
                title: 'Все',
                count: totalImportsCount,
              },
              {
                value: 'new',
                title: 'Новый',
                count: appType === 'new' ? totalImportsCount : 0,
              },
              {
                value: 'completed',
                title: 'Завершенный',
                count: appType === 'completed' ? totalImportsCount : 0,
              },
            ]}
          />

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
                <InputSearch id='imports-search' name='search' placeholder={'Импортный номер, наименование'} uncontrolled />
              </Box>
            </div>

            {/* Toolbar block right containing filter and settings */}
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

          {/* Ag Grid Table component wrapped inside padded container */}
          <div style={{ padding: '0px' }}>
            <AgGridTable
              id='imports-main-table'
              fullDownload={() => importsExcelReport({ ...importsListFilter, offset: 0, limit: 1000000 })}
              downloadByFilter={() => importsExcelReport(importsListFilter)}
              isDownloading={isimportsExcelReport}
              tableSettings
              columns={tableColumns}
              defaultOffsetIndex={Number(values?.offset / values?.limit + 1 || 1)}
              data={importsList?.data?.data?.data || []}
              totalCount={importsList?.data?.data?._meta?.total_count || 0}
              isDataLoading={isFetchingimportsList || importsListLoading}
              offsetCount={offsetCount}
              updaterAction={(newData) => {
                if (newData) dispatch(updateTableHeader(newData))
              }}
              emptyTableText={{
                title: 'Импорт недоступен',
                description: 'Если вы не можете найти искомый Импорт',
              }}
              fullInfoAboutCurrentPage
              resetTable={() => dispatch(resetTableHeader({ refetch }))}
              isRefreshing={loading || isFetchingimportsList || importsListLoading}
            />
          </div>
        </div>
      </Box>

      <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
      <CreateImport open={openCreateImportModal} setOpen={setOpenCreateImportModal} refetch={refetch} />
      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
    </LoadingContainer>
  )
}
