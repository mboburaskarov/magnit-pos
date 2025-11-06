import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/cashBoxShiftsTableColumns';
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll';
import { makeFormattedData } from '@utils/helper/makeFormattedTableData';
import AgGridTable from '@components/AgGridTable/AgGridTable';
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL';
import LoadingContainer from '@components/LoadingContainer';
import InputSearch from '@components/Inputs/InputSearch';
import { Box, Button, Typography } from '@mui/material';
import { useQueryParams } from '@hooks/useQueryParams';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import FilterMenuIcon from '@icons/FilterMenuIcon';
import CheckAccess from '@components/CheckAccess';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { requests } from '@utils/requests';
import { useTheme } from '@mui/styles';
import { error } from '@utils/toast';

import tableHeaderSelector from './tableHeaderSelector';
import MiniDashboard from './miniDashboard';
import FilterMenu from './FilterMenu';


const SELECTION_ID = 'checkboxSelectionField'

export default function CasShiftsPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.cashBoxShiftsTableColumns)
  const { values } = useQueryParams()
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

  const cashShiftsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      store_id: values?.store_id,
      cashbox_id: values?.cashbox_id,
    }
  }, [values?.offset, values?.limit, values?.search, values?.cashbox_id, values?.store_id])

  const {
    data: cashShiftsList,
    isLoading: cashShiftsListLoading,
    isFetching: isFetchingcashShiftsList,
    refetch,
  } = useQuery(['cashShiftsList', cashShiftsListFilter], () => requests.getCashBoxShiftsList(cashShiftsListFilter))

  useEffect(() => {
    refetch()
  }, [cashShiftsListFilter])

  useEffect(() => {
    const count = cashShiftsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [cashShiftsList?.data, values?.limit])

  const { mutate: allSalesExcelReport, isLoading: isallSalesExcelReport } = useMutation(requests.getAllSalesExcelReport, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })

  const { data: cashShiftStat } = useQuery(['cashShiftStat', cashShiftsListFilter], () => requests.getCashBoxShiftsStat(cashShiftsListFilter))

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Кассовые смены
        </Typography>
        <MiniDashboard cashShiftStat={cashShiftStat} />
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
            <CheckAccess id={'product-create'}>
              <Box minWidth={156}>
                <Button sx={{ height: '48px' }} onClick={() => navigate('/sales/cash-shift-history')} fullWidth variant='contained' color='primary'>
                  История смен
                </Button>
              </Box>
            </CheckAccess>
          </Box>
        </Box>
        <FilterMenu open={filterMenu} setOpen={setFilterMenu} />
        <Box>
          <AgGridTable
            id='products-main-table'
            downloadByFilter={() => allSalesExcelReport(cashShiftsListFilter)}
            fullDownload={() => allSalesExcelReport({ ...cashShiftsListFilter, offset: 0, limit: 1000000 })}
            isDownloading={isallSalesExcelReport}
            tableSettings
            columns={tableColumns}
            data={cashShiftsList?.data?.data?.data || []}
            totalCount={cashShiftsList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingcashShiftsList || cashShiftsListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            emptyTableText={{
              title: 'Cмены недоступен',
              description: '...',
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingcashShiftsList || cashShiftsListLoading}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
