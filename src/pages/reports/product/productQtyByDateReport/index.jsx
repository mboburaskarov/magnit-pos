import { changeColumnSequence, resetTableHeader, updateTableHeader } from '@/redux-toolkit/tableSlices/ostatokByDateTableColumns'
import ColumnsFilterButtonForAll from '@components/AgGridTable/ColumnsFilterButtonForAll'
import { makeFormattedData } from '@utils/helper/makeFormattedTableData'
import AgGridTable from '@components/AgGridTable/AgGridTableSelectable'
import LoadingContainer from '@components/LoadingContainer'
import InputSearch from '@components/Inputs/InputSearch'
import { FormProvider, useForm } from 'react-hook-form'
import { Box, Button, Typography } from '@mui/material'
import { useQueryParams } from '@hooks/useQueryParams'
import { useDispatch, useSelector } from 'react-redux'
import StyledTooltip from '@components/StyledTooltip'
import { useEffect, useMemo, useState } from 'react'
import CheckAccess from '@components/CheckAccess'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LeftArrowIcon from '@icons/LeftArrow'
import { requests } from '@utils/requests'
import { useTheme } from '@mui/styles'
import { useMutation, useQuery } from 'react-query'
import { get } from 'lodash'
import dayjs from 'dayjs'

import tableHeaderSelector from './tableHeaderSelector'
import LazySelect from '@components/Select/LazySelect'
import InputDatePicker from '@components/Inputs/InputDatePicker'
import { downloadLinkExcel } from '@utils/downloadLinkEXCEL'
import { error } from '@utils/toast'

export default function ProductsPage() {
  const methods = useForm()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { columns, loading } = useSelector((state) => state.ostatokByDateTableColumns)
  const { values } = useQueryParams()
  const user_data = useSelector((state) => state.user)
  const [orderStoring, setOrderStoring] = useState({ position: 0, colId: '' })

  const [offsetCount, setOffsetCount] = useState(0)
  const [controlleroffset, setControllerOffset] = useState(0)

  const tableColumns = tableHeaderSelector({
    productsColumns: columns,
    t,
    values,
    editable: true,
    setOrderStoring,
    orderStoring,
  })
  const routeString = []

  user_data?.role_actions?.forEach((item) => {
    if (item.type == 'TABLE') {
      routeString.push(item.route)
    }
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
  const { data: shopList, isFetched: isShopListFetched } = useQuery('shopList', () => requests.getAllStores({ limit: 100, offset: 0 }))

  const productsListFilter = useMemo(() => {
    return {
      date: dayjs(methods.getValues('date')).format('YYYY-MM-DD') || dayjs(new Date()).format('YYYY-MM-DD'),
      limit: values?.limit || 10,
      search: values?.search,
      offset: controlleroffset || 0,
      store_id: methods.getValues('store_id')?.value || get(shopList, 'data.data.data.0.id'),
    }
  }, [shopList, controlleroffset, orderStoring, values?.limit, values?.search, methods.watch('store_id'), methods.watch('date')])
  const {
    data: productsList,
    isLoading: productsListLoading,
    isFetching: isFetchingproductsList,
    refetch,
  } = useQuery(['productsList', productsListFilter], () => requests.getOstatokByDateReport(productsListFilter))

  useEffect(() => {
    refetch()
  }, [productsListFilter])

  useEffect(() => {
    const count = productsList?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limit))
    setOffsetCount(offsetsCount || 0)
  }, [productsList?.data, values?.limit])
  const { mutate: getOstatokByDateReportExcel, isLoading: isGetOstatokByDateReportExcel } = useMutation(requests.getOstatokByDateReportExcel, {
    onSuccess: ({ data }) => {
      downloadLinkExcel(get(data, 'data.file_name'))
    },
    onError: (err) => {
      console.error(err)

      error('Ошибка при скачать excel!')
    },
  })
  return (
    <LoadingContainer readyState={true}>
      <FormProvider {...methods}>
        <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => navigate(`/reports/product`)}
            >
              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  padding: '0',
                  display: 'flex',
                  mr: '20px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: 'bunker.100',
                  '&:hover': {
                    backgroundColor: 'gray.10',
                  },
                }}
              >
                <LeftArrowIcon />
              </Box>
              <Typography
                onClick={() => navigate('/products/all-by-import')}
                variant='h1'
                fontWeight={700}
                fontSize={'28px'}
                lineHeight={'40px'}
                color={'balck'}
              >
                Остаток на дату по аптекам
              </Typography>
            </Box>
          </Box>

          <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
            <Box width='100%' display={'flex'}>
              <Box
                width='100%'
                sx={{
                  '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
                  '& .MuiFormControl-root, .MuiFormControl-root:hover': {
                    background: 'transparent',
                    height: 48,
                  },
                }}
              >
                <InputSearch fullWidth id='producrs-search' name='search' placeholder={'Наименование продукта'} uncontrolled />
              </Box>
              <Box display={'flex'} alignItems={'center'} minWidth={'500px'} ml={'10px'}>
                <LazySelect
                  slug='users'
                  boxStyle={{ width: '100%' }}
                  id='store'
                  name='store_id'
                  isMulti={false}
                  placeholder={t('Выберите Аптека')}
                  minWidth='auto'
                  defaultValue={{ name: get(shopList, 'data.data.data.0.name'), value: get(shopList, 'data.data.data.0.id') }}
                  isClearable={false}
                  required
                  // label={t('input.store.label')}
                  request={requests.getAllStores}
                  filters={{ limit: 10 }}
                  control={methods.control}
                  getOptionLabel={(option) => {
                    return option.name
                  }}
                  filterOption={() => true}
                />
                <Box width={'20px'} />
                <InputDatePicker required defaultValue={new Date()} name='date' id='date' noMarginTop showYearDropdown placeholder='Дата' />
              </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'}>
              <CheckAccess id={'products-all-table'}>
                <Box>
                  <StyledTooltip title={'Настройки таблица'}>
                    <ColumnsFilterButtonForAll
                      title={t('ag_grid.table_setting.label')}
                      columns={tableColumns}
                      isCatalog={false}
                      routeString={routeString}
                      resetTableHeader={resetTableHeader}
                      changeColumnSequence={changeColumnSequence}
                    />
                  </StyledTooltip>
                </Box>
              </CheckAccess>
            </Box>
          </Box>
          <Box>
            <AgGridTable
              fullDownload={() => getOstatokByDateReportExcel({ ...productsListFilter, offset: 0, limit: 1000000 })}
              downloadByFilter={() => getOstatokByDateReportExcel(productsListFilter)}
              isDownloading={isGetOstatokByDateReportExcel}
              id='products-main-table'
              alwaysShowHorizontalScroll={true}
              tableSettings
              canCellClick={true}
              uniqId='product_id'
              enableFillHandle={true}
              columns={tableColumns}
              data={productsList?.data?.data?.data || []}
              totalCount={productsList?.data?.data?._meta?.total_count || 0}
              isDataLoading={isFetchingproductsList || productsListLoading}
              offsetCount={offsetCount}
              updaterAction={(newData) => {
                if (newData) dispatch(updateTableHeader(newData))
              }}
              fullInfoAboutCurrentPage
              resetTable={() => dispatch(resetTableHeader({ refetch }))}
              status={'ALL'}
              isRefreshing={loading || isFetchingproductsList || productsListLoading}
            />
          </Box>
        </Box>
      </FormProvider>
    </LoadingContainer>
  )
}
