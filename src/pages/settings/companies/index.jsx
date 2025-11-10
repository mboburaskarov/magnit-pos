import { Box, Button, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import AgGridTable from '@components/AgGridTable/AgGridTable'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import InputSearch from '@components/Inputs/InputSearch'
import LoadingContainer from '@components/LoadingContainer'
import { requests } from '@utils/requests'
import PlusIcon from '@icons/PlusIcon'
import { useQueryParams } from '@hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/companiesTableColumns'
import CompanyDrawer from './CompanyDrawer'
import tableHeaderSelector from './tableHeaderSelector'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import CheckAccess from '@components/CheckAccess'

export default function CompaniesPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.companiesTableColumns)
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [openCompanyDrawer, setOpenCompanyDrawer] = useState(false)

  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    setOpenCompanyDrawer,
    values,
  })

  useEffect(() => {
    if (tableColumns) {
      const formattedData = makeFormattedData({ tableColumns })
      dispatch(changeColumnSequence(formattedData))
    }
  }, [])

  const companiesListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
    }
  }, [values?.offset, values?.limit, values?.search])

  const {
    data: companiesList,
    isLoading: companiesListLoading,
    isFetching: isFetchingcompaniesList,
    refetch,
  } = useQuery(['companiesList', companiesListFilter], () => requests.getAllCompanies(companiesListFilter))

  useEffect(() => {
    refetch()
  }, [companiesListFilter])

  useEffect(() => {
    const count = companiesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [companiesList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Компании
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
              <InputSearch id='producrs-search' name='search' placeholder={'Поиск по таблице'} uncontrolled />
            </Box>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <ColumnsFilterButtonForAll
                title={t('ag_grid.table_setting.label')}
                columns={tableColumns}
                isCatalog={false}
                changeColumnSequence={changeColumnSequence}
                resetTableHeader={resetTableHeader}
              />
            </Box>
            <CheckAccess id={'company:create'}>
              <Box minWidth={156}>
                <Button
                  sx={{ height: '48px' }}
                  onClick={() => setOpenCompanyDrawer({ mode: 'create' })}
                  fullWidth
                  startIcon={<PlusIcon color='#fff' />}
                  variant='contained'
                  color='primary'
                >
                  {t('button.add_new.text')}
                </Button>
              </Box>
            </CheckAccess>
          </Box>
        </Box>
        <Box>
          <AgGridTable
            id='companies-table'
            tableSettings
            columns={tableColumns}
            emptyTableText={{
              title: 'Компании недоступен',
              description: 'Если вы не можете найти искомый Компании, нажмите кнопку «Создать» и введите необходимую информацию.',
            }}
            data={companiesList?.data?.data?.data || []}
            totalCount={companiesList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingcompaniesList || companiesListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingcompaniesList || companiesListLoading}
          />
        </Box>
      </Box>

      <CompanyDrawer refetchCompanyList={refetch} openDrawer={openCompanyDrawer} closeDrawer={() => setOpenCompanyDrawer(false)} />
    </LoadingContainer>
  )
}
