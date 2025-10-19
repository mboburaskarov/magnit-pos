import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { t } from 'i18next'
import { get } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import DateRangeInput from '../../../../../components/Inputs/DateRangeInput/DateRangeInput'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import MultiOptionSelectNew from '../../../../../components/Select/MultiOptionSelectNew'
import { requests } from '../../../../../utils/requests'
import { useQueryParams } from '../../../../hooks/useQueryParams'

export default function RemainingStockPage({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const [selectedShops, setSelectedShops] = useState('all')

  const navigate = useNavigate()
  const productHistoryFilter = useMemo(() => {
    const ready_start_date = dayjs(`${values?.start_date} ${values?.from_time}`)
    const ready_end_date = dayjs(`${values?.end_date} ${values?.to_time}:59`)
    return {
      start_date: values?.start_date && values?.from_time ? ready_start_date.format() : dayjs(new Date()).format('YYYY-MM-DDT00:00:00+05:00'),
      end_date:
        values?.end_date && values?.to_time
          ? ready_start_date?.isSame(ready_end_date)
            ? dayjs(`${values?.start_date} 23:59:59`).format()
            : ready_end_date.format()
          : null,
      limit: values?.limitHistory || 5,
      store_id: selectedShops == 'all' ? undefined : selectedShops?.id,
      offset: values?.offsetHistory || 0,
      search: values?.search,
    }
  }, [values?.limitHistory, selectedShops, values?.offsetHistory, values?.search, values?.from_time, values?.to_time, values?.start_date, values?.end_date])

  const {
    data: allProducts,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingallProducts,
    refetch,
  } = useQuery(['remainingstockallProducts', productHistoryFilter], () => requests.getAllProducts(productHistoryFilter, id))
  const { data: shopList } = useQuery('shopList', () => requests.getAllStores({ limit: 20, offset: 0 }))

  useEffect(() => {
    const count = allProducts?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [allProducts?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'Aптека',
        colId: 'store_name',
        minWidth: 300,
        maxWidth: 300,
        width: 300,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.store_name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Наименование',
        colId: 'name',
        minWidth: 300,
        flex: 1,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Кол-во',
        colId: 'count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.units}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Баркод',
        colId: 'rejected_times',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.barcode}</Typography>
          </Box>
        ),
      },
    ],
    []
  )

  const formattedData = allProducts?.data?.data?.data

  return (
    <Box display='flex' flexDirection='column' position='relative' pt={'24px'} px={'20px'} pb={'20px'}>
      <Box display={'flex'} mb={'10px'} justifyContent={'space-between'}>
        <Typography onClick={() => navigate('/products/all-by-import')} variant='h1' fontWeight={700} fontSize={'28px'} lineHeight={'40px'} color={'balck'}>
          Товары с отказом
        </Typography>
      </Box>
      <Box
        width='100%'
        sx={{
          mb: '20px',
          display: 'flex',
          '& .MuiBox-root': {
            width: 'auto',
          },
          '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
          '& .MuiFormControl-root, .MuiFormControl-root:hover': {
            background: 'transparent',
            width: '400px',
            height: 48,
          },
        }}
      >
        <InputSearch fullWidth={false} id='producrs-search' name='search' placeholder={'Наименование'} uncontrolled />

        <Box ml={2} mr={2}>
          <MultiOptionSelectNew
            zIndex={999}
            placeholder={t('placeholders.select_shops')}
            multiple={false}
            defaultSelectedAll
            beforeContent={t('placeholders.select_shops')}
            value={selectedShops}
            allOptions={get(shopList, 'data.data.ids', [])}
            selectAllLabel={'Все филиалы'}
            options={get(shopList, 'data.data.data', [])}
            isLoading={false}
            onChange={(val) => {
              setSelectedShops(val)
            }}
            request={requests.getAllStores}
          />
        </Box>
        <DateRangeInput defaultFilterData={{ label: 'Сегодня', start_date: dayjs(new Date()).format('YYYY-MM-DD') }} id='accounting-report-date-range' />
      </Box>
      <Box>
        <AgGridTable
          isDataLoading={isproductDataLoadingHistory || isFetchingallProducts}
          offsetQuery='offsetHistory'
          limitQuery='limitHistory'
          id='products-history-table'
          totalCount={allProducts?.data?.data?._meta?.total_count || 0}
          columns={columns}
          data={formattedData}
          offsetCount={offsetCount}
          defaultOffsetSize={5}
        />
      </Box>
    </Box>
  )
}
