import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import ImageGallery from '../../../../components/ImageGallery'
import InputSearch from '../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../components/LoadingContainer'
import { requests } from '../../../../utils/requests'
import { error, success } from '../../../../utils/toast'
import BigTickIcon from '../../../assets/icons/BigTickIcon'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { changeColumnSequence, resetTableHeader, updateTableHeader } from '../../../redux-toolkit/tableSlices/salesTableColumns'
import FilterMenu from './FilterMenu'
import tableHeaderSelector from './tableHeaderSelector'
import { useTheme } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import ColumnsFilterButtonForAll from '../../../../components/AgGridTable/ColumnsFilterButtonForAll'
import StyledDialog from '../../../../components/Dialogs/StyledDialog'
import FilterMenuIcon from '../../../assets/icons/FilterMenuIcon'
import SaleDrawer from './saleDrawer'
import DateRangeInput from '../../../../components/Inputs/DateRangeInput.jsx/DateRangeInput'
import dayjs from 'dayjs'
const SELECTION_ID = 'checkboxSelectionField'

export default function AllSalesPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { columns, loading } = useSelector((state) => state.salesTableColumns)
  const { values } = useQueryParams()
  const [regions, setRegions] = useState([])
  const [offsetCount, setOffsetCount] = useState(0)
  const [openImageGallery, setOpenImageGallery] = useState(false)
  const [filterMenu, setFilterMenu] = useState(false)
  const [openSaleDrawer, setOpenSaleDrawer] = useState(false)
  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    setImages: setOpenImageGallery,
    setOpenSaleDrawer,
  })

  /// filter table columns with permission
  useEffect(() => {
    if (tableColumns) {
      const formattedData = tableColumns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID && el.field !== 'category')
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

  const salesListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.search ? 0 : values?.offset || 0,
      search: values?.search,
      regions: regions?.length ? regions?.map((item) => item?._id) : undefined,
      store_id: values?.store_id,
      category_id: values?.category_id,
      producer: values?.producer,
      payment_type_id: values?.payment_type_id,
      vendor_id: values?.vendor_id,
      employee_id: values?.employee_id,

      total_amount_to: values?.total_amount_to,
      total_amount_from: values?.total_amount_from,
      start_date: values?.start_date || dayjs(new Date()).format('YYYY-MM-DD'),
      end_date: values?.start_date == values?.end_date ? null : values?.end_date,
    }
  }, [
    values?.offset,
    values?.limit,
    values?.search,
    values?.payment_type_id,
    values?.producer,
    values?.employee_id,
    values?.category_id,
    values?.vendor_id,
    values?.store_id,
    values?.total_amount_to,
    values?.total_amount_from,
    values?.start_date,
    values?.end_date,
  ])
  const {
    data: salesList,
    isLoading: salesListLoading,
    isFetching: isFetchingsalesList,
    refetch,
  } = useQuery(['salesList', salesListFilter], () => requests.getAllSales(salesListFilter))

  useEffect(() => {
    refetch()
  }, [salesListFilter])

  useEffect(() => {
    const count = salesList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [salesList?.data, values?.limit])

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
        <Typography variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          {t('sales')}
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
              <InputSearch id='producrs-search' name='search' placeholder={'ID, Филиал'} uncontrolled />
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
            <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('DD.MM.YYYY') }} id='accounting-report-date-range' />
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
            tableSettings
            columns={tableColumns}
            data={salesList?.data?.data?.data || []}
            totalCount={salesList?.data?.data?._meta?.total_count || 0}
            isDataLoading={isFetchingsalesList || salesListLoading}
            offsetCount={offsetCount}
            updaterAction={(newData) => {
              if (newData) dispatch(updateTableHeader(newData))
            }}
            fullInfoAboutCurrentPage
            emptyTableText={{
              title: 'Продажи недоступен',
              description: 'Если вы не можете найти искомый Продажи, нажмите кнопку «Добавить новый» и введите необходимую информацию.',
            }}
            resetTable={() => dispatch(resetTableHeader({ refetch }))}
            isRefreshing={loading || isFetchingsalesList || salesListLoading}
          />
        </Box>
      </Box>
      <SaleDrawer open={openSaleDrawer} setOpen={setOpenSaleDrawer} />

      <ImageGallery open={openImageGallery} setOpen={setOpenImageGallery} imagesArr={openImageGallery.data} />
    </LoadingContainer>
  )
}
