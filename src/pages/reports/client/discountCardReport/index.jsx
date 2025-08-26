import { Box, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import AgGridTable from '../../../../../components/AgGridTable/AgGridTable'
import Header from '../../../../../components/Header'
import InputSearch from '../../../../../components/Inputs/InputSearch'
import LoadingContainer from '../../../../../components/LoadingContainer'
import { requests } from '../../../../../utils/requests'
import thousandDivider from '../../../../../utils/thousandDivider'
import { useQueryParams } from '../../../../hooks/useQueryParams'

export default function DiscountCardReport({ id }) {
  const { values } = useQueryParams()
  const [offsetCount, setOffsetCount] = useState(0)
  const navigate = useNavigate()
  const productHistoryFilter = useMemo(() => {
    return {
      limit: values?.limitHistory || 5,
      store_id: values?.store_id,
      offset: values?.offsetHistory || 0,
      search: values?.search,
    }
  }, [values?.limitHistory, values?.offsetHistory, values?.search])

  const {
    data: productDataHistory,
    isLoading: isproductDataLoadingHistory,
    isFetching: isFetchingproductDataHistory,
    refetch,
  } = useQuery(['productDataHistory', productHistoryFilter], () => requests.getDiscountCartReport(productHistoryFilter, id))

  useEffect(() => {
    const count = productDataHistory?.data?.data?._meta?.total_count

    const offsetsCount = Math.ceil(count / Number(values?.limitHistory || 0))

    setOffsetCount(offsetsCount || 0)
  }, [productDataHistory?.data, values?.limitHistory])

  useEffect(() => {
    refetch()
  }, [productHistoryFilter])

  const columns = useMemo(
    () => [
      {
        headerName: 'APTEKA',
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
        headerName: 'Клиенти',
        colId: 'customer_name',
        minWidth: 300,
        maxWidth: 300,
        width: 300,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.customer_name}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Количество',
        colId: 'check_count',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.check_count}</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Скидка',
        colId: 'percent',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{data?.percent}%</Typography>
          </Box>
        ),
      },
      {
        headerName: 'Общая сумма',
        colId: 'total_without_discount',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{thousandDivider(data?.total_without_discount, 'сум')} </Typography>
          </Box>
        ),
      },
      {
        headerName: 'Сумма скидки',
        colId: 'total_discount',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{thousandDivider(data?.total_discount, 'сум')} </Typography>
          </Box>
        ),
      },
      {
        headerName: 'Окончательная сумма',
        colId: 'total_with_discount',
        minWidth: 185,
        maxWidth: 185,
        width: 185,
        cellRenderer: ({ data, rowIndex }) => (
          <Box id={`${'created_at'}-${rowIndex}`} whiteSpace='pre-wrap'>
            <Typography>{thousandDivider(data?.total_with_discount, 'сум')}</Typography>
          </Box>
        ),
      },
    ],
    []
  )

  const formattedData = productDataHistory?.data?.data?.data

  return (
    <LoadingContainer readyState={true}>
      <Header noActions isLoading={false} backIcon backHref='/reports/client' text={'Отчёт: Карта лояльности'} />
      <Box display='flex' mx={'auto'} flexDirection='column' position='relative' pt={'0px'} px={'50px'} pb={'20px'}>
        <Box
          width='100%'
          sx={{
            mb: '20px',
            '& .MuiInputBase-root': { height: 48, borderColor: 'transparent' },
            '& .MuiFormControl-root, .MuiFormControl-root:hover': {
              background: 'transparent',
              width: '400px',
              height: 48,
            },
          }}
        >
          <InputSearch fullWidth={true} id='producrs-search' name='search' placeholder={'Магазин, наименование'} uncontrolled />
        </Box>
        <Box columnGap={2} mb={'16px'} display='flex' justifyContent={'space-between'} mt={'16px'} width='100%'>
          <AgGridTable
            isDataLoading={isproductDataLoadingHistory || isFetchingproductDataHistory}
            offsetQuery='offsetHistory'
            limitQuery='limitHistory'
            id='products-history-table'
            totalCount={productDataHistory?.data?.data?._meta?.total_count || 0}
            columns={columns}
            data={formattedData}
            offsetCount={offsetCount}
            defaultOffsetSize={5}
          />
        </Box>
      </Box>
    </LoadingContainer>
  )
}
