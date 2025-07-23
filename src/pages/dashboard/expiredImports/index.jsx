import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ImageGallery from '../../../../components/ImageGallery'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/expiredImportsTableColumns'
import tableHeaderSelector from './tableHeaderSelector'

import { get } from 'lodash'
import { downloadLinkExcel } from '../../../../utils/downloadLinkEXCEL'
const SELECTION_ID = 'checkboxSelectionField'

export default function ImportPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.expiredImportsTableColumns)
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

  const importsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,

      store_id: values?.store_id,
      start_date: values?.start_date,
      end_date: values?.end_date == values?.start_date ? null : values?.end_date,
      status: values?.status,
      import_date: values?.import_date,
      received_amount_to: values?.received_amount_to,
      received_amount_from: values?.received_amount_from,
    }
  }, [
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
  } = useQuery(['importsList', importsListFilter], () => requests.getAllExpiredImports(importsListFilter))

  useEffect(() => {
    refetch()
  }, [importsListFilter])

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
      console.log(err)

      error('Ошибка при скачать excel!')
    },
  })
  const { data: statusCountList, refetch: fetchStatusCountList } = useQuery(['statusCountList', values?.search, importsListFilter], () =>
    requests.getImportStatusCount(importsListFilter)
  )
  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} mb={'20px'} color={'balck'}>
          {t('Просроченные импорт')}
        </Typography>

        <Box>
          <AgGridTable
            id='imports-main-table'
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
        </Box>
      </Box>

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
    </LoadingContainer>
  )
}
