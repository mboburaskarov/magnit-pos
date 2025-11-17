import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/writeOffWithCheckingTableColumns'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import Header from '@components/Header'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { useQueryParams } from '@hooks/useQueryParams'
import ArrowDown from '@icons/ArrowDown'
import ArrowUp from '@icons/ArrowUp'
import BarcodeIcon from '@icons/BarcodeIcon'
import { Box, Container, Typography } from '@mui/material'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import { requests } from '@utils/requests'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import tableHeaderSelector from './tableHeaderSelector'
import WriteOffDashboard from './writeOffDashboard'

export default function WriteOffCompletedPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { id } = useParams()
  const { columns, loading } = useSelector((state) => state.writeOffWithCheckingColumns)
  const { values } = useQueryParams()
  const [isOpenStatDashboard, setIsOpenStatDashboard] = useState(true)
  const [barcode, setBarcode] = useState('')
  const methods = useForm()
  const [offsetCount, setOffsetCount] = useState(0)

  const tableColumns = tableHeaderSelector({
    importsColumns: columns,
    values,
  })
  const WriteOffWithCheckingDetailsFilter = useMemo(() => {
    return {
      writeoff_id: id,
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: barcode,
    }
  }, [id])

  const { data: getWriteOffDashBoard } = useQuery(['getWriteOffDashBoard', id], () => requests.getWriteOffDashBoard(id))

  const {
    data: WriteOffWithCheckingDetails,
    isLoading: WriteOffWithCheckingDetailsLoading,
    isFetching: isFetchingWriteOffWithCheckingDetails,
    refetch,
  } = useQuery(['WriteOffWithCheckingDetails', WriteOffWithCheckingDetailsFilter], () => requests.getWriteOffDetails(WriteOffWithCheckingDetailsFilter))

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [WriteOffWithCheckingDetailsFilter])

  useEffect(() => {
    const count = WriteOffWithCheckingDetails?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)

    get(WriteOffWithCheckingDetails, 'data.data.data', []).map((importData) => {
      methods.setValue(`scanned_quantity_${get(importData, 'id')}`, get(importData, 'scanned_count'))
    })
  }, [WriteOffWithCheckingDetails?.data, values?.limit])

  return (
    <LoadingContainer readyState={!WriteOffWithCheckingDetailsLoading}>
      <FormProvider {...methods}>
        <Header isLoading={false} backIcon noActions backHref='/products/write-off' text={'Списание с проверкой'} checkAccessId={'product-create'} />

        <Container>
          <Box
            sx={{
              m: ' 0 0 20px',
              userSelect: 'none !important',
              cursor: 'pointer',
              '& > p': {
                cursor: 'pointer',
                userSelect: 'none !important',
              },
            }}
            display={'flex'}
            onClick={() => setIsOpenStatDashboard((p) => !p)}
          >
            {isOpenStatDashboard ? <ArrowUp color='#111217' /> : <ArrowDown />}
            <Typography sx={{ fontWeight: '600', whiteSpace: 'pre' }}>{isOpenStatDashboard ? 'Скрыть статистику' : 'Показать статистику'}</Typography>
          </Box>
          {isOpenStatDashboard && <WriteOffDashboard data={get(getWriteOffDashBoard, 'data.data')} />}

          <Box display='flex' flexDirection='column' position='relative' pt={'24px'} pb={'20px'}>
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
                    onChange={({ target }) => setBarcode(get(target, 'value'))}
                    id='producrs-search'
                    name='search'
                    value={barcode}
                    setSearchTerm={setBarcode}
                    placeholder={t('input.search.product.multi')}
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

            <Box sx={{ '& .MuiTextField-root': { bgcolor: 'transparent !important' } }}>
              <AgGridTable
                id='imports-main-table'
                tableSettings
                columns={tableColumns}
                defaultOffsetIndex={Number(values?.offset / values?.limit + 1 || 1)}
                data={WriteOffWithCheckingDetails?.data?.data?.data || []}
                totalCount={WriteOffWithCheckingDetails?.data?.data?._meta?.total_count || 0}
                isDataLoading={isFetchingWriteOffWithCheckingDetails || WriteOffWithCheckingDetailsLoading}
                offsetCount={offsetCount}
                updaterAction={(newData) => {
                  if (newData) dispatch(updateTableHeader(newData))
                }}
                emptyTableText={{
                  title: 'Списание недоступен',
                  description: 'Если вы не можете найти искомый Списание, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
                }}
                fullInfoAboutCurrentPage
                resetTable={() => dispatch(resetTableHeader({ refetch }))}
                status={'ALL'}
                isRefreshing={loading || isFetchingWriteOffWithCheckingDetails || WriteOffWithCheckingDetailsLoading}
              />
            </Box>
          </Box>
        </Container>
      </FormProvider>
    </LoadingContainer>
  )
}
