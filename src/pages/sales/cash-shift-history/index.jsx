import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/cashBoxShiftHistoryTableColumns';
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll';
import { makeFormattedData } from '@utils/helper/makeFormattedTableData';
import AgGridTable from '@components/AgGridTable/AgGridTable';
import LoadingContainer from '@components/LoadingContainer';
import InputSearch from '@components/Inputs/InputSearch';
import { Box, Button, Typography } from '@mui/material';
import { useQueryParams } from '@hooks/useQueryParams';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import FilterMenuIcon from '@icons/FilterMenuIcon';
import { useTranslation } from 'react-i18next';
import { requests } from '@utils/requests';
import { useTheme } from '@mui/styles';
import { useQuery } from 'react-query';

import tableHeaderSelector from './tableHeaderSelector';
import FilterMenu from './FilterMenu';


export default function CashShiftHistoryPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.cashBoxShiftHistoryTableColumns)
  const { values } = useQueryParams()
  const [regions, setRegions] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [filterMenu, setFilterMenu] = useState(false)
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    values,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })

      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const cashShiftHistoryListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      store_id: values?.store_id,
      cashbox_id: values?.cashbox_id,
    }
  }, [values?.offset, values?.limit, values?.search, values?.cashbox_id, values?.store_id])
  const {
    data: cashShiftHistoryList,
    isLoading: cashShiftHistoryListLoading,
    isFetching: isFetchingcashShiftHistoryList,
    refetch,
  } = useQuery(['cashShiftHistoryList', cashShiftHistoryListFilter], () => requests.getCashBoxShiftsHistoryList(cashShiftHistoryListFilter))

  useEffect(() => {
    refetch()
  }, [cashShiftHistoryListFilter])

  useEffect(() => {
    const count = cashShiftHistoryList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [cashShiftHistoryList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          История смен
        </Typography>
        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <Box display={'flex'}>
            <Box
              sx={{
                '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                  background: 'transparent',
                  width: '400px',
                  height: 48,
                },
              }}
            >
              <InputSearch fullWidth id='producrs-search' name='search' placeholder={'ID, Филиал'} uncontrolled />
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
            <Box width={'20px'} />
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
            id='products-main-table'
            downloadByFilter={() => {}}
            fullDownload={() => {}}
            isDownloading={false}
            tableSettings
            columns={tableColumns}
            data={cashShiftHistoryList?.data?.data?.data || []}
            totalCount={cashShiftHistoryList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingcashShiftHistoryList || cashShiftHistoryListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            emptyTableText={{
              title: 'Cмен недоступен',
              description: '...',
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingcashShiftHistoryList || cashShiftHistoryListLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
